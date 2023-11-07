# Environment Variables (for Dev)

> Note: These files are conventionally not supposed to be committed to source code repository for security purposes. In production environment, these variables are set using the service used to deploy the app.

For both the backend and frontend, there are some values that need to be passed to the add as environment variables. This can be achieved by using a ``.env`` file for go backend and a ``.env.local`` file for next.js front-end.

Find the format of the files below. The app expects all the variables mentioned below.

## Backend

Create ``.env`` file in the root `/` directory of the project with the following contents

```
MONGODB_URI=link to mongodb server
```

Note: for local server, this value is mostly ``mongodb://localhost:27017``

## Frontend

Create ``.env.local`` file in the `/web` directory of the project with the following contents

```
BACKEND_URI=...
NEXTAUTH_SECRET=...
GITHUB_SECRET=...
GITHUB_ID=...
```

### Legend

- *BACKEND_URI* is the link to the backend server. For local development, this project is configured to use ``http://localhost:3001``
- *NEXTAUTH_SECRET* is a randomly generated secret for NextAuthJS using

     ```sh
     openssl rand -base64 32
     ``` 
- *GITHUB_SECRET* and *GITHUB_ID* are provided by GitHub after [creating the oAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) in Github