// Main script file
// Project interaction handlers will go here

document.addEventListener('DOMContentLoaded', () => {
  // Imprint toggle
  const impressumBtn = document.getElementById('impressum-btn');
  const imprintContainer = document.querySelector('.imprint-container');

  if (impressumBtn && imprintContainer) {
    impressumBtn.addEventListener('click', () => {
      imprintContainer.classList.toggle('open');
    });
  }

  // Project click handlers
  const projectsWithImages = document.querySelectorAll('.has-images');
  projectsWithImages.forEach(project => {
    project.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        const slug = project.id;
        showProjectContent(slug);
      }
    });
  });

  // Function to show project content
  function showProjectContent(slug) {
    // Hide all project content
    document.querySelectorAll('.project-content').forEach(el => {
      el.classList.add('hidden');
    });

    // Show selected project
    const projectContent = document.querySelector(`[data-project-slug="${slug}"]`);
    if (projectContent) {
      projectContent.classList.remove('hidden');

      // Show close button
      const closeBtn = document.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.classList.remove('hidden');
      }
    }
  }

  // Close button handler
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Hide all project content
      document.querySelectorAll('.project-content').forEach(el => {
        el.classList.add('hidden');
      });
      // Hide close button
      closeBtn.classList.add('hidden');
    });
  }
});
