/* global document, window, fetch, URL, AbortSignal */
import { readChangelog, releaseNotes } from './changelog.mjs';
import { appendReleaseNotes } from './changelog-view.js';
// 纯静态官网：下载与更新共用已发布版本清单，不收集照片或使用数据。
const views = [
  {
    key: 'review',
    src: './assets/workspace-demo.jpg',
    title: '摄影复盘 · 照片与拍摄参数同屏',
    alt: '山湖照片旁同步显示拍摄参数和规则解读',
    caption: '看照片，也看拍摄参数。',
  },
  {
    key: 'selection',
    src: './assets/selection-demo.jpg',
    title: '照片选片 · 宫格对比，一起比较',
    alt: '四图对比界面，可同时查看照片与参数差异',
    caption: '放在一起看，差别更清楚。',
  },
  {
    key: 'organize',
    src: './assets/organize-demo.jpg',
    title: '自动整理 · 选完，也整理好了',
    alt: '本批次整理设置，可选择复制或剪切、存储位置和分类文件夹名称',
    caption: '按你的习惯复制或剪切，标记后自动归入文件夹。',
  },
  {
    key: 'comparison',
    src: './assets/comparison-demo.jpg',
    title: '双图对比 · 看照片，也比较参数',
    alt: '两张照片并排对比，右侧同步呈现拍摄参数差异',
    caption: '两张并排，专注比较；同步缩放，检查细节。',
  },
];
const tabs = [...document.querySelectorAll('[data-view]')];
const panel = document.getElementById('product-panel');
const carousel = document.getElementById('experience');
const playback = document.getElementById('carousel-playback');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// 标题拥有独立节奏和渐变图层，不响应截图切换、暂停或截图区域的焦点。
const headlineArea = document.querySelector('.hero-copy');
const headlineCopies = [...document.querySelectorAll('.headline-copy')];
let currentHeadline = 0;
let headlineTimer;
function scheduleHeadline() {
  window.clearTimeout(headlineTimer);
  if (
    reducedMotion.matches ||
    document.hidden ||
    headlineArea.matches(':hover, :focus-within') ||
    document.querySelector('dialog[open]')
  )
    return;
  headlineTimer = window.setTimeout(() => {
    currentHeadline = (currentHeadline + 1) % headlineCopies.length;
    headlineCopies.forEach((copy, index) => {
      const active = index === currentHeadline;
      copy.classList.toggle('active', active);
      copy.setAttribute('aria-hidden', String(!active));
    });
    scheduleHeadline();
  }, 5600);
}
['mouseenter', 'mouseleave', 'focusin'].forEach((name) =>
  headlineArea.addEventListener(name, scheduleHeadline),
);
headlineArea.addEventListener('focusout', () => window.setTimeout(scheduleHeadline, 0));
document.addEventListener('visibilitychange', scheduleHeadline);
reducedMotion.addEventListener('change', scheduleHeadline);
scheduleHeadline();
let currentSlide = 0;
let paused = reducedMotion.matches;
let timer;
function scheduleSlide() {
  window.clearTimeout(timer);
  // 阅读、键盘操作、弹窗或后台状态暂停推进，避免用户正在查看的内容被替换。
  if (
    paused ||
    document.hidden ||
    carousel.matches(':hover, :focus-within') ||
    document.querySelector('dialog[open]')
  )
    return;
  timer = window.setTimeout(() => {
    selectView(currentSlide + 1);
  }, 6500);
}
function selectView(index, focus = false) {
  currentSlide = (index + views.length) % views.length;
  const view = views[currentSlide];
  tabs.forEach((tab, i) => {
    const active = i === currentSlide;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[currentSlide].id);
  const image = document.getElementById('product-image');
  image.src = view.src;
  image.alt = view.alt;
  document.getElementById('view-title').textContent = view.title;
  document.getElementById('image-caption').textContent = view.caption;
  document.querySelector('.caption-counter').textContent =
    `${String(currentSlide + 1).padStart(2, '0')} / 04`;
  // 流程跟随截图高亮；点击只切换内容，保留当前滚动位置与按钮焦点。
  document.querySelectorAll('.feature-card').forEach((step) => {
    const key = view.key === 'selection' ? 'comparison' : view.key;
    const active = step.dataset.showView === key;
    step.classList.toggle('active', active);
    step.setAttribute('aria-pressed', String(active));
  });
  if (focus) tabs[currentSlide].focus();
  scheduleSlide();
}
function keyboardSlide(event, focus) {
  let next;
  if (event.key === 'ArrowRight') next = currentSlide + 1;
  if (event.key === 'ArrowLeft') next = currentSlide - 1;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = views.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  selectView(next, focus);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectView(index));
  tab.addEventListener('keydown', (event) => keyboardSlide(event, true));
});
panel.addEventListener('keydown', (event) => keyboardSlide(event, false));
document.querySelectorAll('[data-slide-step]').forEach((button) => {
  button.addEventListener('click', () =>
    selectView(currentSlide + Number(button.dataset.slideStep)),
  );
});
document.querySelectorAll('[data-show-view]').forEach((trigger) => {
  trigger.addEventListener('click', () =>
    selectView(views.findIndex((view) => view.key === trigger.dataset.showView)),
  );
});
function updatePlayback() {
  const label = paused ? '播放自动轮播' : '暂停自动轮播';
  playback.setAttribute('aria-label', label);
  playback.title = label;
  document.getElementById('playback-icon').textContent = paused ? '▷' : 'Ⅱ';
  scheduleSlide();
}
playback.addEventListener('click', () => {
  paused = !paused;
  updatePlayback();
});
reducedMotion.addEventListener('change', (event) => {
  paused = event.matches;
  updatePlayback();
});
['mouseenter', 'mouseleave', 'focusin'].forEach((name) =>
  carousel.addEventListener(name, scheduleSlide),
);
carousel.addEventListener('focusout', () => window.setTimeout(scheduleSlide, 0));
document.addEventListener('visibilitychange', scheduleSlide);
// 预加载后续展示图，保持固定画框，避免首次轮播白闪或页面跳动。
views.slice(1).forEach((view) => {
  const image = new window.Image();
  image.src = view.src;
});
updatePlayback();
let swipe;
panel.addEventListener('pointerdown', (event) => {
  if (event.isPrimary && !event.target.closest('button'))
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
panel.addEventListener('pointerup', (event) => {
  if (!swipe || swipe.id !== event.pointerId) return;
  const dx = event.clientX - swipe.x;
  const dy = event.clientY - swipe.y;
  swipe = undefined;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2)
    selectView(currentSlide + (dx < 0 ? 1 : -1));
});
panel.addEventListener('pointercancel', () => {
  swipe = undefined;
});
function openDialog(id) {
  // 使用原生 dialog 保持键盘焦点与 Escape 行为，切换弹窗前关闭原弹窗。
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  document.getElementById(`${id}-dialog`).showModal();
  scheduleSlide();
  scheduleHeadline();
}
document
  .querySelectorAll('[data-dialog]')
  .forEach((button) => button.addEventListener('click', () => openDialog(button.dataset.dialog)));
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('close', scheduleSlide);
  dialog.addEventListener('close', scheduleHeadline);
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
});
let release;
async function readRelease() {
  try {
    const response = await fetch('./release.json', {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { published: false };
    const value = await response.json();
    if (!value || typeof value.version !== 'string') return { published: false };
    if (!value.manifestUrl) return value;
    const url = new URL(value.manifestUrl, window.location.href);
    if (url.origin !== window.location.origin) return { published: false };
    const manifestResponse = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!manifestResponse.ok) return { published: false };
    const manifest = await manifestResponse.json();
    if (
      manifest.appId === 'com.lightwise.desktop' &&
      manifest.platform === 'darwin' &&
      manifest.arch === 'arm64'
    )
      return { ...value, ...manifest, published: true };
  } catch {
    /* 网络不可用时不给出失效下载地址。 */
  }
  return { published: false };
}
const releasePromise = readRelease().then((value) => {
  release = value;
  if (value.published)
    document.querySelectorAll('[data-version]').forEach((item) => {
      item.textContent = `· v${value.version}`;
    });
  // 文案请求单独执行，不阻塞下载按钮获取安装包清单。
  void showReleaseNotes(value);
});
async function showReleaseNotes(value) {
  const container = document.getElementById('release-notes');
  const history = document.getElementById('release-history');
  try {
    if (value.historyUrl) {
      const url = new URL(value.historyUrl);
      if (url.protocol === 'https:' && !url.username && !url.password) history.href = url.href;
    }
    const response = await fetch('./CHANGELOG.md', {
      cache: 'no-store',
      redirect: 'error',
      credentials: 'omit',
      signal: AbortSignal.timeout(8000),
    });
    const notes = releaseNotes(await readChangelog(response), value.version);
    if (!notes) throw new Error('未找到对应版本。');
    const heading = document.createElement('h3');
    heading.textContent = `v${notes.version} · ${notes.date}`;
    container.replaceChildren(heading);
    if (!value.published) {
      const status = document.createElement('p');
      status.className = 'release-status';
      status.textContent = '首发说明已准备，安装包尚未开放公开下载。';
      container.append(status);
    }
    appendReleaseNotes(container, notes);
  } catch {
    const paragraph = document.createElement('p');
    paragraph.textContent = '暂时无法加载此版本说明，请稍后重新打开，或查看完整更新记录。';
    container.replaceChildren(paragraph);
  }
}
document.querySelector('[data-dialog="changelog"]').addEventListener('click', () => {
  void releasePromise.then(() => showReleaseNotes(release));
});
document.querySelectorAll('[data-download]').forEach((button) =>
  button.addEventListener('click', async () => {
    openDialog('download');
    await releasePromise;
    const link = document.getElementById('release-link');
    link.hidden = true;
    const message = document.getElementById('download-message');
    if (!release.published || !release.downloadUrl) {
      message.textContent = '安装包尚未开放公开下载。正式发布后，可在这里获取。';
      return;
    }
    try {
      const url = new URL(release.downloadUrl, window.location.href);
      const local =
        ['127.0.0.1', 'localhost'].includes(window.location.hostname) &&
        url.origin === window.location.origin;
      if ((url.protocol !== 'https:' && !local) || url.username || url.password)
        throw new Error('地址无效');
      link.href = url.href;
      link.rel = 'noopener noreferrer';
      link.hidden = false;
      message.textContent = `${release.localPreview ? '本地预览安装包 · ' : ''}Lightwise ${release.version} · macOS · Apple M 系列芯片。下载后将应用拖入“应用程序”即可。`;
    } catch {
      message.textContent = '下载地址暂不可用，请稍后重试或联系开发者。';
    }
  }),
);
document.getElementById('year').textContent = String(new Date().getFullYear());
