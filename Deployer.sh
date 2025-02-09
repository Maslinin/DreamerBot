docker rm -f dreamerbot || true

docker build --no-cache -t dreamerbot .
docker run -d --restart=always --name dreamerbot dreamerbot
