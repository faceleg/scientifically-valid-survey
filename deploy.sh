#!/bin/bash

set -e

ENVIRONMENT=$1

echo ""
echo "Installing awscli"
sudo pip install --upgrade docker-py\<1.2 requests\<2.7 awscli

BRANCH=`echo ${CIRCLE_BRANCH//\//_}`
TAG="svs-$ENVIRONMENT-$BRANCH-$CIRCLE_BUILD_NUM"

echo ""
echo "Building initial image"
docker build -t "svs:$TAG-layered" .

echo ""
echo "Saving initial image to disk"
docker save "svs:$TAG-layered" > layered.tar

echo ""
echo "Squashing image"
sudo docker-squash -i layered.tar -o squashed.tar -t "svs:$TAG"

echo ""
echo "Loading squashed image"
cat squashed.tar | docker load

echo ""
echo "Pushing squashed image"
docker push "svs:$TAG"

echo ""
echo "Creating deployment Dockerrun.aws.json file"
DOCKERRUN_FILE="$TAG-Dockerrun.aws.json"
sed "s/<TAG>/$TAG/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE

echo ""
echo "Uploading deployement Dockerrun.aws.json to S3"
EB_BUCKET=elasticbeanstalk-ap-southeast-2-717094888728
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE \
  --region ap-southeast-2

echo ""
echo "Creating application version"
aws elasticbeanstalk create-application-version \
  --application-name "${ENVIRONMENT}-svs" \
  --version-label $TAG \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE \
  --region ap-southeast-2

echo ""
echo "Updating environment"
# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
  --environment-name "${ENVIRONMENT}-svs" \
  --version-label $TAG \
  --region ap-southeast-2

