// Main script file
// Curtain image navigation, imprint toggle, mobile info toggle

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

  const images = window.curtainImages || [];
  initCurtain(images);
});

// Curtain images cycle in a fixed order (window.curtainImages, set by
// index.astro). Only each column's starting position is random; clicking the
// left half of an image steps backward, the right half steps forward.
function initCurtain(images) {
  const columns = Array.from(document.querySelectorAll('.curtain-column'));
  const total = images.length;
  const describedProjects = new Set(window.describedProjects || []);

  if (total === 0 || columns.length === 0) return;

  const preloaded = new Set();
  const preload = (index) => {
    index = ((index % total) + total) % total;
    if (preloaded.has(index)) return;
    preloaded.add(index);
    new Image().src = images[index].src;
  };

  const showImage = (column, index) => {
    index = ((index % total) + total) % total;
    column.dataset.index = String(index);

    const {src, filename, project, landscape} = images[index];
    const imgEl = column.querySelector('img');
    const filenameEl = column.querySelector('.image-filename');
    if (imgEl) {
      imgEl.src = src;
      // Landscape images are rotated upright so every curtain slot stays
      // portrait-framed (see .curtain-column img.rotated in style.css).
      imgEl.classList.toggle('rotated', !!landscape);
    }
    if (filenameEl) filenameEl.textContent = filename;

    // The "?" only appears when the current project has a desc.md, in
    // which case it links to that project's own detail page.
    const infoBox = column.querySelector('.project-info');
    if (infoBox) {
      const described = describedProjects.has(project);
      infoBox.classList.toggle('visible', described);
      infoBox.href = described ? `${window.baseUrl}${project}/` : '#';
    }

    // Keep the immediate neighbors ready so the next click is instant
    preload(index + 1);
    preload(index - 1);
  };

  // Randomize each column's starting position (kept distinct from one
  // another when there are enough images to do so); the cycling order
  // itself is fixed. Works for any number of columns (there may be a third,
  // "middle" one on very wide screens - see .curtain-column[data-column] in
  // style.css).
  const usedStartIndices = new Set();
  const startIndex = {};
  columns.forEach(column => {
    let index = Math.floor(Math.random() * total);
    while (usedStartIndices.size < total && usedStartIndices.has(index)) {
      index = Math.floor(Math.random() * total);
    }
    usedStartIndices.add(index);
    startIndex[column.dataset.column] = index;
  });

  const isLeftHalf = (column, clientX) => {
    const rect = column.getBoundingClientRect();
    return (clientX - rect.left) < rect.width / 2;
  };

  columns.forEach(column => {
    showImage(column, startIndex[column.dataset.column] ?? 0);

    column.addEventListener('click', (e) => {
      const direction = isLeftHalf(column, e.clientX) ? -1 : 1;
      playRandomSound();
      showImage(column, Number(column.dataset.index) + direction);
    });

    // Show a directional cursor hinting which way a click will step
    column.addEventListener('mousemove', (e) => {
      const leftHalf = isLeftHalf(column, e.clientX);
      column.classList.toggle('cursor-prev', leftHalf);
      column.classList.toggle('cursor-next', !leftHalf);
    });
    column.addEventListener('mouseleave', () => {
      column.classList.remove('cursor-prev', 'cursor-next');
    });

    // Clicking the "?" should navigate to its project's detail page
    // instead of also stepping the curtain image underneath it.
    const infoBox = column.querySelector('.project-info');
    if (infoBox) {
      infoBox.addEventListener('click', (e) => e.stopPropagation());
    }
  });

  // Warm the browser cache for the rest of the collection in the background
  // so switching stays instant even after many clicks
  const whenIdle = window.requestIdleCallback || (cb => setTimeout(cb, 300));
  whenIdle(() => images.forEach((_, index) => preload(index)));
}

function playRandomSound() {
  if (!window.soundPaths || window.soundPaths.length === 0) return;
  const randomSound = window.soundPaths[Math.floor(Math.random() * window.soundPaths.length)];
  const audio = new Audio(randomSound);
  audio.volume = 0.3;
  audio.play().catch(err => console.log('Audio play failed:', err));
}
