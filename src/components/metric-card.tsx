import { ArrowDownRight, ArrowUpRight, ChartNoAxesColumn, Wallet } from "lucide-react";
import { formatBRL, formatPercent } from "@/lib/format";
import type { SimulationResult } from "@/types/simulation";

import { AnimatedNumber } from "./animated-number";

export function Metrics({
  result, animate, only,
}: { result: SimulationResult; animate: boolean; only?: "current" | "opportunity" }) {
  const items = [
    { key: "current", label: "Custo anual estimado atual", value: result.current, icon: ChartNoAxesColumn },
    { key: "saving", label: "Economia anual potencial", value: result.saving, icon: ArrowUpRight },
    { key: "reduction", label: "Redução percentual estimada", value: result.reduction, icon: ArrowDownRight },
    { key: "remaining", label: "Custo remanescente anual", value: result.remaining, icon: Wallet },
  ];
  const visible = only === "current" ? items.slice(0, 1) : only === "opportunity" ? items.slice(1) : items;

  return (
    <dl className={`metrics${animate ? " metrics-animated" : ""}`}>
      {visible.map(({ key, label, value, icon: Icon }, index) => (
        <div className={`metric metric-${key}`} key={key}>
          <dt><Icon size={19} aria-hidden="true" />{label}</dt>
          <dd>
            <AnimatedNumber value={value} format={key === "reduction" ? formatPercent : formatBRL}
              delay={index * 135} animate={animate} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
