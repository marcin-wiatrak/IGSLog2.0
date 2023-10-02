FROM node:16-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

RUN npm install --global pm2

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000
#
#CMD ["npm", "start"]

# Base on offical Node.js Alpine image
#FROM node:alpine

# Set working directory
#WORKDIR /usr/app

# Install PM2 globally

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
#COPY ./package*.json ./

# Install dependencies
#RUN #npm install --production

# Copy all files
#COPY ./ ./

# Build app
#RUN npm run build

# Expose the listening port
#EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
#USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]