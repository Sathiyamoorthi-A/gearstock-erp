// LocalStorage Fallback database seeder and utility helper.
// Provides client-side data persistence for offline demo capability (e.g. GitHub Pages).

const categoriesList = ['Engine', 'Electrical', 'Brakes', 'Suspension', 'Body', 'Oils & Fluids'];

const defaultSuppliers = [
  { id: 1, name: "Bosch India Pvt Ltd", contactPerson: "Amit Sharma", email: "sales@bosch.in", phone: "+91-80-2299-1000", address: "Hosur Road, Adugodi, Bangalore 560030", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 2, name: "NGK Spark Plugs India", contactPerson: "Priya Mehta", email: "orders@ngk.in", phone: "+91-124-471-5400", address: "IMT Manesar, Gurugram 122051", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 3, name: "Brembo Brake Systems", contactPerson: "Rajesh Nair", email: "india@brembo.com", phone: "+91-20-6720-3000", address: "Hinjewadi Phase 2, Pune 411057", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 4, name: "Monroe India", contactPerson: "Vikram Singh", email: "support@monroe.in", phone: "+91-44-2232-1100", address: "Ambattur Industrial Estate, Chennai 600058", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 5, name: "Denso Corporation", contactPerson: "Kenji Tanaka", email: "india@denso.com", phone: "+91-124-460-8000", address: "Sector 18, Gurugram 122015", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 6, name: "Mahle Filter Systems", contactPerson: "Sunita Reddy", email: "filters@mahle.in", phone: "+91-20-2714-5000", address: "Chakan MIDC, Pune 410501", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 7, name: "Valeo India", contactPerson: "Arjun Das", email: "sales@valeo.in", phone: "+91-44-4399-7000", address: "SIPCOT Industrial Park, Chennai 603204", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 8, name: "Exide Industries", contactPerson: "Meena Agarwal", email: "corporate@exide.in", phone: "+91-33-4401-5400", address: "Kolkata 700020", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() }
];

const defaultCustomers = [
  { id: 1, name: "Ramesh Gupta", email: "ramesh@autozone.in", phone: "+91-22-2567-8901", address: "Andheri West, Mumbai 400053", company: "AutoZone Service Center", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 2, name: "Naveen Joshi", email: "naveen@speedwheels.in", phone: "+91-11-4567-2345", address: "Karol Bagh, New Delhi 110005", company: "SpeedWheels Garage", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 3, name: "Karthik Rao", email: "karthik@krmotors.in", phone: "+91-80-4321-6789", address: "Koramangala, Bangalore 560034", company: "KR Motors", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 4, name: "Deepak Sharma", email: "deepak@sharmauto.in", phone: "+91-44-2890-1234", address: "T. Nagar, Chennai 600017", company: "Sharma Auto Works", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 5, name: "Anil Reddy", email: "anil@royalauto.in", phone: "+91-40-2345-6789", address: "Banjara Hills, Hyderabad 500034", company: "Royal Auto Parts", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() }
];

