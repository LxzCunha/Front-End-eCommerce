# MecanStore - Motores Estacionários

## Objetivo

Desenvolver um site acadêmico usando apenas HTML, CSS e JavaScript puro. O projeto simula uma loja de motores estacionários com catálogo de produtos, carrinho de compras e formulário de finalização de pedido.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- LocalStorage do navegador
- GitHub Pages para publicação

## Estrutura de páginas

- `index.html`: página inicial do projeto.
- `sobre.html`: apresentação do objetivo e dos recursos técnicos usados.
- `produtos.html`: catálogo de motores em formato de cards, baseado no layout de referência.
- `carrinho.html`: carrinho de compras com tabela criada dinamicamente pelo JavaScript.
- `checkout.html`: formulário de dados do cliente, validação e mensagem de sucesso.

## Funcionalidades implementadas

- Navegação entre páginas HTML.
- Cards de produtos criados pelo JavaScript com `createElement` e `appendChild`.
- Busca de produto por nome ou código.
- Eventos de clique para descrição, catálogo e adicionar ao carrinho.
- Carrinho salvo no `localStorage`.
- Tabela do carrinho atualizada dinamicamente.
- Alteração de quantidade dos produtos.
- Remoção de produtos do carrinho.
- Cálculo automático do total do pedido.
- Formulário de checkout com validação dos campos.
- Exibição de mensagens de erro.
- Exibição de mensagem de sucesso simulando o envio dos dados.
- Responsividade com media queries.

## Organização de arquivos

```text
mecanstore_refeito/
├── index.html
├── sobre.html
├── produtos.html
├── carrinho.html
├── checkout.html
├── README.md
├── favicon.ico
├── css/
│   ├── reset.css
│   └── index.css
├── js/
│   ├── principal.js
│   ├── dados-produtos.js
│   ├── produtos.js
│   ├── carrinho.js
│   └── checkout.js
└── img/
    └── produtos/
```

## Integrante

Leonardo Michaki

## Link do GitHub Pages

Coloque aqui o link após publicar:

```text
https://seu-usuario.github.io/nome-do-repositorio/
```
