(() => {
  "use strict";

  const products = window.AERODEX_GAMEPASSES || {};
  const status = document.getElementById("purchase-status");
  let opening = false;

  function showStatus(message, type = "info") {
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
    status.classList.add("visible");
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(() => status.classList.remove("visible"), 5000);
  }

  function validPassId(value) {
    return /^\d+$/.test(String(value || "").trim());
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".roblox-purchase-btn");
    if (!button) return;

    event.preventDefault();
    if (opening) return;

    const key = button.dataset.productKey;
    const product = products[key];
    if (!product) {
      showStatus("This product is not configured yet.", "error");
      return;
    }

    if (!validPassId(product.passId)) {
      showStatus(`${product.title}: Game Pass ID is not configured yet.`, "error");
      button.classList.add("shake");
      window.setTimeout(() => button.classList.remove("shake"), 450);
      return;
    }

    opening = true;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Opening Roblox…";

    const url = `https://www.roblox.com/game-pass/${encodeURIComponent(product.passId)}`;
    window.location.href = url;

    showStatus(`Opening ${product.title} on Roblox (${product.robux.toLocaleString()} Robux).`, "success");
    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
      opening = false;
    }, 1200);
  });
})();
