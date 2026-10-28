/**
 * The Blaque Hotel & 24/7 Bistro
 * Configuration & Menu Master Data
 * 
 * Hotel administrators can easily update contact details, WhatsApp number,
 * social links, and menu items/prices in this file.
 */

const HOTEL_CONFIG = {
  name: "The Blaque Hotel & 24/7 Bistro",
  shortName: "Blaque Bistro",
  tagline: "Delicious Food, Anytime. We're Here 24/7!",
  subDescription: "Enjoy freshly prepared meals, refreshing beverages, and exceptional hospitality whenever your cravings strike.",
  
  // Contact & Social Details (Replace placeholders with actual hotel credentials)
  phone: "+254 700 123 456",
  phoneSecondary: "+254 711 789 012",
  email: "dining@blaquehotel.co.ke",
  
  // WhatsApp Configuration (Digits only with country code, e.g. 254 for Kenya)
  whatsappNumber: "254700123456",
  whatsappGreeting: "Hello Blaque Bistro! I would like to place an order:",
  
  // Location Details
  address: "Argwings Kodhek Road, Kilimani, Nairobi, Kenya",
  landmark: "Near Yaya Centre, Opposite Blaque Towers",
  mapsUrl: "https://maps.google.com/?q=Kilimani+Nairobi+Kenya",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.163351984218!2d36.7844007!3d-1.2920659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109867c4ec11%3A0x6bcfd35c59f0f9b!2sKilimani%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske",
  
  // Operating Hours
  hours: "Open 24 Hours / 7 Days a Week",
  serviceNote: "Our kitchen is active round the clock. Certain specialty items may have slight preparation waits during late night hours (01:00 AM - 05:00 AM).",
  
  // Currency Configuration
  currency: "KES",
  currencySymbol: "KES",
  
  // Social Media Channels
  social: {
    facebook: "https://facebook.com/blaquehotelnairobi",
    instagram: "https://instagram.com/blaquehotelnairobi",
    tiktok: "https://tiktok.com/@blaquebistroke",
    twitter: "https://twitter.com/blaquehotel"
  },

  // Service Order Types
  orderTypes: [
    { id: "dine_in", label: "Dine-In (At the Hotel)", description: "Served at our restaurant tables, terrace lounge, or your hotel guest room." },
    { id: "takeaway", label: "Takeaway / Self-Pickup", description: "Freshly packed and ready for pickup at our front counter." },
    { id: "delivery", label: "Delivery Enquiry", description: "Enquire about dispatch to your home or office within Nairobi radius." }
  ]
};

/**
 * Supabase Cloud Database & Realtime Configuration
 */
const SUPABASE_CONFIG = {
  url: "https://wbsfmglibuvsvdnbkola.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2ZtZ2xpYnV2c3ZkbmJrb2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTI5NzQsImV4cCI6MjEwODc2ODk3NH0.GLBiskFs56OF5teMgno-qkrk13M86nTNd1oRHorNf_M"
};

/**
 * Complete Food and Beverage Menu Items
 * All prices in Kenyan Shillings (KES).
 * Categories: breakfast, main_meals, fast_food, beverages
 */
