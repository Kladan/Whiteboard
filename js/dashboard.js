$(function(){
	var morehidden = true;
	$(".points").click(function() {
		if (morehidden) {
			$(this).parent().children().show();
			morehidden = false;
			console.log("Eingeblendet");
		}
		else {
			$(".more").hide();
			morehidden = true;
			console.log("Ausgeblendet");
		}
        
    });
});