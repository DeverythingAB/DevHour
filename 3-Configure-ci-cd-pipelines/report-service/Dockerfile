FROM openjdk:17
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
COPY target/report-service-0-SNAPSHOT.jar report-service.jar
EXPOSE 9020
CMD ["java", "-jar", "report-service.jar", "--server.port=9020"]