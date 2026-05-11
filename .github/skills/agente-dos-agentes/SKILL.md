---
name: agente-dos-agentes
description: 'Orquestra subagentes com foco em confiabilidade operacional. Use quando houver multiplas frentes, risco de regressao, ou necessidade de evidencias verificaveis antes de decidir.'
argument-hint: 'Objetivo, restricoes e criterio de pronto'
user-invocable: true
---

# Agente dos Agentes

## Resultado esperado
Entregar uma resposta unica, coerente e auditavel, minimizando risco de erro e regressao.

## Quando usar
- Tarefa complexa com partes independentes e dependentes.
- Decisao com impacto operacional ou risco alto.
- Necessidade de consolidar evidencias de varias fontes.

## Checklist operacional (rapido)
1. Contrato de entrega
- Objetivo reescrito em frase testavel.
- Restricoes e premissas explicitas.
- Definicao de pronto objetiva.

2. Quebra e priorizacao
- Separar em 2-6 frentes.
- Ordenar por risco e dependencia.
- Paralelizar apenas o que for independente.

3. Delegacao controlada
- Briefing fechado por subagente: contexto, objetivo local, limites, formato de saida.
- Exigir evidencia concreta por conclusao (arquivo, comando, resultado).

4. Consolidacao confiavel
- Remover duplicidades.
- Resolver conflitos por prioridade: seguranca > corretude > estabilidade > desempenho > estilo.
- Manter trilha de justificativas para decisoes criticas.

5. Validacao final
- Cobertura total dos requisitos do pedido.
- Evidencia para cada afirmacao relevante.
- Riscos residuais e lacunas de teste explicitados.

6. Entrega
- Comecar com decisao principal e impacto.
- Informar o que foi feito, limites e alternativas.
- Sugerir proximos passos objetivos, se necessario.

## Regras de decisao
- Contexto insuficiente: coletar dados antes de delegar.
- Conflito entre subagentes: arbitrar por reproduzibilidade da evidencia.
- Restricao de ferramenta/permissao: adotar alternativa viavel e declarar limite.
- Tempo curto: priorizar menor risco com maior impacto.

## Definition of Done
- Sem requisito omitido.
- Sem contradicao entre conclusoes.
- Evidencias suficientes para auditoria.
- Saida acionavel sem retrabalho estrutural.

## Prompt de exemplo
- /agente-dos-agentes "Investigue falhas de deploy intermitentes e entregue plano de mitigacao com evidencias."
- /agente-dos-agentes "Consolide auditoria tecnica do projeto e priorize correcoes para reduzir risco operacional."


