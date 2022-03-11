FROM openjdk:17
ARG targetFolder=target
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
COPY ${targetFolder}/product-service-0-SNAPSHOT.jar product-service.jar
EXPOSE 9010
CMD ["java", "-jar", "product-service.jar", "--server.port=9010"]