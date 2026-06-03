const canvas = document.querySelector(".cinema-canvas");
const progress = document.querySelector(".progress-rail span");
const portal = document.querySelector(".portal");
const soundToggle = document.querySelector(".sound-toggle");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let frame = 0;
let targetScroll = window.scrollY;
let easedScroll = window.scrollY;

const palette = ["223,255,0", "160,32,240", "0,163,255", "255,255,255"];
const particles = Array.from({ length: 230 }, (_, index) => ({
  angle: (index / 230) * Math.PI * 2,
  radius: 40 + Math.random() * 560,
  speed: 0.001 + Math.random() * 0.003,
  z: Math.random(),
  hue: index % palette.length,
  lane: Math.random() > 0.5 ? 1 : -1
}));

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const maxScroll = () => Math.max(document.documentElement.scrollHeight - height, 1);

const draw = () => {
  targetScroll = window.scrollY;
  easedScroll += (targetScroll - easedScroll) * 0.075;
  const scroll = easedScroll / maxScroll();
  frame += 1;

  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.42, 20, width * 0.5, height * 0.42, Math.max(width, height));
  gradient.addColorStop(0, `rgba(160,32,240,${0.12 + scroll * 0.18})`);
  gradient.addColorStop(0.38, `rgba(0,163,255,${0.08 + scroll * 0.12})`);
  gradient.addColorStop(1, "rgba(5,5,16,0.12)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(scroll * Math.PI * 1.45);

  particles.forEach((particle, index) => {
    const chapterPulse = Math.sin(scroll * Math.PI * 14 + index) * 46;
    const radius = particle.radius * (0.44 + particle.z * 0.9) + chapterPulse;
    const angle = particle.angle + frame * particle.speed * particle.lane + scroll * Math.PI * 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle * 1.22) * radius * 0.58;
    const size = 1.1 + particle.z * 4 + Math.sin(frame * 0.03 + index) * 0.9;
    const color = palette[particle.hue];
    ctx.fillStyle = `rgba(${color},${0.24 + particle.z * 0.66})`;
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(${color},0.86)`;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(size, 0.35), 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < 17; i += 1) {
    ctx.strokeStyle = `rgba(223,255,0,${0.035 + scroll * 0.055})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 130 + i * 43 + scroll * 120, 40 + i * 18, frame * 0.004 + i, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  progress.style.transform = `scaleY(${scroll})`;
  if (portal) {
    const scale = 0.68 + Math.sin(scroll * Math.PI) * 0.78 + scroll * 0.42;
    portal.style.transform = `rotate(${scroll * 360}deg) scale(${scale})`;
    portal.style.opacity = `${0.38 + Math.sin(scroll * Math.PI) * 0.42}`;
  }

  requestAnimationFrame(draw);
};

soundToggle.addEventListener("click", () => {
  const active = soundToggle.getAttribute("aria-pressed") === "true";
  soundToggle.setAttribute("aria-pressed", String(!active));
  soundToggle.textContent = active ? "Ambient muted" : "Ambient on";
});

window.addEventListener("resize", resize, { passive: true });
resize();
requestAnimationFrame(draw);
