FROM openjdk:17
ENV APP_HOME=/usr/app
ARG version=0
WORKDIR $APP_HOME
COPY target/order-service-${version}.jar order-service.jar
EXPOSE 9000
CMD ["java", "-jar", "order-service.jar", "--server.port=9000"]