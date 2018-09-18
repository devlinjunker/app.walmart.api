# Walmart REST API

Uses Hapi.js to create server that connects to the Walmart API and establishes endpoints for passing search terms and retrieving product IDs related to those keywords, retrieved using the API.

Based on this gist: https://gist.github.com/daniyalzade/8e32cd266aebd6d2ce35

Walmart API Docs: https://developer.walmartlabs.com/docs


## Commands

`npm run build` to build latest version in `dist/latest` directory (Lints and Typechecks with Flow first, then compiled by Babel)

`npm run clean` to remove latest build directory in `dist/`

`npm run start` to run the latest build server from `dist/`

`npm run test` to run unit tests on the files in `src/`

`npm run doc` to generate new sets of documentation
