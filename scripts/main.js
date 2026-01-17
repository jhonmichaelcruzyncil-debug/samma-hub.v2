
/* ================= ERROR HANDLING & LOADING STATES ================= */

// Global error handler for unhandled errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Could send to error tracking service
});

// Network error handler
window.addEventListener('offline', function() {
    showNotification('Se perdió la conexión a internet', 'error');
});

window.addEventListener('online', function() {
    showNotification('Conexión restablecida', 'success');
});

// Image error handling
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
    img.alt = 'Imagen no disponible';
    img.classList.add('image-error');
}

// Loading state management
function setLoadingState(element, loading) {
    if (loading) {
        element.classList.add('loading');
        element.disabled = true;
        element.innerHTML = '<span class="spinner"></span> Cargando...';
    } else {
        element.classList.remove('loading');
        element.disabled = false;
        // Restore original text (this would need to be stored)
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

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
    // Check for new session system first
    const sessionData = localStorage.getItem("userSession");
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            return session.user ? `cart_${session.user.email}` : "cart_guest";
        } catch (e) {
            console.warn('Error parsing user session:', e);
        }
    }

    // Fallback to old system
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_${user.email}` : "cart_guest";
}

let cart = [];
let currentDiscount = 0; // Track current discount percentage
loadCart(); // Initialize cart immediately
updateCartCount(); // Update count immediately after loading


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
    const cartIcon = document.querySelector(".cart-icon");
    const cartCountElement = document.getElementById("cartCount");

    const count = cart.reduce((acc, item) => acc + item.qty, 0);

    // Update cart icon
    if (cartIcon) {
        cartIcon.textContent = `🛒 ${count}`;
        cartIcon.style.display = count > 0 ? 'inline-block' : 'inline-block'; // Always show cart icon
    }

    // Update cart count text in modal header
    if (cartCountElement) {
        const productText = count === 1 ? 'producto' : 'productos';
        cartCountElement.textContent = `${count} ${productText}`;
    }
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
    let subtotal = 0;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} x${item.qty} - S/ ${item.price}%0A`;
        subtotal += item.price * item.qty;
    });

    message += `%0ASubtotal: S/ ${subtotal.toFixed(2)}%0A`;

    // Include discount if applied
    if (currentDiscount > 0) {
        const discountAmount = subtotal * currentDiscount;
        message += `Descuento (${(currentDiscount * 100).toFixed(0)}%): -S/ ${discountAmount.toFixed(2)}%0A`;
        subtotal -= discountAmount;
    }

    // Include shipping
    const shipping = subtotal >= 149 ? 0 : 15;
    if (shipping > 0) {
        message += `Envío: S/ ${shipping.toFixed(2)}%0A`;
    } else {
        message += `Envío: Gratis%0A`;
    }

    const total = subtotal + shipping;
    message += `%0ATotal: S/ ${total.toFixed(2)}`;

    window.open(
        `https://wa.me/51958143259?text=${message}`,
        "_blank"
    );
}

checkoutBtn.addEventListener("click", () => {
    // Allow both logged in users and guests to checkout
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

// Initialize modals on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // TÉRMINOS
    const termsLink = document.querySelector('a[href="#terms"]');
    const termsModal = document.getElementById("termsModal");
    const closeTerms = document.getElementById("closeTerms");

    if (termsLink && termsModal && closeTerms) {
        termsLink.addEventListener("click", e => {
            e.preventDefault();
            termsModal.classList.add("show");
        });

        closeTerms.addEventListener("click", () => {
            termsModal.classList.remove("show");
        });

        // Close modal when clicking outside
        termsModal.addEventListener("click", (e) => {
            if (e.target === termsModal) {
                termsModal.classList.remove("show");
            }
        });
    }

    // POLÍTICAS
    const policyLink = document.querySelector('a[href="#policy"]');
    const policyModal = document.getElementById("policyModal");
    const closePolicy = document.getElementById("closePolicy");

    if (policyLink && policyModal && closePolicy) {
        policyLink.addEventListener("click", e => {
            e.preventDefault();
            policyModal.classList.add("show");
        });

        closePolicy.addEventListener("click", () => {
            policyModal.classList.remove("show");
        });

        // Close modal when clicking outside
        policyModal.addEventListener("click", (e) => {
            if (e.target === policyModal) {
                policyModal.classList.remove("show");
            }
        });
    }
});

