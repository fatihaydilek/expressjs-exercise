
# Welcome!

  

## Data Models

  

>  **All models are defined in src/model.js**

  

### Profile

A profile can be either a `client` or a `contractor`.

clients create contracts with contractors. contractor does jobs for clients and get paid.

Each profile has a balance property.

  

### Contract

A contract between and client and a contractor.

Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`

Contracts group jobs within them.

  

### Job

contractor get paid for jobs by clients under a certain contract.

  

## Getting Set Up

  

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

  

  

1. Start by cloning this repository.

  

  

1. In the repo root directory, run `npm install` to gather all dependencies.

  

  

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

  

  

1. Then run `npm start` which should start both the server and the React client.

  
  
  

## Missing

 - Complete testing (unit/integration)
 - Complete openapi doc.
 - Dockerize, write infra code and deploy
 - Replace custom sql scripts.