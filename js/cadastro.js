var formCadastro = document.querySelector("#form-cadastro");
var mensagensErro = document.querySelector("#mensagens-erro");
var mensagemSucesso = document.querySelector("#mensagem-sucesso");
var botaoSalvar = document.querySelector("#btn-salvar-cadastro");

function preencherCadastroSalvo() {
    var cliente = obterCliente();
    if (!cliente) { return; }

    var endereco = cliente.endereco || {};

    formCadastro.nome.value = cliente.nome || "";
    formCadastro.email.value = cliente.email || "";
    formCadastro.cpf.value = cliente.cpf || "";
    formCadastro.telefone.value = cliente.telefone || "";
    formCadastro.cidade.value = endereco.cidade || "";
    formCadastro.cep.value = endereco.cep || "";
    formCadastro.bairro.value = endereco.bairro || "";
    formCadastro.logradouro.value = endereco.logradouro || "";
    formCadastro.uf.value = endereco.uf || "";
}

function validarEmail(email) {
    return email.indexOf("@") > 0 && email.indexOf(".") > 0;
}

function somenteNumeros(texto) {
    return texto.replace(/\D/g, "");
}

function limparCamposInvalidos(form) {
    var campos = form.querySelectorAll("input");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("campo-invalido");
    }
}

function validarCadastro(form) {
    var erros = [];
    limparCamposInvalidos(form);

    if (form.nome.value.trim().length < 3) {
        erros.push("O nome completo deve ter pelo menos 3 caracteres.");
        form.nome.classList.add("campo-invalido");
    }
    if (!validarEmail(form.email.value)) {
        erros.push("Digite um e-mail válido.");
        form.email.classList.add("campo-invalido");
    }
    if (somenteNumeros(form.cpf.value).length !== 11) {
        erros.push("Digite um CPF válido com 11 números.");
        form.cpf.classList.add("campo-invalido");
    }
    if (somenteNumeros(form.telefone.value).length < 10) {
        erros.push("Digite um telefone válido com DDD.");
        form.telefone.classList.add("campo-invalido");
    }
    if (form.cidade.value.trim().length < 2) {
        erros.push("Digite a cidade.");
        form.cidade.classList.add("campo-invalido");
    }
    if (form.uf.value.trim().length !== 2) {
        erros.push("Digite a UF com 2 letras.");
        form.uf.classList.add("campo-invalido");
    }
    if (somenteNumeros(form.cep.value).length !== 8) {
        erros.push("Digite um CEP válido com 8 números.");
        form.cep.classList.add("campo-invalido");
    }

    return erros;
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

function montarClienteRequest(form) {
    return {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        cpf: somenteNumeros(form.cpf.value),
        telefone: form.telefone.value.trim(),
        endereco: {
            uf: form.uf.value.trim().toUpperCase(),
            cidade: form.cidade.value.trim(),
            bairro: form.bairro.value.trim(),
            logradouro: form.logradouro.value.trim(),
            cep: somenteNumeros(form.cep.value)
        }
    };
}

function sucessoCadastro(cliente) {
    salvarCliente(cliente);         
    exibirErros([]);
    mensagemSucesso.classList.remove("invisivel");
}

formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    var erros = validarCadastro(formCadastro);

    if (erros.length > 0) {
        exibirErros(erros);
        mensagemSucesso.classList.add("invisivel");
        return;
    }

    var corpo = montarClienteRequest(formCadastro);
    var salvo = obterCliente();
    botaoSalvar.disabled = true;

    var requisicao = (salvo && salvo.id)
        ? chamarApi("/clientes/" + salvo.id, { method: "PUT", body: corpo })
        : chamarApi("/clientes", { method: "POST", body: corpo });

    requisicao
        .then(sucessoCadastro)
        .catch(function (erro) {
            if (erro.message.indexOf("Ja existe um cliente") !== -1) {
                return chamarApi("/clientes/buscar?email=" + encodeURIComponent(corpo.email))
                    .then(sucessoCadastro);
            }
            if (erro.message.indexOf("Cliente nao encontrado") !== -1) {
                return chamarApi("/clientes", { method: "POST", body: corpo })
                    .then(sucessoCadastro);
            }
            throw erro;
        })
        .catch(function (erro) {
            exibirErros([erro.message]);
            mensagemSucesso.classList.add("invisivel");
        })
        .then(function () {
            botaoSalvar.disabled = false;
        });
});

preencherCadastroSalvo();