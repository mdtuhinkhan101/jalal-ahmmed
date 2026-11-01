/* =====================================================================
   main.js: Jalal Ahmmed's academic website
   ---------------------------------------------------------------------
   Reads data.json and draws every section of the page from it.
   You should never need to edit this file to update content:
   change data.json instead.

   Contents
     A. Helpers (escaping, simple formatting, icons)
     B. Section renderers (one function per section)
     C. Publications: filters, sorting, BibTeX
     D. International research network graph
     E. Structured data (Schema.org JSON-LD) built from data.json
     F. Page behaviour: theme toggle, menu, scroll spy
     G. Grad-CAM-style attention map in the hero
     H. Start-up: fetch data.json and render
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ===================================================================
     A. HELPERS
     =================================================================== */

  /** Escape text so it is shown literally and can't break the HTML. */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Escape, then allow **bold** and *italic* inside data.json text. */
  function fmt(value) {
    return esc(value)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  /** Remove the bold and italic markers for plain-text uses (e.g. structured data). */
  function plain(value) {
    return String(value || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
  }

  /** Safe external link attributes. */
  var EXT = ' target="_blank" rel="noopener"';

  /** Fill an element by id with HTML (ignores missing elements). */
  function fill(id, html) {
    var el = $(id);
    if (el) el.innerHTML = html;
    return el;
  }

  /** Short version of a paper title, e.g. "LBNet" from "LBNet: An Optimized ...". */
  function shortTitle(title) {
    var head = String(title).split(':')[0];
    if (head.length <= 28) return head;
    var words = String(title).split(' ');
    return words.slice(0, 5).join(' ') + '…';
  }

  /** Brand icons (Simple Icons, CC0) used for profile links. */
  var ICONS = {
    scholar: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>',
    orcid: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>',
    researchgate: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53h-.005a3.334 3.334 0 0 0 .113.438c.245.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.353-.306-.203-.517-.454-.67-.915a3.136 3.136 0 0 1-.147-.762 17.366 17.367 0 0 1-.034-.656c-.01-.26-.014-.572-.014-.939a26.401 26.403 0 0 1 .014-.938 15.821 15.822 0 0 1 .035-.656 3.19 3.19 0 0 1 .148-.76 1.89 1.89 0 0 1 .742-1.01c.344-.244.593-.352 1.137-.352.508 0 .815.096 1.144.303.33.207.528.492.764.925.047.094.111.118.198.07l1.044-.43c.075-.048.09-.115.042-.199a3.549 3.549 0 0 0-.466-.742 3 3 0 0 0-.679-.607 3.313 3.313 0 0 0-.903-.41A4.068 4.068 0 0 0 19.586 0zM8.217 5.836c-1.69 0-3.036.086-4.297.086-1.146 0-2.291 0-3.007-.029v.831l1.088.2c.744.144 1.174.488 1.174 2.264v11.288c0 1.777-.43 2.12-1.174 2.263l-1.088.2v.832c.773-.029 2.12-.086 3.465-.086 1.29 0 2.951.057 3.667.086v-.831l-1.49-.2c-.773-.115-1.174-.487-1.174-2.264v-4.784c.688.057 1.29.057 2.206.057 1.748 3.123 3.41 5.472 4.355 6.56.86 1.032 2.177 1.691 3.839 1.691.487 0 1.003-.086 1.318-.23v-.744c-1.031 0-2.063-.716-2.808-1.518-1.26-1.376-2.95-3.582-4.355-6.074 2.32-.545 4.04-2.722 4.04-4.9 0-3.208-2.492-4.698-5.758-4.698zm-.515 1.29c2.406 0 3.839 1.26 3.839 3.552 0 2.263-1.547 3.782-4.097 3.782-.974 0-1.404-.03-2.063-.086v-7.19c.66-.059 1.547-.059 2.32-.059z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'
  };

  /** Round icon links for the hero and footer. */
  function profileLinks(data) {
    var name = data.profile.name;
    var items = (data.links || []).map(function (l) {
      return '<li><a class="icon-link" href="' + esc(l.url) + '" rel="me noopener" target="_blank" ' +
        'aria-label="' + esc(name + ' on ' + l.label) + '" title="' + esc(l.label) + '">' +
        (ICONS[l.icon] || ICONS.website) + '</a></li>';
    });
    if (data.profile.email) {
      items.push('<li><a class="icon-link" href="mailto:' + esc(data.profile.email) + '" ' +
        'aria-label="' + esc('Email ' + name) + '" title="Email">' + ICONS.email + '</a></li>');
    }
    return items.join('');
  }

  /* ===================================================================
     B. SECTION RENDERERS
     =================================================================== */

  function renderHero(data) {
    var p = data.profile;
    fill('hero-position', esc(p.position + ' in ' + p.department.replace(/^Department of /, '')) +
      '<br>' + esc(p.university + ', ' + p.location));
    fill('hero-tagline', fmt(p.tagline) + ' ' + esc(p.role + ' at the ' + p.group + ', supervised by Dr. ' +
      p.supervisor.name.replace(/,\s*PhD$/, '') + '.'));
    fill('hero-links', profileLinks(data));
    fill('footer-links', profileLinks(data));

    if (p.photo) {
      $('hero-photo').src = p.photo;
      $('hero-photo').alt = p.photoAlt || ('Portrait of ' + p.name);
    }
    if (p.photoWebp) $('hero-photo-webp').srcset = p.photoWebp;
    if (p.cv) $('cv-link').href = p.cv;
  }

  function renderAbout(data) {
    fill('about-text', (data.profile.about || []).map(function (para) {
      return '<p>' + fmt(para) + '</p>';
    }).join(''));
    fill('interests', (data.profile.interests || []).map(function (i) {
      return '<li class="tag">' + esc(i) + '</li>';
    }).join(''));
  }

  function renderMetrics(data) {
    var m = data.metrics || {};
    var items = [
      { value: m.citations, label: 'Citations', note: 'Total citations across all works' },
      { value: m.hIndex, label: 'h-index', note: m.hIndex + (m.hIndex === 1 ? ' paper' : ' papers') + ' cited at least ' + m.hIndex + (m.hIndex === 1 ? ' time' : ' times') + ' each' },
      { value: m.i10Index, label: 'i10-index', note: m.i10Index + (m.i10Index === 1 ? ' paper' : ' papers') + ' with at least 10 citations' }
    ];
    fill('metrics-list', items.map(function (it) {
      // dt comes first in the markup (correct semantics); CSS order shows the number on top
      return '<div class="metric flex flex-col">' +
        '<dt class="metric-label order-2">' + esc(it.label) + '</dt>' +
        '<dd class="metric-value order-1">' + esc(it.value) + '</dd>' +
        '<dd class="muted order-3 mt-1 text-sm">' + esc(it.note) + '</dd></div>';
    }).join(''));

    fill('metrics-source', 'Source: <a href="' + esc(m.sourceUrl) + '"' + EXT + '>' + esc(m.source) +
      '</a>, ' + esc(m.asOf) + '.');

    // Optional bar chart: add {"year": 2025, "citations": 12} items to
    // metrics.citationsByYear in data.json and it appears automatically.
    var years = m.citationsByYear || [];
    if (years.length) {
      var chart = $('citations-chart');
      chart.classList.remove('hidden');
      var max = Math.max.apply(null, years.map(function (y) { return y.citations; })) || 1;
      var W = 520, H = 180, pad = 28, bw = Math.min(56, (W - pad * 2) / years.length - 12);
      var step = (W - pad * 2) / years.length;
      var bars = years.map(function (y, i) {
        var h = (y.citations / max) * (H - 60);
        var x = pad + i * step + (step - bw) / 2;
        return '<rect x="' + x + '" y="' + (H - 30 - h) + '" width="' + bw + '" height="' + h + '" rx="3" class="fill-teal dark:fill-teal-bright"></rect>' +
          '<text x="' + (x + bw / 2) + '" y="' + (H - 36 - h) + '" text-anchor="middle" class="net-node-text">' + esc(y.citations) + '</text>' +
          '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" class="net-sub-text">' + esc(y.year) + '</text>';
      }).join('');
      chart.innerHTML = '<h3 class="text-xl font-medium">Citations per year</h3>' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" class="mt-4 w-full max-w-xl" role="img" aria-label="Citations per year">' + bars + '</svg>';
    }
  }

  function renderEducation(data) {
    fill('education-list', (data.education || []).map(function (e) {
      return '<li class="timeline-item">' +
        '<p class="muted text-sm">' + esc(e.period) + '</p>' +
        '<h3 class="mt-1 text-2xl font-medium">' + esc(e.degree) + '</h3>' +
        '<p class="font-medium">' + esc(e.institution) + '</p>' +
        (e.result ? '<p class="mt-2"><strong>' + esc(e.result) + '</strong></p>' : '') +
        (e.details || []).map(function (d) { return '<p class="mt-2">' + fmt(d) + '</p>'; }).join('') +
        '</li>';
    }).join(''));

    fill('achievements-list', (data.achievements || []).map(function (a) {
      return '<li class="grid gap-x-5 sm:grid-cols-[3.5rem_1fr]">' +
        '<span class="pub-year">' + esc(a.year) + '</span>' +
        '<div><p class="font-medium">' + fmt(a.title) + '</p>' +
        (a.detail ? '<p class="muted text-[0.97rem]">' + fmt(a.detail) + '</p>' : '') + '</div></li>';
    }).join(''));
  }

  function renderExperience(data) {
    fill('experience-list', (data.experience || []).map(function (x) {
      var sup = x.supervisor
        ? '<p class="muted mt-1">Supervisor: ' + (x.supervisorUrl
            ? '<a href="' + esc(x.supervisorUrl) + '"' + EXT + '>' + esc(x.supervisor) + '</a>'
            : esc(x.supervisor)) + '</p>'
        : '';
      var points = (x.points || []);
      var body = points.length > 1
        ? '<ul class="mt-4 list-disc space-y-2 pl-5 marker:text-teal dark:marker:text-teal-bright">' +
            points.map(function (pt) { return '<li>' + fmt(pt) + '</li>'; }).join('') + '</ul>'
        : points.map(function (pt) { return '<p class="mt-2">' + fmt(pt) + '</p>'; }).join('');
      return '<li class="timeline-item">' +
        '<p class="muted text-sm">' + esc(x.period) + '</p>' +
        '<h3 class="mt-1 text-2xl font-medium">' + esc(x.role) + '</h3>' +
        '<p class="font-medium">' + esc(x.organization) + '</p>' + sup + body + '</li>';
    }).join(''));
  }

  function renderProjects(data) {
    fill('projects-list', (data.projects || []).map(function (p) {
      var links = (p.links || []).map(function (l) {
        return '<a class="meta-link" href="' + esc(l.url) + '"' + EXT + '>' + esc(l.label) + '</a>';
      }).join('');
      return '<article class="panel">' +
        '<div class="flex flex-wrap items-baseline justify-between gap-2">' +
        '<h3 class="text-2xl font-medium">' + esc(p.name) + '</h3>' +
        '<p class="muted text-sm">' + fmt(p.label) + '</p></div>' +
        '<p class="mt-1 font-medium">' + fmt(p.subtitle) + '</p>' +
        '<p class="mt-3">' + fmt(p.description) + '</p>' +
        (links ? '<div class="mt-4 flex flex-wrap gap-2">' + links + '</div>' : '') +
        '</article>';
    }).join(''));

    fill('ongoing-list', (data.ongoing || []).map(function (o) {
      return '<li><p class="font-medium">' + fmt(o.title) + '</p><p class="muted">' + fmt(o.status) + '</p></li>';
    }).join(''));
  }

  function renderSkills(data) {
    fill('skills-list', (data.skills || []).map(function (s, i, all) {
      var wide = (all.length % 2 === 1 && i === all.length - 1) ? ' md:col-span-2' : '';
      return '<div class="' + wide.trim() + '"><dt class="font-serif text-xl font-medium">' + esc(s.group) + '</dt>' +
        '<dd class="mt-3 flex flex-wrap gap-2">' +
        s.items.map(function (it) { return '<span class="tag">' + esc(it) + '</span>'; }).join('') +
        '</dd></div>';
    }).join(''));
  }

  function renderService(data) {
    var s = data.service || {};
    fill('reviewer-list', (s.reviewer || []).map(function (r) {
      return '<li><span class="font-medium">' + esc(r.journal) + '</span><br>' +
        '<span class="muted text-[0.95rem]">' + esc(r.detail) + '</span></li>';
    }).join(''));
    fill('committee-list', (s.committees || []).map(function (c) {
      return '<li><span class="font-medium">' + esc(c.name) + '</span>, ' + esc(c.role).toLowerCase() + '<br>' +
        '<span class="muted text-[0.95rem]">' + esc(c.detail) + '</span></li>';
    }).join(''));
  }

  function renderRepos(data) {
    var gh = (data.links || []).filter(function (l) { return l.icon === 'github'; })[0];
    if (gh) fill('oss-intro', 'Code for my papers and side projects. Everything is on <a href="' + esc(gh.url) + '"' + EXT + '>GitHub</a>.');
    fill('repo-list', (data.repositories || []).map(function (r) {
      return '<article class="panel flex flex-col">' +
        '<h3 class="text-xl font-medium"><a class="text-ink dark:text-mist" href="' + esc(r.url) + '"' + EXT + '>' + esc(r.name) + '</a></h3>' +
        '<p class="mt-2 flex-1">' + fmt(r.description) + '</p>' +
        '<p class="muted mt-4 text-sm">' + esc((r.tech || []).join(', ')) + '</p>' +
        '<a class="meta-link mt-4 self-start" href="' + esc(r.url) + '"' + EXT + '>View repository</a>' +
        '</article>';
    }).join(''));
  }

  function renderContact(data) {
    var p = data.profile, c = data.contact || {};
    var tel = String(p.phone || '').replace(/[^\d+]/g, '');
    fill('contact-body',
      '<p class="text-xl leading-relaxed">' + fmt(c.message) + '</p>' +
      '<address class="mt-8 space-y-4 not-italic">' +
        '<p><span class="muted block text-sm">Email</span><a class="text-lg" href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></p>' +
        (p.phone ? '<p><span class="muted block text-sm">Phone</span><a class="text-lg" href="tel:' + esc(tel) + '">' + esc(p.phone) + '</a></p>' : '') +
        '<p><span class="muted block text-sm">Location</span><span class="text-lg">' + esc(c.address || p.location) + '</span></p>' +
      '</address>' +
      '<a class="btn-primary mt-8" href="mailto:' + esc(p.email) + '">Send an email</a>');
  }

  function renderFooter(data) {
    $('year').textContent = new Date().getFullYear();
    var d = data.meta && data.meta.lastUpdated ? new Date(data.meta.lastUpdated + 'T00:00:00') : null;
    if (d && !isNaN(d)) {
      $('last-updated').textContent = 'Last updated ' +
        d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) + '.';
    }
  }

  /* ===================================================================
     C. PUBLICATIONS
     =================================================================== */

  var PUB_TYPES = [
    { key: 'journal', label: 'Journal articles', single: 'Journal article' },
    { key: 'conference', label: 'Conference papers', single: 'Conference paper' },
    { key: 'preprint', label: 'Preprints', single: 'Preprint' },
    { key: 'dataset', label: 'Datasets', single: 'Dataset' }
  ];
  var pubState = { filter: 'all', sort: 'year' };

  /** Bold every spelling of the site owner's name in an author list. */
  function authorList(authors, ownNames) {
    return (authors || []).map(function (a) {
      return ownNames.indexOf(a) !== -1 ? '<strong>' + esc(a) + '</strong>' : esc(a);
    }).join(', ');
  }

  /** Build a BibTeX entry from the publication's data. */
  function bibtex(p) {
    var first = String(p.authors[0] || 'author').split(' ').pop().replace(/[^A-Za-z]/g, '').toLowerCase();
    var word = String(p.title).split(/[\s:]+/)[0].replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    var key = first + p.year + word;
    var authors = p.authors.map(function (a) {
      var parts = a.trim().split(' ');
      var last = parts.pop();
      return last + ', ' + parts.join(' ');
    }).join(' and ');
    var kind = p.type === 'conference' ? 'inproceedings' : (p.type === 'dataset' ? 'misc' : 'article');
    var fields = [['title', plain(p.title).replace(/’/g, "'")], ['author', authors]];
    if (p.type === 'conference') fields.push(['booktitle', p.venueDetail || p.venue]);
    else if (p.type === 'dataset') fields.push(['howpublished', p.venue + (p.venueDetail ? ', ' + p.venueDetail : '')]);
    else fields.push(['journal', p.type === 'preprint' && p.doi ? 'arXiv preprint ' + p.venueDetail.split(' ')[0] : p.venue]);
    var vol = /vol\. (\d+)/.exec(p.venueDetail || '');
    var pages = /(?:pp\.|art\.) ([\d–-]+)/.exec(p.venueDetail || '');
    if (p.type === 'journal' && vol) fields.push(['volume', vol[1]]);
    if (p.type === 'journal' && pages) fields.push(['pages', pages[1].replace('–', '--')]);
    fields.push(['year', String(p.year)]);
    if (p.doi) fields.push(['doi', p.doi]);
    if (!p.doi && p.url) fields.push(['url', p.url]);
    return '@' + kind + '{' + key + ',\n' + fields.map(function (f) {
      return '  ' + f[0] + ' '.repeat(Math.max(1, 13 - f[0].length)) + '= {' + f[1] + '}';
    }).join(',\n') + '\n}';
  }

  function pubItem(p, ownNames, showType) {
    var typeInfo = PUB_TYPES.filter(function (t) { return t.key === p.type; })[0] || {};
    var title = p.url
      ? '<a href="' + esc(p.url) + '"' + EXT + '>' + fmt(p.title) + '</a>'
      : fmt(p.title);
    var badges = [];
    if (typeof p.citations === 'number') {
      badges.push('<span class="cite-count" title="Google Scholar citations">Cited by ' + p.citations + '</span>');
    }
    if (p.quartile) badges.push('<span class="badge-q1">' + esc(p.quartile) + '</span>');
    if (p.firstAuthor) badges.push('<span class="badge-first">First author</span>');
    if (p.doi) badges.push('<a class="meta-link" href="https://doi.org/' + esc(p.doi) + '"' + EXT + '>DOI</a>');
    if (p.type === 'preprint' && p.url) badges.push('<a class="meta-link" href="' + esc(p.url) + '"' + EXT + '>arXiv</a>');
    if (p.code) badges.push('<a class="meta-link" href="' + esc(p.code) + '"' + EXT + '>Code</a>');
    if (p.dataset) badges.push('<a class="meta-link" href="' + esc(p.dataset) + '"' + EXT + '>Dataset</a>');

    return '<article class="pub">' +
      '<p class="pub-year">' + esc(p.year) + '</p>' +
      '<div>' +
        (showType ? '<p class="muted text-sm">' + esc(typeInfo.single || '') + '</p>' : '') +
        '<h4 class="pub-title">' + title + '</h4>' +
        '<p class="pub-authors muted mt-1">' + authorList(p.authors, ownNames) + '</p>' +
        '<p class="mt-1"><cite class="not-italic font-medium">' + esc(p.venue) + '</cite>' +
          (p.venueDetail ? ', ' + esc(p.venueDetail) : '') + '</p>' +
        (p.summary ? '<p class="mt-2 text-[0.97rem]">' + fmt(p.summary) + '</p>' : '') +
        (badges.length ? '<div class="mt-3 flex flex-wrap items-center gap-2">' + badges.join('') + '</div>' : '') +
        '<details class="bibtex mt-3"><summary class="cursor-pointer text-sm font-medium text-teal dark:text-teal-bright">BibTeX</summary>' +
          '<pre><code>' + esc(bibtex(p)) + '</code></pre>' +
          '<button type="button" class="copy-btn meta-link mt-2">Copy BibTeX</button></details>' +
      '</div></article>';
  }

  function sortPubs(list) {
    var byCites = function (p) { return typeof p.citations === 'number' ? p.citations : -1; };
    return list.slice().sort(function (a, b) {
      if (pubState.sort === 'citations') return byCites(b) - byCites(a) || b.year - a.year;
      return b.year - a.year || byCites(b) - byCites(a);
    });
  }

  function renderPublications(data) {
    var pubs = data.publications || [];
    var own = data.profile.authorNames || [data.profile.name];

    // Filter buttons with counts
    var counts = {};
    pubs.forEach(function (p) { counts[p.type] = (counts[p.type] || 0) + 1; });
    var buttons = [{ key: 'all', label: 'All' }].concat(PUB_TYPES.filter(function (t) { return counts[t.key]; }));
    fill('pub-filters', buttons.map(function (b) {
      var n = b.key === 'all' ? pubs.length : counts[b.key];
      return '<button type="button" class="filter-btn" data-filter="' + b.key + '" aria-pressed="' +
        (pubState.filter === b.key) + '">' + esc(b.label) + ' <span class="opacity-60">' + n + '</span></button>';
    }).join(''));

    var scholar = (data.links || []).filter(function (l) { return l.icon === 'scholar'; })[0];
    if (scholar) {
      fill('pub-intro', esc(pubs.length) + ' works by ' + esc(data.profile.name) +
        ', with citation counts from Google Scholar. The current list is on <a href="' + esc(scholar.url) + '"' + EXT + '>Google Scholar</a>.');
    }

    var visible = pubs.filter(function (p) { return pubState.filter === 'all' || p.type === pubState.filter; });
    var html = '';
    if (pubState.sort === 'year') {
      // Grouped by type, newest first inside each group
      PUB_TYPES.forEach(function (t) {
        var group = sortPubs(visible.filter(function (p) { return p.type === t.key; }));
        if (!group.length) return;
        html += '<div class="mt-10"><h3 class="text-2xl font-medium">' + esc(t.label) + '</h3>' +
          group.map(function (p) { return pubItem(p, own, false); }).join('') + '</div>';
      });
    } else {
      // One list ranked by citations
      html = '<div class="mt-6">' + sortPubs(visible).map(function (p) { return pubItem(p, own, true); }).join('') + '</div>';
    }
    fill('pub-list', html);
    $('pub-status').textContent = 'Showing ' + visible.length + ' publications.';

    // Wire up controls (re-render on change)
    Array.prototype.forEach.call(document.querySelectorAll('#pub-filters .filter-btn'), function (btn) {
      btn.addEventListener('click', function () {
        pubState.filter = btn.getAttribute('data-filter');
        renderPublications(data);
      });
    });
  }

  // Sorting select (bound once)
  function bindPubSort(data) {
    $('pub-sort').addEventListener('change', function (e) {
      pubState.sort = e.target.value;
      renderPublications(data);
    });
  }

  // Copy BibTeX buttons (event delegation, works for re-rendered lists)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var code = btn.parentElement.querySelector('code');
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code.textContent).then(function () {
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = 'Copy BibTeX'; }, 1600);
    });
  });

  /* ===================================================================
     D. INTERNATIONAL RESEARCH NETWORK
     Joint-paper counts are calculated automatically by matching each
     collaborator's "matchNames" against the publication author lists.
     =================================================================== */

  var COUNTRY_COLOURS = ['#157A6E', '#E0A82E', '#5B7FD6', '#C25E8A', '#7A8F2E', '#8A63C9'];

  function renderCollaborators(data) {
    var pubs = data.publications || [];
    var collabs = (data.collaborators || []).map(function (c) {
      var joint = pubs.filter(function (p) {
        return (p.authors || []).some(function (a) { return (c.matchNames || [c.name]).indexOf(a) !== -1; });
      });
      return Object.assign({}, c, { joint: joint });
    });

    // Collaborators appear in the same order as in data.json

    // Countries and institutions
    var countries = [];
    collabs.forEach(function (c) { if (countries.indexOf(c.country) === -1) countries.push(c.country); });
    var institutions = [];
    collabs.forEach(function (c) { if (institutions.indexOf(c.institution) === -1) institutions.push(c.institution); });
    var colourOf = {};
    countries.forEach(function (c, i) { colourOf[c] = COUNTRY_COLOURS[i % COUNTRY_COLOURS.length]; });

    fill('collab-summary', esc(data.profile.name) + ' has co-authored with ' + collabs.length + ' researchers at ' +
      institutions.length + ' institutions in ' + countries.length + ' countries.');

    fill('country-list', countries.map(function (c) {
      var n = collabs.filter(function (x) { return x.country === c; }).length;
      return '<li class="country-chip"><span class="inline-block h-2.5 w-2.5 rounded-full" style="background:' +
        colourOf[c] + '"></span>' + esc(c) + ' <span class="muted">' + n + '</span></li>';
    }).join(''));

    fill('collab-list', collabs.map(function (c) {
      var name = c.url ? '<a class="text-ink dark:text-mist" href="' + esc(c.url) + '"' + EXT + '>' + esc(c.name) + '</a>' : esc(c.name);
      var papers = c.joint.map(function (p) { return esc(p.short || shortTitle(p.title)); }).join(', ');
      // Avoid "..., Bangladesh, Bangladesh" when the institution name already includes the country
      var place = c.institution.indexOf(c.country) !== -1 ? c.institution : c.institution + ', ' + c.country;
      return '<li class="collab">' +
        '<div class="flex flex-wrap items-baseline justify-between gap-x-3">' +
          '<h3 class="collab-name">' + name + '</h3>' +
          (c.title ? '<span class="' + (c.highlight ? 'badge-q1' : 'badge-first') + '">' + esc(c.title) + '</span>' : '') +
        '</div>' +
        '<p class="mt-1">' + esc(place) + '</p>' +
        '<p class="muted text-[0.95rem]">' + esc(c.department) + '</p>' +
        (c.joint.length ? '<p class="mt-1 text-sm"><span class="font-semibold">' + c.joint.length +
          (c.joint.length === 1 ? ' joint publication' : ' joint publications') + ':</span> <span class="muted">' + papers + '</span></p>' : '') +
        '</li>';
    }).join(''));

    drawNetwork(data, collabs, colourOf);
  }

  /** Radial co-authorship graph drawn as SVG. */
  function drawNetwork(data, collabs, colourOf) {
    var W = 760, H = 500, cx = W / 2, cy = H / 2, R = 175;
    // Group by country so neighbours on the circle share an institution/country
    var nodes = collabs.slice().sort(function (a, b) {
      return a.country.localeCompare(b.country) || a.institution.localeCompare(b.institution);
    });
    var maxJ = Math.max.apply(null, nodes.map(function (n) { return n.joint.length; }).concat([1]));

    var edges = '', dots = '', labels = '';
    nodes.forEach(function (n, i) {
      var ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      var x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      var w = 1 + (n.joint.length / maxJ) * 5;
      var r = 7 + (n.joint.length / maxJ) * 8;
      var right = Math.cos(ang) >= -0.01;
      var lx = x + (right ? r + 8 : -(r + 8));
      var anchor = right ? 'start' : 'end';
      if (Math.abs(Math.cos(ang)) < 0.2) { lx = x; anchor = 'middle'; }
      var ly = Math.abs(Math.cos(ang)) < 0.2 ? (Math.sin(ang) < 0 ? y - r - 18 : y + r + 16) : y;

      edges += '<line class="net-edge" x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) +
        '" stroke-width="' + w.toFixed(1) + '" stroke-linecap="round"></line>';
      dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + colourOf[n.country] + '">' +
        '<title>' + esc(n.name + ', ' + n.institution + ' (' + n.joint.length + ' joint)') + '</title></circle>';
      labels += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + anchor + '" class="net-node-text">' + esc(n.name) + '</text>' +
        '<text x="' + lx.toFixed(1) + '" y="' + (ly + 16).toFixed(1) + '" text-anchor="' + anchor + '" class="net-sub-text">' +
        esc(n.institution.replace('University', 'Univ.').replace(', Bangladesh', '')) + '</text>';
    });

    var photo = data.profile.photo;
    var centre = '<defs><clipPath id="me-clip"><circle cx="' + cx + '" cy="' + cy + '" r="40"></circle></clipPath></defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="45" fill="#F2C14E"></circle>' +
      '<image href="' + esc(photo) + '" x="' + (cx - 40) + '" y="' + (cy - 40) + '" width="80" height="80" clip-path="url(#me-clip)" preserveAspectRatio="xMidYMid slice"></image>';

    fill('network-graph', '<svg viewBox="0 0 ' + W + ' ' + H + '" class="mx-auto block w-full min-w-[560px] max-w-[760px]" role="img" ' +
      'aria-label="' + esc('Co-authorship network of ' + data.profile.name + ' with ' + nodes.length + ' collaborators') + '">' +
      edges + centre + dots + labels + '</svg>');

    // On narrow screens the graph scrolls sideways: start with it centred on you
    var box = $('network-graph');
    box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
  }

  /* ===================================================================
     E. STRUCTURED DATA (Schema.org JSON-LD) FROM data.json
     Google reads this to understand who the page is about and which
     papers are yours.
     =================================================================== */

  function renderStructuredData(data) {
    var p = data.profile, site = data.meta.siteUrl;
    var personId = site + '#person';
    var abs = function (path) { return /^https?:/.test(path) ? path : site + String(path).replace(/^\.?\//, ''); };

    var person = {
      '@type': 'Person',
      '@id': personId,
      name: p.name,
      alternateName: p.alternateNames,
      url: site,
      image: abs('assets/img/jalal-ahmmed.jpg'),
      jobTitle: p.position,
      description: p.position + ' in Explainable AI and Computer Vision at ' + p.university + ', ' + p.location + '. ' + p.role + ' at ' + p.group + '.',
      email: 'mailto:' + p.email,
      telephone: p.phone,
      address: { '@type': 'PostalAddress', addressLocality: p.location.split(',')[0], addressCountry: 'BD' },
      worksFor: {
        '@type': 'CollegeOrUniversity', name: p.university, url: p.universityUrl,
        department: { '@type': 'Organization', name: p.department }
      },
      alumniOf: (data.education || []).map(function (e) {
        return { '@type': 'EducationalOrganization', name: e.institution.split(',')[0] };
      }),
      knowsAbout: p.interests,
      sameAs: (data.links || []).map(function (l) { return l.url; }),
      colleague: (data.collaborators || []).map(function (c) {
        return { '@type': 'Person', name: c.name, affiliation: { '@type': 'Organization', name: c.institution } };
      })
    };

    var works = (data.publications || []).map(function (pub) {
      var item = {
        '@type': pub.type === 'dataset' ? 'Dataset' : 'ScholarlyArticle',
        name: plain(pub.title),
        author: pub.authors.map(function (a) {
          return (p.authorNames || []).indexOf(a) !== -1 ? { '@id': personId } : { '@type': 'Person', name: a };
        }),
        datePublished: String(pub.year)
      };
      if (pub.type !== 'dataset') item.headline = plain(pub.title).slice(0, 110);
      if (pub.url) item.url = pub.url;
      if (pub.doi) {
        item['@id'] = 'https://doi.org/' + pub.doi;
        item.identifier = { '@type': 'PropertyValue', propertyID: 'DOI', value: pub.doi };
      }
      if (pub.type === 'journal') item.isPartOf = { '@type': 'Periodical', name: pub.venue, publisher: { '@type': 'Organization', name: pub.publisher } };
      else if (pub.venue) item.publisher = { '@type': 'Organization', name: pub.venue };
      if (pub.type === 'dataset') item.description = plain(pub.title) + ', published on ' + pub.venue + '.';
      return item;
    });

    var graph = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', '@id': site + '#website', url: site, name: p.name, inLanguage: 'en' },
        {
          '@type': 'ProfilePage', '@id': site + '#profilepage', url: site,
          name: document.title, dateModified: data.meta.lastUpdated,
          isPartOf: { '@id': site + '#website' }, mainEntity: { '@id': personId }
        },
        person
      ].concat(works)
    };
    $('structured-data').textContent = JSON.stringify(graph);
  }

  /* ===================================================================
     F. PAGE BEHAVIOUR
     =================================================================== */

  // Theme toggle
  var themeBtn = $('theme-toggle');
  function syncThemeButton() {
    themeBtn.setAttribute('aria-label', root.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncThemeButton();
  themeBtn.addEventListener('click', function () {
    var dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButton();
    if (attention) attention.redraw();
  });

  // Mobile menu
  var menuBtn = $('menu-toggle'), mobileNav = $('mobile-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.classList.toggle('hidden', !open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Scroll spy: mark the nav link of the section on screen
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('main section[id]'), function (s) { spy.observe(s); });
  }

  /* ===================================================================
     G. ATTENTION MAP (hero)
     A grid coloured like a Grad-CAM heatmap. The hot spot rests on the
     portrait and follows the pointer. Pauses when off-screen; static for
     visitors who prefer reduced motion.
     =================================================================== */
  var attention = (function () {
    var box = $('attention'), canvas = $('attention-canvas');
    if (!box || !canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');

    var PALETTE = {
      light: ['#EDF1F5', '#CFE0E4', '#8CC7BE', '#3FA98F', '#A9D46F', '#F2C14E'],
      dark: ['#111C33', '#1D3A6B', '#1F7F8C', '#2FB38A', '#9ED36A', '#F2D04B']
    };
    function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
    var ramps = { light: PALETTE.light.map(rgb), dark: PALETTE.dark.map(rgb) };
    function colour(v, ramp) {
      v = Math.max(0, Math.min(1, v)) * (ramp.length - 1);
      var i = Math.min(Math.floor(v), ramp.length - 2), t = v - i, a = ramp[i], b = ramp[i + 1];
      return 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * t); }).join(',') + ')';
    }

    var CELLS = 18, noise = [];
    for (var n = 0; n < CELLS * CELLS; n++) noise.push(Math.random());
    var size = 0, focus = { x: 0.5, y: 0.5 }, target = { x: 0.5, y: 0.5 };
    var visible = true, running = false, t0 = performance.now();

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = box.clientWidth;
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }
    function draw(now) {
      var ramp = root.classList.contains('dark') ? ramps.dark : ramps.light;
      var cell = size / CELLS, gap = Math.max(1, cell * 0.08);
      var spread = 0.42 + (reduceMotion ? 0 : Math.sin((now - t0) / 1400) * 0.04);
      ctx.clearRect(0, 0, size, size);
      for (var r = 0; r < CELLS; r++) {
        for (var c = 0; c < CELLS; c++) {
          var dx = (c + 0.5) / CELLS - focus.x, dy = (r + 0.5) / CELLS - focus.y;
          var v = Math.exp(-(dx * dx + dy * dy) / (spread * spread)) * 0.92 + noise[r * CELLS + c] * 0.08;
          ctx.fillStyle = colour(v, ramp);
          ctx.fillRect(c * cell + gap / 2, r * cell + gap / 2, cell - gap, cell - gap);
        }
      }
    }
    function loop(now) {
      focus.x += (target.x - focus.x) * 0.08;
      focus.y += (target.y - focus.y) * 0.08;
      draw(now);
      if (visible && !document.hidden) requestAnimationFrame(loop); else running = false;
    }
    function start() { if (!reduceMotion && !running) { running = true; requestAnimationFrame(loop); } }

    box.addEventListener('pointermove', function (e) {
      var rect = box.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
      if (reduceMotion) { focus.x = target.x; focus.y = target.y; draw(performance.now()); }
    });
    box.addEventListener('pointerleave', function () {
      target.x = 0.5; target.y = 0.5;
      if (reduceMotion) { focus.x = 0.5; focus.y = 0.5; draw(performance.now()); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(box);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    window.addEventListener('resize', resize);
    resize(); start();
    return { redraw: function () { draw(performance.now()); } };
  })();

  /* ===================================================================
     H. START-UP: load data.json, then draw every section
     "no-cache" makes browsers check for a newer data.json on each visit,
     so your edits appear as soon as GitHub Pages publishes them.
     =================================================================== */

  function showLoadError(err) {
    var box = $('load-error');
    var local = location.protocol === 'file:';
    box.innerHTML = '<div class="load-error"><p class="font-semibold">The page content (data.json) didn’t load.</p>' +
      (local
        ? '<p class="mt-2">Browsers block data files when a page is opened straight from your computer. ' +
          'Preview it with a local server instead: in this folder run <code>python -m http.server 8000</code>, ' +
          'then open <code>http://localhost:8000</code>.</p>'
        : '<p class="mt-2">If you just edited data.json, it probably has a formatting mistake (often a missing or extra comma). ' +
          'Paste it into <a href="https://jsonlint.com" target="_blank" rel="noopener">jsonlint.com</a> to find the line.</p>') +
      '<p class="muted mt-2 text-sm">Details: ' + esc(err && err.message) + '</p></div>';
    box.classList.remove('hidden');
  }

  fetch('data.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' while loading data.json');
      return res.json();
    })
    .then(function (data) {
      // Each section is drawn separately, so one mistake in data.json
      // breaks only its own section, not the whole page.
      [renderHero, renderAbout, renderMetrics, renderEducation, renderExperience,
       renderPublications, renderProjects, renderCollaborators, renderSkills,
       renderService, renderRepos, renderContact, renderFooter, renderStructuredData, bindPubSort]
        .forEach(function (fn) {
          try { fn(data); } catch (e) { console.error('Could not render ' + fn.name + ':', e); }
        });
    })
    .catch(showLoadError);
})();
