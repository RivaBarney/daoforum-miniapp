import { StatusChip } from "@/components/StatusChip";

type VotePanelProps = {
  yes: bigint;
  no: bigint;
  hasVoted: boolean;
  pending: boolean;
  onVote: (support: boolean) => void;
};

export function VotePanel({ yes, no, hasVoted, pending, onVote }: VotePanelProps) {
  return (
    <div className="vote-panel">
      <div className="vote-panel__stats">
        <StatusChip label={`Yes ${yes.toString()}`} tone="success" />
        <StatusChip label={`No ${no.toString()}`} tone="danger" />
        <StatusChip label={hasVoted ? "Already voted" : "Not voted yet"} tone="info" />
      </div>
      <div className="vote-panel__actions">
        <button
          type="button"
          className="btn btn--yes"
          disabled={hasVoted || pending}
          onClick={() => onVote(true)}
        >
          {pending ? "Submitting..." : "Vote Yes"}
        </button>
        <button
          type="button"
          className="btn btn--no"
          disabled={hasVoted || pending}
          onClick={() => onVote(false)}
        >
          {pending ? "Submitting..." : "Vote No"}
        </button>
      </div>
    </div>
  );
}
