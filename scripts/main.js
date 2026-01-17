
/* ================= MODAL CONTACTO ================= */
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

if (contactBtn && contactModal && closeContact) {
    contactBtn.onclick = () => contactModal.classList.add("show");
    closeContact.onclick = () => contactModal.classList.remove("show");

    contactModal.onclick = (e) => {
        if (e.target === contactModal) contactModal.classList.remove("show");
    };
}

/* ================= MENÚ RESPONSIVE ================= */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

/* ================= CARRITO ================= */

function getUserCartKey() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_${user.email}` : "cart_guest";
}

let cart = JSON.parse(localStorage.getItem(getUserCartKey())) || [];


const cartIcon = document.querySelector(".cart-icon");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function saveCart() {
    localStorage.setItem(getUserCartKey(), JSON.stringify(cart));
}


function updateCartCount() {
    if (!cartIcon) return;

    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    cartIcon.textContent = `🛒 ${count}`;
}


function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <small>S/ ${item.price.toFixed(2)}</small>
                </div>
                <div class="cart-item-actions">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button onclick="removeItem(${index})">✕</button>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
    updateCartCount();
    saveCart();
}


function changeQty(index, amount) {
    cart[index].qty += amount;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

/* ABRIR / CERRAR */
cartIcon.addEventListener("click", e => {
    e.preventDefault();
    cartModal.classList.add("show");
    renderCart();
});

closeCart.addEventListener("click", () => {
    cartModal.classList.remove("show");
});

/* AGREGAR PRODUCTO */

document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        const product = {
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            img: btn.dataset.img,
            qty: 1
        };

        const existing = cart.find(p => p.name === product.name);

        if (existing) {
            existing.qty++;
        } else {
            cart.push(product);
        }

        saveCart();
        updateCartCount();
    });
});


/* WHATSAPP */

function proceedToWhatsApp() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = localStorage.getItem("userName") || "Usuario";

    let message = `Hola Samma.hub, soy ${user ? user.email : userName} y quiero realizar este pedido:%0A%0A`;
    let total = 0;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} x${item.qty} - S/ ${item.price}%0A`;
        total += item.price * item.qty;
    });

    message += `%0ATotal: S/ ${total.toFixed(2)}`;

    window.open(
        `https://wa.me/51952773283?text=${message}`,
        "_blank"
    );
}

checkoutBtn.addEventListener("click", () => {
    const isLogged = localStorage.getItem("isLogged");

    if (!isLogged) {
        document.getElementById("cartLoginPrompt").style.display = "block";
        return;
    }

    proceedToWhatsApp();
});

document.querySelector(".btn-outline").addEventListener("click", () => {
    document.getElementById("cartModal").classList.remove("show");
});

updateCartCount();


/* ================= ANIMACIÓN SCROLL ================= */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
});

/* ================= SCROLL TO SHOP ================= */
function scrollToShop() {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}



/*********************************************/

// ================= BUSCADOR DE PRODUCTOS =================

const searchInput = document.getElementById("searchInput");
const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    productCards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

/*********************************************/

// MODAL NOSOTRAS
const aboutBtn = document.querySelector('a[href="#about"]');
const aboutModal = document.getElementById("aboutModal");
const closeAbout = document.getElementById("closeAbout");

aboutBtn.addEventListener("click", e => {
    e.preventDefault();
    aboutModal.classList.add("show");
});

closeAbout.addEventListener("click", () => {
    aboutModal.classList.remove("show");
});

// MODAL TIENDAS
const storeBtn = document.querySelector('a[href="#shop"]');
const storesModal = document.getElementById("storesModal");
const closeStores = document.getElementById("closeStores");

storeBtn.addEventListener("click", e => {
    e.preventDefault();
    storesModal.classList.add("show");
});

closeStores.addEventListener("click", () => {
    storesModal.classList.remove("show");
});

/*********************************************/

// TÉRMINOS
const termsLink = document.querySelector('a[href="#terms"]');
const termsModal = document.getElementById("termsModal");
const closeTerms = document.getElementById("closeTerms");

termsLink.addEventListener("click", e => {
    e.preventDefault();
    termsModal.classList.add("show");
});

closeTerms.addEventListener("click", () => {
    termsModal.classList.remove("show");
});

// POLÍTICAS
const policyLink = document.querySelector('a[href="#policy"]');
const policyModal = document.getElementById("policyModal");
const closePolicy = document.getElementById("closePolicy");

