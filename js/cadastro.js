$(document).ready(function () {
    if (localStorage.usuarioAutenticado) {
        localStorage.removeItem('usuarioAutenticado');
    }

    $('#cpf').mask('999.999.999-99');
})


async  function cadastrar() {
    //verifica se o formulário atende as regras de validação do jQuery Validation.
    if ($("#formulario").valid()) {
        
        let usuario = new Object();
        usuario.nome = $("#nome").val();
        usuario.cpf = $("#cpf").val();
        usuario.email = $("#email").val();
        usuario.tipo = $("#tipo").val();
        usuario.senha = $("#senha").val();

        try {
            await fetch("http://54.233.183.126:8888/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });
   
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "inicio.html";

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao cadastrar o usuário.");
        }


    }
}

$("#formulario").validate({
    rules: {
        nome: {
            required: true
        },
        cpf: {
            required: true,
            minlength: 14,
            maxlength: 14,
            remote: {
                url: "http://54.233.183.126:8888/api/usuarios/exists",
                type: "GET",
                data: {
                    cpf: function () {
                        return $("#cpf").val(); 
                    }
                },
                dataFilter: function (response) {
                    // backend retorna true se CPF já existe → invalida
                    return response === "false"; // CPF ainda não existe → OK para cadastrar
                }
            }
        },
        senha: {
            required: true,
            minlength: 3
        },

        email: {
            required: true
        },

        tipo: {
            required: true
        }
    },
    messages: {
        nome: {
            required: "Campo obrigatório"
        },
        cpf: {
            required: "Campo obrigatório",
            minlength: "CPF deve ter 14 caracteres",
            maxlength: "CPF deve ter 14 caracteres",
            remote: "CPF já cadastrado"
        },
        senha: {
            required: "Campo obrigatório",
            minlength: "A senha deve ter no mínimo 3 caracteres"
        },

        email: {
            required: "Campo obrigatório"
        },

        tipo: {
            required: "Campo obrigatório"
        }
    }
});
