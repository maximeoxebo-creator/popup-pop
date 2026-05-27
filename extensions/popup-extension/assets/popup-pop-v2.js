(function() {
  var overlay = document.getElementById('popup-pop-overlay');
  if (!overlay) return;

  var KEY = 'popup_pop_shown_' + overlay.getAttribute('data-popup-block');
  var appUrl = overlay.getAttribute('data-app-url') || 'https://popup-pop.vercel.app';
  var shop = window.Shopify && window.Shopify.shop ? window.Shopify.shop : location.hostname;

  var closeBtn = document.getElementById('popup-pop-close');
  var ctaBtn = document.getElementById('popup-pop-cta');
  var titleEl = overlay.querySelector('.popup-pop-title');
  var messageEl = overlay.querySelector('.popup-pop-message');

  if (sessionStorage.getItem(KEY)) return;

  fetch(appUrl + '/api/popup-settings?shop=' + shop)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.active) return;
      if (data.title && titleEl) titleEl.textContent = data.title;
      if (data.message && messageEl) messageEl.textContent = data.message;
      if (data.colorStart && data.colorEnd) {
        var gradient = 'linear-gradient(135deg, ' + data.colorStart + ' 0%, ' + data.colorEnd + ' 100%)';
        var header = overlay.querySelector('.popup-pop-header');
        var btn = overlay.querySelector('.popup-pop-button');
        if (header) header.style.background = gradient;
        if (btn) btn.style.background = gradient;
      }
      setTimeout(show, 1500);
    })
    .catch(function() {
      setTimeout(show, 1500);
    });

  function show() {
    overlay.style.display = 'flex';
    overlay.classList.remove('hidden');
    sessionStorage.setItem(KEY, '1');
  }

  function hide() {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }

  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (ctaBtn) ctaBtn.addEventListener('click', hide);
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) hide();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hide();
  });
})();
