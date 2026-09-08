FROM alpine/git As clone
WORKDIR /providers
RUN git clone https://github.com/Just-ARandomGuy/WeGoAppKeyCloakSPI
RUN git clone https://github.com/Just-ARandomGuy/keycloakify-mui-starter

FROM maven:3.9.8-eclipse-temurin-21 AS spi-build
WORKDIR /build
COPY --from=clone /providers/WeGoAppKeyCloakSPI/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B
COPY --from=clone /providers/WeGoAppKeyCloakSPI/ ./
RUN mvn clean package -Dmaven.test.skip=true

FROM node:20 AS theme-build
WORKDIR /build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
COPY --from=clone providers/keycloakify-mui-starter/package.json ./
COPY --from=clone providers/keycloakify-mui-starter/package-lock.json ./
RUN npm ci
COPY --from=clone providers/keycloakify-mui-starter/ ./
RUN npm run build-keycloak-theme

FROM quay.io/keycloak/keycloak:26.5.6
COPY --from=spi-build --chown=keycloak:keycloak /build/target/*.jar /opt/keycloak/providers/
COPY --from=theme-build --chown=keycloak:keycloak /build/dist_keycloak/*.jar /opt/keycloak/providers/
RUN touch -m --date=@1743465600 /opt/keycloak/providers/*
COPY --chown=keycloak:keycloak import/ /opt/keycloak/data/import/
RUN /opt/keycloak/bin/kc.sh build
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]