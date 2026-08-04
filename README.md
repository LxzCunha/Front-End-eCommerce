# MecanStore - Motores Estacionários

## Objetivo

Desenvolver um site acadêmico para a disciplina de Desenvolvimento Front-End do curso de
Engenharia de Software da UniSenai-PR. O projeto simula uma loja de motores estacionários com
catálogo de produtos, carrinho de compras e finalização de pedido.

A primeira versão foi construída apenas com HTML, CSS e JavaScript puro, usando dados fixos
em arquivo e `localStorage`. Na versão atual o front-end foi **integrado a uma API REST
própria** (`ecommerce-api`, em Java com Spring Boot), passando a consumir dados reais,
persistir clientes e pedidos em banco e aplicar regras de negócio no servidor.

## Tecnologias utilizadas

### Front-end
- HTML5
- CSS3 (com media queries para responsividade)
- JavaScript puro (ES5, sem frameworks nem bibliotecas)
- Fetch API + Promises para comunicação HTTP
- LocalStorage do navegador (carrinho e sessão do cliente)

### Back-end (projeto `ecommerce-api`)
- Java 17
- Spring Boot 3.4 (Web, Data JPA, Validation)
- Hibernate / JPA
- Banco H2 em arquivo
- Maven

## Arquitetura

```text
Navegador (http://localhost:5500)
        │
        │  fetch() → JSON
        ▼
API REST (http://localhost:8080/api)
        │
        ▼
Banco H2 (arquivo ./data/ecommerce.mv.db)
```

O front-end não acessa banco diretamente: todas as operações passam pelos endpoints REST.
As regras de negócio (controle de estoque, validação de pagamento, unicidade de e-mail)
ficam no servidor.

## Estrutura de páginas

- `index.html`: página inicial do projeto.
- `sobre.html`: apresentação do objetivo e dos recursos técnicos usados.
- `produtos.html`: catálogo de motores em cards, carregado dinamicamente da API.
- `cadastro.html`: formulário de cadastro do cliente, enviado para a API.
- `carrinho.html`: carrinho de compras com tabela criada dinamicamente pelo JavaScript.
- `checkout.html`: resumo do pedido, escolha da forma de pagamento e finalização.
- `contato.html`: formulário de contato com validação local.

## Funcionalidades implementadas

### Front-end (versão original, mantidas)
- Navegação entre páginas HTML.
- Cards de produtos criados pelo JavaScript com `createElement` e `appendChild`.
- Busca de produto por nome ou código.
- Carrinho salvo no `localStorage`, com tabela atualizada dinamicamente.
- Alteração de quantidade e remoção de produtos do carrinho.
- Cálculo automático do total do pedido.
- Formulários com validação de campos e exibição de mensagens de erro.
- Responsividade com media queries.

### Integração com a API (novas)
- **Camada de acesso HTTP** centralizada em `js/api.js`, com tratamento padronizado de erros.
- **Catálogo carregado da API** (`GET /api/produtos`), substituindo a lista fixa em arquivo.
  Os produtos agora trazem código, descrição, imagem e estoque vindos do banco.
- **Controle de estoque na interface**: produtos sem estoque aparecem com o botão desabilitado,
  e a quantidade máxima do card respeita o estoque disponível.
- **Cadastro de cliente persistido** (`POST` / `PUT /api/clientes`), com endereço completo
  (logradouro, bairro, cidade, UF e CEP) e CPF.
- **Recuperação de cliente por e-mail** (`GET /api/clientes/buscar`), evitando bloqueio quando
  o e-mail já existe no banco.
- **Criação de pedido real** (`POST /api/pedidos`), com baixa automática de estoque no servidor.
- **Processamento de pagamento** (`POST /api/pedidos/{id}/pagamento`) com suporte a Pix e
  cartão de crédito, incluindo os campos específicos de cada modalidade.
- **Exibição do número e do status do pedido** retornados pela API.
- **Mensagens de erro vindas do servidor** exibidas na tela (estoque insuficiente, cartão
  inválido, dados obrigatórios ausentes), incluindo erros de validação campo a campo.
- **Estados de carregamento** e botões desabilitados durante o envio, evitando cliques duplicados.
- **Proteção contra pedido duplicado**: se o pagamento falhar, uma nova tentativa reaproveita
  o pedido já criado em vez de gerar outro.

## Endpoints consumidos

| Método | Rota | Uso no front |
|--------|------|--------------|
| GET | `/api/produtos` | Catálogo em `produtos.html` |
| POST | `/api/clientes` | Cadastro de novo cliente |
| PUT | `/api/clientes/{id}` | Atualização do cliente já cadastrado |
| GET | `/api/clientes/buscar?email=` | Recuperação de cliente existente |
| POST | `/api/pedidos` | Criação do pedido no checkout |
| POST | `/api/pedidos/{id}/pagamento` | Pagamento via Pix ou cartão |

Erros são retornados no formato:

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Estoque insuficiente para 'MOTOR BFG 7.0 PRO'. Disponivel: 3, solicitado: 5.",
  "path": "/api/pedidos",
  "fieldErrors": null
}
```

## Organização de arquivos

```text
mecanstore_refeito/
├── index.html
├── sobre.html
├── produtos.html
├── cadastro.html
├── carrinho.html
├── checkout.html
├── contato.html
├── README.md
├── favicon.ico
├── css/
│   ├── reset.css
│   └── index.css
├── js/
│   ├── api.js          (novo: camada de acesso à API)
│   ├── principal.js    (localStorage, carrinho e utilidades)
│   ├── produtos.js
│   ├── cadastro.js
│   ├── carrinho.js
│   ├── checkout.js
│   └── contato.js
└── img/
    └── produtos/
```

> O arquivo `js/dados-produtos.js` foi removido: os produtos agora vêm da API.

## Como executar localmente

O projeto exige os **dois** serviços rodando ao mesmo tempo.

### 1. Back-end

```bash
cd ecommerce-api
rm -rf data/              # apenas na primeira execução, para recriar o banco
./mvnw spring-boot:run    # sobe em http://localhost:8080
```

Teste: `curl http://localhost:8080/api/produtos` deve retornar os produtos em JSON.

### 2. Front-end

```bash
cd mecanstore_refeito
python3 -m http.server 5500
```

Acesse `http://localhost:5500/produtos.html`.

> **Importante:** o front precisa ser servido por HTTP. Abrindo os arquivos com duplo clique
> (`file://`), o navegador envia `Origin: null` e as requisições são bloqueadas pela política
> de CORS. No VS Code, a extensão Live Server tem o mesmo efeito do comando acima.

A URL da API está definida em `js/api.js`, na constante `API_URL`.

## Publicação

O GitHub Pages hospeda apenas arquivos estáticos. A versão publicada continua servindo as
páginas, mas as funcionalidades que dependem da API (catálogo, cadastro e pedido) só
funcionam com o back-end rodando na máquina do visitante, já que `API_URL` aponta para
`localhost`. Além disso, o GitHub Pages usa HTTPS e navegadores bloqueiam requisições HTTP
partindo de páginas HTTPS (*mixed content*).

Para uma demonstração pública completa seria necessário publicar a API em um serviço com
HTTPS e atualizar a constante `API_URL`. (EM BREVE)

```text
https://lxzcunha.github.io/Front-End-eCommerce/
```

## Limitações conhecidas

- O formulário de contato ainda não tem endpoint correspondente na API; a validação é local.
- A API não possui autenticação: qualquer requisição pode alterar ou remover dados.
- O pagamento é simulado — não há integração com operadora de cartão ou provedor Pix.
- O carrinho continua no `localStorage`, então não é compartilhado entre dispositivos.