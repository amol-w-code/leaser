"use client";

import { TopBar } from "@/components/topbar";
import { LedgerApp } from "@/components/ledger-app";

export default function LedgerPage() {
  return (
    <div>
      <TopBar title="Ledger" subtitle="Track income, spending and balance in one view." />
      <LedgerApp />
    </div>
  );
}
