const products = [
    {
        id: 1,
        name: "Velocity Red",
        category: "Running",
        price: 2499,
        oldPrice: 3299,
        badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Cloud Runner",
        category: "Running",
        price: 2899,
        oldPrice: 3599,
        badge: "NEW DROP",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Street Classic",
        category: "Lifestyle",
        price: 2199,
        oldPrice: 2799,
        badge: "",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Night Shift",
        category: "Streetwear",
        price: 3199,
        oldPrice: 3999,
        badge: "LIMITED",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Pure Motion",
        category: "Lifestyle",
        price: 1999,
        oldPrice: 2499,
        badge: "",
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Urban Flex",
        category: "Streetwear",
        price: 2799,
        oldPrice: 3499,
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Everyday Low",
        category: "Lifestyle",
        price: 1899,
        oldPrice: 2399,
        badge: "",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Track Legend",
        category: "Running",
        price: 3499,
        oldPrice: 4299,
        badge: "TOP PICK",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80"
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");

const subtotalDisplay = document.getElementById("subtotal");
const discountDisplay = document.getElementById("discount");
const deliveryDisplay = document.getElementById("delivery");
const totalDisplay = document.getElementById("total");

const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");

const checkoutDialog = document.getElementById("checkoutDialog");
const checkoutForm = document.getElementById("checkoutForm");

let activeCategory = "All";
let searchTerm = "";
let cart = [];
let appliedCoupon = null;
let toastTimer;

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

function money(amount) {
    return currency.format(amount);
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500);
}

function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchText =
            `${product.name} ${product.category}`.toLowerCase();

        const matchesSearch = searchText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name} sneaker"
                    loading="lazy"
                >

                ${product.badge
                    ? `<span class="product-badge">${product.badge}</span>`
                    : ""}

                <button class="quick-add" data-add="${product.id}">
                    Add to bag ＋
                </button>
            </div>

            <div class="product-meta">
                <div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                </div>

                <div>
                    <p class="product-price">${money(product.price)}</p>
                    <span class="product-old-price">${money(product.oldPrice)}</span>
                </div>
            </div>
        </article>
    `).join("");

    emptyState.hidden = filteredProducts.length !== 0;
}

function getProduct(productId) {
    return products.find(product => product.id === productId);
}

function addToCart(productId) {
    const item = cart.find(entry => entry.id === productId);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    renderCart();
    showToast(`${getProduct(productId).name} added to your bag`);
}

function changeQuantity(productId, amount) {
    const item = cart.find(entry => entry.id === productId);

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.id !== productId);
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    showToast("Item removed from your bag");
}

function getSubtotal() {
    return cart.reduce((sum, item) => {
        const product = getProduct(item.id);

        return sum + product.price * item.quantity;
    }, 0);
}

function getDiscount(subtotal) {
    if (!appliedCoupon) {
        return 0;
    }

    if (subtotal < appliedCoupon.minimum) {
        return 0;
    }

    return Math.round(subtotal * appliedCoupon.rate);
}

function getDelivery(subtotal) {
    if (subtotal === 0 || subtotal >= 2999) {
        return 0;
    }

    return 99;
}

function renderCart() {
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
    drawerCount.textContent = `(${totalItems})`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your bag is waiting for its first pair.
            </p>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => {
            const product = getProduct(item.id);

            return `
                <article class="cart-item">
                    <img src="${product.image}" alt="${product.name}">

                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <p>${money(product.price)} each</p>

                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button
                                    data-quantity="${product.id}"
                                    data-change="-1"
                                    aria-label="Decrease ${product.name} quantity"
                                >−</button>

                                <span>${item.quantity}</span>

                                <button
                                    data-quantity="${product.id}"
                                    data-change="1"
                                    aria-label="Increase ${product.name} quantity"
                                >+</button>
                            </div>

                            <button class="remove-item"
                                    data-remove="${product.id}">
                                Remove
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    }

    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const delivery = getDelivery(subtotal);
    const total = Math.max(0, subtotal - discount + delivery);

    subtotalDisplay.textContent = money(subtotal);
    discountDisplay.textContent = `−${money(discount)}`;
    deliveryDisplay.textContent =
        delivery === 0 && subtotal > 0 ? "FREE" : money(delivery);

    totalDisplay.textContent = money(total);

    if (appliedCoupon && subtotal < appliedCoupon.minimum) {
        couponMessage.textContent =
            `Add items worth ${money(appliedCoupon.minimum - subtotal)} more to use this code.`;
    }

    if (appliedCoupon && subtotal >= appliedCoupon.minimum) {
        couponMessage.textContent =
            `${appliedCoupon.code} applied successfully!`;
    }

    if (!appliedCoupon) {
        couponMessage.textContent = "";
    }
}

