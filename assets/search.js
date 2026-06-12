(function () {
  const toggle = document.querySelector(".search-toggle");
  const panel = document.querySelector("#site-search");
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");

  if (!toggle || !panel || !input || !results) return;

  let index = [];

  function render(items, query) {
    if (!query) {
      results.innerHTML = "";
      return;
    }

    if (!items.length) {
      results.innerHTML = '<p class="search-empty">No matches.</p>';
      return;
    }

    results.innerHTML = items
      .map((item) => {
        const tags = item.tags.map((tag) => `<span>${tag}</span>`).join("");
        return `<a class="search-result" href="${item.url}"><strong>${item.title}</strong><small>${tags}</small></a>`;
      })
      .join("");
  }

  async function loadIndex() {
    if (index.length) return index;
    const response = await fetch("/assets/search-index.json");
    index = await response.json();
    return index;
  }

  toggle.addEventListener("click", async () => {
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    toggle.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      await loadIndex();
      input.focus();
    }
  });

  input.addEventListener("input", async () => {
    const query = input.value.trim().toLowerCase();
    const items = await loadIndex();
    const matches = items.filter((item) => {
      const haystack = [item.title, ...item.tags].join(" ").toLowerCase();
      return haystack.includes(query);
    });
    render(matches, query);
  });
})();
