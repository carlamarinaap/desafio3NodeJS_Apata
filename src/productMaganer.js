const fs = require('fs').promises;
class ProductManager {
  constructor(ruta) {
    this.path = ruta,
    this.#id = 0
  }

  #id;

  getProducts = async () =>  {
    try {
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    } 
    catch (error) {
      await fs.writeFile(this.path, '[]');
      let colectionJSON = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(colectionJSON)
    }
  } 

  addProduct = async (product) => {
    try {
      let {title, description, price, thumbnail, code, stock} = product
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log(`El producto debe tener todos los campos completos`);
      }
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.some((prod) => prod.code === code)
      if (exists) {
        console.log(`Ya existe un producto con el código ${code}`);
      } else {
        if(!product.id){
          product.id = this.#id;
        }
        colectionJSON.push({...product})
        await fs.writeFile(this.path, JSON.stringify(colectionJSON))
        console.log(`Se agregó el producto "${product.title}" a la colección`);
        this.#id = this.#id + 1
      }
    }
    catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`)
    }
  }

  getProductById = async(productId) =>  {
    let colectionJSON = await this.getProducts();
    let exists = colectionJSON.find((prod) => prod.id === productId)
    if (exists) {
      return exists
    } else {
      return `Not found id: ${productId}`
    }
  }
  
  updateProduct = async(productId, campo, valor) => {
    let colectionJSON = await this.getProducts();
    let exists = colectionJSON.find((prod) => prod.id === productId)
    if (exists) {
      exists[campo] = valor
      await this.deleteProduct(productId)
      await this.addProduct(exists)
    } else {
      console.log(`Not found id: ${productId}`);
      return `Not found id: ${productId}`
    }
  }

  deleteProduct = async (productId) => {
    try {
      let colectionJSON = await this.getProducts();
      if (colectionJSON.find((prod) => prod.id === productId)) {
        let newArray = colectionJSON.filter((prod) => prod.id !== productId)
        await fs.writeFile(this.path, JSON.stringify(newArray))
        console.log(`Se eliminó el producto con id: ${productId}:`);
        console.log(colectionJSON.find((prod) => prod.id === productId));
      } else {
        console.log(`No se encontró el producto con id: ${productId}`);
      }
    }
    catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`)
    }
  }
}
module.exports = ProductManager