FROM openjdk:17
ARG targetFolder=target
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
COPY /home/runner/work/DevHour/DevHour/3-Configure-ci-cd-pipelines/staging/order-service-0-SNAPSHOT.jar order-service.jar
EXPOSE 9000
CMD ["java", "-jar", "order-service.jar", "--server.port=9000"]