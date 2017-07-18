$(function(){
	$("body").on("click", ".points", function() {
    $(this).parent().find(".more").toggle();
  });

  var usersToShare = [];

  var selectedBoard;

  function getBoardId(self) {
    return $(self).parent().closest("div").data("id");
  }

  $("body").on("click", ".shareIcon", function(){
    $("#usersearchModal").fadeIn(300);
    $('#usersearchBox').focus();
    selectedBoard = getBoardId(this);
  });

   $(".closeModalIcon").click(function() {
      $('#usersearchBox').val('');
      $('#usersearchModal ul').hide();
      $('#usersearchModal ul').empty();
      $("#usersearchModal").fadeOut(300);
      usersToShare = [];
   });

   $("#usersearchBox").keypress(function(e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str) || e.which == 8) {
            return true;
        }
        e.preventDefault();
        return false;
   });
   $("#usersearchBox").on('keydown', function(e){
        if (e.which == 13) {
          var searchStr = $(this).val();
          $("#searchResults div").remove();
          if (searchStr) {
            $.post("/usersearch", {searchString: searchStr, boardId: selectedBoard}).done(function(result) {
              $.each(result, function(i, v){
                var tmp = "<div name='user' class='modalTextField'><input type='hidden' value='" + v.userId + "'/>" + v.username + "</div>";
                $("#searchResults").append(tmp);
              });
            });
          }
        }
    });

   $("body").on("click", "div[name='user']", function(){
   		var selectedUser = $(this);
      var selectedUserId = selectedUser.find("input").val();
      var li = "<li>" + selectedUser.text() + "</li>";
      $('#usersearchModal ul').show();
      if ($.inArray(selectedUserId, usersToShare) == -1){
        $('#usersearchModal ul').append(li);
        usersToShare.push(selectedUserId);
        selectedUser.remove();
      }
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
        var number = sketches.match(/\d+/);
        $("#mySk").text(sketches.replace(/\d+/, --number));
      });
   });

   $("body").on("click", ".deleteIcon", function() {
      selectedBoard = getBoardId(this);
      board = $(this).parent().closest("div");
      $('#dialogDelete').css('top', '100%');
      $('#dialogDelete').show();
      $('#dialogDelete').animate({
          top: '16em'
      }, 200);
      $('#deleteNo').focus();
   });

   var moreShown = false;
   $('#showMore').click(function() {
    if (moreShown == false) {
      $('#myBoards').css('height', 'auto');
      $('#showMore span').text('arrow_drop_up');
      moreShown = true;
    }
    else {
      $('#myBoards').css('height', '30em');
      $('#showMore span').text('arrow_drop_down');
      moreShown = false;
    }
   });

   $('body').on('click', '.infoIcon', function() {
    $('#title').val('');
    $('#last').val('');
    $('#createDate').val('');
    $('#infoModal').show();
    $('#infoModal').animate({
      top: '8em'
    }, 200);
    var boardId = $(this).parent().closest("div").data("id");
    $.get('/info', {boardId: boardId}).done(function(result) {
      $('#title').val(result.my.title);
      $('#last').val(new Date(result.my.last_change));
      $('#createDate').val(new Date(result.my.created_date));
      $('#sharedTo').empty();
      if (result.sh.length >= 1) {
        $('#sharedTo').html('<b>' + result.my.creator + ' hat dieses Board mit folgenden Nutzern geteilt:</b><br>');
      }
      for (var i = 0; i < result.sh.length; i++) {
        $('#sharedTo').append('- ' + result.sh[i].username + '<br>');
      }
      console.log('---');
    });
   });

   $('#close').click(function() {
    $('#infoModal').animate({
      top: '100%'
    }, 200, function() {
      $('#infoModal').hide();
    });
   })
});