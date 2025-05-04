async function consultar(){

    let estadoCodigo = document.getElementById("estado").value;

    if(!estadoCodigo){
        alert("Selecione um Estado.");
        return;
    }

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoCodigo}/municipios`;

    try {
        const resposta = await fetch(url);
        const municipios = await resposta.json();

        let tbody = document.querySelector("#tabela tbody");
        tbody.innerHTML = "";

        municipios.forEach(municipio => {
          let linha = `<tr>
          <td>${municipio.id}</td>  
          <td>${municipio.nome}</td>
          </tr>`;

          tbody.innerHTML += linha;
        });

    } catch(erro) {
        alert("Erro ao buscar os municípios.");
        console.error(erro);
    }
}