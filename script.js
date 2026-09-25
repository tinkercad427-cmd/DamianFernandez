/* ==========================================
   SHOPZONE
   SISTEMA DE CARRITO DE COMPRAS
========================================== */


/* ==========================================
   PRODUCTOS
========================================== */

const productos = [

    {
        id: 1,
        nombre: "Auriculares Pro",
        categoria: "Tecnología",
        precio: 45000,
        icono: "🎧"
    },

    {
        id: 2,
        nombre: "Smartphone X",
        categoria: "Tecnología",
        precio: 320000,
        icono: "📱"
    },

    {
        id: 3,
        nombre: "Notebook Ultra",
        categoria: "Computación",
        precio: 850000,
        icono: "💻"
    },

    {
        id: 4,
        nombre: "Zapatillas Urban",
        categoria: "Moda",
        precio: 78000,
        icono: "👟"
    },

    {
        id: 5,
        nombre: "Smartwatch Fit",
        categoria: "Tecnología",
        precio: 95000,
        icono: "⌚"
    },

    {
        id: 6,
        nombre: "Cámara Digital",
        categoria: "Fotografía",
        precio: 430000,
        icono: "📷"
    },

    {
        id: 7,
        nombre: "Mochila Premium",
        categoria: "Accesorios",
        precio: 55000,
        icono: "🎒"
    },

    {
        id: 8,
        nombre: "Consola Gamer",
        categoria: "Gaming",
        precio: 580000,
        icono: "🎮"
    }

];


/* ==========================================
   CARRITO DESDE LOCAL STORAGE
========================================== */

let carrito =
    JSON.parse(
        localStorage.getItem(
            "carritoShopZone"
        )
    ) || [];


/* ==========================================
   ELEMENTOS HTML
========================================== */

const productosContainer =
    document.getElementById(
        "productosContainer"
    );

const carritoItems =
    document.getElementById(
        "carritoItems"
    );

const contadorCarrito =
    document.getElementById(
        "contadorCarrito"
    );

const totalCarrito =
    document.getElementById(
        "totalCarrito"
    );

const carritoPanel =
    document.getElementById(
        "carrito"
    );

const overlay =
    document.getElementById(
        "overlay"
    );

const carritoVacio =
    document.getElementById(
        "carritoVacio"
    );

const notification =
    document.getElementById(
        "notification"
    );

const notificationText =
    document.getElementById(
        "notificationText"
    );

const modalCompra =
    document.getElementById(
        "modalCompra"
    );

const modalTotal =
    document.getElementById(
        "modalTotal"
    );

const cerrarModal =
    document.getElementById(
        "cerrarModal"
    );

const continuarComprando =
    document.getElementById(
        "continuarComprando"
    );


/* ==========================================
   MOSTRAR PRODUCTOS
========================================== */

function mostrarProductos() {

    productosContainer.innerHTML = "";


    productos.forEach(
        (producto, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "product-card"
            );


            card.style.animationDelay =
                `${index * 0.08}s`;


            card.innerHTML = `

                <div class="product-image">
                    ${producto.icono}
                </div>


                <div class="product-info">

                    <span class="product-category">
                        ${producto.categoria}
                    </span>


                    <h3>
                        ${producto.nombre}
                    </h3>


                    <div class="product-bottom">

                        <span class="price">
                            ${formatearPrecio(
                                producto.precio
                            )}
                        </span>


                        <button
                            class="add-button"
                            onclick="agregarAlCarrito(
                                ${producto.id}
                            )"
                            title="Agregar al carrito"
                        >
                            +
                        </button>

                    </div>

                </div>

            `;


            productosContainer.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   AGREGAR AL CARRITO
========================================== */

function agregarAlCarrito(id) {

    const producto =
        productos.find(
            producto =>
                producto.id === id
        );


    if (!producto) return;


    const productoExistente =
        carrito.find(
            item =>
                item.id === id
        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });

    }


    guardarCarrito();

    actualizarCarrito();


    mostrarNotificacion(
        `${producto.nombre} fue agregado al carrito`
    );

}


/* ==========================================
   ACTUALIZAR CARRITO
========================================== */

function actualizarCarrito() {

    carritoItems.innerHTML = "";


    let total = 0;

    let cantidadTotal = 0;


    if (carrito.length === 0) {

        carritoVacio.classList.add(
            "show"
        );

        carritoItems.style.display =
            "none";

    } else {

        carritoVacio.classList.remove(
            "show"
        );

        carritoItems.style.display =
            "block";

    }


    carrito.forEach(
        producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total += subtotal;

            cantidadTotal +=
                producto.cantidad;


            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "cart-item"
            );


            item.innerHTML = `

                <div class="cart-item-image">
                    ${producto.icono}
                </div>


                <div>

                    <h4>
                        ${producto.nombre}
                    </h4>


                    <span class="cart-price">
                        ${formatearPrecio(
                            producto.precio
                        )}
                    </span>


                    <div class="quantity">

                        <button
                            onclick="
                                cambiarCantidad(
                                    ${producto.id},
                                    -1
                                )
                            "
                        >
                            −
                        </button>


                        <span>
                            ${producto.cantidad}
                        </span>


                        <button
                            onclick="
                                cambiarCantidad(
                                    ${producto.id},
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="delete-button"
                    onclick="
                        eliminarProducto(
                            ${producto.id}
                        )
                    "
                    title="Eliminar producto"
                >
                    🗑️
                </button>

            `;


            carritoItems.appendChild(
                item
            );

        }
    );


    contadorCarrito.textContent =
        cantidadTotal;


    totalCarrito.textContent =
        formatearPrecio(total);

}


