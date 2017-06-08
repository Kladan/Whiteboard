(function($) {
    var mousePressed = false;
    var lastX, lastY, context, opts;

    var brushImageArray = [["black", "brushBlack"], ["white", "brushWhite"], ["#EB401C", "brushRed"], ["#0AEC08", "brushGreen"], 
    ["#1937D6", "brushBlue"], ["#E4FC5B", "brushYellow"]];

    $.fn.whiteboard = function(options){
        opts = $.extend({}, $.fn.whiteboard.defaults, options);
        context = document.getElementById("whiteboard").getContext("2d");
        context.canvas.style.width = "80%";
        context.canvas.width = context.canvas.offsetWidth;
        context.canvas.height = context.canvas.offsetHeight;

        // Zeichnen

        $(this).mousedown(function(e){
            mousePressed = true;
            setLastPosition(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
        });

        $(this).mousemove(function(e) {
            if (mousePressed) {
                if (opts.useBrush) {
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

    //Setzt die letzte Position

    function setLastPosition(x ,y){
        lastX = x; lastY = y;
    }

    // Zeichnet mit dem "Stift"

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

    //Zeichnet das ausgewählte Bild in das Canvas

    function BrushDraw(x, y, isDown) {

        if (!isDown) return;

        var currentPoint = {x: x, y: y};
        var lastPoint = {x: lastX, y: lastY};

        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);

        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - 25;
            y = lastPoint.y + (Math.cos(angle) * i) - 25;
            context.drawImage(opts.brushImage, x, y);
        }

        lastX = currentPoint.x;
        lastY = currentPoint.y;
    }

    /*Brush Hilfefunktionen*/

    //Satz des Pythagoras
    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + 
            Math.pow(point2.y - point1.y, 2));
    }

    //Berechnet den Winkel
    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    //Gibt den Bildnamen zurück 
    function getBrushImage(color) {
        var name = "";
        $.each(brushImageArray, function(index, val){
            if (val[0] == color) {
                name = val[1];            
            }
        });

        return name;
    }


    //Setzt die Canvas Fläche zurück
    $.fn.whiteboard.clearArea = function() {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    // Wechsel Whiteboard <-> Tafel

    $.fn.whiteboard.changeBackground = function(color) {
        $("#whiteboard").css("background-color", color);
    }

    // Setzt die Stiftfarbe

    $.fn.whiteboard.setColor = function(color) {
        opts.color = color;
        opts.useBrush = false;
    }

    // Gibt die aktuelle Farbe zurück

    $.fn.whiteboard.getCurrentColor = function() {
        return opts.color;
    }

    //Setzt das Bild

    $.fn.whiteboard.setBrushImage = function(color) {
        var imageName = getBrushImage(color);
        opts.brushImage.src = "img/brush/" + imageName + ".svg";
        opts.useBrush = true;
    }


    $.fn.whiteboard.getColorFromImage = function() {
        var str = opts.brushImage.src;
        var start = str.lastIndexOf("/") + 1;
        var color = "";
        str = str.split(".")[0].substr(start);

        $.each(brushImageArray, function(index, val){
            if (val[1] == str){
                color = val[0];
            }
        })

        return color;
    }

}(jQuery));