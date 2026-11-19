import { ArrowRight, ChevronDown, Clock3, FileCheck2, SlidersHorizontal, Timer } from "lucide-react";
import type { FormEvent } from "react";
import { CATEGORIES, FIELDS, FIELD_GROUPS } from "@/config/assumptions";
import type { FieldErrors } from "@/lib/calculations";
import type { CategoryKey, Draft, FieldName } from "@/types/simulation";

interface FormProps {
  draft: Draft;
  errors: FieldErrors;
  canSubmit: boolean;
  calculationError: string;
  editing: boolean;
  onChange: (name: FieldName, value: string) => void;
  onSubmit: () => void;
}

function InputField({ name, draft, errors, onChange }: Pick<FormProps, "draft" | "errors" | "onChange"> & { name: FieldName }) {
  const field = FIELDS[name];
  const id = `input-${name}`;
  const error = errors[name];
  const currency = name === "salarioMensal";
  return (
    <div className="field">
      <label htmlFor={id}>{field.label}</label>
      <div className="field-control">
        {currency && <span className="field-prefix" aria-hidden="true">R$</span>}
        <input
          id={id}
          name={name}
          inputMode={field.integer ? "numeric" : "decimal"}
          className={currency ? "with-prefix" : undefined}
          value={draft[name]}
          placeholder={currency ? "0,00" : undefined}
          autoComplete="off"
          required
          aria-invalid={!!error}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          onChange={(event) => onChange(name, event.currentTarget.value)}
        />
        {field.unit && !currency && <span className="field-suffix" aria-hidden="true">{field.unit}</span>}
      </div>
      <p className="field-help" id={`${id}-help`}>{field.help}</p>
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function AdvancedAssumptions(props: Pick<FormProps, "draft" | "errors" | "onChange">) {
  return (
    <details className="advanced">
      <summary>
        <SlidersHorizontal size={17} aria-hidden="true" />
        <span>Premissas avançadas</span>
        <ChevronDown className="disclosure-chevron" size={17} aria-hidden="true" />
      </summary>
      <div className="advanced-content">
        <p className="secondary-copy">Ajuste as hipóteses ilustrativas com dados da empresa.</p>
        {FIELD_GROUPS.map((group) => (
          <fieldset key={group.title} className="assumption-group">
            <legend>{group.title}</legend>
            <div className="assumption-fields">
              {group.fields.map((name) => <InputField key={name} name={name} {...props} />)}
            </div>
          </fieldset>
        ))}
      </div>
    </details>
  );
}

export function SimulatorForm(props: FormProps) {
  const { editing, canSubmit, calculationError, onSubmit, draft, errors, onChange } = props;
  const hasAdvancedErrors = Object.keys(errors).some((name) => name !== "funcionarios" && name !== "salarioMensal");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) onSubmit();
  }
  return (
    <form className="panel form-panel" aria-labelledby="dados-titulo" onSubmit={handleSubmit} noValidate>
      <h2 id="dados-titulo">Dados da empresa</h2>
      <div className="base-fields">
        <InputField name="funcionarios" draft={draft} errors={errors} onChange={onChange} />
        <InputField name="salarioMensal" draft={draft} errors={errors} onChange={onChange} />
      </div>
      <AdvancedAssumptions draft={draft} errors={errors} onChange={onChange} />
      {hasAdvancedErrors && <p className="field-error">Revise os campos sinalizados em Premissas avançadas.</p>}
      {calculationError && <p className="field-error" role="status">{calculationError}</p>}
      <button className="button button-primary simulate-button" type="submit" disabled={!canSubmit}>
        {editing ? "Atualizar cenário" : "Simular cenário"}
        <ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  );
}

const CATEGORY_ICONS = { extras: Clock3, jornada: Timer, abonos: FileCheck2 };

export function CategoryOverview() {
  return (
    <aside className="panel category-overview" aria-labelledby="categorias">
      <h2 id="categorias">O que entra na simulação</h2>
      <ul className="overview-items">
        {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
          const { label, description } = CATEGORIES[key];
          const Icon = CATEGORY_ICONS[key];
          return (
            <li key={key}>
              <span className="category-icon"><Icon size={21} aria-hidden="true" /></span>
              <div><h3>{label}</h3><p>{description}</p></div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
