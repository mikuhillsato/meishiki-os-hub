import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#111111] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <p className="logo-os text-[26px] mb-3">
              <span>meishiki</span><span className="os-mark">OS</span>
            </p>
            <p className="text-xs text-[#888888] leading-relaxed tracking-wider max-w-xs mb-5">
              命式は予言ではなく、自己理解のフレームワーク。<br />
              4体系統合で、あなたのOSを言語化する。
            </p>
            <ul className="flex items-center gap-4">
              <li>
                <a
                  href="https://x.com/meishikiOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.2em] text-[#888888] hover:text-[#111111] transition-colors"
                  aria-label="X (@meishikiOS)"
                >
                  𝕏 @meishikiOS
                </a>
              </li>
              <li>
                <a
                  href="https://note.com/meishiki_os"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.2em] text-[#888888] hover:text-[#111111] transition-colors"
                  aria-label="Note (meishiki_os)"
                >
                  N note
                </a>
              </li>
              <li>
                <a
                  href="mailto:meishiki.os.info@gmail.com"
                  className="text-[10px] tracking-[0.2em] text-[#888888] hover:text-[#111111] transition-colors"
                  aria-label="Email"
                >
                  @ email
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.4em] text-[#888888] mb-4 uppercase">占術</p>
            <ul className="space-y-2">
              {[
                { label: "四柱推命", href: "/shichusuimei" },
                { label: "西洋占星術", href: "/astrology" },
                { label: "算命学", href: "/sanmeigaku" },
                { label: "数秘術", href: "/numerology" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#888888] hover:text-[#111111] tracking-wider transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.4em] text-[#888888] mb-4 uppercase">About</p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xs text-[#888888] hover:text-[#111111] tracking-wider transition-colors">
                  このサイトについて
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#E0DDD6] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#888888] tracking-wider">© 2026 meishikiOS. All rights reserved.</p>
          <p className="text-xs text-[#888888] tracking-wider font-display italic">
            命式は、あなたのOSだ。
          </p>
        </div>
      </div>
    </footer>
  );
}
