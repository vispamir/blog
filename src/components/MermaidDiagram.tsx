import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/** Mermaid SVGs are pre-rendered and keyed by source, so diagrams need no client JS. */
export function MermaidDiagram({
  chart,
  caption,
}: {
  chart: string;
  caption: string;
}) {
  const hash = createHash("sha256").update(chart).digest("hex").slice(0, 16);
  const file = path.join(
    process.cwd(),
    "public/images/diagrams",
    `mermaid-${hash}.svg`,
  );
  if (!existsSync(file)) {
    throw new Error(
      `Missing pre-rendered Mermaid diagram: ${file}. Export this Mermaid source to SVG and save it at that path.`,
    );
  }
  const svg = readFileSync(file, "utf8");
  return (
    <figure className="mermaid-figure">
      <figcaption>{caption}</figcaption>
      <div
        className="mermaid-graphic"
        role="img"
        aria-label={caption}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}
