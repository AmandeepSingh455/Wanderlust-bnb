document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const dropdown = document.getElementById("search-results-dropdown");
  const listingCards = document.querySelectorAll(".listing-link[data-title]");
  const noResultsMsg = document.getElementById("no-live-results");

  if (!searchInput) return;

  let debounceTimer;

  // Real-time on-page filtering (for /listings page)
  const filterOnPageCards = (searchTerm) => {
    if (!listingCards || listingCards.length === 0) return;

    let visibleCount = 0;
    const term = searchTerm.toLowerCase().trim();

    listingCards.forEach((card) => {
      const title = card.getAttribute("data-title") || "";
      const loc = card.getAttribute("data-location") || "";
      const country = card.getAttribute("data-country") || "";
      const category = card.getAttribute("data-category") || "";

      if (
        term === "" ||
        title.includes(term) ||
        loc.includes(term) ||
        country.includes(term) ||
        category.includes(term)
      ) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display =
        visibleCount === 0 && term !== "" ? "block" : "none";
    }
  };

  // Live Dropdown Suggestions API call
  const fetchSuggestions = async (searchTerm) => {
    if (!dropdown) return;

    const term = searchTerm.trim();
    if (term.length === 0) {
      dropdown.innerHTML = "";
      dropdown.classList.add("d-none");
      return;
    }

    dropdown.innerHTML = `
      <div class="search-loading-state">
        <i class="fa-solid fa-spinner fa-spin me-2 text-danger"></i>Searching destinations...
      </div>
    `;
    dropdown.classList.remove("d-none");

    try {
      const response = await fetch(
        `/listings/search?q=${encodeURIComponent(term)}`
      );
      const results = await response.json();

      if (results.length === 0) {
        dropdown.innerHTML = `
          <div class="search-empty-state">
            <i class="fa-solid fa-circle-exclamation me-1 text-secondary"></i>No destinations found for "<b>${term}</b>"
          </div>
        `;
        return;
      }

      dropdown.innerHTML = results
        .map(
          (item) => `
          <a href="/listings/${item._id}" class="search-dropdown-item">
            <img src="${item.image}" alt="${item.title}" class="search-item-img" />
            <div class="search-item-info">
              <div class="search-item-title">${item.title}</div>
              <div class="search-item-location">
                <i class="fa-solid fa-location-dot me-1 text-danger"></i>${item.location}, ${item.country}
              </div>
            </div>
            <div class="search-item-price">
              &#8377;${Number(item.price).toLocaleString("en-IN")} <span class="fw-normal text-muted small">/night</span>
            </div>
          </a>
        `
        )
        .join("");
    } catch (err) {
      console.error("Live search error:", err);
      dropdown.classList.add("d-none");
    }
  };

  // Real-time Input listener
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value;

    // 1. Instant on-page card filter
    filterOnPageCards(val);

    // 2. Debounced dropdown suggestions
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  });

  // Re-open dropdown on focus if input has value
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length > 0 && dropdown) {
      dropdown.classList.remove("d-none");
    }
  });

  // Click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target !== searchInput
    ) {
      dropdown.classList.add("d-none");
    }
  });

  // Escape key closes dropdown
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown) {
      dropdown.classList.add("d-none");
    }
  });
});
