"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotebookOutput =
  | { kind: "text"; text: string }
  | { kind: "image"; src: string };

export type NotebookCell = {
  index: number;
  type: "markdown" | "code" | string;
  source: string;
  outputs: NotebookOutput[];
};

export type NotebookData = {
  slug: string;
  title: string;
  cellCount: number;
  cells: NotebookCell[];
  previewImage: string;
  notebookFile: string;
};

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="notebook-md space-y-2 text-sm leading-relaxed text-[#e6edf3]">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={index} className="text-sm font-black uppercase tracking-wide text-white">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={index} className="text-base font-black uppercase tracking-wide text-white">
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={index} className="text-lg font-black uppercase tracking-wide text-white">
              {trimmed.slice(2)}
            </h2>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <p key={index} className="pl-4 before:mr-2 before:content-['•']">
              {trimmed.slice(2)}
            </p>
          );
        }

        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}

function CodeCell({ source, defaultOpen = false }: { source: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const preview = source.split("\n").slice(0, 3).join("\n");
  const lines = source.split("\n").length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#161b22]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-white/5"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Python · {lines} lines
      </button>
      <pre
        className={cn(
          "overflow-x-auto px-3 pb-3 font-mono text-[11px] leading-relaxed text-[#c9d1d9]",
          !open && "hidden",
        )}
      >
        {source}
      </pre>
      {!open ? (
        <pre className="overflow-x-auto px-3 pb-3 font-mono text-[11px] leading-relaxed text-white/35">
          {preview}
          {lines > 3 ? "\n..." : ""}
        </pre>
      ) : null}
    </div>
  );
}

function NotebookFrame({
  slug,
  expanded = false,
  className,
}: {
  slug: string;
  expanded?: boolean;
  className?: string;
}) {
  const [data, setData] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/data/notebooks/${slug}.json`)
      .then((response) => {
        if (!response.ok) throw new Error("missing notebook");
        return response.json() as Promise<NotebookData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div
      className={cn(
        "notebook-frame group/notebook relative overflow-hidden rounded-2xl border-[3px] border-border bg-[#0d1117] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        expanded ? "h-[min(78vh,880px)]" : "h-[min(520px,62vh)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#161b22] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 truncate text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs">
          {slug}.ipynb
        </span>
      </div>

      <div className="notebook-scroll h-[calc(100%-36px)] overflow-y-auto px-2 py-2 sm:px-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-white/40">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : error || !data ? (
          <p className="p-4 text-sm text-white/50">Notebook preview unavailable.</p>
        ) : (
          <div className="space-y-4 pb-4">
            {data.cells.map((cell) => (
              <article
                key={cell.index}
                className="rounded-xl border border-white/10 bg-[#0d1117]/80 p-3 sm:p-4"
              >
                {cell.type === "markdown" ? (
                  <MarkdownBlock content={cell.source} />
                ) : (
                  <CodeCell source={cell.source} />
                )}

                {cell.outputs.length > 0 ? (
                  <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                    {cell.outputs.map((output, outputIndex) =>
                      output.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={outputIndex}
                          src={output.src}
                          alt=""
                          className="notebook-image block h-auto w-full rounded-lg border border-white/10 bg-white"
                          loading="lazy"
                        />
                      ) : (
                        <pre
                          key={outputIndex}
                          className="overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-[#8b949e]"
                        >
                          {output.text}
                        </pre>
                      ),
                    )}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent opacity-80 transition-opacity duration-300 group-hover/notebook:opacity-30"
        aria-hidden
      />
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] font-black uppercase tracking-widest text-white/40">
        scroll ↓
      </p>
    </div>
  );
}

export { NotebookFrame as NotebookViewer };
