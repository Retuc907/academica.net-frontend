# Etapa 1: Compilación (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar el proyecto
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Producción)
FROM nginx:alpine
# Ahora Docker sí entenderá de dónde viene "--from=build"
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]