docker stop dreamerbot || true && docker rm dreamerbot || true 

docker build -t dreamerbot .
docker run -d --restart=always --name dreamerbot dreamerbot
