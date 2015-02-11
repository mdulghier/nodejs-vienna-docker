function random (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = function(array) {
	var randomNo = random(0, array.length - 1);
	var value = array[randomNo];
	return value;
};
