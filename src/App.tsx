import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, 
  CupSoda, 
  Utensils, 
  CircleDot, 
  Beef, 
  Pizza as PizzaIcon, 
  Soup, 
  Flame, 
  Package,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Moon,
  Sun,
  Languages,
  ShoppingCart,
  Plus,
  Minus,
  MessageCircle,
  Trash2,
  Star,
  Send,
  User,
  History,
  Receipt,
  Calendar,
  Users,
  Phone,
  Settings,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  RefreshCw
} from "lucide-react";
import { MENU_DATA, MenuItem } from "./constants";

const iconMap: Record<string, any> = {
  Coffee,
  CupSoda,
  Utensils,
  CircleDot,
  Beef,
  Pizza: PizzaIcon,
  Soup,
  Flame,
  Package,
};

type Language = "en" | "hi";
type Theme = "light" | "dark";

interface CartItem extends MenuItem {
  quantity: number;
}

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  item_name?: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  item_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  table_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface Reservation {
  id: number;
  customer_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  created_at: string;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>(MENU_DATA[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  
  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
    itemName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Order History State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Reservation State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2
  });

  // Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState<"dashboard" | "reservations" | "orders">("dashboard");
  const [adminStats, setAdminStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalReservations: 0,
    pendingReservations: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check system preference for theme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    fetchReviews();
    fetchOrders();
    fetchReservations();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  };

  const sendWhatsAppReservation = (resData: any) => {
    const message = `*New Table Reservation from Cafe Ravli*\n\n*Name:* ${resData.name}\n*Phone:* ${resData.phone}\n*Date:* ${resData.date}\n*Time:* ${resData.time}\n*Guests:* ${resData.guests}\n\n_Sent from Cafe Ravli Web App_`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const submitReservation = async (e: FormEvent) => {
    e.preventDefault();
    const { name, phone, date, time, guests } = reservationForm;
    if (!name || !phone || !date || !time || !guests) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          date,
          time,
          guests
        })
      });
      if (res.ok) {
        const resData = { ...reservationForm };
        setReservationForm({ name: "", phone: "", date: "", time: "", guests: 2 });
        setIsReservationModalOpen(false);
        fetchReservations();
        
        // Ask if they want to send WhatsApp too
        if (confirm(lang === "en" ? "Reservation saved! Would you like to also send it via WhatsApp for faster confirmation?" : "बुकिंग सुरक्षित हो गई! क्या आप इसे व्हाट्सएप के माध्यम से भी भेजना चाहेंगे?")) {
          sendWhatsAppReservation(resData);
        } else {
          alert(lang === "en" ? "Table reserved successfully!" : "टेबल सफलतापूर्वक बुक हो गई!");
        }
      }
    } catch (err) {
      console.error("Failed to submit reservation", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setAdminStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword })
      });
      if (res.ok) {
        setIsAdminAuthenticated(true);
        fetchAdminStats();
        fetchOrders();
        fetchReservations();
      } else {
        alert("Invalid Password");
      }
    } catch (err) {
      console.error("Admin login failed", err);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword("");
  };

  const updateReservationStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchReservations();
      fetchAdminStats();
    } catch (err) {
      console.error("Failed to update reservation status", err);
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      fetchAdminStats();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const reorder = (order: Order) => {
    const newItems: CartItem[] = order.items.map(item => {
      // Find the original menu item to get its metadata if needed, 
      // but for now we just need name and price
      return {
        name: item.item_name,
        nameHi: item.item_name, // Fallback
        price: item.price,
        quantity: item.quantity
      };
    });

    setCart(prev => {
      let updatedCart = [...prev];
      newItems.forEach(newItem => {
        const existing = updatedCart.find(i => i.name === newItem.name);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          updatedCart.push(newItem);
        }
      });
      return updatedCart;
    });
    setIsHistoryOpen(false);
    setIsCartOpen(true);
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.rating) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          item_name: reviewForm.itemName
        })
      });
      if (res.ok) {
        setReviewForm({ name: "", rating: 5, comment: "", itemName: "" });
        setIsReviewModalOpen(false);
        fetchReviews();
        
        // Redirect to Google Maps for rating
        const googleMapsReviewUrl = "https://www.google.com/maps/place/Cafe+Ravli/@23.1234,83.1234/review"; // Replace with actual Google Maps Review URL
        window.open(googleMapsReviewUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const currentCategory = MENU_DATA.find(cat => cat.id === activeCategory) || MENU_DATA[0];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.name !== name);
    });
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sendWhatsAppOrder = async () => {
    if (!customerName || (orderType === "dine-in" && !tableNumber)) {
      alert(lang === "en" ? "Please enter your name and table number" : "कृपया अपना नाम और टेबल नंबर दर्ज करें");
      return;
    }

    const orderId = await saveOrderToBackend();
    if (!orderId) return;

    const orderDetails = cart.map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`).join("\n");
    const typeText = orderType === "dine-in" ? `Table No: ${tableNumber}` : "Takeaway / Parcel";
    const message = `*New Order from Cafe Ravli*\n\n*Name:* ${customerName}\n*Type:* ${typeText}\n\n*Items:*\n${orderDetails}\n\n*Total Amount:* ₹${totalAmount}\n\n_Sent from Cafe Ravli Web App_`;
    
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`; // Replace with actual cafe number
    window.open(whatsappUrl, "_blank");
    
    setCart([]); 
    setIsOrderSuccess(true);
    setTimeout(() => {
      setIsOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const saveOrderToBackend = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          table_number: orderType === "dine-in" ? tableNumber : "Takeaway",
          total_amount: totalAmount,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });
      const data = await res.json();
      fetchOrders();
      return data.id;
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Failed to save order. Please try again.");
      return null;
    }
  };

  const confirmOrder = async () => {
    if (!customerName || (orderType === "dine-in" && !tableNumber)) {
      alert(lang === "en" ? "Please enter your name and table number" : "कृपया अपना नाम और टेबल नंबर दर्ज करें");
      return;
    }

    const orderId = await saveOrderToBackend();
    if (orderId) {
      setCart([]);
      setIsOrderSuccess(true);
      setTimeout(() => {
        setIsOrderSuccess(false);
        setIsCartOpen(false);
      }, 3000);
    }
  };

  const t = {
    en: {
      tagline: "Ambikapur's Favourite Rooftop Hangout",
      heroTitle: "Food, Friends & Rooftop Vibes",
      explore: "Explore Menu",
      hours: "Open Daily: 11 AM - 11 PM",
      menu: "Our Menu",
      about: "About",
      contact: "Contact",
      cart: "Your Order",
      emptyCart: "Your cart is empty",
      checkout: "Order via WhatsApp",
      name: "Your Name",
      table: "Table Number",
      add: "Add",
      total: "Total",
      orderType: "Order Type",
      dineIn: "Dine-in",
      takeaway: "Takeaway",
      directOrder: "Confirm Order",
      reviews: "Customer Reviews",
      leaveReview: "Leave a Review",
      rating: "Rating",
      comment: "Comment",
      submit: "Submit Review",
      overall: "Overall Experience",
      itemReview: "Reviewing:",
      orderHistory: "Order History",
      noOrders: "No past orders found",
      orderId: "Order #",
      items: "Items",
      reorder: "Re-order",
      orderSuccess: "Order placed successfully!",
      bookTable: "Book a Table",
      reservations: "My Reservations",
      noReservations: "No upcoming reservations",
      date: "Date",
      time: "Time",
      guests: "Guests",
      phone: "Phone",
      reserve: "Reserve Now",
      description: "From our trending Boba teas to authentic Chinese and Italian delights, every dish is crafted to complement the perfect rooftop sunset."
    },
    hi: {
      tagline: "अंबिकापुर का पसंदीदा रूफटॉप हैंगआउट",
      heroTitle: "खाना, दोस्त और रूफटॉप वाइब्स",
      explore: "मेन्यू देखें",
      hours: "रोजाना: सुबह 11 - रात 11",
      menu: "हमारा मेन्यू",
      about: "हमारे बारे में",
      contact: "संपर्क",
      cart: "आपका ऑर्डर",
      emptyCart: "आपका कार्ट खाली है",
      checkout: "व्हाट्सएप पर ऑर्डर करें",
      name: "आपका नाम",
      table: "टेबल नंबर",
      add: "जोड़ें",
      total: "कुल",
      orderType: "ऑर्डर का प्रकार",
      dineIn: "यहीं खाएं",
      takeaway: "पैक करवाएं",
      directOrder: "ऑर्डर कन्फर्म करें",
      reviews: "ग्राहकों की समीक्षा",
      leaveReview: "समीक्षा लिखें",
      rating: "रेटिंग",
      comment: "टिप्पणी",
      submit: "समीक्षा भेजें",
      overall: "कुल अनुभव",
      itemReview: "समीक्षा कर रहे हैं:",
      orderHistory: "ऑर्डर का इतिहास",
      noOrders: "कोई पिछला ऑर्डर नहीं मिला",
      orderId: "ऑर्डर #",
      items: "आइटम",
      reorder: "फिर से ऑर्डर करें",
      orderSuccess: "ऑर्डर सफलतापूर्वक दिया गया!",
      bookTable: "टेबल बुक करें",
      reservations: "मेरी बुकिंग",
      noReservations: "कोई आगामी बुकिंग नहीं है",
      date: "तारीख",
      time: "समय",
      guests: "मेहमान",
      phone: "फ़ोन",
      reserve: "अभी बुक करें",
      description: "ट्रेंडिंग बोबा टी से लेकर ऑथेंटिक चाइनीज़ और इटालियन व्यंजनों तक, हर डिश को रूफटॉप सनसेट के साथ मेल खाने के लिए बनाया गया है।"
    }
  }[lang];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#121212] text-white" : "bg-[#fdfcfb] text-[#2d2a26]"} font-sans selection:bg-[#FF6321] selection:text-white`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? (theme === "dark" ? "bg-black/80 shadow-lg" : "bg-white/80 shadow-sm") + " backdrop-blur-md py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#FF6321] rounded-full flex items-center justify-center text-white font-serif italic text-xl shadow-lg shadow-orange-500/20">R</div>
            <span className="text-lg md:text-xl font-serif font-bold tracking-tight">Cafe Ravli</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#menu" className="hover:text-[#FF6321] transition-colors">{t.menu}</a>
            <a href="#reviews" className="hover:text-[#FF6321] transition-colors">{t.reviews}</a>
            <button onClick={() => setIsReservationModalOpen(true)} className="hover:text-[#FF6321] transition-colors uppercase">{t.bookTable}</button>
            <button onClick={() => setIsHistoryOpen(true)} className="hover:text-[#FF6321] transition-colors uppercase">{t.orderHistory}</button>
            <a href="#about" className="hover:text-[#FF6321] transition-colors">{t.about}</a>
            <a href="#contact" className="hover:text-[#FF6321] transition-colors">{t.contact}</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
              title="Change Language"
            >
              <Languages size={20} className="text-[#FF6321]" />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[#FF6321] text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#FF6321] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FF6321]">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className={`fixed inset-0 z-40 ${theme === "dark" ? "bg-[#121212]" : "bg-white"} pt-24 px-6 lg:hidden`}
          >
            <div className="flex flex-col gap-8 text-2xl font-serif italic text-center">
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>{t.menu}</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)}>{t.reviews}</a>
              <button onClick={() => { setIsReservationModalOpen(true); setIsMenuOpen(false); }} className="font-serif italic">{t.bookTable}</button>
              <button onClick={() => { setIsHistoryOpen(true); setIsMenuOpen(false); }} className="font-serif italic">{t.orderHistory}</button>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>{t.about}</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>{t.contact}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`fixed top-10 left-4 right-4 bottom-10 z-[110] ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-w-6xl mx-auto`}
            >
              <div className="p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-[#FF6321]/10 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF6321] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic">Admin Dashboard</h2>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Cafe Ravli Management</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isAdminAuthenticated && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          fetchAdminStats();
                          fetchOrders();
                          fetchReservations();
                        }}
                        className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-[#FF6321]"
                        title="Refresh Data"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button 
                        onClick={handleAdminLogout}
                        className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-600 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/5 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  <button onClick={() => setIsAdminOpen(false)} className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X />
                  </button>
                </div>
              </div>

              {!isAdminAuthenticated ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="w-full max-w-sm space-y-6 text-center">
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif italic">Restricted Access</h3>
                      <p className="text-sm text-gray-400">Please enter the admin password to continue.</p>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                      className={`w-full px-6 py-4 rounded-2xl border text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                    />
                    <button 
                      onClick={handleAdminLogin}
                      className="w-full py-4 bg-[#FF6321] text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20"
                    >
                      Login to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                  {/* Mobile Tabs */}
                  <div className="md:hidden border-b border-gray-100 dark:border-white/10 flex overflow-x-auto no-scrollbar">
                    <button 
                      onClick={() => setAdminTab("dashboard")}
                      className={`flex-1 px-6 py-4 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${adminTab === "dashboard" ? "border-[#FF6321] text-[#FF6321]" : "border-transparent text-gray-400"}`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setAdminTab("reservations")}
                      className={`flex-1 px-6 py-4 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${adminTab === "reservations" ? "border-[#FF6321] text-[#FF6321]" : "border-transparent text-gray-400"}`}
                    >
                      Reservations
                    </button>
                    <button 
                      onClick={() => setAdminTab("orders")}
                      className={`flex-1 px-6 py-4 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${adminTab === "orders" ? "border-[#FF6321] text-[#FF6321]" : "border-transparent text-gray-400"}`}
                    >
                      Orders
                    </button>
                  </div>

                  {/* Sidebar Tabs (Desktop) */}
                  <div className="w-64 border-r border-gray-100 dark:border-white/10 p-6 space-y-2 hidden md:block">
                    <button 
                      onClick={() => setAdminTab("dashboard")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${adminTab === "dashboard" ? "bg-[#FF6321] text-white" : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"}`}
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button 
                      onClick={() => setAdminTab("reservations")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${adminTab === "reservations" ? "bg-[#FF6321] text-white" : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"}`}
                    >
                      <Calendar size={18} /> Reservations
                    </button>
                    <button 
                      onClick={() => setAdminTab("orders")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${adminTab === "orders" ? "bg-[#FF6321] text-white" : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"}`}
                    >
                      <Receipt size={18} /> Orders
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-black/20">
                    {adminTab === "dashboard" && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Total Revenue</p>
                            <p className="text-3xl font-serif italic text-[#FF6321]">₹{adminStats.totalRevenue || 0}</p>
                          </div>
                          <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Total Orders</p>
                            <p className="text-3xl font-serif italic">{adminStats.totalOrders}</p>
                          </div>
                          <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Total Reservations</p>
                            <p className="text-3xl font-serif italic">{adminStats.totalReservations}</p>
                          </div>
                          <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Pending Orders</p>
                            <p className="text-3xl font-serif italic text-orange-500">{adminStats.pendingOrders}</p>
                          </div>
                          <div className={`p-6 rounded-3xl border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Pending Reservations</p>
                            <p className="text-3xl font-serif italic text-orange-500">{adminStats.pendingReservations}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className={`p-8 rounded-[2.5rem] border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm`}>
                            <h3 className="text-xl font-serif italic mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                              {orders.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No recent orders to display.</p>
                              ) : (
                                orders.slice(0, 5).map(order => (
                                  <div key={order.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                    <div>
                                      <p className="text-xs font-bold">{order.customer_name}</p>
                                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                                      order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' : 
                                      order.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                      'bg-orange-500/10 text-orange-500'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {adminTab === "reservations" && (
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-serif italic">Reservations Management</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{reservations.length} Total</span>
                          </div>
                          
                          {reservations.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem]">
                              <Calendar size={48} strokeWidth={1} />
                              <p className="font-bold uppercase tracking-widest text-xs">No reservations found</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {reservations.map((res) => (
                                <div key={res.id} className={`p-6 rounded-[2rem] border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"} shadow-sm hover:shadow-md transition-shadow`}>
                                  <div className="flex justify-between items-start mb-6">
                                    <div>
                                      <h4 className="text-lg font-bold">{res.customer_name}</h4>
                                      <p className="text-sm text-[#FF6321] font-medium flex items-center gap-2">
                                        <Phone size={14} /> {res.phone}
                                      </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                      {res.status}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <div className="text-center">
                                      <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Date</p>
                                      <p className="text-xs font-bold">{res.date}</p>
                                    </div>
                                    <div className="text-center border-x border-gray-200 dark:border-white/10">
                                      <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Time</p>
                                      <p className="text-xs font-bold">{res.time}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Guests</p>
                                      <p className="text-xs font-bold">{res.guests}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    {res.status === 'pending' && (
                                      <>
                                        <button 
                                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                          className="flex-1 py-3 bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                                        >
                                          <CheckCircle size={14} /> Confirm
                                        </button>
                                        <button 
                                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                          className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                          <XCircle size={14} /> Reject
                                        </button>
                                      </>
                                    )}
                                    <button 
                                      onClick={() => window.open(`https://wa.me/${res.phone.replace(/\D/g, '')}`, '_blank')}
                                      className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                                    >
                                      <MessageCircle size={18} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {adminTab === "orders" && (
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-serif italic">Orders Management</h3>
                          {orders.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem]">
                              <Receipt size={48} strokeWidth={1} />
                              <p className="font-bold uppercase tracking-widest text-xs">No orders found</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {orders.map((order) => (
                                <div key={order.id} className={`p-6 rounded-[2rem] border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100"}`}>
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-[#FF6321]">Order #{order.id}</span>
                                        <span className="text-xs font-bold text-gray-400">Table {order.table_number}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                          order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                                          order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' : 
                                          order.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                          'bg-orange-500/10 text-orange-500'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </div>
                                      <h4 className="text-lg font-bold mt-1">{order.customer_name}</h4>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-[#FF6321]">₹{order.total_amount}</p>
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">{new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mb-6">
                                    {order.items.map((item, i) => (
                                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold">
                                        {item.item_name} x {item.quantity}
                                      </span>
                                    ))}
                                  </div>

                                    <div className="flex flex-wrap gap-2">
                                      {order.status === 'pending' && (
                                        <>
                                          <button 
                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                            className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                                          >
                                            <CheckCircle size={14} /> Confirm
                                          </button>
                                          <button 
                                            onClick={() => updateOrderStatus(order.id, 'rejected')}
                                            className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                                          >
                                            <XCircle size={14} /> Reject
                                          </button>
                                        </>
                                      )}
                                      {order.status === 'confirmed' && (
                                        <button 
                                          onClick={() => updateOrderStatus(order.id, 'completed')}
                                          className="flex-1 md:flex-none px-6 py-3 bg-[#FF6321] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#e55a1e] transition-colors"
                                        >
                                          <CheckCircle size={14} /> Mark Completed
                                        </button>
                                      )}
                                      <button className="flex-1 md:flex-none px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-400">
                                        Print Receipt
                                      </button>
                                    </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReservationModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReservationModalOpen(false)}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[90] ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} rounded-[2.5rem] shadow-2xl overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-serif italic">{t.bookTable}</h2>
                  <button onClick={() => setIsReservationModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                    <X />
                  </button>
                </div>

                <form onSubmit={submitReservation} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.name}</label>
                    <input 
                      required
                      type="text" 
                      value={reservationForm.name}
                      onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                      className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.phone}</label>
                      <input 
                        required
                        type="tel" 
                        value={reservationForm.phone}
                        onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                        className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.guests}</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        max="20"
                        value={reservationForm.guests}
                        onChange={(e) => setReservationForm({ ...reservationForm, guests: parseInt(e.target.value) })}
                        className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.date}</label>
                      <input 
                        required
                        type="date" 
                        value={reservationForm.date}
                        onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                        className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.time}</label>
                      <input 
                        required
                        type="time" 
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                        className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-[#FF6321] hover:bg-[#e55a1e] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : <><Calendar size={18} /> {t.reserve}</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[90] ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} rounded-[2.5rem] shadow-2xl overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-serif italic">{t.leaveReview}</h2>
                  <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                    <X />
                  </button>
                </div>

                <form onSubmit={submitReview} className="space-y-6">
                  {reviewForm.itemName && (
                    <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center gap-2">
                      <Star size={16} className="text-[#FF6321]" />
                      <span className="text-sm font-medium">{t.itemReview} <span className="text-[#FF6321]">{reviewForm.itemName}</span></span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.name}</label>
                    <input 
                      required
                      type="text" 
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.rating}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`p-2 transition-transform hover:scale-110 ${reviewForm.rating >= star ? "text-[#FF6321]" : "text-gray-300 dark:text-gray-600"}`}
                        >
                          <Star size={28} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.comment}</label>
                    <textarea 
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className={`w-full px-5 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 resize-none ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-[#FF6321] hover:bg-[#e55a1e] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : <><Send size={18} /> {t.submit}</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-md z-[70] ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} shadow-2xl flex flex-col`}
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-serif italic">{t.cart}</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isOrderSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-6 p-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20"
                    >
                      <CheckCircle size={48} />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif italic text-green-500">{t.orderSuccess}</h3>
                      <p className="text-sm text-gray-400">
                        {lang === "en" ? "Your order has been received. You can track it in your order history." : "आपका ऑर्डर प्राप्त हो गया है। आप इसे अपने ऑर्डर इतिहास में देख सकते हैं।"}
                      </p>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                    <ShoppingCart size={48} strokeWidth={1} />
                    <p>{t.emptyCart}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{lang === "en" ? item.name : item.nameHi}</h4>
                            <p className="text-sm text-[#FF6321]">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-full px-3 py-1">
                            <button onClick={() => removeFromCart(item.name)} className="text-[#FF6321]"><Minus size={16} /></button>
                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="text-[#FF6321]"><Plus size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.orderType}</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setOrderType("dine-in")}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${orderType === "dine-in" ? "bg-[#FF6321] text-white border-[#FF6321]" : "bg-transparent border-gray-200 text-gray-400"}`}
                          >
                            {t.dineIn}
                          </button>
                          <button 
                            onClick={() => setOrderType("takeaway")}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${orderType === "takeaway" ? "bg-[#FF6321] text-white border-[#FF6321]" : "bg-transparent border-gray-200 text-gray-400"}`}
                          >
                            {t.takeaway}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.name}</label>
                          <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="John Doe"
                            className={`w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                          />
                        </div>
                        {orderType === "dine-in" && (
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.table}</label>
                            <input 
                              type="number" 
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              placeholder="05"
                              className={`w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && !isOrderSuccess && (
                <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-serif italic">{t.total}</span>
                    <span className="text-2xl font-bold text-[#FF6321]">₹{totalAmount}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={confirmOrder}
                      className="w-full py-4 bg-[#FF6321] hover:bg-[#e55a1e] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/20"
                    >
                      <CheckCircle size={20} />
                      {t.directOrder}
                    </button>
                    <button 
                      onClick={sendWhatsAppOrder}
                      className="w-full py-4 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                    >
                      <MessageCircle size={20} />
                      {t.checkout}
                    </button>
                  </div>
                  <button 
                    onClick={clearCart}
                    className="w-full mt-3 py-2 text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Clear Order
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-md z-[70] ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} shadow-2xl flex flex-col`}
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-serif italic">{t.orderHistory}</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Orders Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
                    <Receipt size={14} /> {t.orderHistory}
                  </h3>
                  {orders.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
                      <History size={32} strokeWidth={1} />
                      <p className="text-xs">{t.noOrders}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className={`p-5 rounded-3xl border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF6321]">{t.orderId}{order.id}</span>
                              <h4 className="font-bold text-sm">{order.customer_name}</h4>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                {new Date(order.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-gray-400">Table {order.table_number}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                  order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                                  order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' : 
                                  order.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                  'bg-orange-500/10 text-orange-500'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-[#FF6321] mt-1">₹{order.total_amount}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-white/5">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-xs">
                                <span className="text-gray-500">{item.item_name} x {item.quantity}</span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => reorder(order)}
                            className="w-full mt-4 py-2 bg-[#FF6321]/10 text-[#FF6321] hover:bg-[#FF6321] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={14} />
                            {t.reorder}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reservations Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
                    <Calendar size={14} /> {t.reservations}
                  </h3>
                  {reservations.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
                      <Calendar size={32} strokeWidth={1} />
                      <p className="text-xs">{t.noReservations}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((res) => (
                        <div key={res.id} className={`p-5 rounded-3xl border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm">{res.customer_name}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-widest">
                                  <Calendar size={10} /> {res.date}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-widest">
                                  <Clock size={10} /> {res.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold ${res.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                                {res.status}
                              </span>
                              <div className="flex items-center justify-end gap-1 mt-2 text-xs font-bold">
                                <Users size={12} /> {res.guests}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=2070" 
            alt="Cafe Ravli Rooftop" 
            className="w-full h-full object-cover brightness-[0.5]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121212]/90"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-[#FF6321] rounded-full flex items-center justify-center text-white font-serif italic text-3xl shadow-2xl shadow-orange-500/40 mx-auto mb-6"
          >
            R
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm uppercase tracking-[0.4em] mb-4 font-bold text-[#FF6321]"
          >
            {t.tagline}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif italic mb-8 leading-tight"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <a 
              href="#menu" 
              className="px-10 py-4 bg-[#FF6321] hover:bg-[#e55a1e] text-white rounded-full transition-all duration-300 transform hover:scale-105 uppercase tracking-widest text-xs font-bold shadow-xl shadow-orange-500/30"
            >
              {t.explore}
            </a>
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#FF6321]" />
                <span>{t.hours}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <ChevronRight size={32} className="rotate-90" />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 md:px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#FF6321]/20 to-transparent"></div>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-serif italic mb-6 bg-gradient-to-b from-current to-gray-500 bg-clip-text text-transparent">{t.menu}</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#FF6321] to-[#e55a1e] mx-auto mb-8 rounded-full shadow-lg shadow-orange-500/20"></div>
          <p className={`max-w-3xl mx-auto text-base md:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium leading-relaxed`}>
            {t.description}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 justify-start md:justify-center gap-3 mb-12">
          {MENU_DATA.map((category) => {
            const Icon = iconMap[category.icon];
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 border shrink-0 ${
                  isActive 
                    ? "bg-[#FF6321] text-white border-[#FF6321] shadow-lg shadow-orange-500/20" 
                    : (theme === "dark" ? "bg-white/5 text-gray-400 border-white/10 hover:border-white/20" : "bg-white text-gray-600 border-gray-100 hover:border-orange-500/30")
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-bold whitespace-nowrap">{lang === "en" ? category.title : category.titleHi}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <motion.div 
          key={activeCategory + lang}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {currentCategory.items.map((item, idx) => (
            <div 
              key={idx}
              className={`group p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
                theme === "dark" 
                  ? "bg-white/5 border-white/10 hover:border-[#FF6321]/30" 
                  : "bg-white border-gray-50 hover:border-[#FF6321]/20 hover:shadow-xl hover:shadow-orange-500/5"
              }`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg md:text-xl font-serif font-medium group-hover:text-[#FF6321] transition-colors">
                    {lang === "en" ? item.name : item.nameHi}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => {
                        setReviewForm({ ...reviewForm, itemName: item.name });
                        setIsReviewModalOpen(true);
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#FF6321] transition-colors flex items-center gap-1"
                    >
                      <Star size={10} /> Rate this
                    </button>
                  </div>
                </div>
                <span className="text-lg font-bold text-[#FF6321]">₹{item.price}</span>
              </div>
              
              <div className="flex justify-end mt-4 relative z-10">
                <button 
                  onClick={() => addToCart(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF6321] text-white rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
                >
                  <Plus size={14} />
                  {t.add}
                </button>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FF6321]/5 rounded-full blur-2xl group-hover:bg-[#FF6321]/10 transition-colors"></div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className={`py-20 px-4 md:px-6 ${theme === "dark" ? "bg-white/5" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif italic mb-4">{t.reviews}</h2>
              <div className="w-20 h-1 bg-[#FF6321] rounded-full"></div>
            </div>
            <button 
              onClick={() => {
                setReviewForm({ ...reviewForm, itemName: "" });
                setIsReviewModalOpen(true);
              }}
              className="px-8 py-3 bg-[#FF6321] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
            >
              {t.leaveReview}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={review.id}
                  className={`p-8 rounded-[2.5rem] border ${theme === "dark" ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-100 shadow-sm"}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-[#FF6321]">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{review.customer_name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={12} 
                          className={star <= review.rating ? "text-[#FF6321]" : "text-gray-200 dark:text-gray-800"} 
                          fill={star <= review.rating ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {review.item_name && (
                    <div className="mb-4 inline-block px-3 py-1 bg-[#FF6321]/10 text-[#FF6321] rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {review.item_name}
                    </div>
                  )}
                  
                  <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    "{review.comment}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${theme === "dark" ? "bg-white/5" : "bg-[#FF6321] text-white"} overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974" 
                alt="Rooftop Ambience" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full p-6 flex items-center justify-center text-center shadow-2xl ${theme === "dark" ? "bg-[#FF6321] text-white" : "bg-white text-[#FF6321]"}`}>
              <p className="font-serif italic text-xs leading-tight">Eat. Chill. <br /> Enjoy the rooftop.</p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-8 leading-tight">
              {lang === "en" ? "More than just food, it's an experience." : "सिर्फ खाना नहीं, यह एक अनुभव है।"}
            </h2>
            <p className={`text-lg mb-10 leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-white/80"}`}>
              {lang === "en" 
                ? "Located in the heart of Ambikapur, Cafe Ravli offers a unique rooftop setting where the sky meets your plate. Whether it's a sunset date or a late-night hangout with friends, our vibe is unmatched."
                : "अंबिकापुर के केंद्र में स्थित, कैफे रावली एक अनूठा रूफटॉप सेटिंग प्रदान करता है जहां आकाश आपकी थाली से मिलता है। चाहे वह सनसेट डेट हो या दोस्तों के साथ देर रात का हैंगआउट, हमारी वाइब बेजोड़ है।"}
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl md:text-2xl font-serif italic mb-2">{lang === "en" ? "Sunset Views" : "सनसेट व्यू"}</h4>
                <p className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-500" : "text-white/60"}`}>
                  {lang === "en" ? "The best spot in town for golden hour photography." : "गोल्डन आवर फोटोग्राफी के लिए शहर का सबसे अच्छा स्थान।"}
                </p>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-serif italic mb-2">{lang === "en" ? "Night Lights" : "नाइट लाइट्स"}</h4>
                <p className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-500" : "text-white/60"}`}>
                  {lang === "en" ? "Magical ambience with fairy lights and cool breeze." : "फेयरी लाइट्स और ठंडी हवा के साथ जादुई माहौल।"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`py-20 px-6 ${theme === "dark" ? "bg-black" : "bg-[#fdfcfb]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#FF6321] rounded-full flex items-center justify-center text-white font-serif italic">R</div>
                <span className="text-xl font-serif font-bold tracking-tight">Cafe Ravli</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {t.tagline}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                  <Facebook size={18} />
                </a>
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FF6321] hover:border-[#FF6321] transition-all"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-serif italic text-xl mb-6">{t.contact}</h4>
              <div className="space-y-4 text-sm text-gray-500">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#FF6321] shrink-0" />
                  <span>Main Road, Near Clock Tower, <br />Ambikapur, Chhattisgarh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#FF6321] shrink-0" />
                  <span>{t.hours}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif italic text-xl mb-6">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#menu" className="hover:text-[#FF6321] transition-colors">{t.menu}</a></li>
                <li><a href="#about" className="hover:text-[#FF6321] transition-colors">{t.about}</a></li>
                <li><button onClick={() => setIsReservationModalOpen(true)} className="hover:text-[#FF6321] transition-colors">{t.bookTable}</button></li>
                <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-[#FF6321] transition-colors">Admin Login</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
            <p>© 2026 Cafe Ravli. All rights reserved.</p>
            <p>Designed with ❤️ for Ambikapur</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
