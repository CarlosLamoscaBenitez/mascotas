const API_KEY_DOGS = 'live_ZE2wyfApzQ62Js8bu713zpgG1G0xxT06UWR9IdWAklHYdqAlmDrI7eg9QoXLh9MK';
const API_KEY_CATS = 'live_s8gGNspp6QmTiUPNQy3CRppb9zEKL0eQkWlMWcPrfuIyasuqYLhLCJrNaum3O1CG';
const WEATHER_KEY  = 'a5af05607feadde1b6fe58649857038f';

async function fetchRazasPerros(nombre = '') {
  // Truco: Para perros, el endpoint de búsqueda NO trae imágenes. 
  // Es mejor traer la lista completa y filtrar nosotros si queremos ver fotos.
  const url = 'https://api.thedogapi.com/v1/breeds';
  const res = await fetch(url, { headers: { 'x-api-key': API_KEY_DOGS } });
  const data = await res.json();
  
  if (nombre) {
    return data.filter(r => r.name.toLowerCase().includes(nombre.toLowerCase()));
  }
  return data.slice(0, 20);
}

async function fetchRazasGatos(nombre = '') {
  const res = await fetch('https://api.thecatapi.com/v1/breeds', { headers: { 'x-api-key': API_KEY_CATS } });
  const data = await res.json();
  if (nombre) return data.filter(r => r.name.toLowerCase().includes(nombre.toLowerCase()));
  return data.slice(0, 20);
}

async function fetchClima(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${WEATHER_KEY}&units=metric&lang=es`;
  const res = await fetch(url);
  return await res.json();
}