/* ==========================================
   CAMBIAR CANTIDAD
========================================== */

function cambiarCantidad(
    id,
    cambio
) {

    const producto =
        carrito.find(
            item =>
                item.id === id
        );


    if (!producto) return;


    producto.cantidad +=
        cambio;


    if (
        producto.cantidad <= 0
    ) {

        carrito =
            carrito.filter(
                item =>
                    item.id !== id
            );

    }


    guardarCarrito();

    actualizarCarrito();

}


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */

function eliminarProducto(id) {

    const producto =
        carrito.find(
            item =>
                item.id === id
        );


    if (!producto) return;


    carrito =
        carrito.filter(
            item =>
                item.id !== id
        );


    guardarCarrito();

    actualizarCarrito();


    mostrarNotificacion(
        `${producto.nombre} fue eliminado`
    );

}


/* ==========================================
   GUARDAR EN LOCAL STORAGE
========================================== */

function guardarCarrito() {

    localStorage.setItem(
        "carritoShopZone",
        JSON.stringify(carrito)
    );

}


/* ==========================================
   FORMATEAR PRECIO
========================================== */

function formatearPrecio(numero) {

    return numero.toLocaleString(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }
    );

}


/* ==========================================
   ABRIR CARRITO
========================================== */

document
    .getElementById(
        "abrirCarrito"
    )
    .addEventListener(
        "click",
        abrirCarrito
    );


function abrirCarrito() {

    carritoPanel.classList.add(
        "active"
    );

    overlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


/* ==========================================
   CERRAR CARRITO
========================================== */

document
    .getElementById(
        "cerrarCarrito"
    )
    .addEventListener(
        "click",
        cerrarCarrito
    );


overlay.addEventListener(
    "click",
    cerrarCarrito
);


function cerrarCarrito() {

    carritoPanel.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* ==========================================
   SEGUIR COMPRANDO
========================================== */

document
    .getElementById(
        "seguirComprando"
    )
    .addEventListener(
        "click",
        () => {

            cerrarCarrito();


            document
                .getElementById(
                    "productos"
                )
                .scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );


/* ==========================================
   VACIAR CARRITO
========================================== */

document
    .getElementById(
        "vaciarCarrito"
    )
    .addEventListener(
        "click",
        () => {

            if (
                carrito.length === 0
            ) {

                mostrarNotificacion(
                    "El carrito ya está vacío"
                );

                return;

            }


            carrito = [];


            guardarCarrito();

            actualizarCarrito();


            mostrarNotificacion(
                "El carrito fue vaciado"
            );

        }
    );


/* ==========================================
   FINALIZAR COMPRA
========================================== */

document
    .getElementById(
        "finalizarCompra"
    )
    .addEventListener(
        "click",
        () => {

            if (
                carrito.length === 0
            ) {

                mostrarNotificacion(
                    "Tu carrito está vacío"
                );

                return;

            }


            /* CALCULAR TOTAL */

            const total =
                carrito.reduce(
                    (
                        acumulado,
                        producto
                    ) => {

                        return (
                            acumulado +
                            producto.precio *
                            producto.cantidad
                        );

                    },
                    0
                );


            /* MOSTRAR TOTAL EN MODAL */

            modalTotal.textContent =
                formatearPrecio(total);


            /* ABRIR MODAL */

            modalCompra.classList.add(
                "active"
            );


            /* VACIAR CARRITO */

            carrito = [];


            guardarCarrito();

            actualizarCarrito();


            /* CERRAR PANEL */

            cerrarCarrito();

        }
    );


/* ==========================================
   CERRAR MODAL
========================================== */

cerrarModal.addEventListener(
    "click",
    () => {

        modalCompra.classList.remove(
            "active"
        );

    }
);


/* ==========================================
   SEGUIR COMPRANDO DESDE MODAL
========================================== */

continuarComprando.addEventListener(
    "click",
    () => {

        modalCompra.classList.remove(
            "active"
        );


        document
            .getElementById(
                "productos"
            )
            .scrollIntoView({
                behavior:
                    "smooth"
            });

    }
);


/* ==========================================
   CERRAR MODAL HACIENDO CLICK AFUERA
========================================== */

modalCompra.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalCompra
        ) {

            modalCompra.classList.remove(
                "active"
            );

        }

    }
);


/* ==========================================
   NOTIFICACIONES
========================================== */

let notificationTimeout;


function mostrarNotificacion(
    mensaje
) {

    notificationText.textContent =
        mensaje;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimeout
    );


    notificationTimeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* ==========================================
   ESC PARA CERRAR
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            cerrarCarrito();

            modalCompra.classList.remove(
                "active"
            );

        }

    }
);


/* ==========================================
   INICIAR PÁGINA
========================================== */

mostrarProductos();

actualizarCarrito();