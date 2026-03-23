// Mock data structure for sample parking inventory across Honolulu.
const parkingListings = [
  {
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
      <a class="button button-secondary" href="contact.html">Book Now</a>
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
  setupFaq();
  renderListings(parkingListings.slice(0, 3), "home");
  renderListings(parkingListings, "listings");
});

