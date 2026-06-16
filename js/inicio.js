$(document).ready(function(){
    if (localStorage.usuarioAutenticado) {
        localStorage.removeItem('usuarioAutenticado');
    }
    
    $('#cpf').mask('999.999.999-99');
})


async function autenticar() {
    //verifica se o formulário atende as regras de validação do jQuery Validation.
    if ($("#formulario").valid()) {

        let usuario = new Object();
        usuario.cpf = $("#cpf").val();
        usuario.senha = $("#senha").val();

        try {
            let resposta = await fetch("http://localhost:8080/api/usuarios/autenticar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!resposta.ok) {
                alert("CPF ou senha inválidos.");
            }else{
                let retorno = await resposta.json();
                localStorage.setItem('usuarioAutenticado', JSON.stringify(retorno));
                alert("Usuário autenticado com sucesso.");
                window.location.href = "menu.html";
            }

        } catch (erro) {
            console.log(erro)
        }    
    }
}

$("#formulario").validate(
    {
        rules: {
            cpf: {
                required: true,
                minlength: 14,
                maxlength: 14
            },
            senha: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            cpf: {
                required: "Campo obrigatório",
                minlength: "CPF deve ter 14 caracteres",
                maxlength: "CPF deve ter 14 caracteres"                
            },
            senha: {
                required: "Campo obrigatório",
                minlength: "A senha deve ter no mínimo 3 caracteres"
            }
        }
    }
);
