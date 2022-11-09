docker stop dreamerbot || true && docker rm dreamerbot || true 

docker build -t dreamerbot .
docker run -d --name dreamerbot dreamerbot
