echo "Removing old container if it exists..."
if [ "$(docker ps -aq -f name=^dreamerbot$)" ]; then
    docker rm -f dreamerbot
    echo "Old container removed."
else
    echo "No existing container found."
fi

echo "Building image..."
docker build --no-cache -t dreamerbot .

echo "Running container..."
docker run -d --restart=always --name dreamerbot dreamerbot

echo "The container has been successfully run"