const defaultParts = [
  { id: 1, sku: "BSH-ALT-1490", name: "Bosch Alternator 14V / 90A", description: "High-performance alternator for passenger vehicles, 14V output, 90A capacity", categoryName: "Engine", quantity: 23, reorderLevel: 10, price: 18400, costPrice: 14200, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString() },
  { id: 2, sku: "NGK-SPK-6619", name: "NGK Iridium Spark Plugs (Set of 4)", description: "Premium iridium spark plugs for enhanced ignition, set of 4", categoryName: "Engine", quantity: 145, reorderLevel: 20, price: 7200, costPrice: 5100, supplierName: "NGK Spark Plugs India", createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString() },
  { id: 3, sku: "BRM-BDP-F108", name: "Brembo Brake Disc Pair — Front", description: "Ventilated front brake disc pair, 280mm diameter", categoryName: "Brakes", quantity: 8, reorderLevel: 5, price: 31800, costPrice: 24500, supplierName: "Brembo Brake Systems", createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString() },
  { id: 4, sku: "MNR-SAK-3350", name: "Monroe Shock Absorber Kit", description: "Gas-charged shock absorber kit for front axle", categoryName: "Suspension", quantity: 34, reorderLevel: 10, price: 9600, costPrice: 7200, supplierName: "Monroe India", createdAt: new Date(Date.now() - 50*24*60*60*1000).toISOString() },
  { id: 5, sku: "DNS-RAD-4420", name: "Denso Radiator — Toyota Innova", description: "Aluminium radiator assembly for Toyota Innova 2.4L diesel", categoryName: "Engine", quantity: 5, reorderLevel: 3, price: 14500, costPrice: 11200, supplierName: "Denso Corporation", createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString() },
  { id: 6, sku: "MHL-OF-2241", name: "Mahle Oil Filter", description: "Premium oil filter for multi-vehicle compatibility", categoryName: "Engine", quantity: 3, reorderLevel: 15, price: 850, costPrice: 520, supplierName: "Mahle Filter Systems", createdAt: new Date(Date.now() - 40*24*60*60*1000).toISOString() },
  { id: 7, sku: "ATE-BP-F108", name: "ATE Brake Pads — Front", description: "Ceramic front brake pad set with wear indicators", categoryName: "Brakes", quantity: 2, reorderLevel: 10, price: 4200, costPrice: 2900, supplierName: "Brembo Brake Systems", createdAt: new Date(Date.now() - 35*24*60*60*1000).toISOString() },
  { id: 8, sku: "VLO-AC-8811", name: "Valeo AC Compressor", description: "Scroll-type AC compressor for Maruti Suzuki models", categoryName: "Electrical", quantity: 8, reorderLevel: 10, price: 22500, costPrice: 17800, supplierName: "Valeo India", createdAt: new Date(Date.now() - 25*24*60*60*1000).toISOString() },
  { id: 9, sku: "EXD-BAT-065", name: "Exide Battery 65Ah", description: "Maintenance-free car battery, 65Ah, 12V", categoryName: "Electrical", quantity: 5, reorderLevel: 8, price: 7800, costPrice: 5900, supplierName: "Exide Industries", createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString() },
  { id: 10, sku: "BSH-WPR-2418", name: "Bosch Wiper Blade Set 24/18", description: "Aerotwin frameless wiper blades, driver 24\" + passenger 18\"", categoryName: "Body", quantity: 62, reorderLevel: 15, price: 1950, costPrice: 1350, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 55*24*60*60*1000).toISOString() },
  { id: 11, sku: "DNS-FPM-3310", name: "Denso Fuel Pump Module", description: "In-tank electric fuel pump module, 3.0 bar", categoryName: "Engine", quantity: 12, reorderLevel: 5, price: 8900, costPrice: 6700, supplierName: "Denso Corporation", createdAt: new Date(Date.now() - 28*24*60*60*1000).toISOString() },
  { id: 12, sku: "MNR-STM-2200", name: "Monroe Strut Mount Bearing", description: "Top strut mount with bearing for MacPherson suspension", categoryName: "Suspension", quantity: 28, reorderLevel: 8, price: 3400, costPrice: 2400, supplierName: "Monroe India", createdAt: new Date(Date.now() - 42*24*60*60*1000).toISOString() },
  { id: 13, sku: "NGK-IGC-4801", name: "NGK Ignition Coil Pack", description: "Direct ignition coil for 4-cylinder petrol engines", categoryName: "Engine", quantity: 38, reorderLevel: 10, price: 5600, costPrice: 3900, supplierName: "NGK Spark Plugs India", createdAt: new Date(Date.now() - 18*24*60*60*1000).toISOString() },
  { id: 14, sku: "BRM-BDP-R205", name: "Brembo Brake Disc Pair — Rear", description: "Solid rear brake disc pair, 260mm diameter", categoryName: "Brakes", quantity: 14, reorderLevel: 5, price: 24600, costPrice: 19200, supplierName: "Brembo Brake Systems", createdAt: new Date(Date.now() - 38*24*60*60*1000).toISOString() },
  { id: 15, sku: "MHL-AF-3378", name: "Mahle Air Filter Element", description: "High-efficiency air filter for diesel engines", categoryName: "Engine", quantity: 55, reorderLevel: 20, price: 1200, costPrice: 780, supplierName: "Mahle Filter Systems", createdAt: new Date(Date.now() - 22*24*60*60*1000).toISOString() },
  { id: 16, sku: "VLO-CLT-6672", name: "Valeo Clutch Kit 3-Piece", description: "Complete clutch kit: disc, pressure plate, release bearing", categoryName: "Engine", quantity: 7, reorderLevel: 4, price: 15800, costPrice: 12100, supplierName: "Valeo India", createdAt: new Date(Date.now() - 32*24*60*60*1000).toISOString() },
  { id: 17, sku: "EXD-BAT-075", name: "Exide Battery 75Ah — Heavy Duty", description: "Heavy duty maintenance-free battery, 75Ah, 12V for SUVs", categoryName: "Electrical", quantity: 18, reorderLevel: 6, price: 9400, costPrice: 7100, supplierName: "Exide Industries", createdAt: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
  { id: 18, sku: "BSH-STR-1001", name: "Bosch Starter Motor", description: "12V starter motor, 1.4kW output", categoryName: "Engine", quantity: 9, reorderLevel: 4, price: 12800, costPrice: 9600, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 48*24*60*60*1000).toISOString() },
  { id: 19, sku: "DNS-THR-5580", name: "Denso Thermostat Assembly", description: "Wax-pellet thermostat with housing, 82°C opening", categoryName: "Engine", quantity: 42, reorderLevel: 12, price: 2200, costPrice: 1500, supplierName: "Denso Corporation", createdAt: new Date(Date.now() - 16*24*60*60*1000).toISOString() },
  { id: 20, sku: "MNR-CSP-4450", name: "Monroe Coil Spring Pair — Front", description: "Progressive rate coil spring pair for front suspension", categoryName: "Suspension", quantity: 16, reorderLevel: 6, price: 7800, costPrice: 5800, supplierName: "Monroe India", createdAt: new Date(Date.now() - 36*24*60*60*1000).toISOString() },
  { id: 21, sku: "BSH-HRN-0712", name: "Bosch Relay Horn Set", description: "12V electromagnetic horn set, twin tone, 400/500Hz", categoryName: "Electrical", quantity: 72, reorderLevel: 20, price: 1650, costPrice: 1100, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 52*24*60*60*1000).toISOString() },
  { id: 22, sku: "BRM-BCL-R310", name: "Brembo Brake Caliper — Rear", description: "Remanufactured rear brake caliper, single piston", categoryName: "Brakes", quantity: 4, reorderLevel: 3, price: 18500, costPrice: 14200, supplierName: "Brembo Brake Systems", createdAt: new Date(Date.now() - 26*24*60*60*1000).toISOString() },
  { id: 23, sku: "MHL-CF-4490", name: "Mahle Cabin Air Filter", description: "Activated carbon cabin air filter for allergen protection", categoryName: "Body", quantity: 88, reorderLevel: 25, price: 950, costPrice: 580, supplierName: "Mahle Filter Systems", createdAt: new Date(Date.now() - 14*24*60*60*1000).toISOString() },
  { id: 24, sku: "VLO-RAD-FAN", name: "Valeo Radiator Fan Assembly", description: "Electric radiator cooling fan with motor, 300W", categoryName: "Engine", quantity: 6, reorderLevel: 3, price: 11200, costPrice: 8500, supplierName: "Valeo India", createdAt: new Date(Date.now() - 19*24*60*60*1000).toISOString() },
  { id: 25, sku: "CST-5W30-5L", name: "Castrol EDGE 5W-30 Engine Oil 5L", description: "Fully synthetic engine oil, 5W-30, 5 litre pack", categoryName: "Oils & Fluids", quantity: 95, reorderLevel: 30, price: 3200, costPrice: 2400, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
  { id: 26, sku: "CST-ATF-1L", name: "Castrol ATF Dex III Transmission Fluid 1L", description: "Automatic transmission fluid, Dexron III specification", categoryName: "Oils & Fluids", quantity: 48, reorderLevel: 15, price: 780, costPrice: 520, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
  { id: 27, sku: "BRK-DOT4-500", name: "Brake Fluid DOT 4 — 500ml", description: "High-performance DOT 4 brake fluid, 500ml bottle", categoryName: "Brakes", quantity: 65, reorderLevel: 20, price: 450, costPrice: 280, supplierName: "Brembo Brake Systems", createdAt: new Date(Date.now() - 11*24*60*60*1000).toISOString() },
  { id: 28, sku: "CLT-G12-1L", name: "Coolant G12+ Concentrate 1L", description: "Organic acid technology coolant concentrate, 1 litre", categoryName: "Oils & Fluids", quantity: 52, reorderLevel: 18, price: 620, costPrice: 380, supplierName: "Denso Corporation", createdAt: new Date(Date.now() - 9*24*60*60*1000).toISOString() },
  { id: 29, sku: "BSH-O2S-1145", name: "Bosch Oxygen Sensor", description: "Wideband oxygen (lambda) sensor for emission control", categoryName: "Engine", quantity: 19, reorderLevel: 8, price: 6200, costPrice: 4500, supplierName: "Bosch India Pvt Ltd", createdAt: new Date(Date.now() - 24*24*60*60*1000).toISOString() },
  { id: 30, sku: "VLO-HLB-H7", name: "Valeo Halogen Bulb H7 55W (Pair)", description: "Long-life halogen headlight bulbs, H7 fitting, 55W pair", categoryName: "Electrical", quantity: 110, reorderLevel: 30, price: 890, costPrice: 540, supplierName: "Valeo India", createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString() }
];

const defaultOrders = [
  {
    id: 1,
    orderNumber: "#ORD-9841",
    orderType: "SALES",
    status: "DELIVERED",
    totalAmount: 45400,
    customer: defaultCustomers[0],
    supplier: null,
    notes: "Delivered to AutoZone Service Center",
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
    items: [
      { id: 1, part: defaultParts[0], quantity: 2, unitPrice: 18400 },
      { id: 2, part: defaultParts[1], quantity: 1, unitPrice: 7200 }
    ]
  },
  {
    id: 2,
    orderNumber: "#ORD-9840",
    orderType: "PURCHASE",
    status: "IN_TRANSIT",
    totalAmount: 95400,
    customer: null,
    supplier: defaultSuppliers[2],
    notes: "Brake parts restocking from Brembo",
    createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
    items: [
      { id: 3, part: defaultParts[2], quantity: 3, unitPrice: 31800 }
    ]
  },
  {
    id: 3,
    orderNumber: "#ORD-9839",
    orderType: "SALES",
    status: "PENDING",
    totalAmount: 38400,
    customer: defaultCustomers[1],
    supplier: null,
    notes: "Pending shipment to SpeedWheels Garage",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      { id: 4, part: defaultParts[3], quantity: 4, unitPrice: 9600 }
    ]
  },
  {
    id: 4,
    orderNumber: "#ORD-9838",
    orderType: "SALES",
    status: "DELIVERED",
    totalAmount: 72500,
    customer: defaultCustomers[2],
    supplier: null,
    notes: "KR Motors bulk order — delivered",
    createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    items: [
      { id: 5, part: defaultParts[4], quantity: 5, unitPrice: 14500 }
    ]
  },
  {
    id: 5,
    orderNumber: "#ORD-9837",
    orderType: "PURCHASE",
    status: "DELIVERED",
    totalAmount: 42500,
    customer: null,
    supplier: defaultSuppliers[5],
    notes: "Mahle filters restock",
    createdAt: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
    items: [
      { id: 6, part: defaultParts[5], quantity: 50, unitPrice: 850 }
    ]
  },
  {
    id: 6,
    orderNumber: "#ORD-9836",
    orderType: "SALES",
    status: "RETURNED",
    totalAmount: 22500,
    customer: defaultCustomers[3],
    supplier: null,
    notes: "AC compressor returned — wrong model",
    createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    items: [
      { id: 7, part: defaultParts[7], quantity: 1, unitPrice: 22500 }
    ]
  },
  {
    id: 7,
    orderNumber: "#ORD-9835",
    orderType: "SALES",
    status: "IN_TRANSIT",
    totalAmount: 15600,
    customer: defaultCustomers[4],
    supplier: null,
    notes: "Shipped to Royal Auto Parts, Hyderabad",
    createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    items: [
      { id: 8, part: defaultParts[8], quantity: 2, unitPrice: 7800 }
    ]
  },
  {
    id: 8,
    orderNumber: "#ORD-9834",
    orderType: "PURCHASE",
    status: "PENDING",
    totalAmount: 67200,
    customer: null,
    supplier: defaultSuppliers[6],
    notes: "Valeo AC compressors and clutch kits restocking",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      { id: 9, part: defaultParts[7], quantity: 2, unitPrice: 22500 },
      { id: 10, part: defaultParts[15], quantity: 1, unitPrice: 15800 }
    ]
  }
];

