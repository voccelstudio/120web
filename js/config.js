/* ============================================
   1:20 ARQUITECTURA — Configuración del sitio
   Actualizá aquí los datos reales de contacto.
   ============================================ */

var IMG = {
  estructura:
    "img/ph/hero.svg",
  interior:
    "img/ph/residencia-04.svg",
  aletas:
    "img/ph/pabellon-x.svg",
  maqueta:
    "img/ph/estudio.svg",
  villa:
    "img/ph/villa-tarragona.svg",
  torre:
    "img/ph/torre-nexus.svg",
  plaza:
    "img/ph/plaza-civica-04.svg",
  obsidiana:
    "img/ph/casa-obsidiana.svg",
  omega:
    "img/ph/pabellon-omega.svg",
  hormigon:
    "img/ph/intervencion-ayolas.svg",
  mapa:
    "img/ph/mapa.svg"
};

var SITE_CONFIG = {
  /* ⚠️ Reemplazá por el número real con código de país y sin "+".
     Ejemplo: 595991234567 (WhatsApp de Paraguay) */
  whatsapp: "595981123456",

  /* Correo real del estudio */
  email: "hola@120arquitectura.com",

  /* Dominio que se usará en metadatos y sitemap */
  domain: "https://voccelstudio.github.io/120web/",

  emailSubject: "Consulta desde el sitio de 1:20 Arquitectura",

  /* Agenda: horarios que se ofrecen en el widget de consultas */
  bookings: {
    horarios: ["09:00", "10:00", "11:00", "16:00", "17:00", "18:00"],
    duracion: "30 minutos",
    saltarDia: 0 /* 0 = domingo (getDay) */
  },

  /* Proyectos: se usan para el lightbox y los filtros */
  projects: [
    {
      id: "residencia-04",
      titulo: "Residencia 04",
      categoria: "residencial",
      categoriaLabel: "Residencial",
      estado: "Construida",
      anio: "2021",
      lugar: "Barrio Las Mercedes, Asunción",
      resumen: "Habitar urbano",
      pagina: "proyectos/residencia-04.html",
      imagenes: [IMG.interior, IMG.estructura, IMG.maqueta, IMG.hormigon]
    },
    {
      id: "pabellon-x",
      titulo: "Pabellón X",
      categoria: "cultural",
      categoriaLabel: "Cultural",
      estado: "Concepto",
      anio: "2023",
      lugar: "Jardín Botánico, Asunción",
      resumen: "Espacio cultural",
      pagina: "proyectos/pabellon-x.html",
      imagenes: [IMG.aletas, IMG.estructura, IMG.omega, IMG.hormigon]
    },
    {
      id: "villa-tarragona",
      titulo: "Villa Tarragona",
      categoria: "residencial",
      categoriaLabel: "Residencial",
      estado: "Construida",
      anio: "2019",
      lugar: "Encarnación, Itapúa",
      resumen: "Vivienda monolítica",
      pagina: "proyectos/villa-tarragona.html",
      imagenes: [IMG.villa, IMG.interior, IMG.obsidiana, IMG.maqueta]
    },
    {
      id: "torre-nexus",
      titulo: "Torre Nexus",
      categoria: "comercial",
      categoriaLabel: "Comercial",
      estado: "En obra",
      anio: "2024",
      lugar: "Casco histórico, Asunción",
      resumen: "Torre de oficinas",
      pagina: "proyectos/torre-nexus.html",
      imagenes: [IMG.torre, IMG.estructura, IMG.plaza, IMG.hormigon]
    },
    {
      id: "plaza-civica-04",
      titulo: "Plaza Cívica 04",
      categoria: "urbano",
      categoriaLabel: "Urbano",
      estado: "Concurso",
      anio: "2022",
      lugar: "Villa Elisa, Central",
      resumen: "Espacio público",
      pagina: "proyectos/plaza-civica-04.html",
      imagenes: [IMG.plaza, IMG.estructura, IMG.aletas, IMG.omega]
    },
    {
      id: "casa-obsidiana",
      titulo: "Casa Obsidiana",
      categoria: "residencial",
      categoriaLabel: "Residencial",
      estado: "Construida",
      anio: "2020",
      lugar: "Areguá, Central",
      resumen: "Refugio de autor",
      pagina: "proyectos/casa-obsidiana.html",
      imagenes: [IMG.obsidiana, IMG.interior, IMG.villa, IMG.maqueta]
    },
    {
      id: "pabellon-omega",
      titulo: "Pabellón Omega",
      categoria: "cultural",
      categoriaLabel: "Cultural",
      estado: "Proyecto",
      anio: "2024",
      lugar: "Luque, Central",
      resumen: "Centro cultural",
      pagina: "proyectos/pabellon-omega.html",
      imagenes: [IMG.omega, IMG.plaza, IMG.estructura, IMG.hormigon]
    },
    {
      id: "intervencion-ayolas",
      titulo: "Intervención Ayolas",
      categoria: "intervencion",
      categoriaLabel: "Intervención",
      estado: "Construida",
      anio: "2022",
      lugar: "Casco histórico, Asunción",
      resumen: "Adecuación patrimonial",
      pagina: "proyectos/intervencion-ayolas.html",
      imagenes: [IMG.estructura, IMG.interior, IMG.villa, IMG.hormigon]
    }
  ]
};