"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE = "https://meishiki-os.onrender.com";
const POLL_INTERVAL_MS = 1500;
const MAX_DURATION_MS = 240000; // 4分

const STAGE_LABEL: Record<string, { jp: string; en: string }> = {
  queued:      { jp: "順番待ち",          en: "Queued" },
  calculating: { jp: "占術を計算中",       en: "Calculating chart" },
  mini:        { jp: "才能の核を抽出中",   en: "Extracting core talents" },
  parallel:    { jp: "詳細・校正を生成中", en: "Generating detail" },
  rendering:   { jp: "レポートを組版中",   en: "Rendering report" },
  ready:       { jp: "完了",              en: "Ready" },
};

const STAGE_ORDER = ["calculating", "mini", "parallel", "rendering", "ready"];

/** ステージごとの想定到達進捗と典型所要時間（ローカル creep 用）。
 *  実 API の progress を超えない範囲で、ステージ滞在中もバーをじわじわ進める。 */
const STAGE_BUDGET: Record<
  string,
  { startProg: number; endProg: number; typicalSec: number }
> = {
  calculating: { startProg: 1,  endProg: 15,  typicalSec: 3 },
  mini:        { startProg: 15, endProg: 49,  typicalSec: 45 },
  parallel:    { startProg: 50, endProg: 91,  typicalSec: 35 },
  rendering:   { startProg: 92, endProg: 99,  typicalSec: 3 },
  ready:       { startProg: 100, endProg: 100, typicalSec: 1 },
};

