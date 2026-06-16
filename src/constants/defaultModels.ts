export const defaultModels = [
  {
    id: "retail",
    name: "Retail Intelligence",
    description:
      "Model bisnis retail dan ritel fisik yang berfokus pada penjualan barang, perputaran inventaris, dan kecepatan penjualan.",
    category: "retail",
    isActive: true,
    examples: [],
    theme: {
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.05)",
      badge: "rgba(59, 130, 246, 0.1)",
    },
    icon: "solar:shop-2-bold-duotone",
  },
  {
    id: "fnb",
    name: "Food & Beverage",
    description:
      "Khusus untuk bisnis kuliner yang memproses bahan mentah menjadi hidangan siap saji untuk dine-in maupun takeaway.",
    category: "fnb",
    isActive: false,
    examples: ["Warung Makan", "Kafe", "Restoran"],
    theme: {
      color: "#f97316",
      bg: "rgba(249, 115, 22, 0.05)",
      badge: "rgba(249, 115, 22, 0.1)",
    },
    icon: "solar:cup-hot-bold-duotone",
  },
  {
    id: "service",
    name: "Service Intelligence",
    description:
      "Model bisnis yang mengandalkan keahlian dan jasa profesional, dengan penekanan pada durasi dan kepuasan pelanggan.",
    category: "service",
    isActive: false,
    examples: ["Klinik Akupuntur", "Bengkel Kendaraan", "Salon & Barbershop"],
    theme: {
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.05)",
      badge: "rgba(139, 92, 246, 0.1)",
    },
    icon: "solar:settings-minimalistic-bold-duotone",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description:
      "Pengaturan analisis penjualan untuk bisnis online, memantau kinerja toko digital di platform marketplace maupun website mandiri.",
    category: "ecommerce",
    isActive: false,
    examples: [
      "Toko Online Shopee/Tokopedia",
      "Social Commerce",
      "Website Mandiri",
    ],
    theme: {
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.05)",
      badge: "rgba(16, 185, 129, 0.1)",
    },
    icon: "solar:cart-large-bold-duotone",
  },
  {
    id: "manufacturing",
    name: "Manufacturing Intelligence",
    description:
      "Untuk industri kecil dan menengah yang memproduksi barang secara massal dengan fokus pada efisiensi rantai pasok dan operasional produksi.",
    category: "manufacturing",
    isActive: false,
    examples: ["Pabrik Tempe/Tahu", "Konveksi Baju", "Kerajinan Tangan"],
    theme: {
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.05)",
      badge: "rgba(236, 72, 153, 0.1)",
    },
    icon: "solar:structure-bold-duotone",
  },
];
