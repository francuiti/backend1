const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const productsFilePath = path.join(__dirname, "../data/productos.json");

const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.get("/", (req, res) => {
  const products = readJSONFile(productsFilePath);
  const limit = parseInt(req.query.limit) || products.length;
  res.status(200).json(products.slice(0, limit));
});

// Ruta GET /:pid
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const products = readJSONFile(productsFilePath);
  const product = products.find((p) => p.id === pid);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.status(200).json(product);
});

// Ruta POST /
router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: "Todos los campos son obligatorios excepto thumbnails" });
  }

  const products = readJSONFile(productsFilePath);
  const newProduct = {
    id: `${Date.now()}`,
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails: thumbnails || [],
    status: true,
  };

  products.push(newProduct);
  writeJSONFile(productsFilePath, products);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  const products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex((p) => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const updatedProduct = { ...products[productIndex], ...updates, id: pid };
  products[productIndex] = updatedProduct;
  writeJSONFile(productsFilePath, products);
  res.status(200).json(updatedProduct);
});

router.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  const products = readJSONFile(productsFilePath);
  const filteredProducts = products.filter((p) => p.id !== pid);

  if (products.length === filteredProducts.length) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  writeJSONFile(productsFilePath, filteredProducts);
  res.status(200).json({ message: "Producto eliminado con éxito" });
});

module.exports = router;
