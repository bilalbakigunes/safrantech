
document.addEventListener('DOMContentLoaded', () => {
  const yearEls = document.querySelectorAll('[data-current-year]');
  const year = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = year);

  const backToTop = document.querySelector('#backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = target;
        } else {
          el.textContent = current;
          requestAnimationFrame(tick);
        }
      };
      tick();
    };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
  }

  const projectButtons = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-item');
  const projectSearch = document.querySelector('#projectSearch');

  function filterProjects() {
    if (!projectCards.length) return;
    const activeBtn = document.querySelector('[data-project-filter].active');
    const activeFilter = activeBtn ? activeBtn.dataset.projectFilter : 'all';
    const query = projectSearch ? projectSearch.value.trim().toLowerCase() : '';

    projectCards.forEach(card => {
      const wrapper = card.closest('[data-project-wrapper]');
      const categories = (card.dataset.categories || '').toLowerCase();
      const keywords = (card.dataset.keywords || '').toLowerCase();
      const matchFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchSearch = query === '' || keywords.includes(query);

      if (matchFilter && matchSearch) {
        wrapper.classList.remove('d-none');
      } else {
        wrapper.classList.add('d-none');
      }
    });
  }

  projectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      projectButtons.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (projectSearch) {
    projectSearch.addEventListener('input', filterProjects);
  }

  const galleryButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryButtons.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      const group = btn.dataset.galleryFilter;
      galleryItems.forEach(item => {
        const match = group === 'all' || (item.dataset.group || '').includes(group);
        if (match) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
  });

  const modalImage = document.querySelector('#galleryModalImage');
  const modalTitle = document.querySelector('#galleryModalTitle');
  const modalText = document.querySelector('#galleryModalText');
  document.querySelectorAll('.gallery-trigger').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (!modalImage) return;
      modalImage.src = trigger.dataset.image;
      modalImage.alt = trigger.dataset.title || 'Galeri görseli';
      if (modalTitle) modalTitle.textContent = trigger.dataset.title || 'SafranTech Galeri';
      if (modalText) modalText.textContent = trigger.dataset.caption || '';
    });
  });

  const form = document.querySelector('#contactForm');
  const formSuccess = document.querySelector('#formSuccess');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const value = field.value.trim();
        if (value === '') {
          field.classList.add('is-invalid');
          isValid = false;
          return;
        }

        if (field.type === 'email') {
          const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!emailOk) {
            field.classList.add('is-invalid');
            isValid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        if (formSuccess) {
          formSuccess.classList.add('show');
        }
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      } else {
        if (formSuccess) {
          formSuccess.classList.remove('show');
        }
      }
    });
  }
});
