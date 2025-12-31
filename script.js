document.addEventListener('DOMContentLoaded', () => {
    // ===== HERO SLIDESHOW =====
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
    }
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    showSlide(currentSlide);
    setInterval(nextSlide, 4000);

    // ===== NAVIGATION / SPA =====
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        pages.forEach(p => p.classList.add('hidden-section'));
        const target = document.getElementById(pageId);
        if (target) target.classList.remove('hidden-section');
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.getAttribute('href').replace('#', '');
            showPage(id);
        });
    });

    if (window.location.hash) {
        showPage(window.location.hash.replace('#',''));
    } else {
        showPage('home');
    }

    // ===== MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');
    menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

    // ===== LOAD SERVICES =====
    fetch('data/services.json')
    .then(res => res.json())
    .then(services => {
        const servicesList = document.getElementById('services-list');
        services.forEach(s => {
            const div = document.createElement('div');
            div.className = 'service';
            div.innerHTML = `
                <i class="fa ${s.icon} service-icon"></i>
                <h3>${s.name}</h3>
                <p>${s.shortDescription}</p>
            `;
            servicesList.appendChild(div);
        });
    }).catch(err => console.error('Error loading services:', err));

    // ===== LOAD PRODUCTS =====
    fetch('data/products.json')
    .then(res => res.json())
    .then(products => {
        const productList = document.getElementById('product-list');
        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <i class="fa ${p.icon} product-icon"></i>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p><strong>KES ${p.price}</strong></p>
                <button class="cta-btn add-to-cart" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
            `;
            productList.appendChild(div);
        });

        // Add to cart buttons
        const cartCount = document.getElementById('cart-count');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        let cart = [];

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                cart.push({name, price});
                cartCount.textContent = cart.length;

                const itemDiv = document.createElement('div');
                itemDiv.textContent = `${name} - KES ${price}`;
                cartItemsDiv.appendChild(itemDiv);

                const total = cart.reduce((sum, item) => sum + item.price, 0);
                cartTotal.textContent = `Total: KES ${total}`;
            });
        });
    }).catch(err => console.error('Error loading products:', err));

    // ===== CART CHECKOUT =====
    const checkoutBtn = document.getElementById('checkoutPaybill');
    const paybillInfo = document.getElementById('paybill-info');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        paybillInfo.classList.remove('hidden-section');
    });

    // ===== ADMIN MODAL =====
    const adminBtn = document.getElementById('adminLoginBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdmin = document.getElementById('closeAdmin');
    adminBtn.addEventListener('click', () => adminModal.classList.remove('hidden'));
    closeAdmin.addEventListener('click', () => adminModal.classList.add('hidden'));

    const addProductBtn = document.getElementById('addProductBtn');
    const adminList = document.getElementById('admin-list');
    addProductBtn.addEventListener('click', () => {
        const name = document.getElementById('admin-name').value;
        const price = parseFloat(document.getElementById('admin-price').value);
        if(!name || !price) return alert('Fill both name and price!');
        const li = document.createElement('li');
        li.textContent = `${name} - KES ${price}`;
        adminList.appendChild(li);
    });

    // ===== FLOATING CHATBOT =====
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    chatbotToggle.addEventListener('click', () => chatbotContainer.classList.toggle('hidden-section'));
    chatClose.addEventListener('click', () => chatbotContainer.classList.add('hidden-section'));

    function addChatMessage(text, type='bot') {
        const div = document.createElement('div');
        div.textContent = text;
        div.className = type === 'bot' ? 'bot-message' : 'user-message';
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function processChat(text) {
        text = text.toLowerCase();
        if(text.includes('service')) {
            fetch('data/services.json').then(r=>r.json()).then(data=>{
                if(!data.length) return addChatMessage('No services found');
                data.forEach(s => addChatMessage(`${s.name}: ${s.shortDescription}`));
            });
        } else if(text.includes('product')) {
            fetch('data/products.json').then(r=>r.json()).then(data=>{
                if(!data.length) return addChatMessage('No products found');
                data.forEach(p => addChatMessage(`${p.name} - KES ${p.price}`));
            });
        } else if(text.includes('contact')) {
            addChatMessage('Call: +254780328599 or +254700123456 | Email: info@hybridgarage.co.ke');
        } else if(text.includes('location')) {
            addChatMessage('We have two locations: Kirinyaga Road, Nairobi & Thika Road Garage Branch');
        } else {
            addChatMessage('Try typing "services", "products", "contact", or "location"');
        }
    }

    chatSend.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if(!text) return;
        addChatMessage(text, 'user');
        chatInput.value = '';
        setTimeout(() => processChat(text), 300);
    });

    chatInput.addEventListener('keypress', e => { if(e.key==='Enter') chatSend.click(); });
});
