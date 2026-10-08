(function () {
  "use strict";

  const catalog = document.getElementById("catalog-grid");
  const details = document.getElementById("details-content");
  const helpers = window.opportunityHelpers;

  if ((!catalog && !details) || !helpers || typeof window.loadOpportunityData !== "function") {
    return;
  }

  function getValidApplicationUrl(opportunity) {
    if (opportunity.sample
      || (opportunity.closingDate && opportunity.closingDate < helpers.getToday())
      || typeof opportunity.applicationLink !== "string") {
      return null;
    }

    try {
      const url = new URL(opportunity.applicationLink);
      if ((url.protocol !== "https:" && url.protocol !== "http:")
        || url.username
        || url.password) {
        return null;
      }
      return url.href;
    } catch {
      return null;
    }
  }

  function renderApplicationAction(opportunity) {
    const url = getValidApplicationUrl(opportunity);
    if (url) {
      return `<a class="btn btn-primary apply-button" href="${helpers.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Apply Now</a>`;
    }

    const message = opportunity.sample
      ? "Fictional demonstration listing — there is no real application link."
      : "Application link currently unavailable.";
    return `<div class="application-action"><button class="btn btn-primary apply-button" type="button" disabled aria-describedby="application-note">Apply Now</button><p class="application-unavailable" id="application-note" role="note">${helpers.escapeHtml(message)}</p></div>`;
  }

  function renderOpportunityCard(opportunity) {
    const detailsUrl = `details.html?id=${encodeURIComponent(opportunity.id)}`;
    const closingDate = opportunity.closingDate
      ? helpers.formatDate(opportunity.closingDate)
      : "Not specified";
    const description = opportunity.description || "Description not specified.";

    return `
      <article class="opportunity-card">
        <div>
          <div class="card-top">
            <span class="category-pill">${helpers.escapeHtml(opportunity.category)}</span>
            ${opportunity.sample ? '<span class="demo-tag">DEMO LISTING</span>' : ""}
          </div>
          <h2 class="card-title">${helpers.escapeHtml(opportunity.title)}</h2>
          <p class="card-org">${helpers.escapeHtml(opportunity.organisation)}</p>
          <ul class="card-meta-list">
            <li><strong>Location:</strong> ${helpers.escapeHtml(opportunity.location || "Not specified")}</li>
            <li><strong>Closes:</strong> ${helpers.escapeHtml(closingDate)}</li>
            <li><strong>Experience:</strong> ${helpers.escapeHtml(opportunity.experience || "Not specified")}</li>
            <li><strong>Updated:</strong> ${helpers.escapeHtml(helpers.formatDate(opportunity.updated))}</li>
          </ul>
          <p class="card-desc">${helpers.escapeHtml(description)}</p>
        </div>
        <div class="opportunity-actions">
          <a class="btn btn-outline" href="${detailsUrl}">View Details</a>
          ${renderApplicationAction(opportunity)}
        </div>
      </article>`;
  }

  function renderCatalog(opportunities) {
    const keyword = document.getElementById("search-input").value.trim().toLowerCase();
    const category = document.getElementById("filter-category").value;
    const location = document.getElementById("filter-location").value;
    const closingBy = document.getElementById("filter-closing-date").value;
    const sortBy = document.getElementById("filter-sort").value;
    const today = helpers.getToday();

    const matches = opportunities.filter(function (opportunity) {
      const searchableText = [
        opportunity.title,
        opportunity.organisation,
        opportunity.category,
        opportunity.location,
        opportunity.description,
        opportunity.qualification,
        opportunity.experience
      ].join(" ").toLowerCase();

      return (!opportunity.closingDate || opportunity.closingDate >= today)
        && (!keyword || searchableText.includes(keyword))
        && (category === "All" || opportunity.category === category)
        && (location === "All" || opportunity.location === location)
        && (!closingBy || (opportunity.closingDate && opportunity.closingDate <= closingBy));
    });

    matches.sort(function (first, second) {
      if (sortBy === "az") {
        return first.title.localeCompare(second.title);
      }
      if (sortBy === "closingSoon") {
        if (!first.closingDate) return 1;
        if (!second.closingDate) return -1;
        return first.closingDate.localeCompare(second.closingDate);
      }
      return (second.updated || "").localeCompare(first.updated || "");
    });

    document.getElementById("results-count").textContent =
      `Showing ${matches.length} ${matches.length === 1 ? "opportunity" : "opportunities"}`;

    if (matches.length === 0) {
      helpers.showStatus(catalog, "No opportunities found", "No opportunities found. Try changing your search or filters.", false);
      return;
    }
    catalog.innerHTML = matches.map(renderOpportunityCard).join("");
  }

  function renderDetails(opportunities) {
    const opportunityId = new URLSearchParams(window.location.search).get("id");
    const opportunity = opportunities.find(function (item) {
      return item.id === opportunityId;
    });

    if (!opportunity) {
      helpers.showStatus(
        details,
        "Opportunity not found",
        "This listing may have been removed. Return to the opportunities page to browse available listings.",
        true
      );
      return;
    }

    const documents = Array.isArray(opportunity.documents)
      ? opportunity.documents
      : (opportunity.documents ? [opportunity.documents] : []);
    const isExpired = opportunity.closingDate && opportunity.closingDate < helpers.getToday();
    const listItems = documents.length
      ? documents.map(function (item) {
        return `<li>${helpers.escapeHtml(item)}</li>`;
      }).join("")
      : "<li>Not specified</li>";

    details.innerHTML = `
      <article class="details-box">
        <header class="details-header">
          <div class="card-top">
            <span class="category-pill">${helpers.escapeHtml(opportunity.category)}</span>
            ${opportunity.sample ? '<span class="demo-tag">FICTIONAL DEMONSTRATION LISTING</span>' : ""}
          </div>
          <h1 class="section-title">${helpers.escapeHtml(opportunity.title)}</h1>
          <p class="card-org">${helpers.escapeHtml(opportunity.organisation)}</p>
          <p class="card-updated">Last updated ${helpers.escapeHtml(helpers.formatDate(opportunity.updated))}</p>
        </header>
        <dl class="details-meta-grid">
          <div><dt>Location</dt><dd>${helpers.escapeHtml(opportunity.location || "Not specified")}</dd></div>
          <div><dt>Category</dt><dd>${helpers.escapeHtml(opportunity.category || "Not specified")}</dd></div>
          <div><dt>Experience</dt><dd>${helpers.escapeHtml(opportunity.experience || "Not specified")}</dd></div>
          <div><dt>Closing date</dt><dd>${helpers.escapeHtml(opportunity.closingDate ? helpers.formatDate(opportunity.closingDate) : "Not specified")}</dd></div>
        </dl>
        <section>
          <h2 class="details-section-title">About this opportunity</h2>
          <p>${helpers.escapeHtml(opportunity.description || "Not specified.")}</p>
        </section>
        <section>
          <h2 class="details-section-title">Requirements and qualifications</h2>
          <p>${helpers.escapeHtml(opportunity.qualification || "Not specified.")}</p>
        </section>
        <section>
          <h2 class="details-section-title">Documents</h2>
          <ul>${listItems}</ul>
        </section>
        ${opportunity.sample
          ? '<p class="demo-disclaimer">Fictional demonstration content. This is not a real vacancy or application.</p>'
          : ""}
        <div class="opportunity-actions">
          ${renderApplicationAction(opportunity)}
          <a class="btn btn-outline" href="opportunities.html">Back to opportunities</a>
        </div>
        ${isExpired ? '<p class="alert alert-danger expired-notice" role="status">This opportunity has expired and is not accepting applications.</p>' : ""}
      </article>`;
  }

  if (catalog) {
    const query = new URLSearchParams(window.location.search);
    const searchInput = document.getElementById("search-input");
    const categoryInput = document.getElementById("filter-category");
    searchInput.value = query.get("search") || "";

    const selectedCategory = query.get("category");
    if (selectedCategory && Array.from(categoryInput.options).some(function (option) {
      return option.value === selectedCategory;
    })) {
      categoryInput.value = selectedCategory;
    }

    const controls = [
      searchInput,
      categoryInput,
      document.getElementById("filter-location"),
      document.getElementById("filter-closing-date"),
      document.getElementById("filter-sort")
    ];

    let opportunities = [];
    function updateResults() {
      renderCatalog(opportunities);
    }
    controls.forEach(function (control) {
      control.addEventListener("input", updateResults);
      control.addEventListener("change", updateResults);
    });
    document.getElementById("reset-filters-btn").addEventListener("click", function () {
      searchInput.value = "";
      categoryInput.value = "All";
      document.getElementById("filter-location").value = "All";
      document.getElementById("filter-closing-date").value = "";
      document.getElementById("filter-sort").value = "newest";
      updateResults();
    });

    function loadCatalog() {
      helpers.showStatus(catalog, "Loading opportunities...", "Please wait while the listings are loaded.", false);
      window.loadOpportunityData()
        .then(function (data) {
          opportunities = data;
          updateResults();
        })
        .catch(function (error) {
          console.error("Unable to load opportunities:", error);
          helpers.showStatus(
            catalog,
            "Sorry, we couldn't load the opportunities right now.",
            "Please try again later.",
            true
          );
        });
    }
    loadCatalog();
  }

  if (details) {
    helpers.showStatus(details, "Loading Opportunity Details...", "Please wait while this listing is loaded.", false);
    window.loadOpportunityData()
      .then(renderDetails)
      .catch(function (error) {
        console.error("Unable to load opportunity details:", error);
        helpers.showStatus(
          details,
          "Opportunity details are temporarily unavailable",
          "The sample listings could not be loaded. Please check that Live Server is running from the project folder and try again.",
          true
        );
      });
  }
}());
