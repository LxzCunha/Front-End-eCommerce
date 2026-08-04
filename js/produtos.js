var listaProdutos = document.querySelector("#lista-produtos");
var campoBusca = document.querySelector("#busca-produto");
var produtos = [];

function carregarProdutos() {
    listaProdutos.innerHTML = "";
    var carregando = document.createElement("p");
    carregando.classList.add("aviso-carrinho");
    carregando.textContent = "Carregando produtos...";
    listaProdutos.appendChild(carregando);

    chamarApi("/produtos")
        .then(function (dados) {
            produtos = dados;
            renderizarProdutos(produtos);
        })
        .catch(function (erro) {
            listaProdutos.innerHTML = "";
            var aviso = document.createElement("p");
            aviso.classList.add("aviso-carrinho");
            aviso.textContent = "Não foi possível carregar os produtos: " + erro.message;
            listaProdutos.appendChild(aviso);
        });
}

function renderizarProdutos(lista) {
    listaProdutos.innerHTML = "";

    if (lista.length === 0) {
        var aviso = document.createElement("p");
        aviso.classList.add("aviso-carrinho");
        aviso.textContent = "Nenhum produto encontrado para a busca informada.";
        listaProdutos.appendChild(aviso);
        return;
    }

    for (var i = 0; i < lista.length; i++) {
        listaProdutos.appendChild(criarCardProduto(lista[i]));
    }
}

function criarCardProduto(produto) {
    var card = document.createElement("article");
    card.classList.add("card-motor");

    var areaImagem = document.createElement("div");
    areaImagem.classList.add("area-imagem-produto");

    var imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;

    var valor = document.createElement("p");
    valor.classList.add("valor-produto");
    valor.textContent = formatarMoeda(produto.preco);

    var titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    var codigo = document.createElement("p");
    codigo.classList.add("codigo-produto");
    codigo.textContent = "Código " + produto.codigo;

    var quantidadeArea = document.createElement("div");
    quantidadeArea.classList.add("quantidade-card");

    var labelQuantidade = document.createElement("label");
    labelQuantidade.textContent = "Qtd";

    var campoQuantidade = document.createElement("input");
    campoQuantidade.type = "number";
    campoQuantidade.min = "1";
    campoQuantidade.max = produto.estoque;
    campoQuantidade.value = "1";

    var botaoAdicionar = document.createElement("button");
    botaoAdicionar.classList.add("botao-adicionar-card");
    botaoAdicionar.textContent = "Adicionar ao carrinho";

    if (produto.estoque === 0) {
        botaoAdicionar.disabled = true;
        botaoAdicionar.textContent = "Sem estoque";
        campoQuantidade.disabled = true;
    }

    areaImagem.appendChild(imagem);
    quantidadeArea.appendChild(labelQuantidade);
    quantidadeArea.appendChild(campoQuantidade);

    card.appendChild(areaImagem);
    card.appendChild(titulo);
    card.appendChild(codigo);
    card.appendChild(valor);
    card.appendChild(quantidadeArea);
    card.appendChild(botaoAdicionar);

    botaoAdicionar.addEventListener("click", function () {
        var quantidade = parseInt(campoQuantidade.value, 10);

        if (!quantidade || quantidade < 1) {
            quantidade = 1;
            campoQuantidade.value = "1";
        }
        if (quantidade > produto.estoque) {
            quantidade = produto.estoque;
            campoQuantidade.value = String(produto.estoque);
        }

        adicionarProdutoAoCarrinho(produto, quantidade);
        mostrarMensagemCatalogo(quantidade + " unidade(s) de " + produto.nome + " adicionada(s) ao carrinho.");
    });

    return card;
}

function filtrarProdutos() {
    var textoBusca = campoBusca.value.toLowerCase();
    var produtosFiltrados = [];

    for (var i = 0; i < produtos.length; i++) {
        var nome = produtos[i].nome.toLowerCase();
        var codigo = String(produtos[i].codigo).toLowerCase();

        if (nome.indexOf(textoBusca) !== -1 || codigo.indexOf(textoBusca) !== -1) {
            produtosFiltrados.push(produtos[i]);
        }
    }

    renderizarProdutos(produtosFiltrados);
}

function mostrarMensagemCatalogo(texto) {
    var mensagemAntiga = document.querySelector(".mensagem-catalogo");
    if (mensagemAntiga) { mensagemAntiga.remove(); }

    var mensagem = document.createElement("p");
    mensagem.classList.add("mensagem-catalogo");
    mensagem.textContent = texto;

    var container = document.querySelector(".container-produtos");
    container.insertBefore(mensagem, listaProdutos);

    setTimeout(function () { mensagem.classList.add("invisivel"); }, 2500);
}

campoBusca.addEventListener("input", filtrarProdutos);
carregarProdutos();