export default function DiagnosisResultClient({ jobId }: { jobId: string }) {
  const [apiProgress, setApiProgress] = useState(1);
  const [stage, setStage] = useState<string>("calculating");
  const [displayProgress, setDisplayProgress] = useState(1);
  const [error, setError] = useState<string>("");
  const startedAtRef = useRef<number>(Date.now());
  const stageStartedAtRef = useRef<number>(Date.now());
  const lastStageRef = useRef<string>("calculating");

  /* ─── ローカル micro-progress: ステージ内でも推定値でバーを伸ばす ─── */
  useEffect(() => {
    if (lastStageRef.current !== stage) {
      lastStageRef.current = stage;
      stageStartedAtRef.current = Date.now();
    }
    const tick = () => {
      const budget = STAGE_BUDGET[stage] || STAGE_BUDGET.calculating;
      const elapsedSec = (Date.now() - stageStartedAtRef.current) / 1000;
      const fraction = Math.min(1, elapsedSec / Math.max(1, budget.typicalSec));
      const localEst = budget.startProg + (budget.endProg - budget.startProg) * fraction;
      // 実 API 値を下回らない / 同ステージのcap (endProg) を超えない / 単調増加
      const target = Math.max(apiProgress, Math.min(budget.endProg, Math.round(localEst)));
      setDisplayProgress((prev) => (target > prev ? target : prev));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [stage, apiProgress]);

  /* ─── API ポーリング ─── */
  useEffect(() => {
    let cancelled = false;
    const ORIGINAL_TITLE = document.title;

    async function loop() {
      while (!cancelled) {
        if (document.hidden) {
          await new Promise<void>((resolve) => {
            const handler = () => {
              if (!document.hidden) {
                document.removeEventListener("visibilitychange", handler);
                resolve();
              }
            };
            document.addEventListener("visibilitychange", handler);
          });
        }

        const elapsed = Date.now() - startedAtRef.current;
        if (elapsed > MAX_DURATION_MS) {
          if (!cancelled) setError("診断がタイムアウトしました。再度お試しください。");
          return;
        }

        try {
          const res = await fetch(`${API_BASE}/diagnosis/${jobId}`, { cache: "no-store" });
          if (cancelled) return;

          if (res.status === 200) {
            const html = await res.text();
            // 完成 → 全画面置換
            document.open();
            document.write(html);
            document.close();
            return;
          }
          if (res.status === 202) {
            const body = (await res.json()) as { status: string; progress: number; stage: string };
            setApiProgress(body.progress ?? 1);
            setStage(body.stage ?? "calculating");
            document.title = `${body.progress ?? 1}% ・ meishiki OS`;
            await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
            continue;
          }
          if (res.status === 404) {
            setError("診断ジョブが見つかりません。フォームから再度開始してください。");
            return;
          }
          let detail = "診断処理でエラーが発生しました";
          try {
            const t = await res.text();
            detail = JSON.parse(t).detail || detail;
          } catch {}
          setError(detail);
          document.title = ORIGINAL_TITLE;
          return;
        } catch {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        }
      }
    }

    loop();
    return () => {
      cancelled = true;
      document.title = ORIGINAL_TITLE;
    };
  }, [jobId]);

  const stageInfo = STAGE_LABEL[stage] || STAGE_LABEL.calculating;
  const stageIdx = STAGE_ORDER.indexOf(stage);
  const progress = displayProgress;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-[#888888] mb-5">Error</p>
        <h1 className="font-display text-3xl font-light mb-4">診断を続けられませんでした</h1>
        <p className="text-sm text-[#555555] leading-loose tracking-wider mb-8">{error}</p>
        <a
          href="/diagnosis"
          className="inline-block bg-[#111111] text-[#F9F9F7] px-8 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-[#333333] transition-colors"
        >
          フォームに戻る →
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Progress band */}
      <div className="border-b border-[#111111]">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888]">
              {stageInfo.en}
            </span>
            <span className="font-display italic text-[#888888] text-sm">
              {progress}%
            </span>
          </div>
          <div className="h-px bg-[#E0DDD6] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#111111] transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] tracking-wider text-[#888888]">
            <span>{stageInfo.jp}</span>
            <span className="font-display italic">
              {STAGE_ORDER.slice(0, -1).map((s, i) => (
                <span
                  key={s}
                  className={
                    i <= Math.max(0, stageIdx) ? "text-[#111111]" : "text-[#CCCCCC]"
                  }
                >
                  {i > 0 ? " · " : ""}
                  {i + 1}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Skeleton: 3 talent cards */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888]">Talents</span>
          <span className="flex-1 h-px bg-[#E0DDD6]" />
          <span className="font-display text-[11px] text-[#CCC] tracking-[0.1em]">i — iii</span>
        </div>

        <div className="space-y-px bg-[#EAEAE6] mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#F4F4F2] p-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-3xl text-[#CCCCCC] font-light">
                  {String(i).padStart(2, "0")}
                </span>
                <SkBar w="40%" h="10px" />
              </div>
              <div className="space-y-2">
                <SkBar w="100%" />
                <SkBar w="92%" />
                <SkBar w="80%" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton: energy / career */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888]">OS Profile</span>
          <span className="flex-1 h-px bg-[#E0DDD6]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EAEAE6] mb-12">
          {["Energy", "Career", "Growth", "Forecast"].map((label) => (
            <div key={label} className="bg-[#F4F4F2] p-5">
              <p className="text-[8px] tracking-[0.4em] uppercase text-[#AAAAAA] mb-3">{label}</p>
              <div className="space-y-2">
                <SkBar w="100%" />
                <SkBar w="78%" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton: lower (blur teaser) */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888]">4 Systems Portrait</span>
          <span className="flex-1 h-px bg-[#E0DDD6]" />
        </div>
        <div className="space-y-3 mb-16">
          <SkBar w="65%" h="14px" />
          <SkBar w="100%" />
          <SkBar w="98%" />
          <SkBar w="92%" />
          <SkBar w="80%" />
          <div className="h-2"></div>
          <SkBar w="55%" h="14px" />
          <SkBar w="100%" />
          <SkBar w="88%" />
        </div>

        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-[#888888]">
          画面を切り替えても診断は継続します
        </p>
      </div>

      <style jsx global>{`
        @keyframes pulseBar {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        .sk-bar {
          background: #E0DDD6;
          height: 10px;
          animation: pulseBar 1.6s ease-in-out infinite;
          display: block;
        }
      `}</style>
    </>
  );
}

function SkBar({ w, h }: { w: string; h?: string }) {
  return (
    <span
      className="sk-bar"
      style={{ width: w, height: h ?? "10px" }}
    />
  );
}
