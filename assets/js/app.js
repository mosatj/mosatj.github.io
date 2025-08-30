
// Simple slider and dynamic rendering
function qs(s, r=document){ return r.querySelector(s); }
function qsa(s, r=document){ return Array.from(r.querySelectorAll(s)); }

// Hero slider
function initSlider(slider){
  const slides = qsa(".slide", slider);
  const dotsWrap = qs(".dots", slider);
  let i = 0, t;
  function show(k){
    i = (k+slides.length) % slides.length;
    slides.forEach((s,idx)=>s.classList.toggle("active", idx===i));
    qsa(".dot", dotsWrap).forEach((d,idx)=>d.classList.toggle("active", idx===i));
  }
  function next(){ show(i+1); }
  function prev(){ show(i-1); }
  function auto(){ clearInterval(t); t = setInterval(next, 6000); }
  // dots
  dotsWrap.innerHTML = slides.map((_,idx)=>`<span class="dot${idx===0?' active':''}" role="button" aria-label="Ir a slide ${idx+1}"></span>`).join("");
  dotsWrap.addEventListener("click", e=>{
    const n = qsa(".dot", dotsWrap).indexOf?.(e.target) ?? qsa(".dot", dotsWrap).findIndex(d=>d===e.target);
    if(n>=0){ show(n); auto(); }
  });
  qs(".next", slider)?.addEventListener("click", ()=>{ next(); auto(); });
  qs(".prev", slider)?.addEventListener("click", ()=>{ prev(); auto(); });
  auto();
  show(0);
}

// Render dynamic sections from data/news.json
async function boot(){
  const res = await fetch("data/news.json");
  const data = await res.json();

  // Hero build
  const hero = qs("#hero-slider");
  if(hero){
    hero.innerHTML = data.slides.map((s,idx)=>`
      <div class="slide${idx===0?' active':''}" aria-roledescription="slide">
        <div class="bg" style="background-image:url('${s.img}')"></div>
        <div class="fg container">
          <span class="badge">${s.categoria}</span>
          <h2>${s.titulo}</h2>
          <p>${s.resumen}</p>
          <a class="cta" href="${s.enlace}">Leer mas...</a>
        </div>
      </div>
    `).join("") + `<button class="prev" aria-label="Anterior">&#10094;</button><button class="next" aria-label="Siguiente">&#10095;</button><div class="dots" aria-label="Paginacion de slides"></div>`;
    initSlider(qs(".slider"));
  }

  // Side related
  const rel = qs("#relacionadas");
  if(rel){
    rel.innerHTML = data.relacionadas.map(n=>`
    <div class="side-item">
      <img loading="lazy" src="${n.img}" alt="${n.alt}">
      <div>
        <span class="badge">${n.categoria}</span>
        <div><strong>${n.titulo}</strong></div>
        <small>${n.fecha}</small>
      </div>
    </div>`).join("");
  }

  // Novedades
  const nov = qs("#novedades");
  if(nov){
    nov.innerHTML = data.novedades.map(n=>`
      <div class="side-item">
        <img loading="lazy" src="${n.img}" alt="${n.alt}">
        <div>
          <span class="badge">${n.categoria}</span>
          <div><strong>${n.titulo}</strong></div>
          <small>${n.fecha}</small>
        </div>
      </div>
    `).join("");
  }

  // News grid
  const grid = qs("#news-grid");
  if(grid){
    grid.innerHTML = data.noticias.map(n=>`
      <article class="news-card">
        <img loading="lazy" src="${n.img}" alt="${n.alt}">
        <div class="p">
          <span class="badge">${n.categoria}</span>
          <h3>${n.titulo}</h3>
          <p>${n.resumen}</p>
          <p class="meta"><span>${n.fecha}</span><span>${n.autor || 'OM-PUCP'}</span></p>
          <a class="button" href="${n.enlace}">Leer mas...</a>
        </div>
      </article>
    `).join("");
  }

  // Bottom strip
  const strip = qs("#strip");
  if(strip){
    strip.innerHTML = data.destacadas.map(n=>`
      <div class="strip-item">
        <img loading="lazy" src="${n.img}" alt="${n.alt}">
        <div>
          <span class="badge">${n.categoria}</span>
          <div><strong>${n.titulo}</strong></div>
          <small>${n.fecha}</small>
        </div>
      </div>
    `).join("");
  }
}
document.addEventListener("DOMContentLoaded", boot);
