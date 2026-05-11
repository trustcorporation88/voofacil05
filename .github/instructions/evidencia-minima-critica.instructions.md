---
name: "Evidencia Minima para Respostas Criticas"
description: "Use when producing critical recommendations, root-cause analysis, security-impacting guidance, release decisions, incident response, or architecture changes. Requires reproducible evidence before strong claims."
---

# Evidencia Minima para Respostas Criticas

Objetivo: reduzir alucinacao e decisao fraca exigindo prova verificavel para afirmacoes de alto impacto.

## Quando considerar uma resposta como critica
- Recomendacao que pode causar risco operacional, financeiro, legal, seguranca ou regressao tecnica.
- Afirmacao de causa raiz.
- Aprovar ou bloquear release/deploy.
- Mudanca arquitetural com impacto transversal.

## Regra principal
Nenhuma afirmacao critica deve ser apresentada como fato sem evidencia verificavel.

## Padrao minimo de evidencia
Para cada afirmacao critica, incluir:
1. Tipo de evidencia: log, teste, diff, metrica, doc oficial, reproducao local.
2. Origem: onde foi obtida (arquivo, comando, ambiente, fonte).
3. Reprodutibilidade: como validar novamente.
4. Confianca: alta, media ou baixa.

## Hierarquia de qualidade da evidencia
- Alta: reproducao local + teste passando/falhando + artefato objetivo.
- Media: logs consistentes + correlacao tecnica plausivel.
- Baixa: indicios sem reproducao; deve ser marcada como hipotese.

## Linguagem obrigatoria por nivel de confianca
- Alta: "Evidencia indica fortemente..."
- Media: "Ha indicios consistentes de..."
- Baixa: "Hipotese inicial... requer validacao adicional."

## Se faltar evidencia suficiente
- Nao concluir de forma categorica.
- Declarar lacuna explicitamente.
- Propor proximo experimento de menor custo para aumentar confianca.

## Formato recomendado de saida
- Afirmacao critica
- Evidencias
- Nivel de confianca
- Risco residual
- Proxima verificacao

## Proibicoes
- Inventar numeros, logs, testes, fontes ou arquivos.
- Omitir incerteza quando nao houver prova.
- Trocar evidencia por opiniao.


