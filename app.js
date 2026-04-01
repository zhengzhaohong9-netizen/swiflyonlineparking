// Shared mock data for Swiftly parking inventory.
const parkingListings = [
  {
    id: "waikiki-condo",
    title: "Covered Condo Parking in Waikiki",
    area: "Waikiki",
    price: "$4/hour",
    type: "hourly",
    availability: "Available now",
    description: "Reserved covered stall near hotels, shopping, and beach access.",
    host: "Hosted by Mia L.",
    image: "parking%20picture/coverded%20condo%20parking%20in%20waikiki.jpg"
  },
  {
    id: "ala-moana-secure",
    title: "Secure Stall near Ala Moana Center",
    area: "Ala Moana",
    price: "$18/day",
    type: "daily",
    availability: "Available now",
    description: "Gated parking stall with easy walk access to Ala Moana shopping and nearby offices.",
    host: "Hosted by Kaimana Retail",
    image: "parking%20picture/secure%20stall%20near%20ala%20moana%20center.jpg"
  },
  {
    id: "uh-manoa-monthly",
    title: "Monthly Parking near UH Manoa",
    area: "University of Hawaii at Manoa",
    price: "$180/month",
    type: "monthly",
    availability: "Weekday access",
    description: "Reliable monthly stall for students, staff, or commuters who need predictable parking.",
    host: "Hosted by Leilani P.",
    image: "parking%20picture/parking%20near%20uh%20manoa.jpg"
  },
  {
    id: "downtown-office",
    title: "Downtown Covered Office Space",
    area: "Downtown Honolulu",
    price: "$5/hour",
    type: "hourly",
    availability: "Limited",
    description: "Covered daytime parking close to office towers, courts, and government buildings.",
    host: "Hosted by Harbor Plaza",
    image: "parking%20picture/dwontown%20cover%20parking.jpg"
  },
  {
    id: "kakaako-open-air",
    title: "Open-Air Stall in Kakaako",
    area: "Kakaako",
    price: "$16/day",
    type: "daily",
    availability: "Available now",
    description: "Simple all-day parking near restaurants, art walls, cafes, and the waterfront.",
    host: "Hosted by Hana T.",
    image: "parking%20picture/open%20air%20stall%20in%20kakaako.jpg"
  },
  {
    id: "waikiki-evening",
    title: "Evening Parking near Waikiki Strip",
    area: "Waikiki",
    price: "$22/day",
    type: "daily",
    availability: "Weekday access",
    description: "Great for dinner, nightlife, and evening beach visits with a reserved private stall.",
    host: "Hosted by Royal Sunset Suites",
    image: "parking%20picture/evening%20parking%20near%20waikiki%20strip.jpg"
  }
];

function getListingById(listingId) {
  return parkingListings.find((listing) => listing.id === listingId) || parkingListings[0];
}

