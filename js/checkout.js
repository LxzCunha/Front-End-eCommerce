var formPedido = document.querySelector("#form-pedido");
var mensagensErro = document.querySelector("#mensagens-erro");
var mensagemSucesso = document.querySelector("#mensagem-sucesso");
var clienteResumo = document.querySelector("#cliente-resumo");
var quantidadeResumo = document.querySelector("#quantidade-resumo");
var totalResumo = document.querySelector("#total-resumo");

function atualizarResumoCheckout() {
    var cliente = obterCliente();

    if (cliente) {
        clienteResumo.textContent = cliente.nome;
    } else {
        clienteResumo.textContent = "Nenhum cliente cadastrado";
    }

    quantidadeResumo.textContent = contarItensCarrinho();
    totalResumo.textContent = formatarMoeda(calcularTotalCarrinho());
}

function validarPedido(form) {
    var erros = [];

    limparCamposInvalidos(form);

    if (contarItensCarrinho() === 0) {
        erros.push("Adicione pelo menos um produto ao carrinho antes de finalizar o pedido.");
    }

    if (!clienteCadastrado()) {
        erros.push("Cadastre o cliente antes de finalizar o pedido.");
    }

    if (form.pagamento.value === "") {
        erros.push("Selecione uma forma de pagamento.");
        form.pagamento.classList.add("campo-invalido");
    }

    return erros;
}

function limparCamposInvalidos(form) {
    var campos = form.querySelectorAll("input, select");

    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("campo-invalido");
    }
}

function exibirErros(erros) {
    mensagensErro.innerHTML = "";

    if (erros.length === 0) {
        mensagensErro.style.display = "none";
        return;
    }

    for (var i = 0; i < erros.length; i++) {
        var li = document.createElement("li");
        li.textContent = erros[i];
        mensagensErro.appendChild(li);
    }

    mensagensErro.style.display = "block";
}

formPedido.addEventListener("submit", function (event) {
    event.preventDefault();

    var erros = validarPedido(formPedido);

    if (erros.length > 0) {
        exibirErros(erros);
        mensagemSucesso.classList.add("invisivel");
        return;
    }

    exibirErros([]);
    formPedido.classList.add("invisivel");
    mensagemSucesso.classList.remove("invisivel");
    limparCarrinho();
});

atualizarResumoCheckout();
