import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Elibrary Open API Documentation",
            version: "1.0.0",
            description: "API Documentation",
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/routes/api/**/*.ts"]
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express) => {
    app.use("/documentation/api", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec))
}