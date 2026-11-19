# Projeto: Simulador de Economia Advance — MVP comercial

**Versão:** 1.0 — 19/11/2026  
**Público:** apresentação presencial/remota conduzida por consultores da Advance Sistemas  
**Finalidade:** ferramenta de demonstração e validação comercial; **não** é sistema de apuração de ponto e **não** calcula economia garantida.  
**Status:** pronto para implementação pelo Codex após leitura das regras do repositório.

## 0. Como este documento deve ser usado

Você é o agente Codex encarregado de construir um **protótipo funcional**, dentro do repositório GitHub que o usuário selecionar. Antes de começar:

1. Leia `AGENTS.md`, configurações e instruções de projeto já presentes no repositório/ambiente. Preserve-as; relate conflitos antes de ações irreversíveis.
2. Inspecione o estado atual do repositório e **não sobrescreva** arquivos nem descarte alterações existentes. Se já houver código, aproveite-o quando apropriado.
3. Leia este documento completo, o manual da marca em `referencias/marca/Manual_Marca_Advance_2026_2.pdf` e as seis imagens em `referencias/telas/`.
4. Escreva um plano objetivo de implementação (arquivos, lógica, componentes, testes) e então execute a implementação, sem pedir confirmação para decisões técnicas triviais.
5. Trabalhe em branch própria (`feat/mvp-simulador-economia` ou nome livre equivalente). Não mescle na principal nem publique sem autorização do usuário. Se não houver conexão ao GitHub ou à Vercel no seu contexto, não invente que houve; forneça passos concretos para o usuário.

### Prioridade de fontes

1. Instruções explícitas do usuário e do repositório.
2. O **Manual da Marca Advance 2026.2** (novembro/2026) para design e identidade.
3. Este PRD para regras de produto, matemática e UX.
4. As imagens como **referências de ideia e comportamento**. Não copiar literalmente as interfaces ifPonto nem reproduzir nomes reais de pessoas/empresas.

## 1. Objetivo de negócio

Permitir que o apresentador, em reunião, digite **quantidade de colaboradores** e **salário médio mensal**, ajuste parâmetros mais avançados se desejar, e mostre em tempo real o impacto estimado da gestão das ocorrências de jornada em três frentes:

- **Horas extras:** redução estimada do volume/custo das horas extras.
- **Jornada não trabalhada:** atrasos e saídas antecipadas, quando houver tempo remunerado não trabalhado (não se confunde automaticamente com desconto salarial permitido).
- **Abonos sem justificativa suficiente:** custo ilustrativo de tempo abonado, caso a empresa valide a premissa em seus próprios dados.

A apresentação precisa ser consultiva, educativa e visualmente impactante, **sem exagerar em percentuais de economia**. Valores nunca devem ser rotulados como economia comprovada, promessa contratual ou efeito automático de instalar software.

## 2. Escopo da versão 1

### Incluído

- Aplicação web em pt-BR, responsiva, prioritariamente otimizada para **notebook na reunião** (1366×768/1920×1080), adaptada a celular.
- Uma rota principal e uma experiência contínua de entrada → simulação → apresentação de resultado → explicação das premissas.
- Entradas mínimas: **número de funcionários** e **salário médio mensal bruto em reais**.
- Parâmetros avançados editáveis, com explicações em linguagem simples.
- Três categorias e um consolidado anual; valores atuais, economia potencial, custo remanescente e percentuais.
- Gráficos e números com animação **sob demanda**, descritos na seção 5.
- Estados vazios, validação, opção **Nova simulação**, **Reproduzir animação** e **Modo apresentação**.
- Memória de cálculo acessível, com hipóteses e exclusões.
- Identificação visível de **Protótipo demonstrativo — estimativas ilustrativas**.
- Sem dados pessoais de funcionários, sem armazenamento externo, sem telemetria e sem conexão a sistemas reais.
- Código modular, documentado e testado, pronto para deploy futuro na Vercel e eventual transferência ao time Advance.

### Não incluído