updateCartCount();

/*********************************************/


/* ================= ENHANCED LOGIN / REGISTER SYSTEM ================= */

// User session management
class UserSession {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.init();
    }

    init() {
        this.checkSession();
        this.setupEventListeners();
    }

    checkSession() {
        const sessionData = localStorage.getItem("userSession");
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = Date.now();

                if (now - session.loginTime < this.sessionTimeout) {
                    this.currentUser = session.user;
                    this.updateUI();
                    return;
                } else {
                    this.logout();
                }
            } catch (e) {
                this.logout();
            }
        }

        // Check for backward compatibility with old login system
        const isLogged = localStorage.getItem("isLogged");
        const userName = localStorage.getItem("userName");

        if (isLogged === "true" && userName) {
            // Migrate old login to new system
            this.currentUser = {
                id: 'legacy_' + Date.now(),
                email: userName.includes('@') ? userName : `${userName}@legacy.com`,
                name: userName,
                isLegacy: true,
                loginTime: Date.now()
            };
            this.updateUI();
        }
    }

    login(userData) {
        this.currentUser = userData;
        const sessionData = {
            user: userData,
            loginTime: Date.now()
        };
        localStorage.setItem("userSession", JSON.stringify(sessionData));
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email || '');
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem("userSession");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        this.updateUI();
    }

    saveSession() {
        if (this.currentUser) {
            const sessionData = {
                user: this.currentUser,
                loginTime: this.currentUser.loginTime
            };
            localStorage.setItem("userSession", JSON.stringify(sessionData));
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateUI() {
        const loginBtn = document.getElementById("loginBtn");
        const accountNameEl = document.getElementById("accountName");

        if (this.isLoggedIn()) {
            const displayName = this.currentUser.name || this.currentUser.email?.split('@')[0] || 'Usuario';
            loginBtn.innerHTML = `<span class="user-icon">👤</span> ${displayName}`;
            loginBtn.classList.add('logged-in');

            // Update account modal name if element exists
            if (accountNameEl) {
                accountNameEl.textContent = displayName;
            }

            // Show welcome message on login (only once)
            if (!this.currentUser.welcomeShown) {
                const welcomeMsg = this.currentUser.isGuest ?
                    '¡Bienvenido como invitado! Puedes explorar nuestros productos 💖' :
                    `¡Bienvenido de vuelta, ${displayName}! 👋`;
                setTimeout(() => showNotification(welcomeMsg, 'success'), 500); // Delay to avoid duplicate notifications
                this.currentUser.welcomeShown = true;
                this.saveSession();
            }
        } else {
            loginBtn.innerHTML = `<span class="user-icon">👤</span>`;
            loginBtn.classList.remove('logged-in');

            // Reset account modal name if element exists
            if (accountNameEl) {
                accountNameEl.textContent = 'Samma Lover';
            }
        }
    }

    setupEventListeners() {
        const loginBtn = document.getElementById("loginBtn");
        const loginModal = document.getElementById("loginModal");
        const closeLogin = document.getElementById("closeLogin");
        const accountModal = document.getElementById("accountModal");

        loginBtn.addEventListener("click", e => {
            e.preventDefault();
            if (this.isLoggedIn()) {
                if (accountModal) accountModal.classList.add("show");
            } else {
                if (loginModal) loginModal.classList.add("show");
            }
        });

        if (closeLogin) {
            closeLogin.addEventListener("click", () => {
                if (loginModal) loginModal.classList.remove("show");
            });
        }
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static showError(input, message) {
        const inputGroup = input.closest('.input-group');
        let errorElement = inputGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        inputGroup.classList.add('error');
    }

    static clearError(input) {
        const inputGroup = input.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }
        inputGroup.classList.remove('error');
    }
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');

    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('Al menos 8 caracteres');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Una letra minúscula');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Una letra mayúscula');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Un número');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Un carácter especial');

    const strengthTexts = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente'];
    const strengthColors = ['#ff4444', '#ff8800', '#ffaa00', '#00aa00', '#00aa00'];

    strengthBar.style.width = `${(strength / 5) * 100}%`;
    strengthBar.style.backgroundColor = strengthColors[strength - 1] || '#ff4444';
    strengthText.textContent = strengthTexts[strength - 1] || 'Muy débil';
    strengthText.style.color = strengthColors[strength - 1] || '#ff4444';
}

