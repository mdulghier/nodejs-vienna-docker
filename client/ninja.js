$(function() {
	$('#generate-name').click(function() {
		var style = $('#generators').val();
		$.get('/api/servernames?style=' + style, function(result) {
			$('#generated-name').html(result);
		});
	});

	$('#generators').change(function() {
		$('.style-hint').html('?style=' + $('#generators').val());
	});
});
