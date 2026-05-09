/**
 * api.js — Módulo de consumo de APIs
 * PetCare Guide
 */

const API_KEY_DOGS = 'live_ZE2wyfApzQ62Js8bu713zpgG1G0xxT06UWR9IdWAklHYdqAlmDrI7eg9QoXLh9MK';
const API_KEY_CATS = 'live_s8gGNspp6QmTiUPNQy3CRppb9zEKL0eQkWlMWcPrfuIyasuqYLhLCJrNaum3O1CG';
const WEATHER_KEY  = 'a5af05607feadde1b6fe58649857038f';

/* -------------------------------------------------------
   PERROS — The Dog API
------------------------------------------------------- */

async function fetchRazasPerros(nombre = '') {
  const url = nombre
    ? `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(nombre)}`
    : 'https://api.thedogapi.com/v1/breeds?limit=20';

  const res = await fetch(url);

  if (!res.ok) throw new Error(`Error Dog API: ${res.status} ${res.statusText}`);
  return await res.json();
}

async function fetchImagenPerro(breedId) {
  const url = `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=1`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Error Dog API imagen: ${res.status}`);
  const data = await res.json();
  return data[0] || null;
}

/* -------------------------------------------------------
   GATOS — The Cat API
------------------------------------------------------- */

async function fetchRazasGatos(nombre = '') {
  const res = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers: { 'x-api-key': API_KEY_CATS }
  });

  if (!res.ok) throw new Error(`Error Cat API: ${res.status} ${res.statusText}`);
  const razas = await res.json();

  if (!nombre) return razas.slice(0, 20);
  const q = nombre.toLowerCase();
  return razas.filter(r => r.name.toLowerCase().includes(q));
}

/* -------------------------------------------------------
   CLIMA — OpenWeatherMap
------------------------------------------------------- */

async function fetchClima(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(ciudad)}&appid=${WEATHER_KEY}&units=metric&lang=es`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error Weather API: ${res.status} ${res.statusText}`);
  return await res.json();
}

async function fetchPronostico(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/forecast` +
    `?q=${encodeURIComponent(ciudad)}&appid=${WEATHER_KEY}&units=metric&lang=es`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error Forecast API: ${res.status} ${res.statusText}`);
  return await res.json();
}