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
const CARS_DATABASE = {
  car1: {
    title: "2022 Hyundai Creta SX 1.5",
    quickMeta: "32,000 Km • Petrol • Automatic (IVT)",
    priceNum: 1285000,
    priceStr: "₹12,85,000",
    badge: "Verified Health Checkup",
    mainImg: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "First owner vehicle in brand new condition. Fully documented service record with Hyundai authorized service center. Non-accidental certified.",
    specs: {
      "Model Year": "2022",
      "Registration Year": "2022",
      "Ownership": "1st Owner",
      "Fuel Type": "Petrol",
      "KMs Driven": "32,000 Km",
      "RTO": "AS-01 (Guwahati)",
      "Transmission": "Automatic (IVT)",
      "Insurance Type": "Comprehensive (Valid)",
      "Color": "Polar White"
    }
  },
  car2: {
    title: "2023 Volkswagen Virtus GT Plus 1.5 TSI",
    quickMeta: "18,400 Km • Petrol • DSG Automatic",
    priceNum: 1520000,
    priceStr: "₹15,20,000",
    badge: "Under Company Warranty",
    mainImg: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "Enthusiast owned GT performance sedan with active company warranty. 150-point German Motors inspection passed with 10/10 health rating.",
    specs: {
      "Model Year": "2023",
      "Registration Year": "2023",
      "Ownership": "1st Owner",
      "Fuel Type": "Petrol (Turbo)",
      "KMs Driven": "18,400 Km",
      "RTO": "AS-01 (Guwahati)",
      "Transmission": "7-Speed DSG",
      "Insurance Type": "Zero Dep (Valid 2027)",
      "Color": "Wild Cherry Red"
    }
  },
  car3: {
    title: "2021 BMW 3 Series 330i M Sport",
    quickMeta: "29,000 Km • Petrol • 8-Speed Steptronic",
    priceNum: 3450000,
    priceStr: "₹34,50,000",
    badge: "Luxury Verified",
    mainImg: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "Direct owner selling on our campus. Clean computer diagnostics scan, original paint, zero faults report openly available.",
    specs: {
      "Model Year": "2021",
      "Registration Year": "2021",
      "Ownership": "1st Owner",
      "Fuel Type": "Petrol",
      "KMs Driven": "29,000 Km",
      "RTO": "DL / AS NOC In Hand",
      "Transmission": "Automatic",
      "Insurance Type": "Comprehensive",
      "Color": "Portimao Blue"
    }
  },
  car4: {
    title: "2022 Mahindra Thar LX Hardtop 4x4",
    quickMeta: "24,500 Km • Diesel • 6-Speed Manual",
    priceNum: 1390000,
    priceStr: "₹13,90,000",
    badge: "Adventure Ready",
    mainImg: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "Original 4x4 with mechanical transfer case in 100% mint condition. Underside inspection shows zero rust or off-road damage.",
    specs: {
      "Model Year": "2022",
      "Registration Year": "2022",
      "Ownership": "1st Owner",
      "Fuel Type": "mHawk Diesel",
      "KMs Driven": "24,500 Km",
      "RTO": "AS-01 (Assam)",
      "Transmission": "Manual 4WD",
      "Insurance Type": "Comprehensive",
      "Color": "Mystic Copper"
    }
  },
  car5: {
    title: "2020 Honda City ZX 1.5 i-VTEC",
    quickMeta: "38,000 Km • Petrol • CVT Automatic",
    priceNum: 940000,
    priceStr: "₹9,40,000",
    badge: "Best Value",
    mainImg: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "Top trim with sunroof, LED headlights, and 6 airbags. Driven with utmost care by single doctor owner.",
    specs: {
      "Model Year": "2020",
      "Registration Year": "2020",
      "Ownership": "1st Owner",
      "Fuel Type": "Petrol",
      "KMs Driven": "38,000 Km",
      "RTO": "AS-01 (Guwahati)",
      "Transmission": "CVT 7-Step",
      "Insurance Type": "Valid Third-Party + Own",
      "Color": "Golden Brown Metallic"
    }
  },
  car6: {
    title: "2023 MG Hector Plus Sharp Pro 2.0L",
    quickMeta: "21,000 Km • Diesel • 6-Speed Manual",
    priceNum: 1760000,
    priceStr: "₹17,60,000",
    badge: "Top Spec 6-Seater",
    mainImg: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
    ],
    special: "Panoramic sunroof, 360-degree camera, captain seats. Certified clean inspection at German Motors campus with warranty coverage.",
    specs: {
      "Model Year": "2023",
      "Registration Year": "2023",
      "Ownership": "1st Owner",
      "Fuel Type": "Diesel",
      "KMs Driven": "21,000 Km",
      "RTO": "AS-01 (Assam)",
      "Transmission": "Manual",
      "Insurance Type": "Zero Dep Valid",
      "Color": "Starry Black"
    }
  }
};

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
  mainImg.src = data.mainImg;
  mainImg.alt = data.title;

  // Set gallery thumbnails
  const thumbsWrap = document.getElementById('modalThumbs');
  thumbsWrap.innerHTML = '';
  data.gallery.forEach((src, idx) => {
    const thumb = document.createElement('div');
    thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${src}" alt="Car photo ${idx + 1}" />`;
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
    cell.innerHTML = `
      <span class="spec-label">${key}</span>
      <span class="spec-value">${val}</span>
    `;
    specsGrid.appendChild(cell);
  }

  // Setup EMI slider initial values based on car price
  const downRange = document.getElementById('emiDownRange');
  const maxDown = Math.round(data.priceNum * 0.7);
  const defDown = Math.round(data.priceNum * 0.2);
  downRange.max = maxDown;
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

