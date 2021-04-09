FROM ubuntu:latest
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y mysql-server
RUN mkdir /app
WORKDIR /app
RUN mkdir Frontend
COPY ./Frontend/src Frontend/src
COPY ./Frontend/package.json Frontend/
COPY ./Frontend/package-lock.json Frontend/
COPY ./Frontend/.babelrc Frontend/
COPY ./Frontend/.eslintrc.json Frontend/
COPY ./Frontend/webpack.config.js Frontend/
WORKDIR /app/Frontend
RUN npm install
RUN npm run build-prod
RUN rm -rf node_modules/
RUN rm -rf src/
RUN rm -rf webpack.config.js
WORKDIR /app
RUN mkdir Backend
COPY ./Backend/server.js Backend/
COPY ./Backend/qlresolver.js Backend/
COPY ./Backend/database.js Backend/
COPY ./Backend/models Backend/models
COPY ./Backend/api.gql Backend/
COPY ./Backend/schema.sql Backend/
COPY ./Backend/package.json Backend/
COPY ./Backend/package-lock.json Backend/
COPY ./Backend/mysql-setup.sql Backend/
WORKDIR /app/Backend
RUN npm install
WORKDIR /app
COPY ./run.sh .
EXPOSE 8080
CMD ["/bin/sh", "run.sh"]
