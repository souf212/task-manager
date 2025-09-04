# Étape 1 : builder le projet
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : image finale
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/task-manager-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