// Initialize enhanced login system
const userSession = new UserSession();

// Enhanced form handling
document.addEventListener('DOMContentLoaded', function() {
    setupLoginForms();
    setupPasswordStrength();
});

function setupLoginForms() {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab + "Form").classList.add("active");
        });
    });

    // Login form
    const loginForm = document.getElementById("loginForm");
    let isSubmitting = false; // Prevent multiple submissions

    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;

        // Get form inputs
        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');

        if (!emailInput || !passwordInput) {
            console.error('Login form inputs not found');
            showNotification('Error en el formulario. Recarga la página.', 'error');
            isSubmitting = false;
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = loginForm.querySelector('#rememberMe')?.checked;

        console.log('Login attempt:', { email: email ? 'provided' : 'empty', passwordLength: password.length });

        // Clear previous errors
        loginForm.querySelectorAll('.input-group').forEach(group => {
            FormValidator.clearError(group.querySelector('input'));
        });

        // Validate inputs
        let isValid = true;
        if (!email || !FormValidator.validateEmail(email)) {
            FormValidator.showError(emailInput, 'Correo electrónico inválido');
            isValid = false;
        }
        if (!password || password.length < 1) {
            FormValidator.showError(passwordInput, 'Contraseña requerida');
            isValid = false;
        }

        if (!isValid) {
            console.log('Validation failed');
            isSubmitting = false;
            return;
        }

        console.log('Validation passed, proceeding with login');

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true);

        try {
            // Simulate API call
            await simulateApiCall();

            // Mock successful login - accept any email/password combination
            const userData = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0],
                loginTime: Date.now()
            };

            console.log('Login successful, user data:', userData);

            userSession.login(userData);

            // Close modal
            document.getElementById("loginModal").classList.remove("show");

            // Reset form
            loginForm.reset();

        } catch (error) {
            console.error('Login error:', error);
            showNotification('Error al iniciar sesión. Inténtalo de nuevo.', 'error');
        } finally {
            // Always reset loading state and submission flag
            setLoadingState(submitBtn, false);
            isSubmitting = false;
        }
    });

    // Register form
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", async e => {
        e.preventDefault();

        const name = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const confirmPassword = registerForm.querySelector('#confirmPassword')?.value;

        // Clear previous errors
        registerForm.querySelectorAll('.input-group').forEach(group => {
            FormValidator.clearError(group.querySelector('input'));
        });

        // Validate inputs
        let isValid = true;
        if (!name.trim()) {
            FormValidator.showError(registerForm.querySelector('input[type="text"]'), 'Nombre requerido');
            isValid = false;
        }
        if (!FormValidator.validateEmail(email)) {
            FormValidator.showError(registerForm.querySelector('input[type="email"]'), 'Correo electrónico inválido');
            isValid = false;
        }
        if (!FormValidator.validatePassword(password)) {
            FormValidator.showError(registerForm.querySelector('input[type="password"]'), 'Contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }
        if (confirmPassword && password !== confirmPassword) {
            FormValidator.showError(registerForm.querySelector('#confirmPassword'), 'Las contraseñas no coinciden');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true);

        try {
            // Simulate API call
            await simulateApiCall();

            // Mock successful registration
            const userData = {
                id: Date.now(),
                email: email,
                name: name,
                loginTime: Date.now()
            };

            userSession.login(userData);

            // Show success message
            showNotification('¡Cuenta creada exitosamente! Bienvenido a Samma.hub 💖', 'success');

            // Close modal
            document.getElementById("loginModal").classList.remove("show");

            // Reset form
            registerForm.reset();

        } catch (error) {
            showNotification('Error al crear la cuenta. Inténtalo de nuevo.', 'error');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });

    // Forgot password
    const forgotPassword = document.getElementById("forgotPassword");
    forgotPassword.addEventListener("click", async e => {
        e.preventDefault();

        const email = prompt('Ingresa tu correo electrónico para recuperar tu contraseña:');
        if (email && FormValidator.validateEmail(email)) {
            try {
                await simulateApiCall();
                showNotification('Se ha enviado un enlace de recuperación a tu correo electrónico 📧', 'success');
            } catch (error) {
                showNotification('Error al enviar el correo de recuperación', 'error');
            }
        } else if (email) {
            showNotification('Por favor ingresa un correo electrónico válido', 'error');
        }
    });

    // Guest login
    const guestLogin = document.getElementById("guestLogin");
    guestLogin.addEventListener("click", () => {
        const userData = {
            id: 'guest_' + Date.now(),
            email: null,
            name: 'Invitado',
            isGuest: true,
            loginTime: Date.now()
        };

        userSession.login(userData);
        showNotification('Has iniciado sesión como invitado 👤', 'info');
        document.getElementById("loginModal").classList.remove("show");
    });

    // Surprise me
    const surpriseMe = document.getElementById("surpriseMe");
    surpriseMe.addEventListener("click", () => {
        const products = document.querySelectorAll(".product-card");
        if (products.length > 0) {
            const randomIndex = Math.floor(Math.random() * products.length);
            products[randomIndex].scrollIntoView({ behavior: 'smooth' });
            document.getElementById("loginModal").classList.remove("show");
            showNotification('¡Te mostramos una prenda especial! ✨', 'info');
        }
    });
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    }
}

