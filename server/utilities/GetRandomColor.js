// function for setting a random color
function getRandomColor() {
	const hexOptions = [
		'#cc0000', '#cc1a00', '#cc3300', '#cc6600', '#cc8000',
		'#cc9900', '#b3b300', '#a6cc00', '#99cc00', '#66cc00',
		'#4dcc00', '#33cc00', '#00cc00', '#00cc4d', '#00cc66',
		'#00cccc', '#00b3e6', '#00a6cc', '#0080cc', '#0066cc',
		'#004ccc', '#000099', '#330099', '#660099', '#9900cc',
		'#b300cc', '#cc00cc', '#cc00b3', '#cc0099', '#cc007f'
	];
	const randomHex = Math.floor(Math.random() * hexOptions.length)
	let color = hexOptions[randomHex];
	return color;
}

module.exports = getRandomColor;