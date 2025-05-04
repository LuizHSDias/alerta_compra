function cadastrar() {
    let produtoId = document.getElementById("produto").value;
    let valor = document.getElementById("valor").value;
    let acao = document.getElementById("acao").value;
  
    if (!produtoId || !valor || !acao) {
      alert("Preencha todos os campos!");
      return;
    }
  
    let produtos = JSON.parse(localStorage.getItem("Produtos"));
    let produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));
  
    if (!produtoSelecionado) {
      alert("Produto inválido.");
      return;
    }
  
    let novoAlerta = {
      produto: produtoSelecionado.id,
      descricao: produtoSelecionado.descricao,
      valor: parseFloat(valor),
      acao: acao
    };
  
    let alertas = JSON.parse(localStorage.getItem("alertas"));
  
    if (alertas.some(a => a.produto === novoAlerta.produto)) {
      alert("Já existe um alerta para esse produto.");
      return;
    }
  
    alertas.push(novoAlerta);
    localStorage.setItem("alertas", JSON.stringify(alertas));
    exibirTabela();
    alert("Alerta cadastrado com sucesso!");
  }
  
  async function preencherProduto() {
    let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    let select = document.getElementById("produto");
    select.innerHTML = '<option value="" disabled selected>Selecione um Produto</option>';
  
    try {
      let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`);
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
  
      let alertas = JSON.parse(localStorage.getItem("alertas"));
  
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
    let alertas = JSON.parse(localStorage.getItem("alertas"));
    let compras = JSON.parse(localStorage.getItem("compras"));
    let alertasRestantes = [];
  
    for (let alerta of alertas) {
      try {
        let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.produto}`);
        if (!resposta.ok) continue;
  
        let produto = await resposta.json();
        let valorAtual = parseFloat(produto.valor);
  
        if (valorAtual <= alerta.valor) {
          if (alerta.acao === "notificar") {
            alert(`Produto "${produto.descricao}" atingiu o valor desejado: R$ ${valorAtual}`);
          } else if (alerta.acao === "comprar") {
            let novaCompra = {
              id: produto.id,
              descricao: produto.descricao,
              valor: valorAtual
            };
            compras.push(novaCompra);
            localStorage.setItem("compras", JSON.stringify(compras));
            alert(`Compra registrada: "${produto.descricao}" por R$ ${valorAtual}`);
          }
        } else {
          alertasRestantes.push(alerta);
        }
      } catch (error) {
        console.error("Erro ao verificar alerta:", error);
        alertasRestantes.push(alerta);
      }
    }
  
    localStorage.setItem("alertas", JSON.stringify(alertasRestantes));
    exibirTabela();
  }
  
  window.onload = function () {
    exibirTabela();
    preencherProduto();
    setInterval(verificarAlertas, 10000); // Verifica a cada 10 segundos
  };  