document.addEventListener("DOMContentLoaded", async () => {
  const punId = window.location.pathname.split("/").pop();
  const punDetailText = document.getElementById("pun-detail-text");
  const similarPunsContainer = document.getElementById(
    "similar-puns-container"
  );

  try {
    // Fetch pun detail
    const response = await fetch(`/api/puns/${punId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    // TOOD: createPunBox
    punDetailText.textContent = data.pun;

    // Fetch similar puns
    const similarResponse = await fetch(`/api/puns/${punId}/similar`);
    if (!similarResponse.ok) throw new Error("Network response was not ok");
    const similarData = await similarResponse.json();
    similarData.results.forEach((result) => {
      createPunBox(result.pun, result.id, similarPunsContainer);
    });
  } catch (error) {
    console.error("Error fetching pun details or similar puns:", error);
  }
});

