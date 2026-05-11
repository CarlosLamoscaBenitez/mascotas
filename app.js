// --- app.js (Versión Carga Diferida de Imágenes) ---

let modoActual = 'perros';

function setModo(modo) {
  modoActual = modo;
  const input = document.getElementById('search');
  if(input) {
    input.placeholder = `Buscar raza de ${modo}...`;
    input.value = ''; 
    buscarRaza();
  }
}

async function buscarRaza() {
  const query = document.getElementById('search').value.trim();
  const resContainer = document.getElementById('results');
  if(!resContainer) return;

  resContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando información...</p>';

  try {
    const razas = modoActual === 'perros' ? await fetchRazasPerros(query) : await fetchRazasGatos(query);
    
    if (!razas || razas.length === 0) {
      resContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron mascotas.</p>';
      return;
    }

    // PASO 1: Pintamos el esqueleto de las tarjetas en el DOM
    resContainer.innerHTML = razas.map(raza => {
      const peso = raza.weight?.metric ? `${raza.weight.metric} kg` : 'N/A';
      const vida = raza.life_span || 'N/A';
      const temperamento = raza.temperament || 'No disponible';

      return `
        <div class="card">
          <img 
            id="img-mascota-${raza.id}"
            src="https://placehold.co/400x300?text=Buscando+Foto..." 
            alt="${raza.name}" 
          >
          <div class="card-info">
            <h3 style="color: var(--primary); margin-bottom: 0.5rem;">${raza.name}</h3>
            <p><strong>Temperamento:</strong> ${temperamento}</p>
            <p><strong>Peso ideal:</strong> ${peso}</p>
            <p><strong>Esperanza de vida:</strong> ${vida}</p>
            <span class="badge" style="display: inline-block; background: #e1e8f5; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-top: 0.5rem;">${modoActual.toUpperCase()}</span>
          </div>
        </div>`;
    }).join('');

    // PASO 2: Bucle for...of secuencial para no saturar la API
    for (const raza of razas) {
      try {
        let imgUrl = '';
        
        if (raza.reference_image_id) {
          const cdn = modoActual === 'perros' ? 'https://cdn2.thedogapi.com/images/' : 'https://cdn2.thecatapi.com/images/';
          imgUrl = `${cdn}${raza.reference_image_id}.jpg`;
        } else {
          // Petición de respaldo CON la API Key en los headers
          const apiRuta = modoActual === 'perros' ? 'https://api.thedogapi.com/v1' : 'https://api.thecatapi.com/v1';
          const apiKey = modoActual === 'perros' ? API_KEY_DOGS : API_KEY_CATS;
          
          const fotoRes = await fetch(`${apiRuta}/images/search?breed_ids=${raza.id}`, {
            headers: { 'x-api-key': apiKey } // <-- Aquí está el arreglo mágico
          });
          
          const fotoData = await fotoRes.json();
          if (fotoData && fotoData.length > 0) {
            imgUrl = fotoData[0].url;
          } else {
            imgUrl = 'https://placehold.co/400x300?text=Sin+Foto+Disponible';
          }
        }

        const imgElement = document.getElementById(`img-mascota-${raza.id}`);
        if (imgElement) {
          imgElement.src = imgUrl;
          imgElement.onerror = function() {
            if(this.src.includes('.jpg')){ 
              this.src = this.src.replace('.jpg', '.png'); 
            } else { 
              this.src='https://placehold.co/400x300?text=Error+en+Servidor'; 
            }
          };
        }
      } catch (error) {
        console.error(`Error procesando imagen para ${raza.name}:`, error);
      }
    }

  } catch (e) {
    resContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error al conectar con la API.</p>';
    console.error(e);
  }
}
// Lógica para la página del clima
async function buscarClima() {
  const ciudadInput = document.getElementById('ciudad');
  if(!ciudadInput) return; 
  
  const ciudad = ciudadInput.value.trim();
  const container = document.getElementById('clima-resultado');
  
  if (!ciudad) return;

  container.innerHTML = '<p>Obteniendo clima...</p>';

  try {
    const d = await fetchClima(ciudad);
    container.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #4472C4; font-size: 1.5rem;">${d.name}, ${d.sys.country}</h3>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png" alt="Icono clima">
          <p style="font-size: 2.5rem; font-weight: bold; margin: 0;">${Math.round(d.main.temp)}°C</p>
        </div>
        <p style="text-transform: capitalize; font-size: 1.1rem; color: #666;">${d.weather[0].description}</p>
        <div style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem; font-size: 0.95rem;">
          <p>💧 Humedad: ${d.main.humidity}%</p>
          <p>💨 Viento: ${d.wind.speed} m/s</p>
        </div>
      </div>`;
  } catch (e) {
    container.innerHTML = '<p style="color: red; margin-top: 1rem;">Ciudad no encontrada. Intenta de nuevo.</p>';
    console.error(e);
  }
}

// Inicializar
window.onload = () => {
  if(document.getElementById('results')) {
    buscarRaza();
  }
};