// Simulate API call delay
function simulateApiCall(delay = 1500) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

/* CART LOGIN BUTTONS */
document.getElementById("cartLoginBtn").addEventListener("click", () => {
    document.getElementById("cartLoginPrompt").style.display = "none";
    document.getElementById("loginModal").classList.add("show");
});

document.getElementById("cartGuestBtn").addEventListener("click", () => {
    const userData = {
        id: 'guest_' + Date.now(),
        email: null,
        name: 'Invitado',
        isGuest: true,
        loginTime: Date.now()
    };

    userSession.login(userData);
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


/* ================= MI CUENTA ================= */

const accountModal = document.getElementById("accountModal");
const closeAccount = document.getElementById("closeAccount");
const logoutBtn = document.getElementById("logoutBtn");
const openOrders = document.getElementById("openOrders");
const openWishlist = document.getElementById("openWishlist");
const openSettings = document.getElementById("openSettings");
const loginModal = document.getElementById("loginModal");

/* CERRAR */
closeAccount.addEventListener("click", () => {
    accountModal.classList.remove("show");
});

/* MIS PEDIDOS */
if (openOrders) {
    openOrders.addEventListener("click", () => {
        if (userSession.isLoggedIn()) {
            accountModal.classList.remove("show");
            document.getElementById("ordersModal").classList.add("show");
        } else {
            accountModal.classList.remove("show");
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.classList.add("show");
            showNotification("Debes iniciar sesión para ver tus pedidos", "info");
        }
    });
}

/* MIS FAVORITOS */
if (openWishlist) {
    openWishlist.addEventListener("click", () => {
        if (userSession.isLoggedIn()) {
            accountModal.classList.remove("show");
            document.getElementById("wishlistModal").classList.add("show");
            loadWishlist();
        } else {
            accountModal.classList.remove("show");
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.classList.add("show");
            showNotification("Debes iniciar sesión para ver tus favoritos", "info");
        }
    });
}

/* CONFIGURACIÓN */
if (openSettings) {
    openSettings.addEventListener("click", () => {
        if (userSession.isLoggedIn()) {
            accountModal.classList.remove("show");
            document.getElementById("settingsModal").classList.add("show");
            loadSettings();
        } else {
            accountModal.classList.remove("show");
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.classList.add("show");
            showNotification("Debes iniciar sesión para acceder a la configuración", "info");
        }
    });
}

/* LOGOUT */
logoutBtn.addEventListener("click", () => {
    userSession.logout();
    localStorage.removeItem("currentDiscount");
    accountModal.classList.remove("show");
    showNotification("👋 Sesión cerrada exitosamente", "success");
});

/* ================= FUNCIONALIDAD MODALES MI CUENTA ================= */

// Cerrar modales de Mi Cuenta
document.getElementById("closeOrders").addEventListener("click", () => {
    document.getElementById("ordersModal").classList.remove("show");
});

document.getElementById("closeWishlist").addEventListener("click", () => {
    document.getElementById("wishlistModal").classList.remove("show");
});

document.getElementById("closeSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.remove("show");
});

// Cargar configuración del usuario
function loadSettings() {
    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";
    const newsletterPref = localStorage.getItem("newsletterPref") !== "false";
    const orderUpdates = localStorage.getItem("orderUpdates") !== "false";
    const newArrivals = localStorage.getItem("newArrivals") !== "false";

    document.getElementById("userName").value = userName;
    document.getElementById("userEmail").value = userEmail;
    document.getElementById("newsletterPref").checked = newsletterPref;
    document.getElementById("orderUpdates").checked = orderUpdates;
    document.getElementById("newArrivals").checked = newArrivals;
}

// Guardar configuración del usuario
function saveSettings() {
    const userName = document.getElementById("userName").value.trim();
    const newsletterPref = document.getElementById("newsletterPref").checked;
    const orderUpdates = document.getElementById("orderUpdates").checked;
    const newArrivals = document.getElementById("newArrivals").checked;

    if (userName) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("newsletterPref", newsletterPref);
        localStorage.setItem("orderUpdates", orderUpdates);
        localStorage.setItem("newArrivals", newArrivals);

        // Actualizar nombre en el modal de cuenta
        document.getElementById("accountName").textContent = userName;

        showNotification("⚙️ Configuración guardada exitosamente", "success");
        document.getElementById("settingsModal").classList.remove("show");
    } else {
        showNotification("Por favor ingresa tu nombre", "error");
    }
}

