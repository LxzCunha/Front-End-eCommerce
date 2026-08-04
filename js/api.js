var API_URL = "http://localhost:8080/api";

function chamarApi(caminho, opcoes) {
    opcoes = opcoes || {};

    var config = {
        method: opcoes.method || "GET",
        headers: { "Content-Type": "application/json" }
    };

    if (opcoes.body) {
        config.body = JSON.stringify(opcoes.body);
    }

    return fetch(API_URL + caminho, config).then(function (resposta) {
        if (resposta.status === 204) {
            return null;
        }

        return resposta.json()
            .catch(function () { return null; })
            .then(function (dados) {
                if (!resposta.ok) {
                    var msg = (dados && dados.message) ? dados.message : "Erro " + resposta.status;

                    if (dados && dados.fieldErrors) {
                        var detalhes = [];
                        for (var campo in dados.fieldErrors) {
                            detalhes.push(dados.fieldErrors[campo]);
                        }
                        if (detalhes.length > 0) {
                            msg = msg + " (" + detalhes.join(", ") + ")";
                        }
                    }
                    throw new Error(msg);
                }
                return dados;
            });
    });
}