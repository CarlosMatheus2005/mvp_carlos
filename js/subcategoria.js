// Para mostrar o nome do usuário autenticado e deixar a variável global
let usuario = null;

const usuarioString = localStorage.getItem("usuarioAutenticado");
if (usuarioString) {
    usuario = JSON.parse(usuarioString); //transforma em objeto
    document.getElementById("usuarioNome").innerText = usuario.nome;
    //console.log(usuario);
}

let mapaCategorias = {};

function sair() {
    localStorage.removeItem("usuarioAutenticado");

    alert("Saída realizada com sucesso.");

    window.location.href = "inicio.html";
}

$(document).ready(function () {
    carregarCategorias();
    carregarSubCategorias();
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

    //console.log("Subcategorias vindas da API:", todas);

    const minhasSubcategorias = todas.filter(
        s => s.idEmpresa === usuario.idEmpresa
    );

    preencherTabela(minhasSubcategorias);
}

function preencherTabela(subcategorias) {
    const tbody = $("#tabela tbody");
    tbody.empty();

    subcategorias.forEach(sub => {
        const nomeCategoria = mapaCategorias[sub.idCategoria] || "Categoria não encontrada";

        tbody.append(`
            <tr>
                <td>${nomeCategoria}</td>
                <td>${sub.descricao}</td>
            </tr>
        `);
    });
}

async function adicionarSubcategoria() {
    const nome = $("#subcategoria").val();
    const idCategoria = $("#categoria").val();

    if (!nome || !idCategoria) {
        alert("Preencha todos os campos");
        return;
    }

    const novaSubcategoria = {
        descricao: nome,
        idCategoria: Number(idCategoria),
        idEmpresa: Number(usuario.idEmpresa)
    };

    await fetch("http://localhost:8080/api/subCategorias", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaSubcategoria)
    });

    alert("Subcategoria cadastrada com sucesso.");

    $("#subcategoria").val("");
    $("#categoria").val("");
    carregarSubCategorias();
}