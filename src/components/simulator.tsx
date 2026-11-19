"use client";

import { FileText, Lightbulb, Monitor, Pencil, Plus, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CATEGORIES, DEFAULT_INPUTS } from "@/config/assumptions";
import { calculateSimulation, FIELD_NAMES, parseDraft } from "@/lib/calculations";
import { formatBRL, formatNumber, formatSalary } from "@/lib/format";
import type { Draft, FieldName, SimulationResult } from "@/types/simulation";
import { CalculationBreakdown } from "./calculation-breakdown";
import { Disclaimer } from "./disclaimer";
import { Metrics } from "./metric-card";
import { PresentationMode } from "./presentation-mode";
import { BeforeAfterChart, CategorySavingsChart, DistributionChart } from "./simulation-charts";
import { CategoryOverview, SimulatorForm } from "./simulator-form";

function makeDraft(empty = false): Draft {
  const draft = Object.fromEntries(FIELD_NAMES.map((name) => [
    name, DEFAULT_INPUTS[name].toLocaleString("pt-BR", { useGrouping: false }),
  ])) as Draft;
  draft.salarioMensal = empty ? "" : formatSalary(DEFAULT_INPUTS.salarioMensal);
  if (empty) draft.funcionarios = "";
  return draft;
}

function evaluate(draft: Draft) {
  const { inputs, errors } = parseDraft(draft);
  if (!inputs) return { errors, result: null, calculationError: "" };
  try {
    return { errors, result: calculateSimulation(inputs), calculationError: "" };
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return { errors, result: null, calculationError: error.message };
  }
}

function Opportunity({ result }: { result: SimulationResult }) {
  const largest = Math.max(...result.categories.map(({ saving }) => saving));
  const leading = result.categories.filter(({ saving }) => saving === largest);
  let description = "Com estas premissas, a economia estimada é zero.";
  if (largest > 0 && leading.length === 1) {
    description = `Nessa simulação, a maior oportunidade aparece ${CATEGORIES[leading[0].key].where}, com ${formatBRL(largest)} de economia anual potencial.`;
  } else if (largest > 0) {
    const names = new Intl.ListFormat("pt-BR").format(leading.map(({ key }) => CATEGORIES[key].label.toLocaleLowerCase("pt-BR")));
    description = `Nesta simulação, ${names} têm o mesmo potencial de economia anual, de ${formatBRL(largest)} cada.`;
  }
  return (
    <aside className="opportunity">
      <span className="opportunity-icon"><Lightbulb size={21} aria-hidden="true" /></span>
      <div><h3>Leitura do cenário</h3><p>{description}</p></div>
    </aside>
  );
}

