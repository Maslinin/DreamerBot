FROM node:18.12

ENV WORK_FOLDER='/usr/DreamerBot'

WORKDIR ${WORK_FOLDER}
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY src ./src

RUN npm install npm -g
RUN npm install
RUN npm install -g typescript
RUN npm run build
COPY . .

EXPOSE 3000

CMD ["node", "./dist/index" ]
