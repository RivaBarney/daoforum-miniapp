export function RuleList() {
  return (
    <ul className="rule-list">
      <li>Current contract supports simple proposal creation and one-wallet-one-vote voting.</li>
      <li>Proposals currently store title, yes count, and no count onchain.</li>
      <li>One wallet can vote once per proposal.</li>
      <li>Current version does not include comments, execution, delegation, or weighted governance.</li>
      <li>Advanced governance features can be added in a future upgrade.</li>
    </ul>
  );
}
