document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchResultsContainer = document.getElementById("search-results");
  let debounceTimeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (query !== "") {
        try {
          const response = await fetch(
            `/api/puns/search?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          searchResultsContainer.innerHTML = "";
          data.results.forEach((result) => {
            createPunBox(result.pun, result.id, searchResultsContainer);
          });
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        searchResultsContainer.innerHTML = "";
      }
    }, 300); // Debounce timeout of 300ms
  });
});
