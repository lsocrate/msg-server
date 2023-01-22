# MSG SERVER

This project is set to use Node 18 and NPM. For managing Node Versions, [Volta](https://volta.sh/) is recommended. We also require a Postgres server.

A few environment variables are required, for running in dev mode you can use a `.env` file. Create a copy for you based on `.env.template`.

```
# Install the dependencies with NPM
npm install

# Prepare your database
npm run migrate
```
