import type { Metadata } from "next";
import AnimateIn from "@/components/AnimateIn";
import DiagnosisForm from "@/components/DiagnosisForm";

export const metadata: Metadata = {
  title: "OS診断（無料）",
  description:
    "あなたの命式を、4体系統合で読み解く無料のミニ診断。生年月日（任意で出生時刻・出生地）を入力するだけで、才能・OSの輪郭・キーワードが見えてくる。",
};

const cards = [
  {
    num: "01",
    title: "才能 Top3",
    en: "Talents",
    desc: "あなたの強みを、4体系を重ねた解像度で言語化。一つの占術だけでは見えない核と矛盾を浮かび上がらせる。",
  },
  {
    num: "02",
    title: "OS プロファイル",
    en: "OS Profile",
    desc: "エネルギータイプ・キャリア方向性・伸びしろ・相性ヒント。意思決定の軸を一枚で整理する。",
  },
  {
    num: "03",
    title: "2026 運気",
    en: "Forecast",
    desc: "今年のワンポイント。何を仕込み、何を刈り取るか。短期的なフェーズ判断の目線を与える。",
  },
];

const flow = [
  { step: "i", label: "生年月日を入力", note: "出生時刻・出生地は任意。精度を上げたい場合のみ追加" },
  { step: "ii", label: "4体系を統合計算", note: "自動・所要約10秒。背景タブにしても継続" },
  { step: "iii", label: "ミニレポート表示", note: "才能・OSプロファイル・今年の運気を即座に表示" },
];

export default function DiagnosisPage() {
  return (
    <>
      {/* Hero */}
      <div className="grid border-b border-[#111111]" style={{ gridTemplateColumns: "52px 1fr" }}>
        <div className="border-r border-[#E0DDD6] flex items-center justify-center bg-[#F4F4F2]">
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "8px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#BBB",
              whiteSpace: "nowrap",
            }}
          >
            Free Mini Diagnosis — meishiki OS
          </span>
        </div>
        <div className="px-4 md:px-12 py-8 md:py-16">
          <AnimateIn>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#888888] mb-5">
              Free Mini Diagnosis
            </p>
            <h1 className="font-display font-light leading-[0.95]" style={{ fontSize: "clamp(44px,5.5vw,76px)" }}>
              あなたの<em className="not-italic">OS</em>を、<br />
              4体系で読む。
            </h1>
            <p className="text-sm text-[#555555] leading-loose tracking-wider max-w-xl mt-6">
              四柱推命・西洋占星術・算命学・数秘術——4体系を重ねた視点から、あなたの才能・OSの輪郭・今年の運気を言語化します。
              生年月日のみで開始でき、出生時刻・出生地は任意。所要時間 約10秒。
            </p>
          </AnimateIn>
        </div>
      </div>

      {/* Form (primary action) */}
      <DiagnosisForm />

      {/* What you get */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <AnimateIn>
          <div className="flex items-center h-[38px] border-t border-b border-[#111111] mb-12">
            <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888] mr-5">what you get</span>
            <div className="flex-1 h-px bg-[#E0DDD6]" />
            <span className="font-display text-[11px] text-[#CCC] ml-5 tracking-[0.1em]">i — iii</span>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EAEAE6] mb-24">
          {cards.map((c, i) => (
            <AnimateIn key={c.num} delay={i * 100}>
              <div className="bg-[#F4F4F2] p-8 h-full">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-3xl text-[#CCCCCC] font-light">{c.num}</span>
                  <span className="text-[8px] tracking-[0.4em] uppercase text-[#888888]">{c.en}</span>
                </div>
                <h3 className="font-display text-xl font-light mb-3 leading-snug">{c.title}</h3>
                <p className="text-sm text-[#555555] leading-loose tracking-wider">{c.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Flow */}
        <AnimateIn>
          <div className="flex items-center h-[38px] border-t border-b border-[#111111] mb-12">
            <span className="text-[8px] tracking-[0.5em] uppercase text-[#888888] mr-5">flow</span>
            <div className="flex-1 h-px bg-[#E0DDD6]" />
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {flow.map((f, i) => (
            <AnimateIn key={f.step} delay={i * 100}>
              <div className="border-t border-[#111111] pt-5">
                <span className="font-display italic text-[#CCCCCC] text-2xl mr-3">{f.step}</span>
                <span className="text-sm text-[#111111] tracking-wider">{f.label}</span>
                <p className="text-xs text-[#888888] tracking-wider mt-2 leading-relaxed">{f.note}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </>
  );
}
