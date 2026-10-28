# The Blaque Hotel & 24/7 Bistro Website

A modern, responsive, appetizing website built with **HTML5, CSS3, and vanilla JavaScript** for a hotel operating 24 hours a day and selling food, snacks, and beverages in Nairobi, Kenya.

---

## 🌟 Key Features

1. **24/7 Service Branding**:
   - Live pulsating 24-hour indicators and badges across all pages.
   - Dedicated late-night dining and midnight cravings section.
   - Transparent kitchen notice regarding round-the-clock vs. peak specialty prep times.

2. **Interactive Food & Beverage Menu**:
   - Complete catalog organized into 4 required categories:
     - **Breakfast**: Spiced Kenyan tea & mandazi, barista coffee & pastries, eggs & toast, buttermilk pancakes, full English breakfast.
     - **Main Meals**: Crispy chicken & chips, beef stew with rice, Swahili beef pilau, chapati with coconut beans (ndengu/maharagwe), traditional ugali with beef/chicken, whole tilapia with rice, Mombasa chicken biriani, fresh vegetable curry.
     - **Fast Food & Snacks**: Gourmet beef burgers, crispy chicken burgers, French fries (regular/masala), grilled sausages, crispy samosas, club sandwiches, artisan stone-baked pizza.
     - **Beverages**: Kenyan tea (chai), handcrafted espresso/coffee, cold-pressed fresh juices, mineral water, chilled soft drinks, decadent milkshakes.
   - Real-time search by dish title, ingredient, or keyword.
   - Instant category filtering with item counters.
   - Dish detail popup modal showing preparation time, dietary tags, notes, and stepper.

3. **Persistent Shopping Cart & Multi-Type Ordering**:
   - Persisted across page reloads and navigation via `localStorage`.
   - Real-time subtotal and grand total calculation in **Kenyan Shillings (KES)**.
   - Supports 3 distinct service options:
     - 🍽️ **Dine-In**: Prompts for Table Number or Hotel Room Number.
     - 🛍️ **Takeaway / Pickup**: Prompts for Estimated Pickup Time (e.g. ASAP / specific hour).
     - 🛵 **Delivery Enquiry**: Prompts for Delivery Address & landmark in Nairobi.
   - Customer validation for Name and Phone Number.
   - Special dietary and allergy notes input.

4. **1-Tap WhatsApp Order Dispatch**:
   - Formats a structured, emoji-rich WhatsApp message with:
     - Hotel header & timestamp
     - Unique Order Reference ID (e.g. `#BQ-839201`)
     - Customer contact details
     - Order type & location/table specifics
     - Itemized dish breakdown, quantities, and line totals in KES
     - Clear disclaimer: *"Order is not confirmed until the hotel kitchen acknowledges it."*
   - Sends directly to the hotel's configured WhatsApp number.

5. **On-Screen Digital Order Voucher**:
   - Automatically displays an on-screen receipt with status `PENDING ACKNOWLEDGEMENT`.
   - Allows guests to re-send via WhatsApp or call front desk with one tap.

6. **Live Kitchen Display System (KDS) & Real-Time Chime (`kitchen.html`)**:
   - Dedicated screen for hotel chefs, kitchen staff, or front desk computers.
   - **Audible Chime Alert 🔔:** Plays an automatic 3-tone hotel bell melody whenever an order is submitted.
   - **Order Lifecycle Management:** Kitchen staff can advance orders:
     `Pending (New)` ➔ `In Kitchen (Cooking)` ➔ `Ready for Pickup` ➔ `Completed`.
   - Direct 1-click WhatsApp customer message to notify them when food is ready.
   - Real-time order metrics and revenue tracker.

7. **Design & Color Palette**:
   - Primary: Deep charcoal `#202124`
   - Secondary: Warm orange `#FF6332`
   - Accent: Golden yellow `#F4B942`
   - Background: Cream white `#FFF9F2`
   - Text: Dark brown `#38291F`
   - High-contrast typography, rounded cards, subtle image hover zoom, smooth shadows, and `@media (prefers-reduced-motion: reduce)` support.

---

## 📁 Project Structure

