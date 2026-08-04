var CHAVE_CARRINHO = "mecanstore-carrinho";
var CHAVE_CLIENTE = "mecanstore-cliente";

function obterCarrinho() {
    var dados = localStorage.getItem(CHAVE_CARRINHO);

    if (!dados) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function limparCarrinho() {
    localStorage.removeItem(CHAVE_CARRINHO);
    atualizarContadorCarrinho();
}

function obterCliente() {
    var dados = localStorage.getItem(CHAVE_CLIENTE);

    if (!dados) {
        return null;
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        return null;
    }
}

function salvarCliente(cliente) {
    localStorage.setItem(CHAVE_CLIENTE, JSON.stringify(cliente));
}

function clienteCadastrado() {
    var cliente = obterCliente();
    return cliente !== null && !!cliente.id && !!cliente.nome;
}

function adicionarProdutoAoCarrinho(produto, quantidade) {
    var carrinho = obterCarrinho();
    var produtoExistente = null;

    if (!quantidade || quantidade < 1) { quantidade = 1; }

    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === produto.id) { produtoExistente = carrinho[i]; }
    }

    if (produtoExistente) {
        produtoExistente.quantidade = produtoExistente.quantidade + quantidade;
    } else {
        carrinho.push({
            id: produto.id,
            codigo: produto.codigo,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: quantidade
        });
    }

    salvarCarrinho(carrinho);
}

function removerProdutoDoCarrinho(id) {
    var carrinho = obterCarrinho();
    var novoCarrinho = [];

    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id !== id) { novoCarrinho.push(carrinho[i]); }
    }

    salvarCarrinho(novoCarrinho);
}

function alterarQuantidadeProduto(id, alteracao) {
    var carrinho = obterCarrinho();

    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === id) {
            carrinho[i].quantidade = carrinho[i].quantidade + alteracao;
            if (carrinho[i].quantidade <= 0) { carrinho.splice(i, 1); }
            break;
        }
    }

    salvarCarrinho(carrinho);
}

function calcularTotalCarrinho() {
    var carrinho = obterCarrinho();
    var total = 0;

    for (var i = 0; i < carrinho.length; i++) {
        total = total + (carrinho[i].preco * carrinho[i].quantidade);
    }

    return total;
}

function contarItensCarrinho() {
    var carrinho = obterCarrinho();
    var quantidade = 0;

    for (var i = 0; i < carrinho.length; i++) {
        quantidade = quantidade + carrinho[i].quantidade;
    }

    return quantidade;
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarContadorCarrinho() {
    var contadores = document.querySelectorAll(".contador-carrinho");
    var quantidade = contarItensCarrinho();

    for (var i = 0; i < contadores.length; i++) {
        contadores[i].textContent = quantidade;
    }
}

function marcarMenuAtual() {
    var paginaAtual = window.location.pathname.split("/").pop();

    if (paginaAtual === "") {
        paginaAtual = "index.html";
    }

    var links = document.querySelectorAll(".menu-link");

    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");

        if (href === paginaAtual) {
            links[i].classList.add("ativo");
        }
    }
}

atualizarContadorCarrinho();
marcarMenuAtual();
