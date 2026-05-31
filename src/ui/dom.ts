// ちいさな DOM 生成ヘルパー（フレームワークは使わない）。

type Options = {
  class?: string;
  text?: string;
  onClick?: () => void;
};

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: Options = {},
  children: Array<Node | string> = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.onClick) node.addEventListener("click", options.onClick);
  for (const child of children) {
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

// 漢字にふりがなを振る（小2でも武将名・用語を読めるように）。
export function ruby(base: string, furigana: string): HTMLElement {
  const node = document.createElement("ruby");
  node.append(document.createTextNode(base));
  const rt = document.createElement("rt");
  rt.textContent = furigana;
  node.append(rt);
  return node;
}

// "漢字[よみ]" の記法を含む文を、漢字部分だけ ruby（ふりがな）にして描画する。
// 例: "尾張[おわり]の 大名[だいみょう]" → 尾張(おわり) と 大名(だいみょう) にふりがな。
export function renderRuby(text: string): Array<HTMLElement | Text> {
  const pattern = /([㐀-鿿々ヶ〆]+)\[([^\]]+)\]/g;
  const nodes: Array<HTMLElement | Text> = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(document.createTextNode(text.slice(last, match.index)));
    }
    nodes.push(ruby(match[1], match[2]));
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(document.createTextNode(text.slice(last)));
  }
  return nodes;
}

export function clear(node: HTMLElement): void {
  node.replaceChildren();
}
