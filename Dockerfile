FROM node:18-alpine
COPY . .
RUN npm install
RUN npm run build --production
CMD ["node", "./dist/main.js"]
