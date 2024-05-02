import mongoose from "mongoose"

export const DB_Connection = () => {
    mongoose.connect(process.env.CONNECTION_URL_LOCAL)
        .then(() => {
            console.log("Connected to DB")
        })
        .catch((err) => {
            console.log('error in DB_Connection', err)
        })

}