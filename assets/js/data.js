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
      id: "prod-013",
      name: "Quattro Formaggi",
      description: "Four-cheese blend of mozzarella, parmesan, gorgonzola, and ricotta on hand-stretched base.",
      price: 32.00,
      image: "assets/img/products/quattro-formaggi.jpg",
      category: "Classic",
      available: true
    },
    {
      id: "prod-014",
      name: "Ayam Percik Pizza",
      description: "Charcoal-grilled ayam percik with kerisik coconut, fresh ulam herbs, and a swirl of sambal belacan.",
      price: 36.00,
      image: "assets/img/products/ayam-percik.jpg",
      category: "Signature",
      available: true
    }
  ],

  outlets: [
    {
      id: "lorry-1",
      name: "Lorry 1 - The Cheese Wagon",
      crew: ["Ali", "Siti"],
      todayLocation: {
        name: "Pasar Siti Khadijah",
        address: "Jalan Buluh Kubu, 15000 Kota Bharu, Kelantan",
        mapsLink: "https://maps.google.com/?q=Pasar+Siti+Khadijah+Kota+Bharu",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Pasar Siti Khadijah" },
        { day: "Tue", location: "Pasar Siti Khadijah" },
        { day: "Wed", location: "Medan MPKB" },
        { day: "Thu", location: "Pasar Siti Khadijah" },
        { day: "Fri", location: "Pasar Siti Khadijah" },
        { day: "Sat", location: "Padang Merdeka" },
        { day: "Sun", location: "Pasar Siti Khadijah" }
      ],
      status: "active",
      outOfStockToday: ["prod-006"]
    },
    {
      id: "lorry-2",
      name: "Lorry 2 - Spice Express",
      crew: ["Hafiz", "Nurul"],
      todayLocation: {
        name: "Wakaf Che Yeh",
        address: "Jalan Long Yunus, Wakaf Che Yeh, 15050 Kota Bharu, Kelantan",
        mapsLink: "https://maps.google.com/?q=Wakaf+Che+Yeh+Night+Market",
        hoursStart: "16:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Wakaf Che Yeh" },
        { day: "Tue", location: "Wakaf Che Yeh" },
        { day: "Wed", location: "Wakaf Che Yeh" },
        { day: "Thu", location: "Kubang Kerian" },
        { day: "Fri", location: "Wakaf Che Yeh" },
        { day: "Sat", location: "Wakaf Che Yeh" },
        { day: "Sun", location: "Pengkalan Chepa" }
      ],
      status: "active",
      outOfStockToday: ["prod-013"]
    },
    {
      id: "lorry-3",
      name: "Lorry 3 - Veggie Voyager",
      crew: ["Priya", "Kumar"],
      todayLocation: {
        name: "Stadium Sultan Muhammad IV",
        address: "Jalan Tok Hakim, 15000 Kota Bharu, Kelantan",
        mapsLink: "https://maps.google.com/?q=Stadium+Sultan+Muhammad+IV+Kota+Bharu",
        hoursStart: "17:00",
        hoursEnd: "00:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Stadium Sultan Muhammad IV" },
        { day: "Tue", location: "Tunjong" },
        { day: "Wed", location: "Stadium Sultan Muhammad IV" },
        { day: "Thu", location: "Stadium Sultan Muhammad IV" },
        { day: "Fri", location: "Stadium Sultan Muhammad IV" },
        { day: "Sat", location: "Padang Polo" },
        { day: "Sun", location: "Stadium Sultan Muhammad IV" }
      ],
      status: "active",
      outOfStockToday: []
    },
    {
      id: "lorry-4",
      name: "Lorry 4 - Crust Cruiser",
      crew: ["Wei Ming", "Aisyah"],
      todayLocation: {
        name: "Medan MPKB",
        address: "Jalan Doktor, 15000 Kota Bharu, Kelantan",
        mapsLink: "https://maps.google.com/?q=Medan+MPKB+Kota+Bharu",
        hoursStart: "18:00",
        hoursEnd: "00:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Medan MPKB" },
        { day: "Tue", location: "Medan MPKB" },
        { day: "Wed", location: "Pasar Besar Kota Bharu" },
        { day: "Thu", location: "Medan MPKB" },
        { day: "Fri", location: "Medan MPKB" },
        { day: "Sat", location: "Medan MPKB" },
        { day: "Sun", location: "Jalan PCB" }
      ],
      status: "active",
      outOfStockToday: ["prod-003"]
    },
    {
      id: "lorry-5",
      name: "Lorry 5 - Saucy Roamer",
      crew: ["Ahmad", "Mei Lin"],
      todayLocation: {
        name: "Pengkalan Chepa",
        address: "Jalan Pengkalan Chepa, 16100 Kota Bharu, Kelantan",
        mapsLink: "https://maps.google.com/?q=Pengkalan+Chepa+Kelantan",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Pengkalan Chepa" },
        { day: "Tue", location: "Pengkalan Chepa" },
        { day: "Wed", location: "Pengkalan Chepa" },
        { day: "Thu", location: "Pengkalan Chepa" },
        { day: "Fri", location: "Pengkalan Chepa" },
        { day: "Sat", location: "Pengkalan Chepa" },
        { day: "Sun", location: "Pengkalan Chepa" }
      ],
      status: "closed-today",
      outOfStockToday: []
    },
    {
      id: "lorry-6",
      name: "Lorry 6 - Pantai Pizza",
      crew: ["Faiz", "Liyana"],
      todayLocation: {
        name: "Pantai Irama",
        address: "Pantai Irama, 16300 Bachok, Kelantan",
        mapsLink: "https://maps.google.com/?q=Pantai+Irama+Bachok+Kelantan",
        hoursStart: "16:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Pantai Irama" },
        { day: "Tue", location: "Pantai Irama" },
        { day: "Wed", location: "Pantai Bisikan Bayu" },
        { day: "Thu", location: "Pantai Irama" },
        { day: "Fri", location: "Pantai Irama" },
        { day: "Sat", location: "Pantai Irama" },
        { day: "Sun", location: "Bachok Town" }
      ],
      status: "active",
      outOfStockToday: ["prod-014"]
    },
    {
      id: "lorry-7",
      name: "Lorry 7 - Sungai Wagon",
      crew: ["Rashid", "Farah"],
      todayLocation: {
        name: "Kuala Krai Town",
        address: "Jalan Besar, 18000 Kuala Krai, Kelantan",
        mapsLink: "https://maps.google.com/?q=Kuala+Krai+Kelantan",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Kuala Krai Town" },
        { day: "Tue", location: "Dabong" },
        { day: "Wed", location: "Kuala Krai Town" },
        { day: "Thu", location: "Kuala Krai Town" },
        { day: "Fri", location: "Kuala Krai Town" },
        { day: "Sat", location: "Manek Urai" },
        { day: "Sun", location: "Kuala Krai Town" }
      ],
      status: "active",
      outOfStockToday: ["prod-013"]
    },
    {
      id: "lorry-8",
      name: "Lorry 8 - Border Bites",
      crew: ["Zaki", "Norina"],
      todayLocation: {
        name: "Rantau Panjang",
        address: "Jalan Pasar, 17200 Rantau Panjang, Pasir Mas, Kelantan",
        mapsLink: "https://maps.google.com/?q=Rantau+Panjang+Pasir+Mas+Kelantan",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Rantau Panjang" },
        { day: "Tue", location: "Rantau Panjang" },
        { day: "Wed", location: "Pasir Mas Town" },
        { day: "Thu", location: "Rantau Panjang" },
        { day: "Fri", location: "Rantau Panjang" },
        { day: "Sat", location: "Rantau Panjang" },
        { day: "Sun", location: "Pasir Mas Town" }
      ],
      status: "closed-today",
      outOfStockToday: []
    },
    {
      id: "lorry-9",
      name: "Lorry 9 - Highland Crust",
      crew: ["Iskandar", "Atikah"],
      todayLocation: {
        name: "Gua Musang Town",
        address: "Jalan Persiaran Raya, 18300 Gua Musang, Kelantan",
        mapsLink: "https://maps.google.com/?q=Gua+Musang+Kelantan",
        hoursStart: "17:00",
        hoursEnd: "23:00"
      },
      weekSchedule: [
        { day: "Mon", location: "Gua Musang Town" },
        { day: "Tue", location: "Gua Musang Town" },
        { day: "Wed", location: "Gua Musang Town" },
        { day: "Thu", location: "Bertam Baru" },
        { day: "Fri", location: "Gua Musang Town" },
        { day: "Sat", location: "Gua Musang Town" },
        { day: "Sun", location: "Gua Musang Town" }
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
        { productId: "prod-001", qty: 1, price: 22.00 }
      ],
      total: 50.00,
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
        { productId: "prod-013", qty: 1, price: 32.00 }
      ],
      total: 66.00,
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
        { productId: "prod-014", qty: 1, price: 36.00 }
      ],
      total: 80.00,
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
        { productId: "prod-003", qty: 1, price: 26.00 }
      ],
      total: 64.00,
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
        { productId: "prod-013", qty: 1, price: 32.00 }
      ],
      total: 58.00,
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
        { productId: "prod-014", qty: 1, price: 36.00 }
      ],
      total: 74.00,
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
        { productId: "prod-002", qty: 1, price: 28.00 }
      ],
      total: 50.00,
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
        { productId: "prod-013", qty: 1, price: 32.00 }
      ],
      total: 74.00,
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
