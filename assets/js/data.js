// Zack Pizza - Sample data for clickable demo (vanilla JS, global SAMPLE_DATA)

const SAMPLE_DATA = {
  brand: {
    name: "Zack Pizza",
    tagline: "Hot pizza, fresh wheels",
    logo: "assets/img/logo.svg",
    contact: {
      phone: "03-2284-9001",
      email: "hi@zackpizza.my",
      instagram: "@zackpizza"
    }
  },

  products: [
    {
      id: "prod-001",
      name: "Margherita Classic",
      description: "San Marzano tomato, fresh mozzarella, basil, and a drizzle of olive oil.",
      price: 22.00,
      image: "assets/img/products/margherita.jpg",
      category: "Classic",
      available: true
    },
    {
      id: "prod-002",
      name: "Pepperoni Pile-Up",
      description: "Double layer of spicy pepperoni over molten mozzarella on a crisp crust.",
      price: 28.00,
      image: "assets/img/products/pepperoni.jpg",
      category: "Classic",
      available: true
    },
    {
      id: "prod-003",
      name: "Hawaiian Sunset",
      description: "Sweet pineapple, smoked chicken ham, and gooey mozzarella for the brave.",
      price: 26.00,
      image: "assets/img/products/hawaiian.jpg",
      category: "Classic",
      available: true
    },
    {
      id: "prod-004",
      name: "Sambal Chicken Fire",
      description: "Grilled chicken tossed in house sambal, red onion, and a hit of calamansi.",
      price: 34.00,
      image: "assets/img/products/sambal-chicken.jpg",
      category: "Signature",
      available: true
    },
    {
      id: "prod-005",
      name: "Rendang Royale",
      description: "Slow-cooked beef rendang, toasted coconut, and crispy shallots on garlic base.",
      price: 38.00,
      image: "assets/img/products/rendang.jpg",
      category: "Signature",
      available: true
    },
    {
      id: "prod-006",
      name: "Truffle Mushroom Melt",
      description: "Wild mushrooms, mozzarella, parmesan, and a kiss of black truffle oil.",
      price: 42.00,
      image: "assets/img/products/truffle-mushroom.jpg",
      category: "Signature",
      available: false
    },
    {
      id: "prod-007",
      name: "Garlic Butter Bread",
      description: "Hand-torn focaccia brushed with herbed garlic butter and sea salt.",
      price: 12.00,
      image: "assets/img/products/garlic-bread.jpg",
      category: "Sides",
      available: true
    },
    {
      id: "prod-008",
      name: "Buffalo Wings (6 pcs)",
      description: "Crispy chicken wings glazed in tangy buffalo sauce with blue cheese dip.",
      price: 16.00,
      image: "assets/img/products/buffalo-wings.jpg",
      category: "Sides",
      available: true
    },
    {
      id: "prod-009",
      name: "Iced Lemon Tea",
      description: "Freshly brewed black tea over ice with a squeeze of local lemon.",
      price: 7.00,
      image: "assets/img/products/iced-lemon-tea.jpg",
      category: "Drinks",
      available: true
    },
    {
      id: "prod-010",
      name: "Coca-Cola Classic",
      description: "Ice-cold 330ml can of the original fizzy classic.",
      price: 5.50,
      image: "assets/img/products/coke.jpg",
      category: "Drinks",
      available: true
    },
    {
      id: "prod-011",
      name: "Chocolate Lava Cake",
      description: "Warm dark chocolate cake with a molten centre and vanilla ice cream.",
      price: 14.00,
      image: "assets/img/products/lava-cake.jpg",
      category: "Desserts",
      available: true
    },
    {
      id: "prod-012",
      name: "Sticky Toffee Pudding",
      description: "Date sponge soaked in buttery toffee sauce, served with cream.",
      price: 13.00,
      image: "assets/img/products/sticky-toffee.jpg",
      category: "Desserts",
      available: false
    }
  ],

  outlets: [
    {
      id: "lorry-1",
      name: "Lorry 1 - The Cheese Wagon",
      crew: ["Ali", "Siti"],
      todayLocation: {
        name: "Bangsar Park",
        address: "Jalan Maarof, Bangsar, 59000 Kuala Lumpur",
        mapsLink: "https://maps.google.com/?q=Bangsar+Park+Kuala+Lumpur",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Bangsar Park" },
        { day: "Tue", location: "Bangsar Park" },
        { day: "Wed", location: "TTDI Plaza" },
        { day: "Thu", location: "Bangsar Park" },
        { day: "Fri", location: "Bangsar Park" },
        { day: "Sat", location: "Desa Sri Hartamas" },
        { day: "Sun", location: "Bangsar Park" }
      ],
      status: "active",
      outOfStockToday: ["prod-006"]
    },
    {
      id: "lorry-2",
      name: "Lorry 2 - Spice Express",
      crew: ["Hafiz", "Nurul"],
      todayLocation: {
        name: "KLCC Park",
        address: "Jalan Ampang, 50450 Kuala Lumpur",
        mapsLink: "https://maps.google.com/?q=KLCC+Park",
        hoursStart: "16:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "KLCC Park" },
        { day: "Tue", location: "KLCC Park" },
        { day: "Wed", location: "KLCC Park" },
        { day: "Thu", location: "Ampang Point" },
        { day: "Fri", location: "KLCC Park" },
        { day: "Sat", location: "KLCC Park" },
        { day: "Sun", location: "Setiawangsa" }
      ],
      status: "active",
      outOfStockToday: ["prod-012"]
    },
    {
      id: "lorry-3",
      name: "Lorry 3 - Veggie Voyager",
      crew: ["Priya", "Kumar"],
      todayLocation: {
        name: "Subang SS15",
        address: "Jalan SS15/4, SS 15, 47500 Subang Jaya, Selangor",
        mapsLink: "https://maps.google.com/?q=SS15+Subang+Jaya",
        hoursStart: "17:00",
        hoursEnd: "00:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Subang SS15" },
        { day: "Tue", location: "USJ Taipan" },
        { day: "Wed", location: "Subang SS15" },
        { day: "Thu", location: "Subang SS15" },
        { day: "Fri", location: "Subang SS15" },
        { day: "Sat", location: "Empire Subang" },
        { day: "Sun", location: "Subang SS15" }
      ],
      status: "active",
      outOfStockToday: []
    },
    {
      id: "lorry-4",
      name: "Lorry 4 - Crust Cruiser",
      crew: ["Wei Ming", "Aisyah"],
      todayLocation: {
        name: "Mont Kiara Plaza Damas",
        address: "Jalan Sri Hartamas 1, Plaza Damas, 50480 Kuala Lumpur",
        mapsLink: "https://maps.google.com/?q=Plaza+Damas+Mont+Kiara",
        hoursStart: "18:00",
        hoursEnd: "00:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Mont Kiara Plaza Damas" },
        { day: "Tue", location: "Mont Kiara Plaza Damas" },
        { day: "Wed", location: "Solaris Dutamas" },
        { day: "Thu", location: "Mont Kiara Plaza Damas" },
        { day: "Fri", location: "Mont Kiara Plaza Damas" },
        { day: "Sat", location: "Mont Kiara Plaza Damas" },
        { day: "Sun", location: "Hartamas Shopping Centre" }
      ],
      status: "active",
      outOfStockToday: ["prod-003", "prod-008"]
    },
    {
      id: "lorry-5",
      name: "Lorry 5 - Saucy Roamer",
      crew: ["Ahmad", "Mei Lin"],
      todayLocation: {
        name: "Bandar Sunway",
        address: "Jalan PJS 11/15, Bandar Sunway, 47500 Petaling Jaya, Selangor",
        mapsLink: "https://maps.google.com/?q=Bandar+Sunway+Pyramid",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Bandar Sunway" },
        { day: "Tue", location: "Bandar Sunway" },
        { day: "Wed", location: "Bandar Sunway" },
        { day: "Thu", location: "Bandar Sunway" },
        { day: "Fri", location: "Bandar Sunway" },
        { day: "Sat", location: "Bandar Sunway" },
        { day: "Sun", location: "Bandar Sunway" }
      ],
      status: "closed-today",
      outOfStockToday: []
    }
  ],

  orders: [
    {
      id: "ZP-2026-0517-001",
      outletId: "lorry-1",
      customerName: "Ahmad Faizal",
      customerPhone: "+60123456701",
      items: [
        { productId: "prod-002", qty: 1, price: 28.00 },
        { productId: "prod-009", qty: 2, price: 7.00 }
      ],
      total: 42.00,
      paymentMethod: "stripe",
      paymentStatus: "paid",
      orderStatus: "pending",
      pickupETA: "2026-05-17T19:30:00+08:00",
      createdAt: "2026-05-17T19:05:00+08:00"
    },
    {
      id: "ZP-2026-0517-002",
      outletId: "lorry-2",
      customerName: "Wei Ling Tan",
      customerPhone: "+60127654302",
      items: [
        { productId: "prod-004", qty: 1, price: 34.00 },
        { productId: "prod-007", qty: 1, price: 12.00 },
        { productId: "prod-010", qty: 1, price: 5.50 }
      ],
      total: 51.50,
      paymentMethod: "billplz",
      paymentStatus: "paid",
      orderStatus: "preparing",
      pickupETA: "2026-05-17T20:00:00+08:00",
      createdAt: "2026-05-17T19:32:00+08:00"
    },
    {
      id: "ZP-2026-0517-003",
      outletId: "lorry-3",
      customerName: "Priya Subramaniam",
      customerPhone: "+60169998703",
      items: [
        { productId: "prod-001", qty: 2, price: 22.00 },
        { productId: "prod-011", qty: 1, price: 14.00 }
      ],
      total: 58.00,
      paymentMethod: "fpx",
      paymentStatus: "paid",
      orderStatus: "ready",
      pickupETA: "2026-05-17T18:45:00+08:00",
      createdAt: "2026-05-17T18:10:00+08:00"
    },
    {
      id: "ZP-2026-0517-004",
      outletId: "lorry-4",
      customerName: "Hafiz Rahman",
      customerPhone: "+60112223304",
      items: [
        { productId: "prod-005", qty: 1, price: 38.00 },
        { productId: "prod-009", qty: 1, price: 7.00 }
      ],
      total: 45.00,
      paymentMethod: "cash",
      paymentStatus: "pending",
      orderStatus: "pending",
      pickupETA: "2026-05-17T20:15:00+08:00",
      createdAt: "2026-05-17T19:48:00+08:00"
    },
    {
      id: "ZP-2026-0517-005",
      outletId: "lorry-1",
      customerName: "Mei Lin Chong",
      customerPhone: "+60134445605",
      items: [
        { productId: "prod-003", qty: 1, price: 26.00 },
        { productId: "prod-008", qty: 1, price: 16.00 }
      ],
      total: 42.00,
      paymentMethod: "stripe",
      paymentStatus: "paid",
      orderStatus: "picked-up",
      pickupETA: "2026-05-17T18:00:00+08:00",
      createdAt: "2026-05-17T17:25:00+08:00"
    },
    {
      id: "ZP-2026-0517-006",
      outletId: "lorry-2",
      customerName: "Nur Aisyah",
      customerPhone: "+60198887706",
      items: [
        { productId: "prod-002", qty: 2, price: 28.00 }
      ],
      total: 56.00,
      paymentMethod: "billplz",
      paymentStatus: "paid",
      orderStatus: "picked-up",
      pickupETA: "2026-05-17T19:00:00+08:00",
      createdAt: "2026-05-17T18:20:00+08:00"
    },
    {
      id: "ZP-2026-0517-007",
      outletId: "lorry-3",
      customerName: "Daniel Lim",
      customerPhone: "+60176665507",
      items: [
        { productId: "prod-005", qty: 1, price: 38.00 },
        { productId: "prod-007", qty: 1, price: 12.00 },
        { productId: "prod-011", qty: 2, price: 14.00 }
      ],
      total: 78.00,
      paymentMethod: "fpx",
      paymentStatus: "paid",
      orderStatus: "preparing",
      pickupETA: "2026-05-17T20:30:00+08:00",
      createdAt: "2026-05-17T19:55:00+08:00"
    },
    {
      id: "ZP-2026-0517-008",
      outletId: "lorry-4",
      customerName: "Siti Khadijah",
      customerPhone: "+60103334408",
      items: [
        { productId: "prod-004", qty: 2, price: 34.00 }
      ],
      total: 68.00,
      paymentMethod: "stripe",
      paymentStatus: "paid",
      orderStatus: "ready",
      pickupETA: "2026-05-17T19:45:00+08:00",
      createdAt: "2026-05-17T19:00:00+08:00"
    },
    {
      id: "ZP-2026-0517-009",
      outletId: "lorry-5",
      customerName: "Raj Kumar",
      customerPhone: "+60145556609",
      items: [
        { productId: "prod-001", qty: 1, price: 22.00 },
        { productId: "prod-010", qty: 2, price: 5.50 }
      ],
      total: 33.00,
      paymentMethod: "cash",
      paymentStatus: "pending",
      orderStatus: "cancelled",
      pickupETA: "2026-05-17T18:30:00+08:00",
      createdAt: "2026-05-17T17:50:00+08:00"
    },
    {
      id: "ZP-2026-0517-010",
      outletId: "lorry-2",
      customerName: "Farah Iskandar",
      customerPhone: "+60192221110",
      items: [
        { productId: "prod-006", qty: 1, price: 42.00 },
        { productId: "prod-009", qty: 1, price: 7.00 }
      ],
      total: 49.00,
      paymentMethod: "billplz",
      paymentStatus: "pending",
      orderStatus: "cancelled",
      pickupETA: "2026-05-17T19:15:00+08:00",
      createdAt: "2026-05-17T18:35:00+08:00"
    }
  ],

  salesHistory: [
    { date: "2026-05-11", outletId: "lorry-1", totalRevenue: 1840.50, orderCount: 52, topProductId: "prod-002" },
    { date: "2026-05-11", outletId: "lorry-2", totalRevenue: 2310.00, orderCount: 64, topProductId: "prod-004" },
    { date: "2026-05-11", outletId: "lorry-3", totalRevenue: 1520.75, orderCount: 41, topProductId: "prod-001" },
    { date: "2026-05-11", outletId: "lorry-4", totalRevenue: 2680.25, orderCount: 71, topProductId: "prod-005" },
    { date: "2026-05-11", outletId: "lorry-5", totalRevenue: 1190.00, orderCount: 33, topProductId: "prod-003" },

    { date: "2026-05-12", outletId: "lorry-1", totalRevenue: 1620.00, orderCount: 47, topProductId: "prod-002" },
    { date: "2026-05-12", outletId: "lorry-2", totalRevenue: 2105.50, orderCount: 58, topProductId: "prod-004" },
    { date: "2026-05-12", outletId: "lorry-3", totalRevenue: 1380.25, orderCount: 38, topProductId: "prod-001" },
    { date: "2026-05-12", outletId: "lorry-4", totalRevenue: 2440.00, orderCount: 65, topProductId: "prod-005" },
    { date: "2026-05-12", outletId: "lorry-5", totalRevenue: 980.50, orderCount: 28, topProductId: "prod-003" },

    { date: "2026-05-13", outletId: "lorry-1", totalRevenue: 2050.75, orderCount: 57, topProductId: "prod-001" },
    { date: "2026-05-13", outletId: "lorry-2", totalRevenue: 2520.00, orderCount: 70, topProductId: "prod-004" },
    { date: "2026-05-13", outletId: "lorry-3", totalRevenue: 1710.50, orderCount: 46, topProductId: "prod-001" },
    { date: "2026-05-13", outletId: "lorry-4", totalRevenue: 2890.00, orderCount: 76, topProductId: "prod-005" },
    { date: "2026-05-13", outletId: "lorry-5", totalRevenue: 1340.25, orderCount: 36, topProductId: "prod-002" },

    { date: "2026-05-14", outletId: "lorry-1", totalRevenue: 1955.00, orderCount: 54, topProductId: "prod-002" },
    { date: "2026-05-14", outletId: "lorry-2", totalRevenue: 2270.75, orderCount: 62, topProductId: "prod-004" },
    { date: "2026-05-14", outletId: "lorry-3", totalRevenue: 1465.50, orderCount: 40, topProductId: "prod-001" },
    { date: "2026-05-14", outletId: "lorry-4", totalRevenue: 2615.00, orderCount: 68, topProductId: "prod-005" },
    { date: "2026-05-14", outletId: "lorry-5", totalRevenue: 1080.00, orderCount: 31, topProductId: "prod-003" },

    { date: "2026-05-15", outletId: "lorry-1", totalRevenue: 2780.25, orderCount: 78, topProductId: "prod-002" },
    { date: "2026-05-15", outletId: "lorry-2", totalRevenue: 3215.50, orderCount: 88, topProductId: "prod-004" },
    { date: "2026-05-15", outletId: "lorry-3", totalRevenue: 2105.00, orderCount: 59, topProductId: "prod-001" },
    { date: "2026-05-15", outletId: "lorry-4", totalRevenue: 3480.00, orderCount: 90, topProductId: "prod-005" },
    { date: "2026-05-15", outletId: "lorry-5", totalRevenue: 1680.50, orderCount: 45, topProductId: "prod-002" },

    { date: "2026-05-16", outletId: "lorry-1", totalRevenue: 3110.00, orderCount: 85, topProductId: "prod-005" },
    { date: "2026-05-16", outletId: "lorry-2", totalRevenue: 3420.25, orderCount: 89, topProductId: "prod-004" },
    { date: "2026-05-16", outletId: "lorry-3", totalRevenue: 2240.75, orderCount: 61, topProductId: "prod-001" },
    { date: "2026-05-16", outletId: "lorry-4", totalRevenue: 3290.00, orderCount: 86, topProductId: "prod-005" },
    { date: "2026-05-16", outletId: "lorry-5", totalRevenue: 1820.00, orderCount: 49, topProductId: "prod-002" },

    { date: "2026-05-17", outletId: "lorry-1", totalRevenue: 1450.00, orderCount: 38, topProductId: "prod-002" },
    { date: "2026-05-17", outletId: "lorry-2", totalRevenue: 1825.50, orderCount: 48, topProductId: "prod-004" },
    { date: "2026-05-17", outletId: "lorry-3", totalRevenue: 1180.25, orderCount: 32, topProductId: "prod-001" },
    { date: "2026-05-17", outletId: "lorry-4", totalRevenue: 2010.00, orderCount: 54, topProductId: "prod-005" },
    { date: "2026-05-17", outletId: "lorry-5", totalRevenue: 0.00, orderCount: 0, topProductId: "prod-002" }
  ],

  paymentGateways: [
    { id: "stripe", label: "Stripe", testMode: true },
    { id: "billplz", label: "Billplz (Malaysia)", testMode: true },
    { id: "fpx", label: "FPX Online Banking", testMode: true }
  ]
};
