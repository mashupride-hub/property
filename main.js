/**
 * アミューズ（万代）施設物件募集 LP - JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. ハンバーガーメニュー制御
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    hamburgerBtn.classList.add('is-open');
    mobileNav.classList.add('is-open');
    mobileNavOverlay.style.display = 'block';
    requestAnimationFrame(() => mobileNavOverlay.classList.add('is-open'));
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburgerBtn.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    mobileNavOverlay.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // overlay を非表示に（トランジション後）
    setTimeout(() => { mobileNavOverlay.style.display = 'none'; }, 300);
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileNav.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Escキーでドロワーを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // 2.5 風営法第5号営業モーダル制御
  const openFueiBtn = document.getElementById('open-fuei-modal');
  const fueiOverlay = document.getElementById('fuei-modal-overlay');
  const closeFueiBtn = document.getElementById('close-fuei-modal');
  const closeFueiInnerBtn = document.getElementById('close-fuei-modal-btn');

  function openFueiModal() {
    if (!fueiOverlay) return;
    fueiOverlay.classList.add('is-open');
    fueiOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFueiModal() {
    if (!fueiOverlay) return;
    fueiOverlay.classList.remove('is-open');
    fueiOverlay.setAttribute('aria-hidden', 'true');
    if (!mobileNav || !mobileNav.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  if (openFueiBtn) {
    openFueiBtn.addEventListener('click', openFueiModal);
  }

  if (closeFueiBtn) {
    closeFueiBtn.addEventListener('click', closeFueiModal);
  }

  if (closeFueiInnerBtn) {
    closeFueiInnerBtn.addEventListener('click', closeFueiModal);
  }

  if (fueiOverlay) {
    fueiOverlay.addEventListener('click', (e) => {
      if (e.target === fueiOverlay) {
        closeFueiModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fueiOverlay && fueiOverlay.classList.contains('is-open')) {
      closeFueiModal();
    }
  });

  // 3. 「各セクションがふわっと出てくる」スクロールフェードインアニメーション
  initScrollFadeIn();

  // 3. Animated Counter for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      const unitSpan = el.querySelector('.stat-unit');
      const unitText = unitSpan ? unitSpan.outerHTML : '';
      el.innerHTML = `${Math.floor(current).toLocaleString()}${unitText}`;
    }, stepTime);
  };

  const observerOptions = {
    threshold: 0.2
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => countUp(el));
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.section-numbers');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Contact Form Handler Simulation
  const form = document.getElementById('propertyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('ご提案ありがとうございます。担当者より2〜3営業日以内にご連絡させていただきます。');
      form.reset();
    });
  }

  // 6. 1店舗でも例え何店舗でも途切れない「自動無縫裁 marquee スライドエンジン」
  initInfiniteMarquee();
  window.addEventListener('resize', debounce(initInfiniteMarquee, 200));
});

/**
 * 各セクションおよび主要コンテンツカードがスクロール時にふわっと出現する効果
 */
function initScrollFadeIn() {
  // アニメーション対象エレメントを選択
  const selectors = [
    '.section-header',
    '.about-banner-box',
    '.strength-photo-block',
    '.promo-card',
    '.influencer-card',
    '.media-card',
    '.format-card',
    '.req-card',
    '.timeline-step',
    '.faq-item',
    '.contact-box'
  ];

  const fadeElements = document.querySelectorAll(selectors.join(', '));
  
  fadeElements.forEach((el) => {
    el.classList.add('fade-in-up');
  });

  // 各グリッド内の要素に順番のパラパラ表示ディレイを自動適用
  const grids = document.querySelectorAll('.about-features-grid, .promo-grid, .influencer-grid, .media-grid, .formats-grid, .req-grid, .timeline');
  grids.forEach(grid => {
    const children = Array.from(grid.children).filter(c => !c.classList.contains('timeline-arrow'));
    children.forEach((child, idx) => {
      const delayClass = `delay-${(idx % 4) + 1}`;
      child.classList.add(delayClass);
    });
  });

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度ふわっと表示されたら監視終了
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => {
    fadeInObserver.observe(el);
  });
}

/**
 * どんな枚数（例え1店舗だけ）でも、画面幅と1セット分の距離を動的計算し、
 * クローンを自動追加して完璧な完全連続無限スライドを作るエンジン
 */
function initInfiniteMarquee() {
  const track = document.querySelector('.marquee-track');
  const container = document.querySelector('.marquee-container');
  if (!track || !container) return;

  // 1. オリジナルの要素のみを取得（再実行時にクローンをクリア）
  const originalItems = Array.from(track.querySelectorAll('.marquee-card:not(.is-clone)'));
  if (originalItems.length === 0) return;

  // 既存のクローンを削除してリセット
  const clones = track.querySelectorAll('.is-clone');
  clones.forEach(c => c.remove());

  // 2. 1セット分の正確な横幅（カード幅 + gap）を計算
  const computedGap = parseFloat(window.getComputedStyle(track).gap) || 28;
  
  // 1セット（全オリジナル店舗分）の総距離 (px)
  let oneSetDistance = 0;
  originalItems.forEach(item => {
    oneSetDistance += item.offsetWidth + computedGap;
  });

  // 3. トラック全体の幅が「画面幅の2.5倍以上」かつ「オリジナルセットの2倍以上」になるまで自動複製
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const requiredMinTrackWidth = Math.max(viewportWidth * 2.5, oneSetDistance * 2 + viewportWidth);

  let currentTrackWidth = oneSetDistance;
  while (currentTrackWidth < requiredMinTrackWidth) {
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('is-clone');
      track.appendChild(clone);
      currentTrackWidth += item.offsetWidth + computedGap;
    });
  }

  // 4. CSS変数 `--marquee-shift` に「1セット移動分 (-px)」を適用
  track.style.setProperty('--marquee-shift', `-${oneSetDistance}px`);
}

// 簡易デバウンスヘルパー
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
