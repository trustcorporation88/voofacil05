---
name: "Triagem Universal de Agentes"
description: "Decide rapidamente qual agente usar em um catalogo grande e quando escalar para agente-dos-agentes."
argument-hint: "Pedido | contexto | urgencia | risco | criterio de pronto"
agent: "orquestrador-de-dominios"
model: "GPT-5 (copilot)"
---

Execute triagem em 3 etapas:

1. Classificar
- Identifique divisao e subdominio principal.
- Se houver segunda frente relevante, marque subdominio secundario.

2. Rotear
- Escolha 1 agente principal.
- Opcional: 1 agente secundario para complementar.
- Se cruzar 3+ divisoes, ou houver risco alto, ou conflito tecnico, escale para agente-dos-agentes.

3. Fechar
- Se houver saidas conflitantes, finalize com consolidador-final.
- Entregue decisao unica, riscos residuais e proximo passo imediato.

Formato obrigatorio:
- Classificacao da demanda
- Agente(s) recomendado(s)
- Escalonar para agente-dos-agentes? (sim/nao + motivo)
- Riscos residuais
- Proximo passo imediato

Se faltar dado critico, faca no maximo 3 perguntas objetivas antes da recomendacao.