policyLink.addEventListener("click", e => {
    e.preventDefault();
    policyModal.classList.add("show");
});

closePolicy.addEventListener("click", () => {
    policyModal.classList.remove("show");
});

updateCartCount();

/*********************************************/


/* ================= LOGIN / REGISTER ================= */

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");

const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

/* ABRIR LOGIN */
loginBtn.addEventListener("click", e => {
    e.preventDefault();

    const isLogged = localStorage.getItem("isLogged");
    if (isLogged) {
        accountModal.classList.add("show");
    } else {
        loginModal.classList.add("show");
    }
});

/* CERRAR */
closeLogin.addEventListener("click", () => {
    loginModal.classList.remove("show");
});

/* TABS */
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab + "Form").classList.add("active");
    });
});

/* LOGIN */
document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("isLogged", true);
    loginModal.classList.remove("show");
    accountModal.classList.add("show");
});

/* REGISTER */
document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("isLogged", true);
    loginModal.classList.remove("show");
    accountModal.classList.add("show");
});

/* FORGOT PASSWORD */
document.getElementById("forgotPassword").addEventListener("click", e => {
    e.preventDefault();
    alert("Funcionalidad de recuperación de contraseña próximamente disponible. Contacta a soporte@samma.hub");
});

/* GUEST LOGIN */
document.getElementById("guestLogin").addEventListener("click", () => {
    localStorage.setItem("isLogged", true);
    localStorage.setItem("userName", "Invitado");
    loginModal.classList.remove("show");
    accountModal.classList.add("show");
});

/* SURPRISE ME */
document.getElementById("surpriseMe").addEventListener("click", () => {
    const products = document.querySelectorAll(".product-card");
    if (products.length > 0) {
        const randomIndex = Math.floor(Math.random() * products.length);
        products[randomIndex].scrollIntoView({ behavior: 'smooth' });
        loginModal.classList.remove("show");
    }
});

/* CART LOGIN BUTTONS */
document.getElementById("cartLoginBtn").addEventListener("click", () => {
    document.getElementById("cartLoginPrompt").style.display = "none";
    document.getElementById("loginModal").classList.add("show");
});

document.getElementById("cartGuestBtn").addEventListener("click", () => {
    localStorage.setItem("isLogged", true);
    localStorage.setItem("userName", "Invitado");
    document.getElementById("cartLoginPrompt").style.display = "none";
    proceedToWhatsApp();
});

document.getElementById("cartSurpriseBtn").addEventListener("click", () => {
    const products = document.querySelectorAll(".product-card");
    if (products.length > 0) {
        const randomIndex = Math.floor(Math.random() * products.length);
        products[randomIndex].scrollIntoView({ behavior: 'smooth' });
        document.getElementById("cartModal").classList.remove("show");
        document.getElementById("cartLoginPrompt").style.display = "none";
    }
});


/* ================= LOGIN FLOW CORRECTO ================= */

// Al hacer click en el ícono
loginBtn.addEventListener("click", e => {
    e.preventDefault();

    const logged = JSON.parse(localStorage.getItem("isLogged"));

    if (logged) {
        // ABRIR MODAL MI CUENTA
        accountModal.classList.add("show");
    } else {
        // ABRIR MODAL LOGIN
        loginModal.classList.add("show");
    }
});


/* ================= MI CUENTA ================= */

const accountModal = document.getElementById("accountModal");
const closeAccount = document.getElementById("closeAccount");
const logoutBtn = document.getElementById("logoutBtn");

/* ABRIR LOGIN O CUENTA */
loginBtn.addEventListener("click", e => {
    e.preventDefault();

    if (localStorage.getItem("isLogged")) {
        accountModal.classList.add("show");
    } else {
        loginModal.classList.add("show"); // tu modal login
    }
});

/* CERRAR */
closeAccount.addEventListener("click", () => {
    accountModal.classList.remove("show");
});

/* LOGOUT */
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("userName");
    accountModal.classList.remove("show");
});

/* ================= CHECKOUT ================= */

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const confirmOrder = document.getElementById("confirmOrder");
const continueShopping = document.getElementById("continueShopping");

/* ABRIR CHECKOUT DESDE CARRITO */
checkoutBtn.addEventListener("click", () => {
    cartModal.classList.remove("show");
    renderCheckout();
    checkoutModal.classList.add("show");
});

