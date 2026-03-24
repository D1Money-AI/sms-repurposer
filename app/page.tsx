"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  MessageSquareText,
  Sparkles,
  Wifi,
} from "lucide-react";

type OutputVariant = 0 | 1;
type ActiveTab = "instagram" | "google";

const incomingSms = {
  text: "Just finished a beautiful landscaping job in the Hills! Check out the cedar retaining wall.",
  timestampLabel: "Mar 23, 2026 • 10:14 AM",
};

const outputs: Record<
  OutputVariant,
  {
    instagramCaption: string;
    instagramHashtags: string[];
    googleUpdate: string;
  }
> = {
  0: {
    instagramCaption:
      "Just finished a beautiful landscaping job in the Hills—and wow, that cedar retaining wall came out stunning. Clean lines, great craftsmanship, and serious curb appeal. 🌲✨",
    instagramHashtags: [
      "#SMSRepurposer",
      "#Landscaping",
      "#CedarRetainingWall",
      "#HillsideLiving",
      "#CurbAppeal",
      "#OutdoorMakeover",
    ],
    googleUpdate:
      "Project update: Completed a landscaping refresh in the Hills, featuring a cedar retaining wall installation. The finish is crisp, the layout is clean, and the results are built to last. Thanks for trusting us with your outdoor vision!",
  },
  1: {
    instagramCaption:
      "New project completed in the Hills! We just wrapped up a landscaping job with a standout cedar retaining wall—built for stability, designed for beauty.",
    instagramHashtags: [
      "#SMSRepurposer",
      "#RetainingWall",
      "#CedarCraft",
      "#LandscapeDesign",
      "#HomeImprovement",
      "#LocalBusiness",
    ],
    googleUpdate:
      "Google Business post draft: We completed a landscaping project in the Hills with a new cedar retaining wall. The area is now refreshed, functional, and polished—perfect for long-term outdoor enjoyment. Get in touch to schedule your next update!",
  },
};

export default function Home() {
  const [generating, setGenerating] = useState(false);
  const [variant, setVariant] = useState<OutputVariant>(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>("instagram");
  const [copiedTab, setCopiedTab] = useState<ActiveTab | null>(null);

  const output = outputs[variant];

  function getInstagramText() {
    return `${output.instagramCaption}\n\n${output.instagramHashtags.join(" ")}`;
  }

  async function copyText(text: string, tab: ActiveTab) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / restricted contexts.
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setCopiedTab(tab);
      window.setTimeout(() => setCopiedTab(null), 1100);
    } catch {
      // Best-effort only.
    }
  }

  async function onGenerate() {
    if (generating) return;
    setGenerating(true);

    try {
      // Mock "AI" generation delay.
      await new Promise((r) => setTimeout(r, 900));
      setVariant((v) => (v === 0 ? 1 : 0));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-zinc-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        <header className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Wifi className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  SMS Repurposer
                </h1>
                <p className="mt-0.5 text-sm text-zinc-300">
                  Premium social drafts from your incoming SMS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-200">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.18)]" />
              </span>
              <span>System Online</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            </div>
          </div>
        </header>

        <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <MessageSquareText className="h-5 w-5 text-sky-200" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">Latest Incoming SMS</h2>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{incomingSms.timestampLabel}</span>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">
                “{incomingSms.text}”
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            className="flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-sky-600 to-sky-700 px-6 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(2,132,199,0.35)] ring-1 ring-white/10 transition hover:from-sky-500 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles
              className={
                generating
                  ? "h-5 w-5 text-white animate-pulse"
                  : "h-5 w-5 text-white"
              }
            />
            <span>{generating ? "Generating…" : "✨ Generate Social Content"}</span>
          </button>
        </div>

        <section className="mt-6">
          <div
            className="flex rounded-2xl border border-white/10 bg-white/5 p-1 shadow-sm"
            role="tablist"
            aria-label="Output tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "instagram"}
              disabled={generating}
              onClick={() => setActiveTab("instagram")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                activeTab === "instagram"
                  ? "bg-white/10 text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                  : "text-zinc-300 hover:text-zinc-50 disabled:text-zinc-400",
                generating ? "opacity-80 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Instagram/Facebook
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "google"}
              disabled={generating}
              onClick={() => setActiveTab("google")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                activeTab === "google"
                  ? "bg-white/10 text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                  : "text-zinc-300 hover:text-zinc-50 disabled:text-zinc-400",
                generating ? "opacity-80 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Google Business
            </button>
          </div>

          {activeTab === "instagram" ? (
            <article className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">Instagram/Facebook</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    AI-generated caption with hashtags.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={generating}
                    onClick={() => copyText(getInstagramText(), "instagram")}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-zinc-50 ring-1 ring-white/10 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Copy className="mr-2 h-4 w-4 text-sky-200" />
                    {copiedTab === "instagram" ? "Copied" : "Copy"}
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <CheckCircle2 className="h-5 w-5 text-sky-200" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">
                  {output.instagramCaption}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {output.instagramHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            <article className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">Google Business</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Professional project update draft.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={generating}
                    onClick={() => copyText(output.googleUpdate, "google")}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-zinc-50 ring-1 ring-white/10 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Copy className="mr-2 h-4 w-4 text-emerald-200" />
                    {copiedTab === "google" ? "Copied" : "Copy"}
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Building2 className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">
                  {output.googleUpdate}
                </p>
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
