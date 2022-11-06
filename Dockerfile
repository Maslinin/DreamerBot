FROM node:lts-alpine

ENV NODE_ENV=production
ENV WORK_FOLDER='/usr/DreamerBot'

WORKDIR ${WORK_FOLDER}
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
COPY src ./src

RUN npm install
RUN npm install -g typescript
RUN npm run build
COPY . .

CMD ["node", "./dist/index" ]
