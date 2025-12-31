// ================= SPA NAVIGATION =================
const hero = document.querySelector(".hero");
const pages = document.querySelectorAll("section");
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

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.getAttribute("href"));
    document.querySelector("nav").classList.remove("open");
  });
});

// Navbar mobile toggle
const menuToggle = document.getElementById("menuToggle");
menuToggle?.addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("open");
});

// Initialize page
showPage(location.hash || "#home");

// ================= HERO SLIDESHOW =================
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
setInterval(() => {
  if (!hero.classList.contains("hidden-section")) {
    slides.forEach(sl => sl.classList.remove("active"));
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }
}, 5000);

// ================= CART =================
let cart = [];
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

// Add to cart buttons
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const name = e.target.dataset.name;
    const price = Number(e.target.dataset.price);
    cart.push({ name, price });
    updateCart();
    alert(`${name} added to cart!`);
  }
});

// Checkout Paybill
document.getElementById("checkoutPaybill")?.addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  document.getElementById("paybill-info").classList.remove("hidden-section");
});

// WhatsApp payment confirmation
document.getElementById("confirmPaymentBtn")?.addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  let msg = "Payment Confirmation for Order:%0A";
  let total = 0;
  cart.forEach(i => { msg += `${i.name} - KES ${i.price}%0A`; total += i.price; });
  msg += `Total Paid: KES ${total}`;
  window.open(`https://wa.me/254780328599?text=${msg}`);
});

// ================= BOOK SERVICE BUTTON =================
document.getElementById("bookServiceBtn")?.addEventListener("click", () => {
  showPage("#products");
});

// ================= ADMIN MODAL =================
const modal = document.getElementById("adminModal");
const adminBtn = document.getElementById("adminLoginBtn");
const closeAdmin = document.getElementById("closeAdmin");

adminBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
closeAdmin?.addEventListener("click", () => modal.classList.add("hidden"));

document.getElementById("addProductBtn")?.addEventListener("click", () => {
  const name = document.getElementById("admin-name").value;
  const price = Number(document.getElementById("admin-price").value);
  if (name && price) {
    cart.push({ name, price });
    updateCart();
  }
  document.getElementById("admin-name").value = "";
  document.getElementById("admin-price").value = "";
});

// ================= LOAD PRODUCTS & SERVICES JSON =================
async function loadJSON(file, containerSelector, type) {
  try {
    const res = await fetch(file);
    const data = await res.json();
    const container = document.querySelector(containerSelector);
    container.innerHTML = "";
    data.forEach(item => {
      const el = document.createElement("div");
      el.classList.add(type);
      el.innerHTML = `
        ${type === "product" ? `<i class="fa-solid ${item.icon} product-icon"></i>` : `<img src="${item.image}" alt="${item.title}">`}
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${type === "product" ? `<p>Price: KES ${item.price}</p>
        <button class="cta-btn add-to-cart-btn" data-name="${item.title}" data-price="${item.price}">Buy Now</button>` : ""}
      `;
      container.appendChild(el);
    });
  } catch(err) {
    console.error("Error loading JSON:", err);
  }
}

// Load products.json and services.json
loadJSON("json/products.json", "#product-list", "product");
loadJSON("json/services.json", "#service-list", "service");

// ================= FLOATING CHATBOT =================
const chatbotBtn = document.createElement("button");
chatbotBtn.classList.add("chatbot-floating");
chatbotBtn.innerHTML = '<i class="fa-solid fa-comment"></i>';
document.body.appendChild(chatbotBtn);

const chatbotWindow = document.createElement("div");
chatbotWindow.classList.add("chatbot", "hidden-section");
chatbotWindow.innerHTML = `
  <div class="chat-header">
    Chat with us
    <span id="closeChat" style="cursor:pointer;">&times;</span>
  </div>
  <div class="chat-body" id="chatBody"></div>
  <input type="text" id="chatInput" placeholder="Type a message...">
  <button id="chatSend">Send</button>
`;
document.body.appendChild(chatbotWindow);

chatbotBtn.addEventListener("click", () => chatbotWindow.classList.toggle("hidden-section"));
document.getElementById("closeChat")?.addEventListener("click", () => chatbotWindow.classList.add("hidden-section"));

// Chatbot logic (fetch from both JSON)
async function getChatData() {
  const products = await (await fetch("json/products.json")).json();
  const services = await (await fetch("json/services.json")).json();
  return [...products.map(p => p.title), ...services.map(s => s.title)];
}

document.getElementById("chatSend")?.addEventListener("click", async () => {
  const input = document.getElementById("chatInput");
  const body = document.getElementById("chatBody");
  if (!input.value) return;
  const chatData = await getChatData();
  let reply = "Sorry, I don't understand. Try these: " + chatData.join(", ");
  if (chatData.includes(input.value)) reply = `You asked about ${input.value}, we can help!`;
  body.innerHTML += `<div><strong>You:</strong> ${input.value}</div>`;
  body.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
  input.value = "";
  body.scrollTop = body.scrollHeight;
});
