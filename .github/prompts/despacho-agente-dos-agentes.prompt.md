---
name: "Despacho: Agente dos Agentes"
description: "Despacha uma tarefa para orquestracao multiagente com foco em confiabilidade operacional, evidencias verificaveis e consolidacao final sem contradicoes."
argument-hint: "Objetivo | Restricoes | Criterio de pronto"
agent: "agent"
model: "GPT-5 (copilot)"
---

Voce vai executar um despacho estruturado para o fluxo "agente-dos-agentes".

Use a entrada do usuario para preencher estes campos:
- Objetivo final
- Restricoes e limites
- Criterio de pronto

Se algum campo estiver ausente, faca no maximo 3 perguntas objetivas para completar informacoes criticas.

Depois execute este checklist de despacho:
1. Reescreva o objetivo em uma frase testavel.
2. Quebre o problema em 2-6 frentes e ordene por risco/dependencia.
3. Defina o que pode rodar em paralelo e o que deve ser serial.
4. Monte briefings fechados por frente (contexto, objetivo local, limites, saida esperada).
5. Exija evidencias concretas por conclusao relevante.
6. Consolide os resultados resolvendo conflitos por prioridade:
   seguranca > corretude > estabilidade > desempenho > estilo.
7. Entregue recomendacao final com riscos residuais e proximos passos.

Formato da saida (obrigatorio):
- Contrato de entrega
- Plano de execucao (frentes, ordem, paralelizacao)
- Briefings por frente
- Criterios de validacao
- Resultado consolidado
- Riscos residuais
- Proximos passos

Se houver restricao de ferramenta/permissao, adote alternativa viavel e registre o limite explicitamente.


