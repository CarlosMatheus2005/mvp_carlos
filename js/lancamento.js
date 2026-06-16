//Para mostrar o nome do usuário autenticado e deixar a variável global
let usuario = null;

const usuarioString = localStorage.getItem("usuarioAutenticado");
if (usuarioString) {
    usuario = JSON.parse(usuarioString); //transforma em objeto
    document.getElementById("usuarioNome").innerText = usuario.nome;
    //console.log(usuario);
}

let mapaCategorias = {};
let listaSubCategorias = [];

function sair() {
    localStorage.removeItem("usuarioAutenticado");

    alert("Saída realizada com sucesso.");

    window.location.href = "inicio.html";
}

$(document).ready(function () {
    carregarCategorias();
    carregarSubCategorias();

    $("#categoria").on("change", function () {
        const idCategoriaSelecionada = Number($(this).val());
        filtrarSubCategorias(idCategoriaSelecionada);
    });
});

async function carregarCategorias() {
    const resposta = await fetch("http://localhost:8080/api/categorias");
    const categorias = await resposta.json();

    //console.log("Categorias vindas da API:", categorias);

    categorias.forEach(cat => {mapaCategorias[cat.id] = cat.descricao;});

    preencherSelectCategorias(categorias);
}

function preencherSelectCategorias(categorias) {
    const select = $("#categoria");

    select.empty();
    select.append(`<option value="" disabled selected>Selecione uma Categoria</option>`);

    categorias.forEach(cat => {
        select.append(`<option value="${cat.id}">${cat.descricao}</option>`);
    });
}

async function carregarSubCategorias() {
    const resposta = await fetch("http://localhost:8080/api/subCategorias");
    const todas = await resposta.json();

    listaSubCategorias = todas.filter(sub => sub.idEmpresa === usuario.idEmpresa);
}

function filtrarSubCategorias(idCategoria) {
    const filtradas = listaSubCategorias.filter(sub => sub.idCategoria === idCategoria);

    preencherSelectSubCategorias(filtradas);
}

function preencherSelectSubCategorias(subCategorias) {
    const select = $("#subcategoria");

    select.empty();
    select.append(`<option value="" disabled selected>Selecione uma SubCategoria</option>`);

    subCategorias.forEach(sub => {
        select.append(`<option value="${sub.id}">${sub.descricao}</option>`);
    });
}

async function realizarLancamento(){
    const idSubCategoria = $("#subcategoria").val();
    const valor = $("#lancamento").val();
    const data = $("#dataLancamento").val();
    
    const nomeSubCategoria = $("#subcategoria option:selected").text();
    const descricao = "Lançamento de " + nomeSubCategoria;

    if (!idSubCategoria || !data || !valor) {
        alert("Preencha todos os campos");
        return;
    }

    const novoLancamento = {
        valor: valor,
        idSubCategoria: Number(idSubCategoria),
        idUsuario: usuario.id,
        descricao: descricao,
        dataCompetencia: data
    };

    await fetch("http://localhost:8080/api/lancamentos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoLancamento)
    });

    $("#subcategoria").val("");
    $("#lancamento").val("");
    $("#dataLancamento").val("");
    $("#categoria").val("");
    alert("Lancamento cadastrado com sucesso.");
}
