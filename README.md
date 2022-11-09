[![Build](https://github.com/Maslinin/DreamerBot/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/Maslinin/DreamerBot/actions/workflows/build.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Maslinin_DreamerBot&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Maslinin_DreamerBot) [![GitHub license](https://badgen.net/github/license/Maslinin/DreamerBot)](https://github.com/Maslinin/DreamerBot/blob/master/LICENSE)

# DreamerBot
Discord bot for real dreamers.

## Build and Deploy of a bot in a Docker Container

### Build
To build a docker image, enter the following command from the command line interface, while being in the root folder of the project:
```
docker build -t dreamerbot .
```

### Deploy
To deploy an image in a Docker container, type the following command:
```
docker run -d --name dreamerbot dreamerbot
```

### Build and deploy simultaneously
Run ```Deployer.sh```: this script will delete the existing running Docker container with the bot if it exists and will re-build and deploy the Docker container.