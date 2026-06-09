package com.gearstock.config;

import com.gearstock.model.*;
import com.gearstock.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    public DataSeeder(UserRepository userRepository, CategoryRepository categoryRepository, SupplierRepository supplierRepository, CustomerRepository customerRepository, PartRepository partRepository, OrderRepository orderRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.customerRepository = customerRepository;
        this.partRepository = partRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataSeeder.class);


    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final PartRepository partRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("=== GearStock ERP PRO — Seeding Database ===");

        seedUsers();
        List<Category> categories = seedCategories();
        List<Supplier> suppliers = seedSuppliers();
        List<Customer> customers = seedCustomers();
        List<Part> parts = seedParts(categories, suppliers);
        seedOrders(parts, customers, suppliers);

        log.info("=== Database Seeding Complete ===");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .username("admin")
                .email("admin@gearstock.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Ravi Kumar")
                .role(Role.ROLE_ADMIN)
                .department("Management")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .username("warehouse")
                .email("warehouse@gearstock.com")
                .password(passwordEncoder.encode("warehouse123"))
                .fullName("Suresh Patel")
                .role(Role.ROLE_WAREHOUSE_MGR)
                .department("Warehouse")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build());

        log.info("Seeded 2 users");
    }

    private List<Category> seedCategories() {
        if (categoryRepository.count() > 0) return categoryRepository.findAll();

        List<Category> categories = List.of(
                Category.builder().name("Engine").color("#f59e0b").description("Engine components and accessories").build(),
                Category.builder().name("Electrical").color("#3b82f6").description("Electrical systems and wiring").build(),
                Category.builder().name("Brakes").color("#ef4444").description("Brake pads, discs, and hydraulics").build(),
                Category.builder().name("Suspension").color("#10b981").description("Suspension and steering components").build(),
                Category.builder().name("Body").color("#8b5cf6").description("Body panels, mirrors, and trim").build(),
                Category.builder().name("Oils & Fluids").color("#f97316").description("Lubricants, coolants, and brake fluids").build()
        );
        List<Category> saved = categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", saved.size());
        return saved;
    }

    private List<Supplier> seedSuppliers() {
        if (supplierRepository.count() > 0) return supplierRepository.findAll();

        List<Supplier> suppliers = List.of(
                Supplier.builder().name("Bosch India Pvt Ltd").contactPerson("Amit Sharma").email("sales@bosch.in").phone("+91-80-2299-1000").address("Hosur Road, Adugodi, Bangalore 560030").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("NGK Spark Plugs India").contactPerson("Priya Mehta").email("orders@ngk.in").phone("+91-124-471-5400").address("IMT Manesar, Gurugram 122051").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Brembo Brake Systems").contactPerson("Rajesh Nair").email("india@brembo.com").phone("+91-20-6720-3000").address("Hinjewadi Phase 2, Pune 411057").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Monroe India").contactPerson("Vikram Singh").email("support@monroe.in").phone("+91-44-2232-1100").address("Ambattur Industrial Estate, Chennai 600058").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Denso Corporation").contactPerson("Kenji Tanaka").email("india@denso.com").phone("+91-124-460-8000").address("Sector 18, Gurugram 122015").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Mahle Filter Systems").contactPerson("Sunita Reddy").email("filters@mahle.in").phone("+91-20-2714-5000").address("Chakan MIDC, Pune 410501").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Valeo India").contactPerson("Arjun Das").email("sales@valeo.in").phone("+91-44-4399-7000").address("SIPCOT Industrial Park, Chennai 603204").createdAt(LocalDateTime.now()).build(),
                Supplier.builder().name("Exide Industries").contactPerson("Meena Agarwal").email("corporate@exide.in").phone("+91-33-4401-5400").address("Kolkata 700020").createdAt(LocalDateTime.now()).build()
        );
        List<Supplier> saved = supplierRepository.saveAll(suppliers);
        log.info("Seeded {} suppliers", saved.size());
        return saved;
    }

    private List<Customer> seedCustomers() {
        if (customerRepository.count() > 0) return customerRepository.findAll();

        List<Customer> customers = List.of(
                Customer.builder().name("Ramesh Gupta").email("ramesh@autozone.in").phone("+91-22-2567-8901").address("Andheri West, Mumbai 400053").company("AutoZone Service Center").createdAt(LocalDateTime.now()).build(),
                Customer.builder().name("Naveen Joshi").email("naveen@speedwheels.in").phone("+91-11-4567-2345").address("Karol Bagh, New Delhi 110005").company("SpeedWheels Garage").createdAt(LocalDateTime.now()).build(),
                Customer.builder().name("Karthik Rao").email("karthik@krmotors.in").phone("+91-80-4321-6789").address("Koramangala, Bangalore 560034").company("KR Motors").createdAt(LocalDateTime.now()).build(),
                Customer.builder().name("Deepak Sharma").email("deepak@sharmauto.in").phone("+91-44-2890-1234").address("T. Nagar, Chennai 600017").company("Sharma Auto Works").createdAt(LocalDateTime.now()).build(),
                Customer.builder().name("Anil Reddy").email("anil@royalauto.in").phone("+91-40-2345-6789").address("Banjara Hills, Hyderabad 500034").company("Royal Auto Parts").createdAt(LocalDateTime.now()).build()
        );
        List<Customer> saved = customerRepository.saveAll(customers);
        log.info("Seeded {} customers", saved.size());
        return saved;
    }

    private List<Part> seedParts(List<Category> categories, List<Supplier> suppliers) {
        if (partRepository.count() > 0) return partRepository.findAll();

        Category engine = categories.stream().filter(c -> c.getName().equals("Engine")).findFirst().orElse(null);
        Category electrical = categories.stream().filter(c -> c.getName().equals("Electrical")).findFirst().orElse(null);
        Category brakes = categories.stream().filter(c -> c.getName().equals("Brakes")).findFirst().orElse(null);
        Category suspension = categories.stream().filter(c -> c.getName().equals("Suspension")).findFirst().orElse(null);
        Category body = categories.stream().filter(c -> c.getName().equals("Body")).findFirst().orElse(null);
        Category oilsFluids = categories.stream().filter(c -> c.getName().equals("Oils & Fluids")).findFirst().orElse(null);

        Supplier bosch = suppliers.stream().filter(s -> s.getName().contains("Bosch")).findFirst().orElse(null);
        Supplier ngk = suppliers.stream().filter(s -> s.getName().contains("NGK")).findFirst().orElse(null);
        Supplier brembo = suppliers.stream().filter(s -> s.getName().contains("Brembo")).findFirst().orElse(null);
        Supplier monroe = suppliers.stream().filter(s -> s.getName().contains("Monroe")).findFirst().orElse(null);
        Supplier denso = suppliers.stream().filter(s -> s.getName().contains("Denso")).findFirst().orElse(null);
        Supplier mahle = suppliers.stream().filter(s -> s.getName().contains("Mahle")).findFirst().orElse(null);
        Supplier valeo = suppliers.stream().filter(s -> s.getName().contains("Valeo")).findFirst().orElse(null);
        Supplier exide = suppliers.stream().filter(s -> s.getName().contains("Exide")).findFirst().orElse(null);

        LocalDateTime now = LocalDateTime.now();

        List<Part> parts = List.of(
                Part.builder().sku("BSH-ALT-1490").name("Bosch Alternator 14V / 90A").description("High-performance alternator for passenger vehicles, 14V output, 90A capacity").category(engine).quantity(23).reorderLevel(10).price(new BigDecimal("18400")).costPrice(new BigDecimal("14200")).supplier(bosch).createdAt(now.minusDays(45)).updatedAt(now.minusDays(2)).build(),
                Part.builder().sku("NGK-SPK-6619").name("NGK Iridium Spark Plugs (Set of 4)").description("Premium iridium spark plugs for enhanced ignition, set of 4").category(engine).quantity(145).reorderLevel(20).price(new BigDecimal("7200")).costPrice(new BigDecimal("5100")).supplier(ngk).createdAt(now.minusDays(60)).updatedAt(now.minusDays(5)).build(),
                Part.builder().sku("BRM-BDP-F108").name("Brembo Brake Disc Pair — Front").description("Ventilated front brake disc pair, 280mm diameter").category(brakes).quantity(8).reorderLevel(5).price(new BigDecimal("31800")).costPrice(new BigDecimal("24500")).supplier(brembo).createdAt(now.minusDays(30)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("MNR-SAK-3350").name("Monroe Shock Absorber Kit").description("Gas-charged shock absorber kit for front axle").category(suspension).quantity(34).reorderLevel(10).price(new BigDecimal("9600")).costPrice(new BigDecimal("7200")).supplier(monroe).createdAt(now.minusDays(50)).updatedAt(now.minusDays(3)).build(),
                Part.builder().sku("DNS-RAD-4420").name("Denso Radiator — Toyota Innova").description("Aluminium radiator assembly for Toyota Innova 2.4L diesel").category(engine).quantity(5).reorderLevel(3).price(new BigDecimal("14500")).costPrice(new BigDecimal("11200")).supplier(denso).createdAt(now.minusDays(20)).updatedAt(now.minusDays(4)).build(),
                Part.builder().sku("MHL-OF-2241").name("Mahle Oil Filter").description("Premium oil filter for multi-vehicle compatibility").category(engine).quantity(3).reorderLevel(15).price(new BigDecimal("850")).costPrice(new BigDecimal("520")).supplier(mahle).createdAt(now.minusDays(40)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("ATE-BP-F108").name("ATE Brake Pads — Front").description("Ceramic front brake pad set with wear indicators").category(brakes).quantity(2).reorderLevel(10).price(new BigDecimal("4200")).costPrice(new BigDecimal("2900")).supplier(brembo).createdAt(now.minusDays(35)).updatedAt(now.minusDays(2)).build(),
                Part.builder().sku("VLO-AC-8811").name("Valeo AC Compressor").description("Scroll-type AC compressor for Maruti Suzuki models").category(electrical).quantity(8).reorderLevel(10).price(new BigDecimal("22500")).costPrice(new BigDecimal("17800")).supplier(valeo).createdAt(now.minusDays(25)).updatedAt(now.minusDays(3)).build(),
                Part.builder().sku("EXD-BAT-065").name("Exide Battery 65Ah").description("Maintenance-free car battery, 65Ah, 12V").category(electrical).quantity(5).reorderLevel(8).price(new BigDecimal("7800")).costPrice(new BigDecimal("5900")).supplier(exide).createdAt(now.minusDays(15)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("BSH-WPR-2418").name("Bosch Wiper Blade Set 24/18").description("Aerotwin frameless wiper blades, driver 24\" + passenger 18\"").category(body).quantity(62).reorderLevel(15).price(new BigDecimal("1950")).costPrice(new BigDecimal("1350")).supplier(bosch).createdAt(now.minusDays(55)).updatedAt(now.minusDays(4)).build(),
                Part.builder().sku("DNS-FPM-3310").name("Denso Fuel Pump Module").description("In-tank electric fuel pump module, 3.0 bar").category(engine).quantity(12).reorderLevel(5).price(new BigDecimal("8900")).costPrice(new BigDecimal("6700")).supplier(denso).createdAt(now.minusDays(28)).updatedAt(now.minusDays(6)).build(),
                Part.builder().sku("MNR-STM-2200").name("Monroe Strut Mount Bearing").description("Top strut mount with bearing for MacPherson suspension").category(suspension).quantity(28).reorderLevel(8).price(new BigDecimal("3400")).costPrice(new BigDecimal("2400")).supplier(monroe).createdAt(now.minusDays(42)).updatedAt(now.minusDays(5)).build(),
                Part.builder().sku("NGK-IGC-4801").name("NGK Ignition Coil Pack").description("Direct ignition coil for 4-cylinder petrol engines").category(engine).quantity(38).reorderLevel(10).price(new BigDecimal("5600")).costPrice(new BigDecimal("3900")).supplier(ngk).createdAt(now.minusDays(18)).updatedAt(now.minusDays(2)).build(),
                Part.builder().sku("BRM-BDP-R205").name("Brembo Brake Disc Pair — Rear").description("Solid rear brake disc pair, 260mm diameter").category(brakes).quantity(14).reorderLevel(5).price(new BigDecimal("24600")).costPrice(new BigDecimal("19200")).supplier(brembo).createdAt(now.minusDays(38)).updatedAt(now.minusDays(7)).build(),
                Part.builder().sku("MHL-AF-3378").name("Mahle Air Filter Element").description("High-efficiency air filter for diesel engines").category(engine).quantity(55).reorderLevel(20).price(new BigDecimal("1200")).costPrice(new BigDecimal("780")).supplier(mahle).createdAt(now.minusDays(22)).updatedAt(now.minusDays(3)).build(),
                Part.builder().sku("VLO-CLT-6672").name("Valeo Clutch Kit 3-Piece").description("Complete clutch kit: disc, pressure plate, release bearing").category(engine).quantity(7).reorderLevel(4).price(new BigDecimal("15800")).costPrice(new BigDecimal("12100")).supplier(valeo).createdAt(now.minusDays(32)).updatedAt(now.minusDays(5)).build(),
                Part.builder().sku("EXD-BAT-075").name("Exide Battery 75Ah — Heavy Duty").description("Heavy duty maintenance-free battery, 75Ah, 12V for SUVs").category(electrical).quantity(18).reorderLevel(6).price(new BigDecimal("9400")).costPrice(new BigDecimal("7100")).supplier(exide).createdAt(now.minusDays(12)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("BSH-STR-1001").name("Bosch Starter Motor").description("12V starter motor, 1.4kW output").category(engine).quantity(9).reorderLevel(4).price(new BigDecimal("12800")).costPrice(new BigDecimal("9600")).supplier(bosch).createdAt(now.minusDays(48)).updatedAt(now.minusDays(6)).build(),
                Part.builder().sku("DNS-THR-5580").name("Denso Thermostat Assembly").description("Wax-pellet thermostat with housing, 82°C opening").category(engine).quantity(42).reorderLevel(12).price(new BigDecimal("2200")).costPrice(new BigDecimal("1500")).supplier(denso).createdAt(now.minusDays(16)).updatedAt(now.minusDays(2)).build(),
                Part.builder().sku("MNR-CSP-4450").name("Monroe Coil Spring Pair — Front").description("Progressive rate coil spring pair for front suspension").category(suspension).quantity(16).reorderLevel(6).price(new BigDecimal("7800")).costPrice(new BigDecimal("5800")).supplier(monroe).createdAt(now.minusDays(36)).updatedAt(now.minusDays(4)).build(),
                Part.builder().sku("BSH-HRN-0712").name("Bosch Relay Horn Set").description("12V electromagnetic horn set, twin tone, 400/500Hz").category(electrical).quantity(72).reorderLevel(20).price(new BigDecimal("1650")).costPrice(new BigDecimal("1100")).supplier(bosch).createdAt(now.minusDays(52)).updatedAt(now.minusDays(3)).build(),
                Part.builder().sku("BRM-BCL-R310").name("Brembo Brake Caliper — Rear").description("Remanufactured rear brake caliper, single piston").category(brakes).quantity(4).reorderLevel(3).price(new BigDecimal("18500")).costPrice(new BigDecimal("14200")).supplier(brembo).createdAt(now.minusDays(26)).updatedAt(now.minusDays(5)).build(),
                Part.builder().sku("MHL-CF-4490").name("Mahle Cabin Air Filter").description("Activated carbon cabin air filter for allergen protection").category(body).quantity(88).reorderLevel(25).price(new BigDecimal("950")).costPrice(new BigDecimal("580")).supplier(mahle).createdAt(now.minusDays(14)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("VLO-RAD-FAN").name("Valeo Radiator Fan Assembly").description("Electric radiator cooling fan with motor, 300W").category(engine).quantity(6).reorderLevel(3).price(new BigDecimal("11200")).costPrice(new BigDecimal("8500")).supplier(valeo).createdAt(now.minusDays(19)).updatedAt(now.minusDays(2)).build(),
                Part.builder().sku("CST-5W30-5L").name("Castrol EDGE 5W-30 Engine Oil 5L").description("Fully synthetic engine oil, 5W-30, 5 litre pack").category(oilsFluids).quantity(95).reorderLevel(30).price(new BigDecimal("3200")).costPrice(new BigDecimal("2400")).supplier(bosch).createdAt(now.minusDays(10)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("CST-ATF-1L").name("Castrol ATF Dex III Transmission Fluid 1L").description("Automatic transmission fluid, Dexron III specification").category(oilsFluids).quantity(48).reorderLevel(15).price(new BigDecimal("780")).costPrice(new BigDecimal("520")).supplier(bosch).createdAt(now.minusDays(8)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("BRK-DOT4-500").name("Brake Fluid DOT 4 — 500ml").description("High-performance DOT 4 brake fluid, 500ml bottle").category(oilsFluids).quantity(65).reorderLevel(20).price(new BigDecimal("450")).costPrice(new BigDecimal("280")).supplier(brembo).createdAt(now.minusDays(11)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("CLT-G12-1L").name("Coolant G12+ Concentrate 1L").description("Organic acid technology coolant concentrate, 1 litre").category(oilsFluids).quantity(52).reorderLevel(18).price(new BigDecimal("620")).costPrice(new BigDecimal("380")).supplier(denso).createdAt(now.minusDays(9)).updatedAt(now.minusDays(1)).build(),
                Part.builder().sku("BSH-O2S-1145").name("Bosch Oxygen Sensor").description("Wideband oxygen (lambda) sensor for emission control").category(engine).quantity(19).reorderLevel(8).price(new BigDecimal("6200")).costPrice(new BigDecimal("4500")).supplier(bosch).createdAt(now.minusDays(24)).updatedAt(now.minusDays(3)).build(),
                Part.builder().sku("VLO-HLB-H7").name("Valeo Halogen Bulb H7 55W (Pair)").description("Long-life halogen headlight bulbs, H7 fitting, 55W pair").category(electrical).quantity(110).reorderLevel(30).price(new BigDecimal("890")).costPrice(new BigDecimal("540")).supplier(valeo).createdAt(now.minusDays(7)).updatedAt(now.minusDays(1)).build()
        );

        List<Part> saved = partRepository.saveAll(parts);
        log.info("Seeded {} parts", saved.size());
        return saved;
    }

    private void seedOrders(List<Part> parts, List<Customer> customers, List<Supplier> suppliers) {
        if (orderRepository.count() > 0) return;

        LocalDateTime now = LocalDateTime.now();

        // Order 1 — SALES, DELIVERED, 2 days ago
        Order order1 = Order.builder()
                .orderNumber("#ORD-9841")
                .orderType("SALES")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("45400"))
                .customer(customers.get(0))
                .notes("Delivered to AutoZone Service Center")
                .createdAt(now.minusDays(2))
                .updatedAt(now.minusDays(1))
                .items(new ArrayList<>())
                .build();
        order1.getItems().add(OrderItem.builder().order(order1).part(parts.get(0)).quantity(2).unitPrice(new BigDecimal("18400")).build());
        order1.getItems().add(OrderItem.builder().order(order1).part(parts.get(1)).quantity(1).unitPrice(new BigDecimal("7200")).build());

        // Order 2 — PURCHASE, IN_TRANSIT, 1 day ago
        Order order2 = Order.builder()
                .orderNumber("#ORD-9840")
                .orderType("PURCHASE")
                .status("IN_TRANSIT")
                .totalAmount(new BigDecimal("95400"))
                .supplier(suppliers.get(2))
                .notes("Brake parts restocking from Brembo")
                .createdAt(now.minusDays(1))
                .updatedAt(now.minusDays(1))
                .items(new ArrayList<>())
                .build();
        order2.getItems().add(OrderItem.builder().order(order2).part(parts.get(2)).quantity(3).unitPrice(new BigDecimal("31800")).build());

        // Order 3 — SALES, PENDING, today
        Order order3 = Order.builder()
                .orderNumber("#ORD-9839")
                .orderType("SALES")
                .status("PENDING")
                .totalAmount(new BigDecimal("38400"))
                .customer(customers.get(1))
                .notes("Pending shipment to SpeedWheels Garage")
                .createdAt(now)
                .updatedAt(now)
                .items(new ArrayList<>())
                .build();
        order3.getItems().add(OrderItem.builder().order(order3).part(parts.get(3)).quantity(4).unitPrice(new BigDecimal("9600")).build());

        // Order 4 — SALES, DELIVERED, 5 days ago
        Order order4 = Order.builder()
                .orderNumber("#ORD-9838")
                .orderType("SALES")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("72500"))
                .customer(customers.get(2))
                .notes("KR Motors bulk order — delivered")
                .createdAt(now.minusDays(5))
                .updatedAt(now.minusDays(3))
                .items(new ArrayList<>())
                .build();
        order4.getItems().add(OrderItem.builder().order(order4).part(parts.get(4)).quantity(5).unitPrice(new BigDecimal("14500")).build());

        // Order 5 — PURCHASE, DELIVERED, 8 days ago
        Order order5 = Order.builder()
                .orderNumber("#ORD-9837")
                .orderType("PURCHASE")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("42500"))
                .supplier(suppliers.get(5))
                .notes("Mahle filters restock")
                .createdAt(now.minusDays(8))
                .updatedAt(now.minusDays(6))
                .items(new ArrayList<>())
                .build();
        order5.getItems().add(OrderItem.builder().order(order5).part(parts.get(5)).quantity(50).unitPrice(new BigDecimal("850")).build());

        // Order 6 — SALES, RETURNED, 4 days ago
        Order order6 = Order.builder()
                .orderNumber("#ORD-9836")
                .orderType("SALES")
                .status("RETURNED")
                .totalAmount(new BigDecimal("22500"))
                .customer(customers.get(3))
                .notes("AC compressor returned — wrong model")
                .createdAt(now.minusDays(4))
                .updatedAt(now.minusDays(2))
                .items(new ArrayList<>())
                .build();
        order6.getItems().add(OrderItem.builder().order(order6).part(parts.get(7)).quantity(1).unitPrice(new BigDecimal("22500")).build());

        // Order 7 — SALES, IN_TRANSIT, 3 days ago
        Order order7 = Order.builder()
                .orderNumber("#ORD-9835")
                .orderType("SALES")
                .status("IN_TRANSIT")
                .totalAmount(new BigDecimal("15600"))
                .customer(customers.get(4))
                .notes("Shipped to Royal Auto Parts, Hyderabad")
                .createdAt(now.minusDays(3))
                .updatedAt(now.minusDays(2))
                .items(new ArrayList<>())
                .build();
        order7.getItems().add(OrderItem.builder().order(order7).part(parts.get(8)).quantity(2).unitPrice(new BigDecimal("7800")).build());

        // Order 8 — PURCHASE, PENDING, today
        Order order8 = Order.builder()
                .orderNumber("#ORD-9834")
                .orderType("PURCHASE")
                .status("PENDING")
                .totalAmount(new BigDecimal("67200"))
                .supplier(suppliers.get(6))
                .notes("Valeo AC compressors and clutch kits restocking")
                .createdAt(now)
                .updatedAt(now)
                .items(new ArrayList<>())
                .build();
        order8.getItems().add(OrderItem.builder().order(order8).part(parts.get(7)).quantity(2).unitPrice(new BigDecimal("22500")).build());
        order8.getItems().add(OrderItem.builder().order(order8).part(parts.get(15)).quantity(1).unitPrice(new BigDecimal("15800")).build());

        // Order 9 — SALES, DELIVERED, 10 days ago
        Order order9 = Order.builder()
                .orderNumber("#ORD-9833")
                .orderType("SALES")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("56000"))
                .customer(customers.get(0))
                .notes("Spark plugs and ignition coil packs")
                .createdAt(now.minusDays(10))
                .updatedAt(now.minusDays(8))
                .items(new ArrayList<>())
                .build();
        order9.getItems().add(OrderItem.builder().order(order9).part(parts.get(1)).quantity(5).unitPrice(new BigDecimal("7200")).build());
        order9.getItems().add(OrderItem.builder().order(order9).part(parts.get(12)).quantity(3).unitPrice(new BigDecimal("5600")).build());

        // Order 10 — PURCHASE, DELIVERED, 15 days ago
        Order order10 = Order.builder()
                .orderNumber("#ORD-9832")
                .orderType("PURCHASE")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("117000"))
                .supplier(suppliers.get(7))
                .notes("Exide batteries bulk purchase")
                .createdAt(now.minusDays(15))
                .updatedAt(now.minusDays(12))
                .items(new ArrayList<>())
                .build();
        order10.getItems().add(OrderItem.builder().order(order10).part(parts.get(8)).quantity(15).unitPrice(new BigDecimal("7800")).build());

        // Order 11 — SALES, DELIVERED, 12 days ago
        Order order11 = Order.builder()
                .orderNumber("#ORD-9831")
                .orderType("SALES")
                .status("DELIVERED")
                .totalAmount(new BigDecimal("28600"))
                .customer(customers.get(1))
                .notes("Suspension parts for SpeedWheels")
                .createdAt(now.minusDays(12))
                .updatedAt(now.minusDays(10))
                .items(new ArrayList<>())
                .build();
        order11.getItems().add(OrderItem.builder().order(order11).part(parts.get(3)).quantity(2).unitPrice(new BigDecimal("9600")).build());
        order11.getItems().add(OrderItem.builder().order(order11).part(parts.get(11)).quantity(2).unitPrice(new BigDecimal("3400")).build());

        // Order 12 — SALES, IN_TRANSIT, 6 days ago
        Order order12 = Order.builder()
                .orderNumber("#ORD-9830")
                .orderType("SALES")
                .status("IN_TRANSIT")
                .totalAmount(new BigDecimal("41800"))
                .customer(customers.get(2))
                .notes("Mixed order for KR Motors")
                .createdAt(now.minusDays(6))
                .updatedAt(now.minusDays(5))
                .items(new ArrayList<>())
                .build();
        order12.getItems().add(OrderItem.builder().order(order12).part(parts.get(17)).quantity(1).unitPrice(new BigDecimal("12800")).build());
        order12.getItems().add(OrderItem.builder().order(order12).part(parts.get(4)).quantity(2).unitPrice(new BigDecimal("14500")).build());

        // Order 13 — PURCHASE, IN_TRANSIT, 7 days ago
        Order order13 = Order.builder()
                .orderNumber("#ORD-9829")
                .orderType("PURCHASE")
                .status("IN_TRANSIT")
                .totalAmount(new BigDecimal("38400"))
                .supplier(suppliers.get(0))
                .notes("Bosch oxygen sensors and horns restock")
                .createdAt(now.minusDays(7))
                .updatedAt(now.minusDays(6))
                .items(new ArrayList<>())
                .build();
        order13.getItems().add(OrderItem.builder().order(order13).part(parts.get(28)).quantity(4).unitPrice(new BigDecimal("6200")).build());
        order13.getItems().add(OrderItem.builder().order(order13).part(parts.get(20)).quantity(8).unitPrice(new BigDecimal("1650")).build());

        // Order 14 — SALES, PENDING, 1 day ago
        Order order14 = Order.builder()
                .orderNumber("#ORD-9828")
                .orderType("SALES")
                .status("PENDING")
                .totalAmount(new BigDecimal("19000"))
                .customer(customers.get(3))
                .notes("Oil and filter service kit")
                .createdAt(now.minusDays(1))
                .updatedAt(now.minusDays(1))
                .items(new ArrayList<>())
                .build();
        order14.getItems().add(OrderItem.builder().order(order14).part(parts.get(24)).quantity(4).unitPrice(new BigDecimal("3200")).build());
        order14.getItems().add(OrderItem.builder().order(order14).part(parts.get(5)).quantity(4).unitPrice(new BigDecimal("850")).build());
        order14.getItems().add(OrderItem.builder().order(order14).part(parts.get(14)).quantity(4).unitPrice(new BigDecimal("1200")).build());

        orderRepository.saveAll(List.of(order1, order2, order3, order4, order5, order6,
                order7, order8, order9, order10, order11, order12, order13, order14));

        log.info("Seeded 14 orders with items");
    }
}
