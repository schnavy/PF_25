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
  const openProjectDetail = initProjectDetail(images);
  initCurtain(images, openProjectDetail);
});

// The project detail view replaces the curtain with a single project's own
// images (full height, horizontally scrollable) plus its desc.md content in
// a left-aligned info box. Returns a function to open it for a given project
// slug; the curtain and main text container are hidden while it's open.
function initProjectDetail(images) {
  const detail = document.getElementById('project-detail');
  const infoContent = document.getElementById('project-detail-content');
  const backBtns = document.querySelectorAll('#project-detail .detail-back-btn');
  const gallery = document.getElementById('project-detail-gallery');
  const firstImageContainer = document.getElementById('project-detail-first-image');
  const imageFlow = document.getElementById('project-detail-image-flow');
  const textContainer = document.getElementById('text-container');
  const imageContainer = document.getElementById('image-container');

  if (!detail || !infoContent || !backBtns.length || !gallery || !firstImageContainer || !imageFlow) return () => {};

  const close = () => {
    detail.classList.remove('open');
    if (textContainer) textContainer.style.display = '';
    if (imageContainer) imageContainer.style.display = '';
  };

  const open = (slug) => {
    const template = document.querySelector(`#project-descriptions [data-project-slug="${slug}"]`);
    infoContent.innerHTML = template ? template.innerHTML : '';

    // First image stands alone at the top; the rest flow into a
    // masonry-like multi-column layout (see #project-detail-image-flow).
    firstImageContainer.innerHTML = '';
    imageFlow.innerHTML = '';
    images.filter(image => image.project === slug).forEach((image, index) => {
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.filename;
      (index === 0 ? firstImageContainer : imageFlow).appendChild(img);
    });
    gallery.scrollTop = 0;
    infoContent.scrollTop = 0;

    if (textContainer) textContainer.style.display = 'none';
    if (imageContainer) imageContainer.style.display = 'none';
    detail.classList.add('open');
  };

  backBtns.forEach(btn => btn.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detail.classList.contains('open')) close();
  });

  return open;
}

// Curtain images cycle in a fixed order (window.curtainImages, set by
// index.astro). Only each column's starting position is random; clicking the
// left half of an image steps backward, the right half steps forward.
function initCurtain(images, openProjectDetail) {
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

    // The "?" only appears when the current project has a desc.md;
    // switching images always collapses it back to the closed "?" state.
    const infoBox = column.querySelector('.project-info');
    if (infoBox) {
      infoBox.classList.remove('open');
      infoBox.classList.toggle('visible', describedProjects.has(project));
    }

    // Keep the immediate neighbors ready so the next click is instant
    preload(index + 1);
    preload(index - 1);
  };

  // Randomize each column's starting position; the cycling order itself is fixed
  const leftStart = Math.floor(Math.random() * total);
  const rightOffset = total > 1 ? 1 + Math.floor(Math.random() * (total - 1)) : 0;
  const startIndex = {
    left: leftStart,
    right: (leftStart + rightOffset) % total
  };

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

    // Clicking the "?" opens the project detail view instead of navigating
    // the image
    const infoBox = column.querySelector('.project-info');
    if (infoBox) {
      infoBox.addEventListener('click', (e) => {
        e.stopPropagation();
        const project = images[Number(column.dataset.index)].project;
        if (!describedProjects.has(project)) return;
        openProjectDetail(project);
      });
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
