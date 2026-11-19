export interface SimulationInputs {
  funcionarios: number;
  salarioMensal: number;
  horasMensaisReferencia: number;
  diasTrabalhadosMes: number;
  taxaFuncionariosHE: number;
  horasExtrasMesPorAfetado: number;
  adicionalHoraExtra: number;
  taxaJornadaMenor: number;
  minutosPerdidosDiaPorAfetado: number;
  taxaAbonos: number;
  horasAbonadasMesPorAfetado: number;
  reducaoHE: number;
  reducaoJornadaMenor: number;
  reducaoAbonos: number;
}

export type FieldName = keyof SimulationInputs;
export type Draft = Record<FieldName, string>;
export type CategoryKey = "extras" | "jornada" | "abonos";

export interface CategoryResult {
  key: CategoryKey;
  affected: number;
  monthlyHours: number;
  hourlyMultiplier: number;
  current: number;
  saving: number;
  remaining: number;
  reduction: number;
}

export interface SimulationResult {
  inputs: SimulationInputs;
  hourlyRate: number;
  categories: CategoryResult[];
  current: number;
  saving: number;
  remaining: number;
  reduction: number;
}
