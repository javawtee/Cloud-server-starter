FROM node:15

RUN apt-get update

# add source codes to image
WORKDIR /server
ADD . .

RUN npm install
# persist node_modules
VOLUME /server/node_modules

CMD npm start