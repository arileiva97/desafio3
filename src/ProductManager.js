const fs = require('fs');

class ProductManager{

    constructor(){
        this.path = './Products.json';
    }

    static lettersCode = "abc";
    static numbersCode = 123;
    static code = this.lettersCode + this.numbersCode; 

    async addProduct(title, description, price, thumbnail, stock){
        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code: ProductManager.code,
            stock
        };

        try{
            if(!fs.existsSync(this.path)){ 
                const products = [];
                products.push(newProduct);
                this.newCodeSystem();

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }else{ 
                const contentObj = await this.checkProducts();
                const productSearched = contentObj.find((product) => product.title === newProduct.title)
                if(productSearched === undefined){
                    contentObj.push(newProduct);
                    this.newCodeSystem();
                }else{
                    console.error(`The product "${productSearched.title}" already exists (Code ${productSearched.code})`)
                }

                await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
            }
        }catch(error){
            console.log(error);
        }
    }
    
    async checkProducts(){
        const content = await fs.promises.readFile(this.path, 'utf-8'); 
        const contentObj = JSON.parse(content);
        return contentObj;
    }

    async getProducts(){
        try{
            if(!fs.existsSync(this.path)){
                const emptyArray = [];
                await fs.promises.writeFile(this.path, JSON.stringify(emptyArray, null, '\t'));
                return emptyArray;
            }else{
                const contentObj = await this.checkProducts();
                return contentObj;
            }
        }catch(error){
            console.log("No hay productos cargados en el archivo");
            console.log(error);
            return error;
        }
        
    }

    async getProductById(code){
        const contentObj = await this.checkProducts();
        const productSearched = contentObj.find((product) => product.code === code)
        if(productSearched){
            return productSearched;
        }else{
            console.error(`Product (Code ${code}) not found`);
        }
    }

    async updateProduct(code,prop,change){
        const contentObj = await this.checkProducts();
        const productSearched = contentObj.find((product) => product.code === code)
        if(productSearched){
            productSearched[prop] = change;
            await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
        }else{
            console.error(`Product (Code ${code}) not found`);
        }
    }

    async deleteProduct(code){
        const contentObj = await this.checkProducts();
        const indexProductSearched = contentObj.findIndex((product) => product.code === code)
        if(indexProductSearched){
            contentObj.splice(indexProductSearched,1);

            await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
        }else{
            console.error(`Product (Code ${code}) not found`);
        }
    }

    newCodeSystem(){ 
        if(ProductManager.numbersCode <= 999){
            ProductManager.numbersCode++; 
            ProductManager.code = ProductManager.lettersCode + ProductManager.numbersCode;
        }else{
            ProductManager.lettersCode = "abd";
            ProductManager.numbersCode = 100;
            ProductManager.code = ProductManager.lettersCode + ProductManager.numbersCode;
        }
    }
}

module.exports = ProductManager;
