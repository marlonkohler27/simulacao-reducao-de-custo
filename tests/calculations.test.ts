import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_INPUTS } from "@/config/assumptions";
import { calculateSimulation, FIELD_NAMES, parseDraft } from "@/lib/calculations";
import { formatBRL, formatPercent } from "@/lib/format";
import type { Draft, SimulationInputs } from "@/types/simulation";

const defaultDraft = Object.fromEntries(
  FIELD_NAMES.map((name) => [name, String(DEFAULT_INPUTS[name])]),
) as Draft;

const roundMoney = (value: number) => Number(formatBRL(value).replace(/[^\d,]/g, "").replace(",", "."));
const closeTo = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) <= Number.EPSILON * Math.max(1, Math.abs(expected)) * 2);

test("reproduz os valores do briefing sem arredondar nas etapas intermediárias", () => {
  const result = calculateSimulation(DEFAULT_INPUTS);
  const [extras, jornada, abonos] = result.categories;
  assert.equal(result.hourlyRate, 2500 / 220);
  assert.equal(extras.affected, 7.5);
  assert.equal(extras.monthlyHours, 112.5);
  assert.equal(extras.hourlyMultiplier, 1.5);
  assert.equal(jornada.affected, 2.5);
  assert.equal(abonos.affected, 0.5);
  assert.deepEqual(result.categories.map(({ current }) => roundMoney(current)), [23011.36, 1250, 136.36]);
  assert.equal(roundMoney(result.current), 24397.73);
  assert.equal(roundMoney(result.saving), 5725);
  assert.equal(roundMoney(result.remaining), 18672.73);
  closeTo(result.remaining, result.current - result.saving);
  assert.equal(formatBRL(result.hourlyRate).replace(/\s/g, " "), "R$ 11,36");
  assert.equal(formatPercent(result.reduction), "23,47%");
});

test("calcula salário decimal, equipe de uma pessoa e divisor de horas configurável", () => {
  const inputs = {
    ...DEFAULT_INPUTS,
    funcionarios: 1,
    salarioMensal: 1500.75,
    horasMensaisReferencia: 200,
    diasTrabalhadosMes: 20,
    taxaFuncionariosHE: 100,
    adicionalHoraExtra: 0,
  };
  const result = calculateSimulation(inputs);
  assert.equal(result.hourlyRate, inputs.salarioMensal / 200);
  assert.equal(roundMoney(result.categories[0].current), 1350.68);
  assert.equal(roundMoney(result.categories[1].current), 30.02);
  assert.equal(roundMoney(result.categories[2].current), 3.60);
  assert.equal(result.categories[0].hourlyMultiplier, 1);
});

test("um cenário sem ocorrências mantém custos, economia e redução zerados", () => {
  const result = calculateSimulation({ ...DEFAULT_INPUTS, taxaFuncionariosHE: 0, taxaJornadaMenor: 0, taxaAbonos: 0 });
  assert.deepEqual([result.current, result.saving, result.remaining, result.reduction], [0, 0, 0, 0]);
  assert.ok(result.categories.every(({ current, saving, remaining }) => current === 0 && saving === 0 && remaining === 0));
});

test("reduções extremas e combinadas preservam os limites do custo de origem", () => {
  for (const rate of [0, 100]) {
    const result = calculateSimulation({ ...DEFAULT_INPUTS, reducaoHE: rate, reducaoJornadaMenor: rate, reducaoAbonos: rate });
    assert.equal(result.reduction, rate);
    assert.equal(result.saving, rate === 100 ? result.current : 0);
    assert.equal(result.remaining, rate === 100 ? 0 : result.current);
  }
  const mixed = calculateSimulation({ ...DEFAULT_INPUTS, reducaoHE: 0, reducaoJornadaMenor: 100, reducaoAbonos: 50 });
  closeTo(mixed.saving, mixed.categories.reduce((sum, { saving }) => sum + saving, 0));
  for (const { current, saving, remaining } of mixed.categories) {
    assert.ok(saving <= current);
    closeTo(remaining, current - saving);
  }
});

test("aceita valores em pt-BR e salários decimais digitados ou colados", () => {
  for (const value of ["R$ 2.500,75", "2.500,75", "2500,75", "2500.75"]) {
    const parsed = parseDraft({ ...defaultDraft, salarioMensal: value, diasTrabalhadosMes: "21,5", adicionalHoraExtra: "125,25" });
    assert.deepEqual(parsed.errors, {});
    assert.equal(parsed.inputs?.salarioMensal, 2500.75);
    assert.equal(parsed.inputs?.diasTrabalhadosMes, 21.5);
    assert.equal(parsed.inputs?.adicionalHoraExtra, 125.25);
  }
  assert.equal(parseDraft({ ...defaultDraft, salarioMensal: "2.500" }).inputs?.salarioMensal, 2500);
  assert.equal(parseDraft({ ...defaultDraft, salarioMensal: "0,01" }).inputs?.salarioMensal, 0.01);
});

test("separa campos vazios ou inválidos do cenário válido", () => {
  const values = parseDraft({
    ...defaultDraft,
    funcionarios: "1,5",
    salarioMensal: "",
    horasMensaisReferencia: "0",
    diasTrabalhadosMes: "32",
    reducaoHE: "100,01",
    horasAbonadasMesPorAfetado: "-1",
  });
  assert.equal(values.inputs, null);
  assert.deepEqual(Object.keys(values.errors).sort(), [
    "funcionarios", "salarioMensal", "horasMensaisReferencia", "diasTrabalhadosMes", "reducaoHE", "horasAbonadasMesPorAfetado",
  ].sort());
  assert.equal(parseDraft({ ...defaultDraft, salarioMensal: "2500,755" }).inputs, null);
  assert.equal(parseDraft({ ...defaultDraft, funcionarios: "0" }).inputs, null);
});

test("protege o cálculo quando chamado sem a validação da interface", () => {
  const invalid: Partial<SimulationInputs>[] = [
    { funcionarios: 1.5 }, { funcionarios: Number.MAX_SAFE_INTEGER + 1 },
    { salarioMensal: Infinity }, { horasMensaisReferencia: 0 }, { diasTrabalhadosMes: 0.5 },
    { taxaJornadaMenor: -1 }, { reducaoAbonos: 101 }, { adicionalHoraExtra: NaN },
    { salarioMensal: Number.MAX_VALUE },
  ];
  for (const patch of invalid) {
    assert.throws(() => calculateSimulation({ ...DEFAULT_INPUTS, ...patch }), RangeError);
  }
});
