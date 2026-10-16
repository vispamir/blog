"use client";
import { useRef, useState, type ComponentProps } from "react";
export function CodeBlock(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState("کپی کد");
  return (
    <div className="code-wrap">
      <button
        onClick={async () => {
          setStatus("در حال کپی…");
          try {
            await Promise.race([
              navigator.clipboard.writeText(ref.current?.textContent ?? ""),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Clipboard timeout")), 3000),
              ),
            ]);
            setStatus("کپی شد");
          } catch {
            setStatus("کپی ممکن نیست");
          }
          setTimeout(() => setStatus("کپی کد"), 2500);
        }}
        aria-live="polite"
      >
        {status}
      </button>
      <pre {...props} ref={ref} />
    </div>
  );
}
