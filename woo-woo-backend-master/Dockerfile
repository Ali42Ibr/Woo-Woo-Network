FROM node:14.14.0-alpine as builder

# choose working dir
WORKDIR "/app"

# copy package and package-log file
COPY ./package*.json ./
RUN npm ci

COPY . .
# build production project
RUN npm run build

# create public files folder
RUN mkdir public
RUN mkdir public/photos


CMD ["npm", "run", "start"]