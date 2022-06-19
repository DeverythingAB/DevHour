#!/bin/bash

docker build -t order-service ./order-service --build-arg version=$1
docker build -t product-service ./product-service --build-arg version=$1
docker build -t report-service ./report-service --build-arg version=$1
