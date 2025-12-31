document.addEventListener('DOMContentLoaded', () => {
  // ======= ELEMENTS =======
  const navLinks = document.querySelectorAll('nav a.nav-link');
  const pages = document.querySelectorAll('.page');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('nav');

  const chatToggle = document.getElementById('chatbotToggle');
  const chatContainer = document.getElementById('chatbotContainer');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatBody = document.getElementById('chatBody');

  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkoutPaybill');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const paybillInfo = document.getElementById('paybill-info');

  const servicesList = document.getElementById('services-list');
  const productList = document.getElementById('product-list');

  const adminModal = document.getElementById('adminModal');
  const adminBtn = document.getElementById('adminLoginBtn');
  const closeAdmin = document.getElementById('closeAdmin');
  const addProductBtn = document.getElementById('addProductBtn');
  const adminName = document.getElementById('admin-name');
  const adminPrice = document.getElementById('admin-price');
  const adminList = document.getElementById('admin-list');

  let cart = [];

  // ======= NAVIGATION =======
  function showPage(id) {
    pages.forEach(p => p.classList.add('hidden-section'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden-section');
    history.replaceState(null, '', `#${id}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.getAttribute('href').replace('#', '');
      showPage(section);
      if (nav.classList.contains('open')) nav.classList.remove('open');
    });
  });

  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

  // ======= HERO SLIDESHOW =======
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);

  // ======= CHATBOT =======
  chatToggle.addEventListener('click', () => chatContainer.classList.toggle('hidden-section'));
  chatClose.addEventListener('click', () => chatContainer.classList.add('hidden-section'));

  function addMessage(text, type = 'bot-message', html = false) {
    const div = document.createElement('div');
    div.className = type;
    if (html) div.innerHTML = text;
    else div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function processChatMessage(text) {
    text = text.toLowerCase();

    if (text.includes('service') || text.includes('services')) {
      fetch('data/services.json')
        .then(res => res.json())
        .then(data => {
          if (!data.length) return addMessage('No services available.');
          addMessage('Here are our services:', 'bot-message');
          data.forEach(s => {
            addMessage(`
              <div style="border:1px solid #ccc; padding:8px; margin:5px 0; border-radius:8px;">
                <strong>${s.name}</strong><br>
                <small>${s.shortDescription}</small>
              </div>
            `, 'bot-message', true);
          });
        });
    } else if (text.includes('product') || text.includes('products')) {
      fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
          if (!data.length) return addMessage('No products available.');
          addMessage('Here are our products:', 'bot-message');
          data.forEach(p => {
            addMessage(`
              <div style="border:1px solid #ccc; padding:8px; margin:5px 0; border-radius:8px;">
                <i class="fas ${p.icon}"></i> <strong>${p.name}</strong> - KES ${p.price}<br>
                <small>${p.description}</small>
              </div>
            `, 'bot-message', true);
          });
        });
    } else if (text.includes('contact')) {
      showPage('contact');
      addMessage('You can contact us via phone, email, or WhatsApp.');
    } else if (text.includes('location')) {
      showPage('locations');
      addMessage('Check our locations on the map above.');
    } else if (text.includes('cart')) {
      showPage('cart');
      addMessage('Your cart is displayed above.');
    } else {
      addMessage('Type "services", "products", "contact", "location", or "cart" for info.');
    }
  }

  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user-message');
    chatInput.value = '';
    processChatMessage(text);
  });

  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') chatSend.click(); });

  // ======= LOAD SERVICES & PRODUCTS =======
  function loadServices() {
    fetch('data/services.json')
      .then(res => res.json())
      .then(data => {
        servicesList.innerHTML = '';
        data.forEach(s => {
          const div = document.createElement('div');
          div.className = 'service';
          div.innerHTML = `
            <i class="service-icon fas ${s.icon}"></i>
            <h3>${s.name}</h3>
            <p>${s.shortDescription}</p>
          `;
          servicesList.appendChild(div);
        });
      });
  }

  function loadProducts() {
    fetch('data/products.json')
      .then(res => res.json())
      .then(data => {
        productList.innerHTML = '';
        data.forEach(p => {
          const div = document.createElement('div');
          div.className = 'product';
          div.innerHTML = `
            <i class="product-icon fas ${p.icon}"></i>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <strong>KES ${p.price}</strong>
            <button class="cta-btn add-to-cart">Add to Cart</button>
          `;
          const btn = div.querySelector('.add-to-cart');
          btn.addEventListener('click', () => {
            cart.push(p);
            updateCart();
          });
          productList.appendChild(div);
        });
      });
  }

  function updateCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.textContent = `${item.name} - KES ${item.price}`;
      cartItemsDiv.appendChild(div);
      total += item.price;
    });
    cartTotal.textContent = `Total: KES ${total}`;
  }

  checkoutBtn.addEventListener('click', () => paybillInfo.classList.toggle('hidden-section'));
  confirmPaymentBtn.addEventListener('click', () => {
    alert('Payment confirmation sent via WhatsApp!');
  });

  // ======= ADMIN MODAL =======
  adminBtn.addEventListener('click', () => adminModal.classList.remove('hidden'));
  closeAdmin.addEventListener('click', () => adminModal.classList.add('hidden'));
  addProductBtn.addEventListener('click', () => {
    const name = adminName.value.trim();
    const price = parseFloat(adminPrice.value);
    if (!name || isNaN(price)) return alert('Enter valid product info');
    const li = document.createElement('li');
    li.textContent = `${name} - KES ${price}`;
    adminList.appendChild(li);
    adminName.value = '';
    adminPrice.value = '';
  });

  // ======= INITIAL LOAD =======
  if (window.location.hash) {
    showPage(window.location.hash.replace('#', ''));
  } else {
    showPage('home');
  }
  loadServices();
  loadProducts();
});
