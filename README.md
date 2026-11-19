# CampusShop: tienda en línea universitaria

Tienda en línea de estética neón (JINX Shop) hecha con HTML, CSS y JavaScript vanilla. Funciona en el navegador, sin servidor, sin frameworks y sin paso de build.

**Sitio publicado:** https://arrivillagadas.github.io/campusshop-ecommerce/

## Funcionalidades

- **Inicio:** buscador (Enter abre el catálogo filtrado), categorías y productos destacados.
- **Catálogo:** productos agrupados por categoría, carrusel de imágenes por producto y búsqueda en vivo (sin distinguir acentos).
- **Detalle de producto:** galería con miniaturas, selector de talla y botón para agregar al carrito.
- **Carrito:** cantidades editables, eliminar productos, subtotal, IVA (12 %) y total calculados. Contador del carrito en el menú.
- **Checkout:** formulario de envío con validación, método de pago y resumen de la orden. Es una demo: no procesa pagos reales.
- **Historial:** los pedidos confirmados se guardan y se pueden desplegar para ver su detalle.
- **Otras vistas:** perfil, preguntas frecuentes, soporte, carrito vacío y página 404.

El carrito y los pedidos se guardan en el `localStorage` del navegador, así que se conservan al recargar la página.

## Ejecutar localmente

Abre `index.html` en el navegador (doble clic). Todos los scripts son clásicos, así que también funciona con `file://`.

Si prefieres un servidor local:

```bash
python -m http.server 8000
```

y abre `http://localhost:8000`.

## Estructura

```text
campusshop-ecommerce/
├── css/
│   ├── base.css          # Variables de color y estilos globales
│   ├── layout.css        # Encabezado, menú lateral, pie y grids
│   ├── components.css    # Tarjetas, botones, carrito, checkout, historial
│   └── responsive.css    # Media queries
├── js/
│   ├── data.js           # Catálogo: categorías y productos
│   ├── store.js          # Carrito, pedidos, formato de precios y avisos
│   └── pages.js          # Lógica de cada vista (según data-page del <body>)
├── img/                  # Logo, fondos y fotos de producto
└── *.html                # Vistas del sitio
```

## Personalizar la tienda

1. Edita los productos y categorías en `js/data.js` (nombre, precio, imágenes, tallas, descripción y etiqueta).
2. Cambia los colores en las variables de `css/base.css`.
3. Ajusta el porcentaje de impuesto en `CS.TAX_RATE` dentro de `js/store.js`.

## Tecnologías

- HTML5 semántico.
- CSS3 con Flexbox, Grid, variables y diseño responsive.
- JavaScript vanilla, sin dependencias.

## Aviso sobre las imágenes

Las fotos de producto y la temática son de mercancía de terceros y se usan solo con fines académicos. Para usar esta tienda con fines comerciales hay que reemplazarlas por imágenes propias o con licencia.
