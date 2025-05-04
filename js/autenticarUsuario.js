async function autenticarUsuario(){

    var login = $("#login").val();
    var senha = $("#senha").val;


    try {
        if(login.length > 8 && senha.length > 5){
            var resposta = await fetch(`https://api-odinline.odiloncorrea.com/usuario/{login}/{senha}/autenticar`);
            var usuario = await resposta.json();
        }
    } catch (erro) {
        console.error('Erro na requisição: ', erro);

    }
}