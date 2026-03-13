document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.querySelector("#themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach((el) => observer.observe(el));

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItems = document.querySelector("#cartItems");
  const cartTotal = document.querySelector("#cartTotal");
  const clearCartBtn = document.querySelector("#clearCart");
  const checkoutBtn = document.querySelector("#checkoutBtn");
  const modal = document.querySelector("#orderModal");
  const closeModalBtn = document.querySelector("#closeModal");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      cart.push({ name, price });
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
      alert(`Товар "${name}" добавлен в корзину`);
    });
  });

  function updateCart() {
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Корзина пока пуста.</p>";
      cartTotal.textContent = "0 ₽";
      return;
    }

    cartItems.innerHTML = cart
      .map((item, index) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <span>${item.price} ₽</span>
          </div>
          <button class="remove-item-btn" data-index="${index}">Удалить</button>
        </div>
      `)
      .join("");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `${total} ₽`;

    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Корзина пуста");
        return;
      }
      if (modal) {
        modal.classList.add("show");
      }
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  updateCart();

  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product[data-category]");
  const searchInput = document.querySelector("#searchInput");

  function filterAndSearchProducts() {
    const activeButton = document.querySelector(".filter-btn.active");
    const currentFilter = activeButton ? activeButton.dataset.filter : "all";
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

    products.forEach((product) => {
      const productCategory = product.dataset.category;
      const title = product.querySelector("h3").textContent.toLowerCase();
      const text = product.textContent.toLowerCase();

      const matchCategory = currentFilter === "all" || currentFilter === productCategory;
      const matchSearch = title.includes(searchValue) || text.includes(searchValue);

      if (matchCategory && matchSearch) {
        product.classList.remove("hidden");
      } else {
        product.classList.add("hidden");
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterAndSearchProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterAndSearchProducts);
  }

  const contactForm = document.querySelector("#contactForm");
  const formMessage = document.querySelector("#formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector("#name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const message = document.querySelector("#message").value.trim();

      if (!name || !email || !message) {
        formMessage.textContent = "Пожалуйста, заполните все поля.";
        formMessage.style.color = "red";
        return;
      }

      formMessage.textContent = "Сообщение успешно отправлено (демо-режим).";
      formMessage.style.color = "green";
      contactForm.reset();
    });
  }
});