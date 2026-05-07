# meishiki OS Hub

meishiki OS のブランドハブ・占術辞書サイト。

**タグライン:** 命式は、あなたのOSだ。

## このサイトの役割

- meishiki OS のブランド入口（公式ホーム）
- 4 体系（四柱推命・西洋占星術・算命学・数秘術）の辞書ページ
- About / 思想・コンセプトの提示

mini 診断 LP と Session LP は別運用（`meishiki-os-diagnosis.vercel.app`）で、本サイトは「ブランド × 辞書」の役割に特化。

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript + Tailwind CSS 4
- astronomy-engine（西洋占星術の天体計算）

## Development

```bash
npm install
npm run dev
```

`http://localhost:3000` を開く。

## Deploy

Vercel に接続済（`meishiki-os.vercel.app`）。`main` への push で自動デプロイ。

## 関連リポジトリ・サイト

- 元コードベース：`mikuhillsato/jiku`（MyJiku 旧サイト → 本リポジトリは meishiki OS にリブランド）
- mini 診断 LP / Session LP：`mikuhillsato/meishiki-os` → `meishiki-os-diagnosis.vercel.app`
