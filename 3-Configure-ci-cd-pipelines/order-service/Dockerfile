FROM openjdk:17
ARG targetFolder=target
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
COPY ${targetFolder}/order-service-0-SNAPSHOT.jar order-service.jar
EXPOSE 9000
CMD ["java", "-jar", "order-service.jar", "--server.port=9000"]