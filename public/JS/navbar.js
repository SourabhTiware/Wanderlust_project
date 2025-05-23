  const form = document.getElementById("searchForm");
  const inp = document.getElementById("ser");

  form.addEventListener("submit", () => {
    setTimeout(() => {
      inp.value = "";
    }, 50); // Wait for request to be sent before clearing input
  });

  // Clear input if user returns via back/forward button
  window.addEventListener("pageshow", function (event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
      inp.value = "";
    }
  });