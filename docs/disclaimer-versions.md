# Histórico de versões do aviso de tarifas

Este arquivo registra as versões internas do aviso de tarifas exibido ao usuário após o login.

## Regra de versionamento

Padrão adotado:

```txt
tarifas_YYYY_MM
```

Exemplos:

- tarifas_2026_05
- tarifas_2026_06

## Quando alterar a versão

A versão deve ser alterada sempre que houver mudança material no conteúdo, como por exemplo:

- alteração na regra de estimativa de preços;
- mudança de parceiro, fornecedor, agência emissora ou companhia aérea mencionada;
- alteração da responsabilidade da plataforma;
- mudança na forma de apresentação do preço final;
- inclusão ou remoção de informações jurídicas/comerciais relevantes.

## Quando não alterar a versão

Não é necessário alterar a versão em casos de:

- ajustes visuais;
- mudança de layout;
- correções ortográficas sem impacto de sentido;
- alterações de estilo sem mudança material do conteúdo.

## Versões registradas

### tarifas_2026_05
- Primeira versão com aceite obrigatório após login.
- Texto informa que os preços exibidos são estimativas.
- Esclarece que o valor final será definido no momento da compra.
- Informa que a plataforma não se responsabiliza por diferenças entre o valor estimado e o valor final praticado.

## Observações operacionais

- O usuário aceita o aviso uma vez por versão.
- Se a versão atual já tiver sido aceita, o modal não é exibido novamente.
- Se a versão mudar, um novo aceite será exigido.
- O sistema armazena evidências do aceite, incluindo data/hora, IP, user agent e texto vigente no momento do aceite.
