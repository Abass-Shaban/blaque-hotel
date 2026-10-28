/**
 * The Blaque Hotel & 24/7 Bistro
 * Shopping Cart & Order Management System
 * 
 * Handles:
 * - Cart state management in localStorage
 * - Real-time item additions, updates, removals, and subtotals
 * - Dine-in, Takeaway, and Delivery order specifications
 * - Dynamic WhatsApp order message generation
 * - On-site receipt voucher confirmation modal
 * - User notifications
 */

class CartManager {
  constructor() {
    this.storageKey = 'blaque_hotel_cart_v1';
    this.cart = this.loadCart();
    this.orderType = 'dine_in'; // default: dine_in, takeaway, delivery
    this.init();
  }

  init() {
    this.updateCartBadge();
    this.bindEvents();
    this.renderCartItems();
  }

  // Load from localStorage
  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read cart from localStorage', e);
      return [];
    }
  }

  // Save to localStorage
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateCartBadge();
      this.renderCartItems();
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }

  // Add Item to Cart
  addItem(item, quantity = 1, specialNote = '') {
    const existingIndex = this.cart.findIndex(i => i.id === item.id);
    
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      if (specialNote) {
        this.cart[existingIndex].note = specialNote;
      }
    } else {
      this.cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        category: item.categoryName || 'Food',
        quantity: Number(quantity),
        note: specialNote || ''
      });
    }

    this.saveCart();
    this.showToast(`Added "${item.name}" to cart`, 'success');
  }

  // Update item quantity
  updateQuantity(itemId, change) {
    const item = this.cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      this.removeItem(itemId);
    } else {
      this.saveCart();
    }
  }

  // Remove item completely
  removeItem(itemId) {
    const item = this.cart.find(i => i.id === itemId);
    const itemName = item ? item.name : 'Item';
    this.cart = this.cart.filter(i => i.id !== itemId);
    this.saveCart();
    this.showToast(`Removed "${itemName}" from cart`);
  }

  // Clear entire cart
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Calculate totals
  getTotalCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Update the cart icon badge
  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const totalCount = this.getTotalCount();

    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
      
      // Bump animation
      badge.classList.remove('bump');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('bump');
    });
  }

  // Render items into the drawer
  renderCartItems() {
    const container = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const footer = document.getElementById('cartFooter');
    const subtotalEl = document.getElementById('cartSubtotalAmount');
    const totalEl = document.getElementById('cartTotalAmount');

    if (!container) return;

    if (this.cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (container) container.innerHTML = '';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'flex';

    const subtotal = this.getSubtotal();
    if (subtotalEl) subtotalEl.textContent = `${HOTEL_CONFIG.currency} ${subtotal.toLocaleString('en-KE')}`;
    if (totalEl) totalEl.textContent = `${HOTEL_CONFIG.currency} ${subtotal.toLocaleString('en-KE')}`;

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy" />
        <div class="cart-item-details">
          <div class="cart-item-name" title="${item.name}">${item.name}</div>
          <div class="cart-item-unit-price">${HOTEL_CONFIG.currency} ${item.price.toLocaleString('en-KE')} each</div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button type="button" class="qty-btn btn-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn btn-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-subtotal">${HOTEL_CONFIG.currency} ${(item.price * item.quantity).toLocaleString('en-KE')}</div>
            <button type="button" class="cart-item-remove" data-id="${item.id}" aria-label="Remove item" title="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners for item quantity/removal
    container.querySelectorAll('.btn-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.updateQuantity(id, -1);
      });
    });

    container.querySelectorAll('.btn-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.updateQuantity(id, 1);
      });
    });

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.removeItem(id);
      });
    });
  }

  // Open/Close Cart Drawer
  openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.renderCartItems();
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Bind UI Events
  bindEvents() {
    // Open cart buttons across site
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close button & overlay
    const closeBtn = document.getElementById('cartCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());

    const overlay = document.getElementById('cartOverlay');
    if (overlay) overlay.addEventListener('click', () => this.closeDrawer());

    // Order Type Selection
    const typeChips = document.querySelectorAll('.order-type-chip');
    const dineInExtra = document.getElementById('dineInDetails');
    const takeawayExtra = document.getElementById('takeawayDetails');
    const deliveryExtra = document.getElementById('deliveryDetails');

    typeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        typeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.orderType = chip.getAttribute('data-type');

        if (dineInExtra) dineInExtra.style.display = this.orderType === 'dine_in' ? 'block' : 'none';
        if (takeawayExtra) takeawayExtra.style.display = this.orderType === 'takeaway' ? 'block' : 'none';
        if (deliveryExtra) deliveryExtra.style.display = this.orderType === 'delivery' ? 'block' : 'none';
      });
    });

    // WhatsApp Checkout Button
    const btnWhatsApp = document.getElementById('btnSubmitWhatsApp');
    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', () => this.handleOrderSubmit('whatsapp'));
    }

    // Direct Confirmation Checkout Button
    const btnDirect = document.getElementById('btnSubmitDirect');
    if (btnDirect) {
      btnDirect.addEventListener('click', () => this.handleOrderSubmit('direct'));
    }
  }

  // Validate form details
  validateCustomerDetails() {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name) {
      this.showToast('Please enter your full name.', 'error');
      if (nameInput) nameInput.focus();
      return null;
    }

    if (!phone || phone.length < 8) {
      this.showToast('Please enter a valid phone number (e.g. 0712345678).', 'error');
      if (phoneInput) phoneInput.focus();
      return null;
    }

    let extraDetail = '';
    if (this.orderType === 'dine_in') {
      const tableInput = document.getElementById('tableNumber');
      const tableVal = tableInput ? tableInput.value.trim() : '';
      extraDetail = tableVal ? `Table / Room: ${tableVal}` : 'Table / Room: Dining Area';
    } else if (this.orderType === 'takeaway') {
      const pickupTimeInput = document.getElementById('pickupTime');
      const pickupVal = pickupTimeInput ? pickupTimeInput.value.trim() : '';
      extraDetail = pickupVal ? `Pickup Time: ${pickupVal}` : 'Pickup: As soon as ready (~20 mins)';
    } else if (this.orderType === 'delivery') {
      const addressInput = document.getElementById('deliveryAddress');
      const addressVal = addressInput ? addressInput.value.trim() : '';
      if (!addressVal) {
        this.showToast('Please enter your delivery address/landmark.', 'error');
        if (addressInput) addressInput.focus();
        return null;
      }
      extraDetail = `Delivery Address: ${addressVal}`;
    }

    const instructionsInput = document.getElementById('orderNotes');
    const instructions = instructionsInput ? instructionsInput.value.trim() : '';

    return {
      name,
      phone,
      orderType: this.orderType,
      extraDetail,
      instructions
    };
  }

  // Handle Order Submission
  handleOrderSubmit(method) {
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty! Add delicious items before checkout.', 'error');
      return;
    }

    const customer = this.validateCustomerDetails();
    if (!customer) return;

    // Generate Order Reference
    const orderRef = 'BQ-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = this.getSubtotal();
    const now = new Date().toLocaleString('en-KE', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });

    // Save to real-time Kitchen Order Service & Broadcast to Kitchen Display
    if (window.hotelOrderService) {
      window.hotelOrderService.createOrder({
        id: orderRef,
        customer,
        items: this.cart,
        subtotal,
        timestampFormatted: now
      });
    }

    if (method === 'whatsapp') {
      this.sendToWhatsApp(orderRef, customer, subtotal, now);
    }

    // Always show confirmation voucher modal
    this.showConfirmationVoucher(orderRef, customer, subtotal, now);
    this.closeDrawer();
  }

  // Format and Redirect to WhatsApp
  sendToWhatsApp(orderRef, customer, subtotal, timestamp) {
    const orderTypeLabels = {
      dine_in: "🍽️ DINE-IN ORDER",
      takeaway: "🛍️ TAKEAWAY / PICKUP",
      delivery: "🛵 DELIVERY ENQUIRY"
    };

    let msg = `*🏨 ${HOTEL_CONFIG.name.toUpperCase()}*\n`;
    msg += `*24/7 FOOD & BEVERAGE ORDER*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Order Ref:* #${orderRef}\n`;
    msg += `*Time:* ${timestamp}\n`;
    msg += `*Order Type:* ${orderTypeLabels[customer.orderType] || customer.orderType}\n`;
    msg += `*Service Detail:* ${customer.extraDetail}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*CUSTOMER DETAILS:*\n`;
    msg += `👤 *Name:* ${customer.name}\n`;
    msg += `📞 *Phone:* ${customer.phone}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*ORDER ITEMS:*\n`;

    this.cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}* x${item.quantity}\n`;
      msg += `   └ Price: ${HOTEL_CONFIG.currency} ${(item.price * item.quantity).toLocaleString('en-KE')}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*TOTAL AMOUNT: ${HOTEL_CONFIG.currency} ${subtotal.toLocaleString('en-KE')}*\n`;

    if (customer.instructions) {
      msg += `\n📝 *Special Instructions:* ${customer.instructions}\n`;
    }

    msg += `\n⚠️ _Please note: This order is pending kitchen acknowledgement. Kindly confirm preparation time & payment option._`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${HOTEL_CONFIG.whatsappNumber}?text=${encodedMsg}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }

  // Display On-Screen Order Voucher Modal
  showConfirmationVoucher(orderRef, customer, subtotal, timestamp) {
    const modal = document.getElementById('voucherModal');
    if (!modal) return;

    const refEl = document.getElementById('voucherOrderRef');
    const timeEl = document.getElementById('voucherOrderTime');
    const customerEl = document.getElementById('voucherCustomerInfo');
    const typeEl = document.getElementById('voucherOrderType');
    const itemsEl = document.getElementById('voucherItemsTable');
    const totalEl = document.getElementById('voucherOrderTotal');
    const waLinkEl = document.getElementById('voucherWhatsAppLink');

    if (refEl) refEl.textContent = `#${orderRef}`;
    if (timeEl) timeEl.textContent = timestamp;
    if (customerEl) customerEl.textContent = `${customer.name} (${customer.phone})`;
    if (typeEl) typeEl.textContent = `${customer.orderType.toUpperCase()} — ${customer.extraDetail}`;

    if (itemsEl) {
      itemsEl.innerHTML = this.cart.map(item => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td style="text-align:center;">x${item.quantity}</td>
          <td style="text-align:right;">${HOTEL_CONFIG.currency} ${(item.price * item.quantity).toLocaleString('en-KE')}</td>
        </tr>
      `).join('');
    }

    if (totalEl) {
      totalEl.textContent = `${HOTEL_CONFIG.currency} ${subtotal.toLocaleString('en-KE')}`;
    }

    // Set WhatsApp resend link on the voucher
    if (waLinkEl) {
      waLinkEl.onclick = () => {
        this.sendToWhatsApp(orderRef, customer, subtotal, timestamp);
      };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Once submitted and voucher shown, clear cart
    this.clearCart();
  }

  // Universal Toast Notification
  showToast(message, type = 'default') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8E3E" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D93025" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 320);
    }, 3500);
  }
}

// Global Cart Instance
let hotelCart;
document.addEventListener('DOMContentLoaded', () => {
  hotelCart = new CartManager();
  window.hotelCart = hotelCart;
});