// Cargar lista de favoritos
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const wishlistItems = document.getElementById("wishlistItems");

    if (wishlist.length === 0) {
        document.querySelector(".wishlist-empty").style.display = "block";
        wishlistItems.style.display = "none";
        return;
    }

    document.querySelector(".wishlist-empty").style.display = "none";
    wishlistItems.style.display = "grid";
    wishlistItems.innerHTML = "";

    wishlist.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "wishlist-item";
        productCard.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='assets/products/placeholder.jpg'">
                <button class="remove-wishlist" onclick="removeFromWishlist('${product.name}')">✕</button>
            </div>
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <p class="wishlist-price">S/ ${product.price}</p>
                <button class="btn-primary small" onclick="addToCartFromWishlist('${product.name}', ${product.price}, '${product.img}')">
                    <span class="btn-icon">🛒</span>
                    Agregar al carrito
                </button>
            </div>
        `;
        wishlistItems.appendChild(productCard);
    });
}

// Agregar producto al carrito desde favoritos
function addToCartFromWishlist(name, price, img) {
    const existing = cart.find(p => p.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price: parseFloat(price), img, qty: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification("Producto agregado al carrito 🛒", "success");
}

// Remover producto de favoritos
function removeFromWishlist(productName) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const updatedWishlist = wishlist.filter(product => product.name !== productName);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    loadWishlist();
    showNotification("Producto removido de favoritos", "info");
}

// Funcionalidad de wishlist en productos (agregar a favoritos)
function toggleWishlist(button) {
    const heartIcon = button.querySelector('span') || button;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent.replace('S/ ', '');
    const productImg = productCard.querySelector('.product-image').src;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existingIndex = wishlist.findIndex(product => product.name === productName);

    if (existingIndex >= 0) {
        // Remover de favoritos
        wishlist.splice(existingIndex, 1);
        heartIcon.textContent = '🤍';
        button.classList.remove('active');
        showNotification("Removido de favoritos", "info");
    } else {
        // Agregar a favoritos
        wishlist.push({
            name: productName,
            price: productPrice,
            img: productImg
        });
        heartIcon.textContent = '❤️';
        button.classList.add('active');
        showNotification("Agregado a favoritos ❤️", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

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
        `https://wa.me/51958143259?text=${message}`,
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
    const discountSection = document.getElementById('discountSection');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const freeShippingNotice = document.getElementById('freeShippingNotice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.querySelector('.btn-clear-cart');

    if (cart.length === 0) {
        cartSummary.style.display = 'none';
        discountSection.style.display = 'none';
        checkoutBtn.style.display = 'none';
        clearCartBtn.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';
    discountSection.style.display = 'block';
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
        currentDiscount = discount; // Store the discount percentage

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discountAmount = subtotal * discount;

        discountMessage.textContent = `¡Código aplicado! Ahorras S/ ${discountAmount.toFixed(2)} (${(discount * 100).toFixed(0)}% descuento)`;
        discountMessage.className = 'discount-message success';

        // Apply discount to total calculation
        updateCartSummaryWithDiscount(discount);

        // Save discount to localStorage
        localStorage.setItem('currentDiscount', discount.toString());
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
        let savedCart = localStorage.getItem(getUserCartKey());
        if (!savedCart) {
            // Try old keys for backward compatibility
            const sessionData = localStorage.getItem("userSession");
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    if (session.user && session.user.email) {
                        savedCart = localStorage.getItem(`cart_${session.user.email}`);
                    }
                } catch (e) {
                    console.warn('Error parsing session for old cart:', e);
                }
            }
            if (!savedCart) {
                savedCart = localStorage.getItem("cart_guest");
            }
            if (!savedCart) {
                const user = JSON.parse(localStorage.getItem("user") || 'null');
                if (user && user.email) {
                    savedCart = localStorage.getItem(`cart_${user.email}`);
                }
            }
        }
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
        }

        // Load saved discount
        const savedDiscount = localStorage.getItem('currentDiscount');
        if (savedDiscount) {
            currentDiscount = parseFloat(savedDiscount);
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

// Newsletter subscription function for footer
function subscribeNewsletterFooter() {
    const emailInput = document.getElementById('footerNewsletterEmail');
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Por favor ingresa tu correo electrónico', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un correo electrónico válido', 'error');
        return;
    }

    // Here you would typically send the email to your backend
    // For now, we'll just show a success message
    showNotification('¡Gracias por suscribirte! Recibirás nuestras últimas novedades 💖', 'success');
    emailInput.value = '';
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ================= SUPERIOR CATALOG FUNCTIONALITY ================= */

