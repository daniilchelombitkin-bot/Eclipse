// ========== MODAL SYSTEM ==========

// Open modal
document.querySelectorAll('.modal-trigger').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const modal = document.getElementById(btn.dataset.modal);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal via close button
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.close);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Close modal on overlay click (click outside)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Close modal on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});
