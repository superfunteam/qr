var qrcode = new QRCode(document.getElementById("qrcode"), {
	width: 2048,
	height: 2048,
	useSVG: true,
	colorDark: "#000000",
	colorLight: "#ffffff"
});

function makeCode () {		
	var elText = document.getElementById("text");
	
	if (!elText.value) {
		alert("Input a text");
		elText.focus();
		return;
	}
	
	qrcode.makeCode(elText.value);
}

makeCode();

$("#text").
	on("blur", function () {
		makeCode();
	}).
	on("keydown", function (e) {
		if (e.keyCode == 13) {
			makeCode();
		}
	});