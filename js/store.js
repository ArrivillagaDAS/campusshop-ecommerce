/* store.js: carrito, pedidos y utilidades compartidas. Guarda los datos en localStorage del navegador. */
(function () {
    var CS = window.CampusShop = window.CampusShop || {};
    var CART_KEY = "campusshop.cart";
    var ORDERS_KEY = "campusshop.orders";

    CS.TAX_RATE = 0.12; // IVA de Guatemala

    function read(key, fallback) {
        try {
            var value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            /* sin almacenamiento disponible: el carrito vive solo en esta página */
        }
    }

    CS.money = function (n) {
        return "$" + Number(n).toFixed(2);
    };

    CS.escape = function (text) {
        return String(text).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    };

    CS.param = function (name) {
        return new URLSearchParams(window.location.search).get(name);
    };

    CS.findProduct = function (id) {
        return CS.products.filter(function (p) { return p.id === id; })[0] || null;
    };

    CS.getCart = function () {
        return read(CART_KEY, []).filter(function (item) { return CS.findProduct(item.id); });
    };

    CS.saveCart = function (cart) {
        write(CART_KEY, cart);
        CS.updateBadge();
    };

    CS.addToCart = function (id, size, qty) {
        var cart = CS.getCart();
        var line = cart.filter(function (i) { return i.id === id && i.size === size; })[0];
        if (line) {
            line.qty += qty || 1;
        } else {
            cart.push({ id: id, size: size, qty: qty || 1 });
        }
        CS.saveCart(cart);
    };

    CS.setQty = function (id, size, qty) {
        var cart = CS.getCart()
            .map(function (i) {
                if (i.id === id && i.size === size) i.qty = qty;
                return i;
            })
            .filter(function (i) { return i.qty > 0; });
        CS.saveCart(cart);
    };

    CS.clearCart = function () {
        CS.saveCart([]);
    };

    CS.cartCount = function () {
        return CS.getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
    };

    CS.cartTotals = function () {
        var lines = CS.getCart().map(function (i) {
            var p = CS.findProduct(i.id);
            return { item: i, product: p, total: p.price * i.qty };
        });
        var subtotal = lines.reduce(function (s, l) { return s + l.total; }, 0);
        var tax = subtotal * CS.TAX_RATE;
        return { lines: lines, subtotal: subtotal, tax: tax, total: subtotal + tax };
    };

    CS.getOrders = function () {
        return read(ORDERS_KEY, []);
    };

    CS.saveOrder = function (order) {
        var orders = CS.getOrders();
        orders.unshift(order);
        write(ORDERS_KEY, orders);
    };

    CS.updateBadge = function () {
        var count = CS.cartCount();
        document.querySelectorAll("[data-cart-count]").forEach(function (el) {
            el.textContent = count;
        });
    };

    CS.toast = function (message) {
        var box = document.createElement("div");
        box.className = "cs-toast";
        box.setAttribute("role", "status");
        box.textContent = message;
        document.body.appendChild(box);
        setTimeout(function () { box.classList.add("visible"); }, 10);
        setTimeout(function () {
            box.classList.remove("visible");
            setTimeout(function () { box.remove(); }, 300);
        }, 2200);
    };

    document.addEventListener("DOMContentLoaded", CS.updateBadge);
})();
