# Pacote para desenvolvimento no Codex

**Para usar:**

1. Abra o Codex e selecione o repositório GitHub em que deseja construir o projeto.
2. Copie `PROMPT_INICIAL_PARA_CODEX.txt` para a tarefa do Codex.
3. Disponibilize `BRIEFING_PARA_CODEX.md`, o PDF do manual e as imagens em `referencias/` para o ambiente do Codex. Você pode adicioná-los ao repositório **privado** ou anexá-los, se sua interface permitir. **O Codex não recebe automaticamente este ZIP por sua conexão GitHub.**
4. Se adicionar ao repositório, prefira colocar o briefing e manual em `docs/` e as imagens em `docs/referencias/`; adapte os caminhos no prompt quando necessário.
5. Peça ao Codex que primeiro leia os arquivos e faça a implementação em uma branch separada.
6. Revise o resultado antes de integrar em `main` ou publicar.

## Conteúdo

- `BRIEFING_PARA_CODEX.md`: especificação de produto, UX, animações, matemática, identidade visual, arquitetura, testes e limites.
- `PROMPT_INICIAL_PARA_CODEX.txt`: instrução compacta para iniciar a tarefa.
- `referencias/marca/Manual_Marca_Advance_2026_2.pdf`: manual oficial atualizado encontrado na biblioteca do usuário.
- `referencias/telas/`: 6 capturas de referência. Duas capturas de relatórios tiveram campos de identificação ofuscados. **Nenhuma imagem deve ser inserida diretamente no app final**; servem somente como referência.

## Importante: hospedagem

A Vercel Hobby é limitada ao uso não comercial, por isso um aplicativo usado em apresentações comerciais da Advance pode precisar de Vercel Pro ou hospedagem equivalente compatível.

## Notas sobre cálculos

As fórmulas do briefing são transparentes, mas os valores da captura antiga não batem integralmente com as premissas legíveis. Não afirmar que os números reproduzem a simulação original. Validar a metodologia comercial internamente antes de fornecer análises como resultados definitivos.
