FROM openjdk:17
ARG targetFolder=target
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
COPY ${targetFolder}/report-service-0-SNAPSHOT.jar report-service.jar
EXPOSE 9020
CMD ["java", "-jar", "report-service.jar", "--server.port=9020"]