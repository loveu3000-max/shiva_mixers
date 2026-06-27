/* ============================================================
   SHIVA CONCRETE MIXERS — HERO CONSTRUCTION SCENE
   Full Canvas 2D Animation — 60fps, no external assets
   ============================================================ */
(function () {
  'use strict';

  var canvas, ctx, W, H, dpr;
  var time       = 0;
  var mouseX     = 0.5;
  var mouseY     = 0.5;
  var targetMX   = 0.5;
  var targetMY   = 0.5;
  var stars      = [];
  var concreteP  = [];
  var dustP      = [];
  var smokeP     = [];
  var sparksP    = [];
  var initialized = false;

  /* ── BOOTSTRAP ─────────────────────────────────────────── */
  function boot() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resize();
    generateStars(100);
    for (var i = 0; i < 55; i++) dustP.push(mkDust());
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    initialized = true;
    requestAnimationFrame(loop);
  }

  function resize() {
    var s = canvas.parentElement || document.documentElement;
    W = s.offsetWidth;
    H = Math.max(s.offsetHeight, window.innerHeight);
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onMouse(e) {
    targetMX = e.clientX / window.innerWidth;
    targetMY = e.clientY / window.innerHeight;
  }

  /* ── MAIN LOOP ─────────────────────────────────────────── */
  function loop() {
    time += 0.016;
    // Smooth mouse tracking
    mouseX += (targetMX - mouseX) * 0.05;
    mouseY += (targetMY - mouseY) * 0.05;

    ctx.clearRect(0, 0, W, H);

    drawSky();
    drawStars();
    drawBuildings();
    drawScaffolding();
    drawGround();
    updateDust();
    drawWorkers();
    drawMixer();
    updateConcrete();
    updateSmoke();
    updateSparks();
    drawAtmosphere();

    requestAnimationFrame(loop);
  }

  /* ── HELPERS ───────────────────────────────────────────── */
  function sc() { return Math.min(W / 1440, H / 820); }

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x, y + h - r,     r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── PARALLAX ──────────────────────────────────────────── */
  function px(base, depth) { return base + (mouseX - 0.5) * depth; }
  function py(base, depth) { return base + (mouseY - 0.5) * depth; }

  /* ── SKY ───────────────────────────────────────────────── */
  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H * 0.62);
    g.addColorStop(0,    '#06060e');
    g.addColorStop(0.35, '#0e0c08');
    g.addColorStop(0.65, '#1c1208');
    g.addColorStop(1,    '#251804');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H * 0.65);

    // Horizon amber glow — shifts slightly with time
    var hx   = W * (0.52 + 0.03 * Math.sin(time * 0.15));
    var hGlow = ctx.createRadialGradient(hx, H * 0.5, 0, hx, H * 0.5, W * 0.65);
    hGlow.addColorStop(0,   'rgba(255,130,20,0.22)');
    hGlow.addColorStop(0.3, 'rgba(255,100,10,0.10)');
    hGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = hGlow;
    ctx.fillRect(0, 0, W, H * 0.68);

    // Warm work-light glow above mixer position
    var wl = ctx.createRadialGradient(W * 0.62, H * 0.6, 0, W * 0.62, H * 0.6, W * 0.28);
    wl.addColorStop(0,   'rgba(245,158,11,0.14)');
    wl.addColorStop(0.5, 'rgba(245,130,0,0.05)');
    wl.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = wl;
    ctx.fillRect(0, H * 0.2, W, H * 0.6);
  }

  /* ── STARS ─────────────────────────────────────────────── */
  function generateStars(n) {
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random(), y: Math.random() * 0.42,
        r: Math.random() * 1.3 + 0.3,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.6 + 0.2
      });
    }
  }

  function drawStars() {
    stars.forEach(function (s) {
      var a  = 0.25 + 0.45 * Math.sin(time * s.sp + s.ph);
      var sx = px(s.x * W, -18);
      var sy = py(s.y * H, -10);
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,240,200,' + a + ')';
      ctx.fill();
    });
  }

  /* ── BUILDINGS ─────────────────────────────────────────── */
  function drawBuildings() {
    var k = sc();

    // Far-back city silhouette haze
    ctx.fillStyle = 'rgba(15,12,5,0.5)';
    ctx.fillRect(0, H * 0.3, W, H * 0.35);

    building(px(W * 0.03, -25), py(H * 0.19, -6), W * 0.095, H * 0.39, '#0a0a08', 4, 5);
    building(px(W * 0.13, -30), py(H * 0.07, -8), W * 0.11,  H * 0.52, '#0d0d0a', 5, 6);
    building(px(W * 0.77, -20), py(H * 0.14, -5), W * 0.10,  H * 0.44, '#0b0b09', 4, 5);
    building(px(W * 0.89, -12), py(H * 0.24, -4), W * 0.09,  H * 0.33, '#0e0e0b', 3, 4);

    // Under-construction frame (right)
    steelFrame(px(W * 0.68, -22), py(H * 0.04, -7), W * 0.17, H * 0.56, 3, 5);

    // Crane — left
    crane(px(W * 0.23, -35), py(H * 0.01, -10), W * 0.13, H * 0.44);

    // Second smaller crane far right
    crane(px(W * 0.84, -15), py(H * 0.06, -5), W * 0.08, H * 0.30);
  }

  function building(x, y, w, h, col, cols, rows) {
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);

    var ww = (w / (cols + 1)) * 0.55;
    var wh = (h / (rows + 1)) * 0.38;
    for (var c = 0; c < cols; c++) {
      for (var r = 0; r < rows; r++) {
        var seed = (c * 7 + r * 13 + cols) % 11;
        var wx = x + (w / (cols + 1)) * (c + 0.6);
        var wy = y + (h / (rows + 1)) * (r + 0.5);
        if (seed < 5) {
          var flk = 0.6 + 0.4 * Math.sin(time * 0.2 + seed + c);
          ctx.fillStyle = 'rgba(255,210,90,' + (0.45 * flk) + ')';
        } else {
          ctx.fillStyle = 'rgba(20,18,10,0.9)';
        }
        ctx.fillRect(wx, wy, ww, wh);
      }
    }
  }

  function steelFrame(x, y, w, h, cols, rows) {
    var cw = w / cols, rh = h / rows;
    ctx.strokeStyle = 'rgba(55,42,12,0.85)';
    ctx.lineWidth   = 2.5;
    for (var c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(x + c*cw, y); ctx.lineTo(x + c*cw, y+h); ctx.stroke();
    }
    for (var r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(x, y + r*rh); ctx.lineTo(x+w, y + r*rh); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(45,35,10,0.5)';
    ctx.lineWidth   = 1;
    for (var cc = 0; cc < cols; cc++) {
      for (var rr = 0; rr < rows; rr++) {
        if ((cc + rr) % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x + cc*cw, y + rr*rh);
          ctx.lineTo(x + (cc+1)*cw, y + (rr+1)*rh);
          ctx.stroke();
        }
      }
    }
    // Scaffolding lights (blinking LEDs)
    for (var l = 0; l < cols + 1; l++) {
      var la = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.5 + l * 1.7));
      ctx.fillStyle = 'rgba(255,80,60,' + la + ')';
      ctx.beginPath();
      ctx.arc(x + l * cw, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function crane(x, y, w, h) {
    var swing = Math.sin(time * 0.35) * 10;
    ctx.strokeStyle = 'rgba(70,55,15,0.8)';
    ctx.lineWidth   = 3.5;
    // Tower
    ctx.beginPath(); ctx.moveTo(x + w*0.5, y+h); ctx.lineTo(x + w*0.5, y); ctx.stroke();
    // Jib
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x + w*0.08, y + h*0.12); ctx.lineTo(x + w*0.95, y + h*0.12); ctx.stroke();
    // Counter jib
    ctx.beginPath(); ctx.moveTo(x + w*0.5, y + h*0.12); ctx.lineTo(x + w*0.08, y + h*0.22); ctx.stroke();
    // Operator cabin
    ctx.fillStyle = 'rgba(40,30,8,0.9)';
    ctx.fillRect(x + w*0.42, y + h*0.06, w*0.16, h*0.1);
    // Cable
    ctx.strokeStyle = 'rgba(90,75,25,0.7)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w*0.78, y + h*0.12);
    ctx.lineTo(x + w*0.78 + swing, y + h*0.65);
    ctx.stroke();
    // Hook
    ctx.strokeStyle = 'rgba(110,90,30,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + w*0.78 + swing, y + h*0.65, 5, 0, Math.PI * 2);
    ctx.stroke();
    // Safety light on top
    var lt = 0.3 + 0.7 * Math.abs(Math.sin(time * 1.2));
    ctx.fillStyle = 'rgba(255,60,60,' + lt + ')';
    ctx.beginPath(); ctx.arc(x + w*0.5, y, 4, 0, Math.PI * 2); ctx.fill();
  }

  /* ── SCAFFOLDING ───────────────────────────────────────── */
  function drawScaffolding() {
    scaffold(px(W*0.05, -28), py(H*0.34, -8),  W*0.145, H*0.46, 3, 4);
    scaffold(px(W*0.80, -18), py(H*0.42, -5),  W*0.10,  H*0.36, 2, 3);
  }

  function scaffold(x, y, w, h, cols, rows) {
    var cw = w/cols, rh = h/rows;
    ctx.strokeStyle = 'rgba(85,65,18,0.75)';
    ctx.lineWidth   = 2;
    for (var c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(x + c*cw, y); ctx.lineTo(x + c*cw, y+h); ctx.stroke();
    }
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(75,55,14,0.85)';
    for (var r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(x, y + r*rh); ctx.lineTo(x+w, y + r*rh); ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(65,48,12,0.5)';
    for (var cc = 0; cc < cols; cc++) {
      for (var rr = 0; rr < rows; rr++) {
        if ((cc+rr) % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x + cc*cw, y + rr*rh);
          ctx.lineTo(x + (cc+1)*cw, y + (rr+1)*rh);
          ctx.stroke();
        }
      }
    }
    // Plywood sheets
    ctx.fillStyle = 'rgba(35,25,8,0.5)';
    if (cols >= 3) ctx.fillRect(x + cw, y + rh, cw, rh);
    ctx.fillRect(x, y + rh*2, cw, rh);
  }

  /* ── GROUND ────────────────────────────────────────────── */
  function drawGround() {
    var gy = H * 0.60;
    var g  = ctx.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0,   '#1c1408');
    g.addColorStop(0.3, '#160f06');
    g.addColorStop(1,   '#0c0905');
    ctx.fillStyle = g;
    ctx.fillRect(0, gy, W, H - gy);

    // Ground texture / tire tracks
    ctx.strokeStyle = 'rgba(35,26,8,0.6)';
    ctx.lineWidth   = 1;
    for (var i = 0; i < 7; i++) {
      var ty = gy + 15 + i * (H - gy - 15) / 7;
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.bezierCurveTo(W*0.3, ty+4, W*0.7, ty-3, W, ty+2);
      ctx.stroke();
    }

    // Concrete slab under mixer
    var sx = W * 0.38, sy = H * 0.825;
    ctx.fillStyle = 'rgba(28,22,10,0.85)';
    ctx.fillRect(sx, sy, W*0.30, H*0.05);
    ctx.strokeStyle = 'rgba(45,35,12,0.4)';
    ctx.lineWidth   = 1;
    for (var j = 0; j < 5; j++) {
      ctx.beginPath();
      ctx.moveTo(sx + j * W*0.06, sy);
      ctx.lineTo(sx + j * W*0.06, sy + H*0.05);
      ctx.stroke();
    }

    // Scattered rubble / rocks
    var rubble = [[W*0.30,H*0.84,4],[W*0.72,H*0.83,3],[W*0.80,H*0.86,5],[W*0.25,H*0.88,3]];
    rubble.forEach(function(r){
      ctx.fillStyle = 'rgba(40,30,12,0.8)';
      ctx.beginPath(); ctx.arc(r[0], r[1], r[2], 0, Math.PI*2); ctx.fill();
    });

    // Stacked concrete bags (right of mixer)
    concreteBags(W*0.75, H*0.80);

    // Barricade tape left
    tape(W*0.03, H*0.78, W*0.16, H*0.78);
  }

  function concreteBags(x, y) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 2; j++) {
        var bx = x + j * 36;
        var by = y - i * 18;
        ctx.fillStyle = (i+j) % 2 === 0 ? 'rgba(60,50,20,0.9)' : 'rgba(50,40,16,0.9)';
        rr(bx, by, 32, 16, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(80,65,25,0.6)';
        ctx.lineWidth   = 1;
        ctx.stroke();
        // brand mark
        ctx.fillStyle = 'rgba(245,158,11,0.5)';
        ctx.fillRect(bx+8, by+5, 16, 2);
      }
    }
  }

  function tape(x1, y1, x2, y2) {
    ctx.strokeStyle = 'rgba(245,200,10,0.55)';
    ctx.lineWidth   = 3;
    ctx.setLineDash([18, 12]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);

    // Poles
    [x1, x2].forEach(function(px){
      ctx.strokeStyle = 'rgba(60,50,20,0.8)';
      ctx.lineWidth   = 4;
      ctx.beginPath(); ctx.moveTo(px, y1 - 30); ctx.lineTo(px, y1 + 10); ctx.stroke();
    });
  }

  /* ── PORTABLE DRUM CONCRETE MIXER (matches shiva_mixer.png) ── */
  var drumAngle = 0;

  // Drum tilt: -0.68 rad → opening faces upper-left (matches real machine photo)
  var DRUM_TILT = -0.68;
  // Machine anchor
  var MX_FRAC = 0.590, MY_FRAC = 0.852;

  function drawMixer() {
    var k  = sc() * 1.18;  // slightly bigger than background elements
    var mx = W * MX_FRAC;
    var my = H * MY_FRAC;

    drumAngle += 0.022;   // steady continuous rotation

    ctx.save();
    ctx.translate(mx, my);
    ctx.scale(k, k);

    /* ── Ground shadow ───────────────────────────────── */
    var sh = ctx.createRadialGradient(0, 8, 4, 0, 8, 195);
    sh.addColorStop(0,   'rgba(0,0,0,0.65)');
    sh.addColorStop(0.5, 'rgba(0,0,0,0.28)');
    sh.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(-200, 0, 400, 52);

    /* ── Colour palette (steel blue, matches photo) ── */
    var STEEL      = '#4a7a96';
    var STEEL_D    = '#375d72';
    var STEEL_L    = '#6ba0be';
    var STEEL_HL   = '#9ec8e0';  // specular highlight
    var FRAME_DARK = '#2c4858';
    var METAL      = '#2a3540';
    var METAL_L    = '#3d5060';
    var RUBBER     = '#181a1e';
    var RUBBER_RIM = '#2a2e34';
    var GEAR_DARK  = '#1e2830';
    var GEAR_MID   = '#283540';

    /* ─── LARGE REAR WHEELS (draw first — behind frame) ──── */
    drumWheel(-88, 0, 45, true);
    drumWheel(-52, 0, 45, true);

    /* ── SMALL FRONT WHEELS ── */
    drumWheel( 62, 4, 27, false);
    drumWheel( 90, 4, 27, false);

    /* ── AXLE BARS ──────────────────────────────────── */
    ctx.strokeStyle = FRAME_DARK;
    ctx.lineWidth   = 6;
    ctx.lineCap     = 'square';
    ctx.beginPath(); ctx.moveTo(-88, 0); ctx.lineTo(-52, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( 62, 4); ctx.lineTo( 90, 4); ctx.stroke();
    ctx.lineCap = 'butt';

    /* ── BASE FRAME (rectangular chassis) ─────────────
       The frame sits from x=-105 to x=+105, y=-88 to y=0 */
    var FX = -105, FY = -88, FW = 210, FH = 88;

    // Side perspective face (darker left face)
    ctx.fillStyle = FRAME_DARK;
    ctx.beginPath();
    ctx.moveTo(FX,     FY);
    ctx.lineTo(FX-18,  FY+10);
    ctx.lineTo(FX-18,  FH+10);
    ctx.lineTo(FX,     FH);
    ctx.closePath(); ctx.fill();

    // Top face (lighter)
    ctx.fillStyle = STEEL_L;
    ctx.fillRect(FX, FY, FW, 8);

    // Front face (main visible face)
    var frameGrad = ctx.createLinearGradient(FX, FY+8, FX, FH);
    frameGrad.addColorStop(0,   STEEL_L);
    frameGrad.addColorStop(0.3, STEEL);
    frameGrad.addColorStop(1,   STEEL_D);
    ctx.fillStyle = frameGrad;
    ctx.fillRect(FX, FY+8, FW, FH-8);

    // Horizontal structural ribs
    ctx.strokeStyle = STEEL_D;
    ctx.lineWidth   = 1.5;
    [FY+28, FY+50, FY+70].forEach(function(ry){
      ctx.beginPath(); ctx.moveTo(FX, ry); ctx.lineTo(FX+FW, ry); ctx.stroke();
    });

    // Bottom rail
    ctx.fillStyle = FRAME_DARK;
    ctx.fillRect(FX-18, FH+4, FW+20, 6);

    /* ── BRANDING PANEL (right half of frame) ────────── */
    ctx.fillStyle = STEEL;
    rr(12, FY+12, 90, 62, 5);
    ctx.fill();
    ctx.strokeStyle = STEEL_HL;
    ctx.lineWidth = 1;
    ctx.stroke();
    // Panel highlight stripe top
    ctx.fillStyle = STEEL_L;
    ctx.fillRect(14, FY+13, 86, 5);

    // Logo icon (wing chevrons matching actual logo)
    ctx.fillStyle = 'rgba(245,158,11,0.95)';
    var lx = 34, ly = FY+26;
    // Left chevron
    ctx.beginPath(); ctx.moveTo(lx,    ly+2); ctx.lineTo(lx+8, ly+9); ctx.lineTo(lx+8, ly+3); ctx.lineTo(lx, ly-4); ctx.closePath(); ctx.fill();
    // Right chevron
    ctx.beginPath(); ctx.moveTo(lx+8,  ly+2); ctx.lineTo(lx+16,ly+9); ctx.lineTo(lx+16,ly+3); ctx.lineTo(lx+8, ly-4); ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font      = 'bold 12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SHIVA', lx, FY+46);
    ctx.font      = '6.5px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245,158,11,0.9)';
    ctx.fillText('CONCRETE MIXERS', lx-2, FY+57);

    /* ── ENGINE / MOTOR BOX (right of branding panel) ── */
    ctx.fillStyle = METAL;
    rr(12, FY+10, 90, 26, 3);
    ctx.fill();
    ctx.strokeStyle = METAL_L;
    ctx.lineWidth   = 1;
    ctx.stroke();
    // Vents
    ctx.strokeStyle = 'rgba(60,90,110,0.7)';
    ctx.lineWidth   = 1.5;
    for (var v = 0; v < 7; v++) {
      ctx.beginPath();
      ctx.moveTo(18 + v*10, FY+14);
      ctx.lineTo(18 + v*10, FY+32);
      ctx.stroke();
    }
    // Motor bolt circles
    [20, 85].forEach(function(bx){
      ctx.fillStyle = METAL_L;
      ctx.beginPath(); ctx.arc(bx, FY+22, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = GEAR_DARK;
      ctx.beginPath(); ctx.arc(bx, FY+22, 2.5, 0, Math.PI*2); ctx.fill();
    });

    /* ── EXHAUST PIPE ─────────────────────────────────── */
    ctx.strokeStyle = METAL;
    ctx.lineWidth   = 7;
    ctx.lineCap     = 'round';
    ctx.beginPath(); ctx.moveTo(95, FY+10); ctx.lineTo(95, FY-28); ctx.stroke();
    // Pipe cap
    ctx.fillStyle = GEAR_DARK;
    ctx.beginPath(); ctx.ellipse(95, FY-28, 5, 3.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.lineCap = 'butt';

    /* ── A-FRAME SUPPORT ARMS for drum ───────────────── */
    ctx.strokeStyle = STEEL_D;
    ctx.lineWidth   = 9;
    ctx.lineCap     = 'round';
    // Left pair (wider spread)
    ctx.beginPath(); ctx.moveTo(-98, FY); ctx.lineTo(-40, FY-80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-55, FY); ctx.lineTo(-40, FY-80); ctx.stroke();
    // Right arm
    ctx.beginPath(); ctx.moveTo( 10, FY); ctx.lineTo(-40, FY-80); ctx.stroke();
    // Apex cap
    ctx.fillStyle = STEEL_L;
    ctx.beginPath(); ctx.arc(-40, FY-80, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = FRAME_DARK;
    ctx.beginPath(); ctx.arc(-40, FY-80, 4, 0, Math.PI*2); ctx.fill();
    ctx.lineCap = 'butt';

    /* ── LOADING SKIP / HOPPER (right side, angled up) ── */
    ctx.save();
    ctx.translate(100, FY-12);
    ctx.rotate(-0.50);

    // Skip arm
    ctx.strokeStyle = STEEL_D;
    ctx.lineWidth   = 7;
    ctx.lineCap     = 'round';
    ctx.beginPath(); ctx.moveTo(-18, 30); ctx.lineTo(-6, -8); ctx.stroke();
    ctx.lineCap = 'butt';

    // Skip body (flat rectangular scoop)
    var skipGrad = ctx.createLinearGradient(0, 0, 52, 0);
    skipGrad.addColorStop(0, STEEL_D);
    skipGrad.addColorStop(0.4, STEEL);
    skipGrad.addColorStop(1, STEEL_L);
    ctx.fillStyle = skipGrad;
    ctx.beginPath();
    ctx.moveTo( 0, -12); ctx.lineTo(52, -12);
    ctx.lineTo(58,  18); ctx.lineTo(-6,  18);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = STEEL_HL; ctx.lineWidth = 1.5; ctx.stroke();
    // Reinforcement lip
    ctx.fillStyle = FRAME_DARK;
    ctx.fillRect(-6, -14, 66, 5);
    // Rim highlight
    ctx.fillStyle = STEEL_L;
    ctx.fillRect(-4, -13, 62, 3);
    ctx.restore();

    /* ── DRIVE SHAFT / LINKAGE ──────────────────────────── */
    // Connects flywheel to drum gear ring
    ctx.strokeStyle = GEAR_DARK;
    ctx.lineWidth   = 5;
    ctx.beginPath();
    ctx.moveTo(-108, -42);
    ctx.bezierCurveTo(-108, -60, -60, -68, -55, -72);
    ctx.stroke();

    /* ── FLYWHEEL (large spoked wheel, left side) ────────
       In the real machine this drives the drum via the gear ring */
    var FWX = -120, FWY = -42, FWR = 52;

    // Outer tyre-like ring
    ctx.strokeStyle = RUBBER;
    ctx.lineWidth   = 10;
    ctx.beginPath(); ctx.arc(FWX, FWY, FWR, 0, Math.PI*2); ctx.stroke();

    // Rim
    ctx.strokeStyle = METAL_L;
    ctx.lineWidth   = 4;
    ctx.beginPath(); ctx.arc(FWX, FWY, FWR-7, 0, Math.PI*2); ctx.stroke();

    // Spokes (6, rotating with drum)
    ctx.lineWidth = 5;
    ctx.lineCap   = 'round';
    for (var sp = 0; sp < 6; sp++) {
      var sa = (sp / 6) * Math.PI * 2 + drumAngle;
      var spokeCol = sp % 2 === 0 ? METAL_L : METAL;
      ctx.strokeStyle = spokeCol;
      ctx.beginPath();
      ctx.moveTo(FWX + Math.cos(sa)*11, FWY + Math.sin(sa)*11);
      ctx.lineTo(FWX + Math.cos(sa)*(FWR-9), FWY + Math.sin(sa)*(FWR-9));
      ctx.stroke();
    }
    ctx.lineCap = 'butt';

    // Hub
    ctx.fillStyle = METAL;
    ctx.beginPath(); ctx.arc(FWX, FWY, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = METAL_L;
    ctx.beginPath(); ctx.arc(FWX, FWY, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = STEEL_L;
    ctx.beginPath(); ctx.arc(FWX, FWY, 4, 0, Math.PI*2); ctx.fill();

    /* ══ DRUM ASSEMBLY ════════════════════════════════════
       Translates to drum center, then rotates to match tilt in photo.
       Drum center in machine-local coords: (-38, -(FH-8+82)) ≈ (-38, -162) */
    var DCX = -38, DCY = -170;

    ctx.save();
    ctx.translate(DCX, DCY);
    ctx.rotate(DRUM_TILT);

    /* Drum proportions (units = canvas pixels at k=1):
       Drum is a barrel — roughly a rounded cylinder.
       Body equatorial radius: 80
       Half-height: 100 (opening at -100, bottom cap at +62) */
    var DR   = 80;   // equatorial radius
    var DTOP = -100; // opening end (larger)
    var DBOT =  62;  // bottom end (smaller)

    /* ── DRUM SHADOW ─────────────────────────────────── */
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(8, DBOT+22, DR*0.8, DR*0.28, 0, 0, Math.PI*2);
    ctx.fill();

    /* ── DRUM BODY ───────────────────────────────────── */
    // Shape: bezier barrel (wider at equator, tapering at both ends)
    function drumPath() {
      ctx.beginPath();
      ctx.moveTo(-DR, DTOP);
      // top arch (opening flange radius slightly larger)
      ctx.bezierCurveTo(-DR, DTOP-16, DR, DTOP-16, DR, DTOP);
      // right side — taper toward bottom
      ctx.bezierCurveTo(DR, DTOP+50, DR*0.72, DBOT-10, DR*0.62, DBOT);
      // bottom arch
      ctx.bezierCurveTo(DR*0.62, DBOT+18, -DR*0.62, DBOT+18, -DR*0.62, DBOT);
      // left side
      ctx.bezierCurveTo(-DR*0.72, DBOT-10, -DR, DTOP+50, -DR, DTOP);
      ctx.closePath();
    }

    // Fill with metallic gradient (lighter on upper-right → matches photo)
    var drumGrad = ctx.createLinearGradient(-DR, 0, DR, 0);
    drumGrad.addColorStop(0,    '#2e5068');
    drumGrad.addColorStop(0.18, '#4a7a98');
    drumGrad.addColorStop(0.45, '#7ab0cc');  // main sun highlight
    drumGrad.addColorStop(0.68, '#5890aa');
    drumGrad.addColorStop(0.85, '#3a6880');
    drumGrad.addColorStop(1,    '#284e62');
    ctx.fillStyle = drumGrad;
    drumPath(); ctx.fill();

    // Subtle edge stroke
    ctx.strokeStyle = STEEL_D;
    ctx.lineWidth   = 2;
    drumPath(); ctx.stroke();

    /* ── DRUM SURFACE BANDS (horizontal seam lines) ──── */
    ctx.strokeStyle = 'rgba(30,60,80,0.45)';
    ctx.lineWidth   = 1.5;
    var bands = [DTOP+30, DTOP+60, DTOP+95, DTOP+130];
    bands.forEach(function(by){
      // Band width narrows at ends (barrel taper)
      var t = (by - DTOP) / (DBOT - DTOP);
      var bw = DR * (0.62 + 0.38 * Math.sin(t * Math.PI));
      ctx.beginPath(); ctx.moveTo(-bw, by); ctx.lineTo(bw, by); ctx.stroke();
    });

    /* ── ROTATING SURFACE HIGHLIGHT ──────────────────── */
    // A bright stripe that orbits, making drum look like it spins
    var hlPx = Math.cos(drumAngle) * DR * 0.48;
    var hlGrad = ctx.createRadialGradient(hlPx, -18, 4, hlPx, -18, DR*0.85);
    hlGrad.addColorStop(0,   'rgba(200,235,255,0.30)');
    hlGrad.addColorStop(0.5, 'rgba(180,220,255,0.08)');
    hlGrad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = hlGrad;
    drumPath(); ctx.fill();

    /* ── GEAR RING ────────────────────────────────────── */
    // Crown gear sits around the lower half of the drum body
    var GR  = DR * 1.06;  // gear ring radius
    var GY  = 28;         // position on drum axis (lower half)
    var GPX = 0.32;       // perspective squeeze (ring viewed at angle)

    // Ring body (thick dark ring)
    ctx.fillStyle = GEAR_DARK;
    ctx.beginPath();
    ctx.ellipse(0, GY, GR+5, (GR+5)*GPX, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = GEAR_MID;
    ctx.beginPath();
    ctx.ellipse(0, GY, GR-3, (GR-3)*GPX, 0, 0, Math.PI*2);
    ctx.fill();

    // Teeth (animated — they orbit around the ring)
    var nTeeth = 42;
    for (var t2 = 0; t2 < nTeeth; t2++) {
      var ta  = (t2 / nTeeth) * Math.PI * 2 + drumAngle * 0.9;
      var tx  = Math.cos(ta) * GR;
      var ty  = GY + Math.sin(ta) * GR * GPX;
      // Only draw teeth on the "visible" part (not behind drum body)
      if (Math.sin(ta) > -0.05) {  // front half of ring is visible
        var bright = 0.55 + 0.45 * Math.sin(ta + 0.5); // shading by position
        ctx.fillStyle = t2 % 3 === 0
          ? 'rgba(60,95,115,' + bright + ')'
          : 'rgba(28,42,54,'  + bright + ')';
        ctx.beginPath();
        ctx.arc(tx, ty, 4.2, 0, Math.PI*2);
        ctx.fill();
      }
    }

    // Ring highlight edge
    ctx.strokeStyle = 'rgba(90,140,170,0.4)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.ellipse(0, GY, GR+5, (GR+5)*GPX, 0, Math.PI*0.02, Math.PI*0.98);
    ctx.stroke();

    /* ── DRUM OPENING (mouth of drum, at DTOP) ────────── */
    var MR  = DR * 0.86;   // mouth/opening radius
    var MY2 = DTOP;        // position on drum axis

    // Flange ring (thick steel rim)
    ctx.fillStyle = FRAME_DARK;
    ctx.beginPath();
    ctx.ellipse(0, MY2, MR+10, (MR+10)*0.38, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = STEEL_D;
    ctx.beginPath();
    ctx.ellipse(0, MY2, MR+10, (MR+10)*0.38, 0, 0, Math.PI*2);
    ctx.strokeStyle = STEEL_HL;
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // Dark interior
    ctx.fillStyle = '#0c1218';
    ctx.beginPath();
    ctx.ellipse(0, MY2, MR, MR*0.38, 0, 0, Math.PI*2);
    ctx.fill();

    // Interior: rotating concrete + mixing fins (visible through opening)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, MY2, MR, MR*0.38, 0, 0, Math.PI*2);
    ctx.clip();

    // Concrete slurry surface (slowly rotating blob)
    var concreteHue = 'rgba(130,108,70,0.75)';
    ctx.fillStyle = concreteHue;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(drumAngle*0.4)*MR*0.3,
      MY2 + Math.sin(drumAngle*0.4)*MR*0.38*0.6,
      MR*0.78, MR*0.38*0.72, drumAngle*0.25, 0, Math.PI*2
    );
    ctx.fill();

    // Wet concrete sheen
    ctx.fillStyle = 'rgba(175,148,90,0.3)';
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(drumAngle*0.4+1.5)*MR*0.22,
      MY2 + Math.sin(drumAngle*0.4+1.5)*MR*0.22,
      MR*0.42, MR*0.38*0.4, 0, 0, Math.PI*2
    );
    ctx.fill();

    // Rotating mixing fins (3 fins inside drum)
    for (var fi = 0; fi < 3; fi++) {
      var fa  = (fi / 3) * Math.PI * 2 + drumAngle;
      var fxe = Math.cos(fa) * MR * 0.7;
      var fye = MY2 + Math.sin(fa) * MR * 0.38 * 0.85;
      ctx.strokeStyle = 'rgba(80,130,158,0.80)';
      ctx.lineWidth   = 6;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(0, MY2);
      ctx.lineTo(fxe, fye);
      ctx.stroke();
      // Fin tip highlight
      ctx.fillStyle = 'rgba(100,160,190,0.5)';
      ctx.beginPath(); ctx.arc(fxe, fye, 4, 0, Math.PI*2); ctx.fill();
    }
    ctx.lineCap = 'butt';
    ctx.restore(); // end clip

    // Flange inner edge highlight
    ctx.strokeStyle = 'rgba(106,160,190,0.5)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, MY2, MR, MR*0.38, 0, 0, Math.PI*2);
    ctx.stroke();

    /* ── BOTTOM CAP of drum ───────────────────────────── */
    // The rounded/closed end of the barrel
    var capGrad = ctx.createRadialGradient(0, DBOT+12, 4, 0, DBOT+12, DR*0.65);
    capGrad.addColorStop(0, STEEL_L);
    capGrad.addColorStop(0.5, STEEL);
    capGrad.addColorStop(1, STEEL_D);
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.ellipse(0, DBOT+12, DR*0.62, DR*0.21, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = FRAME_DARK; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, DBOT+12, DR*0.62, DR*0.21, 0, 0, Math.PI*2);
    ctx.stroke();
    // Central spindle bolt
    ctx.fillStyle = METAL;
    ctx.beginPath(); ctx.arc(0, DBOT+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = METAL_L;
    ctx.beginPath(); ctx.arc(0, DBOT+12,  8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = STEEL_L;
    ctx.beginPath(); ctx.arc(0, DBOT+12,  4, 0, Math.PI*2); ctx.fill();
    // Bolts around spindle (rotate with drum)
    for (var bl = 0; bl < 6; bl++) {
      var ba = (bl/6) * Math.PI*2 + drumAngle;
      ctx.fillStyle = METAL;
      ctx.beginPath();
      ctx.arc(Math.cos(ba)*20, DBOT+12+Math.sin(ba)*7, 3.5, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore(); // end drum tilt

    /* ── Spawn exhaust smoke from pipe ───────────────── */
    if (Math.random() < 0.07) {
      var ek = sc() * 1.18;
      spawnSmoke(mx + (DCX + 133) * ek, my + (FY - 30) * ek);
    }

    ctx.restore(); // end machine translate/scale
  }

  /* ── Drum wheel helper ─────────────────────────────────── */
  function drumWheel(x, y, r, isBig) {
    var RUBBER    = '#181a1e';
    var RUBBER_R  = '#242830';
    var HUB       = '#2a3440';
    var HUB_L     = '#3a5060';
    var SPOKE_C   = '#304050';

    // Tyre (outer ring)
    ctx.fillStyle = RUBBER;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    // Tyre sidewall groove
    ctx.strokeStyle = RUBBER_R;
    ctx.lineWidth   = isBig ? 3.5 : 2.5;
    ctx.beginPath(); ctx.arc(x, y, r-4, 0, Math.PI*2); ctx.stroke();
    // Tyre tread marks (short radial dashes)
    if (isBig) {
      ctx.strokeStyle = 'rgba(50,60,70,0.7)';
      ctx.lineWidth   = 1;
      for (var td = 0; td < 18; td++) {
        var ta = (td/18) * Math.PI*2 + drumAngle*0.5;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ta)*(r-2), y + Math.sin(ta)*(r-2));
        ctx.lineTo(x + Math.cos(ta)*(r-6), y + Math.sin(ta)*(r-6));
        ctx.stroke();
      }
    }

    // Rim
    ctx.fillStyle = HUB;
    ctx.beginPath(); ctx.arc(x, y, r*0.54, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = HUB_L;
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.arc(x, y, r*0.54, 0, Math.PI*2); ctx.stroke();

    // Spokes (rotate with drum)
    var nSpokes = isBig ? 5 : 4;
    ctx.lineWidth = isBig ? 4.5 : 3.5;
    ctx.lineCap   = 'round';
    for (var s = 0; s < nSpokes; s++) {
      var sa = (s/nSpokes) * Math.PI*2 + drumAngle;
      ctx.strokeStyle = s % 2 === 0 ? SPOKE_C : HUB;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(sa)*(r*0.54-2), y + Math.sin(sa)*(r*0.54-2));
      ctx.lineTo(x + Math.cos(sa)*(r*0.54+r*0.36-3), y + Math.sin(sa)*(r*0.54+r*0.36-3));
      ctx.stroke();
    }
    ctx.lineCap = 'butt';

    // Hub cap
    ctx.fillStyle = HUB;
    ctx.beginPath(); ctx.arc(x, y, r*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = HUB_L;
    ctx.beginPath(); ctx.arc(x, y, r*0.14, 0, Math.PI*2); ctx.fill();
    // Centre bolt
    ctx.fillStyle = '#6a9ab0';
    ctx.beginPath(); ctx.arc(x, y, r*0.07, 0, Math.PI*2); ctx.fill();
  }

  /* ── WORKERS ───────────────────────────────────────────── */
  function drawWorkers() {
    var k = sc();

    // Wheelbarrow worker — positioned at drum opening, collecting concrete
    var tip = chuteExit();
    worker(tip.x - 20, H*0.848, k*1.00, 'wheelbarrow');
    // Walking worker — patrols left side
    var walkX = W*0.26 + (Math.sin(time * 0.22) * 0.07 + 0.02) * W;
    worker(walkX, H*0.840, k*0.92, 'walk');
    // Shovel worker — left of machine
    worker(W*0.435, H*0.845, k*1.02, 'shovel');
    // Scaffolding hammerer — left scaffold, mid height
    worker(px(W*0.135, -20), py(H*0.658, -5), k*0.80, 'hammer');
    // Foreman — right side watching
    worker(W*0.760, H*0.838, k*0.88, 'foreman');
    // Brick layer — near right scaffolding
    worker(px(W*0.825, -15), py(H*0.69, -4), k*0.78, 'bricklayer');
  }

  function worker(x, y, k, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(k, k);

    var body  = '#1a1406';
    var vest  = '#F59E0B';
    var skin  = '#8B6540';

    function hat(hx, hy) {
      // Brim
      ctx.fillStyle = vest;
      ctx.fillRect(hx-13, hy-10, 26, 4);
      // Crown
      ctx.fillStyle = vest;
      rr(hx-10, hy-22, 20, 14, 3);
      ctx.fill();
      // Shine
      ctx.fillStyle = 'rgba(255,255,180,0.3)';
      ctx.fillRect(hx-5, hy-20, 6, 4);
    }

    function head(hx, hy) {
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI*2); ctx.fill();
      hat(hx, hy);
    }

    if (type === 'shovel') {
      ctx.fillStyle = body;   ctx.fillRect(-9, -38, 18, 38);
      ctx.fillStyle = vest;   ctx.globalAlpha = 0.85;
      ctx.fillRect(-8, -35, 16, 22); ctx.globalAlpha = 1;
      head(0, -47);
      // Shovel arm oscillates
      var a = Math.sin(time * 2.8) * 0.55;
      ctx.save(); ctx.translate(9, -28); ctx.rotate(a - 0.45);
      ctx.strokeStyle = body; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 32); ctx.stroke();
      ctx.fillStyle = '#2e2210';
      ctx.fillRect(-7, 29, 14, 5);
      ctx.restore();
      // Other arm
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-9,-22); ctx.lineTo(-18,-8); ctx.stroke();
      // Legs
      var lv = Math.sin(time*1.8)*6;
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-5+lv,26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 3,0); ctx.lineTo( 5-lv,26); ctx.stroke();

    } else if (type === 'walk') {
      var wc  = time * 3.5;
      var leg = Math.sin(wc) * 18;
      var arm = Math.sin(wc) * 14;
      ctx.fillStyle = body;   ctx.fillRect(-8,-36,16,36);
      ctx.fillStyle = vest;   ctx.globalAlpha = 0.75;
      ctx.fillRect(-7,-33,14,20); ctx.globalAlpha = 1;
      head(0, -45);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-7,-26); ctx.lineTo(-16-arm*0.3,-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 7,-26); ctx.lineTo( 16+arm*0.3,-10); ctx.stroke();
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-3-leg*0.5,26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 3,0); ctx.lineTo( 3+leg*0.5,26); ctx.stroke();

    } else if (type === 'hammer') {
      ctx.fillStyle = body;   ctx.fillRect(-8,-36,16,36);
      ctx.fillStyle = vest;   ctx.globalAlpha = 0.75;
      ctx.fillRect(-7,-33,14,20); ctx.globalAlpha = 1;
      head(0, -45);
      var hs = Math.sin(time * 7) * 0.65;
      ctx.save(); ctx.translate(9,-26); ctx.rotate(hs - 0.4);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(14,22); ctx.stroke();
      ctx.fillStyle = '#2e2610';
      ctx.fillRect(10, 20, 12, 7);
      ctx.restore();
      // Spark on impact
      if (Math.sin(time*7) > 0.75) spawnSpark(x + 23*k, y - 22*k);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-9,-26); ctx.lineTo(-20,-10); ctx.stroke();
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-4,0); ctx.lineTo(-6,27); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 4,0); ctx.lineTo( 6,27); ctx.stroke();

    } else if (type === 'wheelbarrow') {
      ctx.fillStyle = body;   ctx.fillRect(-8,-34,16,34);
      ctx.fillStyle = vest;   ctx.globalAlpha = 0.75;
      ctx.fillRect(-7,-31,14,18); ctx.globalAlpha = 1;
      head(0, -43);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-7,-22); ctx.lineTo(-18,2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 7,-22); ctx.lineTo( 18,2); ctx.stroke();
      var wl = Math.sin(time*3)*14;
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-3-wl*0.4,26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 3,0); ctx.lineTo( 3+wl*0.4,26); ctx.stroke();
      // Wheelbarrow body
      ctx.fillStyle = '#201a08';
      ctx.beginPath();
      ctx.moveTo(16,-6); ctx.lineTo(44,-6);
      ctx.lineTo(40, 10); ctx.lineTo(20, 10);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#3a2e10'; ctx.lineWidth = 1.5; ctx.stroke();
      // Concrete load
      ctx.fillStyle = 'rgba(160,135,75,0.75)';
      ctx.fillRect(21,-3,18,10);
      // Wheel
      ctx.fillStyle = '#0e0b04';
      ctx.beginPath(); ctx.arc(30,16,8,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#2e2408'; ctx.lineWidth = 2; ctx.stroke();
      // Handles
      ctx.strokeStyle = '#261e08'; ctx.lineWidth = 4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-18,2); ctx.lineTo(16,-3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 18,2); ctx.lineTo(40,-3); ctx.stroke();

    } else if (type === 'foreman') {
      var sw = Math.sin(time*0.8)*3;
      ctx.save(); ctx.rotate(sw*0.012);
      ctx.fillStyle = body;   ctx.fillRect(-9,-38,18,38);
      ctx.fillStyle = '#E08000'; ctx.globalAlpha = 0.85;
      ctx.fillRect(-8,-35,16,22); ctx.globalAlpha = 1;
      head(0, -47);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo( 8,-28); ctx.lineTo(20,-14); ctx.stroke();
      // Clipboard
      ctx.fillStyle = '#e8d8a0';
      rr(17,-20,15,18,3); ctx.fill();
      ctx.fillStyle = '#4a3a10';
      for (var cl = 0; cl < 3; cl++) ctx.fillRect(19,-16+cl*5,10,2);
      ctx.strokeStyle = body; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(-8,-28); ctx.lineTo(-18,-12); ctx.stroke();
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-4,0); ctx.lineTo(-6,28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 4,0); ctx.lineTo( 6,28); ctx.stroke();
      ctx.restore();

    } else if (type === 'bricklayer') {
      // Crouching to lay bricks
      ctx.fillStyle = body;   ctx.fillRect(-8,-28,16,28);
      ctx.fillStyle = vest;   ctx.globalAlpha = 0.75;
      ctx.fillRect(-7,-25,14,15); ctx.globalAlpha = 1;
      head(0, -37);
      // Trowel arm
      var ta = Math.sin(time*1.5)*0.25;
      ctx.save(); ctx.translate(8,-18); ctx.rotate(ta+0.3);
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(10,18); ctx.stroke();
      // Trowel
      ctx.fillStyle = '#3a3010';
      ctx.beginPath();
      ctx.moveTo(6,16); ctx.lineTo(14,14); ctx.lineTo(16,22); ctx.lineTo(8,24);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      // Other arm
      ctx.strokeStyle = body; ctx.lineWidth = 7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-8,-18); ctx.lineTo(-16,-6); ctx.stroke();
      // Bent legs (crouching)
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-12,18); ctx.lineTo(-8,28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( 3,0); ctx.lineTo( 12,18); ctx.lineTo( 8,28); ctx.stroke();
      // Brick row
      for (var br = 0; br < 4; br++) {
        ctx.fillStyle = br%2===0 ? 'rgba(90,55,20,0.9)' : 'rgba(75,45,15,0.9)';
        rr(-22+br*13,-36+br*2,11,7,2); ctx.fill();
        ctx.strokeStyle = 'rgba(55,35,10,0.6)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    ctx.restore();
  }

  /* ── CONCRETE PARTICLES ────────────────────────────────── */
  // Drum opening world position — derived from machine transform:
  //   Machine anchor: (W*MX_FRAC, H*MY_FRAC)
  //   Drum center local: (DCX=-38, DCY=-170) scaled by k=sc()*1.18
  //   Drum tilt: DRUM_TILT=-0.68 rad
  //   Opening tip at drum-local (0, DTOP=-100):
  //     After rotate: x'=sin(-0.68)*100=−62.9, y'=−cos(0.68)*100=−77.7
  //   World: anchor + (DCX+x', DCY+y') * k
  function chuteExit() {
    var k  = sc() * 1.18;
    var mx = W * MX_FRAC;
    var my = H * MY_FRAC;
    var DCX = -38, DCY = -170;
    var tipX = DCX + Math.sin(DRUM_TILT) * 100;  // ≈ -38 + (-62.9) = -100.9
    var tipY = DCY - Math.cos(DRUM_TILT) * 100;  // ≈ -170 - 77.7 = -247.7
    return {
      x: mx + tipX * k,
      y: my + tipY * k
    };
  }

  function spawnConcrete() {
    var tip = chuteExit();
    for (var i = 0; i < 3; i++) {
      var k = sc();
      concreteP.push({
        x: tip.x + (Math.random()-0.5)*9*k,
        y: tip.y + (Math.random()-0.5)*4*k,
        vx: (Math.random()-0.5)*1.8*k,
        vy: (Math.random()*0.8+0.6)*k,
        r:  (Math.random()*3.5+2)*k,
        life: 1,
        decay: 0.014 + Math.random()*0.008,
        hue: Math.floor(Math.random()*3)
      });
    }
  }

  function updateConcrete() {
    spawnConcrete();
    var groundY = H * 0.84;

    concreteP = concreteP.filter(function (p) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.18;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      var col = p.hue === 0 ? 'rgba(185,158,92,'
              : p.hue === 1 ? 'rgba(158,132,74,'
              :                'rgba(130,108,58,';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = col + p.life + ')';
      ctx.fill();

      if (p.y >= groundY && !p.hit) {
        p.hit = true;
        ctx.beginPath();
        ctx.ellipse(p.x, groundY, p.r*3.5, p.r*1.2, 0, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(168,140,72,0.28)';
        ctx.fill();
      }
      return true;
    });
  }

  /* ── SMOKE ─────────────────────────────────────────────── */
  function spawnSmoke(x, y) {
    smokeP.push({
      x: x, y: y,
      vx: (Math.random()-0.5)*0.9,
      vy: -(Math.random()*0.7+0.4),
      r:  Math.random()*6+4,
      grow: Math.random()*0.4+0.15,
      life: 1,
      decay: 0.007 + Math.random()*0.005
    });
  }

  function updateSmoke() {
    smokeP = smokeP.filter(function(p){
      p.x   += p.vx;
      p.y   += p.vy;
      p.r   += p.grow;
      p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(55,45,20,' + (0.18*p.life) + ')';
      ctx.fill();
      return true;
    });
  }

  /* ── SPARKS ────────────────────────────────────────────── */
  function spawnSpark(x, y) {
    for (var i = 0; i < 5; i++) {
      var a = Math.random() * Math.PI*2;
      var s = Math.random()*3+1;
      sparksP.push({
        x: x, y: y,
        vx: Math.cos(a)*s,
        vy: Math.sin(a)*s - 1.5,
        r:  Math.random()*2+1,
        life: 1,
        decay: 0.08 + Math.random()*0.05
      });
    }
  }

  function updateSparks() {
    sparksP = sparksP.filter(function(p){
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.2;
      p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,' + Math.floor(180+75*p.life) + ',30,' + p.life + ')';
      ctx.fill();
      return true;
    });
  }

  /* ── DUST ──────────────────────────────────────────────── */
  function mkDust() {
    return {
      x: Math.random()*W,
      y: H*0.48 + Math.random()*H*0.45,
      vx:(Math.random()-0.5)*0.5,
      vy:-(Math.random()*0.35+0.1),
      r:  Math.random()*4.5+1,
      life: 1,
      decay: 0.003 + Math.random()*0.004,
      alpha: Math.random()*0.09+0.02
    };
  }

  function updateDust() {
    while (dustP.length < 55) dustP.push(mkDust());
    dustP = dustP.filter(function(p){
      p.x   += p.vx;
      p.y   += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(190,155,70,' + (p.alpha*p.life) + ')';
      ctx.fill();
      return true;
    });
  }

  /* ── ATMOSPHERE OVERLAY ────────────────────────────────── */
  function drawAtmosphere() {
    // Left text-area darkening (ensures headline readability)
    var lg = ctx.createLinearGradient(0, 0, W * 0.58, 0);
    lg.addColorStop(0,    'rgba(5,4,2,0.88)');
    lg.addColorStop(0.28, 'rgba(5,4,2,0.72)');
    lg.addColorStop(0.50, 'rgba(5,4,2,0.38)');
    lg.addColorStop(0.70, 'rgba(5,4,2,0.10)');
    lg.addColorStop(1,    'rgba(5,4,2,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, W, H);

    // Top vignette
    var tv = ctx.createLinearGradient(0, 0, 0, H*0.18);
    tv.addColorStop(0, 'rgba(0,0,0,0.5)');
    tv.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = tv;
    ctx.fillRect(0, 0, W, H*0.18);

    // Bottom vignette
    var bv = ctx.createLinearGradient(0, H*0.78, 0, H);
    bv.addColorStop(0, 'rgba(0,0,0,0)');
    bv.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = bv;
    ctx.fillRect(0, H*0.78, W, H*0.22);

    // Warm spotlight glow on ground under mixer
    var k   = sc();
    var sg  = ctx.createRadialGradient(W*0.60, H*0.86, 8, W*0.60, H*0.86, 140*k);
    sg.addColorStop(0,   'rgba(245,158,11,0.22)');
    sg.addColorStop(0.4, 'rgba(245,130,0,0.08)');
    sg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, H*0.72, W, H*0.28);
  }

  /* ── KICK OFF ──────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
