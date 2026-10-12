(function(){
// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
});

// ============ MOBILE MENU ============
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ============ STATS COUNTER ANIMATION ============
function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }
    requestAnimationFrame(updateCounter);
  });
}

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');

      // Trigger counter animation when hero stats are visible
      if (entry.target.closest('.hero__stats') || entry.target.classList.contains('hero__stats')) {
        animateCounters();
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll(
  '.problem__card, .step, .why-us__card, .benefits__col, .faq__item, .section__header'
).forEach(el => observer.observe(el));

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq__question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));

    // Toggle current
    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

// ============ CONTACT FORM (CONNECTED TO WHATSAPP 9164060961) ============
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const carModel = document.getElementById('carModel').value.trim();
  const kmDriven = document.getElementById('kmDriven').value.trim();
  const intentSelect = document.getElementById('intent');
  const intentText = intentSelect.options[intentSelect.selectedIndex].text;

  // Validation
  if (!name || !phone || !carModel || !intentSelect.value) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Opening WhatsApp...';
  submitBtn.disabled = true;

  // Format message for German Motors WhatsApp
  const whatsappNumber = '916000683808'; // Country code 91 + 6000683808
  const message = 
    `*New Customer Enquiry - German Motors*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🚗 *Car Model:* ${carModel}\n` +
    `🛣️ *KM Driven:* ${kmDriven ? kmDriven + ' km' : 'Not specified'}\n` +
    `🎯 *Requirement:* ${intentText}\n\n` +
    `_Sent via German Motors Landing Page_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

  showToast(`Thank you, ${name}! Redirecting to German Motors WhatsApp...`, 'success');

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    contactForm.reset();
    submitBtn.textContent = 'Get Free Quote via WhatsApp 💬';
    submitBtn.disabled = false;
  }, 1000);
});

// ============ TOAST NOTIFICATION ============
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <p>${message}</p>
    <button onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
  `;
  document.body.appendChild(toast);

  // Auto remove
  setTimeout(() => toast.classList.add('toast--visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// ============ BACK TO TOP ============
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ ACTIVE NAV LINK HIGHLIGHTING ============
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelectorAll('.navbar__links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ============ CARS CAROUSEL SLIDER BUTTONS ============
const carsTrack = document.getElementById('carsTrack');
const carPrevBtn = document.getElementById('carPrevBtn');
const carNextBtn = document.getElementById('carNextBtn');

if (carsTrack && carPrevBtn && carNextBtn) {
  carNextBtn.addEventListener('click', () => {
    carsTrack.scrollBy({ left: 320, behavior: 'smooth' });
  });

  carPrevBtn.addEventListener('click', () => {
    carsTrack.scrollBy({ left: -320, behavior: 'smooth' });
  });
}

// ============ CAR DETAILS DATA (ELITE-STYLE MODAL) ============
const CARS_DATABASE = {};

// ============ MODAL OPEN / CLOSE LOGIC ============
const carModalOverlay = document.getElementById('carModalOverlay');
const carModalClose = document.getElementById('carModalClose');

let currentActiveCar = null;

function openCarModal(carId) {
  const data = CARS_DATABASE[carId];
  if (!data) return;

  currentActiveCar = data;

  // Populate title, meta, badges & pricing
  document.getElementById('modalCarTitle').textContent = data.title;
  document.getElementById('modalQuickMeta').textContent = data.quickMeta;
  document.getElementById('modalPrice').textContent = data.priceStr;
  document.getElementById('modalBadge').textContent = data.badge;
  document.getElementById('modalSpecialText').textContent = data.special;

  // Set main photo
  const mainImg = document.getElementById('modalMainImg');
  mainImg.hidden = !data.mainImg; if (data.mainImg) mainImg.src = data.mainImg;
  mainImg.alt = data.title;

  // Set gallery thumbnails
  const thumbsWrap = document.getElementById('modalThumbs');
  thumbsWrap.innerHTML = '';
  data.gallery.forEach((src, idx) => {
    const thumb = document.createElement('div');
    thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
    const image = document.createElement("img"); image.src = src; image.alt = `Car photo ${idx + 1}`; thumb.appendChild(image);
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = src;
    });
    thumbsWrap.appendChild(thumb);
  });

  // Populate Specs Grid
  const specsGrid = document.getElementById('modalSpecsGrid');
  specsGrid.innerHTML = '';
  for (const [key, val] of Object.entries(data.specs)) {
    const cell = document.createElement('div');
    cell.className = 'spec-cell';
    const label = document.createElement("span"); label.className="spec-label"; label.textContent=key; const value=document.createElement("span"); value.className="spec-value"; value.textContent=String(val); cell.append(label,value);
    specsGrid.appendChild(cell);
  }

  // Setup EMI slider initial values based on car price
  const downRange = document.getElementById('emiDownRange');
  const maxDown = Math.round(data.priceNum * 0.7);
  const defDown = Math.round(data.priceNum * 0.2);
  downRange.min = 0; downRange.max = maxDown;
  downRange.value = defDown;
  downRange.step = 10000;

  updateEmiCalculations();

  // Show modal
  carModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCarModal() {
  if (carModalOverlay) {
    carModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (carModalClose) {
  carModalClose.addEventListener('click', closeCarModal);
}

if (carModalOverlay) {
  carModalOverlay.addEventListener('click', (e) => {
    if (e.target === carModalOverlay) {
      closeCarModal();
    }
  });
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && carModalOverlay && carModalOverlay.classList.contains('active')) {
    closeCarModal();
  }
});

// Click on any car card trigger opens the modal
document.querySelectorAll('.car-card-trigger').forEach(card => {
  card.addEventListener('click', () => {
    const carId = card.getAttribute('data-car-id');
    if (carId) openCarModal(carId);
  });
});

// ============ INTERACTIVE EMI CALCULATOR LOGIC ============
const emiDownRange = document.getElementById('emiDownRange');
const emiTenureRange = document.getElementById('emiTenureRange');
const sliderDownVal = document.getElementById('sliderDownVal');
const sliderTenureVal = document.getElementById('sliderTenureVal');
const calcEmiVal = document.getElementById('calcEmiVal');
const modalEmiText = document.getElementById('modalEmiText');
const calcPrincipalVal = document.getElementById('calcPrincipalVal');
const calcInterestVal = document.getElementById('calcInterestVal');
const calcTotalVal = document.getElementById('calcTotalVal');

function formatInr(num) {
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

function updateEmiCalculations() {
  if (!currentActiveCar) return;

  const totalCost = currentActiveCar.priceNum;
  const downPayment = Number(emiDownRange.value);
  const tenureYears = Number(emiTenureRange.value);
  const tenureMonths = tenureYears * 12;

  sliderDownVal.textContent = formatInr(downPayment);
  sliderTenureVal.textContent = `${tenureYears} Year${tenureYears > 1 ? 's' : ''} (${tenureMonths} Mo)`;

  const principal = Math.max(totalCost - downPayment, 0);
  const annualRate = 9.5; // 9.5% standard auto loan
  const monthlyRate = annualRate / 12 / 100;

  let monthlyEmi = 0;
  if (principal > 0 && monthlyRate > 0) {
    monthlyEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                 (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalAmount = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(totalAmount - principal, 0);

  const formattedEmi = formatInr(monthlyEmi);
  calcEmiVal.textContent = formattedEmi;
  modalEmiText.innerHTML = `Starting EMI: <strong>${formattedEmi} /m</strong>`;
  calcPrincipalVal.textContent = formatInr(principal);
  calcInterestVal.textContent = formatInr(totalInterest);
  calcTotalVal.textContent = formatInr(totalAmount + downPayment);
}

if (emiDownRange && emiTenureRange) {
  emiDownRange.addEventListener('input', updateEmiCalculations);
  emiTenureRange.addEventListener('input', updateEmiCalculations);
}


window.openCarModal = openCarModal; window.closeCarModal = closeCarModal; window.updateEmiCalculations = updateEmiCalculations;
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
};
})();