- Autenticação ou cadastro de usuários; banco de dados e APIs pagas.
- Captação de leads, formulário comercial, CRM ou envio de e-mail.
- Integração com ifPonto ou leitura de dados reais.
- Apuração legal de jornada, folha, regras de CCT, reflexos trabalhistas ou cálculo automático de multas.
- Inclusão no site da Advance ou publicação oficial para clientes.
- Exportação em PDF nesta etapa (registrar como sugestão para roadmap).

## 3. Layout e jornada de demonstração

### Tela A — Entrada / cenário atual

- Cabeçalho limpo com assinatura Advance oficial **somente se houver arte original utilizável**; do contrário, marca tipográfica temporária, sem redesenhar o símbolo da digital.
- Eyebrow: `Protótipo de demonstração`.
- Título: `Quanto a gestão de jornada pode representar para sua empresa?`
- Subtítulo: `Simule um cenário ilustrativo de custos e oportunidades de melhoria.`
- Formulário com 2 entradas em destaque: `Quantidade de colaboradores` e `Salário médio mensal (R$)`.
- Botão primário `Simular cenário` habilitado apenas com valores válidos.
- Ao lado ou abaixo, miniárea de categorias (HE / atrasos e saídas / abonos) sem números antes do cálculo.
- Menu discreto `Premissas avançadas` recolhido por padrão.

### Tela B — Resultado guiado para reuniões

- Cabeçalho contextual `Cenário estimado para N colaboradores` e opção de editar dados.
- **Quatro números principais:** custo anual estimado atual, economia anual potencial, redução percentual estimada e custo remanescente anual.
- **Gráfico 1 — Antes vs. depois:** duas barras verticais ou horizontais, lado a lado (custo atual e cenário com melhoria); indicador visual claro da diferença.
- **Gráfico 2 — Composição dos custos:** barras por categoria mostrando custo atual e parcela estimada de economia; legendas, valores em R$ e rótulos para evitar depender somente de cor.
- **Gráfico 3 — Distribuição:** donut ou barra empilhada para o cenário original, com valores e percentuais. Evitar excesso visual.
- Bloco de **leitura consultiva**: `Nessa simulação, a maior oportunidade aparece em [categoria]`, calculada a partir dos dados reais da simulação, e nunca com texto fixo.
- Controles `Reproduzir animação`, `Alterar dados`, `Nova simulação`, `Ver memória de cálculo`.
- **Modo apresentação**: amplia cards e gráficos, reduz controles secundários, mantém valores e ressalvas legíveis.
- O objetivo é uma **demonstração visual**, não uma dashboard operacional com tabelas densas.

### Tela C — Premissas e memória de cálculo

Mostrar fórmulas legíveis, parâmetros editáveis, referências e nota `Estimativa ilustrativa — sem garantia de redução financeira`. Exibir claramente cada multiplicador e a divisão salário/horas mensais. Em vez de replicar uma tela antiga, usar uma tabela clara (`Variável`, `Valor`, `Explicação`).

## 4. Modelo matemático — transparente e testável

### 4.1. Parâmetros iniciais configuráveis

Os itens abaixo foram inspirados nas telas anexas e **não são dados estatísticos da Advance**. São premissas ilustrativas para demonstração, e o usuário deve poder alterá-las:

| Variável | Padrão | Faixa/Regra | Observação |
|---|---:|---|---|
| funcionarios | 25 (exemplo ao abrir) | inteiro > 0 | Exemplo visual; usuário pode substituir |
| salarioMensal | R$ 2.500,00 | R$ > 0 | Salário bruto médio mensal |
| horasMensaisReferencia | 220 h | > 0 | Divisor **configurável**; não inferir de 22×8 |
| diasTrabalhadosMes | 22 | 1–31 | Apenas para estimar tempo não trabalhado |
| taxaFuncionariosHE | 30% | 0–100% | Proporção estimada com HE |
| horasExtrasMesPorAfetado | 15 h | >= 0 | Média mensal por pessoa afetada |
| adicionalHoraExtra | 50% | >= 0 | Adicional ilustrativo; legislação/CCT podem alterar |
| taxaJornadaMenor | 10% | 0–100% | Atrasos/saídas estimadas |
| minutosPerdidosDiaPorAfetado | 10 min | >= 0 | Média em dias de trabalho |
| taxaAbonos | 2% | 0–100% | Proporção estimada |
| horasAbonadasMesPorAfetado | 2 h | >= 0 | Média por mês por pessoa afetada |
| reducaoHE | 20% | 0–100% | Hipótese comercial **editável** |
| reducaoJornadaMenor | 80% | 0–100% | Hipótese comercial **editável**, não garantia |
| reducaoAbonos | 90% | 0–100% | Hipótese comercial **editável**, não garantia |
| mesesAno | 12 | constante | Horizonte anual de comparação |

