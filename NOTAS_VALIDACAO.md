# Notas de validação

## Cenário padrão

25 colaboradores, salário bruto médio de R$ 2.500,00 e divisor configurável de 220 horas. O valor-hora exibido é R$ 11,36. Internamente, o cálculo usa a divisão com precisão decimal e preserva pessoas equivalentes fracionárias.

| Categoria | Pessoas equivalentes | Custo anual atual | Hipótese de redução | Economia anual potencial | Custo remanescente |
| --- | ---: | ---: | ---: | ---: | ---: |
| Horas extras | 7,5 | R$ 23.011,36 | 20% | R$ 4.602,27 | R$ 18.409,09 |
| Jornada não trabalhada | 2,5 | R$ 1.250,00 | 80% | R$ 1.000,00 | R$ 250,00 |
| Abonos | 0,5 | R$ 136,36 | 90% | R$ 122,73 | R$ 13,64 |
| Total |  | **R$ 24.397,73** | **23,47%** | **R$ 5.725,00** | **R$ 18.672,73** |

O arredondamento monetário ocorre na exibição. Por isso, a soma dos custos atuais exibidos por categoria é R$ 24.397,72, com um centavo de diferença em relação ao total calculado antes de arredondar. A hora extra usa o valor integral da hora multiplicado por 1,5 no exemplo.

## Diferenças em relação às capturas antigas

As capturas registram R$ 27.356 de custo atual, R$ 8.362 de economia, redução de 31% e R$ 2.844 de custo de abonos. Com as fórmulas do briefing, os mesmos dados iniciais produzem R$ 24.397,73, R$ 5.725,00, 23,47% e R$ 136,36, respectivamente.

A memória antiga mostra colaboradores afetados como inteiros, enquanto as taxas informadas geram 7,5, 2,5 e 0,5 pessoas equivalentes. A memória fotografada também é insuficiente para reconstruir o custo de abonos. O simulador usa as hipóteses e fórmulas documentadas no briefing. [Briefing do projeto](./Simulador_Economia_Advance_Pacote_Codex/BRIEFING_PARA_CODEX.md)

## Revisão antes de uso público

- Marketing e comercial devem validar a terminologia, as premissas 20%, 80% e 90%, e o uso dos exemplos em reuniões. São hipóteses editáveis, sem garantia de redução financeira.
- Validar com dados agregados da empresa a frequência de horas extras, atrasos e saídas e os critérios para abonos. Jornada não trabalhada e abonos representam tempo remunerado não aproveitado. Qualquer aplicação em folha ou interpretação de desconto exige revisão trabalhista e contábil própria.
- A estimativa exclui adicional noturno, encargos patronais, DSR, 13º, férias, convenções coletivas, tributos, afastamentos e multas. A leitura consolidada deve considerar eventuais sobreposições entre categorias ao aplicar premissas reais.
- A interface aplica os tokens e a tipografia do manual 2026.2 e identifica a empresa em texto. O repositório contém o manual em PDF, sem arte oficial independente em SVG ou PNG. Para uma futura aplicação da assinatura oficial, obter o arquivo aprovado e conferir contraste, área de proteção e tamanho mínimo. [Manual da marca](./Simulador_Economia_Advance_Pacote_Codex/referencias/marca/Manual_Marca_Advance_2026_2.pdf)
- Validar em reunião de teste os ritmos da apresentação e a legibilidade em projeção e no equipamento usado pelos consultores. O acesso ao futuro Preview deve ser restrito aos avaliadores.
