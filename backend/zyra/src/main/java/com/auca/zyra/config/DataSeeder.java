package com.auca.zyra.config;

import com.auca.zyra.domain.*;
import com.auca.zyra.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Seeds the database with demo data on first startup.
 * Runs only when the users table is empty — safe to deploy on Render.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final MaterialRepository materialRepository;
  private final ProductRepository productRepository;
  private final StageLogRepository stageLogRepository;
  private final StoreListingRepository storeListingRepository;
  private final OrderRepository orderRepository;
  private final InquiryRepository inquiryRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (userRepository.count() > 0) {
      log.info("Database already seeded — skipping.");
      return;
    }
    log.info("Seeding database...");
    seedUsers();
    seedMaterials();
    seedProducts();
    seedOrdersAndInquiries();
    log.info("Database seeding complete.");
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  private void seedUsers() {
    createUser("admin@zyra.com",    "Admin2026!",   "Amara Diallo",    Role.ROLE_ADMIN);
    createUser("manager@zyra.com",  "Manager2026!", "Fatima Nkosi",    Role.ROLE_MANAGER);
    createUser("artisan@zyra.com",  "Artisan2026!", "Kwame Mensah",    Role.ROLE_ARTISAN);
    createUser("qa@zyra.com",       "QA2026!",      "Zara Okonkwo",    Role.ROLE_QA);
    log.info("  ✓ 4 users seeded");
  }

  private User createUser(String email, String password, String fullName, Role role) {
    User u = new User();
    u.setEmail(email);
    u.setPassword(passwordEncoder.encode(password));
    u.setFullName(fullName);
    u.setRole(role);
    return userRepository.save(u);
  }

  // ── Materials ─────────────────────────────────────────────────────────────

  private void seedMaterials() {
    createMaterial("Obsidian Full-Grain Leather", "LEATHER",  new BigDecimal("42.5"),  "meters",  new BigDecimal("10.0"),  new BigDecimal("85.00"),  "Badalassi Carlo, Tuscany");
    createMaterial("Ivory Saffiano Leather",      "LEATHER",  new BigDecimal("28.0"),  "meters",  new BigDecimal("8.0"),   new BigDecimal("72.50"),  "Conceria Walpier, Italy");
    createMaterial("Cognac Vegetable-Tan Leather","LEATHER",  new BigDecimal("7.5"),   "meters",  new BigDecimal("10.0"),  new BigDecimal("68.00"),  "Hermann Oak, USA");
    createMaterial("Antique Gold Hardware",       "HARDWARE", new BigDecimal("120.0"), "pieces",  new BigDecimal("30.0"),  new BigDecimal("4.50"),   "Riri Group, Switzerland");
    createMaterial("Brushed Silver Hardware",     "HARDWARE", new BigDecimal("85.0"),  "pieces",  new BigDecimal("25.0"),  new BigDecimal("3.80"),   "Riri Group, Switzerland");
    createMaterial("Matte Black Hardware",        "HARDWARE", new BigDecimal("22.0"),  "pieces",  new BigDecimal("30.0"),  new BigDecimal("4.20"),   "YKK, Japan");
    createMaterial("Ivory Silk Lining",           "LINING",   new BigDecimal("35.0"),  "meters",  new BigDecimal("10.0"),  new BigDecimal("18.50"),  "Taroni, Como");
    createMaterial("Obsidian Suede Lining",       "LINING",   new BigDecimal("18.0"),  "meters",  new BigDecimal("8.0"),   new BigDecimal("22.00"),  "Alcantara, Italy");
    createMaterial("Gold Waxed Thread",           "THREAD",   new BigDecimal("12.0"),  "spools",  new BigDecimal("5.0"),   new BigDecimal("9.00"),   "Fil Au Chinois, France");
    createMaterial("Black Linen Thread",          "THREAD",   new BigDecimal("3.0"),   "spools",  new BigDecimal("5.0"),   new BigDecimal("7.50"),   "Fil Au Chinois, France");
    log.info("  ✓ 10 materials seeded");
  }

  private void createMaterial(String name, String category, BigDecimal stock,
      String unit, BigDecimal threshold, BigDecimal cost, String provenance) {
    Material m = new Material();
    m.setName(name);
    m.setCategory(category);
    m.setStockQuantity(stock);
    m.setUnit(unit);
    m.setLowStockThreshold(threshold);
    m.setUnitCost(cost);
    m.setProvenance(provenance);
    materialRepository.save(m);
  }

  // ── Products + Listings ───────────────────────────────────────────────────

  private void seedProducts() {
    User admin = userRepository.findByEmail("admin@zyra.com").orElseThrow();

    // 1 — Completed & activated → store listing
    Product obsidian = createProduct("KRN-2026-001", "Obsidian Tote",        "Kigali Atelier",  ProductStage.ARCHIVE_READY, true,  new BigDecimal("485.00"), admin);
    createProduct(                   "KRN-2026-002", "Ivory Clutch",         "Kigali Atelier",  ProductStage.ARCHIVE_READY, true,  new BigDecimal("320.00"), admin);
    createProduct(                   "KRN-2026-003", "Cognac Crossbody",     "Nairobi Studio",  ProductStage.ARCHIVE_READY, true,  new BigDecimal("395.00"), admin);

    // 2 — In production at various stages
    createProduct("KRN-2026-004", "Midnight Briefcase",   "Kigali Atelier",  ProductStage.STITCHING,     false, null, admin);
    createProduct("KRN-2026-005", "Gold Minaudière",       "Lagos Workshop",  ProductStage.HARDWARE,      false, null, admin);
    createProduct("KRN-2026-006", "Ivory Shopper",         "Nairobi Studio",  ProductStage.QA,            false, null, admin);
    createProduct("KRN-2026-007", "Cognac Bucket Bag",     "Kigali Atelier",  ProductStage.CUTTING,       false, null, admin);
    createProduct("KRN-2026-008", "Obsidian Wristlet",     "Lagos Workshop",  ProductStage.STITCHING,     false, null, admin);

    // Store listings for the 3 activated bags
    StoreListing obsidianListing = createListing(obsidian,
        "Obsidian Tote — Kigali Edition",
        "Hand-stitched from full-grain Tuscan leather. Each stitch placed by a single artisan over 14 hours. The obsidian finish deepens with age.",
        new BigDecimal("1250.00"), "USD");

    Product ivory = productRepository.findBySku("KRN-2026-002").orElseThrow();
    StoreListing ivoryListing = createListing(ivory,
        "Ivory Clutch — Evening Collection",
        "Saffiano leather evening clutch with brushed gold clasp. Limited to 12 pieces per season.",
        new BigDecimal("890.00"), "USD");

    Product cognac = productRepository.findBySku("KRN-2026-003").orElseThrow();
    StoreListing cognacListing = createListing(cognac,
        "Cognac Crossbody — Heritage Line",
        "Vegetable-tanned leather that tells the story of its journey. Adjustable strap, two interior compartments.",
        new BigDecimal("975.00"), "USD");

    // Keep references for subsequent demo seeds.
    seededListings = new SeededListings(obsidianListing, ivoryListing, cognacListing);

    log.info("  ✓ 8 products + 3 store listings seeded");
  }

  private Product createProduct(String sku, String name, String site,
      ProductStage stage, boolean activated, BigDecimal cost, User signedBy) {
    Product p = new Product();
    p.setSku(sku);
    p.setName(name);
    p.setAtelierSite(site);
    p.setCurrentStage(stage);
    p.setActivated(activated);
    p.setMaterialCost(cost);
    if (stage == ProductStage.ARCHIVE_READY) {
      p.setCompletedAt(Instant.now());
    }
    productRepository.save(p);

    // Add a stage log entry so the audit trail isn't empty
    StageLog log = new StageLog();
    log.setProduct(p);
    log.setSignedBy(signedBy);
    log.setStage(ProductStage.CUTTING);
    log.setNotes("Initial stage — seeded");
    stageLogRepository.save(log);

    return p;
  }

  private StoreListing createListing(Product product, String title, String description,
      BigDecimal price, String currency) {
    StoreListing l = new StoreListing();
    l.setProduct(product);
    l.setTitle(title);
    l.setDescription(description);
    l.setPrice(price);
    l.setCurrency(currency);
    l.setAvailable(true);
    return storeListingRepository.save(l);
  }

  private void seedOrdersAndInquiries() {
    if (seededListings == null) {
      seededListings = new SeededListings(
          storeListingRepository.findByProductId(productRepository.findBySku("KRN-2026-001").orElseThrow().getId()).orElseThrow(),
          storeListingRepository.findByProductId(productRepository.findBySku("KRN-2026-002").orElseThrow().getId()).orElseThrow(),
          storeListingRepository.findByProductId(productRepository.findBySku("KRN-2026-003").orElseThrow().getId()).orElseThrow());
    }

    createOrder("ORD-2026-0001", seededListings.obsidianListing, "Amina N'Goma", "amina.ngoma@example.com", "+250788111222",
        "DELIVERY", "Kigali Heights", "Kigali", "Rwanda", "00000",
        "Please gift-wrap the tote and include a handwritten card.", new BigDecimal("1250.00"), "USD", OrderStatus.CONFIRMED);
    createOrder("ORD-2026-0002", seededListings.ivoryListing, "Lillian Mbeki", "lillian.mbeki@example.com", "+260977222333",
        "PICKUP", null, null, null, null,
        "Pickup during business hours if possible.", new BigDecimal("890.00"), "USD", OrderStatus.PENDING);
    createOrder("ORD-2026-0003", seededListings.cognacListing, "Daniel Otieno", "daniel.otieno@example.com", "+254712333444",
        "DELIVERY", "Westlands", "Nairobi", "Kenya", "00600",
        "Handle with care, this is for an anniversary gift.", new BigDecimal("975.00"), "USD", OrderStatus.SHIPPED);

    createInquiry(seededListings.obsidianListing, "Mia Uwase", "mia.uwase@example.com", "+250788444555",
        "Is the Obsidian Tote available in a slightly larger size? I love the finish and want to know if custom sizing is possible.",
        null, null, "OPEN");
    createInquiry(seededListings.ivoryListing, "Nadia Hassan", "nadia.hassan@example.com", "+255746555666",
        "What is the expected lead time for the Ivory Clutch if I place an order this week?",
        "Yes, the current lead time is 10 to 14 business days. We can also prioritize it for special events.",
        Instant.now(), "CLOSED");
    createInquiry(seededListings.cognacListing, "Ethan Moyo", "ethan.moyo@example.com", null,
        "Do you offer a matching travel pouch with the Cognac Crossbody?",
        null, null, "OPEN");

    log.info("  ✓ 3 orders + 3 inquiries seeded");
  }

  private Order createOrder(String reference, StoreListing listing, String customerName, String customerEmail,
      String customerPhone, String deliveryMethod, String deliveryAddress, String deliveryCity,
      String deliveryCountry, String postalCode, String notes, BigDecimal totalAmount, String currency,
      OrderStatus status) {
    Order order = new Order();
    order.setReference(reference);
    order.setListing(listing);
    order.setCustomerName(customerName);
    order.setCustomerEmail(customerEmail);
    order.setCustomerPhone(customerPhone);
    order.setDeliveryMethod(deliveryMethod);
    order.setDeliveryAddress(deliveryAddress);
    order.setDeliveryCity(deliveryCity);
    order.setDeliveryCountry(deliveryCountry);
    order.setPostalCode(postalCode);
    order.setNotes(notes);
    order.setTotalAmount(totalAmount);
    order.setCurrency(currency);
    order.setStatus(status);
    return orderRepository.save(order);
  }

  private Inquiry createInquiry(StoreListing listing, String senderName, String senderEmail, String senderPhone,
      String message, String reply, Instant repliedAt, String status) {
    Inquiry inquiry = new Inquiry();
    inquiry.setListing(listing);
    inquiry.setSenderName(senderName);
    inquiry.setSenderEmail(senderEmail);
    inquiry.setSenderPhone(senderPhone);
    inquiry.setMessage(message);
    inquiry.setReply(reply);
    inquiry.setRepliedAt(repliedAt);
    inquiry.setStatus(status);
    return inquiryRepository.save(inquiry);
  }

  private SeededListings seededListings;

  private record SeededListings(StoreListing obsidianListing, StoreListing ivoryListing, StoreListing cognacListing) {}
}
