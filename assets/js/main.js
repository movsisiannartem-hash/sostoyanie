/**
 * Main Interactive Scripts for «Состояние»
 * Hair coloring & haircut center (Krasnodar)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 0. Page Load Entrance Animations (Hero & Header Cascade)
  // ------------------------------------------------------------------------
  function triggerPageLoaded() {
    if (!document.body.classList.contains('page-loaded')) {
      document.body.classList.add('page-loaded');
    }
  }

  requestAnimationFrame(function () {
    setTimeout(triggerPageLoaded, 50);
  });

  // ------------------------------------------------------------------------
  // 1. Header Appearance & Silky Smooth GPU Scroll Progress (Butter-smooth Lerp)
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  let currentScale = 0;
  let targetScale = 0;
  let scrollProgressRafId = null;

  function smoothProgressLoop() {
    // Silky smooth exponential lerp (0.16 factor for instant response yet liquid-smooth glide)
    const diff = targetScale - currentScale;
    if (Math.abs(diff) < 0.0004) {
      currentScale = targetScale;
    } else {
      currentScale += diff * 0.16;
    }

    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${currentScale.toFixed(5)})`;
    }

    if (currentScale !== targetScale) {
      scrollProgressRafId = requestAnimationFrame(smoothProgressLoop);
    } else {
      scrollProgressRafId = null;
    }
  }

  function handleHeaderScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Header Blur & Scrolled State (Photo 5 Fix)
    if (header) {
      if (scrollTop > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Ultra-smooth GPU Reading Progress Bar (ScaleX Lerp, 1px #E8CCB4)
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScale = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (!scrollProgressRafId) {
        scrollProgressRafId = requestAnimationFrame(smoothProgressLoop);
      }
    }

    // Dynamic Active Capsule Pill (Photo 3)
    let currentSectionId = '';
    const scrollPos = scrollTop + 160;
    sections.forEach(function (sec) {
      if (sec.id && sec.offsetTop <= scrollPos) {
        currentSectionId = sec.id;
      }
    });

    if (currentSectionId && navLinks.length) {
      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(isOpen) {
    if (!mobileToggle || !mobileDrawer) return;
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('open');
    mobileToggle.classList.toggle('active', shouldOpen);
    mobileDrawer.classList.toggle('open', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
    mobileToggle.setAttribute('aria-expanded', shouldOpen);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      toggleMobileMenu();
    });
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMobileMenu(false);
    });
  });

  // ------------------------------------------------------------------------
  // 3. Services Filter Tabs & Clean Accordion (51 Services, 8 Groups)
  // ------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.price-tab-btn');
  const categoryGroups = document.querySelectorAll('.price-category-group');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetCategory = this.getAttribute('data-category');

      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      categoryGroups.forEach(function (group) {
        const groupCat = group.getAttribute('data-category');
        if (targetCategory === 'all' || targetCategory === groupCat) {
          group.classList.remove('hidden');
        } else {
          group.classList.add('hidden');
        }
      });
    });
  });

  // Service Row Accordion (Clean expand without peeking shapes)
  const serviceRowHeaders = document.querySelectorAll('.service-row-header');

  serviceRowHeaders.forEach(function (headerBtn) {
    headerBtn.addEventListener('click', function () {
      const row = this.closest('.service-item-row');
      const isAlreadyActive = row.classList.contains('active');

      // Close other rows in same table list
      const parentTable = row.closest('.price-table-list');
      if (parentTable) {
        parentTable.querySelectorAll('.service-item-row').forEach(function (otherRow) {
          if (otherRow !== row) {
            otherRow.classList.remove('active');
            const otherBtn = otherRow.querySelector('.service-row-header');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isAlreadyActive) {
        row.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        row.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. Reviews Carousel (Seamless Infinite Loop through all 6/6 Reviews)
  // ------------------------------------------------------------------------
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewPrevBtn = document.getElementById('reviewPrevBtn');
  const reviewNextBtn = document.getElementById('reviewNextBtn');
  const reviewCounter = document.getElementById('reviewCounter');
  const originalReviewCards = document.querySelectorAll('.review-slide-card');
  const totalReviews = originalReviewCards.length; // 6 real reviews

  let currentReviewIndex = 0;
  let isCarouselBusy = false;

  // Clone first 3 cards to allow seamless circular sliding through 5/6 and 6/6
  if (reviewsTrack && totalReviews > 0) {
    for (let i = 0; i < Math.min(3, totalReviews); i++) {
      const clone = originalReviewCards[i].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('review-card-clone');
      reviewsTrack.appendChild(clone);
    }
  }

  function getTrackGap() {
    if (!reviewsTrack) return 24;
    const computedGap = parseFloat(window.getComputedStyle(reviewsTrack).gap);
    return isNaN(computedGap) ? 24 : computedGap;
  }

  function updateReviewSlider(withTransition = true) {
    if (!reviewsTrack || !totalReviews) return;

    const firstCard = originalReviewCards[0];
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = getTrackGap();
      const offset = currentReviewIndex * (cardWidth + gap);

      if (withTransition) {
        reviewsTrack.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        reviewsTrack.style.transition = 'none';
      }

      reviewsTrack.style.transform = `translateX(-${offset}px)`;
    }

    if (reviewCounter) {
      // Correctly display 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 6 / 6
      const displayIndex = (currentReviewIndex % totalReviews) + 1;
      reviewCounter.textContent = `${displayIndex} / ${totalReviews}`;
    }

    // Both navigation arrows remain active for infinite circular navigation
    if (reviewPrevBtn) reviewPrevBtn.disabled = false;
    if (reviewNextBtn) reviewNextBtn.disabled = false;
  }

  function nextReview() {
    if (isCarouselBusy) return;
    isCarouselBusy = true;

    currentReviewIndex++;
    updateReviewSlider(true);

    if (currentReviewIndex >= totalReviews) {
      // Reached past 6 (onto cloned 1,2,3) -> snap seamlessly back to index 0 after animation
      setTimeout(function () {
        currentReviewIndex = 0;
        updateReviewSlider(false);
        isCarouselBusy = false;
      }, 430);
    } else {
      setTimeout(function () {
        isCarouselBusy = false;
      }, 430);
    }
  }

  function prevReview() {
    if (isCarouselBusy) return;
    isCarouselBusy = true;

    if (currentReviewIndex === 0) {
      // Seamlessly jump to cloned position totalReviews without transition, then slide to totalReviews - 1 (6 / 6)
      currentReviewIndex = totalReviews;
      updateReviewSlider(false);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          currentReviewIndex = totalReviews - 1;
          updateReviewSlider(true);
          setTimeout(function () {
            isCarouselBusy = false;
          }, 430);
        });
      });
    } else {
      currentReviewIndex--;
      updateReviewSlider(true);
      setTimeout(function () {
        isCarouselBusy = false;
      }, 430);
    }
  }

  if (reviewNextBtn) {
    reviewNextBtn.addEventListener('click', nextReview);
  }

  if (reviewPrevBtn) {
    reviewPrevBtn.addEventListener('click', prevReview);
  }

  // Touch Swipe for mobile carousel
  if (reviewsTrack) {
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance > 0) {
          nextReview();
        } else {
          prevReview();
        }
      }
    }, { passive: true });
  }

  window.addEventListener('resize', function () {
    updateReviewSlider(false);
  });

  updateReviewSlider(false);

  // ------------------------------------------------------------------------
  // 5. Toast Notification & Copy Buttons (Phone & Address)
  // ------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast) return;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('active');
    }, 2800);
  }

  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('+79654574150').then(function () {
        copyPhoneBtn.style.color = '#E8CCB4';
        showToast('Телефон скопирован в буфер обмена');
        setTimeout(function () { copyPhoneBtn.style.color = ''; }, 1800);
      }).catch(function () {
        showToast('Телефон: +7 (965) 457-41-50');
      });
    });
  }

  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('г. Краснодар, ул. имени Тургенева, д. 133').then(function () {
        copyAddressBtn.style.color = '#E8CCB4';
        showToast('Адрес салона скопирован в буфер обмена');
        setTimeout(function () { copyAddressBtn.style.color = ''; }, 1800);
      }).catch(function () {
        showToast('Краснодар, ул. Тургенева, 133');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Reveal on Scroll (Smooth Fade-In-Up)
  // ------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }
  initScrollReveal();

  // ------------------------------------------------------------------------
  // 7. Ambient Cursor Spotlight Glow (Warm Powder Gold #E8CCB4)
  // ------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -1000, mouseY = -1000;
    let currentX = -1000, currentY = -1000;
    let isVisible = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorGlow.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursorGlow.style.opacity = '0';
      isVisible = false;
    });

    function renderCursorGlow() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.transform = 'translate3d(' + (currentX - 275) + 'px, ' + (currentY - 275) + 'px, 0)';
      requestAnimationFrame(renderCursorGlow);
    }
    requestAnimationFrame(renderCursorGlow);
  }

  // Keyboard Escape listener
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    }
  });

});
