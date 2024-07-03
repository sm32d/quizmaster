# QuizMaster

<img width="1436" alt="image" src="https://github.com/sm32d/quizmaster/assets/64636803/439108b6-3ce1-4078-afce-a911b514ded2">
<img width="1436" alt="image" src="https://github.com/sm32d/quizmaster/assets/64636803/b3dd613f-c1df-4cdd-a613-a9a42dde21aa">

> Detailed docs [here](https://github.com/sm32d/quizmaster/wiki)

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
yarn
```

- Run the development server:

```sh
yarn dev
```

### Build

To build the next app, run

```sh
yarn build
```

To start the built app, run

```sh
yarn start
```

### A/B Features

- New Navbar
- Quiz Details Page
- Dashboard Table Quiz Toggle
