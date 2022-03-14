FROM openjdk:17
ENV APP_HOME=/usr/app
ARG version=0
WORKDIR $APP_HOME
COPY target/report-service-${version}.jar report-service.jar
EXPOSE 9020
CMD ["java", "-jar", "report-service.jar", "--server.port=9020"]