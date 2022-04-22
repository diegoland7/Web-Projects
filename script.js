/*
Melhorias no cálculo: Sistema do BCB retorna a cotação do dia somente após as 18:00, em finais de semana e segunda-feiras é utilizada a cotação de sexta-feira (última cotação)
*/

function cotacaoHoje() {
	// Obtém a data/hora atual
	var data = new Date();
	// Guarda cada pedaço em uma variável
	var dia = data.getDate(); // 1-31
	var dia_sem = data.getDay(); // 0-6 (zero=domingo)
	var mes = data.getMonth(); // 0-11 (zero=janeiro)
	var ano2 = data.getYear(); // 2 dígitos
	var ano4 = data.getFullYear(); // 4 dígitos
	var hora = data.getHours(); // 0-23
	var min = data.getMinutes(); // 0-59
	var seg = data.getSeconds(); // 0-59
	var mseg = data.getMilliseconds(); // 0-999
	var tz = data.getTimezoneOffset(); // em minutos
	console.log("Hora atual: " + data.getHours());
	var horaTemp = data.getHours();
	// Formata a data e a hora (note o mês + 1)
	console.log("Dia atual da semana: " + dia_sem);
	//Domingo:
	if (dia_sem == 0) {
		var diaTemp = dia - 2;
		var str_data = dia + "/" + (mes + 1) + "/" + ano4;
		var str_hora = hora + ":" + min + ":" + seg;
		var str_data2 = mes + 1 + "-" + diaTemp + "-" + ano4;
	} // Segunda-feira:
	else if (dia_sem == 1) {
		if (horaTemp >= 18) {
			var str_data = dia + "/" + (mes + 1) + "/" + ano4;
			var str_hora = hora + ":" + min + ":" + seg;
			var str_data2 = mes + 1 + "-" + dia + "-" + ano4;
		} else {
			var diaTemp = dia - 3;
			var str_data = dia + "/" + (mes + 1) + "/" + ano4;
			var str_hora = hora + ":" + min + ":" + seg;
			var str_data2 = mes + 1 + "-" + diaTemp + "-" + ano4;
		}
	} // Sábado:
	else if (dia_sem == 6) {
		var diaTemp = dia - 1;
		var str_data = dia + "/" + (mes + 1) + "/" + ano4;
		var str_hora = hora + ":" + min + ":" + seg;
		var str_data2 = mes + 1 + "-" + diaTemp + "-" + ano4;
	} //Demais dias da semana:
	else if (dia_sem >= 2 && dia_sem <= 5) {
		if (horaTemp >= 18) {
			var str_data = dia + "/" + (mes + 1) + "/" + ano4;
			var str_hora = hora + ":" + min + ":" + seg;
			var str_data2 = mes + 1 + "-" + dia + "-" + ano4;
		} else {
			var diaTemp = dia - 1;
			var str_data = dia + "/" + (mes + 1) + "/" + ano4;
			var str_hora = hora + ":" + min + ":" + seg;
			var str_data2 = mes + 1 + "-" + diaTemp + "-" + ano4;
		}
	}
	console.log("Dia aplicado na cotação: " + str_data2);
	var url =
		"https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='" +
		str_data2.toString() +
		"'&$format=json";
	console.log("URL: " + url);
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function () {
		if (request.readyState == 4 && request.status == 200) {
			var resposta = JSON.parse(request.responseText);
			var valores = resposta.value[0];
			var cotacaoCompra2 = parseFloat(valores.cotacaoCompra);
			console.log("Cotacao atual do Dólar pelo BCB (R$): " + cotacaoCompra2);
			Converter(cotacaoCompra2);
		}
	};
	request.onerror = function () {
		console.log("Erro:" + request);
	};
	request.send();
}

function Converter(cotacaoCompra3) {
	var valorElemento = document.getElementById("valor"); //"valor" é o id do elemento no HTML
	var valor = valorElemento.value; //Valor é extraído, mas ainda em formato de texto
	var valorConvertido = parseFloat(valor); //Conversão do valor em Float
	var result = valor / cotacaoCompra3;
	var result2 = result.toFixed(2);
	var elementoValorConvertido = document.getElementById("valorConvertido");
	var valorConvertido = "Valor em Dólar: $ " + result2;
	var elementoValorCotacao = document.getElementById("valorCotacao");
	var valorCotacao = "Última cotação: $ " + cotacaoCompra3;

	elementoValorConvertido.innerHTML = valorConvertido; //Insere valor no elemento do HTML
	elementoValorCotacao.innerHTML = valorCotacao;
}
