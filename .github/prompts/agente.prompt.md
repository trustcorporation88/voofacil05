---
name: "agente"
description: "Escolhe rapidamente qual agente usar para uma tarefa e quando escalar para orquestracao."
argument-hint: "Tarefa | contexto opcional | urgencia opcional"
agent: "orquestrador-de-dominios"
model: "GPT-5 (copilot)"
---

Analise a tarefa e recomende o melhor caminho com o menor risco.

Regras:
1. Escolha 1 agente principal.
2. Se fizer sentido, indique 1 agente de apoio.
3. Se a tarefa cruzar 3 ou mais dominios, tiver risco alto, ambiguidade real ou depender de consolidacao, escale para Agente dos Agentes.
4. Se a implementacao ja existir e faltar validacao, recomende tambem revisor ou QA apropriado.
5. Se faltar dado critico, faca no maximo 3 perguntas objetivas.

Formato obrigatorio da resposta:
- Tipo de tarefa
- Agente principal
- Agente de apoio
- Precisa escalar? (sim/nao + motivo)
- Revisor/QA recomendado depois? (sim/nao + qual)
- Proximo passo imediato

