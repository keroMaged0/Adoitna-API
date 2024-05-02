// to catch error
process.on('uncaughtException', ((err) =>
    console.log('error', err)
))


import * as routers from "./Modules/index.routes.js"

import { globalResponse } from "./Middleware/global-response.middleware.js"
import { rollbackDocumentMiddleware } from "./Middleware/rollback_documents.middleware.js"
import { rollbackMiddleware } from "./Middleware/rollback_upload_file.middleware copy.js"

export const initiateApp = (app, express) => {

    app.use(express.json())

    // router api
    app.use(`${process.env.BASE_Route}/Auth`, routers.authRouter)
    app.use(`${process.env.BASE_Route}/User`, routers.userRouter)
    app.use(`${process.env.BASE_Route}/Category`, routers.categoryRouter)
    app.use(`${process.env.BASE_Route}/Medicine`, routers.medicineRouter)
    // !not found end point
    app.use('*', (req, res, next) => {
        // next(new appError(`not found end point: ${req.originalUrl}`, 404))
        res.json({ message: "message not found " })
    })

    // global Error
    app.use(globalResponse, rollbackMiddleware, rollbackDocumentMiddleware)

    // to catch error
    process.on('unhandledRejection', (err =>
        console.log('error', err)
    ))

}