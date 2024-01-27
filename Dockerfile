FROM golang:1.21-alpine3.18 AS build
WORKDIR /src
COPY . .
RUN go build -o /app

FROM alpine:3.18
WORKDIR /app
COPY --from=build /app /app
CMD ["./app"]
EXPOSE 3001