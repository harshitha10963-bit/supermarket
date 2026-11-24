
const products = [
    // Rice varieties
    {id:1, name:"Ponni Rice", category:"Rice", price:62, emoji:"🍚", unit:"kg"},
    {id:2, name:"Idli Rice", category:"Rice", price:55, emoji:"🍚", unit:"kg"},
    {id:3, name:"Basmati Rice", category:"Rice", price:95, emoji:"🍚", unit:"kg"},
    {id:4, name:"Raw Rice", category:"Rice", price:58, emoji:"🍚", unit:"kg"},

    // Dal varieties
    {id:5, name:"Toor Dal", category:"Dal", price:125, emoji:"🫘", unit:"kg"},
    {id:6, name:"Urad Dal", category:"Dal", price:115, emoji:"🫘", unit:"kg"},
    {id:7, name:"Moong Dal", category:"Dal", price:110, emoji:"🫘", unit:"kg"},
    {id:8, name:"Chana Dal", category:"Dal", price:85, emoji:"🫘", unit:"kg"},

    // Spices
    {id:9, name:"Turmeric Powder", category:"Spices", price:35, emoji:"🌶️", unit:"100 g"},
    {id:10, name:"Chilli Powder", category:"Spices", price:45, emoji:"🌶️", unit:"100 g"},
    {id:11, name:"Coriander Powder", category:"Spices", price:32, emoji:"🌿", unit:"100 g"},
    {id:12, name:"Cumin Seeds", category:"Spices", price:48, emoji:"🌿", unit:"100 g"},

    // Milk and chocolates
    {id:13, name:"Chocolate Milk", category:"Milk", price:30, emoji:"🥛", unit:"pack"},
    {id:14, name:"Fresh Milk", category:"Milk", price:28, emoji:"🥛", unit:"500 ml"},
    {id:15, name:"Chocolate Bar", category:"Milk", price:20, emoji:"🍫", unit:"piece"},

    // Vegetables
    {id:16, name:"Tomato", category:"Vegetables", price:30, emoji:"🍅", unit:"kg"},
    {id:17, name:"Onion", category:"Vegetables", price:40, emoji:"🧅", unit:"kg"},
    {id:18, name:"Potato", category:"Vegetables", price:35, emoji:"🥔", unit:"kg"},
    {id:19, name:"Carrot", category:"Vegetables", price:45, emoji:"🥕", unit:"kg"},

    // Snacks and crisps
    {id:20, name:"Potato Chips", category:"Snacks", price:20, emoji:"🍟", unit:"pack"},
    {id:21, name:"Banana Chips", category:"Snacks", price:35, emoji:"🍌", unit:"pack"},
    {id:22, name:"Mixture", category:"Snacks", price:30, emoji:"🥨", unit:"pack"},
    {id:23, name:"Biscuits", category:"Snacks", price:10, emoji:"🍪", unit:"pack"}
];

const cart = {};
let currentCategory = "All";

function money(amount) {
    return amount.toFixed(2);
}

// Display products
function displayProducts() {
    const search = document.getElementById("search").value.toLowerCase();

    const filtered = products.filter(product => {
        const categoryMatch =
            currentCategory === "All" ||
            product.category === currentCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    const container = document.getElementById("product-list");

    if (filtered.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="emoji">${product.emoji}</div>
            <h3>${product.name}</h3>
            <p>₹${money(product.price)} / ${product.unit}</p>
            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// Filter categories
function filterProducts(category) {
    currentCategory = category;
    displayProducts();
}

// Add products to cart
function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    displayCart();
}

// Change quantity
function changeQuantity(id, amount) {
    cart[id] += amount;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    displayCart();
}

// Remove item
function removeItem(id) {
    delete cart[id];
    displayCart();
}

// Display shopping cart and bill
function displayCart() {
    const cartContainer = document.getElementById("cart-items");

    let subtotal = 0;
    let html = "";

    for (let id in cart) {
        const product = products.find(p => p.id == id);
        const quantity = cart[id];
        const amount = product.price * quantity;

        subtotal += amount;

        html += `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong><br>
                    ₹${money(product.price)} × ${quantity}
                    <br>
                    <button onclick="changeQuantity(${id}, -1)">−</button>
                    <button onclick="changeQuantity(${id}, 1)">+</button>
                    <button onclick="removeItem(${id})">Remove</button>
                </div>
                <strong>₹${money(amount)}</strong>
            </div>
        `;
    }

    cartContainer.innerHTML = html ||
        "<p>Your cart is empty.</p>";

    document.getElementById("subtotal").textContent =
        money(subtotal);

    document.getElementById("total").textContent =
        money(subtotal);
}

// Place order through WhatsApp
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const ids = Object.keys(cart);

    if (ids.length === 0) {
        alert("Please add products to your cart!");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("address").value.trim();

    let subtotal = 0;
    let message = "Hello ACC Mini Supermarket! I want to place an order.\n\n";

    message += "Customer Name: " + name + "\n";
    message += "Phone: " + phone + "\n";
    message += "Address: " + address + "\n\n";
    message += "ORDER DETAILS:\n";

    ids.forEach(id => {
        const product = products.find(p => p.id == id);
        const quantity = cart[id];
        const amount = product.price * quantity;

        subtotal += amount;

        message += product.name + " (" + product.unit + ") x " +
            quantity + " = ₹" + money(amount) + "\n";
    });

    message += "\nSubtotal: ₹" + money(subtotal);
    message += "\nDelivery charge: Please confirm";
    message += "\nEstimated total before delivery: ₹" + money(subtotal);
    message += "\n\nPlease confirm my order. Thank you!";

    const whatsappNumber = "918098159525";

    const whatsappURL =
        "https://wa.me/" + whatsappNumber +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

displayProducts();
displayCart();

