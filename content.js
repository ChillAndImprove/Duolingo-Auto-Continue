console.log("🔄 Duolingo Auto-Continue Loaded");

// Function to check if a color is in the green range
function isGreenish(color) {
  if (!color) return false;

  // Extract numeric values from "rgb(...)" or "rgba(...)"
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) return false;

  const r = parseInt(match[0], 10);
  const g = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);

  // Log the extracted values for debugging
  console.log(`Computed RGB: r=${r}, g=${g}, b=${b}`);

  // Define a simple "greenish" range:
  // - The green value must be high enough (e.g., > 100)
  // - And higher than the red and blue values.
  return (g > 100 && g > r && g > b);
}

// Function to locate and click the "Continue" button
function clickContinue() {
  // Use getElementById for a reliable lookup (works even with slashes in the id)
  const footer = document.getElementById("session/PlayerFooter");
  if (!footer) {
    // Footer not found; nothing to do.
    return;
  }

  // Get and log the computed background color for debugging.
  const bgColor = window.getComputedStyle(footer).backgroundColor;
  console.log("Detected footer background color:", bgColor);

  if (isGreenish(bgColor)) {
    console.log("✅ Green background detected! Searching for 'Continue' button...");

    // Look for all button elements on the page.
    const buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
      // Use textContent to check the full text inside the button.
      const txt = button.textContent.trim();
      console.log("Examining button with text:", txt);
      if (txt.includes("Continue")) {
        console.log("➡️ Clicking 'Continue' button with text:", txt);
        button.click();
        return;
      }
    }
    console.log("❌ 'Continue' button not found!");
  }
}

// Set up a MutationObserver to watch for any changes in the page.
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    // If there are added nodes or text/attribute changes, try to click "Continue".
    if (mutation.addedNodes.length || mutation.type === "characterData" || mutation.type === "attributes") {
      clickContinue();
    }
  }
});

// Begin observing the document body for changes.
observer.observe(document.body, { 
  childList: true, 
  subtree: true, 
  characterData: true, 
  attributes: true 
});

console.log("👀 Now watching for Duolingo changes...");

// Also, run the check once immediately in case the elements are already present.
clickContinue();

