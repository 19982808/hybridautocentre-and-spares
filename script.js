document.addEventListener('DOMContentLoaded', () => {
  // ===== ELEMENTS =====
  const servicesList = document.getElementById('services-list');
  const productsList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkoutPaybill');
  const paybillInfo = document.getElementById('paybill-info');

  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('nav');

  let cart = [];

  // ===== NAVBAR MENU TOGGLE =====
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

  // ===== PAGE SWITCHING =====
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden-section'));
    const page = document.getElementById(pageId);
    if (page) page.classList.remove('hidden-section');
    window.scrollTo(0, 0);
    history.replaceState(null, '', `#${pageId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      showPage(id);
      nav.classList.remove('open');
    });
  });

  // ===== FETCH SERVICES =====
  fetch('services.json')
    .then(res => res.json())
    .then(services => {
      services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'service';
        div.innerHTML = `
          <i class="service-icon fa ${service.icon}"></i>
          <h3>${service.title}</h3>
          <p>${service.shortDescription}</p>
          <button class="cta-btn service-more">Read More</button>
        `;
        div.querySelector('.service-more').addEventListener('click', () => {
          alert(service.fullDescription);
        });
        servicesList.appendChild(div);
      });
    })
    .catch(err => console.error('Error loading services:', err));

  // ===== FETCH PRODUCTS =====
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <i class="product-icon fa ${product.icon}"></i>
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <strong>KES ${product.price}</strong><br>
          <button class="cta-btn add-to-cart">Add to Cart</button>
        `;
        div.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
        productsList.appendChild(div);
      });
    })
    .catch(err => console.error('Error loading products:', err));

  // ===== CART FUNCTIONS =====
  function addToCart(product) {
    cart.push(product);
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerHTML = `${item.title} - KES ${item.price} 
        <button data-index="${index}" class="remove-btn">Remove</button>`;
      div.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(index));
      cartItems.appendChild(div);
      total += item.price;
    });
    cartCount.textContent = cart.length;
    cartTotal.textContent = `Total: KES ${total}`;
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert('Your cart is empty!');
    paybillInfo.classList.remove('hidden-section');
  });

  // ===== CHATBOT =====
  chatbotToggle.addEventListener('click', () => chatbotContainer.classList.toggle('hidden-section'));
  chatClose.addEventListener('click', () => chatbotContainer.classList.add('hidden-section'));

  function addChatMessage(msg, sender='bot') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.className = sender === 'bot' ? 'bot-message' : 'user-message';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function processChat(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('service') || msg.includes('services')) {
      addChatMessage('Check the Our Services section for all services.');
      showPage('our-services');
    } else if (msg.includes('product') || msg.includes('products')) {
      addChatMessage('Check the Our Products section for all products.');
      showPage('products');
    } else if (msg.includes('cart')) {
      addChatMessage('Here is your cart.');
      showPage('cart');
    } else if (msg.includes('location')) {
      addChatMessage('Our locations are listed in the Locations section.');
      showPage('locations');
    } else if (msg.includes('contact')) {
      addChatMessage('Contact us via phone, email, or WhatsApp.');
      showPage('contact');
    } else {
      addChatMessage('I can help you with services, products, cart, location, or contact.');
    }
  }

  chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addChatMessage(msg, 'user');
    chatInput.value = '';
    setTimeout(() => processChat(msg), 300);
  });

  chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') chatSend.click();
  });

  // ===== HERO SLIDES =====
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  function showSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4000);

  // ===== INITIAL PAGE =====
  if (window.location.hash) showPage(window.location.hash.replace('#',''));
  else showPage('home');
});
