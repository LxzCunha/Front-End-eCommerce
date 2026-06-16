var formContato = document.querySelector("#form-contato");
var mensagensErro = document.querySelector("#mensagens-erro");
var mensagemSucesso = document.querySelector("#mensagem-sucesso");

function validarEmail(email) {
    return email.indexOf("@") > 0 && email.indexOf(".") > 0;
}

function somenteNumeros(texto) {
    return texto.replace(/\D/g, "");
}

function limparCamposInvalidos(form) {
    var campos = form.querySelectorAll("input, select, textarea");

    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("campo-invalido");
    }
}

function validarContato(form) {
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

    if (form.assunto.value === "") {
        erros.push("Selecione um assunto.");
        form.assunto.classList.add("campo-invalido");
    }

    if (form.mensagem.value.trim().length < 10) {
        erros.push("A mensagem deve ter pelo menos 10 caracteres.");
        form.mensagem.classList.add("campo-invalido");
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

formContato.addEventListener("submit", function (event) {
    event.preventDefault();

    var erros = validarContato(formContato);

    if (erros.length > 0) {
        exibirErros(erros);
        mensagemSucesso.classList.add("invisivel");
        return;
    }

    exibirErros([]);
    formContato.classList.add("invisivel");
    mensagemSucesso.classList.remove("invisivel");
});
