import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
mkdirSync('public', { recursive: true });
mkdirSync('src/lib', { recursive: true });
cpSync('styles.css', 'public/styles.css');
cpSync('image', 'public/image', { recursive: true });
const html = readFileSync('index.html', 'utf8');
let body = html.split('<body>')[1].split('</body>')[0].replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
body = body.replace(/(<div class="cars-carousel" id="carsTrack">)[\s\S]*?(\n        <\/div>\n      <\/div>)/, '$1<p class="inventory-state" role="status">Loading vehicles…</p>$2');
body = body.replace(/<div class="modal-health-assurance">[\s\S]*?<\/div>\s*<\/div>/, '<div class="modal-health-assurance" hidden></div>');
body = body.replace('Well Maintained &amp; Certified', 'Vehicle notes');
body = body.replace('Regularly serviced at authorized centers and kept in pristine condition. Non-accidental, non-meter-tampered guarantee.', '');
body = body.replace('<p>&copy; 2026 German Motors.', '<a href="/admin">Staff sign in</a><p>&copy; 2026 German Motors.');
writeFileSync('src/lib/public-markup.ts', `// Generated from the preserved static website by scripts/prepare-public.mjs.\nexport const publicMarkup = ${JSON.stringify(body)};\n`);
let js = readFileSync('script.js', 'utf8');
js = js.replace(/const CARS_DATABASE = \{[\s\S]*?\n\};/, 'const CARS_DATABASE = {};');
js = js.replace('thumb.innerHTML = `<img src="${src}" alt="Car photo ${idx + 1}" />`;', 'const image = document.createElement("img"); image.src = src; image.alt = `Car photo ${idx + 1}`; thumb.appendChild(image);');
js = js.replace(/cell.innerHTML = `[\s\S]*?`;/, 'const label = document.createElement("span"); label.className="spec-label"; label.textContent=key; const value=document.createElement("span"); value.className="spec-value"; value.textContent=String(val); cell.append(label,value);');
js = js.replace('mainImg.src = data.mainImg;', 'mainImg.hidden = !data.mainImg; if (data.mainImg) mainImg.src = data.mainImg;');
js = js.replace('downRange.max = maxDown;', 'downRange.min = 0; downRange.max = maxDown;');
js += `\nwindow.openCarModal = openCarModal; window.closeCarModal = closeCarModal; window.updateEmiCalculations = updateEmiCalculations;
window.setPublicInventory = function(vehicles) {
  carsTrack.replaceChildren();
  if (!vehicles.length) { const empty=document.createElement('p'); empty.className='inventory-state'; empty.textContent='No vehicles are currently listed. Contact German Motors for availability.'; carsTrack.appendChild(empty); return; }
  vehicles.forEach(v => {
    const title=[v.manufacturing_year,v.make,v.model,v.variant].filter(Boolean).join(' ');
    const gallery=v.images.map(i=>'/api/public/vehicle-image?id='+encodeURIComponent(i.id));
    const specs={};
    const fields={'Model Year':'manufacturing_year','KMs Driven':'kilometres_driven','Fuel Type':'fuel_type','Transmission':'transmission','Body Type':'body_type','Registration State':'registration_state','Previous Owners':'previous_owners','Color':'exterior_color','Insurance Valid Until':'insurance_valid_until','Registration Valid Until':'registration_valid_until','Service History':'service_history_status','Inspection':'inspection_status'};
    Object.entries(fields).forEach(([label,key])=> { if(v[key]!==null && v[key]!=='' && v[key]!==undefined) specs[label]=String(v[key]); });
    if(v.registration_number) specs['Registration Number']=v.registration_number;
    Object.entries(v.specifications || {}).forEach(([key,value])=>{ if(value!==null && typeof value!=='object' && value!=='') specs[key]=String(value); });
    const meta=[v.kilometres_driven===null?null:v.kilometres_driven.toLocaleString('en-IN')+' Km',v.fuel_type,v.transmission].filter(Boolean);
    CARS_DATABASE[v.id]={title,quickMeta:meta.join(' • '),priceNum:Number(v.price),priceStr:formatInr(Number(v.price)),badge:v.is_featured?'Featured':'Available',mainImg:gallery[0]||'',gallery,special:[v.description||v.short_description,...v.features].filter(Boolean).join(' · '),specs};
    const card=document.createElement('div'); card.className='car-card car-card-trigger'; card.tabIndex=0; card.setAttribute('role','button'); card.setAttribute('aria-label','View '+title);
    const media=document.createElement('div'); media.className='car-card__media';
    if(gallery[0]) { const img=document.createElement('img'); img.src=gallery[0]; img.alt=title; img.className='car-card__img'; img.loading='lazy'; media.appendChild(img); }
    const badge=document.createElement('span'); badge.className='car-card__badge'; badge.textContent=v.is_featured?'Featured':'Available'; media.appendChild(badge);
    const content=document.createElement('div'); content.className='car-card__body';
    const heading=document.createElement('h3'); heading.className='car-card__name'; heading.textContent=title;
    const tags=document.createElement('div'); tags.className='car-card__tags'; meta.forEach(t=>{const span=document.createElement('span'); span.textContent=t; tags.appendChild(span);});
    const footer=document.createElement('div'); footer.className='car-card__footer';
    const price=document.createElement('span'); price.className='car-price'; price.textContent=formatInr(Number(v.price))+(v.is_price_negotiable?' · Negotiable':'');
    const details=document.createElement('button'); details.type='button'; details.className='car-card__btn'; details.textContent='Details'; details.addEventListener('click',e=>{e.stopPropagation();openCarModal(v.id);});
    footer.append(price,details); content.append(heading,tags,footer); card.append(media,content); card.addEventListener('click',()=>openCarModal(v.id)); card.addEventListener('keydown',e=>{if(e.key==='Enter') openCarModal(v.id);}); carsTrack.appendChild(card);
  });
};`;
writeFileSync('public/script.js', `(function(){\n${js}\n})();`);