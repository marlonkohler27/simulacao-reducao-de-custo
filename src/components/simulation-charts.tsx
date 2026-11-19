import { ArrowDownRight, Info } from "lucide-react";
import type { CSSProperties } from "react";
import { CATEGORIES } from "@/config/assumptions";
import { formatBRL, formatPercent } from "@/lib/format";
import type { SimulationResult } from "@/types/simulation";
import { AnimatedNumber } from "./animated-number";

function width(value: number): CSSProperties {
  return { "--bar-width": `${value}%` } as CSSProperties;
}

export function BeforeAfterChart({ result, animate }: { result: SimulationResult; animate: boolean }) {
  const remainingShare = result.current > 0 ? 100 - result.reduction : 0;
  return (
    <section className={`panel chart-panel comparison${animate ? " chart-animated" : ""}`} aria-label="Antes e depois">
      <div className="chart-heading">
        <h3>Antes e depois</h3>
        <p>Comparação dos custos anuais estimados</p>
      </div>
      <div className="compare-bars">
        <div className="compare-row">
          <div className="bar-caption"><span>Custo atual</span><strong>{formatBRL(result.current)}</strong></div>
          <div className="chart-track compare-track" aria-hidden="true">
            <span className="bar-current" style={width(result.current > 0 ? 100 : 0)} />
          </div>
        </div>
        <div className="compare-row">
          <div className="bar-caption"><span>Custo após melhorias</span><strong>{formatBRL(result.remaining)}</strong></div>
          <div className="chart-track compare-track" aria-hidden="true">
            {result.saving > 0 && <span className="bar-difference" />}
            <span className="bar-remaining compare-remaining" style={{ ...width(remainingShare), "--bar-baseline": result.current > 0 ? "100%" : "0%" } as CSSProperties} />
          </div>
        </div>
      </div>
      <div className="chart-callout">
        <ArrowDownRight size={18} aria-hidden="true" />
        <span>Economia estimada</span>
        <strong>{formatBRL(result.saving)}</strong>
      </div>
    </section>
  );
}

export function CategorySavingsChart({ result, animate }: { result: SimulationResult; animate: boolean }) {
  const largestCost = Math.max(...result.categories.map((category) => category.current));
  return (
    <section className={`panel chart-panel category-chart${animate ? " chart-animated" : ""}`} aria-label="Composição dos custos por categoria">
      <div className="chart-heading">
        <h3>Composição dos custos</h3>
        <p>Quanto cada categoria contribui para a projeção anual</p>
      </div>
      <ul className="chart-legend" aria-label="Legenda">
        <li><span className="swatch bar-current" />Atual</li>
        <li><span className="swatch bar-remaining" />Remanescente</li>
        <li><span className="swatch bar-saving" />Economia estimada</li>
      </ul>
      <ul className="category-bars">
        {result.categories.map((category) => {
          // Normalize before scaling to keep ratios finite for very small totals.
          const relativeWidth = (value: number) => largestCost > 0 ? (value / largestCost) * 100 : 0;
          return (
            <li key={category.key} className="category-bar">
              <div className="bar-caption"><strong>{CATEGORIES[category.key].label}</strong><span><AnimatedNumber value={category.current} format={formatBRL} /></span></div>
              <div className="category-tracks" aria-hidden="true">
                <div className="chart-track category-current"><span className="bar-current" style={width(relativeWidth(category.current))} /></div>
                <div className="chart-track category-split">
                  <span className="bar-remaining" style={width(relativeWidth(category.remaining))} />
                  <span className="bar-saving" style={width(relativeWidth(category.saving))} />
                </div>
              </div>
              <div className="category-values">
                <span>Remanescente <strong><AnimatedNumber value={category.remaining} format={formatBRL} /></strong></span>
                <span>Economia <strong><AnimatedNumber value={category.saving} format={formatBRL} /> ({formatPercent(category.current > 0 ? category.reduction : 0)})</strong></span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function DistributionChart({ result, animate }: { result: SimulationResult; animate: boolean }) {
  return (
    <section className={`panel chart-panel distribution${animate ? " chart-animated" : ""}`} aria-label="Distribuição do custo atual">
      <div className="chart-heading">
        <h3>Distribuição do custo atual</h3>
        <p>Participação de cada categoria no cenário original</p>
      </div>
      <div className="chart-track distribution-track" aria-hidden="true">
        {result.categories.map(({ key, current }) => (
          <span key={key} className={`distribution-${key}`} style={width(result.current > 0 ? (current / result.current) * 100 : 0)} />
        ))}
      </div>
      <ul className="distribution-legend">
        {result.categories.map(({ key, current }) => {
          const share = result.current > 0 ? (current / result.current) * 100 : 0;
          return (
            <li key={key}>
              <span className={`swatch distribution-${key}`} aria-hidden="true" />
              <div><strong>{CATEGORIES[key].label}</strong><span>{formatBRL(current)}</span></div>
              <details className="share-detail">
                <summary aria-label={`${formatPercent(share)} do custo atual em ${CATEGORIES[key].label}. Ver descrição`}>
                  {formatPercent(share)}
                  <Info size={14} aria-hidden="true" />
                </summary>
                <p className="chart-tooltip">{CATEGORIES[key].description}</p>
              </details>
            </li>
          );
        })}
      </ul>
      {result.current === 0 && <p className="chart-empty">Nenhuma categoria tem custo neste cenário.</p>}
    </section>
  );
}
