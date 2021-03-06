FROM node:lts
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm i && npm run build
CMD [ "node", "dist/main.js" ]
