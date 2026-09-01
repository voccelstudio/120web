/* ============================================
   1:20 ARQUITECTURA — JavaScript principal
   ============================================ */
(function () {
  "use strict";

  /* ---------- Tema claro / oscuro ---------- */
  var root = document.documentElement;
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("theme"); } catch (e) {}

  if (!savedTheme) {
    savedTheme =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  }

  root.setAttribute("data-theme", savedTheme === "light" ? "light" : "dark");

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      themeToggle.setAttribute(
        "aria-label",
        next === "light" ? "Cambiar al tema oscuro" : "Cambiar al tema claro"
      );
    });
  }

  /* ---------- Año del footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cabecera compacta al hacer scroll ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var MENU_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  var CLOSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  if (navToggle && mobileMenu) {
    var closeMenu = function () {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("no-scroll");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      navToggle.innerHTML = MENU_ICON;
    };

    navToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) {
        closeMenu();
      } else {
        mobileMenu.classList.add("open");
        document.body.classList.add("no-scroll");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Cerrar menú");
        navToggle.innerHTML = CLOSE_ICON;
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
      if (delay) el.style.transitionDelay = delay + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("no-reveal");
    });
  }

  /* ---------- Fallback de imágenes ---------- */
  var PLACEHOLDER_SVG =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">' +
        '<defs><pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">' +
        '<path d="M32 0H0V32" fill="none" stroke="#2a2a2a" stroke-width="1"/></pattern></defs>' +
        '<rect width="1200" height="800" fill="#20201f"/>' +
        '<rect width="1200" height="800" fill="url(#g)"/>' +
        '<text x="600" y="400" fill="#8e9192" font-family="monospace" font-size="14" letter-spacing="4" text-anchor="middle">1:20 ARQUITECTURA</text>' +
        "</svg>"
    );

  var broken = new WeakSet();

  document.querySelectorAll("img[data-src]").forEach(function (img) {
    var src = img.getAttribute("data-src");
    if (src) img.setAttribute("src", src);
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
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });

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
        if (counter && active !== "todos") {
          counter.textContent = "[" + String(visible).padStart(2, "0") + "]";
        }
      });
    });
  }

  /* ---------- Contadores ---------- */
  document.querySelectorAll("[data-counter]").forEach(function (el) {
    var total = el.getAttribute("data-total");
    if (total) el.textContent = "01 / " + total;
  });

  /* ---------- Lightbox de proyectos (proyectos.html) ---------- */
  if (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.projects) {
    var projectsById = {};
    SITE_CONFIG.projects.forEach(function (p) {
      projectsById[p.id] = p;
    });

    /* Contenedor modal sobre la marcha */
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML =
      '<div class="modal-panel">' +
      '<div class="modal-stage">' +
      '<button class="modal-close" data-modal-close aria-label="Cerrar">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<span class="chip modal-counter" data-modal-counter>01 / 01</span>' +
      '<button class="modal-nav prev" data-modal-prev aria-label="Anterior">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 6l-6 6 6 6"/></svg>' +
      "</button>" +
      '<button class="modal-nav next" data-modal-next aria-label="Siguiente">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6"/></svg>' +
      "</button>" +
      "</div>" +
      '<div class="modal-body">' +
      '<div class="modal-title">' +
      '<h3 class="h-headline-md" data-modal-title></h3>' +
      '<p class="caption" data-modal-subtitle></p>' +
      "</div>" +
      '<div class="modal-actions">' +
      '<a class="btn btn-outline" data-modal-link href="#">Ver proyecto</a>' +
      '<a class="btn btn-primary" data-modal-contact href="contacto.html">Iniciar uno similar</a>' +
      "</div>" +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);

    var stagesEls = modal.querySelectorAll(".modal-stage");
    var stageEl = stagesEls[0];
    var imgEls = [];
    var counterEl = modal.querySelector("[data-modal-counter]");
    var titleEl = modal.querySelector("[data-modal-title]");
    var subtitleEl = modal.querySelector("[data-modal-subtitle]");
    var linkEl = modal.querySelector("[data-modal-link]");
    var current = 0;
    var activeProject = null;

    function buildImages(project) {
      imgEls.forEach(function (img) { img.remove(); });
      imgEls = [];
      project.imagenes.forEach(function (src) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = activeProject ? activeProject.titulo : "Imagen del proyecto";
        stageEl.appendChild(img);
        imgEls.push(img);
      });
    }

    function showSlide(index) {
      if (!imgEls.length) return;
      current = (index + imgEls.length) % imgEls.length;
      imgEls.forEach(function (img, i) {
        img.classList.toggle("active", i === current);
      });
      counterEl.textContent =
        String(current + 1).padStart(2, "0") + " / " + String(imgEls.length).padStart(2, "0");
    }

    function openModal(project) {
      activeProject = project;
      buildImages(project);
      titleEl.textContent = project.titulo;
      subtitleEl.textContent =
        project.categoriaLabel + " · " + project.estado + " · " + project.anio + " · " + project.lugar;
      linkEl.setAttribute("href", project.pagina);
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
      showSlide(0);
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    modal.querySelector("[data-modal-close]").addEventListener("click", closeModal);
    modal.querySelector("[data-modal-prev]").addEventListener("click", function () {
      showSlide(current - 1);
    });
    modal.querySelector("[data-modal-next]").addEventListener("click", function () {
      showSlide(current + 1);
    });

    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showSlide(current - 1);
      if (e.key === "ArrowRight") showSlide(current + 1);
    });

    /* Tarjetas que abren el lightbox */
    document.querySelectorAll("[data-open-project]").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");

      var openCard = function () {
        var project = projectsById[card.getAttribute("data-open-project")];
        if (project) openModal(project);
      };

      card.addEventListener("click", openCard);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCard();
        }
      });
    });
  }

  /* ---------- Formulario de contacto → WhatsApp / Email ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");

    function buildMessage() {
      var nombre = document.getElementById("nombre").value.trim();
      var email = document.getElementById("email").value.trim();
      var tipo = document.getElementById("tipoConsulta");
      var tipoTexto = tipo.options[tipo.selectedIndex]
        ? tipo.options[tipo.selectedIndex].text
        : "";
      var mensaje = document.getElementById("mensaje").value.trim();

      return (
        "Hola 1:20 Arquitectura 👋\n" +
        "Nombre: " + (nombre || "-") + "\n" +
        "Correo: " + (email || "-") + "\n" +
        "Consulta: " + tipoTexto + "\n\n" +
        (mensaje ? "Mensaje:\n" + mensaje : "Quiero consultar por un proyecto.")
      );
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var config = window.SITE_CONFIG || {};
      var texto = encodeURIComponent(buildMessage());
      var wa = config.whatsapp;
      var mail = config.email || "";

      if (wa) {
        window.open("https://wa.me/" + wa + "?text=" + texto, "_blank", "noopener");
      }

      if (status) {
        status.classList.remove("error");
        status.textContent =
          wa
            ? "Abrimos WhatsApp con tu consulta lista para enviar. Si no se abrió, contactanos por correo."
            : "Abriendo tu correo...";
        status.classList.add("ok");
      }

      if (mail) {
        var subject = encodeURIComponent(config.emailSubject || "Consulta");
        var mailto = "mailto:" + mail + "?subject=" + subject + "&body=" + texto;
        var link = document.createElement("a");
        link.href = mailto;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      form.reset();
    });
  }
})();