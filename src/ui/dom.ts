// ちいさな DOM 生成ヘルパー（フレームワークは使わない）。

type Options = {
  class?: string;
  text?: string;
  onClick?: () => void;
};

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: Options = {},
  children: Array<HTMLElement | string> = []
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

export function clear(node: HTMLElement): void {
  node.replaceChildren();
}