// Initialize catalog controls
document.addEventListener('DOMContentLoaded', function() {
    initializeCatalogControls();
});

function initializeCatalogControls() {
    // Filter tabs functionality
    const filterTabs = document.querySelectorAll('.filter-tab-superior');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyCatalogFilter(filter);
            updateActiveFilterTab(this);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('productSearch');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            applyCatalogSearch(searchTerm);
            toggleSearchClear(searchTerm.length > 0);
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            applyCatalogSearch('');
            toggleSearchClear(false);
        });
    }

    // Sort dropdown functionality
    const sortBtn = document.getElementById('sortBtn');
    const sortOptions = document.querySelectorAll('.sort-option');

    if (sortBtn) {
        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSortDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!sortBtn.contains(e.target)) {
                closeSortDropdown();
            }
        });
    }

    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortType = this.dataset.sort;
            applyCatalogSort(sortType);
            updateActiveSortOption(this);
            closeSortDropdown();
        });
    });

    // View controls functionality
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            applyCatalogView(viewType);
            updateActiveViewBtn(this);
        });
    });

    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
}

function applyCatalogFilter(filter) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    products.forEach(product => {
        const category = product.dataset.category;
        let shouldShow = false;

        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'tops':
                shouldShow = category && category.toLowerCase().includes('top');
                break;
            case 'basic polo shirts':
                shouldShow = category && category.toLowerCase().includes('polo');
                break;
            case 'Divers':
                shouldShow = category && category.toLowerCase().includes('buzo');
                break;
            case 'Coats and jackets':
                shouldShow = category && (category.toLowerCase().includes('abrigo') || category.toLowerCase().includes('casaca'));
                break;
            case 'Denim':
                shouldShow = category && category.toLowerCase().includes('denim');
                break;
            case 'Skirts and shorts':
                shouldShow = category && (category.toLowerCase().includes('falda') || category.toLowerCase().includes('short'));
                break;
            case 'Samma Sets':
                shouldShow = category && category.toLowerCase().includes('conjunto');
                break;
            default:
                shouldShow = true;
        }

        if (shouldShow) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Update tab counts
    updateFilterTabCounts();

    // Show notification
    showNotification(`Mostrando ${visibleCount} productos`, 'info');
}

