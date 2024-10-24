// Reusable client side JS utils
function createPunBox(pun, id, container) {
  const punLines = pun.split("\n");
  const startLine = punLines[0];
  const punchlines = punLines.slice(1);

  const punBox = document.createElement("div");
  punBox.classList.add("pun-box");

  const punText = document.createElement("div");
  punText.classList.add("pun-text");
  punText.textContent = startLine;
  punBox.appendChild(punText);

  let punchlineTimeouts = [];
  let revealed = false;

  if (punchlines.length > 0) {
    const fistEmoji = document.createElement("div");
    fistEmoji.classList.add("fist-emoji");
    fistEmoji.textContent = "\n🥊";
    punBox.appendChild(fistEmoji);

    punBox.addEventListener("mouseover", () => {
      if (!revealed) {
        clearTimeouts(punchlineTimeouts);
        punText.textContent = startLine;
        punchlines.forEach((line, index) => {
          const timeout = setTimeout(() => {
            if (index === punchlines.length - 1) {
              fistEmoji.remove();
            }
            punText.textContent += "\n" + line;
          }, 200 * (index + 1));
          punchlineTimeouts.push(timeout);
        });
        revealed = true;
      }
    });
  }

  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "🤍";
  punBox.appendChild(heart);

  heart.addEventListener("click", async () => {
    heart.classList.toggle("liked");
    heart.textContent = heart.classList.contains("liked") ? "❤" : "🤍";

    if (heart.classList.contains("liked")) {
      try {
        await fetch(`/api/puns/${id}/like`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error liking pun:", error);
      }
    }
  });

  const linkIcon = document.createElement("a");
  linkIcon.href = `/puns/${id}`;
  linkIcon.classList.add("link-icon");
  linkIcon.textContent = "🔗";
  punBox.appendChild(linkIcon);

  container.appendChild(punBox);
}

function clearTimeouts(timeouts) {
  timeouts.forEach((timeout) => clearTimeout(timeout));
  timeouts.length = 0;
}
