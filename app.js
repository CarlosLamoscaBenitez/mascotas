/**
 * app.js — Lógica principal
 * PetCare Guide
 *
 * Maneja la interacción del usuario, renderiza las tarjetas
 * y coordina las llamadas a las funciones del módulo api.js.
 *
 * Requiere: api.js cargado antes que este archivo.
 */

/* -------------------------------------------------------
   BÚSQUEDA DE RAZAS
------------------------------------------------------- */

/**
 * Busca razas de perros y renderiza las tarjetas en #results.
 * Se llama al hacer clic en "Buscar" o presionar Enter.
 */
async function buscarRaza() {
  const query      = document.getElementById('search').value.trim();
  const resultados = document.getElementById('results');

  resultados.innerHTML = '<p>Cargando...</p>';

  try {
    const razas = await fetchRazasPerros(query);

    if (!razas || razas.length === 0) {
      resultados.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }

    resultados.innerHTML = razas.map(raza => crearTarjetaPerro(raza)).join('');
  } catch (error) {
    resultados.innerHTML = '<p>Error al cargar los datos. Intenta de nuevo.</p>';
    console.error('[buscarRaza]', error);
  }
}

/**
 * Genera el HTML de una tarjeta de raza de perro.
 * @param {Object} raza - Objeto de raza devuelto por la API
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaPerro(raza) {
  const imagen = raza.image?.url || 'assets/images/placeholder.jpg';
  const descripcion = raza.bred_for || 'Raza de compañía';

  return `
    <div class="card" onclick="verDetalle(${raza.id})">
      <img
        src="${imagen}"
        alt="${raza.name}"
        onerror="this.src='assets/images/placeholder.jpg'"
      >
      <div class="card-info">
        <h3>${raza.name}</h3>
        <p>${descripcion}</p>
      </div>
    </div>`;
}

/* -------------------------------------------------------
   DETALLE DE RAZA
------------------------------------------------------- */

/**
 * Navega a la página de detalle de una raza.
 * @param {number} id - ID de la raza
 */
function verDetalle(id) {
  // Ejemplo: redirigir a una página de detalle pasando el ID por query param
  window.location.href = `pages/detalle.html?id=${id}`;
}

/* -------------------------------------------------------
   CLIMA
------------------------------------------------------- */

/**
 * Busca el clima de una ciudad y lo muestra en #clima-resultado.
 * Usar en la página pages/clima.html.
 */
async function buscarClima() {
  const ciudad    = document.getElementById('ciudad')?.value.trim();
  const container = document.getElementById('clima-resultado');

  if (!ciudad || !container) return;

  container.innerHTML = '<p>Obteniendo clima...</p>';

  try {
    const datos = await fetchClima(ciudad);

    container.innerHTML = `
      <div class="clima-card">
        <h2>${datos.name}, ${datos.sys.country}</h2>
        <p class="temperatura">${Math.round(datos.main.temp)}°C</p>
        <p class="descripcion">${datos.weather[0].description}</p>
        <p>Humedad: ${datos.main.humidity}%</p>
        <p>Viento: ${datos.wind.speed} m/s</p>
        <img
          src="https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png"
          alt="${datos.weather[0].description}"
        >
      </div>`;
  } catch (error) {
    container.innerHTML = '<p>No se pudo obtener el clima. Verifica el nombre de la ciudad.</p>';
    console.error('[buscarClima]', error);
  }
}

/* -------------------------------------------------------
   INICIALIZACIÓN
------------------------------------------------------- */

window.onload = () => {
  // Cargar razas al inicio (sin filtro)
  buscarRaza();

  // Permitir buscar presionando Enter en el input
  const inputBusqueda = document.getElementById('search');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') buscarRaza();
    });
  }

  // Input de clima (en pages/clima.html)
  const inputCiudad = document.getElementById('ciudad');
  if (inputCiudad) {
    inputCiudad.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') buscarClima();
    });
  }
};
