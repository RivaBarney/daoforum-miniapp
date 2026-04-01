"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, usePublicClient } from "wagmi";
import { BottomNav } from "@/components/BottomNav";
import { StatusChip } from "@/components/StatusChip";
import { VotePanel } from "@/components/VotePanel";
import { useProposalStatus } from "@/hooks/useProposalStatus";
import { useTrackedVote } from "@/hooks/useTrackedVote";

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function ProposalClient() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { voteTracked, isPending } = useTrackedVote();
  const [feedback, setFeedback] = useState("");
  const [refreshSignal, setRefreshSignal] = useState(0);

  const proposalId = useMemo(() => {
    if (!idParam) {
      return null;
    }
    const parsed = Number(idParam);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return null;
    }
    return parsed;
  }, [idParam]);

  const { proposal, hasVoted, loading, error } = useProposalStatus({
    proposalId,
    address,
    refreshSignal
  });

  async function handleVote(support: boolean) {
    if (proposalId === null) {
      return;
    }
    try {
      const txHash = await voteTracked(BigInt(proposalId), support);
      setFeedback(`Vote recorded onchain · ${shortHash(txHash)}`);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      setRefreshSignal((v) => v + 1);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Vote failed");
    }
  }

  return (
    <main className="app-shell">
      <section className="panel panel--hero">
        <div className="panel__header">
          <h1>Single Proposal</h1>
          <StatusChip label={isConnected ? "Wallet active" : "Read-only mode"} tone={isConnected ? "success" : "info"} />
        </div>
        <p>Query format: /proposal?id=0</p>
        {feedback ? <p className="panel__feedback">{feedback}</p> : null}
      </section>

      {proposalId === null ? (
        <section className="panel">
          <p>Invalid or missing proposal id. Please open with a valid query, for example /proposal?id=0.</p>
        </section>
      ) : null}

      {proposalId !== null ? (
        <section className="panel">
          {loading ? <p>Loading proposal data...</p> : null}
          {error ? <p className="panel__error">{error}</p> : null}
          {proposal ? (
            <>
              <div className="panel__header">
                <h2>Proposal ID #{proposal.id}</h2>
                <StatusChip label={hasVoted ? "Voted by you" : "Not voted yet"} tone={hasVoted ? "success" : "info"} />
              </div>
              <h3 className="proposal-title">{proposal.title || "(empty title onchain)"}</h3>
              <p>Yes votes: {proposal.yes.toString()}</p>
              <p>No votes: {proposal.no.toString()}</p>
              <VotePanel
                yes={proposal.yes}
                no={proposal.no}
                hasVoted={Boolean(address) && hasVoted}
                pending={isPending}
                onVote={handleVote}
              />
            </>
          ) : null}
        </section>
      ) : null}

      <section className="panel">
        <Link className="btn btn--ghost" href="/">
          Back to Proposal Hall
        </Link>
      </section>

      <BottomNav />
    </main>
  );
}
