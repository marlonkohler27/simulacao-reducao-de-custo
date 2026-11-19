import { ChevronDown, FileText, Pencil } from "lucide-react";
import type { RefObject } from "react";
import { CATEGORIES, DEFAULT_INPUTS, FIELDS, MONTHS } from "@/config/assumptions";
import { FIELD_NAMES } from "@/lib/calculations";
import { formatBRL, formatNumber, formatPercent } from "@/lib/format";
import type { SimulationResult } from "@/types/simulation";

export function CalculationBreakdown({
  result, detailsRef, onEdit,
}: { result: SimulationResult | null; detailsRef: RefObject<HTMLDetailsElement | null>; onEdit: () => void }) {
  const inputs = result?.inputs ?? DEFAULT_INPUTS;
  return (
    <details id="memoria" className="panel calculation-breakdown" ref={detailsRef}>
      <summary>
        <FileText size={20} aria-hidden="true" />
        <span>{result ? "Ver memória de cálculo" : "Memória de cálculo"}</span>
        <ChevronDown className="disclosure-chevron" size={18} aria-hidden="true" />
      </summary>
      <div className="calculation-content">
        <p className="secondary-copy">
          {result
            ? "Premissas aplicadas ao cenário exibido. As operações preservam a precisão e os valores em reais são arredondados para exibição."
            : "Premissas iniciais do protótipo. Simule um cenário para ver os valores e as fórmulas aplicadas."}
        </p>
        <div className="calculation-formulas">
          <h3>Como os valores são calculados</h3>
          <p>
            <strong>Valor-hora</strong> = salário bruto mensal ÷ horas mensais de referência
            {result && <> = {formatBRL(inputs.salarioMensal)} ÷ {formatNumber(inputs.horasMensaisReferencia)} h = <strong>{formatBRL(result.hourlyRate)}</strong></>}.
          </p>
          <p>Colaboradores afetados são estimados multiplicando o total de colaboradores pela taxa de cada categoria. Esse valor pode ser fracionário.</p>
          <ul className="formula-categories">
            <li><strong>Horas extras</strong><span>Afetados × horas extras mensais por pessoa × valor-hora × (1 + adicional) × {MONTHS}.</span></li>
            <li><strong>Jornada não trabalhada</strong><span>Afetados × (minutos perdidos por dia ÷ 60) × dias trabalhados por mês × valor-hora × {MONTHS}.</span></li>
            <li><strong>Abonos</strong><span>Afetados × horas abonadas mensais por pessoa × valor-hora × {MONTHS}.</span></li>
          </ul>
          <p>Horas extras usam o valor integral da hora com adicional. Com adicional de {formatPercent(inputs.adicionalHoraExtra)}, o multiplicador é {formatNumber(1 + inputs.adicionalHoraExtra / 100)}.</p>
          <p><strong>Economia da categoria</strong> = custo anual × hipótese de redução. O custo remanescente é o custo atual menos a economia. A redução consolidada é a economia anual total dividida pelo custo anual atual, ou zero quando esse custo é zero.</p>
        </div>
        {result && (
          <div className="formula-results">
            {result.categories.map((category) => (
              <div key={category.key}>
                <strong>{CATEGORIES[category.key].label}</strong>
                <p>{formatNumber(category.affected)} colaboradores equivalentes · {formatNumber(category.monthlyHours)} h/mês</p>
                <p>{formatNumber(category.monthlyHours)} h × {formatBRL(result.hourlyRate)} × {formatNumber(category.hourlyMultiplier)} × {MONTHS} ≈ {formatBRL(category.current)}</p>
                <p>{formatBRL(category.current)} × {formatPercent(category.reduction)} ≈ {formatBRL(category.saving)} de economia</p>
              </div>
            ))}
          </div>
        )}
        <div className="assumptions-heading">
          <h3>Variáveis e premissas</h3>
          <button type="button" className="button button-secondary button-small" onClick={onEdit}>
            <Pencil size={15} aria-hidden="true" /> Editar premissas
          </button>
        </div>
        <table className="calculation-table">
          <thead><tr><th scope="col">Variável</th><th scope="col">Valor</th><th scope="col">Explicação</th></tr></thead>
          <tbody>
            {FIELD_NAMES.map((name) => {
              const { label, help, unit } = FIELDS[name];
              const value = unit === "R$" ? formatBRL(inputs[name])
                : unit === "%" ? formatPercent(inputs[name])
                  : [formatNumber(inputs[name]), unit].filter(Boolean).join(" ");
              return <tr key={name}><th scope="row">{label}</th><td>{value}</td><td>{help}</td></tr>;
            })}
            <tr><th scope="row">Horizonte anual</th><td>{MONTHS} meses</td><td>Período fixo de comparação.</td></tr>
          </tbody>
        </table>
        <div className="methodology-note">
          <h3>Limites da estimativa</h3>
          <p>Os valores de jornada não trabalhada e abonos representam tempo remunerado não aproveitado. A possibilidade de desconto salarial exige avaliação própria.</p>
          <p>O cálculo exclui adicional noturno, encargos patronais, DSR, 13º, férias, convenções coletivas, tributos, afastamentos e multas.</p>
          <p><strong>Estimativa ilustrativa — sem garantia de redução financeira.</strong> A metodologia segue as fórmulas do briefing do Simulador de Economia Advance, versão 1.0.</p>
        </div>
      </div>
    </details>
  );
}
