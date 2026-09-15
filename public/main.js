/**
 * Rezayttaid Digital — main.js
 * Interactive features: like counter, share, scroll-to-top, mobile nav
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    });

    // Close nav when a link is clicked (mobile)
    siteNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // LIKE BUTTON — with localStorage persistence
  // ============================================
  document.querySelectorAll('.btn-like').forEach(btn => {
    const articleId = btn.dataset.article;
    if (!articleId) return;

    const storageKey = `rezayttaid_like_${articleId}`;
    const countEl = btn.querySelector('.like-count');

    // Load saved state from localStorage
    let likeData = JSON.parse(localStorage.getItem(storageKey) || '{"liked": false, "count": 0}');

    // Set initial count display
    if (countEl) countEl.textContent = likeData.count;
    if (likeData.liked) btn.classList.add('liked');

    btn.addEventListener('click', () => {
      likeData.liked = !likeData.liked;

      if (likeData.liked) {
        likeData.count += 1;
        btn.classList.add('liked');
        showToast('❤️ Kamu menyukai karya ini!');
      } else {
        likeData.count = Math.max(0, likeData.count - 1);
        btn.classList.remove('liked');
        showToast('💔 Like dibatalkan.');
      }

      if (countEl) countEl.textContent = likeData.count;

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(likeData));

      // Animate the button
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });

  // ============================================
  // SHARE BUTTON — Web Share API + fallback
  // ============================================
  document.querySelectorAll('.btn-share').forEach(btn => {
    btn.addEventListener('click', async () => {
      const title = btn.dataset.title || document.title;
      const text = btn.dataset.text || 'Baca karya sastra di Rezayttaid Digital';
      const url = window.location.href;

      // Try native Web Share API (mobile friendly)
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          // User cancelled share — no action needed
        }
      } else {
        // Fallback: copy URL to clipboard
        try {
          await navigator.clipboard.writeText(url);
          showToast('🔗 Link berhasil disalin!');
        } catch {
          showToast('📋 Salin URL: ' + url);
        }
      }
    });
  });

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  let toastEl = document.getElementById('toast');

  // Create toast element if not in HTML
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }

  let toastTimer = null;

  function showToast(message, duration = 2800) {
    toastEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // Make showToast globally accessible
  window.showToast = showToast;

  // ============================================
  // SCROLL-TO-TOP BUTTON
  // ============================================
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // SET CURRENT DATE in byline elements
  // ============================================
  const dateElements = document.querySelectorAll('.byline-date[data-today]');
  if (dateElements.length > 0) {
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    dateElements.forEach(el => {
      el.textContent = today;
    });
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHT
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });

});
