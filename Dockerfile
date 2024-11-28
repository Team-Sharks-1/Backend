FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install -g npm@latest
RUN npm install jsonwebtoken --save && npm install

# RUN npm audit fix || echo "Some vulnerabilities require manual fixes"

COPY . .

EXPOSE 3001
CMD ["node", "index.js"]
