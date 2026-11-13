/**
 * Cookie Banner & Consent Management for «Состояние»
 * Compliant with 152-FZ and GDPR best practices.
 */

(function () {
  const CONSENT_STORAGE_KEY = 'sostoyaniye_cookie_consent';

  const banner = document.getElementById('cookieBanner');
  const modal = document.getElementById('cookieSettingsModal');
  const btnAcceptAll = document.getElementById('cookieAcceptAll');
  const btnNecessaryOnly = document.getElementById('cookieNecessaryOnly');
  const btnOpenSettings = document.getElementById('cookieOpenSettings');
  const btnSaveSettings = document.getElementById('cookieSaveSettings');
  const btnCloseModal = document.getElementById('cookieCloseModal');
  const btnCloseModalCancel = document.getElementById('cookieCloseModalBtn');
  const footerCookieTriggers = document.querySelectorAll('[data-cookie-settings-trigger]');

  const analyticsToggle = document.getElementById('cookieToggleAnalytics');
  const marketingToggle = document.getElementById('cookieToggleMarketing');

  // Load existing consent
  function getStoredConsent() {
    try {
      const data = localStorage.getItem(CONSENT_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Save consent
  function saveConsent(preferences) {
    try {
      const consentData = {
        necessary: true,
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      hideBanner();
      hideModal();
      applyConsent(consentData);
    } catch (e) {
      console.warn('Could not save cookie consent', e);
    }
  }

  // Apply consent choices
  function applyConsent(consent) {
    if (consent.analytics) {
      // Allow analytics scripts if any are loaded in future
      window.sostoyaniyeAnalyticsAllowed = true;
    } else {
      window.sostoyaniyeAnalyticsAllowed = false;
    }
  }

  function showBanner() {
    if (banner) {
      banner.classList.add('visible');
    }
  }

  function hideBanner() {
    if (banner) {
      banner.classList.remove('visible');
    }
  }

  function showModal() {
    if (modal) {
      const stored = getStoredConsent();
      if (stored) {
        if (analyticsToggle) analyticsToggle.checked = Boolean(stored.analytics);
        if (marketingToggle) marketingToggle.checked = Boolean(stored.marketing);
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Initialize
  const currentConsent = getStoredConsent();
  if (!currentConsent) {
    // Show banner with subtle delay so it doesn't jarringly block the hero
    setTimeout(showBanner, 1000);
  } else {
    applyConsent(currentConsent);
  }

  // Event Listeners
  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', function () {
      saveConsent({ analytics: true, marketing: true });
    });
  }

  if (btnNecessaryOnly) {
    btnNecessaryOnly.addEventListener('click', function () {
      saveConsent({ analytics: false, marketing: false });
    });
  }

  if (btnOpenSettings) {
    btnOpenSettings.addEventListener('click', function () {
      showModal();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', hideModal);
  }

  if (btnCloseModalCancel) {
    btnCloseModalCancel.addEventListener('click', hideModal);
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideModal();
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', function () {
      saveConsent({
        analytics: analyticsToggle ? analyticsToggle.checked : false,
        marketing: marketingToggle ? marketingToggle.checked : false
      });
    });
  }

  // Open settings anytime from footer
  footerCookieTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      showModal();
    });
  });

  // ESC key closes modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      hideModal();
    }
  });
})();
