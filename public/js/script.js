// Main script file
// Curtain image swapping and imprint toggle

document.addEventListener('DOMContentLoaded', () => {

  // Mobile info toggle
  const textContainer = document.getElementById('text-container');

  if (textContainer) {
    textContainer.addEventListener('click', (e) => {
      // Only toggle on mobile
      if (window.innerWidth <= 1000) {
        // Check if clicking on the close button (::after pseudo-element area)
        const rect = textContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // If container is open (default) and clicked near bottom-right (close button area)
        if (!textContainer.classList.contains('mobile-closed')) {
          const isCloseButton = clickX > rect.width - 40 && clickY > rect.height - 40;
          if (isCloseButton) {
            textContainer.classList.add('mobile-closed');
          }
        } else {
          // If closed, open it
          textContainer.classList.remove('mobile-closed');
        }
      }
    });
  }

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

    // Play random sound
    if (window.soundPaths && window.soundPaths.length > 0) {
      const randomSound = window.soundPaths[Math.floor(Math.random() * window.soundPaths.length)];
      const audio = new Audio(randomSound);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio play failed:', err));
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
