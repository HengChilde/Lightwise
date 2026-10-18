/* global document */
// 两个官网入口共用文本渲染，始终使用 textContent，不注入远端 HTML。
export function appendReleaseNotes(container, notes, headingTag = 'h4') {
  let list;
  for (const block of notes.blocks) {
    if (block.type === 'item') {
      if (!list) {
        list = document.createElement('ul');
        container.append(list);
      }
      const item = document.createElement('li');
      item.textContent = block.text;
      list.append(item);
    } else {
      list = undefined;
      const element = document.createElement(block.type === 'heading' ? headingTag : 'p');
      element.textContent = block.text;
      container.append(element);
    }
  }
}
