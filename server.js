const express = require("express");
const bodyParser = require("body-parser");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
