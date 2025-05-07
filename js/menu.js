let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));

if (usuario) {
    document.getElementById("boasVindas").textContent = `Bem-vindo, ${usuario.nome}`;
} else {
    window.location.href = "index.html"; 
}

function alerta() {
    window.location.href = "alerta.html";
}

function compra() {
    window.location.href = "compra.html";
}

function sair(){
    window.location.href = "index.html";
}