const coupons = {
    SOLE10: {
        code: "SOLE10",
        rate: 0.10,
        minimum: 1000
    },

    FRESH15: {
        code: "FRESH15",
        rate: 0.15,
        minimum: 3000
    },

    STUDENT20: {
        code: "STUDENT20",
        rate: 0.20,
        minimum: 5000
    }
};

function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();

    if (cart.length === 0) {
        appliedCoupon = null;
        couponMessage.textContent =
            "Add a product before applying a coupon.";
        renderCart();
        return;
    }

    const coupon = coupons[code];

    if (!coupon) {
        appliedCoupon = null;
        couponMessage.textContent =
            "Invalid code. Try SOLE10, FRESH15, or STUDENT20.";
        renderCart();
        couponMessage.textContent =
            "Invalid code. Try SOLE10, FRESH15, or STUDENT20.";
        return;
    }

    if (getSubtotal() < coupon.minimum) {
        appliedCoupon = null;
        renderCart();

        couponMessage.textContent =
            `${code} requires a subtotal of at least ${money(coupon.minimum)}.`;

        return;
    }

    appliedCoupon = coupon;
    renderCart();

    showToast(`${code} discount applied`);
}

function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("visible");

    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    document.getElementById("closeCart").focus();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("visible");

    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function openCheckout() {
    if (cart.length === 0) {
        showToast("Add a sneaker to your bag first");
        return;
    }

    closeCart();

    if (typeof checkoutDialog.showModal === "function") {
        checkoutDialog.showModal();
    } else {
        showToast("Your browser does not support the demo checkout dialog");
    }
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) {
        return;
    }

    addToCart(Number(button.dataset.add));
});

filters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) {
        return;
    }

    activeCategory = button.dataset.category;

    filters.querySelectorAll(".filter").forEach(filter => {
        const selected = filter === button;

        filter.classList.toggle("active", selected);
        filter.setAttribute("aria-pressed", String(selected));
    });

    renderProducts();
});

searchInput.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
});

document.getElementById("searchToggle").addEventListener("click", () => {
    searchInput.focus();

    document.getElementById("shop").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

document.getElementById("applyCoupon").addEventListener("click", applyCoupon);

couponInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        applyCoupon();
    }
});

document.getElementById("checkoutButton").addEventListener(
    "click",
    openCheckout
);

document.getElementById("closeCheckout").addEventListener("click", () => {
    checkoutDialog.close();
});

checkoutDialog.addEventListener("click", event => {
    if (event.target === checkoutDialog) {
        checkoutDialog.close();
    }
});

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();

    if (!name) {
        showToast("Please enter a name");
        return;
    }

    const orderNumber = "SS-DEMO-" +
        Math.floor(100000 + Math.random() * 900000);

    checkoutDialog.close();

    showToast(`Demo complete! ${orderNumber} — thank you, ${name}.`);

    cart = [];
    appliedCoupon = null;
    couponInput.value = "";

    renderCart();
    checkoutForm.reset();
});

document.getElementById("menuToggle").addEventListener("click", event => {
    const navigation = document.getElementById("navigation");
    const isOpen = navigation.classList.toggle("open");

    event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navigation").classList.remove("open");
        document.getElementById("menuToggle")
            .setAttribute("aria-expanded", "false");
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();

        document.getElementById("navigation").classList.remove("open");

        document.getElementById("menuToggle")
            .setAttribute("aria-expanded", "false");
    }
});

renderProducts();
renderCart();