**Destaque de transparência:** as referências visuais exibem `25 colaboradores`, `R$ 2.500`, `R$ 27.356` de custo anual e `R$ 8.362 / 31%` de economia. No entanto, a memória de cálculo fotografada **não permite reconstruir de maneira inequívoca** o item de abonos e parece misturar valores arredondados de colaboradores com taxas fracionárias. **Não** fixar os números da imagem como saída esperada. Seguir as fórmulas abaixo; marcar divergências em `NOTAS_VALIDACAO.md`.

### 4.2. Fórmulas para a versão demonstrativa

Usar cálculos numéricos consistentes e realizar arredondamento **apenas na exibição** em BRL (2 casas), salvo critério documentado. Não arredondar o número estimado de pessoas afetadas no meio das fórmulas: por exemplo, 25×30% = 7,5 colaboradores equivalentes é uma premissa de **valor esperado**, não um cadastro real.

```text
valorHora = salarioMensal / horasMensaisReferencia

pessoasEquivalentesHE = funcionarios * taxaFuncionariosHE
horasExtrasMensais = pessoasEquivalentesHE * horasExtrasMesPorAfetado
custoAnualHE = horasExtrasMensais * valorHora * (1 + adicionalHoraExtra) * 12

pessoasEquivalentesJornada = funcionarios * taxaJornadaMenor
horasNaoTrabalhadasMensais = pessoasEquivalentesJornada * minutosPerdidosDiaPorAfetado / 60 * diasTrabalhadosMes
custoAnualJornadaMenor = horasNaoTrabalhadasMensais * valorHora * 12

pessoasEquivalentesAbonos = funcionarios * taxaAbonos
horasAbonadasMensais = pessoasEquivalentesAbonos * horasAbonadasMesPorAfetado
custoAnualAbonos = horasAbonadasMensais * valorHora * 12

custoAnualAtual = custoAnualHE + custoAnualJornadaMenor + custoAnualAbonos

economiaHE = custoAnualHE * reducaoHE
economiaJornadaMenor = custoAnualJornadaMenor * reducaoJornadaMenor
economiaAbonos = custoAnualAbonos * reducaoAbonos
economiaAnual = economiaHE + economiaJornadaMenor + economiaAbonos
custoAnualAposMelhoria = max(0, custoAnualAtual - economiaAnual)
percentualEconomia = custoAnualAtual > 0 ? 100 * economiaAnual / custoAnualAtual : 0
```

**Interpretação do custo:** na simulação, o custo de jornada menor/abono representa uma **estimativa econômica de horas remuneradas não aproveitadas**, não um valor que possa ser automaticamente descontado de funcionários. Hora extra considera o **valor integral de 150%** no padrão de 50% de adicional, e não apenas os 50% adicionais — rótulo e memória devem deixar isso claro. Sem adicionais noturnos, encargos patronais, DSR, 13º, férias, encargos, convenções, efeitos tributários, afastamentos ou multas; nenhum resultado pretende substituí-los.

### 4.3. Cenário de teste de referência (calculado pelas regras acima)

Com **25 pessoas, salário R$ 2.500, demais parâmetros padrões**, valores esperados arredondados:

