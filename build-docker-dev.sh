#!/bin/sh

git pull;
sudo docker stop service-id-fms-01-backoffice-fe;
sudo docker rm service-id-fms-01-backoffice-fe;
sudo docker image rm "hayman/service-id-fms-01-backoffice-fe:latest"
sudo docker build -f ./Dockerfile-dev -t "hayman/service-id-fms-01-backoffice-fe:latest" .
sudo docker run -d --restart=unless-stopped --network=dev1 -p8082:80 --name=service-id-fms-01-backoffice-fe "hayman/service-id-fms-01-backoffice-fe:latest"
