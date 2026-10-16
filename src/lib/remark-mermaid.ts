type Node = { type: string; lang?: string; value?: string; meta?: string; children?: Node[]; [key: string]: unknown };
/** Convert Mermaid fences to literal MDX props; JavaScript expressions stay blocked. */
export default function remarkMermaid() {
  return (tree: Node) => {
    function walk(node: Node) {
      if (!node.children) return;
      node.children = node.children.map(child => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          return { type: 'mdxJsxFlowElement', name: 'MermaidDiagram', attributes: [
            { type: 'mdxJsxAttribute', name: 'chart', value: child.value ?? '' },
            { type: 'mdxJsxAttribute', name: 'caption', value: child.meta?.match(/title="([^"]+)"/)?.[1] ?? 'نمودار موجودیت‌ها و روابط' },
          ], children: [] };
        }
        walk(child);
        return child;
      });
    }
    walk(tree);
  };
}
