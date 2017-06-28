🐄
# Keystone graphql nextjs
Full stack node with NextJs frontend & KeystoneJs backend over GraphQL.

- User Accounts register & login
- Create / delete posts
- Create / delete comments
- Document upload

## Up and running
1. Install the latest [Node.js](https://nodejs.org), [MongoDB](http://www.mongodb.org/downloads) and [Yarn](https://yarnpkg.com/en/docs/install).
2. Inslide `api/` copy `.env.example`, rename it `.env` and customize.
3. Run `yarn` to install root dependencies.
4. Run `yarn install` to install dependencies in child directories.
5. Run `yarn dev` to start dev servers.
6. Visit `localhost:3000` for frontend. `localhost:3001/keystone` for backend

## URLs & Logins
Frontend - `localhost:3000`

Keystone Backend - `localhost:3001/keystone`

Example user - `user@keystonejs.com`

Example password - `password`


## Scripts

| Command               | Purpose                                         |
|:----------------------|:------------------------------------------------|
| `yarn install`        | Installs dependencies in api/ & client/ dirs    |
| `yarn dev`            | api/ & client/ built and run for dev.           |
| `yarn build`          | Builds api/ & client/ for production            |
| `start start`         | Starts api/ & client/ from built bundles        |
