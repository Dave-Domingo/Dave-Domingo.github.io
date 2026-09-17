// Shared site header/nav behavior: the "Work" project dropdown and the
// mobile hamburger nav toggle. Loaded by every page instead of duplicated
// inline per page, so all pages behave identically as the nav grows
// (see STYLE_GUIDE.md's anti-drift rule -- this was previously copy-pasted
// into five separate inline <script> blocks).

function toggleWorkDropdown(btn) {
  var menu = btn.nextElementSibling;
  var isOpen = !menu.hidden;
  closeAllDropdowns();
  if (!isOpen) {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown-menu').forEach(function(menu) {
    menu.hidden = true;
    menu.previousElementSibling.setAttribute('aria-expanded', 'false');
  });
}

function toggleMobileNav(btn) {
  var nav = document.getElementById('site-nav');
  var isOpen = nav.classList.contains('nav-open');
  nav.classList.toggle('nav-open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  if (isOpen) closeAllDropdowns();
}

function closeMobileNav() {
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav) nav.classList.remove('nav-open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown')) closeAllDropdowns();
  if (!e.target.closest('.site-nav') && !e.target.closest('.nav-toggle')) {
    closeMobileNav();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeMobileNav();
  }
});
