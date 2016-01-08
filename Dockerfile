FROM nodesource/jessie:4

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY package.json /srv/www/
COPY bower.json /srv/www/
COPY . /srv/www/

RUN npm install
RUN npm install -g pm2
RUN /srv/www/node_modules/.bin/bower install --allow-root

RUN apt-get -qq autoremove -y --purge
RUN rm -rf ~/.node-gyp
RUN rm -rf ~/.npm

EXPOSE 3030

CMD /srv/www/start.sh


