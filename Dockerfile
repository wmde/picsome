ARG build=prod
FROM node:16-alpine3.12 as base
ENV BUILD_ENV=${build}
ENV PROJECT_ROOT=/srv
ENV NODE_PATH=$PROJECT_ROOT/src
ENV PATH=$PROJECT_ROOT/node_modules/.bin:$PATH
RUN apk add --no-cache make gcc g++ python3 libtool autoconf automake vim
EXPOSE 3000

WORKDIR $PROJECT_ROOT

COPY package.json package-lock.json ./

RUN chown -R node:node $PROJECT_ROOT
USER node
# --prooduction=false is needed to install devDependencies to build the app
# these will be cleaned afterwards
RUN npm install --prooduction=false

COPY --chown=node:node . .

# We support two different build paths
# by default we do the production build
# See line 1
# if we pass -build-arg build=dev- then we use the dev version as final
# setting DOCKER_BUILDKIT=1 befor building or using buildx will omit non relevant builds

# EITHER
FROM base AS build-prod
RUN echo "BUILDING Production Version"
ENV NODE_ENV=production
RUN blitz prisma generate
RUN blitz prisma migrate
#RUN blitz db seed
RUN blitz build
#RUN npm prune --production
#RUN npm cache clean --force
# blitz start

# OR
# FROM base AS build-dev
# RUN echo "BUILDING DEV Verson"
# ENV NODE_ENV=development
# CMD npm i && prisma generate && blitz dev

#Finally
FROM build-${build} AS final
#FROM build-dev AS final