const MENU_ITEMS = [
  // ==========================================
  // BREAKFAST
  // ==========================================
  {
    id: "bf-01",
    name: "Kenyan Spiced Tea & Golden Mandazi",
    category: "breakfast",
    categoryName: "Breakfast",
    price: 350,
    description: "Authentic Kenyan spiced milk tea brewed with cardamom and ginger, served with two freshly fried, fluffy golden mandazis.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    tags: ["Popular", "Traditional", "Vegetarian"],
    badge: "Local Favorite",
    prepTime: "10 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bf-02",
    name: "Barista Coffee & Butter Pastries",
    category: "breakfast",
    categoryName: "Breakfast",
    price: 550,
    description: "Rich freshly brewed Kenyan single-origin AA coffee (Americano, Latte, or Cappuccino) paired with warm butter croissants and pain au chocolat.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Bakery", "Freshly Brewed"],
    badge: "Chef's Pick",
    prepTime: "12 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bf-03",
    name: "Farm Fresh Eggs & Artisan Toast",
    category: "breakfast",
    categoryName: "Breakfast",
    price: 450,
    description: "Two eggs prepared to your choice (scrambled, fried, poached, or Spanish omelette) served with toasted buttered brioche, grilled tomatoes, and herb potatoes.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tags: ["High Protein", "Comfort"],
    prepTime: "15 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bf-04",
    name: "Fluffy Buttermilk Pancakes",
    category: "breakfast",
    categoryName: "Breakfast",
    price: 500,
    description: "Stack of three golden, fluffy pancakes drizzled with pure maple syrup, whipped cream butter, and seasonal fresh berries.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    tags: ["Sweet", "Vegetarian"],
    badge: "Sweet Tooth",
    prepTime: "15 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bf-05",
    name: "Full English Blaque Breakfast",
    category: "breakfast",
    categoryName: "Breakfast",
    price: 950,
    description: "A hearty breakfast feast: two eggs, beef sausages, grilled bacon or turkey rashers, baked beans, sautéed button mushrooms, grilled tomato, and toasted sourdough.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    tags: ["Hearty", "Bestseller"],
    badge: "Signature",
    prepTime: "20 mins",
    available24h: true,
    isSpecial: true
  },

  // ==========================================
  // MAIN MEALS
  // ==========================================
  {
    id: "mm-01",
    name: "Crispy Fried Chicken & Chips",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 850,
    description: "Half-spring tender chicken seasoned in aromatic herbs, deep-fried to crisp perfection, served with golden hand-cut French fries, coleslaw, and house dip.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    tags: ["Bestseller", "Crispy"],
    badge: "Crowd Favorite",
    prepTime: "25 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "mm-02",
    name: "Rich Beef Stew with Fragrant Rice",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 750,
    description: "Slow-cooked prime beef chunks simmered in a luscious tomato, garlic, and fresh herb gravy, accompanied by steamed white basmati rice and sautéed greens.",
    image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
    tags: ["Slow Cooked", "Savory"],
    prepTime: "20 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "mm-03",
    name: "Swahili Spiced Beef Pilau",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 800,
    description: "Authentic coastal Kenyan pilau made with long-grain rice, tender beef morsels, whole cumin, cinnamon, cardamom, served with fresh tangy kachumbari.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    tags: ["Coastal Specialty", "Aromatic", "Bestseller"],
    badge: "Must Try",
    prepTime: "15 mins",
    available24h: true,
    isSpecial: true
  },
  {
    id: "mm-04",
    name: "Layered Chapati with Coconut Beans (Ndengu / Maharagwe)",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 500,
    description: "Two soft, flaky layered chapatis served with hearty yellow beans or green grams stewed in rich coconut milk and mild spices.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Traditional", "Comfort"],
    badge: "Vegan Friendly",
    prepTime: "15 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "mm-05",
    name: "Traditional Ugali with Braised Beef or Chicken",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 700,
    description: "Steaming hot traditional white maize ugali served with your choice of pan-fried wet-fry beef or chicken, braised sukuma wiki (collard greens), and kachumbari.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
    tags: ["Kenyan Classic", "Hearty"],
    badge: "Heritage Dish",
    prepTime: "20 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "mm-06",
    name: "Whole Pan-Fried Tilapia Fish with Rice",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 1100,
    description: "Fresh Lake Victoria whole tilapia, seasoned with lemon garlic sauce and crispy shallow fried, served with fragrant coconut rice or ugali, and fresh salad.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tags: ["Fresh Catch", "Premium"],
    badge: "Chef's Special",
    prepTime: "30 mins",
    available24h: false,
    isSpecial: true
  },
  {
    id: "mm-07",
    name: "Mombasa Chicken Biriani",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 900,
    description: "Royal saffron-scented two-tone basmati rice topped with tender chicken cooked in a thick yogurt, tomato, caramelized onion, and Swahili spice marinade.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    tags: ["Coastal Specialty", "Spicy", "Feast"],
    badge: "Weekend Special",
    prepTime: "20 mins",
    available24h: true,
    isSpecial: true
  },
  {
    id: "mm-08",
    name: "Garden Fresh Vegetable Curry & Rice",
    category: "main_meals",
    categoryName: "Main Meals",
    price: 600,
    description: "Seasonal market vegetables (carrots, green peas, cauliflower, potatoes) simmered in a creamy coconut curry broth, served with steamed basmati rice or chapati.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Healthy", "Gluten-Free Option"],
    prepTime: "18 mins",
    available24h: true,
    isSpecial: false
  },

  // ==========================================
  // FAST FOOD AND SNACKS
  // ==========================================
  {
    id: "ff-01",
    name: "Blaque Gourmet Beef Burger",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 750,
    description: "100% prime grilled beef patty, melted cheddar cheese, caramelized onions, crisp lettuce, tomato, and secret bistro burger relish in a toasted brioche bun with fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Juicy", "Bestseller", "Night Craving"],
    badge: "Midnight Favorite",
    prepTime: "18 mins",
    available24h: true,
    isSpecial: true
  },
  {
    id: "ff-02",
    name: "Crispy Zesty Chicken Burger",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 700,
    description: "Crispy breaded chicken breast fillet topped with spicy slaw, dill pickles, garlic aioli, and creamy cheese on a soft sesame seed bun with seasoned fries.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    tags: ["Crunchy", "Popular"],
    prepTime: "18 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "ff-03",
    name: "Golden French Fries (Regular / Masala)",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 300,
    description: "Generous basket of crisp, golden potato fries tossed in salt. Masala chips option cooked in our signature spicy tangy tomato-coriander sauce for KES 50 extra.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    tags: ["Quick Snack", "Vegetarian"],
    prepTime: "10 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "ff-04",
    name: "Grilled Farmer's Sausages (Pair)",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 250,
    description: "Two prime seasoned beef or pork sausages grilled until juicy, served with spicy English mustard and fresh kachumbari salsa.",
    image: "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    tags: ["Quick Bite", "Savory"],
    prepTime: "8 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "ff-05",
    name: "Crispy Spiced Samosas (Pair)",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 250,
    description: "Two golden pastry triangles stuffed with spiced minced beef or vegetable potato-pea filling, served with fresh lime wedges and sweet chilli dip.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    tags: ["Appetizer", "Crisp"],
    badge: "Snack Favorite",
    prepTime: "8 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "ff-06",
    name: "Triple Decker Club Sandwich",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 650,
    description: "Toasted white or wholemeal bread layered with roast chicken breast, beef bacon rashers, boiled egg, cheese, crunchy lettuce, tomato, and mayo, served with fries.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    tags: ["Filling", "Classic"],
    prepTime: "15 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "ff-07",
    name: "Artisan Stone-Baked Pizza (Medium / Large)",
    category: "fast_food",
    categoryName: "Fast Food & Snacks",
    price: 1050,
    description: "Stone-baked pizza with San Marzano tomato sauce, mozzarella, and your choice of topping: BBQ Chicken & Mushroom, Beef Pepperoni, or Vegetarian Margherita.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tags: ["Woodfired", "Cheesy", "Bestseller"],
    badge: "Hot & Cheesy",
    prepTime: "25 mins",
    available24h: true,
    isSpecial: true
  },

  // ==========================================
  // BEVERAGES
  // ==========================================
  {
    id: "bv-01",
    name: "Traditional Kenyan Tea (Chai)",
    category: "beverages",
    categoryName: "Beverages",
    price: 200,
    description: "Steaming hot Kenyan rich milk tea infused with aromatic whole cloves, ginger, and cardamom pods.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    tags: ["Warm", "Comfort"],
    prepTime: "5 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bv-02",
    name: "Handcrafted Coffee & Espresso Bar",
    category: "beverages",
    categoryName: "Beverages",
    price: 300,
    description: "Freshly ground Kenyan highlands Arabica beans: Espresso, Americano, Cappuccino, Flat White, or Vanilla Latte.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Caffeine", "Hot"],
    badge: "Barista Special",
    prepTime: "6 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bv-03",
    name: "Cold-Pressed Fresh Tropical Juice",
    category: "beverages",
    categoryName: "Beverages",
    price: 350,
    description: "100% natural, freshly squeezed juice with no added sugar. Choices: Passion Fruit, Mango Delight, Pineapple Mint, or Detox Green Blend.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    tags: ["Natural", "Vitamin C", "Refreshing"],
    badge: "100% Natural",
    prepTime: "5 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bv-04",
    name: "Pure Mineral Bottled Water (500ml / 1L)",
    category: "beverages",
    categoryName: "Beverages",
    price: 150,
    description: "Still or sparkling chilled natural spring mineral water served with fresh lemon slices on request.",
    image: "https://images.unsplash.com/photo-1559839914-ba2ac5cd76a2?auto=format&fit=crop&w=800&q=80",
    tags: ["Hydration", "Pure"],
    prepTime: "2 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bv-05",
    name: "Chilled Sodas & Soft Drinks (350ml)",
    category: "beverages",
    categoryName: "Beverages",
    price: 180,
    description: "Ice-cold Coca-Cola, Coke Zero, Fanta Orange, Sprite, Krest Bitter Lemon, Stoney Tangawizi, or Tonic Water.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    tags: ["Chilled", "Classic"],
    prepTime: "2 mins",
    available24h: true,
    isSpecial: false
  },
  {
    id: "bv-06",
    name: "Decadent Creamy Milkshakes",
    category: "beverages",
    categoryName: "Beverages",
    price: 450,
    description: "Thick artisan dairy milkshakes blended with vanilla ice cream, whole milk, and whipped cream. Flavors: Belgian Chocolate, Strawberry Bliss, Salted Caramel, or Oreo Crumble.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    tags: ["Creamy", "Dessert Drink"],
    badge: "Indulgent",
    prepTime: "8 mins",
    available24h: true,
    isSpecial: true
  }
];

// Helper: Format KES Price
function formatPrice(amount) {
  return `${HOTEL_CONFIG.currency} ${Number(amount).toLocaleString('en-KE')}`;
}

// Export for module or global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOTEL_CONFIG, MENU_ITEMS, formatPrice, SUPABASE_CONFIG };
}
