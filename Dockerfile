FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN npx prisma generate


FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/infrastructure/prisma ./src/infrastructure/prisma
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "build/index.js"]