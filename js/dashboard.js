// Para mostrar o nome do usuário autenticado e deixar a variável global
let usuario = null;

const usuarioString = localStorage.getItem("usuarioAutenticado");
if (usuarioString) {
    usuario = JSON.parse(usuarioString); //transforma em objeto
    document.getElementById("usuarioNome").innerText = usuario.nome;
    //console.log(usuario);
}

function sair() {
    localStorage.removeItem("usuarioAutenticado");

    alert("Saída realizada com sucesso.");

    window.location.href = "inicio.html";
}

$(document).ready(function () {
    carregarDashboard();
});

let usuariosEmpresa = [];
let mapaUsuarios = {};

async function carregarDashboard() {
    await carregarUsuariosEmpresa();

    const resposta = await fetch("http://localhost:8080/api/lancamentos");
    const todosLancamentos = await resposta.json();

    const idsUsuariosEmpresa = usuariosEmpresa.map(u => u.id);

    const lancamentosEmpresa = todosLancamentos.filter(
        l => idsUsuariosEmpresa.includes(l.idUsuario)
    );

    preencherTabela(lancamentosEmpresa);
}

async function carregarUsuariosEmpresa() {
    const resposta = await fetch("http://localhost:8080/api/usuarios");
    const todos = await resposta.json();

    usuariosEmpresa = todos.filter(u => u.idEmpresa === usuario.idEmpresa);

    // cria mapa: idUsuario -> nome
    usuariosEmpresa.forEach(u => {mapaUsuarios[u.id] = u.nome;});
}

function preencherTabela(lancamentos) {
    const tbody = $("#tabela tbody");
    tbody.empty();

    lancamentos.forEach(lan => {
        tbody.append(`
            <tr>
                <td>${lan.descricao}</td>
                <td>${lan.valor}</td>
                <td>${mapaUsuarios[lan.idUsuario] || "Usuário não encontrado"}</td>
                <td>${lan.dataCompetencia}</td>
            </tr>
        `);
    });
}
