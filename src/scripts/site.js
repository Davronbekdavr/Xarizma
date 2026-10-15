import { translations, languageOptions } from './translations.js';

var locale = 'ru';
var selectedHall = 0;
var botUrl = 'https://t.me/fh_harizma_bot';
var phone = '+38 (097) 970-90-90';
var phoneLink = 'tel:+380979709090';

try {
  var storedLocale = localStorage.getItem('harizma-language');
  if (translations[storedLocale]) locale = storedLocale;
} catch (error) { /* The default language still works when storage is unavailable. */ }

function t(path) {
  return path.split('.').reduce(function (value, part) { return value && value[part]; }, translations[locale]);
}

function eyebrow(text, number) {
  return '<div class="section-eyebrow"><span class="eyebrow-mark"></span>' + text +
    (number ? '<span class="eyebrow-number">' + number + '</span>' : '') + '</div>';
}

function renderChrome() {
  var page = document.body.dataset.page;
  var header = document.querySelector('[data-site-header]');
  var footer = document.querySelector('[data-site-footer]');
  var navText = t('nav');
  var links = [
    ['index.html', navText[0], 'home'],
    ['zaly.html', navText[1], 'halls'],
    ['bronirovanie.html', navText[2], 'booking']
  ];

  if (header) {
    var options = languageOptions.map(function (option) {
      return '<option value="' + option[0] + '"' + (locale === option[0] ? ' selected' : '') + '>' + option[1] + ' · ' + option[2] + '</option>';
    }).join('');
    var navLinks = links.map(function (link) {
      return '<a href="' + link[0] + '"' + (page === link[2] ? ' class="active" aria-current="page"' : '') + '>' + link[1] + '</a>';
    }).join('');
    header.innerHTML =
      '<header class="site-header"><div class="header-inner">' +
      '<a href="index.html" class="site-logo" aria-label="' + navText[5] + '">' +
      '<span class="logo-sound">' + (locale === 'en' || locale === 'hu' ? 'H' : 'Х') + '</span><span class="logo-copy"><b>ХАРИЗМА</b><small>' + navText[9] + '</small></span></a>' +
      '<label class="language-picker"><span class="language-globe" aria-hidden="true"></span><select class="language-select" aria-label="' + translations[locale].language + '" title="' + translations[locale].language + '">' + options + '</select></label>' +
      '<button type="button" class="nav-toggle" aria-label="' + navText[6] + '" aria-expanded="false" aria-controls="primary-navigation"><i></i><i></i><i></i></button>' +
      '<nav id="primary-navigation" class="main-nav" aria-label="' + navText[4] + '">' + navLinks + '</nav>' +
      '<a class="header-phone" href="' + phoneLink + '">' + phone + '</a>' +
      '<a class="header-booking" href="' + botUrl + '" target="_blank" rel="noreferrer">' + navText[3] + ' <span>↗</span></a>' +
      '</div></header>';
  }

  if (footer) {
    var foot = t('footer');
    footer.innerHTML =
      '<footer class="site-footer"><div class="footer-main">' +
      '<a href="index.html" class="site-logo"><span class="logo-sound">' + (locale === 'en' || locale === 'hu' ? 'H' : 'Х') + '</span><span class="logo-copy"><b>ХАРИЗМА</b><small>' + navText[9] + '</small></span></a>' +
      '<p>' + foot[0] + '</p><nav aria-label="' + navText[8] + '">' +
      '<a href="' + phoneLink + '">' + phone + '</a><a href="' + botUrl + '" target="_blank" rel="noreferrer">' + foot[4] + '</a></nav>' +
      '<a class="footer-top" href="#top">' + foot[3] + '</a></div><div class="footer-bottom"><span>' + foot[1] + '</span>' +
      '<a href="https://www.google.com/maps/search/?api=1&query=Сретенский%20переулок%2C%204%2C%20Москва" target="_blank" rel="noreferrer">' + foot[2] + '</a></div></footer>';
  }

  var menuButton = header && header.querySelector('.nav-toggle');
  var nav = header && header.querySelector('.main-nav');
  var selector = header && header.querySelector('.language-select');
  if (menuButton) menuButton.addEventListener('click', function () {
    var open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? navText[7] : navText[6]);
    menuButton.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
  });
  if (nav) nav.addEventListener('click', function (event) {
    if (!event.target.closest('a')) return;
    nav.classList.remove('is-open');
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
  if (selector) selector.addEventListener('change', function () { applyLocale(selector.value); });
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function (element) {
    var value = t(element.dataset.i18n);
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (element) {
    var value = t(element.dataset.i18nAria);
    if (value !== undefined) element.setAttribute('aria-label', value);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(function (element) {
    var value = t(element.dataset.i18nAlt);
    if (value !== undefined) element.alt = value;
  });
  function setText(selector, value, useHtml) {
    var element = document.querySelector(selector);
    if (!element || value === undefined) return;
    if (useHtml) element.innerHTML = value;
    else element.textContent = value;
  }
  var page = document.body.dataset.page;
  if (page === 'home') {
    var hero = t('hero');
    var home = t('home');
    setText('.hero-copy > .section-eyebrow', '<span class="eyebrow-mark"></span>' + hero[0], true);
    setText('.hero-copy h1', hero[1], true);
    setText('.hero-copy > p', hero[2]);
    setText('.hero-actions .primary-button', hero[3] + ' <span>↗</span>', true);
    setText('.hero-actions .plain-link', hero[4] + ' <span>↓</span>', true);
    document.querySelectorAll('.hero-tags span').forEach(function (tag, index) { tag.textContent = hero[5 + index]; });
    setText('.hero-bottom > span:first-child', hero[8]);
    var heroImage = document.querySelector('.hero-performer');
    if (heroImage) heroImage.alt = hero[9];
    setText('.hero-sticker span', ['СВОЯ ЕДА','YOUR OWN FOOD','O‘Z TAOMINGIZ','SAJÁT ÉTEL'][['ru','en','uz','hu'].indexOf(locale)]);
    setText('.hero-sticker b', ['И НАПИТКИ','AND DRINKS','VA ICHIMLIK','ÉS ITAL'][['ru','en','uz','hu'].indexOf(locale)]);
    setText('.hero-sticker small', ['БЕЗ ПРОБКОВОГО СБОРА','NO CORKAGE FEE','QO‘SHIMCHA YIG‘IM YO‘Q','DUGÓDÍJ NÉLKÜL'][['ru','en','uz','hu'].indexOf(locale)]);
    setText('.hero-side-note', ['24/7 · МЕТРО ЛУБЯНКА','24/7 · LUBYANKA METRO','24/7 · LUBYANKA METROSI','0–24 · LUBYANKA METRÓ'][['ru','en','uz','hu'].indexOf(locale)]);
    setText('.experience-copy > .section-eyebrow', '<span class="eyebrow-mark"></span>' + home[0] + '<span class="eyebrow-number">01</span>', true);
    setText('.experience-copy h2', home[1], true);
    setText('.experience-copy > p', home[2]);
    setText('.experience-copy .primary-button', home[3] + ' <span>↗</span>', true);
    var roomImage = document.querySelector('.experience-photo img');
    if (roomImage) roomImage.alt = home[4];
    setText('.photo-caption', home[5]);
    setText('.photo-counter', home[6]);
    setText('.feature-heading .section-eyebrow', '<span class="eyebrow-mark"></span>' + home[7] + '<span class="eyebrow-number">02</span>', true);
    setText('.feature-heading h2', home[8], true);
    setText('.feature-heading > p', home[9]);
    setText('.feature-cta .section-eyebrow', '<span class="eyebrow-mark"></span>' + home[10], true);
    setText('.feature-cta h2', home[11], true);
    setText('.feature-cta .primary-button', home[12] + ' <span>↗</span>', true);
    setText('.home-end > span', home[13]);
    setText('.home-end > a:last-child', home[14]);
  }
  if (page === 'halls') {
    var hallsText = t('halls');
    setText('.page-intro .section-eyebrow', '<span class="eyebrow-mark"></span>' + hallsText.eyebrow, true);
    setText('.page-intro h1', hallsText.title, true);
    setText('.page-intro > p', hallsText.intro);
    var hallGallery = document.querySelector('.hall-showcase');
    if (hallGallery) hallGallery.setAttribute('aria-label', hallsText.gallery);
    document.querySelectorAll('.hall-notes article').forEach(function (note, index) {
      note.querySelector('h3').textContent = hallsText.notes[index][0];
      note.querySelector('p').textContent = hallsText.notes[index][1];
    });
    setText('.halls-cta .section-eyebrow', '<span class="eyebrow-mark"></span>' + hallsText.ctaEyebrow, true);
    setText('.halls-cta h2', hallsText.ctaTitle, true);
    setText('.halls-cta .primary-button', hallsText.ctaButton + ' <span>↗</span>', true);
  }
  if (page === 'booking') {
    var booking = t('booking');
    setText('.page-intro .section-eyebrow', '<span class="eyebrow-mark"></span>' + booking[0], true);
    setText('.page-intro h1', booking[1], true);
    setText('.page-intro > p', booking[2]);
    setText('.page-intro .primary-button', booking[3] + ' <span>↗</span>', true);
    setText('.contact-heading .section-eyebrow', '<span class="eyebrow-mark"></span>' + booking[4] + '<span class="eyebrow-number">03</span>', true);
    setText('.contact-heading h2', booking[5], true);
    setText('.contact-heading > p', booking[6]);
    setText('.contact-details > div:first-child > span:first-child', booking[7]);
    setText('.contact-details > div:first-child p', booking[8], true);
    setText('.contact-details > div:first-child a', booking[9]);
    setText('.contact-details > div:last-child > span:first-child', booking[10]);
    setText('.contact-details > div:last-child p', booking[11], true);
    setText('.open-badge', '<i></i> ' + booking[12], true);
  }
  var titles = {
    ru: ['Харизма — караоке-клуб у Лубянки', 'Наши залы — Харизма', 'Бронирование — Харизма'],
    en: ['Harizma Karaoke Club near Lubyanka', 'Our Rooms — Harizma', 'Booking — Harizma'],
    uz: ['Lubyanka yaqinidagi Xarizma karaoke klubi', 'Xarizma zallari', 'Bron qilish — Xarizma'],
    hu: ['Harizma Karaoke Klub a Lubyankánál', 'Termeink — Harizma', 'Foglalás — Harizma']
  };
  var pageIndex = { home: 0, halls: 1, booking: 2 }[document.body.dataset.page] || 0;
  document.title = titles[locale][pageIndex];
}

function renderFeatures() {
  var grid = document.querySelector('[data-features]');
  if (!grid) return;
  grid.innerHTML = t('features').map(function (feature, index) {
    return '<article class="feature-card"><div class="feature-top"><span>' +
      String(index + 1).padStart(2, '0') + '</span><b>' + feature[0] +
      '</b></div><h3>' + feature[1] + '</h3><p>' + feature[2] + '</p></article>';
  }).join('');
}

function renderBookingSteps() {
  document.querySelectorAll('[data-booking-steps]').forEach(function (container) {
    var steps = t('steps');
    var compact = container.dataset.compact === 'true';
    var cards = steps.items.map(function (step, index) {
      var imageNumber = String(index + 1).padStart(2, '0');
      return '<article class="step-card"><div class="step-image"><span>' + imageNumber +
        '</span><img src="./assets/booking-screen-' + imageNumber + '.jpg" alt="' + step[0] +
        '" loading="lazy"></div><h3>' + step[0] + '</h3><p>' + step[1] + '</p></article>';
    }).join('');
    container.innerHTML = '<div class="steps-heading"><div>' + eyebrow(steps.eyebrow, compact ? '03' : '01') +
      '<h2>' + (compact ? steps.compact : steps.title) + '</h2></div><p>' + steps.description +
      '</p></div><div class="step-grid">' + cards + '</div><a class="bot-link" href="' + botUrl +
      '" target="_blank" rel="noreferrer"><span class="bot-link-icon">↗</span><span><b>' +
      steps.bot + '</b><small>t.me/fh_harizma_bot</small></span><span class="bot-link-arrow">→</span></a>';
  });
}

function renderFaq() {
  document.querySelectorAll('[data-faq]').forEach(function (container) {
    var faq = t('faq');
    var compact = container.dataset.compact === 'true';
    var items = faq.items.map(function (item, index) {
      return '<article class="faq-item' + (index === 0 ? ' is-open' : '') + '"><h3><button type="button" aria-expanded="' +
        (index === 0) + '"><span>' + item[0] + '</span><b aria-hidden="true">' +
        (index === 0 ? '−' : '+') + '</b></button></h3>' + (index === 0 ? '<p>' + item[1] + '</p>' : '') + '</article>';
    }).join('');
    container.innerHTML = '<div class="faq-title">' + eyebrow(faq.eyebrow, compact ? '04' : '02') +
      '<h2>' + faq.title + '</h2><p>' + faq.description + '</p><img src="./assets/slippers.png" alt="' +
      faq.alt + '" loading="lazy"></div><div class="faq-list">' + items + '</div>';
    container.onclick = function (event) {
      var button = event.target.closest('.faq-item button');
      if (!button) return;
      var item = button.closest('.faq-item');
      var wasOpen = button.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('.faq-item').forEach(function (faqItem) {
        faqItem.classList.remove('is-open');
        faqItem.querySelector('button').setAttribute('aria-expanded', 'false');
        faqItem.querySelector('button b').textContent = '+';
        var answer = faqItem.querySelector('p');
        if (answer) answer.remove();
      });
      if (wasOpen) return;
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('b').textContent = '−';
      item.classList.add('is-open');
      var answerText = faq.items.find(function (entry) { return entry[0] === button.querySelector('span').textContent; })[1];
      var answerNode = document.createElement('p');
      answerNode.textContent = answerText;
      item.append(answerNode);
    };
  });
}

function renderHallGallery() {
  var gallery = document.querySelector('[data-hall-gallery]');
  var selector = document.querySelector('[data-hall-selector]');
  if (!gallery || !selector) return;
  var hallData = t('halls');
  var photos = ['karaoke-room-neon.jpg', 'karaoke-room-main.jpg', 'karaoke-room-stage.jpg', 'karaoke-room-booth.jpg'];
  var numbers = ['01', '02', '03', '05'];
  function showHall(index) {
    selectedHall = (index + hallData.rooms.length) % hallData.rooms.length;
    var room = hallData.rooms[selectedHall];
    gallery.querySelector('img').src = './assets/' + photos[selectedHall];
    gallery.querySelector('img').alt = room[0] + ' · ' + hallData.individual;
    gallery.querySelector('.hall-count').innerHTML = [['ЗАЛ','ROOM','ZAL','TEREM'][['ru','en','uz','hu'].indexOf(locale)] + ' ' + numbers[selectedHall] + ' <i>/</i> 17'];
    gallery.querySelector('.hall-showcase-caption h2').textContent = room[0];
    gallery.querySelectorAll('.hall-spec strong')[0].textContent = room[1];
    gallery.querySelectorAll('.hall-spec strong')[1].textContent = room[2];
    selector.querySelectorAll('button').forEach(function (button, buttonIndex) {
      button.classList.toggle('is-selected', buttonIndex === selectedHall);
      button.setAttribute('aria-pressed', String(buttonIndex === selectedHall));
    });
  }
  gallery.setAttribute('aria-label', hallData.gallery);
  gallery.querySelector('.hall-showcase-caption .section-eyebrow').innerHTML = '<span class="eyebrow-mark"></span>' + hallData.individual;
  gallery.querySelectorAll('.hall-spec span')[0].textContent = hallData.area;
  gallery.querySelectorAll('.hall-spec span')[1].textContent = hallData.capacity;
  gallery.querySelectorAll('.hall-spec span')[2].textContent = hallData.price;
  gallery.querySelectorAll('.hall-spec strong')[2].textContent = hallData.perPerson;
  gallery.querySelector('.hall-prev').setAttribute('aria-label', hallData.prev);
  gallery.querySelector('.hall-next').setAttribute('aria-label', hallData.next);
  gallery.querySelector('.hall-showcase-details .primary-button').innerHTML = hallData.bookThis + ' <span>↗</span>';
  selector.setAttribute('aria-label', hallData.choose);
  selector.innerHTML = hallData.rooms.map(function (room, index) {
    return '<button type="button" class="' + (index === selectedHall ? 'is-selected' : '') +
      '" aria-pressed="' + (index === selectedHall) + '" data-index="' + index + '"><img src="./assets/' +
      photos[index] + '" alt=""><span>' + room[0] + '</span><small>' + numbers[index] + ' / 17</small></button>';
  }).join('');
  gallery.querySelector('.hall-prev').onclick = function () { showHall(selectedHall - 1); };
  gallery.querySelector('.hall-next').onclick = function () { showHall(selectedHall + 1); };
  selector.onclick = function (event) {
    var button = event.target.closest('button[data-index]');
    if (button) showHall(Number(button.dataset.index));
  };
  showHall(selectedHall);
}

function applyLocale(nextLocale) {
  if (!translations[nextLocale]) return;
  locale = nextLocale;
  try { localStorage.setItem('harizma-language', locale); } catch (error) { /* Ignore unavailable storage. */ }
  document.documentElement.lang = locale;
  applyStaticTranslations();
  renderChrome();
  renderFeatures();
  renderBookingSteps();
  renderFaq();
  renderHallGallery();
}

applyLocale(locale);
