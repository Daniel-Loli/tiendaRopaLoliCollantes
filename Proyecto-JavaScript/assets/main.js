//SWEET ALERT DE INICIO
Swal.fire({//SWEET ALERT DE INICIO PARA QUE SE MUESTRE AL INICIAR LA PAGINA
    title: 'Deseas adquirir algún producto?',
    showDenyButton: true,//boton de negar
    confirmButtonText: 'SI',//boton de confirmar
    denyButtonText: `Ver primero`,//boton de negar
  }).then((result) => {//funcion para que se ejecute al dar click en algun boton
    if (result.isConfirmed) {//si se da click en el boton de confirmar
      document.getElementById("containerTitulo").innerHTML += `
      <div id="containerTitulo" class="container mb-3">
        <h1 id="tituloPrincipal">Elige tu prenda favorita!</h1>
        <div id="orden1">
          <div id="filtroProductos" class="row px-3 gap-10 pt-3"></div> 
        </div>
        <div id="orden2">
          <div id="productosFiltrados" class="row px-8 gap-7 pt-6"></div>
        </div>
      </div>
      <div id="orden3">
        <div id = "containerCarrito">
          <table id="tablaCarrito" class="table">
            <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Quitar</th>
            </tr>
          </table>
        </div>
      </div>
      <div id="totalCarrito" class="estiloTotal" class="alert alert-primary" role="alert"></div>
      <div id="centroBotonFinalizarCompra">
        <button id="Validar" type="submit" class="btn btn-primary">Adquirir productos</button>
      <div>
      `;
      const finalizarCompraBtn = document.getElementById(`Validar`)//boton de finalizar compra
      finalizarCompraBtn.addEventListener('click', () => {//funcion para que se ejecute al dar click en el boton de finalizar compra
        Swal.fire({//sweet alert para confirmar la compra
          title: 'Su compra se ha relizado con exito!!!',
          text: 'Gracias por elegirnos',
          confirmButtonText: 'Ok',
          icon: 'success',
        });
      document.getElementById("containerTitulo").innerHTML += `
      <div id="containerTitulo" class="container mb-3"></div>
      <div id = "containerCarrito"></div>`;
      });
      cargarFiltros();//carga los filtros
      cargarProductosDelLocalStorage(); //carga los productos del local storage
    } else if (result.isDenied) {//si se da click en el boton de negar
      Swal.fire('Bienvenido a Selena´s shopps', '');
    }
  })
class Carrito {//METODOS PARA GUARDAR EN LOCAL STORAGE
    constructor() {//constructor
      this.productosEnElCarrito = []//array de productos en el carrito
      this.total = 0//total del carrito
    }
    agregarAlCarrito (producto) {//agrega al carrito
      const productoPorAgregar = producto//producto por agregar
      // BUSCO EL PRODUCTO EN EL CARRITO 
      const posicionEnElCarrito = this.productosEnElCarrito.findIndex((productoEnElCarrito) => productoEnElCarrito.id === producto.id)//busca el producto en el carrito
      //FIND INDEX DEVUELVE -1 SI NO ENCUENTRA EL PRODUCTO EN EL CARRITO, SI LO ENCUENTRA DEVUELVE LA POSICION DEL PRODUCTO EN EL CARRITO
      if (posicionEnElCarrito === -1) {//si no encuentra el producto en el carrito
        productoPorAgregar.cantidad = 1//cantidad del producto por agregar
        this.productosEnElCarrito.push(producto)//agrega el producto al carrito
      } else {//si encuentra el producto en el carrito
        this.productosEnElCarrito[posicionEnElCarrito].cantidad = this.productosEnElCarrito// [posicionEnElCarrito].cantidad + 1
      }
      this.calcularPrecioTotalMasIva()//calcula el precio total mas iva
    }
    borrarDelCarrito (id) {//borra del carrito
      this.productosEnElCarrito = this.productosEnElCarrito.filter((prodEnElCart) => prodEnElCart.id !== id)//filtra el producto del carrito
      this.calcularPrecioTotalMasIva()//calcula el precio total mas iva
    }
    mostrarCarrito () {//muestra el carrito
      return this.productosEnElCarrito//retorna los productos en el carrito
    }//muestra el carrito
    calcularPrecioTotalMasIva () {//calcula el precio total mas iva
      this.total = this.productosEnElCarrito.reduce((acc, val) => acc + (val.precio * val.cantidad) * 1.21, 0)//calcula el precio total mas iva
      return this.total//retorna el total
    }
  }
  
  class Productos {//METODOS PARA GUARDAR EN LOCAL STORAGE
    constructor() {
      this.productos = []//array de productos
    }
    cargarProducto (producto) {//carga los productos
      // validar si el producto ya existe
      this.productos.push(producto)//agrega el producto al array de productos
    }
  
    mostrarProductos () {//muestra los productos
      return this.productos//retorna los productos
    }
  }
  
  class Producto {//METODOS PARA GUARDAR EN LOCAL STORAGE
    constructor(id, nombre, tipo, precio, cantidad) {
      this.id = id
      this.nombre = nombre
      this.tipo = tipo
      this.precio = precio
      this.cantidad = 1
    }
  }

