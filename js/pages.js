/* pages.js: lógica de cada vista. Cada <body> declara data-page="..." */
(function () {
    var CS = window.CampusShop;
    var esc = CS.escape;

    function productUrl(p) {
        return "producto.html?id=" + encodeURIComponent(p.id);
    }

    function productCard(p) {
        var imgs = p.images.map(function (src, i) {
            return '<img src="' + src + '" alt="' + esc(p.name) + " - vista " + (i + 1) + '" loading="lazy">';
        }).join("");
        var arrows = p.images.length > 1
            ? '<button type="button" class="nav-arrow btn-prev" aria-label="Imagen anterior">❮</button>' +
              '<button type="button" class="nav-arrow btn-next" aria-label="Imagen siguiente">❯</button>'
            : "";
        return '<article class="product-card">' +
            (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "") +
            '<div class="carousel-container">' + arrows + '<div class="image-carousel">' + imgs + "</div></div>" +
            "<h4>" + esc(p.name) + "</h4>" +
            '<p class="price">' + CS.money(p.price) + "</p>" +
            '<a href="' + productUrl(p) + '" class="btn-ver-producto">VER PRODUCTO</a>' +
            "</article>";
    }

    function bindCarousels(root) {
        root.querySelectorAll(".carousel-container").forEach(function (box) {
            var track = box.querySelector(".image-carousel");
            box.querySelectorAll(".nav-arrow").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var dir = btn.classList.contains("btn-prev") ? -1 : 1;
                    track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
                });
            });
        });
    }

    function normalize(text) {
        return String(text).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    /* ---------- Inicio ---------- */
    function initHome() {
        var search = document.querySelector(".jinx-search");
        if (search) {
            search.addEventListener("keydown", function (e) {
                if (e.key === "Enter" && search.value.trim()) {
                    window.location.href = "catalogo.html?q=" + encodeURIComponent(search.value.trim());
                }
            });
        }
        var grid = document.querySelector("[data-featured]");
        if (grid) {
            var featured = CS.products.filter(function (p) { return p.badge; })
                .concat(CS.products.filter(function (p) { return !p.badge; }))
                .slice(0, 4);
            grid.innerHTML = featured.map(productCard).join("");
            bindCarousels(grid);
        }
    }

    /* ---------- Catálogo ---------- */
    function initCatalog() {
        var container = document.querySelector("[data-catalog]");
        var input = document.querySelector("[data-catalog-search]");
        var query = CS.param("q") || "";
        if (input) input.value = query;

        function render() {
            var q = normalize(input ? input.value.trim() : query);
            var html = "";
            var total = 0;
            CS.categories.forEach(function (cat) {
                var items = CS.products.filter(function (p) {
                    return p.category === cat.id && (!q || normalize(p.name + " " + p.description + " " + cat.name).indexOf(q) !== -1);
                });
                total += items.length;
                if (!items.length) return;
                html += '<h2 id="' + cat.id + '" class="section-title">' + esc(cat.title) + "</h2>" +
                    '<section class="products-grid">' + items.map(productCard).join("") + "</section>";
            });
            if (!total) {
                html = '<p class="cs-empty-search">No encontramos productos para "' + esc(input.value) + '".</p>';
            }
            container.innerHTML = html;
            bindCarousels(container);
        }

        if (input) {
            input.addEventListener("input", function () {
                var url = new URL(window.location.href);
                if (input.value.trim()) url.searchParams.set("q", input.value.trim());
                else url.searchParams.delete("q");
                history.replaceState(null, "", url);
                render();
            });
        }
        render();
        if (window.location.hash) {
            var target = document.querySelector(window.location.hash);
            if (target) target.scrollIntoView();
        }
    }

    /* ---------- Detalle de producto ---------- */
    function initProduct() {
        var p = CS.findProduct(CS.param("id")) || CS.products[0];
        var selectedSize = p.sizes.length === 1 ? p.sizes[0] : (p.sizes[1] || p.sizes[0]);
        document.title = p.name + " | CampusShop";

        var main = document.querySelector(".main-img");
        main.src = p.images[0];
        main.alt = p.name;
        document.querySelector(".p-name").textContent = p.name;
        document.querySelector(".p-price").textContent = CS.money(p.price);
        document.querySelector(".p-description").textContent = p.description;

        var thumbs = document.querySelector("[data-thumbs]");
        thumbs.innerHTML = p.images.map(function (src, i) {
            return '<button type="button" class="cs-thumb' + (i === 0 ? " active" : "") + '" data-src="' + src + '" aria-label="Ver imagen ' + (i + 1) + '">' +
                '<img src="' + src + '" alt="" loading="lazy"></button>';
        }).join("");
        thumbs.addEventListener("click", function (e) {
            var btn = e.target.closest(".cs-thumb");
            if (!btn) return;
            main.src = btn.dataset.src;
            thumbs.querySelectorAll(".cs-thumb").forEach(function (b) { b.classList.toggle("active", b === btn); });
        });

        var sizes = document.querySelector(".sizes");
        sizes.innerHTML = p.sizes.map(function (s) {
            return '<button type="button" class="' + (s === selectedSize ? "active" : "") + '" aria-pressed="' + (s === selectedSize) + '">' + esc(s) + "</button>";
        }).join("");
        sizes.addEventListener("click", function (e) {
            var btn = e.target.closest("button");
            if (!btn) return;
            selectedSize = btn.textContent;
            sizes.querySelectorAll("button").forEach(function (b) {
                b.classList.toggle("active", b === btn);
                b.setAttribute("aria-pressed", b === btn);
            });
        });

        document.querySelector(".btn-add-to-cart").addEventListener("click", function () {
            CS.addToCart(p.id, selectedSize, 1);
            CS.toast("Agregado al carrito: " + p.name + " (" + selectedSize + ")");
        });
    }

    /* ---------- Carrito ---------- */
    function initCart() {
        var list = document.querySelector(".cart-items");
        var summary = document.querySelector(".cart-summary");

        function render() {
            var t = CS.cartTotals();
            if (!t.lines.length) {
                window.location.replace("vacio.html");
                return;
            }
            list.innerHTML = t.lines.map(function (l) {
                var key = 'data-id="' + l.product.id + '" data-size="' + esc(l.item.size) + '"';
                return '<div class="cart-item">' +
                    '<img src="' + l.product.images[0] + '" class="cart-item-img" alt="' + esc(l.product.name) + '">' +
                    '<div class="cart-item-info"><h4><a class="cs-link" href="' + productUrl(l.product) + '">' + esc(l.product.name) + "</a></h4>" +
                    '<p class="ref">Ref: #' + l.product.sku + " · Talla " + esc(l.item.size) + "</p>" +
                    '<div class="cart-qty"><button type="button" class="qty-btn" data-action="minus" ' + key + ' aria-label="Quitar uno">−</button>' +
                    '<span class="qty-num">' + l.item.qty + "</span>" +
                    '<button type="button" class="qty-btn" data-action="plus" ' + key + ' aria-label="Agregar uno">+</button></div></div>' +
                    '<div class="cart-item-price"><button type="button" class="delete-btn" data-action="delete" ' + key + ' aria-label="Eliminar producto">🗑️</button>' +
                    '<p class="price">' + CS.money(l.total) + '</p><span class="subtotal-label">subtotal</span></div>' +
                    "</div>";
            }).join("");
            summary.querySelector("[data-subtotal]").textContent = CS.money(t.subtotal);
            summary.querySelector("[data-tax]").textContent = CS.money(t.tax);
            summary.querySelector("[data-total]").textContent = CS.money(t.total);
        }

        list.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-action]");
            if (!btn) return;
            var line = CS.getCart().filter(function (i) { return i.id === btn.dataset.id && i.size === btn.dataset.size; })[0];
            if (!line) return;
            var qty = btn.dataset.action === "plus" ? line.qty + 1 : btn.dataset.action === "minus" ? line.qty - 1 : 0;
            CS.setQty(line.id, line.size, qty);
            render();
        });

        summary.querySelector(".btn-pay").addEventListener("click", function () {
            window.location.href = "checkout.html";
        });
        render();
    }

    /* ---------- Checkout ---------- */
    function initCheckout() {
        var t = CS.cartTotals();
        if (!t.lines.length) {
            window.location.replace("vacio.html");
            return;
        }
        var form = document.querySelector("#checkout-form");
        var box = document.querySelector("[data-order-lines]");
        box.innerHTML = t.lines.map(function (l) {
            return '<div class="summary-item"><div class="item-info"><p class="item-name">' + esc(l.product.name) + "</p>" +
                '<p class="item-qty">Cantidad: ' + l.item.qty + " · Talla " + esc(l.item.size) + "</p></div>" +
                '<span class="item-price">' + CS.money(l.total) + "</span></div>";
        }).join("") +
            '<div class="summary-item"><div class="item-info"><p class="item-name">IVA (12%)</p></div><span class="item-price">' + CS.money(t.tax) + "</span></div>";
        document.querySelector("[data-order-total]").textContent = CS.money(t.total);
        document.querySelector(".btn-pay-neon").textContent = "Pagar " + CS.money(t.total);

        var cards = document.querySelectorAll(".payment-card");
        cards.forEach(function (card) {
            card.addEventListener("click", function () {
                cards.forEach(function (c) {
                    c.classList.toggle("active", c === card);
                    c.setAttribute("aria-checked", c === card);
                });
                form.elements.pago.value = card.dataset.method;
            });
            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            var order = {
                id: String(Date.now()).slice(-6),
                date: new Date().toISOString(),
                status: "En proceso",
                customer: {
                    name: form.elements.nombre.value.trim(),
                    address: form.elements.direccion.value.trim(),
                    city: form.elements.ciudad.value.trim()
                },
                payment: form.elements.pago.value,
                items: t.lines.map(function (l) {
                    return { id: l.product.id, name: l.product.name, size: l.item.size, qty: l.item.qty, total: l.total };
                }),
                subtotal: t.subtotal,
                tax: t.tax,
                total: t.total
            };
            CS.saveOrder(order);
            CS.clearCart();
            window.location.href = "historial.html?nueva=" + order.id;
        });
    }

    /* ---------- Historial ---------- */
    function initHistory() {
        var orders = CS.getOrders();
        var box = document.querySelector("[data-orders]");
        if (!orders.length) return; // se quedan los pedidos de ejemplo del HTML
        var fresh = CS.param("nueva");
        var statusClass = { "En proceso": "status-shipping", "Entregado": "status-delivered", "Cancelado": "status-cancelled" };
        var html = orders.map(function (o) {
            var date = new Date(o.date).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
            var items = o.items.map(function (i) {
                return "<li>" + i.qty + " × " + esc(i.name) + " (" + esc(i.size) + ") — " + CS.money(i.total) + "</li>";
            }).join("");
            return '<div class="order-card border-yellow' + (o.id === fresh ? " cs-new-order" : "") + '">' +
                '<div class="order-header"><h3>Orden #' + o.id + '</h3><span class="order-price">' + CS.money(o.total) + "</span></div>" +
                '<p class="order-date">' + date + " · " + esc(o.payment) + "</p>" +
                '<div class="order-footer"><span class="status ' + (statusClass[o.status] || "status-shipping") + '">● ' + esc(o.status) + "</span>" +
                '<button type="button" class="btn-detail cs-toggle">Ver detalle ></button></div>' +
                '<ul class="cs-order-items" hidden>' + items + "<li>Envío a: " + esc(o.customer.name) + ", " + esc(o.customer.address) + ", " + esc(o.customer.city) + "</li></ul>" +
                "</div>";
        }).join("");
        box.innerHTML = html;
        box.addEventListener("click", function (e) {
            var btn = e.target.closest(".cs-toggle");
            if (!btn) return;
            var ul = btn.closest(".order-card").querySelector(".cs-order-items");
            ul.hidden = !ul.hidden;
            btn.textContent = ul.hidden ? "Ver detalle >" : "Ocultar detalle";
        });
        if (fresh) CS.toast("¡Pedido #" + fresh + " confirmado!");
    }

    var pages = {
        home: initHome,
        catalog: initCatalog,
        product: initProduct,
        cart: initCart,
        checkout: initCheckout,
        history: initHistory
    };

    document.addEventListener("DOMContentLoaded", function () {
        var page = pages[document.body.dataset.page];
        if (page) page();
    });
})();
