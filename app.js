/* ============================================
   EQUITY RESEARCH ACADEMY — APP LOGIC
   Navigation, Animations, Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sidebar Navigation ----
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.section[id], .hero[id]');

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });

  // Active nav highlight on scroll
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 150) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const menuOverlay = document.querySelector('.menu-overlay');

  function closeMobileMenu() {
    sidebar.classList.remove('open');
    menuOverlay.classList.remove('active');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      menuOverlay.classList.toggle('active');
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }

  // ---- Progress Bar ----
  const progressFill = document.querySelector('.progress-fill');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressFill) {
      progressFill.style.width = Math.min(progress, 100) + '%';
    }
  }

  // ---- Back to Top Button ----
  const backToTop = document.querySelector('.back-to-top');

  function updateBackToTop() {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Event Handler ----
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        updateProgress();
        updateBackToTop();
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Animate on Scroll ----
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  function animateOnScroll() {
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('animated');
      }
    });
  }

  // Initial check
  animateOnScroll();

  // ---- Accordion ----
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all in same accordion
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(ai => {
          ai.classList.remove('active');
        });
      }

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ---- Tabs ----
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.tabs');
      const targetTab = btn.getAttribute('data-tab');

      // Update buttons
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      tabGroup.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      const targetContent = tabGroup.querySelector(`[data-tab-content="${targetTab}"]`);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ---- Ratio Calculators ----

  // P/E Ratio Calculator
  const pePrice = document.getElementById('pe-price');
  const peEps = document.getElementById('pe-eps');
  const peResult = document.getElementById('pe-result');

  function calcPE() {
    if (pePrice && peEps && peResult) {
      const price = parseFloat(pePrice.value);
      const eps = parseFloat(peEps.value);
      if (!isNaN(price) && !isNaN(eps) && eps !== 0) {
        const pe = (price / eps).toFixed(2);
        peResult.textContent = `P/E Ratio = ${pe}x`;
      } else {
        peResult.textContent = 'Enter valid values';
      }
    }
  }

  if (pePrice) pePrice.addEventListener('input', calcPE);
  if (peEps) peEps.addEventListener('input', calcPE);

  // ROE Calculator
  const roeIncome = document.getElementById('roe-income');
  const roeEquity = document.getElementById('roe-equity');
  const roeResult = document.getElementById('roe-result');

  function calcROE() {
    if (roeIncome && roeEquity && roeResult) {
      const income = parseFloat(roeIncome.value);
      const equity = parseFloat(roeEquity.value);
      if (!isNaN(income) && !isNaN(equity) && equity !== 0) {
        const roe = ((income / equity) * 100).toFixed(2);
        roeResult.textContent = `ROE = ${roe}%`;
      } else {
        roeResult.textContent = 'Enter valid values';
      }
    }
  }

  if (roeIncome) roeIncome.addEventListener('input', calcROE);
  if (roeEquity) roeEquity.addEventListener('input', calcROE);

  // Debt-to-Equity Calculator
  const deDebt = document.getElementById('de-debt');
  const deEquity = document.getElementById('de-equity');
  const deResult = document.getElementById('de-result');

  function calcDE() {
    if (deDebt && deEquity && deResult) {
      const debt = parseFloat(deDebt.value);
      const equity = parseFloat(deEquity.value);
      if (!isNaN(debt) && !isNaN(equity) && equity !== 0) {
        const de = (debt / equity).toFixed(2);
        deResult.textContent = `D/E Ratio = ${de}`;
      } else {
        deResult.textContent = 'Enter valid values';
      }
    }
  }

  if (deDebt) deDebt.addEventListener('input', calcDE);
  if (deEquity) deEquity.addEventListener('input', calcDE);

  // Current Ratio Calculator
  const crAssets = document.getElementById('cr-assets');
  const crLiab = document.getElementById('cr-liab');
  const crResult = document.getElementById('cr-result');

  function calcCR() {
    if (crAssets && crLiab && crResult) {
      const assets = parseFloat(crAssets.value);
      const liab = parseFloat(crLiab.value);
      if (!isNaN(assets) && !isNaN(liab) && liab !== 0) {
        const cr = (assets / liab).toFixed(2);
        crResult.textContent = `Current Ratio = ${cr}`;
      } else {
        crResult.textContent = 'Enter valid values';
      }
    }
  }

  if (crAssets) crAssets.addEventListener('input', calcCR);
  if (crLiab) crLiab.addEventListener('input', calcCR);

  // ---- Copy Prompt Buttons ----
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.prompt-card');
      const text = card.querySelector('.prompt-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }).catch(() => {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });

  // ---- Glossary Search ----
  const glossarySearch = document.getElementById('glossary-search');
  const glossaryItems = document.querySelectorAll('.glossary-item');

  if (glossarySearch) {
    glossarySearch.addEventListener('input', () => {
      const query = glossarySearch.value.toLowerCase();
      glossaryItems.forEach(item => {
        const term = item.querySelector('.term').textContent.toLowerCase();
        const def = item.querySelector('.definition').textContent.toLowerCase();
        if (term.includes(query) || def.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ---- Initial State ----
  updateActiveNav();
  updateProgress();
  updateBackToTop();
});
