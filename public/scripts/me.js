document.addEventListener("DOMContentLoaded", async () => {
  const myPunsContainer = document.getElementById("my-puns-container");
  const likedContainer = document.getElementById("liked-container");

  try {
    const response = await fetch("/api/puns/mine");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    data.created.forEach((result) => {
      createPunBox(result.pun, result.id, myPunsContainer);
    });
    data.liked.forEach((result) => {
      createPunBox(result.pun, result.id, likedContainer);
    });
  } catch (error) {
    console.error("Error fetching my puns:", error);
  }
});
