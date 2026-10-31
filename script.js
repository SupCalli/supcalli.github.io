// ======================================================
//  Portfolio interactions
// ======================================================
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Intro loader ----------
const intro = document.getElementById("intro");
if (intro) {
  if (prefersReduced) {
    intro.classList.add("is-done");
  } else {
    const dismiss = () => intro.classList.add("is-done");
    // dismiss after the logo animation finishes, with a safety fallback
    window.addEventListener("load", () => setTimeout(dismiss, 1900));
    setTimeout(dismiss, 3200); // fallback in case 'load' is slow
  }
}

// ---------- Mobile navigation toggle ----------
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Typing effect ----------
const typedEl = document.querySelector("[data-typed]");
if (typedEl) {
  const words = [
    "QA Automation Engineer.",
    "Software Test Engineer.",
    "Test Automation Specialist.",
    "CI/CD Pipeline Builder.",
  ];

  if (prefersReduced) {
    typedEl.textContent = words[0];
  } else {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = current.slice(0, charIndex);

      let delay = deleting ? 45 : 90;
      if (!deleting && charIndex === current.length) {
        delay = 1600; // pause at full word
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  }
}

// ---------- Wrap section titles in word spans for staggered reveal ----------
if (!prefersReduced) {
  document.querySelectorAll(".section__title").forEach((title) => {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words
      .map(
        (w, i) =>
          `<span class="word" style="transition-delay:${0.06 * i}s">${w}</span>`
      )
      .join(" ");
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group]");
if (prefersReduced || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ---------- Portrait 3D tilt ----------
const tiltEl = document.querySelector("[data-tilt] .portrait");
if (tiltEl && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
  const wrap = tiltEl.parentElement;
  const MAX = 12; // degrees
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltEl.style.transform =
      `rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
  });
  wrap.addEventListener("mouseleave", () => {
    tiltEl.style.transform = "rotateY(0) rotateX(0)";
  });
}

// ---------- Hero particle constellation ----------
const canvas = document.querySelector(".hero__canvas");
if (canvas && !prefersReduced) {
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let particles = [];
  const mouse = { x: null, y: null };

  const config = {
    density: 10000, // lower = more particles
    maxParticles: 120,
    linkDist: 130,
    speed: 0.35,
    color: "79, 209, 197",
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = Math.min(
      config.maxParticles,
      Math.floor((w * h) / config.density)
    );
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color}, 0.8)`;
      ctx.fill();
    }

    // links between nearby particles + cursor
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        link(particles[i], particles[j], config.linkDist);
      }
      if (mouse.x !== null) {
        link(particles[i], mouse, config.linkDist + 40);
      }
    }
    requestAnimationFrame(step);
  }

  function link(a, b, maxDist) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    if (dist < maxDist) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${config.color}, ${0.18 * (1 - dist / maxDist)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const heroEl = document.querySelector(".hero");
  heroEl.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  heroEl.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", resize);
  resize();
  step();
}

// ---------- Scroll-spy (highlight active nav link) ----------
const navLinks = Array.from(document.querySelectorAll('.nav__menu a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const setActive = (id) => {
    navLinks.forEach((l) =>
      l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`)
    );
  };

  const spyUpdate = () => {
    const scrollPos = window.scrollY;
    const atBottom =
      window.innerHeight + scrollPos >= document.body.offsetHeight - 2;

    // If scrolled to the very bottom, always activate the last section.
    if (atBottom) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    // Otherwise, activate the section whose top is closest above the viewport midpoint.
    const marker = scrollPos + window.innerHeight * 0.35;
    let currentId = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop <= marker) currentId = section.id;
    }
    setActive(currentId);
  };

  window.addEventListener("scroll", spyUpdate, { passive: true });
  window.addEventListener("resize", spyUpdate);
  spyUpdate();
}

// ---------- Count-up stats ----------
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  } else {
    counters.forEach(runCount);
  }
}

// ---------- Back to top ----------
const toTop = document.getElementById("toTop");
if (toTop) {
  const onScroll = () => {
    const show = window.scrollY > 600;
    toTop.hidden = false;
    toTop.classList.toggle("is-shown", show);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
  onScroll();
}

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById("scrollProgress");
if (progressBar) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${pct})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

// ---------- Cursor spotlight ----------
const glow = document.getElementById("cursorGlow");
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (glow && finePointer && !prefersReduced) {
  let gx = 0, gy = 0, cx = 0, cy = 0;
  let glowRaf = null;

  const render = () => {
    // ease toward the cursor for a smooth trailing feel
    cx += (gx - cx) * 0.18;
    cy += (gy - cy) * 0.18;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
      glowRaf = requestAnimationFrame(render);
    } else {
      glowRaf = null;
    }
  };

  window.addEventListener("mousemove", (e) => {
    gx = e.clientX;
    gy = e.clientY;
    glow.classList.add("is-active");
    if (!glowRaf) glowRaf = requestAnimationFrame(render);
  });
  document.addEventListener("mouseleave", () => glow.classList.remove("is-active"));
}

// ---------- Card gradient-glow follow ----------
if (finePointer) {
  document
    .querySelectorAll(".skill-card, .project-card, .education__card, .interest-card")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
}

// ---------- Magnetic buttons ----------
if (finePointer && !prefersReduced) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
}

// ---------- Live test console (Robot Framework) ----------
const consoleEl = document.getElementById("console");
if (consoleEl) {
  const tests = [
    "Valid User Can Log In",
    "Invalid Login Shows Error",
    "Add Product To Cart",
    "Complete Checkout Flow",
    "Search Filters Products",
    "Admin Can Manage Orders",
  ];
  const command = "$ robot --outputdir results tests/";
  const suite = "E-Commerce";
  const colWidth = 46; // chars before the status column

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const rule = "=".repeat(colWidth + 10);
  const padRow = (name) => {
    const dots = ".".repeat(Math.max(2, colWidth - name.length));
    return `${esc(name)} ${dots} `;
  };

  const staticLines = () => {
    let s = `<span class="c-cmd">${esc(command)}</span>\n`;
    s += `<span class="c-dim">${rule}</span>\n`;
    s += `<span class="c-accent">${suite}</span>\n`;
    s += `<span class="c-dim">${rule}</span>\n`;
    tests.forEach((t) => {
      s += `${padRow(t)}<span class="c-pass">| PASS |</span>\n`;
    });
    s += `<span class="c-dim">${rule}</span>\n`;
    s += `<span class="c-accent">${suite}</span> <span class="c-dim">:: ${tests.length} tests,</span> <span class="c-pass">${tests.length} passed</span><span class="c-dim">, 0 failed</span>\n`;
    s += `<span class="c-dim">${rule}</span>`;
    return s;
  };

  if (prefersReduced) {
    consoleEl.innerHTML = staticLines();
  } else {
    const caret = '<span class="console__caret"></span>';

    const run = async () => {
      // 1) type the command
      consoleEl.innerHTML = caret;
      let typed = "";
      for (const ch of command) {
        typed += ch;
        consoleEl.innerHTML = `<span class="c-cmd">${esc(typed)}</span>${caret}`;
        await sleep(42);
      }
      await sleep(350);

      // 2) suite header
      let out = `<span class="c-cmd">${esc(command)}</span>\n`;
      out += `<span class="c-dim">${rule}</span>\n`;
      out += `<span class="c-accent">${suite}</span>\n`;
      out += `<span class="c-dim">${rule}</span>\n`;
      consoleEl.innerHTML = out + caret;
      await sleep(400);

      // 3) stream each test result Robot-style
      let passed = 0;
      for (const t of tests) {
        // show the test name with trailing dots first (running)
        consoleEl.innerHTML = out + padRow(t) + caret;
        await sleep(280);
        passed++;
        out += `${padRow(t)}<span class="c-pass">| PASS |</span>\n`;
        consoleEl.innerHTML = out + caret;
        await sleep(180);
      }

      // 4) summary
      await sleep(250);
      out += `<span class="c-dim">${rule}</span>\n`;
      out += `<span class="c-accent">${suite}</span> <span class="c-dim">:: ${tests.length} tests,</span> <span class="c-pass">${passed} passed</span><span class="c-dim">, 0 failed</span>\n`;
      out += `<span class="c-dim">${rule}</span>`;
      consoleEl.innerHTML = out + " " + caret;

      // 5) hold, then loop
      await sleep(3600);
      run();
    };

    // Start only when the console scrolls into view
    if ("IntersectionObserver" in window) {
      let started = false;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !started) {
              started = true;
              run();
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(consoleEl);
    } else {
      run();
    }
  }
}
