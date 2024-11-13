FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install
RUN npm audit fix || echo "Some vulnerabilities require manual fixes"

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
