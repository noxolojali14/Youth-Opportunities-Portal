(function () {
  "use strict";

  const DATA_PATH = "../data/opportunities.json";

  function showStatus(container, title, message, isError) {
    const role = isError ? "alert" : "status";
    container.innerHTML = `
      <div class="status-box" role="${role}" aria-live="polite">
        <span class="status-icon" aria-hidden="true"><i class="fa-solid ${isError ? "fa-triangle-exclamation" : "fa-circle-info"}"></i></span>
        <h3 class="status-title">${escapeHtml(title)}</h3>
        <p class="status-text">${escapeHtml(message)}</p>
      </div>`;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entities[character];
    });
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "Not specified";
    }
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return "Not specified";
    }
    return new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function getToday() {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }

  async function loadOpportunityData() {
    const response = await fetch(DATA_PATH);
    if (!response.ok) {
      throw new Error(`Opportunity data could not be loaded (HTTP ${response.status}).`);
    }

    const opportunities = await response.json();
    if (!Array.isArray(opportunities)) {
      throw new Error("Opportunity data must be a JSON list.");
    }
    return opportunities;
  }

  function setupMobileNavigation() {
    const toggle = document.getElementById("mobile-nav-toggle");
    const drawer = document.getElementById("mobile-drawer");
    if (!toggle || !drawer) {
      return;
    }

    function closeMenu() {
      drawer.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      const isOpen = drawer.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function renderFeatured(opportunities) {
    const grid = document.getElementById("featured-grid");
    if (!grid) {
      return;
    }

    const featured = opportunities
      .filter(function (opportunity) {
        return !opportunity.closingDate || opportunity.closingDate >= getToday();
      })
      .sort(function (first, second) {
        if (!first.closingDate) return 1;
        if (!second.closingDate) return -1;
        return first.closingDate.localeCompare(second.closingDate);
      })
      .slice(0, 3);

    if (featured.length === 0) {
      showStatus(grid, "No featured opportunities", "Please check back later for new listings.", false);
      return;
    }

    grid.innerHTML = featured.map(function (opportunity) {
      return `
        <article class="opportunity-card">
          <div>
            <div class="card-top">
              <span class="category-pill">${escapeHtml(opportunity.category)}</span>
              ${opportunity.sample ? '<span class="demo-tag">DEMO LISTING</span>' : ""}
            </div>
            <h3 class="card-title">${escapeHtml(opportunity.title)}</h3>
            <p class="card-org">${escapeHtml(opportunity.organisation)}</p>
            <ul class="card-meta-list">
              <li>${escapeHtml(opportunity.location)}</li>
              ${opportunity.closingDate ? `<li>Closes ${escapeHtml(formatDate(opportunity.closingDate))}</li>` : ""}
            </ul>
          </div>
          <a class="btn btn-outline" href="opportunities.html?search=${encodeURIComponent(opportunity.title)}">
            View Opportunity
          </a>
        </article>`;
    }).join("");
  }

  function loadFeatured(grid) {
    showStatus(grid, "Loading opportunities...", "Please wait while the opportunity list is loaded.", false);
    loadOpportunityData()
      .then(renderFeatured)
      .catch(function (error) {
        console.error("Unable to display featured opportunities:", error);
        showStatus(
          grid,
          "Opportunities are temporarily unavailable",
          "The opportunity list could not be loaded. Please check that Live Server is running from the project folder and try again.",
          true
        );
      });
  }

  function setupHomepageSearch() {
    const form = document.querySelector(".hero-search-form");
    const input = document.getElementById("hero-search");
    if (!form || !input) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const destination = new URL("opportunities.html", window.location.href);
      const search = input.value.trim();
      if (search) {
        destination.searchParams.set("search", search);
      }
      window.location.assign(destination.href);
    });
  }

  function setupApplicantWarning() {
    const toggle = document.getElementById("applicant-warning-toggle");
    const panel = document.getElementById("applicant-warning-panel");
    const closeButton = panel && panel.querySelector(".applicant-warning-close");
    if (!toggle || !panel || !closeButton) {
      return;
    }

    function closeWarning(restoreFocus) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      closeButton.focus();
    });

    closeButton.addEventListener("click", function () {
      closeWarning(true);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closeWarning(true);
      }
    });
  }

  window.loadOpportunityData = loadOpportunityData;
  window.opportunityHelpers = {
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    getToday: getToday,
    showStatus: showStatus
  };

  setupMobileNavigation();
  setupHomepageSearch();
  setupApplicantWarning();

  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    loadFeatured(featuredGrid);
  }
}());
