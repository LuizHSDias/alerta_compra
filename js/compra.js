function exibirCompras() {
  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));

  if (!usuario || !usuario.chave) {
    alert("Usuário não autenticado.");
    window.location.href = "login.html";
    return;
  }

  let compras = JSON.parse(localStorage.getItem("compras" + usuario.chave));

  let tbody = document.getElementById("tabela-compras");
  tbody.innerHTML = "";

  if (compras.length === 0) {
    let linha = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Nenhuma compra registrada.";
    td.classList.add("text-center");
    linha.appendChild(td);
    tbody.appendChild(linha);
    return;
  }

  compras.forEach(compra => {
    let linha = document.createElement("tr");

    let colunaDescricao = document.createElement("td");
    colunaDescricao.textContent = compra.descricao;
    linha.appendChild(colunaDescricao);

    let colunaValor = document.createElement("td");
    colunaValor.textContent = parseFloat(compra.valor).toFixed(2);
    linha.appendChild(colunaValor);

    tbody.appendChild(linha);
  });
}

window.onload = exibirCompras;  