/* global TextDecoder */
export const MAX_CHANGELOG_BYTES = 256 * 1024;

// 两端共用有限的 Markdown 格式；只产生文本块，不执行远端 HTML。
export function releaseHistory(markdown) {
  const lines = markdown
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n');
  const history = [];
  let active = null;
  let fence = null;
  for (const line of lines) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    if (/^##\s/.test(line)) {
      const heading =
        /^## ((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)) - (\d{4}-\d{2}-\d{2})\s*$/.exec(line);
      active = heading ? { version: heading[1], date: heading[2], blocks: [] } : null;
      if (active) history.push(active);
      continue;
    }
    if (!active || !line.trim()) continue;
    const heading = /^###\s+(.+)$/.exec(line);
    const item = /^\s*-\s+(.+)$/.exec(line);
    active.blocks.push({
      type: heading ? 'heading' : item ? 'item' : 'paragraph',
      text: heading?.[1] ?? item?.[1] ?? line.trim(),
    });
  }
  // 重复版本有歧义，两端都排除，避免拼接成错误说明。
  const counts = new Map();
  for (const notes of history) counts.set(notes.version, (counts.get(notes.version) ?? 0) + 1);
  return history.filter((notes) => notes.blocks.length && counts.get(notes.version) === 1);
}

export function releaseNotes(markdown, version) {
  return releaseHistory(markdown).find((notes) => notes.version === version) ?? null;
}

export function notesText(notes) {
  return notes.blocks
    .map((block) => `${block.type === 'item' ? '• ' : ''}${block.text}`)
    .join('\n');
}

export async function readChangelog(response) {
  if (response.status !== 200 || !response.body) {
    await response.body?.cancel();
    throw new Error('更新说明暂时无法读取。');
  }
  const type = response.headers.get('content-type') ?? '';
  if (!/^(?:text\/(?:plain|markdown|x-markdown)|application\/octet-stream)(?:\s*;|$)/i.test(type)) {
    await response.body.cancel();
    throw new Error('更新说明格式无效。');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > MAX_CHANGELOG_BYTES) throw new Error('更新说明文件过大。');
      text += decoder.decode(part.value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
