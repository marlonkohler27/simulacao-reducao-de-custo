import { ArrowLeft, ArrowRight, Monitor, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Disclaimer } from "./disclaimer";
import { Metrics } from "./metric-card";
import { BeforeAfterChart, CategorySavingsChart, DistributionChart } from "./simulation-charts";
import type { SimulationResult } from "@/types/simulation";

const steps = ["Cenário atual", "Oportunidade por categoria", "Economia potencial"];

export function PresentationMode({ result, active, onClose }: {
  result: SimulationResult;
  active: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (active && !element.open) element.showModal();
    if (!active && element.open) element.close();
  }, [active]);

  useEffect(() => {
    if (active) title.current?.focus();
  }, [active, step]);

  function changeStep(delta: number) {
    setStep((previous) => Math.max(0, Math.min(steps.length - 1, previous + delta)));
  }

  return (
    <dialog
      className="presentation-dialog"
      ref={dialog}
      aria-labelledby="presentation-title"
      onClose={() => { setStep(0); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          changeStep(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      {active && (
        <div className="presentation-shell">
          <header className="presentation-header">
            <div><Monitor size={18} aria-hidden="true" /> Modo apresentação</div>
            <button className="button button-secondary" type="button" onClick={() => dialog.current?.close()}>
              <X size={18} aria-hidden="true" /> Sair da apresentação
            </button>
          </header>
          <div className="presentation-content">
            <p className="eyebrow">Etapa {step + 1} de {steps.length}</p>
            <h2 tabIndex={-1} id="presentation-title" ref={title}>{steps[step]}</h2>
            <div key={step} className="presentation-stage">
              {step === 0 && <><Metrics result={result} animate={false} only="current" /><DistributionChart result={result} animate={false} /></>}
              {step === 1 && <CategorySavingsChart result={result} animate />}
              {step === 2 && <><Metrics result={result} animate only="opportunity" /><BeforeAfterChart result={result} animate /></>}
            </div>
          </div>
          <footer className="presentation-footer">
            <Disclaimer compact />
            <nav aria-label="Etapas da apresentação">
              <button className="button button-secondary" type="button" disabled={step === 0} onClick={() => changeStep(-1)}>
                <ArrowLeft size={18} aria-hidden="true" /> Anterior
              </button>
              <button className="button button-primary" type="button" disabled={step === steps.length - 1} onClick={() => changeStep(1)}>
                Próxima <ArrowRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </footer>
        </div>
      )}
    </dialog>
  );
}
