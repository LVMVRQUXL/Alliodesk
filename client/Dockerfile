### STAGE 1: BUILD ###
FROM maven:3.6.3-jdk-11-slim as build
WORKDIR /usr
COPY . .
RUN mvn clean package

### STAGE 2: RUN ###
FROM openjdk:11-jre-slim
COPY --from=build ./usr/ui/target/client-ui-shaded.jar ./usr
CMD ["java", "-cp", "usr/client-ui-shaded.jar","fr.esgi.pa.alliodesk.ui.Main"]