function applyCatalogSearch(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const category = product.querySelector('.product-category').textContent.toLowerCase();
        const shouldShow = !searchTerm ||
            name.includes(searchTerm.toLowerCase()) ||
            category.includes(searchTerm.toLowerCase());

        if (shouldShow) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Show notification if searching
    if (searchTerm) {
        showNotification(`Encontrados ${visibleCount} productos para "${searchTerm}"`, 'info');
    }
}

function applyCatalogSort(sortType) {
    const productsGrid = document.querySelector('.products-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('S/ ', ''));
                const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('S/ ', ''));
                return priceA - priceB;

            case 'price-high':
                const priceHighA = parseFloat(a.querySelector('.current-price').textContent.replace('S/ ', ''));
                const priceHighB = parseFloat(b.querySelector('.current-price').textContent.replace('S/ ', ''));
                return priceHighB - priceHighA;

            case 'newest':
                // For demo purposes, sort by product name length (newer products have longer names)
                return b.querySelector('.product-name').textContent.length - a.querySelector('.product-name').textContent.length;

            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-count').textContent.replace('(', '').replace(')', ''));
                const ratingB = parseFloat(b.querySelector('.rating-count').textContent.replace('(', '').replace(')', ''));
                return ratingB - ratingA;

            case 'featured':
            default:
                // Keep original order for featured
                return 0;
        }
    });

    // Re-append sorted products
    products.forEach(product => {
        productsGrid.appendChild(product);
    });

    showNotification(`Productos ordenados por ${getSortLabel(sortType)}`, 'success');
}

function applyCatalogView(viewType) {
    const productsGrid = document.querySelector('.products-grid');

    if (viewType === 'list') {
        productsGrid.classList.add('list-view');
        productsGrid.classList.remove('grid-view');
    } else {
        productsGrid.classList.add('grid-view');
        productsGrid.classList.remove('list-view');
    }
}

function updateActiveFilterTab(activeTab) {
    document.querySelectorAll('.filter-tab-superior').forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');
}

