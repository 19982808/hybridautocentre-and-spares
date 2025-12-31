// ================= SPA NAVIGATION =================
const hero = document.querySelector(".hero");
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(id) {
  pages.forEach(p => p.classList.add("hidden-section"));
  if (id === "#home") {
    hero.classList.remove("hidden-section");
  } else {
    hero.classList.add("hidden-section");
    const page = document.querySelector(id);
    if (page) page.classList.remove("hidden-section");
  }

  navLinks.forEach(l => l.classList.remove("active"));
  document.querySelector(`a[href="${id}"]`)?.classList.add("active");
  history.pushState(null, "", id);
}

// Navbar toggle for mobile
const menuToggle = document.getElementById("menuToggle");
if (menuToggle) {
  menuToggle.onclick = () => document.querySelector("nav").classList.toggle("open");
}

// SPA link clicks
navLinks.forEach(l => {
  l.addEventListener("click", e => {
    e.preventDefault();
    showPage(l.getAttribute("href"));
    document.querySelector("nav").classList.remove("open");
  });
});

// Initialize page
showPage(location.hash || "#home");

// ================= HERO SLIDESHOW =================
const slides = document.querySelectorAll(".slide");
let slideIndex = 0;
setInterval(() => {
  if (!hero.classList.contains("hidden-section")) {
    slides.forEach(sl => sl.classList.remove("active"));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }
}, 5000);

// ================= LOAD SERVICES & PRODUCTS =================
async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

async function populateServices() {
  const services = await loadJSON("data/services.json");
  const container = document.getElementById("services-list");
  services.forEach(s => {
    const div = document.createElement("div");
    div.className = "service";
    div.innerHTML = `
      <i class="fa-solid ${s.icon} service-icon"></i>
      <h3>${s.name}</h3>
      <p>${s.fullDescription}</p>
    `;
    container.appendChild(div);
  });
}

async function populateProducts() {
  const products = await loadJSON("data/products.json");
  const container = document.getElementById("product-list");
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <i class="fa-solid ${p.icon} product-icon"></i>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p>Price: KES ${p.price}</p>
      <button class="cta-btn add-to-cart-btn" data-name="${p.name}" data-price="${p.price}">Buy Now</button>
    `;
    container.appendChild(div);
  });

  // Attach cart events after products are added
  attachCartEvents();
}

// ================= CART =================
let cart = [];

function attachCartEvents() {
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.onclick = () => {
      cart.push({ name: btn.dataset.name, price: Number(btn.dataset.price) });
      updateCart();
    };
  });
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  let total = 0;
  cartItems.innerHTML = "";
  cart.forEach(item => {
    cartItems.innerHTML += `${item.name} - KES ${item.price}<br>`;
    total += item.price;
  });
  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("cart-total").textContent = `Total: KES ${total}`;
}

// Checkout via Paybill
const checkoutBtn = document.getElementById("checkoutPaybill");
checkoutBtn.onclick = () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  document.getElementById("paybill-info").classList.remove("hidden-section");
};

// WhatsApp Payment Confirmation
const confirmBtn = document.getElementById("confirmPaymentBtn");
confirmBtn.onclick = () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  let msg = "Payment Confirmation for Order:%0A";
  let total = 0;
  cart.forEach(i => { msg += `${i.name} - KES ${i.price}%0A`; total += i.price; });
  msg += `Total Paid: KES ${total}`;
  window.open(`https://wa.me/254780328599?text=${msg}`);
};

// ================= BOOK NOW =================
const shopNowBtn = document.getElementById("shopNowBtn");
shopNowBtn.onclick = () => showPage("#products");

// ================= ADMIN MODAL =================
const modal = document.getElementById("adminModal");
const adminBtn = document.getElementById("adminLoginBtn");
const closeAdmin = document.getElementById("closeAdmin");
if (adminBtn && modal) adminBtn.onclick = () => modal.classList.remove("hidden");
if (closeAdmin && modal) closeAdmin.onclick = () => modal.classList.add("hidden");

const addProductBtn = document.getElementById("addProductBtn");
if (addProductBtn) {
  addProductBtn.onclick = () => {
    const name = document.getElementById("admin-name").value;
    const price = Number(document.getElementById("admin-price").value);
    if (name && price) {
      cart.push({ name, price });
      updateCart();
    }
    document.getElementById("admin-name").value = "";
    document.getElementById("admin-price").value = "";
  };
}

// ================= FLOATING CHATBOT =================
const chatbotBtn = document.getElementById("chatbotToggle");
const chatbot = document.getElementById("chatbotContainer");
const chatClose = document.getElementById("chatClose");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

chatbotBtn.onclick = () => chatbot.classList.toggle("hidden-section");
chatClose.onclick = () => chatbot.classList.add("hidden-section");

// Chatbot functionality
async function getAllItems() {
  const services = await loadJSON("data/services.json");
  const products = await loadJSON("data/products.json");
  return { services, products };
}

chatSend.onclick = async () => {
  const query = chatInput.value.toLowerCase();
  if (!query) return;
  const { services, products } = await getAllItems();
  let response = "Sorry, I couldn't find any matching service or product.";

  // Match products
  const matchedProduct = products.find(p => p.name.toLowerCase().includes(query));
  if (matchedProduct) {
    response = `Product: ${matchedProduct.name} - KES ${matchedProduct.price}`;
  }

  // Match services
  const matchedService = services.find(s => s.name.toLowerCase().includes(query));
  if (matchedService) {
    response = `Service: ${matchedService.name} - ${matchedService.shortDescription}`;
  }

  chatBody.innerHTML += `<p><strong>You:</strong> ${chatInput.value}</p>`;
  chatBody.innerHTML += `<p><strong>Bot:</strong> ${response}</p>`;
  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
};

// Initialize
populateServices();
populateProducts();
