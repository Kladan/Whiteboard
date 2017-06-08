(function($) {
    var mousePressed = false;
    var lastX, lastY, context, opts;

    var brushImageArray = [["black", "brushBlack"], ["White", "brushWhite"], ["#EB401C", "brushRed"], ["#0AEC08", "brushGreen"], 
    ["#1937D6", "brushBlue"], ["E4FC5B", "brushYellow"]];

    $.fn.whiteboard = function(options){
        opts = $.extend({}, $.fn.whiteboard.defaults, options);
        context = document.getElementById("whiteboard").getContext("2d");
        context.canvas.style.width = "80%";
        context.canvas.width = context.canvas.offsetWidth;
        context.canvas.height = context.canvas.offsetHeight;

        // Zeichnen

        $(this).mousedown(function(e){
            mousePressed = true;
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);   // true als Funktion (Gerade zeichnen)
        });

        $(this).mousemove(function(e) {
            if (mousePressed) {
                if (useBrush) {
                    BrushDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                }
                else {
                    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                }
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
        lineJoin: "round",
        useBrush: false,
        brushImage: new Image()
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

    function BrushDraw(x, y, isDown) {

        if (!isDown) return;

        var currentPoint = {x: x, y: y};
        var lastPoint = {x: lastX, y: lastY};

        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);

        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - 25;
            y = lastPoint.Y + (Math.cos(angle) * i) - 25;
            context.drawImage(brushImg, x, y);
        }

        lastX = currentPoint.x;
        lastY = currentPoint.y;
    }

    /*Brush helper functionality*/

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + 
            Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function getBrushImage(color) {

        $.each(brushImageArray, function(index, val){
            if (val[0] == color)
                return val[1];            
        });
    }

    $.fn.whiteboard.clearArea = function() {
        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    // Wechsel Whiteboard <-> Tafel

    $.fn.whiteboard.changeBackground = function(color) {
        $("#whiteboard").css("background-color", color);
    }

    $.fn.whiteboard.setColor = function(color) {
        opts.color = color;
        useBrush = false;
    }

    $.fn.whiteboard.setBrushImage = function(color) {
        var imageName = getBrushImage(color);
        opts.brushImage.src = "/img/brush/" + imageName + ".svg";
        useBrush = true;
    }

}(jQuery));