- Valor hora: R$ 11,36 na exibição (internamente R$ 11,363636...).
- HE anual: ~**R$ 23.011,36**.
- Jornada não trabalhada anual: **R$ 1.250,00**.
- Abonos anuais: ~**R$ 136,36**.
- Custo anual atual: ~**R$ 24.397,73**.
- Economia anual potencial: ~**R$ 5.725,00**.
- Redução estimada: ~**23,47%**.

Os resultados **não são** os mesmos números da tela antiga, por motivos explicados acima. Testar também zeros, percentuais extremos e salários decimais.

## 5. Motion design — requisito essencial

A animação é o principal diferencial comercial, mas **não pode distorcer o resultado**. Usar uma biblioteca estável para gráficos (ex.: Recharts) com biblioteca de movimento consolidada (ex.: Motion/Framer Motion), ou alternativa leve justificada pelo Codex.

### Animações ao clicar em `Simular cenário`

1. Os KPIs entram com fade + elevação suave (120–240 ms de atraso escalonado); números crescem até os valores calculados (count-up entre ~700 e 1100 ms).
2. As barras **antes** entram primeiro; em seguida, as barras **depois** se contraem/revelam, evidenciando em cada categoria a parcela reduzida. Um elemento ou rótulo `Economia estimada` aparece na diferença.
3. A barra comparativa total mostra claramente a passagem `Custo atual → Custo após melhorias`, sem fazer parecer que a economia já aconteceu.
4. O gráfico de composição entra depois (donut segmentado ou barra empilhada) com tooltip acessível e rótulos legíveis.
5. Pequena transição nos valores de categoria quando um parâmetro for alterado, **sem flicker, sem contador em looping e sem confetes**.
6. Ao pressionar `Reproduzir animação`, executar a sequência novamente **com os mesmos valores**.
7. No `Modo apresentação`, ocultar distrações e permitir avançar pelos três momentos: `cenário atual`, `oportunidade por categoria`, `economia potencial`.
8. Respeitar `prefers-reduced-motion` (reduzir animações), manter informações presentes sem JS de animação, suportar teclado, contraste mínimo e telas pequenas. Não usar vermelho/verde como única codificação visual.

### Linguagem visual dos gráficos

- Estado atual: **azul Advance** ou cinza de apoio.
- Economia hipotética: **laranja Advance**, com rótulo textual e legenda.
- Custo remanescente: azul escuro/cinza, claramente distinto.
- Uma cor representa sempre o mesmo conceito em toda a aplicação.
- Animações **só na interface**, nunca efeitos sobre o logotipo oficial; não aplicar gradientes/glows ao símbolo Advance.

## 6. Manual da marca — obrigatório

Arquivo de referência: `referencias/marca/Manual_Marca_Advance_2026_2.pdf`, edição 2026.2, atualizada em 13/11/2026.

**Tokens derivados do manual**:

```css
:root {
  --advance-blue: #004F8A;
  --advance-orange: #FF570A;
  --advance-gray: #606060;
  --surface: #F3F6F8;
  --ink: #0D273B;
  --white: #FFFFFF;
  --black: #000000;
}
```

- Predomínio de **fundo branco** e superfícies neutras, com azul estrutural e laranja nos destaques.
- Sem visual neon, sem sombras fortes, sem gradientes nos logos, sem excesso de cartões coloridos.
- Tipografia de interface: `system-ui`/Arial/sans-serif, títulos ~28–32px/700; texto ~16px/400; rótulos ~12–14px/500. Não incluir fontes comerciais licenciadas sem autorização.
- Botões com fundo laranja devem usar texto escuro `#0D273B`, não branco pequeno, para contraste.
- Símbolo `A` de impressão digital **não pode ser redesenhado ou substituído por ícone genérico**. Usar SVG/PNG oficial fornecido pelo usuário **se acessível**; se só houver o PDF, não criar uma aproximação visual. É permitido usar nome de empresa em texto e anotar que falta o arquivo vetorial oficial.
- O manual do projeto *Mkt Advance* **não é automaticamente acessível pelo Codex somente porque está em outro projeto ChatGPT**; por isso ele foi incluído nesta pasta. Usar este arquivo enviado ao ambiente do Codex, não supor acesso a projetos fora do repositório.
- Logotipos de terceiros/ifPonto não devem ser reaproveitados nesta solução, salvo solicitação explícita.