// Ensure initial state exists in localStorage
const initLocalDb = () => {
  if (!localStorage.getItem('local_suppliers')) {
    localStorage.setItem('local_suppliers', JSON.stringify(defaultSuppliers));
  }
  if (!localStorage.getItem('local_customers')) {
    localStorage.setItem('local_customers', JSON.stringify(defaultCustomers));
  }
  if (!localStorage.getItem('local_parts')) {
    localStorage.setItem('local_parts', JSON.stringify(defaultParts));
  }
  if (!localStorage.getItem('local_orders')) {
    localStorage.setItem('local_orders', JSON.stringify(defaultOrders));
  }
};

initLocalDb();

// Helper to get raw data
export const getLocalSuppliers = (search = '') => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_suppliers') || '[]');
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter(s => s.name.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
};

export const saveLocalSupplier = (supplier) => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_suppliers') || '[]');
  const newSupplier = {
    ...supplier,
    id: supplier.id || Date.now(),
    createdAt: supplier.createdAt || new Date().toISOString()
  };
  list.push(newSupplier);
  localStorage.setItem('local_suppliers', JSON.stringify(list));
  return newSupplier;
};

export const updateLocalSupplier = (id, supplier) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_suppliers') || '[]');
  let updated = null;
  list = list.map(s => {
    if (s.id === Number(id) || s.id === id) {
      updated = { ...s, ...supplier };
      return updated;
    }
    return s;
  });
  localStorage.setItem('local_suppliers', JSON.stringify(list));
  return updated;
};

