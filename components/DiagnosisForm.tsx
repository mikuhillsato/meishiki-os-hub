"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://meishiki-os.onrender.com";

const PLACES: { group: string; items: { value: string; label: string }[] }[] = [
  {
    group: "日本",
    items: [
      { value: "tokyo",     label: "東京" },
      { value: "osaka",     label: "大阪" },
      { value: "nagoya",    label: "名古屋" },
      { value: "fukuoka",   label: "福岡" },
      { value: "sapporo",   label: "札幌" },
      { value: "sendai",    label: "仙台" },
      { value: "hiroshima", label: "広島" },
      { value: "other",     label: "その他（日本）" },
    ],
  },
  {
    group: "アジア",
    items: [
      { value: "seoul",     label: "ソウル" },
      { value: "taipei",    label: "台北" },
      { value: "hong_kong", label: "香港" },
      { value: "shanghai",  label: "上海" },
      { value: "beijing",   label: "北京" },
      { value: "singapore", label: "シンガポール" },
      { value: "bangkok",   label: "バンコク" },
    ],
  },
  {
    group: "北米",
    items: [
      { value: "new_york",       label: "ニューヨーク" },
      { value: "los_angeles",    label: "ロサンゼルス" },
      { value: "san_francisco",  label: "サンフランシスコ" },
    ],
  },
  {
    group: "欧州",
    items: [
      { value: "london", label: "ロンドン" },
      { value: "paris",  label: "パリ" },
      { value: "berlin", label: "ベルリン" },
    ],
  },
  {
    group: "オセアニア",
    items: [{ value: "sydney", label: "シドニー" }],
  },
  {
    group: "その他",
    items: [{ value: "overseas_other", label: "その他（海外）" }],
  },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - 18 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysIn(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

async function startDiagnosis(payload: Record<string, string>): Promise<string> {
  const res = await fetch(`${API_BASE}/diagnosis/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "サーバーエラーが発生しました";
    try {
      const t = await res.text();
      msg = JSON.parse(t).detail || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data.job_id) throw new Error("job_id を取得できませんでした");
  try { sessionStorage.setItem("diagnosis_job_id", data.job_id); } catch {}
  return data.job_id;
}

export default function DiagnosisForm() {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [showExtra, setShowExtra] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* warmup the Render API on mount to avoid cold-start delay */
  useEffect(() => {
    fetch(`${API_BASE}/health`, { method: "GET", cache: "no-store" }).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!year || !month || !day) {
      setError("生年月日を入力してください");
      return;
    }

    const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const payload: Record<string, string> = { birth_date: birthDate };
    if (time) payload.birth_time = time;
    if (place) payload.birth_place = place;

    setLoading(true);
    try {
      const jobId = await startDiagnosis(payload);
      // 結果ページへ遷移（skeleton + progress polling）
      router.push(`/diagnosis/result/${jobId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "エラーが発生しました";
      setError(msg);
      setLoading(false);
    }
  }

  const dayMax = daysIn(parseInt(year, 10), parseInt(month, 10));
  const days = Array.from({ length: dayMax }, (_, i) => i + 1);

  return (
    <form onSubmit={onSubmit} className="bg-[#111111] px-6 md:px-12 py-12 md:py-16 border-y border-[#2A2A2A] relative">
      <p className="text-[8px] tracking-[0.5em] uppercase text-[#666666] mb-5">Free Mini Diagnosis</p>
      <h2 className="font-display text-3xl md:text-4xl font-light text-[#F9F9F7] mb-3 leading-tight">
        生年月日を入れて、<br className="md:hidden" />
        才能を知る。
      </h2>
      <p className="text-[11px] text-[#999999] tracking-wider mb-10 max-w-md leading-loose">
        4体系統合のミニレポート。完全無料。所要時間 約10秒。
      </p>

      <div className="grid grid-cols-1 max-w-2xl gap-5">
        <div>
          <label className="block text-[8px] tracking-[0.3em] uppercase text-[#888888] mb-2">Birth Date</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              required
              aria-label="生年"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-[#444444] bg-[#111111] text-[#F9F9F7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#888]"
            >
              <option value="">年</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              required
              aria-label="月"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-[#444444] bg-[#111111] text-[#F9F9F7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#888]"
            >
              <option value="">月</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              required
              aria-label="日"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border border-[#444444] bg-[#111111] text-[#F9F9F7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#888]"
            >
              <option value="">日</option>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowExtra((v) => !v)}
          className="text-left text-[10px] tracking-[0.2em] uppercase text-[#888888] hover:text-[#F9F9F7] transition-colors"
        >
          <span className="inline-block w-4">{showExtra ? "▾" : "▸"}</span> 出生時刻・場所を追加すると精度UP
        </button>

        {showExtra && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[8px] tracking-[0.3em] uppercase text-[#888888] mb-2">Birth Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-[#444444] bg-[#111111] text-[#F9F9F7] px-4 py-2.5 text-sm focus:outline-none focus:border-[#888] w-full"
              />
            </div>
            <div>
              <label className="block text-[8px] tracking-[0.3em] uppercase text-[#888888] mb-2">Birth Place</label>
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="border border-[#444444] bg-[#111111] text-[#F9F9F7] px-4 py-2.5 text-sm focus:outline-none focus:border-[#888] w-full"
              >
                <option value="">未選択</option>
                {PLACES.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <p className="md:col-span-2 text-[10px] text-[#888888] leading-relaxed tracking-wider">
              ASC・MC・ハウス・月星座が計算可能に。より正確な才能分析ができます。
              <br />
              ※ 未入力の場合、出生時刻は正午・出生地は東京を仮置きして計算します。
            </p>
          </div>
        )}

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F9F9F7] text-[#111111] px-10 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-[#E0DDD6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "解析中…" : "診断する →"}
          </button>
          <p className="text-[10px] tracking-wider text-[#666666] mt-3">
            所要時間: 約10秒 / 完全無料
          </p>
          {error && (
            <p className="text-[12px] text-[#FF8888] tracking-wider mt-3">{error}</p>
          )}
        </div>
      </div>

      {loading && (
        <p className="absolute inset-x-0 bottom-3 text-center text-[10px] tracking-[0.4em] uppercase text-[#666666]">
          画面を切り替えても診断は継続します
        </p>
      )}
    </form>
  );
}
