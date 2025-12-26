function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

function initModals() {

  document.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute('data-modal');
      const modal = document.getElementById(id);

      if (modal) {
        document.body.classList.add('modal-open');
        modal.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute('data-close');
      closeModal(document.getElementById(id));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });
}

window.addEventListener('load', initModals);
