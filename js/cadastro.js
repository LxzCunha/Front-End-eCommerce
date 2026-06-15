var formCadastro = document.querySelector("#form-cadastro");
var mensagensErro = document.querySelector("#mensagens-erro");
var mensagemSucesso = document.querySelector("#mensagem-sucesso");

function preencherCadastroSalvo() {
    var cliente = obterCliente();

    if (!cliente) {
        return;
    }

    formCadastro.nome.value = cliente.nome;
    formCadastro.email.value = cliente.email;
    formCadastro.telefone.value = cliente.telefone;
    formCadastro.cidade.value = cliente.cidade;
    formCadastro.cep.value = cliente.cep;
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

    if (somenteNumeros(form.telefone.value).length < 10) {
        erros.push("Digite um telefone válido com DDD.");
        form.telefone.classList.add("campo-invalido");
    }

    if (form.cidade.value.trim().length < 2) {
        erros.push("Digite a cidade.");
        form.cidade.classList.add("campo-invalido");
    }

    if (somenteNumeros(form.cep.value).length !== 8) {
        erros.push("Digite um CEP válido com 8 números.");
        form.cep.classList.add("campo-invalido");
    }

    return erros;
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

formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    var erros = validarCadastro(formCadastro);

    if (erros.length > 0) {
        exibirErros(erros);
        mensagemSucesso.classList.add("invisivel");
        return;
    }

    salvarCliente({
        nome: formCadastro.nome.value.trim(),
        email: formCadastro.email.value.trim(),
        telefone: formCadastro.telefone.value.trim(),
        cidade: formCadastro.cidade.value.trim(),
        cep: formCadastro.cep.value.trim()
    });

    exibirErros([]);
    mensagemSucesso.classList.remove("invisivel");
});

preencherCadastroSalvo();
