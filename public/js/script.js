// Main script file
// Project interaction and scroll synchronization

document.addEventListener('DOMContentLoaded', () => {
  // Imprint toggle
  const impressumBtn = document.getElementById('impressum-btn');
  const imprintContainer = document.querySelector('.imprint-container');

  if (impressumBtn && imprintContainer) {
    impressumBtn.addEventListener('click', () => {
      imprintContainer.classList.toggle('open');
    });
  }

  // Get containers
  const imageContainer = document.getElementById('image-container');
  const projectElements = document.querySelectorAll('.projects-container .level-1');

  if (!imageContainer) return;

  // Click handler: scroll to project in right side
  projectElements.forEach(projectEl => {
    projectEl.addEventListener('click', (e) => {
      // Don't interfere with links
      if (e.target.closest('a')) return;

      const slug = projectEl.id;
      const targetProject = document.getElementById(`project-${slug}`);

      if (targetProject) {
        // Scroll the right container to the project
        const containerTop = imageContainer.scrollTop;
        const targetTop = targetProject.offsetTop;

        imageContainer.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll handler: highlight active project in left sidebar
  let ticking = false;

  imageContainer.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveProject();
        ticking = false;
      });
      ticking = true;
    }
  });

  function updateActiveProject() {
    const scrollTop = imageContainer.scrollTop;
    const containerHeight = imageContainer.clientHeight;
    const viewportMiddle = scrollTop + (containerHeight / 3); // Use top third for trigger

    const projectContents = document.querySelectorAll('.project-content');
    let activeSlug = null;

    // Find which project is currently in view
    projectContents.forEach(project => {
      const projectTop = project.offsetTop;
      const projectBottom = projectTop + project.offsetHeight;

      if (viewportMiddle >= projectTop && viewportMiddle < projectBottom) {
        activeSlug = project.dataset.projectSlug;
      }
    });

    // Update active class on left sidebar projects
    projectElements.forEach(el => {
      if (el.id === activeSlug) {
        el.classList.add('project-active');
      } else {
        el.classList.remove('project-active');
      }
    });
  }

  // Initialize on load
  updateActiveProject();
});
