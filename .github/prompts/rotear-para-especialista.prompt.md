---
name: "Rotear Para Especialista"
description: "Classifica a demanda e aciona o agente especialista correto (financeiro, contabil, ou consolidacao final) com resposta objetiva e auditavel."
argument-hint: "Tema | contexto | prioridade | criterio de pronto"
agent: "orquestrador-de-dominios"
model: "GPT-5 (copilot)"
---

Classifique a demanda e execute o roteamento de especialistas.

Regras de classificacao:
- Financeiro: fluxo de caixa, margem, viabilidade, KPI, cenarios.
- Contabil: classificacao, fechamento, conciliacao, rastreabilidade, auditoria.
- Misto: envolve decisao financeira e conformidade contabil simultaneamente.

Entrega obrigatoria:
1. Classificacao da demanda
2. Agente escolhido e justificativa
3. Decisao recomendada
4. Riscos residuais
5. Proximo passo objetivo

Se faltar dado critico, faca no maximo 3 perguntas objetivas antes da recomendacao final.


