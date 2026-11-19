import Decimal from "decimal.js";
import { FIELDS, MONTHS } from "@/config/assumptions";
import type {
  CategoryKey, Draft, FieldName, SimulationInputs, SimulationResult,
} from "@/types/simulation";

const Precise = Decimal.clone({ precision: 40 });

export const FIELD_NAMES = Object.keys(FIELDS) as FieldName[];
export type FieldErrors = Partial<Record<FieldName, string>>;

function parseValue(name: FieldName, raw: string): number {
  const text = raw.trim();
  if (name === "salarioMensal") {
    const amount = text.replace(/^R\$\s*/, "");
    const brl = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/;
    if (brl.test(amount)) {
      return Number(amount.replaceAll(".", "").replace(",", "."));
    }
    return /^\d+\.\d{1,2}$/.test(amount) ? Number(amount) : NaN;
  }
  if (name === "funcionarios") {
    return /^\d+$/.test(text) ? Number(text) : NaN;
  }
  return /^\d+(?:[,.]\d+)?$/.test(text) ? Number(text.replace(",", ".")) : NaN;
}

export function fieldError(name: FieldName, value: number): string | undefined {
  const field = FIELDS[name];
  if (!Number.isFinite(value) || (field.integer && !Number.isSafeInteger(value))) {
    if (name === "funcionarios") return "Informe uma quantidade inteira positiva.";
    if (name === "salarioMensal") return "Informe um valor em reais com até duas casas decimais.";
    return "Informe um número válido.";
  }
  if (field.positive && value <= 0) return "Informe um valor maior que zero.";
  const min = field.min ?? 0;
  if (field.max !== undefined && (value < min || value > field.max)) {
    return `Informe um valor entre ${min} e ${field.max}.`;
  }
  if (value < min) return "Informe um valor igual ou maior que zero.";
}

export function parseDraft(draft: Draft): { inputs: SimulationInputs | null; errors: FieldErrors } {
  const inputs = { ...draft } as Record<FieldName, string | number>;
  const errors: FieldErrors = {};
  for (const name of FIELD_NAMES) {
    const value = parseValue(name, draft[name]);
    const error = fieldError(name, value);
    if (error) errors[name] = error;
    inputs[name] = value;
  }
  return {
    inputs: Object.keys(errors).length ? null : inputs as SimulationInputs,
    errors,
  };
}

export function calculateSimulation(inputs: SimulationInputs): SimulationResult {
  for (const name of FIELD_NAMES) {
    if (fieldError(name, inputs[name])) {
      throw new RangeError(`Premissa inválida: ${name}`);
    }
  }

  const hourlyRate = new Precise(inputs.salarioMensal).div(inputs.horasMensaisReferencia);

  function category(
    key: CategoryKey,
    populationRate: number,
    hoursPerPerson: Decimal | number,
    reduction: number,
    hourlyMultiplier = new Precise(1),
  ) {
    const affected = new Precise(inputs.funcionarios).times(populationRate).div(100);
    const monthlyHours = affected.times(hoursPerPerson);
    const current = monthlyHours.times(hourlyRate).times(hourlyMultiplier).times(MONTHS);
    const saving = current.times(reduction).div(100);
    return { key, affected, monthlyHours, hourlyMultiplier, current, saving, reduction };
  }

  const overtimeMultiplier = new Precise(inputs.adicionalHoraExtra).div(100).plus(1);
  const missedHours = new Precise(inputs.minutosPerdidosDiaPorAfetado).times(inputs.diasTrabalhadosMes).div(60);
  const categories = [
    category("extras", inputs.taxaFuncionariosHE, inputs.horasExtrasMesPorAfetado, inputs.reducaoHE, overtimeMultiplier),
    category("jornada", inputs.taxaJornadaMenor, missedHours, inputs.reducaoJornadaMenor),
    category("abonos", inputs.taxaAbonos, inputs.horasAbonadasMesPorAfetado, inputs.reducaoAbonos),
  ];

  const current = categories.reduce((sum, item) => sum.plus(item.current), new Precise(0));
  const saving = categories.reduce((sum, item) => sum.plus(item.saving), new Precise(0));
  const remaining = (total: Decimal, difference: Decimal) => Precise.max(0, total.minus(difference));
  const finiteNumber = (value: Decimal) => {
    const number = value.toNumber();
    if (!Number.isFinite(number)) throw new RangeError("Os valores informados excedem o limite de cálculo.");
    return number;
  };

  return {
    inputs: { ...inputs },
    hourlyRate: finiteNumber(hourlyRate),
    categories: categories.map((item) => ({
      key: item.key,
      reduction: item.reduction,
      affected: finiteNumber(item.affected),
      monthlyHours: finiteNumber(item.monthlyHours),
      hourlyMultiplier: finiteNumber(item.hourlyMultiplier),
      current: finiteNumber(item.current),
      saving: finiteNumber(item.saving),
      remaining: finiteNumber(remaining(item.current, item.saving)),
    })),
    current: finiteNumber(current),
    saving: finiteNumber(saving),
    remaining: finiteNumber(remaining(current, saving)),
    reduction: current.gt(0) ? finiteNumber(saving.div(current).times(100)) : 0,
  };
}
