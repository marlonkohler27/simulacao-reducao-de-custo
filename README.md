# Simulador de Economia Advance

Protótipo demonstrativo em português para estimar custos anuais de horas extras, jornada não trabalhada e abonos. Os dados informados ficam na memória da página durante a sessão. A aplicação não usa login, banco de dados, telemetria nem integrações externas.

## Executar localmente

Requer Node.js 22 ou superior e npm.

```bash
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O exemplo inicial tem 25 colaboradores e salário mensal bruto médio de R$ 2.500,00. Altere os dados e as premissas conforme a necessidade. Para executar o build de produção localmente, use `npm run build` seguido de `npm run start`.

## Testes e verificações

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Os testes unitários cobrem o cenário de referência, salários decimais, equipes pequenas, parâmetros configuráveis, reduções de 0% e 100%, ausência de ocorrências e entradas inválidas. O build foi exercitado no Chromium em 1366×768, 1920×1080 e 390×844, incluindo edição, replay, apresentação por teclado, memória de cálculo e preferência por movimento reduzido. A checagem automatizada com axe não apontou violações nos estados avaliados.

## Avaliar o protótipo

Veja as capturas de avaliação. [Entrada](./docs/avaliacao/entrada-desktop.png) · [Resultado](./docs/avaliacao/resultado-desktop.png) · [Modo apresentação](./docs/avaliacao/apresentacao-desktop.png) · [Resultado no celular](./docs/avaliacao/resultado-celular.png)

- A entrada traz os dois dados da empresa e um painel com as três categorias. As premissas avançadas ficam recolhidas.
- **Simular cenário** mostra quatro indicadores anuais, barras de antes e depois, composição por categoria e distribuição do custo original. **Reproduzir animação** reapresenta os mesmos valores. **Alterar dados** atualiza a projeção à medida que as entradas ficam válidas.
- **Modo apresentação** percorre cenário atual, oportunidade por categoria e economia potencial. Use os botões ou as setas do teclado para navegar e Esc para sair.
- **Metodologia** e **Ver memória de cálculo** abrem as fórmulas, premissas aplicadas e exclusões. **Nova simulação** limpa os dados da empresa e restaura as premissas avançadas.

O cálculo decimal fica em `src/lib/calculations.ts`, as premissas e rótulos em `src/config/assumptions.ts`, e a interface e os gráficos em `src/components/`. As três visualizações usam barras HTML e CSS proporcionais, com valores e legendas textuais. O CSS controla as etapas das barras e `requestAnimationFrame` controla a contagem dos indicadores. Essa implementação dispensa bibliotecas de gráficos e de movimento e respeita `prefers-reduced-motion`.

Os [materiais de referência](./Simulador_Economia_Advance_Pacote_Codex/) são documentação do repositório e ficam fora do app. Consulte [as notas de validação](./NOTAS_VALIDACAO.md) para conferir os resultados e os pontos de revisão.

## Preparar um preview na Vercel após aprovação

- [ ] Confirme um plano adequado ao uso comercial, como Vercel Pro, ou uma hospedagem equivalente. O plano Hobby é limitado ao uso pessoal e não comercial. [Planos da Vercel](https://vercel.com/docs/plans/hobby)
- [ ] Na equipe correta da Vercel, conceda à integração GitHub acesso a `marlonkohler27/simulacao-reducao-de-custo`. Importe o projeto com o preset **Next.js**, raiz `./` e Node.js 22 ou superior. Use `npm ci` para instalar e `npm run build` para compilar. Não há variáveis de ambiente obrigatórias.
- [ ] Antes de disparar o primeiro deploy, revise a configuração de produção e mantenha-a separada do ambiente de Preview. Use a branch de feature `feat/mvp-simulador-economia` para o Preview e confirme que o deploy aparece como **Preview** no painel. Caso o fluxo de importação exija um primeiro deploy de produção, interrompa a importação e use um projeto de avaliação aprovado ou um Preview via CLI sem `--prod`. [Ambientes da Vercel](https://vercel.com/docs/deployments/environments)
- [ ] Ative **Deployment Protection** no Preview e confirme em uma janela sem sessão que o acesso está restrito antes de compartilhar o link com os avaliadores. [Proteção de deployments](https://vercel.com/docs/deployment-protection)
- [ ] Confira os valores com o exemplo padrão e abra o Preview em notebook e celular. Reserve domínio oficial e publicação de produção para uma aprovação separada.

A publicação foi deixada para depois da aprovação.

## Fora deste MVP

Exportação em PDF, integração com sistemas de ponto, captura de leads e comparação com dados reais ficam no roadmap.
