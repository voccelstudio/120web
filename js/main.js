/* ============================================
   1:20 ARQUITECTURA — JavaScript principal
   ============================================ */
(function () {
  "use strict";

  /* ---------- Utilidad: trampa de foco (accesibilidad) ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusablesIn(container) {
    return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function trapFocus(container, e) {
    var items = focusablesIn(container);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

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
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#f4f3f1" : "#131313");
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

  /* ---------- Menú móvil (con foco trampado) ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var MENU_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  var CLOSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  if (navToggle && mobileMenu) {
    var closeMenu = function (refocus) {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("no-scroll");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      navToggle.innerHTML = MENU_ICON;
      document.removeEventListener("keydown", menuKeydown);
      if (refocus) navToggle.focus();
    };

    var menuKeydown = function (e) {
      if (e.key === "Escape") { closeMenu(true); return; }
      if (e.key === "Tab") trapFocus(mobileMenu, e);
    };

    navToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) {
        closeMenu(false);
      } else {
        mobileMenu.classList.add("open");
        document.body.classList.add("no-scroll");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Cerrar menú");
        navToggle.innerHTML = CLOSE_ICON;
        document.addEventListener("keydown", menuKeydown);
        var first = focusablesIn(mobileMenu)[0];
        if (first) first.focus();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
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
        '<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">' +
        '<path d="M24 0H0V24" fill="none" stroke="#2a2a2a" stroke-width="1"/></pattern></defs>' +
        '<rect width="1200" height="800" fill="#141414"/>' +
        '<rect width="1200" height="800" fill="url(#g)"/>' +
        '<text x="600" y="400" fill="#8e9192" font-family="monospace" font-size="13" letter-spacing="4" text-anchor="middle">1:20 ARQUITECTURA</text>' +
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
        } else if (counter) {
          counter.textContent = "[" + String(cards.length).padStart(2, "0") + "]";
        }
      });
    });
  }

  /* ---------- Contadores ---------- */
  document.querySelectorAll("[data-counter]").forEach(function (el) {
    var total = el.getAttribute("data-total");
    if (total) el.textContent = "01 / " + total;
  });

  /* ---------- Lightbox de proyectos (con foco trampado) ---------- */
  if (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.projects) {
    var projectsById = {};
    SITE_CONFIG.projects.forEach(function (p) {
      projectsById[p.id] = p;
    });

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
      '<a class="btn btn-accent" data-modal-contact href="contacto.html">Iniciar uno similar</a>' +
      "</div>" +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);

    var stageEl = modal.querySelector(".modal-stage");
    var imgEls = [];
    var counterEl = modal.querySelector("[data-modal-counter]");
    var titleEl = modal.querySelector("[data-modal-title]");
    var subtitleEl = modal.querySelector("[data-modal-subtitle]");
    var linkEl = modal.querySelector("[data-modal-link]");
    var current = 0;
    var activeProject = null;
    var lastFocused = null;

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

    function openModal(project, trigger) {
      activeProject = project;
      lastFocused = trigger || document.activeElement;
      buildImages(project);
      titleEl.textContent = project.titulo;
      subtitleEl.textContent =
        project.categoriaLabel + " · " + project.estado + " · " + project.anio + " · " + project.lugar;
      linkEl.setAttribute("href", project.pagina);
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
      showSlide(0);
      document.addEventListener("keydown", modalKeydown);
      modal.querySelector("[data-modal-close]").focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", modalKeydown);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function modalKeydown(e) {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "ArrowLeft") showSlide(current - 1);
      if (e.key === "ArrowRight") showSlide(current + 1);
      if (e.key === "Tab") trapFocus(modal, e);
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

    document.querySelectorAll("[data-open-project]").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");

      var openCard = function () {
        var project = projectsById[card.getAttribute("data-open-project")];
        if (project) openModal(project, card);
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

  /* ---------- Selector de canal de contacto ---------- */
  var channel = "whatsapp";
  var channelPicker = document.getElementById("channelPicker");
  if (channelPicker) {
    channelPicker.querySelectorAll(".channel-opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        channel = opt.getAttribute("data-channel");
        channelPicker.querySelectorAll(".channel-opt").forEach(function (o) {
          o.classList.toggle("is-active", o === opt);
          o.setAttribute("aria-checked", o === opt ? "true" : "false");
        });
      });
    });
  }

  /* ---------- Formulario de contacto → WhatsApp O Email ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");

    function buildMessage() {
      var nombre = document.getElementById("nombre").value.trim();
      var email = document.getElementById("email").value.trim();
      var tipo = document.getElementById("tipoConsulta");
      var tipoTexto = tipo && tipo.options[tipo.selectedIndex]
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

      if (status) status.classList.remove("ok", "error");

      if (channel === "whatsapp" && wa) {
        window.open("https://wa.me/" + wa + "?text=" + texto, "_blank", "noopener");
        if (status) {
          status.textContent = "Abrimos WhatsApp con tu consulta lista para enviar.";
          status.classList.add("ok");
        }
      } else if (mail) {
        var subject = encodeURIComponent(config.emailSubject || "Consulta");
        window.location.href = "mailto:" + mail + "?subject=" + subject + "&body=" + texto;
        if (status) {
          status.textContent = "Abriendo tu correo con el mensaje redactado.";
          status.classList.add("ok");
        }
      } else if (status) {
        status.textContent = "No hay canal configurado. Escribinos directamente.";
        status.classList.add("error");
      }

      form.reset();
    });
  }

  /* ---------- Widget de agenda (booking) ---------- */
  var booking = document.getElementById("booking");
  if (booking) {
    var daysEl = document.getElementById("bookingDays");
    var slotsEl = document.getElementById("bookingSlots");
    var summaryEl = document.getElementById("bookingSummary");
    var tipoEl = document.getElementById("bookingTipo");
    var submitBtn = document.getElementById("bookingSubmit");

    var bookingsConfig = (window.SITE_CONFIG && window.SITE_CONFIG.bookings) || {};
    var horarios = bookingsConfig.horarios || ["09:00", "10:00", "11:00", "16:00", "17:00", "18:00"];
    var saltarDia = typeof bookingsConfig.saltarDia === "number" ? bookingsConfig.saltarDia : 0;

    var DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    var selection = { fecha: null, fechaLabel: "", slot: null };

    function fmtFecha(d) {
      return (
        d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0")
      );
    }

    function renderDays() {
      var hoy = new Date();
      var dias = [];
      for (var i = 0; i < 30 && dias.length < 7; i++) {
        var d = new Date(hoy);
        d.setDate(hoy.getDate() + i);
        if (d.getDay() === saltarDia) continue;
        dias.push(d);
      }
      dias.forEach(function (d) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "day-chip";
        chip.setAttribute("data-iso", fmtFecha(d));
        chip.setAttribute("aria-label", "Elegir el día " + DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()]);
        chip.innerHTML =
          '<span class="dow">' + DIAS[d.getDay()] + '</span>' +
          '<span class="dnum">' + d.getDate() + '</span>' +
          '<span class="dmon">' + MESES[d.getMonth()] + '</span>';
        chip.addEventListener("click", function () { selectDay(this); });
        daysEl.appendChild(chip);
      });
    }

    function renderSlots() {
      horarios.forEach(function (h) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "slot-chip";
        chip.textContent = h;
        chip.addEventListener("click", function () { selectSlot(this); });
        slotsEl.appendChild(chip);
      });
    }

    function selectDay(chip) {
      document.querySelectorAll(".day-chip.is-active").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      selection.fecha = chip.getAttribute("data-iso");
      selection.fechaLabel = chip.querySelector(".dow").textContent + " " + chip.querySelector(".dnum").textContent + " " + chip.querySelector(".dmon").textContent;
      updateSummary();
    }

    function selectSlot(chip) {
      document.querySelectorAll(".slot-chip.is-active").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      selection.slot = chip.textContent;
      updateSummary();
    }

    function tipoTexto() {
      return tipoEl && tipoEl.options[tipoEl.selectedIndex] ? tipoEl.options[tipoEl.selectedIndex].text : "";
    }

    function updateSummary() {
      if (selection.fecha && selection.slot) {
        summaryEl.textContent =
          "Listo: " + selection.fechaLabel + " a las " + selection.slot + " (" + (bookingsConfig.duracion || "30 minutos") + "). Confirmamos tu reunión por WhatsApp.";
        submitBtn.disabled = false;
      } else {
        summaryEl.textContent = "Elegí día y horario para confirmar tu reunión.";
        submitBtn.disabled = true;
      }
    }

    submitBtn.addEventListener("click", function () {
      if (!selection.fecha || !selection.slot) return;
      var config = window.SITE_CONFIG || {};
      var wa = config.whatsapp;
      if (!wa) return;

      var texto =
        "Hola 1:20 Arquitectura 👋\n" +
        "Quiero agendar una consulta.\n\n" +
        "Día: " + selection.fechaLabel + "\n" +
        "Horario: " + selection.slot + " (hora de Asunción)\n" +
        "Motivo: " + tipoTexto() + "\n\n" +
        "¿Me confirman el turno? Gracias.";

      window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
      summaryEl.textContent = "Enviamos tu solicitud por WhatsApp. Te confirmamos el turno.";
    });

    renderDays();
    renderSlots();
    updateSummary();
  }
})();
