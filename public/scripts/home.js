document.addEventListener('DOMContentLoaded', async () => {
    const punsContainer = document.getElementById('puns-container');

    try {
      const response = await fetch('/api/puns');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) throw new Error('Invalid data format');
      data.results.forEach(result => {
        if (result.pun) {
          createPunBox(result.pun, result.id, punsContainer);
        }
      });
    } catch (error) {
      console.error('Error fetching puns:', error);
    }
  });
