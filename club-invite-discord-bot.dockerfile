FROM node:14-alpine

# Copy over the main files
RUN mkdir -p /usr/src/app
COPY ./club-invite-bot /usr/src/app/
WORKDIR /usr/src/app

# Install local packages
COPY ./db-model /usr/src/db-model
#RUN npm link /usr/src/db-model

# Done, install everything else
RUN npm install
CMD ["node", "src/main.js"]