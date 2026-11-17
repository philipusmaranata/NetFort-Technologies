/* Mobile navigation: hamburger toggle for .nav-links (hidden by CSS below 1280px) */
(function () {
  var nav = document.querySelector('.site-nav'), links = nav && nav.querySelector('.nav-links');
  if (!links) return;
  // Copy header actions (portal / trial) into the menu so they stay reachable on phones
  nav.querySelectorAll('.nav-actions a').forEach(function (a) {
    var li = document.createElement('li'); li.className = 'nav-extra';
    var c = a.cloneNode(true); c.removeAttribute('style'); li.appendChild(c); links.appendChild(li);
  });
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Buka menu'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.querySelector('.nav-container').appendChild(btn);
  function set(open) {
    nav.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('nav-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  addEventListener('resize', function () { if (innerWidth > 1280) set(false); });
})();

/* NetFort cyber background: drifting network nodes that link up and react to the cursor */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.createElement('canvas'); c.id = 'netCanvas'; c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  var ctx = c.getContext('2d'), w, h, nodes = [], m = { x: -999, y: -999 };
  function resize() {
    var d = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
    c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    nodes = Array.from({ length: Math.min(80, Math.round(w * h / 20000)) }, function () {
      return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, hot: Math.random() < .08 };
    });
  }
  addEventListener('resize', resize);
  addEventListener('mousemove', function (e) { m.x = e.clientX; m.y = e.clientY; });
  function line(a, b, al, col) { ctx.strokeStyle = col + al + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  function tick() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(function (a, i) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) line(a, b, (1 - d / 140) * .28, a.hot || b.hot ? 'rgba(255,46,147,' : 'rgba(0,229,255,');
        }
        var dm = Math.hypot(a.x - m.x, a.y - m.y);
        if (dm < 180) line(a, m, (1 - dm / 180) * .6, 'rgba(0,229,255,');
        ctx.fillStyle = a.hot ? '#ff2e93' : '#00e5ff'; ctx.shadowBlur = 8; ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.hot ? 2.2 : 1.5, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      });
    }
    requestAnimationFrame(tick);
  }
  resize(); tick();
})();