const carrito = new Carrito()//crea el carrito

const productos = new Productos()//crea los productos


let productosCargadosDelJson = [];//array de productos cargados del json
const agregarProductosALaClase = async () => {//funcion para agregar los productos a la clase

  const productosFetch = await fetch('./assets/productos.json').then(resp => resp.json()).then(data => data)//trae los productos del json
  productosCargadosDelJson = productosFetch;//guardo los productos en una variable global para poder usarla en la funcion de filtrar productos
  productosCargadosDelJson.forEach((producto) => {//recorre los productos
    const nuevoProducto = new Producto(//crea un nuevo producto
      producto.id,
      producto.nombre,
      producto.tipo,
      producto.precio,
      producto.cantidad
    )

    productos.cargarProducto(nuevoProducto)//carga el producto
  })
}
agregarProductosALaClase()//ejecuta la funcion para agregar los productos a la clase




const cargarFiltros = async () => {//funcion para cargar los filtros
    const contenedorFiltros = document.getElementById('filtroProductos')//selecciono el contenedor de los filtros
    const categoriasFetch = await fetch('./assets/categorias.json').then(resp => resp.json()).then(data => data)//trae las categorias del json
  console.log(categoriasFetch)//muestra las categorias en consola
    categoriasFetch.forEach((categoria) => {//recorre las categorias
      const filtro = document.createElement('div')
      filtro.classList.add('card')
      filtro.classList.add('col')
      filtro.style.maxWidth = '600px'
      filtro.id = categoria.id
      filtro.innerHTML = `
      <img
        src=${categoria.imagen}
        class="card-img-top"
        alt="imagen de productos"
      />
      <div class="card-body">
        <h4 style={text-transform:'capitalize'}>${categoria.nombre}</h4>
        <button id="botonCategoria${categoria.nombre}" type="button" class="btn btn-primary">Seleccionar</button>
      </div>
      `
      contenedorFiltros.append(filtro)//agrega los filtros al contenedor de los filtros
      const agregarEventoABoton = document.getElementById(`botonCategoria${categoria.nombre}`)
      agregarEventoABoton.addEventListener('click', () => {//agrega el evento al boton
        mostrarProductosFiltrados(categoria.nombre)//ejecuta la funcion para mostrar los productos filtrados
      })
    })
  }
