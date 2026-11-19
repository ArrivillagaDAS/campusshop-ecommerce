/* data.js: catálogo de productos. Para usar la plantilla con otra tienda, edita solo este archivo. */
window.CampusShop = window.CampusShop || {};

window.CampusShop.categories = [
    { id: "ropa", name: "ROPA", title: "ROPA DE ZAUN" },
    { id: "gorros", name: "GORROS", title: "GORROS LOCOS" },
    { id: "joyeria", name: "JOYERÍA", title: "JOYERÍA HEXTECH" }
];

window.CampusShop.products = [
    {
        id: "chaqueta-kaisa",
        sku: "CS-1001",
        name: "Chaqueta reversible Kai'Sa y Akali",
        category: "ropa",
        price: 127.5,
        images: ["img/chaqueta1.webp", "img/chaqueta2.webp", "img/chaqueta3.webp", "img/chaqueta4.webp"],
        sizes: ["S", "M", "L", "XL"],
        badge: "",
        description: "Chaqueta reversible de edición limitada con bordados de alta calidad y materiales resistentes. Dos estilos en una sola prenda."
    },
    {
        id: "calcetines-tft",
        sku: "CS-1002",
        name: "Calcetines TFT (3 pares)",
        category: "ropa",
        price: 25.99,
        images: ["img/calcetas1.webp", "img/calcetas2.webp", "img/calcetas3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Paquete de tres pares de calcetines de algodón con diseños ilustrados."
    },
    {
        id: "camiseta-chibi",
        sku: "CS-1003",
        name: "Camiseta gráfica chibi",
        category: "ropa",
        price: 31.99,
        images: ["img/yasuo1.webp", "img/yasuo2.webp", "img/yasuo3.webp"],
        sizes: ["S", "M", "L", "XL"],
        badge: "",
        description: "Camiseta de algodón suave con estampado gráfico de alta duración."
    },
    {
        id: "sombrero-poro",
        sku: "CS-2001",
        name: "Sombrero de Poro",
        category: "gorros",
        price: 25,
        images: ["img/poro1.webp", "img/poro2.webp", "img/poro3.webp"],
        sizes: ["Única"],
        badge: "NUEVO",
        description: "Gorro de peluche abrigador, ideal para el frío y para las convenciones."
    },
    {
        id: "sombrero-oso",
        sku: "CS-2002",
        name: "Sombrero de oso",
        category: "gorros",
        price: 30,
        images: ["img/tibbers1.webp", "img/tibbers2.webp", "img/tibbers3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Gorro de peluche con orejas de oso, forro interior suave."
    },
    {
        id: "sombrero-abeja",
        sku: "CS-2003",
        name: "Sombrero de abeja",
        category: "gorros",
        price: 28,
        images: ["img/abeja1.webp", "img/abeja2.webp", "img/abeja3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Gorro de peluche con antenas y alas, tamaño ajustable."
    },
    {
        id: "collar-espinas",
        sku: "CS-3001",
        name: "Collar de espinas",
        category: "joyeria",
        price: 98.99,
        images: ["img/joya1.webp", "img/joya2.webp", "img/joya3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Collar de plata con detalles de espinas y acabado envejecido."
    },
    {
        id: "guardapelo-esperanza",
        sku: "CS-3002",
        name: "Guardapelo \"Esperanza\"",
        category: "joyeria",
        price: 160,
        images: ["img/collarestelar1.webp", "img/collarestelar2.webp", "img/collarestelar3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Guardapelo que se abre para guardar una foto, con cadena incluida."
    },
    {
        id: "colgante-poro",
        sku: "CS-3003",
        name: "Colgante de poro",
        category: "joyeria",
        price: 89.5,
        images: ["img/porocollar1.webp", "img/porocollar2.webp", "img/porocollar3.webp"],
        sizes: ["Única"],
        badge: "",
        description: "Colgante esmaltado con forma de poro y cadena de acero inoxidable."
    }
];
