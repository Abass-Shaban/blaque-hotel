/**
 * The Blaque Hotel & 24/7 Bistro
 * Interactive Menu Controller
 * 
 * Features:
 * - Dynamic rendering of menu items from MENU_ITEMS
 * - Category filtering (All, Breakfast, Main Meals, Fast Food & Snacks, Beverages, Specials)
 * - Live real-time search filtering
 * - Dietary & quick-tag filters
 * - Dish Detail Modal with portion size, prep time, and add-to-cart
 */

class MenuController {
  constructor() {
    this.items = (typeof MENU_ITEMS !== 'undefined') ? MENU_ITEMS : [];
    
    // Read category from URL query param if present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    const validCats = ['all', 'breakfast', 'main_meals', 'fast_food', 'beverages', 'specials'];
    this.currentCategory = validCats.includes(catParam) ? catParam : 'all';

    this.searchTerm = '';
    this.activeTag = 'all';
    this.container = document.getElementById('menuGridContainer');
    this.searchInput = document.getElementById('menuSearchInput');
    this.tabsContainer = document.getElementById('categoryTabs');
    this.init();
  }

  init() {
    if (!this.container) return;
    this.bindEvents();
    this.renderTabs();
    this.render();
  }

  bindEvents() {
    // Search input listener with debouncing
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Modal close listeners
    const modal = document.getElementById('dishModal');
    const modalClose = document.getElementById('dishModalClose');
    if (modalClose && modal) {
      modalClose.addEventListener('click', () => this.closeDishModal());
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeDishModal();
      });
    }
  }

  renderTabs() {
    if (!this.tabsContainer) return;

    const categories = [
      { id: 'all', label: 'All Items' },
      { id: 'breakfast', label: 'Breakfast' },
      { id: 'main_meals', label: 'Main Meals' },
      { id: 'fast_food', label: 'Fast Food & Snacks' },
      { id: 'beverages', label: 'Beverages' },
      { id: 'specials', label: 'Chef Specials & Deals' }
    ];

    this.tabsContainer.innerHTML = categories.map(cat => {
      const count = this.getCategoryCount(cat.id);
      return `
        <button type="button" class="category-tab ${cat.id === this.currentCategory ? 'active' : ''}" data-category="${cat.id}">
          <span>${cat.label}</span>
          <span class="count">${count}</span>
        </button>
      `;
    }).join('');

    this.tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-category');
        this.setCategory(cat);
      });
    });
  }

  getCategoryCount(categoryId) {
    if (categoryId === 'all') return this.items.length;
    if (categoryId === 'specials') return this.items.filter(i => i.isSpecial).length;
    return this.items.filter(i => i.category === categoryId).length;
  }

  setCategory(categoryId) {
    this.currentCategory = categoryId;
    this.renderTabs();
    this.render();
  }

  getFilteredItems() {
    return this.items.filter(item => {
      // Category filter
      let matchesCat = true;
      if (this.currentCategory === 'specials') {
        matchesCat = item.isSpecial;
      } else if (this.currentCategory !== 'all') {
        matchesCat = item.category === this.currentCategory;
      }

      // Search filter
      const matchesSearch = !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm) ||
        item.description.toLowerCase().includes(this.searchTerm) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)));

      return matchesCat && matchesSearch;
    });
  }

  render() {
    if (!this.container) return;

    const filtered = this.getFilteredItems();

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="menu-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No dishes found</h3>
          <p>We couldn't find any dishes matching "${this.searchTerm}". Try searching for something else or view all categories.</p>
          <button type="button" class="btn btn-outline btn-sm" id="btnResetFilter" style="margin-top: 1rem;">
            Reset Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('btnResetFilter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.currentCategory = 'all';
          this.searchTerm = '';
          if (this.searchInput) this.searchInput.value = '';
          this.renderTabs();
          this.render();
        });
      }
      return;
    }

    this.container.innerHTML = filtered.map(item => this.renderCardHtml(item)).join('');

    // Bind Add to Cart buttons
    this.container.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        const dish = this.items.find(i => i.id === id);
        if (dish && window.hotelCart) {
          window.hotelCart.addItem(dish, 1);
        }
      });
    });

    // Bind card click to open Dish Details Modal
    this.container.querySelectorAll('.food-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent opening if clicked on add to cart button directly
        if (e.target.closest('.btn-add-cart')) return;
        const id = card.getAttribute('data-id');
        const dish = this.items.find(i => i.id === id);
        if (dish) {
          this.openDishModal(dish);
        }
      });
    });
  }

  renderCardHtml(item) {
    const badgeHtml = item.badge ? `<span class="card-badge ${item.isSpecial ? 'gold' : ''}">${item.badge}</span>` : '';
    const live24hPill = item.available24h ? `
      <span class="card-badge live-24h" title="Available 24/7">
        <span class="pulse-dot" style="width:6px;height:6px;"></span> 24/7
      </span>
    ` : `
      <span class="card-badge live-24h" style="background: rgba(80,60,40,0.85);" title="Fresh Kitchen Hours Only">
        Daily Peak
      </span>
    `;

    const tagsHtml = (item.tags || []).map(t => `<span class="food-tag-pill">${t}</span>`).join('');

    return `
      <article class="food-card" data-id="${item.id}" tabindex="0">
        <div class="food-card-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy" />
          ${badgeHtml}
          ${live24hPill}
        </div>
        <div class="food-card-body">
          <div class="food-meta">
            <span class="food-category">${item.categoryName}</span>
            <span class="food-preptime">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${item.prepTime || '15 mins'}
            </span>
          </div>
          <h3 class="food-title" title="${item.name}">${item.name}</h3>
          <p class="food-desc">${item.description}</p>
          <div class="food-tags">${tagsHtml}</div>
          <div class="food-footer">
            <div class="food-price">${HOTEL_CONFIG.currency} ${item.price.toLocaleString('en-KE')}</div>
            <button type="button" class="btn btn-add-cart" data-id="${item.id}" aria-label="Add ${item.name} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  openDishModal(dish) {
    const modal = document.getElementById('dishModal');
    if (!modal) return;

    const img = document.getElementById('modalDishImg');
    const title = document.getElementById('modalDishTitle');
    const category = document.getElementById('modalDishCategory');
    const desc = document.getElementById('modalDishDesc');
    const price = document.getElementById('modalDishPrice');
    const prep = document.getElementById('modalDishPrep');
    const avail = document.getElementById('modalDishAvail');
    const qtyVal = document.getElementById('modalDishQty');
    const noteInput = document.getElementById('modalDishNote');
    const addBtn = document.getElementById('modalDishAddBtn');

    if (img) img.src = dish.image;
    if (img) img.alt = dish.name;
    if (title) title.textContent = dish.name;
    if (category) category.textContent = `${dish.categoryName} ${dish.badge ? '• ' + dish.badge : ''}`;
    if (desc) desc.textContent = dish.description;
    if (price) price.textContent = `${HOTEL_CONFIG.currency} ${dish.price.toLocaleString('en-KE')}`;
    if (prep) prep.textContent = `Preparation: ~${dish.prepTime || '15-20 mins'}`;
    if (avail) {
      avail.textContent = dish.available24h ? "Served round the clock (24/7)" : "Available during regular kitchen hours";
    }

    if (noteInput) noteInput.value = '';
    let currentQty = 1;
    if (qtyVal) qtyVal.textContent = currentQty;

    // Stepper buttons inside modal
    const decBtn = document.getElementById('modalQtyDec');
    const incBtn = document.getElementById('modalQtyInc');

    if (decBtn) {
      decBtn.onclick = () => {
        if (currentQty > 1) {
          currentQty--;
          qtyVal.textContent = currentQty;
        }
      };
    }

    if (incBtn) {
      incBtn.onclick = () => {
        currentQty++;
        qtyVal.textContent = currentQty;
      };
    }

    if (addBtn) {
      addBtn.onclick = () => {
        const specialNote = noteInput ? noteInput.value.trim() : '';
        if (window.hotelCart) {
          window.hotelCart.addItem(dish, currentQty, specialNote);
        }
        this.closeDishModal();
      };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDishModal() {
    const modal = document.getElementById('dishModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.hotelMenuController = new MenuController();
});