```text
hotel-food-website/
├── index.html            # Homepage (Hero, highlights, popular meals, specials, reviews, map, FAQ)
├── menu.html             # Full Interactive Menu Catalog (Search, category tabs, detail modals)
├── kitchen.html          # Live Kitchen Display System (KDS) for hotel staff with audio chime alert
├── about.html            # Hotel story, 24/7 kitchen hygiene, dining spaces & chef philosophy
├── contact.html          # Contact info, inquiry form, WhatsApp desk, operating hours, Google Maps
├── start-server.bat      # One-click Windows launcher (opens site & kitchen screen)
├── css/
│   └── style.css         # Master responsive stylesheet with custom design tokens
├── js/
│   ├── config.js         # Hotel master data, phone, WhatsApp, location & menu items/prices
│   ├── orders.js         # Real-time order service, broadcast channel & Web Audio chime
│   ├── cart.js           # Cart management, localStorage, validation, WhatsApp order builder
│   ├── menu.js           # Dynamic menu rendering, live search, categories, dish modal
│   └── main.js           # Navigation, scroll state, FAQ accordions, keyboard accessibility
├── assets/
│   ├── favicon.svg       # Brand icon & cloche logo
│   └── images/           # Local visual assets (if applicable)
└── README.md             # Setup, customization, and deployment documentation
```

---

## 🚀 How to Run Locally

Because this project uses vanilla HTML5, CSS3, and JavaScript, no complex installation or build step is required!

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click on `index.html` and click **"Open with Live Server"**.
4. The website will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option 2: Python HTTP Server
If Python is installed on your computer:
```bash
# In the project root directory:
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Option 3: Node.js / npx serve
```bash
npx serve .
```

---

## 🌐 How to Deploy to Vercel (or Netlify / GitHub Pages)

### Deploying to Vercel
1. Install the Vercel CLI (optional) or use GitHub integration:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Follow the on-screen prompts:
   - Set the root directory to `./`
   - No build command is required (static site).
   - Output directory: `./`
3. Alternatively, push this folder to a GitHub repository:
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your repository and click **"Deploy"**.

### Deploying to Netlify
1. Go to [netlify.com](https://www.netlify.com).
2. Drag and drop the `Blaque Hotel` project folder into the Netlify dashboard.
3. Your site will be published with an SSL-enabled `.netlify.app` URL within seconds.

---

## ⚙️ Hotel Administrator Configuration Guide

All business details, phone lines, WhatsApp numbers, and menu items/prices are centrally maintained in **`js/config.js`**. You do not need to edit HTML files to update prices or phone numbers!

### 1. Updating the WhatsApp & Phone Numbers
Open `js/config.js` and locate:
```javascript
const HOTEL_CONFIG = {
  name: "The Blaque Hotel & 24/7 Bistro",
  phone: "+254 700 123 456",            // Your actual phone number
  phoneSecondary: "+254 711 789 012",   // Kitchen hotline
  email: "dining@blaquehotel.co.ke",    // Your email

  // WhatsApp: Country code without '+' or spaces (e.g. 254 for Kenya)
  whatsappNumber: "254700123456", 
  ...
};
```

### 2. Supabase Cloud Database & Realtime Setup
The project is configured with your Supabase credentials in `js/config.js`:
```javascript
const SUPABASE_CONFIG = {
  url: "https://wbsfmglibuvsvdnbkola.supabase.co",
  anonKey: "eyJhbGciOi..."
};
```
Make sure you run the SQL script in your Supabase SQL Editor to create the `orders`, `order_items`, and `inquiries` tables. Once run, any order placed on the website is instantly saved in your cloud database, and the Kitchen Display (`kitchen.html`) receives instant live notifications!

### 3. Changing or Adding Menu Items & Prices
In `js/config.js`, scroll to `MENU_ITEMS`. Each item is defined like this:
```javascript
{
  id: "mm-01",
  name: "Crispy Fried Chicken & Chips",
  category: "main_meals",          // Options: breakfast, main_meals, fast_food, beverages
  categoryName: "Main Meals",
  price: 850,                      // Price in Kenyan Shillings (KES)
  description: "Half-spring tender chicken seasoned in aromatic herbs...",
  image: "https://images.unsplash.com/...",
  tags: ["Bestseller", "Crispy"],
  badge: "Crowd Favorite",
  prepTime: "25 mins",
  available24h: true,              // Set to false if limited to day hours
  isSpecial: false                 // Set to true to feature in Specials
}
```
- To change a price, simply edit the `price: 850` value.
- To add a new dish, copy an existing block and give it a unique `id`.
- Refresh your browser, and the menu and cart will immediately reflect your updates!

---

## 🔒 Scope & Technical Limitations

- **Frontend Scope**: This application provides complete client-side browsing, shopping cart calculation, input validation, and WhatsApp order dispatch.
- **Cross-device State**: `localStorage` saves the cart on the customer's specific browser. It does not synchronize carts across separate devices.
- **Central Order Database**: For automatic order ticket printing in the kitchen, staff management dashboards, or card payment processing (e.g., M-Pesa STK Push / Pesapal / Flutterwave), a separate secure backend service (e.g., Node.js / Python / Firebase) should be integrated. Customer credit card details should **never** be handled directly by frontend code.

---

&copy; 2026 The Blaque Hotel & 24/7 Bistro. Built with HTML5, CSS3, and JavaScript.
