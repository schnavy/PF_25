// Main script file
// Curtain image swapping and imprint toggle

document.addEventListener('DOMContentLoaded', () => {

  // Imprint toggle
  const impressumBtn = document.getElementById('impressum-btn');
  const imprintContainer = document.querySelector('.imprint-container');

  if (impressumBtn && imprintContainer) {
    impressumBtn.addEventListener('click', () => {
      imprintContainer.classList.toggle('open');
    });
  }

  // Curtain image swapping - individual column click
  const curtainColumns = document.querySelectorAll('.curtain-column');

  if (curtainColumns.length > 0 && typeof window.curtainImagesArray !== 'undefined') {
    curtainColumns.forEach(column => {
      column.addEventListener('click', (e) => {
        swapCurtainImage(e.currentTarget);
      });
    });
  }

  function swapCurtainImage(columnElement) {
    const img = columnElement.querySelector('img');
    const filenameEl = columnElement.querySelector('.image-filename');

    if (!img || !window.curtainImagesArray || window.curtainImagesArray.length < 2) {
      return;
    }

    // Get next image from shuffled array
    const newSrc = window.curtainImagesArray[window.currentIndex % window.curtainImagesArray.length];
    img.src = newSrc;

    // Update filename display
    if (filenameEl && window.getFilenameFromPath) {
      filenameEl.textContent = window.getFilenameFromPath(newSrc);
    }

    window.currentIndex++;

    // Loop back to start if we run out
    if (window.currentIndex >= window.curtainImagesArray.length) {
      window.currentIndex = 0;
    }
  }
});