const mostrarProductosFiltrados = (nombre) => {//funcion para mostrar los productos filtrados
  if (document.getElementById('productosFiltrados').firstChild) {//si hay productos filtrados
    const borrarDiv = document.getElementById('productosFiltrados')//selecciono el div de los productos filtrados
    borrarDiv.innerHTML = ``//borro el div de los productos filtrados
  }

  //FILTRO LOS PRODUCTOS

  const filtrarProductos = productosCargadosDelJson.filter((producto) => producto.tipo === nombre)
  const contenedorProductos = document.getElementById('productosFiltrados')
  for (const producto of filtrarProductos) {//recorre los productos filtrados
    const contenedorCard = document.createElement('div')
    contenedorCard.classList.add('card')
    contenedorCard.classList.add('col')
    contenedorCard.style.maxWidth = '300px'
    contenedorCard.innerHTML = `

      <div class="">
        <div class="col">
          <img src=${producto.imagen} class="img-fluid rounded-start" alt="">
        </div>
        <div>
          <div class="card-body">
            <h5 class="card-title"> ${producto.nombre} </h5>
            <p class="card-text">Breve descripcion del producto a comprar</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            <h3> ${producto.precio} </h3>
            <button id='boton${producto.id}' type="submit" class="btn btn-primary">Agregar al Carrito</button>
          </div>
        </div>
      </div>

    `
    contenedorProductos.append(contenedorCard)//agrega los productos filtrados al contenedor de los productos filtrados
    document.getElementById(`boton${producto.id}`).addEventListener('click', function () {
      agregarCarrito(producto);//ejecuta la funcion para agregar al carrito
      Swal.fire({//muestra un mensaje de que se agrego al carrito
        title: 'Felicitaciones!',
        text: 'Se Agrego el producto al carrito correctamente',
        confirmButtonText: 'Ok',
        icon: 'success',
      });
    })
  }
}
const dibujarCarrito = () => {//funcion para dibujar el carrito
  const contenedorCarrito = document.getElementById('tablaCarrito')//selecciono el contenedor del carrito
  if (!contenedorCarrito) return;//si no hay contenedor del carrito, no hace nada
  contenedorCarrito.innerHTML = ''
  contenedorCarrito.innerHTML = `
    <tr>
    <th>ID</th>
    <th>Nombre</th>
    <th>Precio</th>
    <th>Cantidad</th>
    <th>Quitar</th>
    </tr>
  `
  carrito.mostrarCarrito().forEach((prodEnElCarrito) => {//recorre el carrito 
    contenedorCarrito.innerHTML += `
    <tr>
      <th>${prodEnElCarrito.id}</th>
      <th>${prodEnElCarrito.nombre}</th>
      <th>${prodEnElCarrito.precio}</th>
      <th>${prodEnElCarrito.cantidad}</th>
      <th><button id="botonEliminar${prodEnElCarrito.id}" class="btn btn-danger">X</button></th>
    </tr>
    `
  })
  carrito.mostrarCarrito().forEach((prodEnElCarrito) => {//recorre el carrito
    document.getElementById(`botonEliminar${prodEnElCarrito.id}`).addEventListener('click', function () { //agrega el evento al boton
      borrarDelCarrito(prodEnElCarrito.id);//ejecuta la funcion para borrar del carrito
    })
  })
  const total = document.getElementById('totalCarrito'); //selecciono el total del carrito
  const totalString = carrito.total//obtengo el total del carrito
  total.innerHTML = ''
  total.innerHTML = `
    <div id="totalCarrito" class="alert alert-primary" role="alert">
        El total dentro del carrito incluyendo IGB (18%) es de $${totalString}
    </div>
    `;
}
function agregarCarrito (productoComprado) {//funcion para agregar al carrito
  carrito.agregarAlCarrito(productoComprado)//ejecuta la funcion para agregar al carrito
  dibujarCarrito()//ejecuta la funcion para dibujar el carrito
  let productosEnCarritoLocalParseado = [];//creo un array vacio
  const productosEnCarritoLocal = localStorage.getItem('carritoDeCompras')//obtengo los productos del carrito del local storage
  if (productosEnCarritoLocal) {//si hay productos en el carrito del local storage
    productosEnCarritoLocalParseado = JSON.parse(productosEnCarritoLocal);//parseo los productos del carrito del local storage
  }
  localStorage.setItem('carritoDeCompras', JSON.stringify(carrito))//guardo los productos del carrito en el local storage
}

function borrarDelCarrito (id) {//funcion para borrar del carrito
  carrito.borrarDelCarrito(id)//ejecuta la funcion para borrar del carrito
  dibujarCarrito();//ejecuta la funcion para dibujar el carrito
}
const cargarProductosDelLocalStorage = () => {//funcion para cargar los productos del local storage
  const carritoString = localStorage.getItem('carritoDeCompras');//obtengo los productos del carrito del local storage
  if (carritoString) {//si hay productos en el carrito del local storage
    const carritoParseado = JSON.parse(carritoString);//parseo los productos del carrito del local storage
    carritoParseado.productosEnElCarrito.forEach((producto) => {
      carrito.agregarAlCarrito(producto)//ejecuta la funcion para agregar al carrito
    });
    dibujarCarrito()//ejecuta la funcion para dibujar el carrito
  }
}
cargarProductosDelLocalStorage()//ejecuta la funcion para cargar los productos del local storage





