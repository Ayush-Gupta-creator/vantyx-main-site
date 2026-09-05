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

  // Dynamically generate tiered packages for every business vertical.
  // Tier 1 (Pilot) mirrors the low-friction ₹1k/₹2k outreach offer; Growth/Scale scale up with volume.
  const verticalData = {
    dental: { label: 'Dental Clinics', unit: 'patients/month', tiers: [100, 300, 600],
      prices: ['₹1,000','₹8,999','₹14,999+'], subs: ['setup + ₹2,000/mo','setup + ₹2,800/mo','setup + ₹4,000+/mo'],
      features: [
        ['24/7 WhatsApp Auto-Responder','Missed-Call Lead Recovery','Automated appointment confirmations','Google Sheets logging','Daily owner summary report'],
        ['Everything in Pilot','Recall reminders for check-ups/cleanings','Treatment follow-up sequences','AI-qualified inquiry routing','Priority monthly maintenance'],
        ['Everything in Growth','Multi-branch scheduling support','Custom reporting dashboard','Priced individually above 600/mo']
      ]},
    clinics: { label: 'Clinics & Hospitals', unit: 'patients/month', tiers: [100, 300, 600],
      prices: ['₹1,000','₹8,999','₹14,999+'], subs: ['setup + ₹2,000/mo','setup + ₹2,800/mo','setup + ₹4,000+/mo'],
      features: [
        ['24/7 WhatsApp Auto-Responder','Missed-Call Lead Recovery','Automated appointment confirmations','Google Sheets logging','Daily owner summary report'],
        ['Everything in Pilot','Prescription/refill reminders','Follow-up visit sequences','AI-qualified inquiry routing','Priority monthly maintenance'],
        ['Everything in Growth','Multi-doctor scheduling support','Custom reporting dashboard','Priced individually above 600/mo']
      ]},
    cafe: { label: 'Cafes & Restaurants', unit: 'orders/inquiries per month', tiers: [500, 1500, 3000],
      prices: ['₹1,000','₹9,999','₹15,999+'], subs: ['setup + ₹2,000/mo','setup + ₹3,000/mo','setup + ₹4,500+/mo'],
      features: [
        ['24/7 WhatsApp Auto-Responder','Automated order/booking confirmations','WhatsApp reservation reminders','Google Sheets logging','Daily owner summary report'],
        ['Everything in Pilot','Post-visit review requests','AI-qualified inquiry routing','Priority monthly maintenance'],
        ['Everything in Growth','Multi-outlet order routing','Custom reporting dashboard','Priced individually above 3,000/mo']
      ]},
    hotels: { label: 'Hotels', unit: 'bookings/month', tiers: [100, 300, 600],
      prices: ['₹1,000','₹11,999','₹18,999+'], subs: ['setup + ₹2,000/mo','setup + ₹3,800/mo','setup + ₹5,500+/mo'],
      features: [
        ['24/7 WhatsApp Auto-Responder','Automated booking confirmations','Missed-Call Lead Recovery','Google Sheets logging','Daily owner summary report'],
        ['Everything in Pilot','Check-in/checkout reminders','Post-stay review requests','AI-qualified inquiry routing','Priority monthly maintenance'],
        ['Everything in Growth','Channel-partner booking sync','Custom reporting dashboard','Priced individually above 600/mo']
      ]},
    realestate: { label: 'Real Estate', unit: 'leads/month', tiers: [100, 300, 600],
      prices: ['₹1,000','₹9,999','₹16,999+'], subs: ['setup + ₹2,000/mo','setup + ₹3,200/mo','setup + ₹4,800+/mo'],
      features: [
        ['24/7 WhatsApp Auto-Responder','Automated site-visit scheduling','Property inquiry confirmations','Google Sheets logging','Daily owner summary report'],
        ['Everything in Pilot','AI-qualified buyer/renter routing','Follow-up nurture sequences','Priority monthly maintenance'],
        ['Everything in Growth','Multi-project inquiry segmentation','Custom reporting dashboard','Priced individually above 600/mo']
      ]}
  };

  const tierNames = ['Pilot', 'Growth', 'Scale'];
  const tierBtnClass = ['btn-outline', 'btn-gold', 'btn-outline'];

  function waLink(text){
    return 'https://wa.me/918950809500?text=' + encodeURIComponent(text);
  }

  const grid = document.getElementById('automationGrid');
  Object.keys(verticalData).forEach(key => {
    const v = verticalData[key];
    tierNames.forEach((tierName, i) => {
      const desc = i === 2 ? `${v.tiers[1]}+ ${v.unit}` : `Up to ${v.tiers[i]} ${v.unit}`;
      const msg = `Hi VANTYX, I'm interested in the ${v.label} — ${tierName} automation package. Can you share more details?`;
      const card = document.createElement('div');
      card.className = 'plan-card automation-card';
      card.dataset.vertical = key;
      card.innerHTML = `
        <div class="plan-name">${v.label} — ${tierName}</div>
        <div class="plan-desc">${desc}</div>
        <div class="plan-price">${v.prices[i]} <span>${v.subs[i]}</span></div>
        <ul class="plan-list">${v.features[i].map(f => `<li>${f}</li>`).join('')}</ul>
        <a class="btn ${tierBtnClass[i]}" href="${waLink(msg)}">Get Started</a>
      `;
      grid.appendChild(card);
    });
  });
  applyFilter('all');

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
      reply: "Our headline offer is the 14-Day Risk-Free Pilot: ₹1,000 setup + ₹2,000/month. If it doesn't log real bookings in 30 days, you pay ₹0. Higher-volume tiers scale up from there depending on your industry — tell me your business type and I'll narrow it down." },
    { keys: ['cafe','restaurant','coffee','hotel'],
      reply: "For cafes, restaurants & hotels, the Pilot is ₹1,000 setup + ₹2,000/mo — automated reservation confirmations, after-hours booking recovery, and daily owner reports. Higher-volume tiers scale from there. See the 'Cafes & Restaurants' or 'Hotels' filter under Plans." },
    { keys: ['dental', 'clinic', 'doctor', 'hospital'],
      reply: "For dental clinics, clinics & hospitals, the Pilot is ₹1,000 setup + ₹2,000/mo — 24/7 missed-call recovery, automated appointment confirmations, and daily patient reports." },
    { keys: ['real estate', 'property', 'site visit', 'buyer'],
      reply: "For real estate, the Pilot is ₹1,000 setup + ₹2,000/mo — automated site-visit scheduling, property inquiry confirmations, and AI-qualified buyer/renter routing." },
    { keys: ['portfolio','work','example','demo'],
      reply: "You can see our live demo sites in the Portfolio section further up this page — including a dental clinic demo." },
    { keys: ['automation', 'whatsapp', 'n8n', 'workflow'],
      reply: "Our WhatsApp Automation Engine is the core of what we do — it responds in under 30 seconds, qualifies the lead, and books the appointment/table/site-visit automatically, 24/7. Which business type are you asking about?" },
    { keys: ['contact','human','talk','call','whatsapp me','number'],
      reply: "Sure — tap below and I'll open WhatsApp so you can chat directly with our team." },
    { keys: ['hi','hello','hey'],
      reply: "Hey there! 👋 Ask me about the 14-Day Risk-Free Pilot, pricing, or a specific industry — dental & clinics, cafes & hotels, or real estate." }
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

  // Groups of elements that fade/slide up as they enter the viewport, staggered within each group
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
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
      observer.observe(el);
    });
  });
})();