function getCheckoutLink(listing) {
  return `checkout.html?listing=${encodeURIComponent(listing.id)}`;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function parseListingRate(priceLabel) {
  const numericValue = Number.parseFloat(String(priceLabel).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getCheckoutConfig(listing) {
  const rate = parseListingRate(listing.price);

  if (listing.type === "hourly") {
    return {
      rate,
      unitLabel: "Hours",
      unitLabelSingular: "hour",
      unitLabelPlural: "hours",
      bookingType: "Hourly booking",
      defaultQuantity: 3,
      rateLabel: `${formatCurrency(rate)}/hour`
    };
  }

  if (listing.type === "monthly") {
    return {
      rate,
      unitLabel: "Months",
      unitLabelSingular: "month",
      unitLabelPlural: "months",
      bookingType: "Monthly booking",
      defaultQuantity: 1,
      rateLabel: `${formatCurrency(rate)}/month`
    };
  }

  return {
    rate,
    unitLabel: "Days",
    unitLabelSingular: "day",
    unitLabelPlural: "days",
    bookingType: "Daily booking",
    defaultQuantity: 1,
    rateLabel: `${formatCurrency(rate)}/day`
  };
}

function getCheckoutSummary(listing, quantity) {
  const config = getCheckoutConfig(listing);
  const parsedQuantity = Number.parseInt(quantity, 10);
  const safeQuantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : config.defaultQuantity;
  const subtotal = Number((config.rate * safeQuantity).toFixed(2));
  const tax = Number((subtotal * 0.04712).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  const unit = safeQuantity === 1 ? config.unitLabelSingular : config.unitLabelPlural;

  return {
    bookingType: config.bookingType,
    summaryNote: `${safeQuantity} ${unit} reserved at ${config.rateLabel}`,
    quantityLabel: `${safeQuantity} ${unit}`,
    rateLabel: config.rateLabel,
    priceLabel: formatCurrency(subtotal),
    taxLabel: formatCurrency(tax),
    total: formatCurrency(total),
    quantityValue: safeQuantity,
    quantityInputLabel: config.unitLabel
  };
}

function createListingCard(listing) {
  const article = document.createElement("article");
  article.className = "surface-card listing-card";
  article.innerHTML = `
    <div class="listing-card-media">
      <img src="${listing.image}" alt="Parking listing photo for ${listing.title}">
    </div>
    <div class="listing-card-header">
      <div>
        <p class="mini-label">${listing.area}</p>
        <h3>${listing.title}</h3>
      </div>
      <span class="listing-badge">${listing.availability}</span>
    </div>
    <p>${listing.description}</p>
    <div class="listing-meta">
      <span class="listing-meta-chip">${listing.type}</span>
      <span class="listing-meta-chip listing-meta-host">${listing.host}</span>
    </div>
    <div class="listing-card-header listing-card-footer">
      <div>
        <div class="listing-price">${listing.price}</div>
        <span class="listing-price-note">Instant request preview</span>
      </div>
      <a class="button button-secondary" href="${getCheckoutLink(listing)}">Book Now</a>
    </div>
  `;
  return article;
}

function renderListings(listings, gridName) {
  const grid = document.querySelector(`[data-listing-grid="${gridName}"]`);
  if (!grid) return;

  grid.innerHTML = "";
  listings.forEach((listing) => grid.appendChild(createListingCard(listing)));

  const count = document.querySelector("#results-count");
  if (count && gridName === "locations") {
    count.textContent = `Showing ${listings.length} listing${listings.length === 1 ? "" : "s"}`;
  }
}

function setupSearch() {
  const form = document.querySelector("[data-search-form]");
  if (!form) return;

  const locationInput = form.querySelector('input[name="location"]');
  const typeInput = form.querySelector('select[name="type"]');
  const availabilityInput = form.querySelector('select[name="availability"]');

  const filterListings = () => {
    const locationValue = locationInput.value.trim().toLowerCase();
    const typeValue = typeInput.value;
    const availabilityValue = availabilityInput.value;

    const filtered = parkingListings.filter((listing) => {
      const matchesLocation =
        !locationValue ||
        listing.area.toLowerCase().includes(locationValue) ||
        listing.title.toLowerCase().includes(locationValue);
      const matchesType = typeValue === "all" || listing.type === typeValue;
      const matchesAvailability = availabilityValue === "all" || listing.availability === availabilityValue;
      return matchesLocation && matchesType && matchesAvailability;
    });

    renderListings(filtered, "locations");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterListings();
  });

  document.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      locationInput.value = button.dataset.tag || "";
      filterListings();
    });
  });

  renderListings(parkingListings, "locations");
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function formatMailtoBody(form) {
  const formData = new FormData(form);
  const fields = [
    ["Full Name", formData.get("fullName")],
    ["Email", formData.get("email")],
    ["Phone Number", formData.get("phone")],
    ["Parking Address / Location", formData.get("address")],
    ["Type of Space", formData.get("spaceType")],
    ["Availability", formData.get("availability")],
    ["Price", formData.get("price")],
    ["Additional Notes", formData.get("notes") || "None provided"]
  ];

  return fields.map(([label, value]) => `${label}: ${value || ""}`).join("\n");
}

