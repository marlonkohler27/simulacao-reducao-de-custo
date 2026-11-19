import { Info } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "disclaimer disclaimer-compact" : "disclaimer"}>
      <Info size={16} aria-hidden="true" />
      <span>
        <strong>Protótipo demonstrativo</strong> — estimativas ilustrativas, sem garantia de redução financeira.
      </span>
    </p>
  );
}
