/* Shared carousel + expand-overlay behavior.
   Any page using .carousel/#top-carousel + .diagram-card + .overlay-backdrop
   markup (see STYLE_GUIDE.md) loads this once. Assumes at most one carousel
   per page, matching the #top-carousel / #view-all-overlay / #view-all-grid
   IDs used in the markup. */

(function () {
  function showOverlay(el, triggerEl) {
    el._triggerEl = triggerEl || document.activeElement;
    el.classList.add('open');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('visible');
        var closeBtn = el.querySelector('.overlay-close');
        if (closeBtn) closeBtn.focus();
      });
    });
  }

  function hideOverlay(el) {
    el.classList.remove('visible');
    setTimeout(function () {
      el.classList.remove('open');
      if (el._triggerEl) {
        el._triggerEl.focus();
        el._triggerEl = null;
      }
    }, 250);
  }

  function getActiveOverlay() {
    var cardOverlay = document.querySelector('.overlay-backdrop.open');
    if (cardOverlay) return cardOverlay;
    var viewAll = document.getElementById('view-all-overlay');
    if (viewAll && viewAll.classList.contains('open')) return viewAll;
    return null;
  }

  function getFocusableElements(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  document.addEventListener('keydown', function (e) {
    var active = getActiveOverlay();
    if (!active) return;
    if (e.key === 'Escape') {
      hideOverlay(active);
      return;
    }
    if (e.key === 'Tab') {
      var focusable = getFocusableElements(active);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  var carousel = document.getElementById('top-carousel');

  if (carousel) {
    var prefersReducedMotion = function () {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    var scrollCarousel = function (direction) {
      var cards = Array.prototype.slice.call(carousel.querySelectorAll('.diagram-card'));
      var current = carousel.scrollLeft;
      var target = null;
      if (direction > 0) {
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].offsetLeft > current + 10) { target = cards[i]; break; }
        }
      } else {
        for (var j = cards.length - 1; j >= 0; j--) {
          if (cards[j].offsetLeft < current - 10) { target = cards[j]; break; }
        }
      }
      if (target) {
        carousel.scrollTo({ left: target.offsetLeft - 4, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    };

    var updateArrows = function () {
      var prevBtn = document.querySelector('.carousel-arrow.prev');
      var nextBtn = document.querySelector('.carousel-arrow.next');
      var leftFade = document.querySelector('.carousel-fade.left');
      var rightFade = document.querySelector('.carousel-fade.right');
      var atStart = carousel.scrollLeft <= 4;
      var atEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 4;
      if (prevBtn) prevBtn.disabled = atStart;
      if (nextBtn) nextBtn.disabled = atEnd;
      if (leftFade) leftFade.classList.toggle('visible', !atStart);
      if (rightFade) rightFade.classList.toggle('visible', !atEnd);
    };

    var openViewAll = function () {
      var grid = document.getElementById('view-all-grid');
      grid.innerHTML = '';
      carousel.querySelectorAll('.diagram-card').forEach(function (card) {
        grid.appendChild(card.cloneNode(true));
      });
      showOverlay(document.getElementById('view-all-overlay'));
    };

    var closeViewAll = function () {
      hideOverlay(document.getElementById('view-all-overlay'));
    };

    carousel.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();

    window.scrollCarousel = scrollCarousel;
    window.openViewAll = openViewAll;
    window.closeViewAll = closeViewAll;
  }

  window.showOverlay = showOverlay;
  window.hideOverlay = hideOverlay;
})();
