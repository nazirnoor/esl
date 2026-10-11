const root = document.documentElement;
const menuBtn = document.querySelector('#menuBtn');
const navMenu = document.querySelector('#navMenu');
const themeToggle = document.querySelector('#themeToggle');
const toast = document.querySelector('#toast');

const savedTheme = localStorage.getItem('nazir-theme');
if (savedTheme) root.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('nazir-theme', root.dataset.theme);
});

menuBtn.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-menu a')];
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('#progressBar').style.width = `${max ? scrollY / max * 100 : 0}%`;
  const current = sections.filter(section => section.offsetTop <= scrollY + 170).at(-1)?.id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}, { passive: true });

const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

const openWechat = async trigger => {
  const id = trigger.dataset.wechatId;
  const message = `${trigger.dataset.message}\n\nWeChat ID: ${id}`;
  try {
    await navigator.clipboard.writeText(message);
    showToast('Message copied. Opening WeChat…');
  } catch {
    showToast(`WeChat ID: ${id}`);
  }
  setTimeout(() => { window.location.href = 'weixin://'; }, 180);
};

document.querySelector('#copyWechat').addEventListener('click', event => openWechat(event.currentTarget));
document.querySelector('.dock-wechat')?.addEventListener('click', event => openWechat(event.currentTarget));

document.querySelector('#printBtn').addEventListener('click', () => window.print());

document.querySelector('#year').textContent = new Date().getFullYear();

const themeColor = document.querySelector('#themeColor');
const syncThemeColor = () => {
  themeColor.setAttribute('content', root.dataset.theme === 'dark' ? '#0b1515' : '#f4f6f3');
};
syncThemeColor();
themeToggle.addEventListener('click', syncThemeColor);

document.addEventListener('keydown', event => { if (event.key === 'Escape') { navMenu.classList.remove('open'); document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded','false'); } });
