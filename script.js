  // Mobile hamburger menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navlinks');
  if (menuToggle && navLinksEl){
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Automation vertical filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  function applyFilter(f){
    document.querySelectorAll('.automation-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.vertical === f) ? '' : 'none';
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  const tierNames = ['Pilot', 'Growth', 'Scale'];
  const tierBtnClass = ['btn-outline', 'btn-gold', 'btn-outline'];

  function waLink(text){
    return 'https://wa.me/918950809500?text=' + encodeURIComponent(text);
  }

  // Renders the pricing grid from CMS-editable data instead of a hardcoded object.
  function renderPricing(verticalData){
    const grid = document.getElementById('automationGrid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.keys(verticalData).forEach(key => {
      const v = verticalData[key];
      tierNames.forEach((tierName, i) => {
        const desc = i === 2 ? `${v.tiers[1]}+ ${v.unit}` : `Up to ${v.tiers[i]} ${v.unit}`;
        const msg = `Hi VANTYX, I'm interested in the ${v.label} — ${tierName} automation package. Can you share more details?`;
        const featureList = (v.features[i] || '').split('\n').filter(Boolean);
        const card = document.createElement('div');
        card.className = 'plan-card automation-card';
        card.dataset.vertical = key;
        card.innerHTML = `
          <div class="plan-name">${v.label} — ${tierName}</div>
          <div class="plan-desc">${desc}</div>
          <div class="plan-price">${v.prices[i]} <span>${v.subs[i]}</span></div>
          <ul class="plan-list">${featureList.map(f => `<li>${f}</li>`).join('')}</ul>
          <a class="btn ${tierBtnClass[i]}" href="${waLink(msg)}">Get Started</a>
        `;
        grid.appendChild(card);
      });
    });
    applyFilter(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  }

  // Renders the FAQ list from CMS-editable data instead of hardcoded <details> blocks.
  function renderFaq(faqItems){
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = '';
    faqItems.forEach(item => {
      const details = document.createElement('details');
      details.innerHTML = `<summary>${item.question} <span>+</span></summary><p>${item.answer}</p>`;
      container.appendChild(details);
    });
  }

  // Pull editable content (pricing + FAQ) from the JSON file the admin dashboard writes to.
  fetch('/content/site-content.json')
    .then(res => res.json())
    .then(data => {
      renderPricing(data.pricing || {});
      renderFaq(data.faq || []);
    })
    .catch(() => {
      // If this fails (e.g. opened the HTML file directly instead of via a server), the page
      // still works — pricing grid and FAQ will just be empty until served properly.
      console.warn('Could not load content/site-content.json — pricing and FAQ will be empty.');
    });

  // Contact form — build a WhatsApp deep link from the entered fields instead of discarding them
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const business = contactForm.business.value.trim();
      const contact = contactForm.contact.value.trim();
      const need = contactForm.need.value.trim();
      let msg = `Hi VANTYX, I'm ${name}`;
      if (business) msg += ` from ${business}`;
      msg += `. You can reach me at ${contact}.`;
      if (need) msg += ` ${need}`;
      window.location.href = 'https://wa.me/918950809500?text=' + encodeURIComponent(msg);
    });
  }