export const deleteLocalSupplier = (id) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_suppliers') || '[]');
  list = list.filter(s => s.id !== Number(id) && s.id !== id);
  localStorage.setItem('local_suppliers', JSON.stringify(list));
  return true;
};

// Customers
export const getLocalCustomers = (search = '') => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_customers') || '[]');
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter(c => c.name.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q)) || c.email.toLowerCase().includes(q));
};

export const saveLocalCustomer = (customer) => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_customers') || '[]');
  const newCustomer = {
    ...customer,
    id: customer.id || Date.now(),
    createdAt: customer.createdAt || new Date().toISOString()
  };
  list.push(newCustomer);
  localStorage.setItem('local_customers', JSON.stringify(list));
  return newCustomer;
};

export const updateLocalCustomer = (id, customer) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_customers') || '[]');
  let updated = null;
  list = list.map(c => {
    if (c.id === Number(id) || c.id === id) {
      updated = { ...c, ...customer };
      return updated;
    }
    return c;
  });
  localStorage.setItem('local_customers', JSON.stringify(list));
  return updated;
};

export const deleteLocalCustomer = (id) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_customers') || '[]');
  list = list.filter(c => c.id !== Number(id) && c.id !== id);
  localStorage.setItem('local_customers', JSON.stringify(list));
  return true;
};

