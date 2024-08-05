FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add sharp --ignore-scripts
RUN npm install --arch=x64 --platform=linux sharp
COPY . .
RUN npx prisma generate
ENV NODE_ENV production
EXPOSE 3000
RUN chmod -R 777 /app/storage
CMD ["yarn", "start"]