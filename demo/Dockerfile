### Builder Docker Image ###
FROM node:16-alpine as builder

# Configure the working directory.
WORKDIR /usr/src/app

# Copy all the source code into `/usr/src/app` and make `node` as the owner.
COPY --chown=node:node . /usr/src/app

# For building uWebsockets.js binary on Alpine.
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

# Install dependencies.
RUN npm ci

# Build the project.
RUN ./app build

### Runner Docker Image ###
FROM node:16-alpine

# Configure the environment variables.
ENV NODE_ENV=production

# Configure the working directory.
WORKDIR /usr/src/app

# Copy app, configs, dist and package*.json.
COPY --from=builder --chown=node:node /usr/src/app/app /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/configs ./configs
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

# For NodeJS app to handle SIGINT as explained in https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals.
RUN apk add --no-cache tini

# For building uWebsockets.js binary on Alpine.
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

# Only install dependencies without devDependencies due to `NODE_ENV=production`.
RUN npm ci

# Switch to `node` user to run the API server.
USER node

# Refer to https://github.com/krallin/tini for what it is about.
ENTRYPOINT ["/sbin/tini", "--"]

# Start our application server.
CMD ["./app", "server"]
