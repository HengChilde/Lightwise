/* global document, fetch, AbortSignal */
import { readChangelog, releaseHistory } from './changelog.mjs';
import { appendReleaseNotes } from './changelog-view.js';

// 历史页也直接读取同一份 Markdown，不维护第二份更新内容。
async function showHistory() {
  const container = document.getElementById('release-notes');
  try {
    const response = await fetch('./CHANGELOG.md', {
      cache: 'no-store',
      redirect: 'error',
      credentials: 'omit',
      signal: AbortSignal.timeout(8000),
    });
    const history = releaseHistory(await readChangelog(response));
    if (!history.length) throw new Error('暂无版本记录。');
    container.replaceChildren();
    for (const notes of history) {
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = `v${notes.version} · ${notes.date}`;
      section.append(heading);
      appendReleaseNotes(section, notes, 'h3');
      container.append(section);
    }
  } catch {
    const message = document.createElement('p');
    message.textContent = '暂时无法加载更新记录，请联网后刷新页面重试。';
    container.replaceChildren(message);
  }
}
void showHistory();