function setupForms() {
  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector("[data-form-message]");
      const mailtoAddress = form.dataset.mailto;
      const successMessage = form.dataset.formSuccess || "Thanks. This demo form has been submitted successfully.";

      if (mailtoAddress) {
        const subject = encodeURIComponent("Swiftly Host Application");
        const body = encodeURIComponent(formatMailtoBody(form));
        window.location.href = `mailto:${mailtoAddress}?subject=${subject}&body=${body}`;
      }

      if (message) {
        message.textContent = successMessage;
      }

      form.reset();
    });
  });
}

function setupCheckout() {
  const page = document.querySelector("[data-checkout-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const listing = getListingById(params.get("listing"));

  const image = page.querySelector("[data-checkout-image]");
  const title = page.querySelector("[data-checkout-title]");
  const area = page.querySelector("[data-checkout-area]");
  const host = page.querySelector("[data-checkout-host]");
  const type = page.querySelector("[data-checkout-type]");
  const rate = page.querySelector("[data-checkout-rate]");
  const quantitySummary = page.querySelector("[data-checkout-quantity-summary]");
  const price = page.querySelector("[data-checkout-price]");
  const tax = page.querySelector("[data-checkout-tax]");
  const total = page.querySelector("[data-checkout-total]");
  const note = page.querySelector("[data-checkout-note]");
  const bookingLabel = page.querySelector("[data-checkout-booking-label]");
  const quantityInput = page.querySelector("[data-checkout-quantity]");
  const quantityLabel = page.querySelector("[data-checkout-quantity-label]");
  const quantityHint = page.querySelector("[data-checkout-quantity-hint]");
  const form = page.querySelector("[data-checkout-form]");
  const success = page.querySelector("[data-checkout-success]");

  const config = getCheckoutConfig(listing);

  const updateSummary = () => {
    const summary = getCheckoutSummary(listing, quantityInput ? quantityInput.value : config.defaultQuantity);

    if (type) type.textContent = summary.bookingType;
    if (rate) rate.textContent = summary.rateLabel;
    if (quantitySummary) quantitySummary.textContent = summary.quantityLabel;
    if (price) price.textContent = summary.priceLabel;
    if (tax) tax.textContent = summary.taxLabel;
    if (total) total.textContent = summary.total;
    if (bookingLabel) bookingLabel.textContent = summary.summaryNote;
    if (quantityInput) quantityInput.value = String(summary.quantityValue);
  };

  if (image) {
    image.src = listing.image;
    image.alt = `Checkout image for ${listing.title}`;
  }
  if (title) title.textContent = listing.title;
  if (area) area.textContent = listing.area;
  if (host) host.textContent = listing.host;
  if (note) note.textContent = "This is a simulated checkout page.";

  if (quantityLabel) {
    quantityLabel.textContent = `How many ${config.unitLabel.toLowerCase()} would you like to book?`;
  }

  if (quantityHint) {
    quantityHint.textContent = `This listing is billed at ${config.rateLabel}.`;
  }

  if (quantityInput) {
    quantityInput.min = "1";
    quantityInput.step = "1";
    quantityInput.value = String(config.defaultQuantity);
    quantityInput.addEventListener("input", updateSummary);
    quantityInput.addEventListener("change", updateSummary);
  }

  updateSummary();

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateSummary();
      if (success) {
        const finalSummary = getCheckoutSummary(listing, quantityInput ? quantityInput.value : config.defaultQuantity);
        success.textContent = `Booking completed successfully for ${listing.title} (${finalSummary.quantityLabel}).`;
      }
      form.reset();
      if (quantityInput) {
        quantityInput.value = String(config.defaultQuantity);
      }
      updateSummary();
    });
  }
}

function setupFaq() {
  document.querySelectorAll(".faq-item").forEach((item, index) => {
    if (index === 0) {
      item.classList.add("is-open");
    }

    const trigger = item.querySelector(".faq-question");
    if (trigger) {
      trigger.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupSearch();
  setupForms();
  setupCheckout();
  setupFaq();
  renderListings(parkingListings.slice(0, 3), "home");
  renderListings(parkingListings, "listings");
});

