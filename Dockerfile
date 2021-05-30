FROM node:15

RUN apt-get update

# copy source codes to image
WORKDIR /server
COPY ./package.json ./package.json

RUN npm install
# persist node_modules
VOLUME /server/node_modules
EXPOSE 5000

CMD npm start
