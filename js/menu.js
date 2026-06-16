// Para mostrar o nome do usuário autenticado
const usuarioString = localStorage.getItem("usuarioAutenticado");
if (usuarioString) {
    const usuario = JSON.parse(usuarioString);  // transforma em objeto
    document.getElementById("usuarioNome").innerText = usuario.nome;
}


function sair() {
    localStorage.removeItem("usuarioAutenticado");

    alert("Saída realizada com sucesso.");

    window.location.href = "inicio.html";
}