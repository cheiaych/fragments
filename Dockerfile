#Instructions for Docker

#Docker image from node version 16.13.2
FROM node:16-alpine3.16@sha256:2175727cef5cad4020cb77c8c101d56ed41d44fbe9b1157c54f820e3d345eab1

LABEL maintainer = "Jordan Hui <jhui19@myseneca.ca>"
LABEL description = "Fragments node.js microservice"

#Default port
ENV PORT = 8080
#Reduce console output from installation within Docker
ENV NPM_CONFIG_LOGLEVEL = warn
#Disable color when running within Docker
ENV NPM_CONFIG_COLOR = false
#Setting env to production mode
ENV NODE_ENV = production

#Use /app as working directory for this set of Docker instructions
WORKDIR /app

#Copies package.json and package-lock.json into curent working directory (/app)
COPY package*.json ./

#Install dependencies from package.json
RUN npm ci --production

#Copy src to /app/src
COPY ./src ./src

#Copying HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

#Start container by running server
CMD npm start

#Running on port 8080
EXPOSE 8080
