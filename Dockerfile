FROM golang:1.21-alpine3.18
WORKDIR /app
COPY quizbe.pkg /app
CMD ["./quizbe.pkg"]
EXPOSE 3001