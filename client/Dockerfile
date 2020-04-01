### STAGE 1: BUILD ###
FROM maven:3.6.3-jdk-11-slim as build
WORKDIR /usr
COPY ../pom.xml .
COPY . .
RUN mvn clean package

### STAGE 2: RUN ###
FROM maven:3.6.3-jdk-11-slim
COPY --from=build ./usr/target/client-*.jar ./usr
CMD ["java", "-cp", "usr/client-1.0-SNAPSHOT.jar","Main"]
