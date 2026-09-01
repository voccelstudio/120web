/* ============================================
   1:20 ARQUITECTURA — JavaScript principal
   ============================================ */
(function () {
  "use strict";

  /* ---------- Año del footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cabecera compacta al hacer scroll ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    var closeMenu = function () {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("no-scroll");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      navToggle.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    };

    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.contains("open");
      if (open) {
        closeMenu();
      } else {
        mobileMenu.classList.add("open");
        document.body.classList.add("no-scroll");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Cerrar menú");
        navToggle.innerHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) {
        el.style.transitionDelay = delay + "ms";
      }
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("no-reveal");
    });
  }

  /* ---------- Fallback de imágenes ---------- */
  var PLACEHOLDER_SVG =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">' +
        "<defs>" +
        '<pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">' +
        '<path d="M32 0H0V32" fill="none" stroke="#2a2a2a" stroke-width="1"/></pattern>' +
        "</defs>" +
        '<rect width="1200" height="800" fill="#20201f"/>' +
        '<rect width="1200" height="800" fill="url(#g)"/>' +
        '<text x="600" y="400" fill="#8e9192" font-family="monospace" font-size="14" letter-spacing="4" text-anchor="middle">1:20 ARQUITECTURA</text>' +
        "</svg>"
    );

  var broken = new WeakSet();

  document.querySelectorAll("img[data-src]").forEach(function (img) {
    var src = img.getAttribute("data-src");
    if (src) {
      img.setAttribute("src", src);
    }
  });

  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      if (broken.has(img)) return;
      broken.add(img);
      img.removeAttribute("srcset");
      img.setAttribute("src", PLACEHOLDER_SVG);
      img.style.filter = "grayscale(1)";
      img.classList.add("img-placeholder");
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });

  /* ---------- Filtro de proyectos (proyectos.html) ---------- */
  var filterBar = document.getElementById("projectFilters");
  if (filterBar) {
    var cards = document.querySelectorAll("[data-project]");

    filterBar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var active = btn.getAttribute("data-filter");
        filterBar
          .querySelectorAll(".filter-btn")
          .forEach(function (b) {
            b.classList.remove("is-active");
          });
        btn.classList.add("is-active");

        var visible = 0;
        cards.forEach(function (card) {
          var cat = card.getAttribute("data-project");
          if (active === "todos" || cat === active) {
            card.classList.remove("is-hidden");
            visible++;
          } else {
            card.classList.add("is-hidden");
          }
        });

        var counter = document.getElementById("projectCounter");
        if (counter) {
          counter.textContent = "[" + String(visible).padStart(2, "0") + "]";
        }
      });
    });
  }

  /* ---------- Contador de imágenes (carousels) ---------- */
  var counters = document.querySelectorAll("[data-counter]");
  counters.forEach(function (el) {
    var total = el.getAttribute("data-total");
    if (total) {
      el.textContent = "01 / " + total;
    }
  });

  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nombre = document.getElementById("nombre").value.trim();
      var email = document.getElementById("email").value.trim();
      var tipo = document.getElementById("tipoConsulta");
      var tipoTexto = tipo.options[tipo.selectedIndex]
        ? tipo.options[tipo.selectedIndex].text
        : "";

      var items = [
        { name: "Nombre", value: nombre },
        { name: "Correo", value: email },
        { name: "Tipo de consulta", value: tipoTexto },
      ];

      var message = "";
      var cont = document.getElementById("mensaje");
      if (cont) { message = cont.value.trim(); }

      if (status) {
        status.classList.remove("error", "ok");
        status.textContent =
          "¡Gracias por escribirnos, " +
          nombre +
          "! Recibimos tu consulta. Te vamos a responder en menos de 48 horas. (Esta es una demo sin backend todavía.)";
        status.classList.add("ok");
      }

      form.reset();
    });
  }
})();