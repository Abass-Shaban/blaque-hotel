/**
 * The Blaque Hotel & 24/7 Bistro
 * Master UI & Interaction Controller
 * 
 * Manages:
 * - Responsive navbar scroll and frosted glass transition
 * - Mobile hamburger drawer open/close
 * - FAQ interactive accordion
 * - Auto-population of hotel contact info from HOTEL_CONFIG
 * - Homepage featured dishes rendering
 * - Keyboard shortcuts (ESC to close drawers/modals)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initFaqAccordion();
  populateHotelData();
  renderFeaturedDishes();
  initKeyboardNavigation();
});

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileDrawerClose');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    toggleBtn.classList.add('active');
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Close when clicking a nav link
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close any other open item
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   POPULATE DYNAMIC HOTEL CONFIG DATA
   ========================================================================== */
function populateHotelData() {
  if (typeof HOTEL_CONFIG === 'undefined') return;

  // Hotel Names
  document.querySelectorAll('.data-hotel-name').forEach(el => {
    el.textContent = HOTEL_CONFIG.name;
  });

  // Phone Numbers
  document.querySelectorAll('.data-hotel-phone').forEach(el => {
    el.textContent = HOTEL_CONFIG.phone;
    if (el.tagName === 'A') {
      el.href = `tel:${HOTEL_CONFIG.phone.replace(/\s+/g, '')}`;
    }
  });

  // Secondary Phone
  document.querySelectorAll('.data-hotel-phone-sec').forEach(el => {
    el.textContent = HOTEL_CONFIG.phoneSecondary;
    if (el.tagName === 'A') {
      el.href = `tel:${HOTEL_CONFIG.phoneSecondary.replace(/\s+/g, '')}`;
    }
  });

  // Email
  document.querySelectorAll('.data-hotel-email').forEach(el => {
    el.textContent = HOTEL_CONFIG.email;
    if (el.tagName === 'A') {
      el.href = `mailto:${HOTEL_CONFIG.email}`;
    }
  });

  // Address
  document.querySelectorAll('.data-hotel-address').forEach(el => {
    el.textContent = HOTEL_CONFIG.address;
  });

  // Opening Hours
  document.querySelectorAll('.data-hotel-hours').forEach(el => {
    el.textContent = HOTEL_CONFIG.hours;
  });

  // WhatsApp Links
  document.querySelectorAll('.data-hotel-whatsapp-link').forEach(el => {
    if (el.tagName === 'A') {
      const msg = encodeURIComponent(HOTEL_CONFIG.whatsappGreeting || 'Hello Blaque Hotel! I would like to enquire about your 24/7 kitchen menu.');
      el.href = `https://wa.me/${HOTEL_CONFIG.whatsappNumber}?text=${msg}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });

  // Google Maps Link
  document.querySelectorAll('.data-hotel-maps-link').forEach(el => {
    if (el.tagName === 'A') {
      el.href = HOTEL_CONFIG.mapsUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });

  // Google Maps Embed Iframe
  const mapIframe = document.querySelector('.data-hotel-maps-embed');
  if (mapIframe && HOTEL_CONFIG.mapsEmbedUrl) {
    mapIframe.src = HOTEL_CONFIG.mapsEmbedUrl;
  }

  // Social Links
  const fbLinks = document.querySelectorAll('.data-social-facebook');
  fbLinks.forEach(l => { if (l.tagName === 'A') l.href = HOTEL_CONFIG.social.facebook; });

  const igLinks = document.querySelectorAll('.data-social-instagram');
  igLinks.forEach(l => { if (l.tagName === 'A') l.href = HOTEL_CONFIG.social.instagram; });

  const ttLinks = document.querySelectorAll('.data-social-tiktok');
  ttLinks.forEach(l => { if (l.tagName === 'A') l.href = HOTEL_CONFIG.social.tiktok; });

  const twLinks = document.querySelectorAll('.data-social-twitter');
  twLinks.forEach(l => { if (l.tagName === 'A') l.href = HOTEL_CONFIG.social.twitter; });

  // Current Year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   HOMEPAGE FEATURED DISHES RENDERER
   ========================================================================== */
function renderFeaturedDishes() {
  const container = document.getElementById('featuredDishesContainer');
  if (!container || typeof MENU_ITEMS === 'undefined') return;

  // Select top featured items across categories (e.g. signature & bestselling)
  const featuredIds = ['mm-01', 'mm-03', 'ff-01', 'ff-07', 'bf-05', 'bv-03'];
  const featuredItems = MENU_ITEMS.filter(item => featuredIds.includes(item.id));

  container.innerHTML = featuredItems.map(item => `
    <article class="food-card" data-id="${item.id}">
      <div class="food-card-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy" />
        <span class="card-badge ${item.isSpecial ? 'gold' : ''}">${item.badge || 'Chef Favorite'}</span>
        <span class="card-badge live-24h">
          <span class="pulse-dot" style="width:6px;height:6px;"></span> 24/7
        </span>
      </div>
      <div class="food-card-body">
        <div class="food-meta">
          <span class="food-category">${item.categoryName}</span>
          <span class="food-preptime">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${item.prepTime}
          </span>
        </div>
        <h3 class="food-title">${item.name}</h3>
        <p class="food-desc">${item.description}</p>
        <div class="food-footer">
          <div class="food-price">${HOTEL_CONFIG.currency} ${item.price.toLocaleString('en-KE')}</div>
          <button type="button" class="btn btn-add-cart" data-id="${item.id}" aria-label="Add ${item.name} to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Add click listeners
  container.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-id');
      const dish = MENU_ITEMS.find(i => i.id === id);
      if (dish && window.hotelCart) {
        window.hotelCart.addItem(dish, 1);
      }
    });
  });
}

/* ==========================================================================
   KEYBOARD NAVIGATION & ACCESSIBILITY
   ========================================================================== */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close cart drawer if open
      if (window.hotelCart) {
        window.hotelCart.closeDrawer();
      }
      
      // Close dish modal if open
      const dishModal = document.getElementById('dishModal');
      if (dishModal && dishModal.classList.contains('open')) {
        dishModal.classList.remove('open');
        document.body.style.overflow = '';
      }

      // Close voucher modal if open
      const voucherModal = document.getElementById('voucherModal');
      if (voucherModal && voucherModal.classList.contains('open')) {
        voucherModal.classList.remove('open');
        document.body.style.overflow = '';
      }

      // Close mobile drawer
      const mobileDrawer = document.getElementById('mobileDrawer');
      const overlay = document.getElementById('mobileNavOverlay');
      const toggle = document.getElementById('mobileMenuToggle');
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Voucher modal close button
  const voucherCloseBtn = document.getElementById('voucherCloseBtn');
  const voucherDoneBtn = document.getElementById('voucherDoneBtn');
  const voucherModal = document.getElementById('voucherModal');

  const closeVoucher = () => {
    if (voucherModal) {
      voucherModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (voucherCloseBtn) voucherCloseBtn.addEventListener('click', closeVoucher);
  if (voucherDoneBtn) voucherDoneBtn.addEventListener('click', closeVoucher);
  if (voucherModal) {
    voucherModal.addEventListener('click', (e) => {
      if (e.target === voucherModal) closeVoucher();
    });
  }
}