// Parts
export const getLocalParts = (search = '') => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_parts') || '[]');
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
};

export const saveLocalPart = (part) => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_parts') || '[]');
  const newPart = {
    ...part,
    id: part.id || Date.now(),
    createdAt: part.createdAt || new Date().toISOString()
  };
  list.push(newPart);
  localStorage.setItem('local_parts', JSON.stringify(list));
  return newPart;
};

export const updateLocalPart = (id, part) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_parts') || '[]');
  let updated = null;
  list = list.map(p => {
    if (p.id === Number(id) || p.id === id) {
      updated = { ...p, ...part };
      return updated;
    }
    return p;
  });
  localStorage.setItem('local_parts', JSON.stringify(list));
  return updated;
};

export const deleteLocalPart = (id) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_parts') || '[]');
  list = list.filter(p => p.id !== Number(id) && p.id !== id);
  localStorage.setItem('local_parts', JSON.stringify(list));
  return true;
};

// Orders
export const getLocalOrders = (type = '') => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_orders') || '[]');
  if (!type) return list;
  return list.filter(o => o.orderType === type);
};

export const saveLocalOrder = (order) => {
  initLocalDb();
  const list = JSON.parse(localStorage.getItem('local_orders') || '[]');
  const parts = getLocalParts();

  // Deduct/add stock on order creation
  const items = order.items.map((item, idx) => {
    const itemId = item.partId || (item.part && item.part.id);
    const part = parts.find(p => p.id === Number(itemId) || p.sku === item.partSku || p.id === itemId);
    if (part) {
      if (order.orderType === 'SALES') {
        part.quantity = Math.max(0, part.quantity - item.quantity);
      } else if (order.orderType === 'PURCHASE' && order.status === 'DELIVERED') {
        part.quantity = part.quantity + item.quantity;
      }
      updateLocalPart(part.id, part);
    }
    return {
      id: idx + 1,
      part: part || { name: item.partName || 'Unknown Part', sku: item.partSku || 'N/A', price: item.unitPrice },
      quantity: item.quantity,
      unitPrice: item.unitPrice
    };
  });

  const nextId = list.length > 0 ? Math.max(...list.map(o => o.id)) + 1 : 1;
  const orderNumber = order.orderType === 'SALES' ? `#SO-78${30 + nextId}` : `#PO-42${0 + nextId}`;

  // Find Customer/Supplier info
  let customerObj = null;
  let supplierObj = null;
  if (order.orderType === 'SALES' && order.customerId) {
    customerObj = getLocalCustomers().find(c => c.id === Number(order.customerId));
  } else if (order.orderType === 'PURCHASE' && order.supplierId) {
    supplierObj = getLocalSuppliers().find(s => s.id === Number(order.supplierId));
  }

  const newOrder = {
    id: nextId,
    orderNumber,
    orderType: order.orderType,
    status: order.status || 'PENDING',
    totalAmount: order.totalAmount || items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0),
    customer: customerObj,
    supplier: supplierObj,
    notes: order.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: items
  };

  list.push(newOrder);
  localStorage.setItem('local_orders', JSON.stringify(list));
  return newOrder;
};

