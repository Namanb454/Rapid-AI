FROM node:latest

workdir /app


COPY . .

RUN npm install --legacy-peer-deps
CMD ["npm", "run", "dev"]