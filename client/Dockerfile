FROM maven:3.6.3-jdk-11-slim
COPY pom.xml /usr/local/pom.xml
COPY src /usr/local/src
WORKDIR /usr/local
RUN mvn clean install
CMD ["java", "-cp", "target/client-1.0-SNAPSHOT.jar","Main"]

