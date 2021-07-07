FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node welcome.js
EXPOSE 4000

