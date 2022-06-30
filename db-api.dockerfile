FROM node:14-alpine

# Copy over the main files
RUN mkdir -p /usr/src/app
COPY ./db-api /usr/src/app/
WORKDIR /usr/src/app

# Install local packages
COPY ./db-model /usr/src/db-model

RUN npm install
CMD [ "node", "src/endpoints.js" ]