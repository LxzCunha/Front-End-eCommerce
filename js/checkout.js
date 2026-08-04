var formPedido = document.querySelector("#form-pedido");
var mensagensErro = document.querySelector("#mensagens-erro");
var mensagemSucesso = document.querySelector("#mensagem-sucesso");
var clienteResumo = document.querySelector("#cliente-resumo");
var quantidadeResumo = document.querySelector("#quantidade-resumo");
var totalResumo = document.querySelector("#total-resumo");
var statusPedido = document.querySelector("#status-pedido");
var selectPagamento = document.querySelector("#pagamento");
var camposCartao = document.querySelector("#campos-cartao");
var camposPix = document.querySelector("#campos-pix");
var botaoFinalizar = document.querySelector("#btn-finalizar");

var pedidoCriadoId = null; 

function atualizarResumoCheckout() {
    var cliente = obterCliente();
    clienteResumo.textContent = cliente ? cliente.nome : "Nenhum cliente cadastrado";
    quantidadeResumo.textContent = contarItensCarrinho();
    totalResumo.textContent = formatarMoeda(calcularTotalCarrinho());
}

function somenteNumeros(texto) {
    return texto.replace(/\D/g, "");
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
    if (form.pagamento.value === "CARTAO") {
        if (somenteNumeros(form.numeroCartao.value).length !== 16) {
            erros.push("O número do cartão deve ter 16 dígitos.");
            form.numeroCartao.classList.add("campo-invalido");
        }
        if (!parseInt(form.parcelas.value, 10)) {
            erros.push("Informe o número de parcelas.");
            form.parcelas.classList.add("campo-invalido");
        }
    }
    if (form.pagamento.value === "PIX" && form.chavePix.value.trim() === "") {
        erros.push("Informe a chave Pix.");
        form.chavePix.classList.add("campo-invalido");
    }

    return erros;
}

function montarPagamento(form) {
    if (form.pagamento.value === "PIX") {
        return { tipo: "PIX", chave: form.chavePix.value.trim() };
    }
    return {
        tipo: "CARTAO",
        numeroCartao: somenteNumeros(form.numeroCartao.value),
        validade: form.validade.value.trim(),
        cvv: form.cvv.value.trim(),
        parcelas: parseInt(form.parcelas.value, 10)
    };
}

selectPagamento.addEventListener("change", function () {
    camposCartao.classList.toggle("invisivel", selectPagamento.value !== "CARTAO");
    camposPix.classList.toggle("invisivel", selectPagamento.value !== "PIX");
});

formPedido.addEventListener("submit", function (event) {
    event.preventDefault();

    var erros = validarPedido(formPedido);

    if (erros.length > 0) {
        exibirErros(erros);
        mensagemSucesso.classList.add("invisivel");
        return;
    }

    var cliente = obterCliente();
    var itens = obterCarrinho().map(function (item) {
        return { produtoId: item.id, quantidade: item.quantidade };
    });

    exibirErros([]);
    botaoFinalizar.disabled = true;
    botaoFinalizar.textContent = "Enviando...";

    var criacao = pedidoCriadoId
        ? Promise.resolve({ id: pedidoCriadoId })
        : chamarApi("/pedidos", { method: "POST", body: { clienteId: cliente.id, itens: itens } });

    criacao
        .then(function (pedido) {
            pedidoCriadoId = pedido.id;
            return chamarApi("/pedidos/" + pedido.id + "/pagamento", {
                method: "POST",
                body: montarPagamento(formPedido)
            });
        })
        .then(function (pedidoPago) {
            statusPedido.textContent = "Pedido #" + pedidoPago.id + " - " + pedidoPago.status;
            formPedido.classList.add("invisivel");
            mensagemSucesso.classList.remove("invisivel");
            limparCarrinho();
            pedidoCriadoId = null;
        })
        .catch(function (erro) {
            exibirErros([erro.message]);
            mensagemSucesso.classList.add("invisivel");
        })
        .then(function () {
            botaoFinalizar.disabled = false;
            botaoFinalizar.textContent = "Finalizar pedido";
        });
});

atualizarResumoCheckout();