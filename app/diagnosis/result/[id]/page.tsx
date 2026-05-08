import type { Metadata } from "next";
import DiagnosisResultClient from "@/components/DiagnosisResultClient";

export const metadata: Metadata = {
  title: "OS診断 — 解析中",
  description: "あなたの命式を、4体系統合で読み解いています。",
};

type Params = { id: string };

export default async function DiagnosisResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  return <DiagnosisResultClient jobId={id} />;
}
