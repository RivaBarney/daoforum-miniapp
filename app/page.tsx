"use client";

import { useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { BottomNav } from "@/components/BottomNav";
import { ForumHeader } from "@/components/ForumHeader";
import { ProposalCard } from "@/components/ProposalCard";
import { ProposalComposer } from "@/components/ProposalComposer";
import { StatusChip } from "@/components/StatusChip";
import { WalletButton } from "@/components/WalletButton";
import { useProposalList } from "@/hooks/useProposalList";
import { useTrackedCreateProposal } from "@/hooks/useTrackedCreateProposal";
import { useTrackedVote } from "@/hooks/useTrackedVote";

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { proposals, loading, error, refresh } = useProposalList(20);
  const { createProposalTracked, isPending: createPending } = useTrackedCreateProposal();
  const { voteTracked, isPending: votePending } = useTrackedVote();
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [refreshSignal, setRefreshSignal] = useState(0);

  const titleIsValid = useMemo(() => {
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= 100;
  }, [title]);

  async function handleCreateProposal() {
    if (!titleIsValid) {
      return;
    }
    try {
      const txHash = await createProposalTracked(title.trim());
      setFeedback(`Proposal submitted successfully · ${shortHash(txHash)}`);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      setTitle("");
      refresh();
      setRefreshSignal((v) => v + 1);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Failed to submit proposal");
    }
  }

  async function handleVote(id: bigint, support: boolean) {
    try {
      const txHash = await voteTracked(id, support);
      setFeedback(`Vote recorded onchain · ${shortHash(txHash)}`);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      refresh();
      setRefreshSignal((v) => v + 1);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Vote failed");
    }
  }

  return (
    <main className="app-shell">
      <ForumHeader
        title="DAOForum"
        subtitle="Public governance chamber for simple title-based proposals and one-wallet-one-vote decisions on Base."
      />

      <WalletButton />

      <section className="panel panel--hero">
        <div className="panel__header">
          <h2>Proposal Hall</h2>
          <StatusChip label={isConnected ? "Onchain ready" : "Read-only mode"} tone={isConnected ? "success" : "info"} />
        </div>
        <p>
          Connected wallet:{" "}
          <strong>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</strong>
        </p>
        {feedback ? <p className="panel__feedback">{feedback}</p> : null}
        {error ? <p className="panel__error">{error}</p> : null}
      </section>

      <ProposalComposer
        title={title}
        onTitleChange={setTitle}
        onSubmit={handleCreateProposal}
        disabled={!isConnected || !titleIsValid || createPending}
        pending={createPending}
      />

      <section className="panel">
        <div className="panel__header">
          <h2>Proposal List</h2>
          <button type="button" className="btn btn--ghost" onClick={refresh}>
            Refresh
          </button>
        </div>

        {loading ? <p>Loading proposals from Base...</p> : null}
        {!loading && proposals.length === 0 ? <p>No proposals found yet.</p> : null}

        <div className="proposal-list">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              pending={votePending}
              onVote={handleVote}
              refreshSignal={refreshSignal}
            />
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