export function Simulator() {
  const [draft, setDraft] = useState(() => makeDraft());
  const [interacted, setInteracted] = useState<Partial<Record<FieldName, boolean>>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [sequence, setSequence] = useState(0);
  const formRegion = useRef<HTMLDivElement>(null);
  const resultTitle = useRef<HTMLHeadingElement>(null);
  const memory = useRef<HTMLDetailsElement>(null);
  const presentationTrigger = useRef<HTMLButtonElement>(null);
  const evaluation = useMemo(() => evaluate(draft), [draft]);
  const visibleErrors = Object.fromEntries(
    Object.entries(evaluation.errors).filter(([name]) => interacted[name as FieldName]),
  );

  function changeField(name: FieldName, value: string) {
    const next = { ...draft, [name]: value };
    setDraft(next);
    setInteracted({ ...interacted, [name]: true });
    if (result) {
      const nextResult = evaluate(next).result;
      if (nextResult) setResult(nextResult);
    }
  }

  function submit() {
    if (!evaluation.result) return;
    setResult(evaluation.result);
    setShowForm(false);
    setSequence((value) => value + 1);
    requestAnimationFrame(() => {
      resultTitle.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    });
  }

  function edit(advanced = false) {
    setShowForm(true);
    requestAnimationFrame(() => {
      const field = formRegion.current?.querySelector<HTMLElement>(advanced ? ".advanced > summary" : "#input-funcionarios");
      if (advanced && field?.parentElement instanceof HTMLDetailsElement) field.parentElement.open = true;
      field?.focus();
      field?.scrollIntoView({ block: "center" });
    });
  }

  function reset() {
    setResult(null);
    setDraft(makeDraft(true));
    setInteracted({});
    if (memory.current) memory.current.open = false;
    edit();
  }

  function openMemory() {
    if (!memory.current) return;
    memory.current.open = true;
    const label = memory.current.querySelector("summary");
    label?.focus({ preventScroll: true });
    memory.current.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <header className="site-header">
        <div className="site-shell header-content">
          <div className="site-identity">
            <span className="site-name">Advance Sistemas</span>
            <span className="site-product">Simulador de Economia</span>
          </div>
          <a className="header-link" href="#memoria" onClick={(event) => { event.preventDefault(); openMemory(); }}>
            <FileText size={17} aria-hidden="true" />
            <span>Metodologia</span>
          </a>
        </div>
      </header>
      <main className="site-shell page-content">
        {showForm && (
          <>
            <section className="hero" aria-labelledby="main-title">
              <p className="eyebrow"><span className="eyebrow-rule" />Protótipo de demonstração</p>
              <h1 id="main-title">Quanto a gestão de jornada pode representar para sua empresa?</h1>
              <p>Simule um cenário ilustrativo de custos e oportunidades de melhoria.</p>
            </section>
            <div className="initial-grid" ref={formRegion}>
              <SimulatorForm
                draft={draft} errors={visibleErrors} canSubmit={!!evaluation.result}
                calculationError={evaluation.calculationError} editing={!!result} onChange={changeField} onSubmit={submit}
              />
              <CategoryOverview />
            </div>
            {result && !evaluation.result && (
              <p className="stale-notice" role="status">Os resultados abaixo correspondem ao último cenário válido.</p>
            )}
          </>
        )}
        {result && (
          <section className="results" aria-labelledby="results-title">
            <div className="results-header">
              <div>
                <p className="eyebrow"><span className="eyebrow-rule" />Projeção de 12 meses</p>
                {showForm ? (
                  <h2 tabIndex={-1} ref={resultTitle} id="results-title">Cenário estimado para {formatNumber(result.inputs.funcionarios)} {result.inputs.funcionarios === 1 ? "colaborador" : "colaboradores"}</h2>
                ) : (
                  <h1 tabIndex={-1} ref={resultTitle} id="results-title">Cenário estimado para {formatNumber(result.inputs.funcionarios)} {result.inputs.funcionarios === 1 ? "colaborador" : "colaboradores"}</h1>
                )}
                <p className="secondary-copy">Salário médio mensal de {formatBRL(result.inputs.salarioMensal)}</p>
              </div>
              <button
                ref={presentationTrigger} className="button button-blue" type="button" onClick={() => setPresenting(true)}
              >
                <Monitor size={18} aria-hidden="true" /> Modo apresentação
              </button>
            </div>
            <div className="results-disclaimer"><Disclaimer compact /></div>
            <div className="results-actions">
              <button type="button" className="button button-secondary" onClick={() => setSequence((value) => value + 1)}>
                <RotateCcw size={17} aria-hidden="true" /> Reproduzir animação
              </button>
              {!showForm && <button type="button" className="button button-secondary" onClick={() => edit()}>
                <Pencil size={17} aria-hidden="true" /> Alterar dados
              </button>}
              <button type="button" className="button button-secondary" onClick={reset}>
                <Plus size={18} aria-hidden="true" /> Nova simulação
              </button>
            </div>
            <div className="results-visuals" key={sequence}>
              <Metrics result={result} animate />
              <div className="charts-grid">
                <BeforeAfterChart result={result} animate />
                <CategorySavingsChart result={result} animate />
                <DistributionChart result={result} animate />
              </div>
            </div>
            <Opportunity result={result} />
            <PresentationMode result={result} active={presenting} onClose={() => {
              setPresenting(false);
              presentationTrigger.current?.focus();
            }} />
          </section>
        )}
        <CalculationBreakdown key={result ? "result" : "initial"} result={result} detailsRef={memory} onEdit={() => edit(true)} />
        {!result && <footer className="page-footer"><Disclaimer /></footer>}
      </main>
    </>
  );
}
