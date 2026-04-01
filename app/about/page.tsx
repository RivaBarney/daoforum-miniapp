import { BottomNav } from "@/components/BottomNav";
import { RuleList } from "@/components/RuleList";
import { StatusChip } from "@/components/StatusChip";

export default function AboutPage() {
  return (
    <main className="app-shell">
      <section className="panel panel--hero">
        <div className="panel__header">
          <h1>About DAOForum</h1>
          <StatusChip label="Capability statement" tone="info" />
        </div>
        <p>DAOForum is a lightweight proposal wall for civic DAO discussion and simple yes/no voting on Base.</p>
      </section>

      <section className="panel">
        <h2>Rules</h2>
        <RuleList />
      </section>

      <BottomNav />
    </main>
  );
}
