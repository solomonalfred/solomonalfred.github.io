document.addEventListener("DOMContentLoaded", () => {

  /* ── ТЁМНАЯ ТЕМА ── */
  const themeBtn = document.getElementById("themeToggle");
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  /* ── FADE IN при скролле ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
  document.querySelectorAll(".fade-in").forEach(el => io.observe(el));

  /* ═══════════════════════════════════════
     КОРЗИНА
  ═══════════════════════════════════════ */
  let cart = JSON.parse(localStorage.getItem("ssp_cart") || "[]");

  function saveCart() {
    localStorage.setItem("ssp_cart", JSON.stringify(cart));
  }

  function cartTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function cartCount() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function updateCartUI() {
    document.querySelectorAll(".cart-count").forEach(el => {
      const n = cartCount();
      el.textContent = n;
      el.style.display = n > 0 ? "flex" : "none";
    });

    const sideItems = document.getElementById("sideCartItems");
    const sideTotal = document.getElementById("sideCartTotal");
    if (sideItems) {
      if (cart.length === 0) {
        sideItems.innerHTML = '<p style="color:var(--text2);font-size:14px;text-align:center;padding:30px 0">Корзина пуста</p>';
      } else {
        sideItems.innerHTML = cart.map((item, idx) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>${item.price.toLocaleString("ru-RU")} ₽ × ${item.qty}</span>
            </div>
            <button class="remove-btn" data-idx="${idx}">✕</button>
          </div>
        `).join("");
        sideItems.querySelectorAll(".remove-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            cart.splice(+btn.dataset.idx, 1);
            saveCart(); updateCartUI();
          });
        });
      }
      if (sideTotal) sideTotal.textContent = cartTotal().toLocaleString("ru-RU") + " ₽";
    }
    const panelItems = document.getElementById("cartItems");
    const panelTotal = document.getElementById("cartTotal");
    if (panelItems) {
      if (cart.length === 0) {
        panelItems.innerHTML = '<p style="color:var(--text2);font-size:14px">Корзина пока пуста — добавьте что-нибудь выше.</p>';
      } else {
        panelItems.innerHTML = cart.map((item, idx) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>${item.price.toLocaleString("ru-RU")} ₽ × ${item.qty}</span>
            </div>
            <button class="remove-btn" data-idx="${idx}">Удалить</button>
          </div>
        `).join("");
        panelItems.querySelectorAll(".remove-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            cart.splice(+btn.dataset.idx, 1);
            saveCart(); updateCartUI();
          });
        });
      }
      if (panelTotal) panelTotal.textContent = cartTotal().toLocaleString("ru-RU") + " ₽";
    }
  }

  function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price: +price, qty: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.name, btn.dataset.price));
  });

  document.getElementById("clearCart")?.addEventListener("click", () => {
    cart = []; saveCart(); updateCartUI();
  });
  document.getElementById("sideCartClear")?.addEventListener("click", () => {
    cart = []; saveCart(); updateCartUI();
  });

  function handleCheckout() {
    if (cart.length === 0) { alert("Корзина пуста"); return; }
    cart = []; saveCart(); updateCartUI();
    closeCart();
    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.add("open");
  }
  document.getElementById("checkoutBtn")?.addEventListener("click", handleCheckout);
  document.getElementById("sideCheckoutBtn")?.addEventListener("click", handleCheckout);

  const orderModal = document.getElementById("orderModal");
  document.getElementById("closeModal")?.addEventListener("click", () => orderModal?.classList.remove("open"));
  orderModal?.addEventListener("click", e => { if (e.target === orderModal) orderModal.classList.remove("open"); });

  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  function openCart() {
    cartSidebar?.classList.add("open");
    cartOverlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartSidebar?.classList.remove("open");
    cartOverlay?.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".cart-btn").forEach(b => b.addEventListener("click", openCart));
  document.getElementById("cartCloseBtn")?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  updateCartUI();

  /* ═══════════════════════════════════════
     РЕНДЕР ТОВАРОВ ИЗ data.js
  ═══════════════════════════════════════ */
  const productContainer = document.getElementById("productGrid");

  if (productContainer && typeof PRODUCTS !== "undefined") {
    const section = productContainer.dataset.section; // clothes | equipment | nutrition
    const items = PRODUCTS[section] || [];

    let activeFilter = "all";
    let searchQuery   = "";

    const CATEGORY_LABELS = {
      men:      "Мужское",
      women:    "Женское",
      home:     "Для дома",
      gym:      "Для зала",
      protein:  "Протеин",
      recovery: "Восстановление"
    };

    function renderProducts() {
      const visible = items.filter(p => {
        const matchCat    = activeFilter === "all" || p.category === activeFilter;
        const matchSearch = !searchQuery ||
          p.name.toLowerCase().includes(searchQuery) ||
          p.desc.toLowerCase().includes(searchQuery);
        return matchCat && matchSearch;
      });

      const countEl = document.getElementById("productCount");
      if (countEl) countEl.textContent = `Показано: ${visible.length}`;

      if (visible.length === 0) {
        productContainer.innerHTML = '<p style="grid-column:1/-1;color:var(--text2);padding:30px 0">Ничего не найдено. Попробуйте изменить фильтр или запрос.</p>';
        return;
      }

      productContainer.innerHTML = visible.map(p => `
        <div class="product-card fade-in show" data-category="${p.category}">
          <div class="product-card-img">
            <img src="${p.image}" alt="${p.name}" loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=60'">
            ${p.badge ? `<span class="product-badge${p.badge === 'Новинка' ? ' badge-new' : ''}">${p.badge}</span>` : ""}
          </div>
          <div class="product-body">
            <span class="product-cat-pill">${CATEGORY_LABELS[p.category] || p.category}</span>
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${p.desc}</div>
            <div class="product-footer">
              <div class="product-price">${p.price.toLocaleString("ru-RU")} ₽</div>
              <button class="add-to-cart" data-name="${p.name}" data-price="${p.price}">
                В корзину
              </button>
            </div>
          </div>
        </div>
      `).join("");

      productContainer.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.name, btn.dataset.price));
      });
    }
    document.querySelectorAll(".filter-item").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderProducts();
      });
    });

    const searchEl = document.getElementById("catalogSearch");
    searchEl?.addEventListener("input", e => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderProducts();
    });

    renderProducts();
  }
  function observeNew(container) {
    container.querySelectorAll(".fade-in").forEach(el => io.observe(el));
  }
  function showNow(container) {
    container.querySelectorAll(".fade-in").forEach(el => {
      el.classList.add("show");
    });
  }

  /* ═══════════════════════════════════════
     РЕНДЕР FAQ ИЗ config.js
  ═══════════════════════════════════════ */
  const faqContainer = document.getElementById("faqList");
  if (faqContainer && typeof SITE_CONFIG !== "undefined") {
    faqContainer.innerHTML = SITE_CONFIG.faq.map((item, i) => `
      <div class="faq-item">
        <div class="faq-question" data-idx="${i}">
          <span>${item.question}</span>
          <span class="faq-arrow">▼</span>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-inner">${item.answer}</div>
        </div>
      </div>
    `).join("");

    faqContainer.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        q.closest(".faq-item").classList.toggle("open");
      });
    });
  }

  /* ═══════════════════════════════════════
     РЕНДЕР ОТЗЫВОВ ИЗ config.js
  ═══════════════════════════════════════ */
  const reviewsContainer = document.getElementById("reviewsGrid");
  if (reviewsContainer && typeof SITE_CONFIG !== "undefined") {
    reviewsContainer.innerHTML = SITE_CONFIG.reviews.map(r => `
      <div class="review-card fade-in">
        <div class="review-stars">${"★".repeat(r.rating)}</div>
        <div class="review-text">${r.text}</div>
        <div class="review-author">${r.name}</div>
      </div>
    `).join("");
    observeNew(reviewsContainer);
  }

  /* ═══════════════════════════════════════
     РЕНДЕР ПРЕИМУЩЕСТВ ИЗ config.js
  ═══════════════════════════════════════ */
  const benefitsContainer = document.getElementById("benefitsGrid");
  if (benefitsContainer && typeof SITE_CONFIG !== "undefined") {
    benefitsContainer.innerHTML = SITE_CONFIG.benefits.map(b => `
      <div class="benefit-item">
        <div class="benefit-icon">${b.icon}</div>
        <div>
          <div class="benefit-title">${b.title}</div>
          <div class="benefit-text">${b.text}</div>
        </div>
      </div>
    `).join("");
  }

  /* ═══════════════════════════════════════
     ФОРМА ОБРАТНОЙ СВЯЗИ
  ═══════════════════════════════════════ */
  const contactForm = document.getElementById("contactForm");
  const formMsg     = document.getElementById("formMsg");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const name    = contactForm.querySelector("#cName")?.value.trim();
      const email   = contactForm.querySelector("#cEmail")?.value.trim();
      const message = contactForm.querySelector("#cMessage")?.value.trim();
      if (!name || !email || !message) {
        formMsg.className = "form-msg err";
        formMsg.textContent = "Заполните все обязательные поля.";
        return;
      }
      formMsg.className = "form-msg ok";
      formMsg.textContent = "Сообщение отправлено. Мы свяжемся с вами в ближайшее время!";
      contactForm.reset();
    });
  }

  /* ═══════════════════════════════════════
     ПОИСК В ХЕДЕРЕ (redirect на каталог)
  ═══════════════════════════════════════ */
  document.getElementById("headerSearchForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const q = document.getElementById("headerSearchInput")?.value.trim();
    if (q) window.location.href = `clothes.html?q=${encodeURIComponent(q)}`;
  });
  const urlQ = new URLSearchParams(window.location.search).get("q");
  if (urlQ) {
    const si = document.getElementById("catalogSearch");
    if (si) { si.value = urlQ; si.dispatchEvent(new Event("input")); }
  }

});
