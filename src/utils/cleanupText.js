// src/utils/cleanupText.js

// Extracts cleaned text (for AI) and raw HTML (for chat rendering) from the editor element
export function cleanupText(editorElement) {
  if (!editorElement) {
    return { cleanText: "", rawHtml: "" };
  }

  // 1. "Bake" the Math: Force the typed values into the HTML attributes
  const mathFields = editorElement.querySelectorAll("math-field");
  mathFields.forEach((mf) => {
    const val = mf.getValue(); 
    mf.setAttribute("value", val);
    mf.setAttribute("read-only", "true");
  });

  // 2. Build the Text for AI: Manually construct the string
  let constructedText = "";
  
  editorElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      constructedText += node.textContent;
    } 
    else if (node.nodeName === "SPAN" && node.classList.contains("math-wrapper")) {
      const mf = node.querySelector("math-field");
      if (mf) {
        constructedText += ` $${mf.getValue()}$ `; // Wrap in $ for AI
      }
    }
    else if (node.nodeName === "MATH-FIELD") {
       constructedText += ` $${node.getValue()}$ `;
    }
    else {
      constructedText += node.innerText || " ";
    }
  });

  // Clean up: Remove the invisible "anchor spaces" (\u00A0) used for layout
  const cleanText = constructedText.replace(/\u00A0/g, " ").trim();
  
  // Get the HTML (now containing the "baked" math values)
  const rawHtml = editorElement.innerHTML; 

  return { cleanText, rawHtml };
}