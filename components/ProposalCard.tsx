"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import type { ProposalItem } from "@/hooks/useProposalList";
import { useProposalStatus } from "@/hooks/useProposalStatus";
import { VotePanel } from "@/components/VotePanel";
import { StatusChip } from "@/components/StatusChip";

type ProposalCardProps = {
  proposal: ProposalItem;
  onVote: (id: bigint, support: boolean) => Promise<void>;
  pending: boolean;
  refreshSignal: number;
};

export function ProposalCard({
  proposal,
  onVote,
  pending,
  refreshSignal
}: ProposalCardProps) {
  const { address } = useAccount();
  const { proposal: latestProposal, hasVoted } = useProposalStatus({
    proposalId: proposal.id,
    address,
    refreshSignal
  });

  const record = latestProposal ?? proposal;

  return (
    <article className="proposal-card">
      <div className="proposal-card__head">
        <StatusChip label={`Proposal #${record.id}`} tone="neutral" />
        <Link className="proposal-card__link" href={`/proposal?id=${record.id}`}>
          Open
        </Link>
      </div>
      <h3>{record.title || "(empty title onchain)"}</h3>
      <VotePanel
        yes={record.yes}
        no={record.no}
        hasVoted={Boolean(address) && hasVoted}
        pending={pending}
        onVote={(support) => onVote(BigInt(record.id), support)}
      />
    </article>
  );
}