/* RENDER CHECKOUT */
function renderCheckout() {
    checkoutItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        checkoutItems.innerHTML += `
            <div class="checkout-item">
                <span>${item.name} x${item.qty}</span>
                <strong>S/ ${subtotal.toFixed(2)}</strong>
            </div>
        `;
    });

    checkoutTotal.textContent = total.toFixed(2);
}

/* CERRAR */
closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.remove("show");
});

/* SEGUIR COMPRANDO */
continueShopping.addEventListener("click", () => {
    checkoutModal.classList.remove("show");
});

/* CONFIRMAR POR WHATSAPP */
confirmOrder.addEventListener("click", () => {
    let message = "Hola Samma.hub, quiero confirmar mi pedido:%0A%0A";
    let total = 0;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} x${item.qty} - S/ ${item.price}%0A`;
        total += item.price * item.qty;
    });

    message += `%0ATotal: S/ ${total.toFixed(2)}`;

    window.open(
        `https://wa.me/51952773283?text=${message}`,
        "_blank"
    );
});

/* ================= QUICK VIEW FUNCTIONALITY ================= */
function openQuickView(title, description, price, image) {
    document.getElementById('quickViewTitle').textContent = title;
    document.getElementById('quickViewDescription').textContent = description;
    document.getElementById('quickViewPrice').textContent = `S/ ${price}`;
    document.getElementById('quickViewImage').src = image;

    // Set up add to cart button
    const addToCartBtn = document.getElementById('quickViewAddToCart');
    addToCartBtn.onclick = () => {
        const product = {
            name: title,
            price: parseFloat(price),
            img: image,
            qty: 1
        };

        const existing = cart.find(p => p.name === product.name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push(product);
        }

        saveCart();
        updateCartCount();
        document.getElementById('quickViewModal').classList.remove('show');
        alert('Producto agregado al carrito!');
    };

    document.getElementById('quickViewModal').classList.add('show');
}

document.getElementById('closeQuickView').addEventListener('click', () => {
    document.getElementById('quickViewModal').classList.remove('show');
});

/* ================= WISHLIST FUNCTIONALITY ================= */
function toggleWishlist(button) {
    const heartIcon = button.querySelector('span') || button;
    const isActive = heartIcon.textContent === '❤️';

    if (isActive) {
        heartIcon.textContent = '🤍';
        button.classList.remove('active');
    } else {
        heartIcon.textContent = '❤️';
        button.classList.add('active');
    }
}

