FROM --platform=linux/amd64 node:18

ENV DATABASE_URL="DATABASE_URL"
ENV JWT_SECRET="JWT_SECRET"
ENV USER_SERVICE_URL="USER_SERVICE_URL"
ENV ORDER_SERVICE_URL="ORDER_SERVICE_URL"

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

EXPOSE 3004

CMD yarn prisma migrate dev && yarn dev