interface Props {
  scenario: "best" | "realistic" | "worst";
}

export default function TrialScenarioCard({ scenario }: Props) {
  const explanations = {
    best: "High drug or phage efficacy with minimal resistance emergence.",
    realistic:
      "Balanced outcome where bacterial clearance is reduced by resistance development.",
    worst:
      "High resistance emergence leads to delayed or failed treatment response.",
  };

  return (
    <div style={{ padding: "12px", border: "1px solid #444" }}>
      <h4>{scenario.toUpperCase()} CASE</h4>
      <p>{explanations[scenario]}</p>
    </div>
  );
}
