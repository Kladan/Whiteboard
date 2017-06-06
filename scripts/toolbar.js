        var board = false;
        function bgboard() {
            if (board) {
                $.fn.whiteboard.changeBackground("white");
                board = false;
            }
            else {
                $.fn.whiteboard.changeBackground("#2f6f25");
                board = true;
            }
        }

        function colors(stift) {
            if ($('.colors').first().text() == stift) {
                $('.colors').text('');
                $('.colors').hide();
            }
            else {
                $('.colors').show();
                $('.colors').text(stift);
            }
        }


        $(".colors").on("click", function(){
            alert(this.data["color"]);
            $.fn.whiteboard.setColor(this.data["color"])
        });

        function setColor(color) {

        }

        function setLineWidth(lnWidth) {

        }