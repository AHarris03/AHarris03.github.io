// ---- Music links: paste your normal share links here and the players appear. ----
// Spotify: an artist, album, track or playlist link from "Share > Copy link".
// Apple Music: an album, song or playlist link (Apple doesn't offer players for artist pages).
// YouTube: any video links (watch, youtu.be or shorts). Add as many as you like.
var MUSIC = {
  spotify: 'https://open.spotify.com/album/75CgAPbgUjIHRaLU5GYZUR',
  appleMusic: 'https://music.apple.com/us/album/limbo-single/6765680919',
  youtube: ['https://youtu.be/yzQibjVrDhM']
};

(function () {
  // Tabs: #projects, #music and #resume each open their tab, so links can be shared.
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var ids = tabs.map(function (t) { return t.getAttribute('aria-controls'); });

  function show(id, focus) {
    if (ids.indexOf(id) === -1) id = ids[0];
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      var id = t.getAttribute('aria-controls');
      show(id);
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
    });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.click();
      next.focus();
    });
  });

  // In-page links like "view resume" switch tabs and scroll to them.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (ids.indexOf(id) === -1) return;
    e.preventDefault();
    show(id);
    document.querySelector('.tabs').scrollIntoView();
    try { history.replaceState(null, '', '#' + id); } catch (err) {}
  });

  show(location.hash.slice(1));

  // Music players, built from MUSIC above.
  function spotifyEmbed(u) {
    var m = /open\.spotify\.com\/(?:intl-[a-z]+\/)?(artist|album|track|playlist|show|episode)\/([A-Za-z0-9]+)/.exec(u);
    return m && 'https://open.spotify.com/embed/' + m[1] + '/' + m[2];
  }
  function appleEmbed(u) {
    return /^https:\/\/music\.apple\.com\//.test(u) && u.replace('https://music.apple.com/', 'https://embed.music.apple.com/');
  }
  function youtubeEmbed(u) {
    var m = /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/.exec(u);
    return m && 'https://www.youtube-nocookie.com/embed/' + m[1];
  }
  function fill(box, src, title, empty) {
    if (!src) { box.classList.add('empty'); box.textContent = empty; return; }
    var f = document.createElement('iframe');
    f.src = src; f.title = title; f.loading = 'lazy';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    f.setAttribute('allowfullscreen', '');
    box.appendChild(f);
  }
  fill(document.querySelector('[data-embed="spotify"]'), spotifyEmbed(MUSIC.spotify), 'Spotify player', 'Spotify player goes here. Add your Spotify link in main.js.');
  fill(document.querySelector('[data-embed="apple"]'), appleEmbed(MUSIC.appleMusic), 'Apple Music player', 'Apple Music player goes here. Add an album, song or playlist link in main.js.');
  var videos = document.getElementById('videos');
  MUSIC.youtube.forEach(function (u, i) {
    var box = document.createElement('div');
    box.className = 'embed embed-video';
    videos.appendChild(box);
    fill(box, youtubeEmbed(u), 'YouTube video ' + (i + 1), 'YouTube video goes here. Add the link in main.js.');
  });
  var links = document.getElementById('stream-links');
  [['spotify', MUSIC.spotify], ['apple music', MUSIC.appleMusic]].forEach(function (l) {
    if (!l[1]) return;
    var a = document.createElement('a'); a.href = l[1]; a.textContent = 'open in ' + l[0] + ' ↗';
    links.appendChild(a);
  });

  // Back-to-top button: shows once you scroll past the intro, on every tab.
  var toTop = document.getElementById('to-top');
  function onScroll() { toTop.hidden = window.scrollY < 600; }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  // Theme toggle, remembered per visitor.
  var root = document.documentElement;
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var dark = root.getAttribute('data-theme')
      ? root.getAttribute('data-theme') === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
