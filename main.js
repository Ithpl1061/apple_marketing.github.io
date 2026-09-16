// Mac mini Marketing Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Subnavigation Elevation on Scroll
  const subnav = document.getElementById('apple-subnav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 44) {
      subnav.classList.add('shadow-sm', 'border-b', 'border-gray-200');
    } else {
      subnav.classList.remove('shadow-sm', 'border-b', 'border-gray-200');
    }
  });

  // 2. Chip Comparison Switcher (Section 12)
  const chipTabs = document.querySelectorAll('.chip-tab-btn');
  const chipCards = document.querySelectorAll('.chip-compare-card');
  const chipGrid = document.getElementById('chip-cards-grid');

  chipTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-chip');

      chipTabs.forEach(t => {
        t.classList.remove('bg-white', 'text-black', 'shadow-sm');
        t.classList.add('text-gray-500', 'hover:text-black');
      });
      tab.classList.remove('text-gray-500', 'hover:text-black');
      tab.classList.add('bg-white', 'text-black', 'shadow-sm');

      if (target === 'all') {
        if (chipGrid) {
          chipGrid.classList.remove('md:grid-cols-1', 'max-w-2xl');
          chipGrid.classList.add('md:grid-cols-2', 'max-w-6xl');
        }
        chipCards.forEach(card => {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.classList.remove('opacity-0', 'scale-95');
            card.classList.add('opacity-100', 'scale-100');
          });
        });
      } else {
        if (chipGrid) {
          chipGrid.classList.remove('md:grid-cols-2', 'max-w-6xl');
          chipGrid.classList.add('md:grid-cols-1', 'max-w-2xl');
        }
        chipCards.forEach(card => {
          const cardChip = card.getAttribute('data-chip');
          if (cardChip === target) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.classList.remove('opacity-0', 'scale-95');
              card.classList.add('opacity-100', 'scale-100');
            });
          } else {
            card.classList.remove('opacity-100', 'scale-100');
            card.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
              const currentActive = document.querySelector('.chip-tab-btn.bg-white')?.getAttribute('data-chip');
              if (currentActive !== 'all' && card.getAttribute('data-chip') !== currentActive) {
                card.style.display = 'none';
              }
            }, 200);
          }
        });
      }
    });
  });


  // Hotspot Touch & Tap Support for Mobile Devices
  const hotspotPins = document.querySelectorAll('.hotspot-pin');
  hotspotPins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = pin.classList.contains('active');
      hotspotPins.forEach(p => p.classList.remove('active'));
      if (!wasActive) {
        pin.classList.add('active');
      }
    });
  });

  document.addEventListener('click', () => {
    hotspotPins.forEach(p => p.classList.remove('active'));
  });

  // 4. Interactive Footnote Jump Links with Visual Flash
  document.querySelectorAll('a[href^="#footnote-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.classList.add('footnote-highlight');
        setTimeout(() => {
          targetElement.classList.remove('footnote-highlight');
        }, 2600);
      }
    });
  });

  // 5. B2B Pre-order & Configurator Modal
  const buyModal = document.getElementById('buy-configurator-modal');
  const buyButtons = document.querySelectorAll('.trigger-buy-modal');
  const closeBuyModal = document.getElementById('close-buy-modal');
  const formContainer = document.getElementById('b2b-preorder-form-container');
  const successContainer = document.getElementById('b2b-preorder-success');
  const preorderForm = document.getElementById('b2b-preorder-form');
  const submitBtn = document.getElementById('submit-preorder-btn');
  const copyRefBtn = document.getElementById('copy-ref-id-btn');
  const copyRefLabel = document.getElementById('copy-ref-label');

  // Specification selection elements
  const allRadios = document.querySelectorAll('#buy-configurator-modal input[type="radio"]');
  const specSummaryText = document.getElementById('config-summary-text');
  const stage2SpecSummary = document.getElementById('stage-2-spec-summary');

  const getSelectedSpecs = () => {
    const chipVal = document.querySelector('input[name="config-chip"]:checked')?.value || 'm4';
    const memVal = document.querySelector('input[name="config-memory"]:checked')?.value || '16gb';
    const ssdVal = document.querySelector('input[name="config-storage"]:checked')?.value || '256gb';

    const chipLabel = chipVal === 'm4pro' ? 'Apple M4 Pro' : 'Apple M4';
    const memLabel = memVal.toUpperCase();
    const ssdLabel = ssdVal.toUpperCase() + (ssdVal.includes('gb') || ssdVal.includes('tb') ? ' SSD' : '');

    return {
      chipVal,
      chipLabel,
      memVal,
      memLabel,
      ssdVal,
      ssdLabel,
      summary: `${chipLabel} • ${memLabel} Memory • ${ssdLabel}`
    };
  };

  const syncRadioCardStyles = () => {
    ['config-chip', 'config-memory', 'config-storage'].forEach(groupName => {
      const inputs = document.querySelectorAll(`input[name="${groupName}"]`);
      inputs.forEach(input => {
        const card = input.closest('.spec-radio-card');
        if (card) {
          if (input.checked) {
            card.classList.add('is-selected');
          } else {
            card.classList.remove('is-selected');
          }
        }
      });
    });
  };

  const updateSpecSummary = () => {
    const specs = getSelectedSpecs();
    if (specSummaryText) {
      specSummaryText.textContent = specs.summary;
    }
    if (stage2SpecSummary) {
      stage2SpecSummary.textContent = specs.summary;
    }
    syncRadioCardStyles();
  };

  allRadios.forEach(radio => {
    radio.addEventListener('change', updateSpecSummary);
  });

  // 2-Stage Navigation Elements
  const stage1 = document.getElementById('form-stage-1');
  const stage2 = document.getElementById('form-stage-2');
  const stage1NextBtn = document.getElementById('stage-1-next-btn');
  const stage2PrevBtn = document.getElementById('stage-2-prev-btn');
  const stage2EditSpecsBtn = document.getElementById('stage-2-edit-specs-btn');

  const stepTab1 = document.getElementById('step-tab-1');
  const stepBadge1 = document.getElementById('step-badge-1');
  const stepTab2 = document.getElementById('step-tab-2');
  const stepBadge2 = document.getElementById('step-badge-2');

  const goToStage = (stageNum) => {
    if (stageNum === 1) {
      if (stage1) stage1.classList.remove('hidden');
      if (stage2) stage2.classList.add('hidden');

      if (stepTab1 && stepBadge1) {
        stepTab1.className = 'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-white text-[#1d1d1f] shadow-xs transition-all duration-200 cursor-pointer';
        stepBadge1.className = 'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs';
        stepBadge1.textContent = '1';
      }
      if (stepTab2 && stepBadge2) {
        stepTab2.className = 'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-all duration-200 cursor-pointer';
        stepBadge2.className = 'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold';
        stepBadge2.textContent = '2';
      }
    } else if (stageNum === 2) {
      if (stage1) stage1.classList.add('hidden');
      if (stage2) stage2.classList.remove('hidden');

      updateSpecSummary();

      if (stepTab1 && stepBadge1) {
        stepTab1.className = 'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 transition-all duration-200 cursor-pointer';
        stepBadge1.className = 'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold';
        stepBadge1.textContent = '✓';
      }
      if (stepTab2 && stepBadge2) {
        stepTab2.className = 'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-white text-[#1d1d1f] shadow-xs transition-all duration-200 cursor-pointer';
        stepBadge2.className = 'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs';
        stepBadge2.textContent = '2';
      }
    }

    // Scroll modal container to top smoothly
    const modalInner = buyModal?.querySelector('.touch-scroll');
    if (modalInner) {
      modalInner.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (stepTab1) stepTab1.addEventListener('click', () => goToStage(1));
  if (stepTab2) stepTab2.addEventListener('click', () => goToStage(2));

  if (stage1NextBtn) {
    stage1NextBtn.addEventListener('click', () => goToStage(2));
  }

  if (stage2PrevBtn) {
    stage2PrevBtn.addEventListener('click', () => goToStage(1));
  }

  if (stage2EditSpecsBtn) {
    stage2EditSpecsBtn.addEventListener('click', () => goToStage(1));
  }

  // Quick Deployment Tag Chips
  const tagButtons = document.querySelectorAll('.pref-tag-btn');
  const notesTextarea = document.getElementById('b2b-notes');
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      btn.classList.toggle('is-active');
      if (notesTextarea && tag) {
        let currentText = notesTextarea.value.trim();
        if (btn.classList.contains('is-active')) {
          if (!currentText.includes(tag)) {
            notesTextarea.value = currentText ? `${currentText}, ${tag}` : tag;
          }
        } else {
          currentText = currentText.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
          notesTextarea.value = currentText;
        }
      }
    });
  });

  // Modal open / close handling
  const openModal = (presetChip = null) => {
    goToStage(1);
    if (presetChip) {
      const targetRadio = document.querySelector(`input[name="config-chip"][value="${presetChip}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
      }
    }
    updateSpecSummary();
    if (buyModal) {
      buyModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (buyModal) {
      buyModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  };

  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset-chip');
      openModal(preset);
    });
  });

  if (closeBuyModal) closeBuyModal.addEventListener('click', closeModal);
  const modalCard = buyModal?.querySelector('.bg-white');
  if (buyModal) {
    buyModal.addEventListener('click', (e) => {
      // Do NOT close on outside/backdrop click so user input and progress are preserved.
      // Provide an Apple-style subtle focus nudge to indicate the dialog is active.
      if (e.target === buyModal && modalCard) {
        modalCard.classList.remove('animate-modal-nudge');
        void modalCard.offsetWidth; // trigger reflow
        modalCard.classList.add('animate-modal-nudge');
      }
    });
  }

  // Keyboard accessibility: ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && buyModal && !buyModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // GSTIN uppercase formatting
  const gstinInput = document.getElementById('b2b-gstin');
  if (gstinInput) {
    gstinInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  // Form field live error clearing on input
  const formFieldIds = ['b2b-full-name', 'b2b-work-email', 'b2b-phone', 'b2b-company', 'b2b-city', 'b2b-gstin'];
  formFieldIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('input-error-state');
        const errSpan = document.getElementById(`err-${id.replace('b2b-', '')}`);
        if (errSpan) errSpan.classList.add('hidden');
      });
    }
  });

  // Handle B2B Pre-Order Form Submission
  if (preorderForm) {
    preorderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset all errors
      let hasError = false;
      let firstErrorEl = null;

      const setError = (fieldId, errId, message) => {
        const input = document.getElementById(fieldId);
        const errSpan = document.getElementById(errId);
        if (input) {
          input.classList.add('input-error-state');
          if (!firstErrorEl) firstErrorEl = input;
        }
        if (errSpan) {
          if (message) errSpan.textContent = message;
          errSpan.classList.remove('hidden');
        }
        hasError = true;
      };

      const fullName = document.getElementById('b2b-full-name')?.value.trim() || '';
      const workEmail = document.getElementById('b2b-work-email')?.value.trim() || '';
      const phoneNumber = document.getElementById('b2b-phone')?.value.trim() || '';
      const companyName = document.getElementById('b2b-company')?.value.trim() || '';
      const fleetUnits = document.getElementById('b2b-fleet-units')?.value || '1-5';
      const gstin = document.getElementById('b2b-gstin')?.value.trim().toUpperCase() || 'Not Provided';
      const deliveryCity = document.getElementById('b2b-city')?.value.trim() || '';
      const specialRequirements = document.getElementById('b2b-notes')?.value.trim() || 'None';

      // Validation
      if (!fullName || fullName.length < 2) {
        setError('b2b-full-name', 'err-full-name', 'Please enter your full contact name (minimum 2 characters)');
      }

      if (!workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
        setError('b2b-work-email', 'err-work-email', 'Please enter a valid corporate email (e.g. name@company.com)');
      }

      const cleanPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
      if (!phoneNumber || cleanPhone.length < 10) {
        setError('b2b-phone', 'err-phone', 'Please enter a valid phone number (at least 10 digits)');
      }

      if (!companyName || companyName.length < 2) {
        setError('b2b-company', 'err-company', 'Please enter your company or organization name');
      }

      if (!deliveryCity || deliveryCity.length < 2) {
        setError('b2b-city', 'err-city', 'Please specify your delivery city and state');
      }

      // Optional GSTIN verification (if entered)
      if (gstin && gstin !== 'Not Provided') {
        const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinPattern.test(gstin) && gstin.length !== 15) {
          setError('b2b-gstin', 'err-gstin', 'Please check your 15-character GSTIN format (e.g. 27AAAAA0000A1Z5)');
        }
      }

      if (hasError) {
        if (firstErrorEl) {
          firstErrorEl.focus();
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Button loading feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Processing Pre-order...
        `;
      }

      setTimeout(() => {
        const refId = `ITH-MM-${Math.floor(10000 + Math.random() * 90000)}`;
        const specs = getSelectedSpecs();

        const preorderData = {
          refId,
          timestamp: new Date().toISOString(),
          fullName,
          workEmail,
          phoneNumber,
          companyName,
          fleetUnits,
          gstin,
          deliveryCity,
          specialRequirements,
          specs: specs.summary
        };

        // Persist preorder locally
        try {
          const preorders = JSON.parse(localStorage.getItem('ithpl_macmini_preorders') || '[]');
          preorders.unshift(preorderData);
          localStorage.setItem('ithpl_macmini_preorders', JSON.stringify(preorders));
        } catch (err) {
          console.warn('Could not persist preorder to localStorage', err);
        }

        // Populate Success Card
        const successRefEl = document.getElementById('success-ref-id');
        const successCompanyEl = document.getElementById('success-company');
        const successNameEl = document.getElementById('success-name');
        const successUnitsEl = document.getElementById('success-units');
        const successSpecsEl = document.getElementById('success-specs');

        if (successRefEl) successRefEl.textContent = refId;
        if (successCompanyEl) successCompanyEl.textContent = companyName;
        if (successNameEl) successNameEl.textContent = fullName;
        if (successUnitsEl) successUnitsEl.textContent = `${fleetUnits} Units`;
        if (successSpecsEl) successSpecsEl.textContent = specs.summary;


        // Setup 1-Click Copy Reference ID button
        if (copyRefBtn && copyRefLabel) {
          copyRefBtn.onclick = () => {
            navigator.clipboard.writeText(refId).then(() => {
              copyRefLabel.textContent = 'Copied!';
              copyRefBtn.classList.add('text-emerald-600', 'border-emerald-300');
              setTimeout(() => {
                copyRefLabel.textContent = 'Copy ID';
                copyRefBtn.classList.remove('text-emerald-600', 'border-emerald-300');
              }, 2000);
            }).catch(() => {
              copyRefLabel.textContent = 'Copied!';
            });
          };
        }

        // Reset submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Submit Corporate Pre-order</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          `;
        }

        // Switch to success view
        formContainer.classList.add('hidden');
        successContainer.classList.remove('hidden');

        // Scroll modal to top smoothly
        const modalInner = buyModal?.querySelector('.touch-scroll');
        if (modalInner) {
          modalInner.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 650);
    });
  }


  // Initialize specs summary & active card styles
  updateSpecSummary();

  // 6. Smooth Scroll for all in-page anchors
  document.querySelectorAll('a[href^="#sec-"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Mobile Navigation Toggle
  window.toggleMobileMenu = function () {
    const mobileNav = document.getElementById('mobileNav');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    if (!mobileNav || !toggleButton) return;

    mobileNav.classList.toggle('active');
    const spans = toggleButton.querySelectorAll('span');
    const isActive = mobileNav.classList.contains('active');

    if (isActive) {
      if (spans[0]) spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      if (spans[1]) spans[1].style.opacity = '0';
      if (spans[2]) spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      if (spans[0]) spans[0].style.transform = 'none';
      if (spans[1]) spans[1].style.opacity = '1';
      if (spans[2]) spans[2].style.transform = 'none';
    }
  };

  const arrowBtn = document.querySelector('.arrow-btn');
  const appleSubmenu = document.getElementById('appleSubmenu');
  if (arrowBtn && appleSubmenu) {
    arrowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appleSubmenu.classList.toggle('hidden');
    });
  }

  // Auto-close mobile drawer when tapping nav links
  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        window.toggleMobileMenu();
      }
    });
  });

  // Global Escape key dismisses modal & mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        window.toggleMobileMenu();
      }
    }
  });

  console.log('Mac mini marketing page initialized.');
});

