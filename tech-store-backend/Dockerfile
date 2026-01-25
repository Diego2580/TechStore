# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/tech-store-backend-*.jar app.jar
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
# Force prod profile even if env vars are missed by Render
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
