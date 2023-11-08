# Getting Started

## Requirements

- node.js (> 18.17.0)
- golang (created with v1.21)
- mongodb

## Back-end

### Development

- Insert your ``.env`` file in `/` having ``MONGODB_URI``
- Run the server instance for development:

```go
go mod tidy
go run main.go
```

### Build

To build go app, run

```go
go build -o quizbe.pkg
```

To run the built go app, run

```sh
./quizbe.pkg
```

## Front-end

### Development

- Insert your ``.env.local`` file in ``web/`` directory
- Install the dependencies:

```sh
cd web
npm install
```

- Run the development server:

```sh
npm run dev
```

### Build

To build the next app, run

```sh
npm run build
```

To start the built app, run

```sh
npm start
```