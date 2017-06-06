(function($) {
    var mousePressed = false;
    var lastX, lastY, context, opts;

    $.fn.whiteboard = function(options){
        opts = $.extend({}, $.fn.whiteboard.defaults, options);
        context = document.getElementById("whiteboard").getContext("2d");
        context.canvas.style.width = "80%";
        context.canvas.width = context.canvas.offsetWidth;
        context.canvas.height = context.canvas.offsetHeight;

        $(this).mousedown(function(e){
            mousePressed = true;
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
        });

        $(this).mousemove(function(e) {
            if (mousePressed) {
                Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
            }
        });

        $(this).mouseup(function (e) {
        mousePressed = false;
        });

        $(this).mouseleave(function (e) {
           mousePressed = false;
        });
    }


    $.fn.whiteboard.defaults = {
        color: "black",
        lineWidth: 5,
        lineJoin: "round"
    }

    function Draw(x, y, isDown) {

        if (isDown) {
            context.beginPath();
            context.strokeStyle = opts.color;
            context.lineWidth = opts.lineWidth;
            context.lineJoin = opts.lineJoin;
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        }
        lastX = x; lastY = y;
    }

    $.fn.whiteboard.clearArea = function() {
        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    $.fn.whiteboard.changeBackground = function(color) {
        $("#whiteboard").css("background-color", color);
    }

    $.fn.whiteboard.setColor = function(color) {
        opts.color = color;
    }

}(jQuery));