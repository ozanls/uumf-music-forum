// getRandomColor.js
// This function returns a random color from a list of hex options. For use in generating a random color for 'tags' in the frontend.
function getRandomColor() {
  const hexOptions = [
    "#E74C3C", // Red
    "#D35400", // Orange
    "#FFA600", // Yellow
    "#27AE60", // Green
    "#00ABAB", // Teal
    "#2980B9", // Blue
    "#9B59B6", // Purple
    "#EE81EE", // Pink
  ];
  const randomHex = Math.floor(Math.random() * hexOptions.length);
  let color = hexOptions[randomHex];
  return color;
}

module.exports = getRandomColor;