## 7. Arquitetura técnica sugerida

- Next.js + TypeScript + Tailwind CSS com estrutura de `app/` ou equivalente.
- Funções de cálculo **puras e isoladas da UI** em `src/lib/calculations.ts`, tipos em `src/types/`, defaults em `src/config/assumptions.ts`.
- Componentes separados: `SimulatorForm`, `AdvancedAssumptions`, `MetricCard`, `BeforeAfterChart`, `CategorySavingsChart`, `CalculationBreakdown`, `PresentationMode`, `Disclaimer`.
- Biblioteca de gráficos consolidada com renderização no cliente apenas onde necessário.
- Sem banco de dados, sem variáveis secretas, sem necessidade de APIs, backend ou Supabase.
- Respeitar instruções pré-existentes, lint/formatador de projeto e convenções de importação.
- Não utilizar IDs de colaborador, nomes, fotos ou outros dados pessoais das capturas nos mocks.

## 8. Critérios de aceite

- [ ] Build e lint executam sem erro.
- [ ] Layout legível em 1366×768 e responsivo em 390×844.
- [ ] Fórmulas isoladas, tipadas e testadas com cenário padrão de referência.
- [ ] Valor hora não é arredondado antes de multiplicar.
- [ ] Custo após melhoria = custo atual − economia; nenhuma economia supera o custo de origem.
- [ ] Percentuais 0% e 100%, quantidades pequenas e entradas inválidas tratados corretamente.
- [ ] Números e gráficos coerentes entre si; não há métricas hardcoded no resultado.
- [ ] Animação em etapas enfatiza claramente o **antes/depois** e roda novamente ao comando do usuário.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] A marca segue a paleta/tipografia e não recria a digital original.
- [ ] Selo de demonstração e nota de metodologia/exclusões acessíveis a qualquer momento.
- [ ] Nenhum dado sensível das capturas vai para o bundle de produção.
- [ ] README atualizado com execução, testes e preparação para Vercel.
- [ ] `NOTAS_VALIDACAO.md` documenta diferenças entre resultados antigos e novos e pontos que marketing/comercial devem validar antes do uso público.

## 9. Entregáveis que o Codex deve produzir

1. Código-fonte funcional no repositório selecionado, em branch de feature.
2. Interface em pt-BR, com todos os gráficos e motion especificados.
3. Testes unitários das funções de cálculo e comando de execução no README.
4. Capturas de tela ou descrição visual da implementação para revisão.
5. `NOTAS_VALIDACAO.md` com riscos/limitações comerciais e cálculos.
6. Checklist claro de como conectar **esse** repositório à Vercel e gerar preview, **sem alegar que o deploy ocorreu** antes de ocorrer.
7. Resumo dos arquivos criados/alterados, comandos executados e pendências.

## 10. Hospedagem e privacidade para demonstrações

- O uso em reuniões de venda da Advance tem **finalidade comercial**. A Vercel documenta que o plano Hobby é para uso pessoal **não comercial**. Preparar o app para Vercel, mas **não pressupor** que a conta Hobby possa ser usada para demonstrar em clientes; confirmar plano Pro apropriado ou optar por outra hospedagem compatível antes desse uso.
- Se houver ambiente de preview, preferir acesso protegido/senha quando o plano ou provedor oferecer esse recurso. Deixar claro se um link é público.
- Não fazer deploy em domínio oficial, nem em `advancesistemas.com` sem aprovação.

## 11. Roadmap fora do MVP

- Exportação de relatório PDF com metodologia e marca.
- Cenários conservador/moderado/otimista auditáveis.
- Comparação com indicadores reais e integração autorizada com ifPonto.
- Agendamento, captura de leads, registro de origem do lead e CRM.
- Governança das premissas comerciais com controle de versões.
- Revisão trabalhista, contábil e técnica antes de uso público.
