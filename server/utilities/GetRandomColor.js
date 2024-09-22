// function for setting a random color
function getRandomColor() {
	const hexOptions = [
		'#ff0000', '#ffa600', '#00ABAB', '#008000', '#0000ff', '#4a0080', '#ee81ee'
	];
	const randomHex = Math.floor(Math.random() * hexOptions.length)
	let color = hexOptions[randomHex];
	return color;
}

module.exports = getRandomColor;