function updateActiveSortOption(activeOption) {
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
    });
    activeOption.classList.add('active');

    // Update sort button text
    const sortBtn = document.getElementById('sortBtn');
    const sortText = sortBtn.querySelector('.sort-text');
    sortText.textContent = activeOption.textContent.trim();
}

function updateActiveViewBtn(activeBtn) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function toggleSortDropdown() {
    const sortDropdown = document.getElementById('sortBtn').parentElement;
    sortDropdown.classList.toggle('open');
}

function closeSortDropdown() {
    const sortDropdown = document.getElementById('sortBtn').parentElement;
    sortDropdown.classList.remove('open');
}

function toggleSearchClear(show) {
    const searchClear = document.getElementById('searchClear');
    if (searchClear) {
        searchClear.style.display = show ? 'block' : 'none';
    }
}

function updateFilterTabCounts() {
    const categories = {
        'all': document.querySelectorAll('.product-card').length,
        'tops': document.querySelectorAll('.product-card[data-category*="TOP"]').length,
        'basic polo shirts': document.querySelectorAll('.product-card[data-category*="POLO"]').length,
        'Divers': document.querySelectorAll('.product-card[data-category*="BUZO"]').length,
        'Coats and jackets': document.querySelectorAll('.product-card[data-category*="ABRIGO"], .product-card[data-category*="CASACA"]').length,
        'Denim': document.querySelectorAll('.product-card[data-category*="DENIM"]').length,
        'Skirts and shorts': document.querySelectorAll('.product-card[data-category*="FALDA"], .product-card[data-category*="SHORT"]').length,
        'Samma Sets': document.querySelectorAll('.product-card[data-category*="CONJUNTO"]').length
    };

    Object.keys(categories).forEach(filter => {
        const tab = document.querySelector(`.filter-tab-superior[data-filter="${filter}"]`);
        if (tab) {
            const countElement = tab.querySelector('.tab-count');
            if (countElement) {
                countElement.textContent = `(${categories[filter]})`;
            }
        }
    });
}

function getSortLabel(sortType) {
    const labels = {
        'featured': 'destacados',
        'price-low': 'precio menor a mayor',
        'price-high': 'precio mayor a menor',
        'newest': 'más recientes',
        'rating': 'mejor calificados'
    };
    return labels[sortType] || 'destacados';
}

// Enhanced load more functionality
function loadMoreProducts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.innerHTML;

    // Show loading state
    loadMoreBtn.innerHTML = '<span class="btn-icon">⏳</span> Cargando...';
    loadMoreBtn.disabled = true;

    // Simulate loading delay
    setTimeout(() => {
        // In a real application, this would fetch more products from an API
        // For demo purposes, we'll duplicate existing products
        const productsGrid = document.querySelector('.products-grid');
        const existingProducts = document.querySelectorAll('.product-card');
        const productsToAdd = 6; // Add 6 more products

        for (let i = 0; i < productsToAdd && i < existingProducts.length; i++) {
            const clone = existingProducts[i].cloneNode(true);

            // Update product name to indicate it's a duplicate
            const nameElement = clone.querySelector('.product-name');
            if (nameElement) {
                nameElement.textContent += ' (Nuevo)';
            }

            // Add to grid
            productsGrid.appendChild(clone);
        }

        // Update filter counts
        updateFilterTabCounts();

        // Reset button
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;

        showNotification(`Se cargaron ${productsToAdd} productos adicionales`, 'success');

        // Hide button if we've loaded enough products
        const totalProducts = document.querySelectorAll('.product-card').length;
        if (totalProducts > 30) {
            loadMoreBtn.style.display = 'none';
        }
    }, 2000);
}

// Initialize catalog on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing cart functionality
    loadCart();
    updateCartCount();

    // Initialize new catalog functionality
    initializeCatalogControls();
    updateFilterTabCounts();
});
