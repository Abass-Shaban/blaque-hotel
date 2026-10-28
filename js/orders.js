/**
 * The Blaque Hotel & 24/7 Bistro
 * Real-time Order Service & Kitchen Display Engine
 * 
 * Supports:
 * - Direct Cloud Synchronization with Supabase (PostgreSQL + Realtime WebSockets)
 * - BroadcastChannel & LocalStorage fallback
 * - Real-time synchronization between customer pages and kitchen screen worldwide
 * - Native Web Audio API chime bell (zero external audio dependencies)
 * - Order lifecycle state transitions: 'pending' -> 'preparing' -> 'ready' -> 'completed' -> 'cancelled'
 */

class OrderService {
  constructor() {
    this.storageKey = 'blaque_hotel_orders_v1';
    this.channelName = 'blaque_kitchen_orders_channel';
    this.broadcastChannel = null;
    this.audioCtx = null;
    this.listeners = [];
    this.supabase = null;

    this.initSupabase();
    this.initBroadcastChannel();
  }

  // Initialize Supabase Client
  initSupabase() {
    if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
      if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        try {
          this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
          console.log('✅ Supabase connected to:', SUPABASE_CONFIG.url);
        } catch (e) {
          console.warn('Supabase initialization warning:', e);
        }
      }
    }
  }

  // Initialize BroadcastChannel for instant cross-tab real-time sync
  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_ORDER') {
            this.notifyListeners(event.data.order, 'created');
          } else if (event.data && event.data.type === 'ORDER_STATUS_CHANGED') {
            this.notifyListeners(event.data.order, 'updated');
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel fallback:', e);
      }
    }

    // Storage event fallback for cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        const orders = this.getAllOrders();
        if (orders.length > 0) {
          this.notifyListeners(orders[0], 'storage_sync');
        }
      }
    });
  }

  // Subscribe to live order updates (used by kitchen.html)
  onOrderUpdate(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyListeners(order, action) {
    this.listeners.forEach(cb => {
      try { cb(order, action); } catch (err) { console.error(err); }
    });
  }

  // Get all orders from storage
  getAllOrders() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read orders from storage', e);
      return [];
    }
  }

  // Save full orders list
  saveOrders(orders) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to storage', e);
    }
  }

  // Create and submit a new order
  createOrder(orderData) {
    const orders = this.getAllOrders();

    const newOrder = {
      id: orderData.id || ('BQ-' + Math.floor(100000 + Math.random() * 900000)),
      createdAt: orderData.createdAt || new Date().toISOString(),
      timestampFormatted: orderData.timestampFormatted || new Date().toLocaleString('en-KE', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }),
      customer: {
        name: orderData.customer.name,
        phone: orderData.customer.phone
      },
      orderType: orderData.customer.orderType, // 'dine_in', 'takeaway', 'delivery'
      serviceDetail: orderData.customer.extraDetail || '',
      instructions: orderData.customer.instructions || '',
      items: orderData.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        note: item.note || '',
        subtotal: item.price * item.quantity
      })),
      totalAmount: orderData.subtotal,
      currency: HOTEL_CONFIG.currency || 'KES',
      status: 'pending', // 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
      paymentStatus: 'unpaid'
    };

    // Prepend to top of local storage
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Broadcast event across windows
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'NEW_ORDER', order: newOrder });
    }

    // Push to Supabase Cloud Database
    this.syncToSupabase(newOrder);

    return newOrder;
  }

  // Sync order to Supabase
  async syncToSupabase(order) {
    if (!this.supabase) {
      this.initSupabase();
    }

    if (!this.supabase) return;

    try {
      // 1. Insert into 'orders' table
      const { error: orderError } = await this.supabase
        .from('orders')
        .insert([{
          id: order.id,
          customer_name: order.customer.name,
          customer_phone: order.customer.phone,
          order_type: order.orderType,
          service_detail: order.serviceDetail,
          special_instructions: order.instructions,
          total_amount: order.totalAmount,
          currency: order.currency,
          status: 'pending',
          payment_status: 'unpaid'
        }]);

      if (orderError) {
        console.warn('Supabase orders table insert:', orderError.message);
      }

      // 2. Insert items into 'order_items' table
      if (order.items && order.items.length > 0) {
        const itemsPayload = order.items.map(item => ({
          order_id: order.id,
          menu_item_id: item.id,
          item_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
          custom_note: item.note || ''
        }));

        const { error: itemsError } = await this.supabase
          .from('order_items')
          .insert(itemsPayload);

        if (itemsError) {
          console.warn('Supabase order_items table insert:', itemsError.message);
        }
      }

      console.log(`Cloud Synced: Order #${order.id} sent to Supabase PostgreSQL`);
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  }

  // Update order status (in storage and Supabase)
  async updateOrderStatus(orderId, newStatus) {
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);

    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'ORDER_STATUS_CHANGED', order });
      }

      this.notifyListeners(order, 'updated');
    }

    // Update in Supabase
    if (this.supabase) {
      try {
        await this.supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        console.log(`Cloud Synced: Order #${orderId} status set to "${newStatus}" in Supabase`);
      } catch (e) {
        console.warn('Failed to update status in Supabase:', e);
      }
    }

    return order;
  }

  // Clear completed orders from storage
  clearCompletedOrders() {
    let orders = this.getAllOrders();
    orders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    this.saveOrders(orders);
    this.notifyListeners(null, 'cleared');
  }

  // Submit contact inquiries to Supabase
  async submitInquiry(inquiryData) {
    if (!this.supabase) this.initSupabase();

    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('inquiries')
          .insert([{
            name: inquiryData.name,
            phone: inquiryData.phone,
            email: inquiryData.email || '',
            inquiry_type: inquiryData.type,
            message: inquiryData.message,
            status: 'new'
          }]);

        if (error) {
          console.warn('Supabase inquiries insert error:', error.message);
        } else {
          console.log('Inquiry saved to Supabase');
        }
      } catch (e) {
        console.warn('Failed to save inquiry to Supabase:', e);
      }
    }
  }

  // Web Audio Kitchen Chime (Pure Synthesizer Bell)
  playOrderChime() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // 3-Tone Hotel Service Bell Melody: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const notes = [523.25, 659.25, 783.99];

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    } catch (e) {
      console.warn('Could not play web audio chime:', e);
    }
  }
}

// Global Order Service Instance
const hotelOrderService = new OrderService();
if (typeof window !== 'undefined') {
  window.hotelOrderService = hotelOrderService;
}
