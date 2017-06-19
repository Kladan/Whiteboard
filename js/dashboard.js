$(function(){
	var morehidden = true;
	$(".points").click(function() {
		if (morehidden) {
			$(this).parent().children().show();
			//$(".more").show();
			morehidden = false;
		}
		else {
			$(".more").hide();
			morehidden = true;
		}
        
    });
});