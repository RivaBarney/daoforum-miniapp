import { Suspense } from "react";
import { ProposalClient } from "@/app/proposal/proposal-client";

export default function ProposalPage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <section className="panel">
            <p>Loading proposal page...</p>
          </section>
        </main>
      }
    >
      <ProposalClient />
    </Suspense>
  );
}
