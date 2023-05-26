class Producto {
  sku;
  nombre;
  categoria;
  precio;
  stock;

  constructor(sku, nombre, precio, categoria, stock = 10) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }
}

const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

class Carrito {
  productos = [];
  categorias = [];
  precioTotal = 0;

  constructor() {
    this.productos;
    this.categorias;
    this.precioTotal;
  }
  async agregarProducto(sku, cant) {
    console.log(`Consultando por: ${sku}, cantidad: ${cant}...`);
    try {
      const foundProd = await findProductBySku(sku);
      //
      if (foundProd) {
        console.log(`Producto encontrado! ${foundProd.nombre}`);
        const nuevoProd = new ProductoEnCarrito(
          sku,
          foundProd.nombre,
          cant,
          foundProd.precio
        );
        const consulta = this.productos.find((prod) => prod.sku === sku);
        if (!consulta) {
          this.productos.push(nuevoProd);
          this.precioTotal += foundProd.precio * cant;
          if (!this.categorias.includes(foundProd.categoria)) {
            this.categorias.push(foundProd.categoria);
          }
        } else {
          const consultaIndex = this.productos.findIndex(
            (prod) => prod.sku === sku
          );
          this.precioTotal += foundProd.precio * cant;
          this.productos[consultaIndex].cantidad += cant;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  eliminarProducto(sku, cant) {
    return new Promise((resolve, reject) => {
      const prodElim = this.productos.find((prod) => prod.sku === sku);
      if (prodElim) {
        if (cant < prodElim.cantidad) {
          prodElim.cantidad -= cant;
          this.precioTotal -= cant * prodElim.precio;
          resolve(`Se eliminan ${cant} unidad/es de ${prodElim.nombre}`);
        } else if (cant >= prodElim.cantidad) {
          const prodElimIndex = this.productos.indexOf(prodElim.sku);
          delete this.productos[prodElimIndex];
          this.precioTotal -= prodElim.cantidad * prodElim.precio;
          resolve(`Se elimina ${prodElim.nombre} del carrito`);
        }
      } else {
        reject("El producto a eliminar NO se encuentra en el carrito");
      }
    });
  }
}
class ProductoEnCarrito {
  sku;
  nombre;
  cantidad;
  precio;

  constructor(sku, nombre, cantidad, precio) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
  }
}

function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`SKU: ${sku} No encontrado`);
      }
    }, 1500);
  });
}

const mi_carrito = new Carrito();
console.log(mi_carrito);

mi_carrito.agregarProducto("UI999TY", 1);
mi_carrito.agregarProducto("KS944RUR", 2);
mi_carrito.agregarProducto("RT324GD", 1);
mi_carrito.agregarProducto("UI999TY", 3);
mi_carrito.agregarProducto("RT324XX", 2);
mi_carrito.agregarProducto("XX92LKI", 1);
mi_carrito.agregarProducto("PV332MJ", 1);
mi_carrito.agregarProducto("OL883YE", 1);
mi_carrito.agregarProducto("FN312PPE", 1);

setTimeout(() => {
  mi_carrito
    .eliminarProducto("UI999TY", 3)
    .then((msg) => {
      console.log(msg);
    })
    .catch(() => {
      console.error(msg);
    })
    .finally(() => {
      console.log("Precio total $" + mi_carrito.precioTotal);
    });
}, 3000);
