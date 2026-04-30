package com.auca.zyra.config;

import com.auca.zyra.domain.Inquiry;
import com.auca.zyra.domain.Material;
import com.auca.zyra.domain.Order;
import com.auca.zyra.domain.OrderStatus;
import com.auca.zyra.domain.Product;
import com.auca.zyra.domain.ProductStage;
import com.auca.zyra.domain.Role;
import com.auca.zyra.domain.StageLog;
import com.auca.zyra.domain.StoreListing;
import com.auca.zyra.domain.User;
import com.auca.zyra.repository.InquiryRepository;
import com.auca.zyra.repository.MaterialRepository;
import com.auca.zyra.repository.OrderRepository;
import com.auca.zyra.repository.ProductRepository;
import com.auca.zyra.repository.StageLogRepository;
import com.auca.zyra.repository.StoreListingRepository;
import com.auca.zyra.repository.UserRepository;
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
 * Seeds demo data for local development and deployments.
 * Core users and materials are created once. Orders and inquiries are backfilled
 * whenever they are missing so demo environments never look empty.
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
    log.info("Checking demo data...");
    seedUsersIfMissing();
    seedMaterialsIfMissing();
    seedProductsIfMissing();
    seedOrdersAndInquiriesIfMissing();
    log.info("Demo data check complete.");
  }

  private void seedUsersIfMissing() {
    if (userRepository.count() > 0) {
      return;
    }
    createUser("admin@zyra.com", "Admin2026!", "Amara Diallo", Role.ROLE_ADMIN);
    createUser("manager@zyra.com", "Manager2026!", "Fatima Nkosi", Role.ROLE_MANAGER);
    createUser("artisan@zyra.com", "Artisan2026!", "Kwame Mensah", Role.ROLE_ARTISAN);
    createUser("qa@zyra.com", "QA2026!", "Zara Okonkwo", Role.ROLE_QA);
    log.info("  4 users seeded");
  }

  private User createUser(String email, String password, String fullName, Role role) {
    User u = new User();
    u.setEmail(email);
    u.setPassword(passwordEncoder.encode(password));
    u.setFullName(fullName);
    u.setRole(role);
    return userRepository.save(u);
  }

  private User ensureUser(String email, String password, String fullName, Role role) {
    return userRepository.findByEmail(email)
        .orElseGet(() -> createUser(email, password, fullName, role));
  }

  private void seedMaterialsIfMissing() {
    if (materialRepository.count() > 0) {
      return;
    }
    createMaterial("Obsidian Full-Grain Leather", "LEATHER", new BigDecimal("42.5"), "meters", new BigDecimal("10.0"), new BigDecimal("85.00"), "Badalassi Carlo, Tuscany");
    createMaterial("Ivory Saffiano Leather", "LEATHER", new BigDecimal("28.0"), "meters", new BigDecimal("8.0"), new BigDecimal("72.50"), "Conceria Walpier, Italy");
    createMaterial("Cognac Vegetable-Tan Leather", "LEATHER", new BigDecimal("7.5"), "meters", new BigDecimal("10.0"), new BigDecimal("68.00"), "Hermann Oak, USA");
    createMaterial("Antique Gold Hardware", "HARDWARE", new BigDecimal("120.0"), "pieces", new BigDecimal("30.0"), new BigDecimal("4.50"), "Riri Group, Switzerland");
    createMaterial("Brushed Silver Hardware", "HARDWARE", new BigDecimal("85.0"), "pieces", new BigDecimal("25.0"), new BigDecimal("3.80"), "Riri Group, Switzerland");
    createMaterial("Matte Black Hardware", "HARDWARE", new BigDecimal("22.0"), "pieces", new BigDecimal("30.0"), new BigDecimal("4.20"), "YKK, Japan");
    createMaterial("Ivory Silk Lining", "LINING", new BigDecimal("35.0"), "meters", new BigDecimal("10.0"), new BigDecimal("18.50"), "Taroni, Como");
    createMaterial("Obsidian Suede Lining", "LINING", new BigDecimal("18.0"), "meters", new BigDecimal("8.0"), new BigDecimal("22.00"), "Alcantara, Italy");
    createMaterial("Gold Waxed Thread", "THREAD", new BigDecimal("12.0"), "spools", new BigDecimal("5.0"), new BigDecimal("9.00"), "Fil Au Chinois, France");
    createMaterial("Black Linen Thread", "THREAD", new BigDecimal("3.0"), "spools", new BigDecimal("5.0"), new BigDecimal("7.50"), "Fil Au Chinois, France");
    log.info("  10 materials seeded");
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

  private void seedProductsIfMissing() {
    if (productRepository.count() > 0) {
      return;
    }

    User admin = ensureUser("admin@zyra.com", "Admin2026!", "Amara Diallo", Role.ROLE_ADMIN);

    Product obsidian = createProduct("KRN-2026-001", "Obsidian Tote", "Kigali Atelier", ProductStage.ARCHIVE_READY, true, new BigDecimal("485.00"), admin);
    createProduct("KRN-2026-002", "Ivory Clutch", "Kigali Atelier", ProductStage.ARCHIVE_READY, true, new BigDecimal("320.00"), admin);
    createProduct("KRN-2026-003", "Cognac Crossbody", "Nairobi Studio", ProductStage.ARCHIVE_READY, true, new BigDecimal("395.00"), admin);

    createProduct("KRN-2026-004", "Midnight Briefcase", "Kigali Atelier", ProductStage.STITCHING, false, null, admin);
    createProduct("KRN-2026-005", "Gold Minaudiere", "Lagos Workshop", ProductStage.HARDWARE, false, null, admin);
    createProduct("KRN-2026-006", "Ivory Shopper", "Nairobi Studio", ProductStage.QA, false, null, admin);
    createProduct("KRN-2026-007", "Cognac Bucket Bag", "Kigali Atelier", ProductStage.CUTTING, false, null, admin);
    createProduct("KRN-2026-008", "Obsidian Wristlet", "Lagos Workshop", ProductStage.STITCHING, false, null, admin);

    createListing(
        obsidian,
        "Obsidian Tote - Kigali Edition",
        "Hand-stitched from full-grain Tuscan leather. Each stitch placed by a single artisan over 14 hours. The obsidian finish deepens with age.",
        new BigDecimal("1250.00"),
        "USD");

    Product ivory = productRepository.findBySku("KRN-2026-002").orElseThrow();
    createListing(
        ivory,
        "Ivory Clutch - Evening Collection",
        "Saffiano leather evening clutch with brushed gold clasp. Limited to 12 pieces per season.",
        new BigDecimal("890.00"),
        "USD");

    Product cognac = productRepository.findBySku("KRN-2026-003").orElseThrow();
    createListing(
        cognac,
        "Cognac Crossbody - Heritage Line",
        "Vegetable-tanned leather that tells the story of its journey. Adjustable strap, two interior compartments.",
        new BigDecimal("975.00"),
        "USD");

    log.info("  8 products + 3 store listings seeded");
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

    StageLog stageLog = new StageLog();
    stageLog.setProduct(p);
    stageLog.setSignedBy(signedBy);
    stageLog.setStage(ProductStage.CUTTING);
    stageLog.setNotes("Initial stage - seeded");
    stageLogRepository.save(stageLog);

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

  private void seedOrdersAndInquiriesIfMissing() {
    SeededListings listings = ensureDemoListings();
    boolean anySeeded = false;

    if (orderRepository.count() == 0) {
      createOrder("ORD-2026-0001", listings.obsidianListing, "Amina N'Goma", "amina.ngoma@example.com", "+250788111222",
          "DELIVERY", "Kigali Heights", "Kigali", "Rwanda", "00000",
          "Please gift-wrap the tote and include a handwritten card.", new BigDecimal("1250.00"), "USD", OrderStatus.CONFIRMED);
      createOrder("ORD-2026-0002", listings.ivoryListing, "Lillian Mbeki", "lillian.mbeki@example.com", "+260977222333",
          "PICKUP", null, null, null, null,
          "Pickup during business hours if possible.", new BigDecimal("890.00"), "USD", OrderStatus.PENDING);
      createOrder("ORD-2026-0003", listings.cognacListing, "Daniel Otieno", "daniel.otieno@example.com", "+254712333444",
          "DELIVERY", "Westlands", "Nairobi", "Kenya", "00600",
          "Handle with care, this is for an anniversary gift.", new BigDecimal("975.00"), "USD", OrderStatus.SHIPPED);
      log.info("  3 demo orders seeded");
      anySeeded = true;
    }

    if (inquiryRepository.count() == 0) {
      createInquiry(listings.obsidianListing, "Mia Uwase", "mia.uwase@example.com", "+250788444555",
          "Is the Obsidian Tote available in a slightly larger size? I love the finish and want to know if custom sizing is possible.",
          null, null, "OPEN");
      createInquiry(listings.ivoryListing, "Nadia Hassan", "nadia.hassan@example.com", "+255746555666",
          "What is the expected lead time for the Ivory Clutch if I place an order this week?",
          "Yes, the current lead time is 10 to 14 business days. We can also prioritize it for special events.",
          Instant.now(), "CLOSED");
      createInquiry(listings.cognacListing, "Ethan Moyo", "ethan.moyo@example.com", null,
          "Do you offer a matching travel pouch with the Cognac Crossbody?",
          null, null, "OPEN");
      log.info("  3 demo inquiries seeded");
      anySeeded = true;
    }

    if (!anySeeded) {
      log.info("  Demo orders and inquiries already present");
    }
  }

  private SeededListings ensureDemoListings() {
    StoreListing obsidianListing = ensureListing(
        "KRN-2026-001",
        "Obsidian Tote",
        "Kigali Atelier",
        ProductStage.ARCHIVE_READY,
        true,
        new BigDecimal("485.00"),
        "Obsidian Tote - Kigali Edition",
        "Hand-stitched from full-grain Tuscan leather. Each stitch placed by a single artisan over 14 hours. The obsidian finish deepens with age.",
        new BigDecimal("1250.00"),
        "USD");

    StoreListing ivoryListing = ensureListing(
        "KRN-2026-002",
        "Ivory Clutch",
        "Kigali Atelier",
        ProductStage.ARCHIVE_READY,
        true,
        new BigDecimal("320.00"),
        "Ivory Clutch - Evening Collection",
        "Saffiano leather evening clutch with brushed gold clasp. Limited to 12 pieces per season.",
        new BigDecimal("890.00"),
        "USD");

    StoreListing cognacListing = ensureListing(
        "KRN-2026-003",
        "Cognac Crossbody",
        "Nairobi Studio",
        ProductStage.ARCHIVE_READY,
        true,
        new BigDecimal("395.00"),
        "Cognac Crossbody - Heritage Line",
        "Vegetable-tanned leather that tells the story of its journey. Adjustable strap, two interior compartments.",
        new BigDecimal("975.00"),
        "USD");

    return new SeededListings(obsidianListing, ivoryListing, cognacListing);
  }

  private StoreListing ensureListing(String sku, String productName, String atelierSite,
      ProductStage stage, boolean activated, BigDecimal materialCost,
      String title, String description, BigDecimal price, String currency) {
    Product product = productRepository.findBySku(sku)
        .orElseGet(() -> createProduct(sku, productName, atelierSite, stage, activated, materialCost, ensureUser("admin@zyra.com", "Admin2026!", "Amara Diallo", Role.ROLE_ADMIN)));

    return storeListingRepository.findByProductId(product.getId())
        .orElseGet(() -> createListing(product, title, description, price, currency));
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

  private record SeededListings(StoreListing obsidianListing, StoreListing ivoryListing, StoreListing cognacListing) {}
}