/* ================= NEWSLETTER SUBSCRIPTION ================= */
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

    if (!email) {
        alert('Por favor ingresa tu correo electrónico');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Por favor ingresa un correo electrónico válido');
        return;
    }

    // Simulate subscription
    alert('¡Gracias por suscribirte! Recibirás las últimas novedades de Samma.hub');
    emailInput.value = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ================= FILTER FUNCTIONALITY ================= */
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* ================= PRODUCT SEARCH ================= */
document.getElementById('productSearch').addEventListener('input', () => {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();

        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

/* ================= LOAD MORE FUNCTIONALITY ================= */
function loadMoreProducts() {
    // Simulate loading more products
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.innerHTML;

    loadMoreBtn.innerHTML = '<span class="btn-icon">⏳</span> Cargando...';
    loadMoreBtn.disabled = true;

    setTimeout(() => {
        // In a real application, this would fetch more products from an API
        alert('En una implementación completa, aquí se cargarían más productos desde el servidor.');
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;
    }, 2000);
}

/* ================= ENHANCED CART FUNCTIONALITY ================= */

// Update cart summary with subtotal, shipping, and total
function updateCartSummary() {
    const cartSummary = document.getElementById('cartSummary');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const freeShippingNotice = document.getElementById('freeShippingNotice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.querySelector('.btn-clear-cart');

    if (cart.length === 0) {
        cartSummary.style.display = 'none';
        checkoutBtn.style.display = 'none';
        clearCartBtn.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';
    checkoutBtn.style.display = 'block';
    clearCartBtn.style.display = 'block';

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Calculate shipping (free over S/149)
    const shipping = subtotal >= 149 ? 0 : 15;

    // Calculate total
    const total = subtotal + shipping;

    // Update display
    cartSubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    cartShipping.textContent = shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`;
    cartTotal.innerHTML = `<strong>S/ ${total.toFixed(2)}</strong>`;

    // Show/hide free shipping notice
    if (subtotal >= 149) {
        freeShippingNotice.style.display = 'none';
    } else {
        freeShippingNotice.style.display = 'flex';
        const remaining = 149 - subtotal;
        freeShippingNotice.querySelector('span:last-child').textContent =
            `¡Agrega S/ ${remaining.toFixed(2)} más para envío gratis!`;
    }
}

// Apply discount code
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value.trim().toUpperCase();
    const discountMessage = document.getElementById('discountMessage');

    if (!discountCode) {
        discountMessage.textContent = 'Ingresa un código de descuento';
        discountMessage.className = 'discount-message error';
        return;
    }

    // Simulate discount codes (in a real app, this would be validated server-side)
    const validCodes = {
        'SAMMA10': 0.10, // 10% discount
        'NEWIN15': 0.15, // 15% discount
        'WELCOME20': 0.20  // 20% discount
    };

    if (validCodes[discountCode]) {
        const discount = validCodes[discountCode];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discountAmount = subtotal * discount;

        discountMessage.textContent = `¡Código aplicado! Ahorras S/ ${discountAmount.toFixed(2)} (${(discount * 100).toFixed(0)}% descuento)`;
        discountMessage.className = 'discount-message success';

        // Apply discount to total calculation
        updateCartSummaryWithDiscount(discount);
    } else {
        discountMessage.textContent = 'Código de descuento inválido';
        discountMessage.className = 'discount-message error';
    }
}

// Update cart summary with discount applied
function updateCartSummaryWithDiscount(discountPercent) {
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= 149 ? 0 : 15;
    const discountAmount = subtotal * discountPercent;
    const total = (subtotal - discountAmount) + shipping;

    cartSubtotal.innerHTML = `S/ ${subtotal.toFixed(2)} <span class="discount-applied">(-S/ ${discountAmount.toFixed(2)})</span>`;
    cartTotal.innerHTML = `<strong>S/ ${total.toFixed(2)}</strong>`;
}

// Clear entire cart
function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        updateCartSummary();
        document.getElementById('cartSummary').style.display = 'none';
        document.getElementById('checkoutBtn').style.display = 'none';
        document.querySelector('.btn-clear-cart').style.display = 'none';
    }
}

// Enhanced cart item rendering with better layout
function renderCartItem(item, index) {
    const itemTotal = item.price * item.qty;
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='assets/products/placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">S/ ${item.price.toFixed(2)} c/u</div>
                <div class="cart-item-total">Total: S/ ${itemTotal.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button onclick="changeQty(${index}, -1)" class="qty-btn" ${item.qty <= 1 ? 'disabled' : ''}>-</button>
                <span class="qty-display">${item.qty}</span>
                <button onclick="changeQty(${index}, 1)" class="qty-btn">+</button>
                <button onclick="removeItem(${index})" class="remove-btn" title="Eliminar">✕</button>
            </div>
        </div>
    `;
}

// Override the existing renderCart function
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = cartItems.querySelector('.empty-cart');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-animation">
                    <div class="empty-cart-icon">🛍️</div>
                    <div class="empty-cart-bounce"></div>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Descubre nuestras prendas y comienza a comprar!</p>
                <button onclick="document.getElementById('cartModal').classList.remove('show'); scrollToShop();" class="btn-primary">
                    <span class="btn-icon">🛍️</span>
                    Explorar productos
                </button>
            </div>
        `;
        updateCartSummary();
        return;
    }

    // Remove empty cart message and render items
    if (emptyCart) emptyCart.remove();

    cartItems.innerHTML = cart.map((item, index) => renderCartItem(item, index)).join('');

    updateCartSummary();
}

// Enhanced cart modal opening
cartIcon.addEventListener("click", e => {
    e.preventDefault();
    cartModal.classList.add("show");
    renderCart();
    updateCartSummary();
});

// Add keyboard support for discount code
document.getElementById('discountCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        applyDiscount();
    }
});

// Cart persistence improvements
function saveCart() {
    try {
        localStorage.setItem(getUserCartKey(), JSON.stringify(cart));
    } catch (e) {
        console.warn('Could not save cart to localStorage:', e);
    }
}

// Load cart with error handling
function loadCart() {
    try {
        const savedCart = localStorage.getItem(getUserCartKey());
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
        }
    } catch (e) {
        console.warn('Could not load cart from localStorage:', e);
        cart = [];
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});