export const updateLocalOrderStatus = (id, status) => {
  initLocalDb();
  let list = JSON.parse(localStorage.getItem('local_orders') || '[]');
  let updated = null;
  
  list = list.map(o => {
    if (o.id === Number(id) || o.id === id) {
      const oldStatus = o.status;
      updated = { ...o, status, updatedAt: new Date().toISOString() };
      
      // If status changes to DELIVERED and it is a PURCHASE order, increase stock
      if (updated.orderType === 'PURCHASE' && status === 'DELIVERED' && oldStatus !== 'DELIVERED') {
        const parts = getLocalParts();
        updated.items.forEach(item => {
          const part = parts.find(p => p.id === item.part.id);
          if (part) {
            part.quantity += item.quantity;
            updateLocalPart(part.id, part);
          }
        });
      }
      return updated;
    }
    return o;
  });
  localStorage.setItem('local_orders', JSON.stringify(list));
  return updated;
};

// Dashboard aggregations calculated from local storage!
export const getLocalDashboardStats = () => {
  const parts = getLocalParts();
  const orders = getLocalOrders();
  const salesOrders = orders.filter(o => o.orderType === 'SALES');

  const totalSkus = parts.length;
  
  // Orders created today
  const todayStr = new Date().toISOString().substring(0, 10);
  const ordersToday = orders.filter(o => o.createdAt.substring(0, 10) === todayStr).length;
  
  // MTD sales revenue (delivered or pending this month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const mtdSales = salesOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status !== 'CANCELLED';
  });
  const revenueMtd = mtdSales.reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockItems = parts.filter(p => p.quantity <= p.reorderLevel).length;

  return {
    totalSkus,
    ordersToday,
    revenueMtd,
    lowStockItems,
    newSkusThisMonth: Math.round(totalSkus * 0.1), // Mock growth helper
    orderChangePercent: 12.3,
    revenueChangePercent: 8.1,
    lowStockChange: -2
  };
};

