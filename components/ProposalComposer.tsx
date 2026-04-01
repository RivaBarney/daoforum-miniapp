"use client";

type ProposalComposerProps = {
  title: string;
  onTitleChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  pending: boolean;
};

export function ProposalComposer({
  title,
  onTitleChange,
  onSubmit,
  disabled,
  pending
}: ProposalComposerProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Create Proposal</h2>
        <span className="panel__muted">{title.length}/100</span>
      </div>
      <textarea
        className="input"
        placeholder="Enter proposal title (max 100 characters)"
        maxLength={100}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <button type="button" className="btn btn--primary" onClick={onSubmit} disabled={disabled}>
        {pending ? "Submitting onchain..." : "Submit Proposal"}
      </button>
    </section>
  );
}
