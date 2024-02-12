# build environment
FROM node:lts-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY .env ./
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-frc.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]  