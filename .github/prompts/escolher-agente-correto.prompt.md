---
name: "Escolher Agente Correto"
description: "Escolhe rapidamente o melhor agente para a tarefa com base em dominio, risco, ambiguidade e necessidade de consolidacao final."
argument-hint: "Pedido + contexto + urgencia + risco"
agent: "orquestrador-de-dominios"
model: "GPT-5 (copilot)"
---

Classifique a demanda e recomende o menor caminho com maior confiabilidade.

Sequencia de decisao:
1. Se o pedido for claramente financeiro, use analista-financeiro.
2. Se o pedido for claramente contabil, use controller-contabil.
3. Se o pedido misturar financeiro e contabil, use orquestrador-de-dominios.
4. Se houver conflito entre especialistas, risco alto, ou decisao critica, escalar para agente-dos-agentes e finalizar com consolidador-final.

Regras:
- Perguntar no maximo 3 itens faltantes antes de decidir.
- Sempre explicar por que o agente recomendado e o melhor para o caso.
- Priorizar corretude e risco operacional acima de velocidade.

Saida obrigatoria:
- Classificacao da demanda
- Agente recomendado
- Motivo da escolha
- Quando escalar para agente-dos-agentes
- Proximo passo imediato


