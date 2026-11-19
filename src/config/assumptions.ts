import type { CategoryKey, FieldName, SimulationInputs } from "@/types/simulation";

export const MONTHS = 12;

export const DEFAULT_INPUTS: SimulationInputs = {
  funcionarios: 25,
  salarioMensal: 2500,
  horasMensaisReferencia: 220,
  diasTrabalhadosMes: 22,
  taxaFuncionariosHE: 30,
  horasExtrasMesPorAfetado: 15,
  adicionalHoraExtra: 50,
  taxaJornadaMenor: 10,
  minutosPerdidosDiaPorAfetado: 10,
  taxaAbonos: 2,
  horasAbonadasMesPorAfetado: 2,
  reducaoHE: 20,
  reducaoJornadaMenor: 80,
  reducaoAbonos: 90,
};

export const CATEGORIES: Record<CategoryKey, {
  label: string;
  description: string;
  where: string;
}> = {
  extras: {
    label: "Horas extras",
    description: "Horas acima da jornada, com o adicional aplicado ao valor-hora.",
    where: "em horas extras",
  },
  jornada: {
    label: "Jornada não trabalhada",
    description: "Tempo remunerado de atrasos e saídas antecipadas.",
    where: "na jornada não trabalhada",
  },
  abonos: {
    label: "Abonos",
    description: "Tempo abonado sem justificativa suficiente, a validar pela empresa.",
    where: "em abonos",
  },
};

interface Field {
  label: string;
  help: string;
  unit?: string;
  min?: number;
  max?: number;
  positive?: boolean;
  integer?: boolean;
}

export const FIELDS: Record<FieldName, Field> = {
  funcionarios: {
    label: "Quantidade de colaboradores", help: "Total de colaboradores considerados na simulação.",
    positive: true, integer: true,
  },
  salarioMensal: {
    label: "Salário médio mensal (R$)", help: "Salário bruto mensal médio por colaborador.",
    positive: true, unit: "R$",
  },
  horasMensaisReferencia: {
    label: "Horas mensais de referência", help: "Divisor usado para calcular o valor de uma hora de trabalho.",
    positive: true, unit: "h",
  },
  diasTrabalhadosMes: {
    label: "Dias trabalhados por mês", help: "Usado apenas para estimar tempo de atrasos e saídas. Informe de 1 a 31.",
    min: 1, max: 31, unit: "dias",
  },
  taxaFuncionariosHE: {
    label: "Colaboradores com horas extras", help: "Parcela da equipe que faz horas extras.",
    max: 100, unit: "%",
  },
  horasExtrasMesPorAfetado: {
    label: "Horas extras por pessoa", help: "Média mensal por colaborador com horas extras.",
    unit: "h",
  },
  adicionalHoraExtra: {
    label: "Adicional de hora extra", help: "Percentual acrescentado ao valor integral da hora normal.",
    unit: "%",
  },
  reducaoHE: {
    label: "Redução de horas extras", help: "Hipótese de redução do custo anual de horas extras.",
    max: 100, unit: "%",
  },
  taxaJornadaMenor: {
    label: "Colaboradores com atrasos ou saídas", help: "Parcela estimada da equipe com ocorrências de jornada.",
    max: 100, unit: "%",
  },
  minutosPerdidosDiaPorAfetado: {
    label: "Minutos não trabalhados por dia", help: "Tempo remunerado não trabalhado por pessoa afetada, por dia.",
    unit: "min",
  },
  reducaoJornadaMenor: {
    label: "Redução de jornada não trabalhada", help: "Hipótese de redução do custo anual de atrasos e saídas.",
    max: 100, unit: "%",
  },
  taxaAbonos: {
    label: "Colaboradores com abonos", help: "Parcela estimada da equipe com abonos sem justificativa suficiente.",
    max: 100, unit: "%",
  },
  horasAbonadasMesPorAfetado: {
    label: "Horas abonadas por pessoa", help: "Média mensal por pessoa afetada, a validar com dados da empresa.",
    unit: "h",
  },
  reducaoAbonos: {
    label: "Redução de abonos", help: "Hipótese de redução do custo anual das horas abonadas.",
    max: 100, unit: "%",
  },
};

export const FIELD_GROUPS: { title: string; fields: FieldName[] }[] = [
  { title: "Referências de jornada", fields: ["horasMensaisReferencia", "diasTrabalhadosMes"] },
  { title: "Horas extras", fields: ["taxaFuncionariosHE", "horasExtrasMesPorAfetado", "adicionalHoraExtra", "reducaoHE"] },
  { title: "Jornada não trabalhada", fields: ["taxaJornadaMenor", "minutosPerdidosDiaPorAfetado", "reducaoJornadaMenor"] },
  { title: "Abonos", fields: ["taxaAbonos", "horasAbonadasMesPorAfetado", "reducaoAbonos"] },
];
