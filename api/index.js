const userRoutes = require("./users");
const authRoutes = require("./users/auth_routes");
const cardsRoutes = require("./cards");
const paymentRoutes = require("./payment");
const YAML=require("yamljs")
const swaggerUi=require("swagger-ui-express")

const swaggerDocument = YAML.load('docs/swagger.yaml');

exports.startApp = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/users", userRoutes);
    app.use("/auth", authRoutes);
    app.use("/cards", cardsRoutes);
    app.use("/payment", paymentRoutes);
}
