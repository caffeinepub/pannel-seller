import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  module PanelProduct {
    public func compare(p1 : PanelProduct, p2 : PanelProduct) : Order.Order {
      Nat.compare(p1.sortOrder, p2.sortOrder);
    };
  };

  type PanelProduct = {
    sortOrder : Nat;
    productId : Nat;
    price : Float.Float;
    name : Text;
    description : Text;
    features : [Text];
    badge : Text;
    isActive : Bool;
  };

  type Testimonial = {
    customerId : Nat;
    author : Text;
    createdAt : Time.Time;
    role : Text;
    content : Text;
    rating : Nat;
    isActive : Bool;
  };

  type SiteSettings = {
    heroTitle : Text;
    heroSubtitle : Text;
    contactEmail : Text;
    contactTelegram : Text;
  };

  var nextProductId = 1;
  var nextTestimonialId = 1;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let panelProducts = Map.empty<Nat, PanelProduct>();
  let testimonials = Map.empty<Nat, Testimonial>();
  var siteSettings : SiteSettings = {
    heroTitle = "Welcome to PanelStore";
    heroSubtitle = "Premium panels for all your needs";
    contactEmail = "contact@panelstore.com";
    contactTelegram = "https://t.me/panelstore";
  };

  // Panel Product Management

  public shared ({ caller }) func createPanelProduct(product : PanelProduct) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let productId = nextProductId;
    let newProduct : PanelProduct = {
      product with productId;
      isActive = true;
    };
    panelProducts.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updatePanelProduct(productId : Nat, product : PanelProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not panelProducts.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    let updatedProduct : PanelProduct = {
      product with productId;
    };
    panelProducts.add(productId, updatedProduct);
  };

  public shared ({ caller }) func deletePanelProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not panelProducts.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    panelProducts.remove(productId);
  };

  public query ({ caller }) func getActivePanelProducts() : async [PanelProduct] {
    panelProducts.values().toArray().filter(func(p) { p.isActive }).sort();
  };

  public query ({ caller }) func getPanelProduct(productId : Nat) : async PanelProduct {
    switch (panelProducts.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllPanelProducts() : async [PanelProduct] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    panelProducts.values().toArray().sort();
  };

  // Testimonial Management
  public shared ({ caller }) func createTestimonial(testimonial : Testimonial) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let testimonialId = nextTestimonialId;
    let newTestimonial : Testimonial = {
      testimonial with customerId = testimonialId;
      createdAt = Time.now();
      isActive = true;
    };
    testimonials.add(testimonialId, newTestimonial);
    nextTestimonialId += 1;
    testimonialId;
  };

  public shared ({ caller }) func updateTestimonial(testimonialId : Nat, testimonial : Testimonial) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not testimonials.containsKey(testimonialId)) {
      Runtime.trap("Testimonial does not exist");
    };
    let updatedTestimonial : Testimonial = {
      testimonial with customerId = testimonialId;
      createdAt = Time.now();
      isActive = true;
    };
    testimonials.add(testimonialId, updatedTestimonial);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    testimonials.values().toArray();
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    testimonials.remove(id);
  };

  public query ({ caller }) func getActiveTestimonials() : async [Testimonial] {
    testimonials.values().toArray().filter(func(t) { t.isActive });
  };

  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteSettings := settings;
  };

  // Seed data - Initialize products and testimonials
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    // Seed Products
    let basicPanelId = nextProductId;
    let basicPanel : PanelProduct = {
      productId = basicPanelId;
      name = "Basic Panel";
      description = "Essential features for small businesses";
      price = 9.99;
      features = [ "User Management", "Billing Integration" ];
      badge = "Starter";
      isActive = true;
      sortOrder = 1;
    };
    panelProducts.add(basicPanelId, basicPanel);
    nextProductId += 1;

    let proPanelId = nextProductId;
    let proPanel : PanelProduct = {
      productId = proPanelId;
      name = "Pro Panel";
      description = "Advanced features for growing startups";
      price = 24.99;
      features = [ "All Basic Features", "Analytics", "Custom Branding" ];
      badge = "Popular";
      isActive = true;
      sortOrder = 2;
    };
    panelProducts.add(proPanelId, proPanel);
    nextProductId += 1;

    let premiumPanelId = nextProductId;
    let premiumPanel : PanelProduct = {
      productId = premiumPanelId;
      name = "Premium Panel";
      description = "Full suite of features for enterprises";
      price = 49.99;
      features = [ "All Pro Features", "API Access", "24/7 Support" ];
      badge = "Best Value";
      isActive = true;
      sortOrder = 3;
    };
    panelProducts.add(premiumPanelId, premiumPanel);
    nextProductId += 1;

    let elitePanelId = nextProductId;
    let elitePanel : PanelProduct = {
      productId = elitePanelId;
      name = "Elite Panel";
      description = "Custom solutions for large organizations";
      price = 99.99;
      features = [ "All Premium Features", "Custom Integrations", "Account Manager" ];
      badge = "Elite";
      isActive = true;
      sortOrder = 4;
    };
    panelProducts.add(elitePanelId, elitePanel);
    nextProductId += 1;

    // Seed Testimonials
    let testimonial1Id = nextTestimonialId;
    let testimonial1 : Testimonial = {
      customerId = testimonial1Id;
      author = "John Doe";
      role = "CEO";
      content = "PanelStore helped me scale my business efficiently.";
      rating = 5;
      isActive = true;
      createdAt = Time.now();
    };
    testimonials.add(testimonial1Id, testimonial1);
    nextTestimonialId += 1;

    let testimonial2Id = nextTestimonialId;
    let testimonial2 : Testimonial = {
      customerId = testimonial2Id;
      author = "Jane Smith";
      role = "Entrepreneur";
      content = "Great features and excellent support!";
      rating = 4;
      isActive = true;
      createdAt = Time.now();
    };
    testimonials.add(testimonial2Id, testimonial2);
    nextTestimonialId += 1;

    let testimonial3Id = nextTestimonialId;
    let testimonial3 : Testimonial = {
      customerId = testimonial3Id;
      author = "Michael Johnson";
      role = "Startup Founder";
      content = "Highly recommend PanelStore for any growing business.";
      rating = 5;
      isActive = true;
      createdAt = Time.now();
    };
    testimonials.add(testimonial3Id, testimonial3);
    nextTestimonialId += 1;
  };
};
