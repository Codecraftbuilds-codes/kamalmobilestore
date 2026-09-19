/* ==========================================================
   Kamal Mobile Store — script.js
   Vanilla JavaScript only. Needs products.js loaded first.
   ========================================================== */
(function () {
  "use strict";

  // Replace with the real WhatsApp number (digits only, with country code)
  var WHATSAPP_NUMBER = "91XXXXXXXXXX";
  var STORE_NAME = "Kamal Mobile Store";

  var products = Array.isArray(window.KAMAL_PRODUCTS) ? window.KAMAL_PRODUCTS : [];

  /* ---------- Small helpers ---------- */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Image that quietly hides itself if the file is missing
  function makeImage(src, alt) {
    var img = document.createElement("img");
    img.src = src || "";
    img.alt = alt || "";
    img.loading = "lazy";
    img.addEventListener("error", function () {
      img.style.visibility = "hidden";
    });
    return img;
  }

  function whatsappLink(productName) {
    var message =
      "Hi, I want to know more about " + productName + " from " + STORE_NAME + ".";
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------- 1. Mobile nav toggle ---------- */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a link
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    // Close when tapping outside the header
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".site-header")) setOpen(false);
    });

    // Close with the Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    // Reset when the screen becomes wide
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setOpen(false);
    });
  }

  /* ---------- 4. Product cards on the home page ---------- */

  function buildCard(product) {
    var card = make("a", "card");
    card.href = "product.html?id=" + encodeURIComponent(product.id);

    card.appendChild(makeImage(product.img, product.name));

    var body = make("div", "card-body");
    body.appendChild(make("h3", "", product.name));
    body.appendChild(make("p", "price", product.price));
    card.appendChild(body);

    return card;
  }

  function renderProductGrid() {
    var grid = document.getElementById("product-grid");
    if (!grid || !products.length) return; // keep the HTML cards if there is no data

    grid.textContent = "";
    products.forEach(function (product) {
      grid.appendChild(buildCard(product));
    });
  }

  /* ---------- 5 + 6. Product page ---------- */

  function findProduct(id) {
    if (id) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) return products[i];
      }
    }
    return products[0]; // missing or unknown id: show the first product
  }

  function renderProductPage() {
    var root = document.getElementById("product-root");
    if (!root) return;

    root.textContent = "";

    if (!products.length) {
      root.appendChild(make("p", "", "Products are not available right now."));
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var product = findProduct(params.get("id"));

    document.title = product.name + " | " + STORE_NAME;

    var layout = make("div", "product-layout");

    var photo = make("div", "photo-slot");
    photo.appendChild(makeImage(product.img, product.name));
    layout.appendChild(photo);

    var info = make("div", "card-body");
    info.appendChild(make("h1", "", product.name));
    info.appendChild(make("p", "price", product.price));
    info.appendChild(make("p", "", product.text));

    var learnMore = make("a", "btn", "Learn more");
    learnMore.href = whatsappLink(product.name);
    learnMore.target = "_blank";
    learnMore.rel = "noopener";
    info.appendChild(learnMore);

    layout.appendChild(info);
    root.appendChild(layout);
  }

  /* ---------- 2 + 3. Reveal on scroll ---------- */

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    function show(el) {
      el.classList.add("visible");
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              show(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" }
      );
      items.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      items.forEach(show);
    }

    // Safety net so mobile never stays blank
    setTimeout(function () {
      document.querySelectorAll(".reveal").forEach(show);
    }, 400);
  }

  /* ---------- Start ---------- */

  function init() {
    initNav();
    renderProductGrid();
    renderProductPage();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
