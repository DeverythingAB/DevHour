#!/bin/bash

docker build -t order-service ./order-service
docker build -t product-service ./product-service
docker build -t report-service ./report-service
