export interface MenuItem {
  name: string;
  nameHi: string;
  price: number;
  description?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  titleHi: string;
  icon: string;
  items: MenuItem[];
}

export const MENU_DATA: MenuCategory[] = [
  {
    id: "beverages",
    title: "Beverages & Shakes",
    titleHi: "पेय और शेक्स",
    icon: "Coffee",
    items: [
      { name: "Cold Coffee", nameHi: "कोल्ड कॉफी", price: 120 },
      { name: "Tiramisu Cold Coffee", nameHi: "तिरामिसु कोल्ड कॉफी", price: 150 },
      { name: "Oreo Shake", nameHi: "ओरियो शेक", price: 150 },
      { name: "KitKat Shake", nameHi: "किटकेट शेक", price: 150 },
      { name: "Virgin Mojito", nameHi: "वर्जिन मोजितो", price: 120 },
      { name: "Blue Lagoon", nameHi: "ब्लू लैगून", price: 120 },
      { name: "Masala Soda", nameHi: "मसाला सोडा", price: 70 },
    ],
  },
  {
    id: "boba",
    title: "Boba Tea (Special)",
    titleHi: "बोबा टी (खास)",
    icon: "CupSoda",
    items: [
      { name: "Chocolate Boba Tea", nameHi: "चॉकलेट बोबा टी", price: 160 },
      { name: "Mango Boba Tea", nameHi: "मैंगो बोबा टी", price: 160 },
      { name: "Strawberry Boba Tea", nameHi: "स्ट्रॉबेरी बोबा टी", price: 160 },
      { name: "Peach Boba Tea", nameHi: "पीच बोबा टी", price: 160 },
      { name: "Watermelon Boba", nameHi: "वॉटरमेलन बोबा", price: 160 },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    titleHi: "स्नैक्स",
    icon: "Utensils",
    items: [
      { name: "French Fries", nameHi: "फ्रेंच फ्राइज़", price: 90 },
      { name: "Peri Peri Fries", nameHi: "पेरी पेरी फ्राइज़", price: 110 },
      { name: "Cheese Balls (8 pcs)", nameHi: "चीज़ बॉल्स (8 पीस)", price: 140 },
      { name: "Paneer Pakoda", nameHi: "पनीर पकोड़ा", price: 150 },
      { name: "Stuffed Garlic Bread", nameHi: "स्टफ्ड गार्लिक ब्रेड", price: 160 },
      { name: "Steamed Corn", nameHi: "स्टीम्ड कॉर्न", price: 80 },
    ],
  },
  {
    id: "momos",
    title: "Momos",
    titleHi: "मोमोज",
    icon: "CircleDot",
    items: [
      { name: "Veg Momos (6 pcs)", nameHi: "वेज मोमोज (6 पीस)", price: 90 },
      { name: "Fried Veg Momos", nameHi: "फ्राइड वेज मोमोज", price: 110 },
      { name: "Chilli Momos", nameHi: "चिली मोमोज", price: 140 },
      { name: "Soya Momos", nameHi: "सोया मोमोज", price: 100 },
      { name: "Momo Manchurian", nameHi: "मोमो मंचूरियन", price: 160 },
    ],
  },
  {
    id: "burgers",
    title: "Burger & Sandwich",
    titleHi: "बर्गर और सैंडविच",
    icon: "Beef",
    items: [
      { name: "Veg Burger", nameHi: "वेज बर्गर", price: 90 },
      { name: "Cheese Burger", nameHi: "चीज़ बर्गर", price: 110 },
      { name: "Paneer Burger", nameHi: "पनीर बर्गर", price: 140 },
      { name: "Veg Sandwich", nameHi: "वेज सैंडविच", price: 90 },
      { name: "Grilled Sandwich", nameHi: "ग्रिल्ड सैंडविच", price: 120 },
      { name: "Paneer Tikka Sandwich", nameHi: "पनीर टिक्का सैंडविच", price: 150 },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    titleHi: "पिज़्ज़ा",
    icon: "Pizza",
    items: [
      { name: "Cheese & Tomato Pizza", nameHi: "चीज़ और टमाटर पिज़्ज़ा", price: 180 },
      { name: "Corn & Cheese Pizza", nameHi: "कॉर्न और चीज़ पिज़्ज़ा", price: 200 },
      { name: "Farmhouse Pizza", nameHi: "फार्महाउस पिज़्ज़ा", price: 220 },
      { name: "Paneer Tandoori Pizza", nameHi: "पनीर तंदूरी पिज़्ज़ा", price: 240 },
      { name: "Deluxe Veg Pizza", nameHi: "डीलक्स वेज पिज़्ज़ा", price: 250 },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    titleHi: "पास्ता",
    icon: "Soup",
    items: [
      { name: "White Sauce Pasta", nameHi: "व्हाइट सॉस पास्ता", price: 180 },
      { name: "Red Sauce Pasta", nameHi: "रेड सॉस पास्ता", price: 170 },
      { name: "Mix Sauce Pasta", nameHi: "मिक्स सॉस पास्ता", price: 190 },
    ],
  },
  {
    id: "chinese",
    title: "Chinese",
    titleHi: "चाइनीज़",
    icon: "Flame",
    items: [
      { name: "Veg Hakka Noodles", nameHi: "वेज हक्का नूडल्स", price: 140 },
      { name: "Veg Fried Rice", nameHi: "वेज फ्राइड राइस", price: 150 },
      { name: "Veg Manchurian", nameHi: "वेज मंचूरियन", price: 170 },
      { name: "Paneer Chilli", nameHi: "पनीर चिली", price: 200 },
    ],
  },
  {
    id: "combos",
    title: "Combos",
    titleHi: "कॉम्बो",
    icon: "Package",
    items: [
      { name: "Veg Burger + Fries + Lemonade", nameHi: "वेज बर्गर + फ्राइज़ + लेमोनेड", price: 220 },
      { name: "Veg Fried Rice + Manchurian", nameHi: "वेज फ्राइड राइस + मंचूरियन", price: 230 },
      { name: "Paneer Chilli + Hakka Noodles", nameHi: "पनीर चिली + हक्का नूडल्स", price: 260 },
    ],
  },
];