export const getLocalDashboardRevenueChart = () => {
  const orders = getLocalOrders();
  const salesOrders = orders.filter(o => o.orderType === 'SALES' && o.status !== 'CANCELLED');

  // Let's build last 8 periods matching the sample categories chart dates
  const periods = [
    { date: '1/6', daysAgoStart: 30, daysAgoEnd: 26 },
    { date: '5/6', daysAgoStart: 25, daysAgoEnd: 21 },
    { date: '9/6', daysAgoStart: 20, daysAgoEnd: 16 },
    { date: '13/6', daysAgoStart: 15, daysAgoEnd: 11 },
    { date: '17/6', daysAgoStart: 10, daysAgoEnd: 8 },
    { date: '21/6', daysAgoStart: 7, daysAgoEnd: 5 },
    { date: '25/6', daysAgoStart: 4, daysAgoEnd: 2 },
    { date: '29/6', daysAgoStart: 1, daysAgoEnd: 0 },
  ];

  return periods.map(p => {
    const start = new Date(Date.now() - p.daysAgoStart*24*60*60*1000);
    const end = new Date(Date.now() - p.daysAgoEnd*24*60*60*1000);
    
    const periodOrders = salesOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });

    const revenue = periodOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const count = periodOrders.length;

    // Provide a small baseline if there are zero orders so the chart looks nice
    const mockBaselineRevenue = 15000 + Math.floor(Math.random() * 20000);
    const mockBaselineCount = 2 + Math.floor(Math.random() * 5);

    return {
      date: p.date,
      revenue: revenue > 0 ? revenue : mockBaselineRevenue,
      orders: count > 0 ? count : mockBaselineCount
    };
  });
};

export const getLocalDashboardCategoryDistribution = () => {
  const parts = getLocalParts();
  const catColors = {
    'Engine': '#f59e0b',
    'Electrical': '#3b82f6',
    'Brakes': '#ef4444',
    'Suspension': '#10b981',
    'Body': '#8b5cf6',
    'Oils & Fluids': '#f97316'
  };

  const counts = {};
  categoriesList.forEach(c => { counts[c] = 0; });
  
  parts.forEach(p => {
    const cat = p.categoryName || 'Engine';
    if (counts[cat] !== undefined) {
      counts[cat]++;
    } else {
      counts[cat] = 1;
    }
  });

  return Object.keys(counts).map(name => ({
    name,
    value: counts[name],
    color: catColors[name] || '#6b7280'
  })).filter(c => c.value > 0);
};

export const getLocalDashboardRecentOrders = () => {
  const orders = getLocalOrders();
  // Sort descending
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  return sorted.map(o => {
    let partDesc = 'N/A';
    let qty = 0;
    if (o.items && o.items.length > 0) {
      const firstItem = o.items[0];
      partDesc = firstItem.part ? firstItem.part.name : 'Parts Order';
      if (o.items.length > 1) {
        partDesc += ` (+${o.items.length - 1} more)`;
      }
      qty = o.items.reduce((sum, it) => sum + it.quantity, 0);
    }
    return {
      orderId: o.orderNumber,
      partDescription: partDesc,
      quantity: qty,
      amount: o.totalAmount,
      status: o.status
    };
  });
};

export const getLocalDashboardLowStockAlerts = () => {
  const parts = getLocalParts();
  const lowStock = parts.filter(p => p.quantity <= p.reorderLevel);
  return lowStock.slice(0, 6).map(p => ({
    partName: p.name,
    sku: p.sku,
    category: p.categoryName,
    remaining: p.quantity
  }));
};
