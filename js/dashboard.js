$(function(){
	var morehidden = true;
	$("body").on("click", ".points", function() {
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

  function getBoardId(self) {
    return $(self).parent().closest("div").data("id");
  }

  $("body").on("click", ".shareIcon", function(){
    $("#usersearchModal").show();
    selectedBoard = getBoardId(this);
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
        	$.post("/usersearch", {searchString: searchStr, boardId: selectedBoard}).done(function(result) {
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
      $('#usersearchModal ul').show();
      $('#usersearchModal ul').append(li);
      usersToShare.push(selectedUser.find("input").val());
      selectedUser.remove();
    });

   $("#btnShare").click(function() {
      var data = {
        users: usersToShare,
        boardId: selectedBoard
      };

      $.post('/share', {shareDetails: data}).done(function(result){
        $("#usersearchModal").hide();
        $("#modalContent div").remove();
        $("#usersearchModal ul li").remove();
        $("#usersearchBox").val('');
      });
   });

   var board;

   $("#dialogDelete button").click(function() {
      $("#dialogDelete").hide();
    });

   $("#deleteYes").click(function() {
      $.post('/deleteBoard', {boardId: selectedBoard}).done(function(success){
        $(board).remove();
        var sketches = $("#mySk").text();
        var number = sketches.match(/\d/);
        $("#mySk").text(sketches.replace(/\d/, --number));
      });
   });

   $("body").on("click", ".deleteIcon", function() {
      selectedBoard = getBoardId(this);
      board = $(this).parent().closest("div");
      $("#dialogDelete").show();
   });
});

