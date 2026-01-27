(function () {
  "use strict";

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve) {
      fallbackCopy(text);
      resolve();
    });
  }

  function getCodeText(pre) {
    var code = pre.querySelector("code");
    var text = code ? code.innerText : pre.innerText;
    return text.replace(/\n$/, "");
  }

  function addCopyButton(pre) {
    if (!pre || pre.dataset.copyCodeReady === "true") {
      return;
    }

    pre.dataset.copyCodeReady = "true";
    pre.classList.add("copy-code-block");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-button";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.textContent = "Copy";

    button.addEventListener("click", function () {
      var text = getCodeText(pre);

      copyToClipboard(text)
        .then(function () {
          button.textContent = "Copied";
          button.classList.add("is-copied");
          window.setTimeout(function () {
            button.textContent = "Copy";
            button.classList.remove("is-copied");
          }, 1500);
        })
        .catch(function () {
          button.textContent = "Error";
          window.setTimeout(function () {
            button.textContent = "Copy";
          }, 1500);
        });
    });

    pre.appendChild(button);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var selectors = [
      "div.highlighter-rouge pre",
      "figure.highlight pre",
      "pre.highlight",
      ".page__content pre"
    ];
    var blocks = document.querySelectorAll(selectors.join(","));

    blocks.forEach(function (pre) {
      if (!pre.closest(".mermaid")) {
        addCopyButton(pre);
      }
    });
  });
})();

