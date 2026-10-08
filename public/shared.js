// Helpers shared by both pages
const $ = id => document.getElementById(id);
// Escape text before putting it in HTML (prevents script injection)
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// JSON fetch helper; returns {ok, data}
// JSON fetch helper; returns {ok, data}
async function api(url, method = 'GET', body) {
  const opts = { method, headers: {} };
  if (method !== 'GET') {            // every write request is labeled as JSON
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body ?? {});
  }
  const res = await fetch(url, opts);
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

// Navigation 
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
  // Close menu after clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

//top 3 picks (pa-edit nalang po ito)
document.addEventListener("DOMContentLoaded", () => {
  const popularGrid = document.getElementById("popularGrid");

  if (!popularGrid) return;

  async function loadPopularRestaurants() {
    try {
      const response = await fetch("/api/restaurants");

      if (!response.ok) {
        throw new Error("Unable to load restaurants.");
      }

      const result = await response.json();

      const restaurants = Array.isArray(result)
        ? result
        : result.restaurants;

      if (!Array.isArray(restaurants)) {
        throw new Error("Invalid restaurant data.");
      }

      // Get the top 3 restaurants by rating
      const topThree = [...restaurants]
        .filter(r =>
          r.rating !== "" &&
          r.rating !== null &&
          r.rating !== undefined &&
          Number.isFinite(Number(r.rating))
        )
        .sort((a, b) =>
          Number(b.rating) - Number(a.rating) ||
          Number(a.restaurant_id ?? a.id ?? 0) -
          Number(b.restaurant_id ?? b.id ?? 0)
        )
        .slice(0, 3);

      if (topThree.length === 0) {
        popularGrid.textContent =
          "No rated restaurants to show just yet.";
        return;
      }

      popularGrid.replaceChildren();

      topThree.forEach((restaurant, index) => {
        const card = document.createElement("article");
        card.className = "popular-card";

        const rank = document.createElement("span");
        rank.className = "popular-rank";
        rank.textContent = `No. ${index + 1} Pick`;

        const name = document.createElement("h3");
        name.textContent = restaurant.name || "Unnamed Restaurant";

        const cuisine = document.createElement("span");
        cuisine.className = "popular-cuisine";
        cuisine.textContent = restaurant.cuisine || "Various Cuisine";

        const rating = document.createElement("p");
        rating.className = "popular-rating";
        rating.textContent =
          `★ ${Number(restaurant.rating).toFixed(1)} / 5`;

        const address = document.createElement("p");
        address.className = "popular-address";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-location-dot";
        icon.style.color = "black";
        icon.style.marginRight = "6px";

        address.appendChild(icon);
        address.appendChild(
        document.createTextNode(
        restaurant.address || "Location unavailable"
        ));

        const contact = document.createElement("p");
        contact.className = "popular-contact";
        contact.textContent = restaurant.contact
          ? `☎ ${restaurant.contact}`
          : "";

        card.append(rank, name, cuisine, rating, address, contact);
        popularGrid.appendChild(card);
      });

      setupPopularCarousel();

    } catch (error) {
      console.error("Error loading popular restaurants:", error);
      popularGrid.textContent =
        "Oops! We couldn't load our top picks right now. Please try again later.";
    }
  }

  loadPopularRestaurants();
});

// swipe horizontally to browse top picks
function setupPopularCarousel() {
  const grid = document.getElementById("popularGrid");
  const dotsContainer = document.getElementById("popularDots");

  if (!grid || !dotsContainer) return;

  const cards = [...grid.querySelectorAll(".popular-card")];
  dotsContainer.replaceChildren();

  if (cards.length < 2) return;

  const dots = cards.map((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "popular-dot";
    dot.setAttribute("aria-label", `Show restaurant ${index + 1}`);
    dot.addEventListener("click", () => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    });
    dotsContainer.appendChild(dot);
    return dot;
  });

  function updateDots() {
    const gridCenter = grid.getBoundingClientRect().left +
      grid.getBoundingClientRect().width / 2;

    let activeIndex = 0;
    let smallestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(gridCenter - cardCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
      dot.setAttribute("aria-current",
        index === activeIndex ? "true" : "false");
    });
  }

  grid.addEventListener("scroll", updateDots, { passive: true });
  window.addEventListener("resize", updateDots);
  updateDots();
}