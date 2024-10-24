document.addEventListener('DOMContentLoaded', () => {
    const punInput = document.getElementById('pun-input');
    const punPreviewContainer = document.getElementById('pun-preview');
    const submitPunButton = document.getElementById('submit-pun');

    punInput.addEventListener('input', () => {
      const pun = punInput.value;
      punPreviewContainer.innerHTML = "";
      if (pun.trim() !== "") {
        createPunBox(pun, null, punPreviewContainer);
      }
    });

    submitPunButton.addEventListener('click', async () => {
      const pun = punInput.value;
      if (pun.trim() !== "") {
        try {
          const response = await fetch('/api/puns', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pun })
          });
          if (response.ok) {
            alert('Pun submitted successfully!');
            window.location.href = '/me';
            punInput.value = "";
            punPreviewContainer.innerHTML = "";
          } else {
            alert('Failed to submit pun. Please try again.');
          }
        } catch (error) {
          console.error('Error submitting pun:', error);
          alert('Failed to submit pun. Please try again.');
        }
      } else {
        alert('Please enter a pun before submitting.');
      }
    });
  });
