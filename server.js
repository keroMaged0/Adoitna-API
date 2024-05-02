// imports
import express from 'express'
import { config } from 'dotenv'
import { DB_Connection } from './DB/db_connection.js'
import { initiateApp } from './src/initiate-app.js'


// config dotenv
config({ path: './config/.env' })

const app = express()

// function to initiate app
initiateApp(app,express)

//connection to database
DB_Connection()

// port 
const port = process.env.PORT || 3100
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
