const express = require('express');
const ProductManager = require('./ProductManager.js');
const productManager = new ProductManager();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if(limit){
        return res.send(products.splice(0, limit));
    }

    res.send(products);
});
// Url: http://localhost:8080/products 

app.get('/products/:productCode', async (req, res) => {
    const productCode = req.params.productCode;
    const productSearched = await productManager.getProductById(productCode);
    if(productSearched === undefined){
        return res.status(404).send();
    }

    res.send(productSearched);
});
// Urls: http://localhost:8080/products/abc123
// http://localhost:8080/products/abc124

app.listen(8080, () => console.log("Server is ready in port 8080"));
