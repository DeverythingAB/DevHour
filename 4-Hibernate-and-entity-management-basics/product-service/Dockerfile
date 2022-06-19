FROM openjdk:17
ENV APP_HOME=/usr/app
ARG version=0
WORKDIR $APP_HOME
COPY target/product-service-${version}.jar product-service.jar
EXPOSE 9010
CMD ["java", "-jar", "product-service.jar", "--server.port=9010"]