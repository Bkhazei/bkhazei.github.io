// Mobile navigation toggle
(function () {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
    // Close the menu after tapping a link
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
      });
    });
  }

  // Events page: toggle between upcoming / past
  const tabs = document.querySelectorAll("[data-tab]");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const target = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        document.querySelectorAll("[data-events]").forEach(function (group) {
          group.hidden = group.getAttribute("data-events") !== target;
        });
      });
    });
  }

  // Keep the footer year current
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
