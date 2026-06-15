var tabelaCarrinho = document.querySelector("#itens-carrinho");
var campoTotal = document.querySelector("#valor-total");
var mensagemVazio = document.querySelector("#mensagem-carrinho-vazio");
var botaoLimpar = document.querySelector("#limpar-carrinho");
var botaoFinalizar = document.querySelector("#botao-finalizar-carrinho");

function atualizarTabelaInterface() {
    var carrinho = obterCarrinho();
    tabelaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        mensagemVazio.classList.remove("invisivel");
        botaoFinalizar.classList.add("invisivel");
    } else {
        mensagemVazio.classList.add("invisivel");
        botaoFinalizar.classList.remove("invisivel");
    }

    for (var i = 0; i < carrinho.length; i++) {
        var linha = criarLinhaCarrinho(carrinho[i]);
        tabelaCarrinho.appendChild(linha);
    }

    campoTotal.textContent = formatarMoeda(calcularTotalCarrinho());
}

function criarLinhaCarrinho(item) {
    var itemTr = document.createElement("tr");

    var nomeTd = document.createElement("td");
    var codigoTd = document.createElement("td");
    var quantidadeTd = document.createElement("td");
    var precoTd = document.createElement("td");
    var subtotalTd = document.createElement("td");
    var acoesTd = document.createElement("td");

    var produtoCarrinho = document.createElement("div");
    produtoCarrinho.classList.add("produto-carrinho");

    var imagemProduto = document.createElement("img");
    imagemProduto.src = item.imagem;
    imagemProduto.alt = item.nome;

    var nomeProduto = document.createElement("span");
    nomeProduto.textContent = item.nome;

    produtoCarrinho.appendChild(imagemProduto);
    produtoCarrinho.appendChild(nomeProduto);
    nomeTd.appendChild(produtoCarrinho);

    codigoTd.textContent = item.codigo;

    var botaoMenos = document.createElement("button");
    botaoMenos.classList.add("btn-quantidade");
    botaoMenos.textContent = "-";

    var quantidade = document.createElement("span");
    quantidade.textContent = " " + item.quantidade + " ";

    var botaoMais = document.createElement("button");
    botaoMais.classList.add("btn-quantidade");
    botaoMais.textContent = "+";

    quantidadeTd.appendChild(botaoMenos);
    quantidadeTd.appendChild(quantidade);
    quantidadeTd.appendChild(botaoMais);

    precoTd.textContent = formatarMoeda(item.preco);
    subtotalTd.textContent = formatarMoeda(item.preco * item.quantidade);
    precoTd.classList.add("preco-carrinho");
    subtotalTd.classList.add("preco-carrinho");

    var btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.classList.add("btn-remover");

    acoesTd.appendChild(btnRemover);

    itemTr.appendChild(nomeTd);
    itemTr.appendChild(codigoTd);
    itemTr.appendChild(quantidadeTd);
    itemTr.appendChild(precoTd);
    itemTr.appendChild(subtotalTd);
    itemTr.appendChild(acoesTd);

    botaoMenos.addEventListener("click", function () {
        alterarQuantidadeProduto(item.codigo, -1);
        atualizarTabelaInterface();
    });

    botaoMais.addEventListener("click", function () {
        alterarQuantidadeProduto(item.codigo, 1);
        atualizarTabelaInterface();
    });

    btnRemover.addEventListener("click", function () {
        removerProdutoDoCarrinho(item.codigo);
        atualizarTabelaInterface();
    });

    return itemTr;
}

botaoLimpar.addEventListener("click", function () {
    limparCarrinho();
    atualizarTabelaInterface();
});

atualizarTabelaInterface();