(function(){
  const toggle = document.getElementById('vantyx-chat-toggle');
  const win = document.getElementById('vantyx-chat-window');
  const closeBtn = document.getElementById('vantyx-chat-close');
  const body = document.getElementById('vantyx-chat-body');
  const input = document.getElementById('vantyx-chat-input');
  const sendBtn = document.getElementById('vantyx-chat-send');
  const quickWrap = document.getElementById('vantyx-chat-quick');

  function setChatOpen(open){
    win.classList.toggle('open', open);
    win.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }

  toggle.addEventListener('click', () => setChatOpen(!win.classList.contains('open')));
  closeBtn.addEventListener('click', () => setChatOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && win.classList.contains('open')) setChatOpen(false);
  });

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  const waBase = 'https://wa.me/918950809500?text=';
  function waLink(msg){ return waBase + encodeURIComponent(msg); }

  // Simple keyword-matched knowledge base — answers instantly, no server needed
  const kb = [
    { keys: ['service','what do you do','offer'],
      reply: "We install a 24/7 WhatsApp Automation Engine for Dental Clinics, Hospitality (cafes/restaurants/hotels), and Real Estate — it recovers missed calls and after-hours inquiries automatically. Web Development and Short-Form Video are optional add-ons that feed leads into the engine." },
    { keys: ['price','pricing','cost','how much'],
      reply: "Pricing depends on your industry and volume — check the Plans section above for tiered pricing by business type, or message us on WhatsApp and we'll quote a low-friction pilot to get you live risk-free." },
    { keys: ['cafe','restaurant','coffee','hotel'],
      reply: "For cafes, restaurants & hotels — automated reservation confirmations, after-hours booking recovery, and daily owner reports. See the 'Cafes & Restaurants' or 'Hotels' filter under Plans for tiered pricing." },
    { keys: ['dental', 'clinic', 'doctor', 'hospital'],
      reply: "For dental clinics, clinics & hospitals — 24/7 missed-call recovery, automated appointment confirmations, and daily patient reports. See the Plans section for tiered pricing by patient volume." },
    { keys: ['real estate', 'property', 'site visit', 'buyer'],
      reply: "For real estate — automated site-visit scheduling, property inquiry confirmations, and AI-qualified buyer/renter routing. See the Plans section for tiered pricing by lead volume." },
    { keys: ['portfolio','work','example','demo'],
      reply: "You can see our live demo sites in the Portfolio section further up this page — including a dental clinic demo." },
    { keys: ['automation', 'whatsapp', 'n8n', 'workflow'],
      reply: "Our WhatsApp Automation Engine is the core of what we do — it responds in under 30 seconds, qualifies the lead, and books the appointment/table/site-visit automatically, 24/7. Which business type are you asking about?" },
    { keys: ['contact','human','talk','call','whatsapp me','number'],
      reply: "Sure — tap below and I'll open WhatsApp so you can chat directly with our team." },
    { keys: ['hi','hello','hey'],
      reply: "Hey there! 👋 Ask me about pricing, or a specific industry — dental & clinics, cafes & hotels, or real estate." }
  ];

  function findReply(msg){
    const lower = msg.toLowerCase();
    for(const item of kb){
      if(item.keys.some(k => lower.includes(k))) return item.reply;
    }
    return null;
  }

  function handleUserMessage(msg){
    addMsg(msg, 'user');
    const reply = findReply(msg);
    setTimeout(() => {
      if(reply){
        addMsg(reply, 'bot');
        if(reply.includes('WhatsApp') && reply.includes('tap below')){
          addMsg(`<a href="${waLink('Hi VANTYX, I need help — can we chat?')}" style="color:var(--gold-bright); font-weight:600;" target="_blank">Open WhatsApp Chat →</a>`, 'bot');
        }
      } else {
        addMsg(`I want to make sure you get the right answer — let's continue this on WhatsApp with our team directly.`, 'bot');
        addMsg(`<a href="${waLink('Hi VANTYX, I have a question: ' + msg)}" style="color:var(--gold-bright); font-weight:600;" target="_blank">Open WhatsApp Chat →</a>`, 'bot');
      }
    }, 450);
  }

  sendBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if(!val) return;
    handleUserMessage(val);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      const val = input.value.trim();
      if(!val) return;
      handleUserMessage(val);
      input.value = '';
    }
  });

  quickWrap.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON') return;
    const q = e.target.dataset.q;
    const labels = { services:'What services do you offer?', pricing:'What are your prices?', realestate:'Tell me about real estate automation', cafe:'Tell me about cafe automation', contact:'I want to talk to a human' };
    handleUserMessage(labels[q] || q);
  });
})();

// ============================================================
// LIGHTWEIGHT MOTION LAYER — zero dependencies, respects prefers-reduced-motion.
// Header scroll shadow + IntersectionObserver-based scroll reveals.
// ============================================================
(function(){
  // Sticky header shadow once the page scrolls
  const headerEl = document.querySelector('header');
  if (headerEl){
    const toggleHeaderShadow = () => headerEl.classList.toggle('is-scrolled', window.scrollY > 8);
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || typeof IntersectionObserver === 'undefined') return;

  // Groups of elements that fade/slide up as they enter the viewport, staggered within each group.
  // Runs on a short delay so the CMS-driven pricing/FAQ content (loaded via fetch) has time to render first.
  function initReveal(){
    const revealGroups = [
      '.service-grid .service-card',
      '.niche-grid .niche-pill',
      '.proof-grid .proof-card',
      '#plans .plan-card',
      '.port-list .port-row',
      '.team-grid .team-card',
      '.test-grid .test-card',
      '#faq details'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealGroups.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (el.classList.contains('reveal')) return; // already observed
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
        observer.observe(el);
      });
    });
  }

  initReveal();
  // Re-run shortly after load to catch the pricing/FAQ cards once the content fetch resolves.
  setTimeout(initReveal, 500);
})();
