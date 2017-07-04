$(function(){
	var morehidden = true;
	$("body").on("click", ".points", function() {
<<<<<<< HEAD
=======
		console.log($(this));
>>>>>>> Thorsten
		if (morehidden) {
			$(this).parent().children().show();
			morehidden = false;
		}
		else {
			$(".more").hide();
			morehidden = true;
		}
  });

  var usersToShare = [];

    var selectedBoard;

   $(".shareIcon").click(function(){
        $("#usersearchModal").show();
        var boardId = $(this).parent().closest("div").data("id");
        selectedBoard = boardId;
   });

   $(".closeModalIcon").click(function() {
   		$("#usersearchModal").hide();
   });

   $("#usersearchBox").keypress(function(e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
            return false;
        });
   $("#usersearchBox").on('input', function(){
        var searchStr = $(this).val();
        $("#modalContent div").remove();
        if (!searchStr == "") {
        	$.post("/usersearch", {searchString: searchStr}).done(function(result) {
            $.each(result, function(i, v){
                var tmp = "<div name='user' class='modalTextField'><input type='hidden' value='" + v.userId + "'/>" + v.username + "</div>";
                    $("#modalContent").append(tmp);
            });
        });
        }
    });

   $("body").on("click", "div[name='user']", function(){
   		var selectedUser = $(this);
        var li = "<li>" + selectedUser.text() + "</li>";
        $('#usersearchModal ul').append(li);
        usersToShare.push({id: selectedUser.find("input").val(), name: selectedUser.text()});
        selectedUser.remove();
        //var shareInfo = {
        //    userId: selectedUser,
        //    boardId: null
        //}              
        //$.post('/share', {shareDetails: shareInfo}).done(function(success){
        //            //Nachricht das geshared wurde.
        //});
    });
});

