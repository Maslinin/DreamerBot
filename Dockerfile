FROM node:18.20.4

ENV WORK_FOLDER='/usr/DreamerBot'

WORKDIR ${WORK_FOLDER}
COPY ["package.json", "bun.lockb", "tsconfig.json", "./"]
COPY src ./src

RUN npm install -g bun
RUN bun install
COPY . .

EXPOSE 3000

CMD ["bun", "run", "./src/index.ts"]