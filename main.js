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

  chipTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-chip');
      
      chipTabs.forEach(t => {
        t.classList.remove('bg-white', 'text-black', 'shadow-sm');
        t.classList.add('text-gray-500', 'hover:text-black');
      });
      tab.classList.remove('text-gray-500', 'hover:text-black');
      tab.classList.add('bg-white', 'text-black', 'shadow-sm');

      chipCards.forEach(card => {
        const cardChip = card.getAttribute('data-chip');
        if (target === 'all' || target === cardChip) {
          card.style.display = 'block';
          card.classList.remove('opacity-40', 'scale-95');
          card.classList.add('opacity-100', 'scale-100');
        } else {
          card.classList.remove('opacity-100', 'scale-100');
          card.classList.add('opacity-40', 'scale-95');
        }
      });
    });
  });

  // 3. Interactive Ports View Switcher (Section 3)
  const portFilters = document.querySelectorAll('.port-filter-btn');
  const portsFront = document.getElementById('ports-front-view');
  const portsBack = document.getElementById('ports-back-view');

  portFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-port-view');
      portFilters.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      btn.classList.remove('bg-gray-100', 'text-gray-700');
      btn.classList.add('bg-blue-600', 'text-white');

      if (mode === 'all') {
        portsFront.parentElement.classList.remove('hidden');
        portsFront.classList.remove('hidden');
        portsBack.classList.remove('hidden');
      } else if (mode === 'front') {
        portsFront.classList.remove('hidden');
        portsBack.classList.add('hidden');
      } else if (mode === 'back') {
        portsFront.classList.add('hidden');
        portsBack.classList.remove('hidden');
      }
    });
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

  // 5. Buy Configurator Modal
  const buyModal = document.getElementById('buy-configurator-modal');
  const buyButtons = document.querySelectorAll('.trigger-buy-modal');
  const closeBuyModal = document.getElementById('close-buy-modal');

  const openModal = () => {
    buyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    buyModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  buyButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBuyModal) closeBuyModal.addEventListener('click', closeModal);
  if (buyModal) {
    buyModal.addEventListener('click', (e) => {
      if (e.target === buyModal) closeModal();
    });
  }

  // Live Price Calculation in Configurator
  const chipOptions = document.querySelectorAll('input[name="config-chip"]');
  const memOptions = document.querySelectorAll('input[name="config-memory"]');
  const ssdOptions = document.querySelectorAll('input[name="config-storage"]');
  const priceDisplay = document.getElementById('config-total-price');

  const updatePrice = () => {
    let base = 59900;
    const selectedChip = document.querySelector('input[name="config-chip"]:checked')?.value || 'm4';
    const selectedMem = document.querySelector('input[name="config-memory"]:checked')?.value || '16gb';
    const selectedSsd = document.querySelector('input[name="config-storage"]:checked')?.value || '256gb';

    if (selectedChip === 'm4pro') base += 90000;
    if (selectedMem === '24gb') base += 20000;
    if (selectedMem === '32gb') base += 40000;
    if (selectedMem === '64gb') base += 80000;
    if (selectedSsd === '512gb') base += 20000;
    if (selectedSsd === '1tb') base += 40000;
    if (selectedSsd === '2tb') base += 80000;

    if (priceDisplay) {
      priceDisplay.textContent = `₹${base.toLocaleString('en-IN')}.00*`;
    }
  };

  chipOptions.forEach(opt => opt.addEventListener('change', updatePrice));
  memOptions.forEach(opt => opt.addEventListener('change', updatePrice));
  ssdOptions.forEach(opt => opt.addEventListener('change', updatePrice));

  // 6. Smooth Scroll for all in-page anchors
  document.querySelectorAll('a[href^="#sec-"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
  window.toggleMobileMenu = function() {
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

  console.log('Mac mini marketing page initialized.');
});
