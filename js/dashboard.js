$(function(){
	var morehidden = true;
	$("#more").click(function() {
		if (morehidden) {
			$(".more").show();
			morehidden = false;
		}
		else {
			$(".more").hide();
			morehidden = true;
		}
        
    });
});