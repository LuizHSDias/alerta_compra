function cadastrar() {
  let produtoId = document.getElementById("produto").value;
  let valor = document.getElementById("valor").value;
  let acao = document.getElementById("acao").value;

  if (!produtoId || !valor || !acao) {
    alert("Preencha todos os campos!");
    return;
  }

  let produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
  let produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

  if (!produtoSelecionado) {
    alert("Produto inválido.");
    return;
  }

  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
  let chaveAlertas = "alertas_" + usuario.chave;
  let alertas = JSON.parse(localStorage.getItem(chaveAlertas)) || [];

  if (alertas.some(a => a.produto === produtoSelecionado.id)) {
    alert("Já existe um alerta para esse produto.");
    return;
  }

  let novoAlerta = {
    produto: produtoSelecionado.id,
    descricao: produtoSelecionado.descricao,
    valor: parseFloat(valor),
    acao: acao
  };

  alertas.push(novoAlerta);
  localStorage.setItem(chaveAlertas, JSON.stringify(alertas));
  exibirTabela();
  alert("Alerta cadastrado com sucesso!");
}

async function preencherProduto() {
  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
  let select = document.getElementById("produto");
  select.innerHTML = '<option value="" disabled selected>Selecione um Produto</option>';

  try {
    let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`);
    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    let produtos = await resposta.json();
    localStorage.setItem("Produtos", JSON.stringify(produtos));

    produtos.forEach(produto => {
      let option = document.createElement("option");
      option.value = produto.id;
      option.textContent = produto.descricao;
      select.appendChild(option);
    });
  } catch (error) {
    alert("Erro ao carregar produtos.");
    console.error(error);
  }
}

function exibirTabela() {
  let tabela = document.getElementById("tabela");
  let tbody = tabela.querySelector("tbody");
  tbody.innerHTML = "";

  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
  let chaveAlertas = "alertas_" + usuario.chave;
  let alertas = JSON.parse(localStorage.getItem(chaveAlertas)) || [];

  alertas.forEach(alerta => {
    let linha = document.createElement("tr");

    let colunaProduto = document.createElement("td");
    colunaProduto.textContent = alerta.descricao;
    linha.appendChild(colunaProduto);

    let colunaValor = document.createElement("td");
    colunaValor.textContent = alerta.valor.toFixed(2);
    linha.appendChild(colunaValor);

    let colunaAcao = document.createElement("td");
    colunaAcao.textContent = alerta.acao;
    linha.appendChild(colunaAcao);

    tbody.appendChild(linha);
  });
}

async function verificarAlertas() {
  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
  if (!usuario || !usuario.chave) {
    console.error("Usuário não autenticado.");
    return;
  }

  let chaveAlertas = "alertas_" + usuario.chave;
  let chaveCompras = "compras" + usuario.chave;

  let alertas = JSON.parse(localStorage.getItem(chaveAlertas)) || [];
  let compras = JSON.parse(localStorage.getItem(chaveCompras)) || [];
  let alertasRestantes = [];
  let formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  for (let alerta of alertas) {
    try {
      let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.produto}`);
      if (!resposta.ok) continue;

      let produto = await resposta.json();
      let valorAtual = parseFloat(produto.valor);

      if (valorAtual <= alerta.valor) {
        if (alerta.acao === "notificar") {
          alert(`Produto "${produto.descricao}" atingiu o valor desejado: ${formatter.format(valorAtual)}`);
        } else if (alerta.acao === "comprar") {
          let novaCompra = {
            id: produto.id,
            descricao: produto.descricao,
            valor: valorAtual
          };
          compras.push(novaCompra);
          localStorage.setItem(chaveCompras, JSON.stringify(compras));
          alert(`Compra registrada: "${produto.descricao}" por ${formatter.format(valorAtual)}`);
        }
      } else {
        alertasRestantes.push(alerta);
      }
    } catch (error) {
      console.error("Erro ao verificar alerta:", error);
      alertasRestantes.push(alerta);
    }
  }

  localStorage.setItem(chaveAlertas, JSON.stringify(alertasRestantes));
  exibirTabela();
}

function salvarCompra(descricao, valor) {
  let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));

  if (!usuario || !usuario.chave) {
    alert("Usuário não autenticado.");
    return;
  }

  let chaveUsuario = "compras" + usuario.chave;
  let compras = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

  compras.push({ descricao: descricao, valor: valor });

  localStorage.setItem(chaveUsuario, JSON.stringify(compras));
}

window.onload = function () {
  exibirTabela();
  preencherProduto();
  setInterval(verificarAlertas, 10000); // Verifica a cada 10 segundos
};