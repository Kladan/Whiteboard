(function($) {
    var mousePressed = false;
    var lastX, lastY, context, opts;

    var brushImageArray = [["black", "brushBlack"], ["white", "brushWhite"], ["#EB401C", "brushRed"], ["#0AEC08", "brushGreen"], 
    ["#1937D6", "brushBlue"], ["#E4FC5B", "brushYellow"]];

    var boardActionArray = [];

    $.fn.whiteboard = function(options){
        opts = $.extend({}, $.fn.whiteboard.defaults, options);
        context = document.getElementById("whiteboard").getContext("2d");
        context.canvas.style.width = "80%";
        context.canvas.style.height = context.canvas.style.width * 16 / 9;
        context.canvas.width = context.canvas.offsetWidth;
        context.canvas.height = context.canvas.offsetHeight + 8;

        // Zeichnen

        $(this).mousedown(function(e){
            mousePressed = true;
            /*if (opts.drawStraight){
                if (opts.useBrush) {
                   BrushDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                }
                else {
                    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                }
            }*/
            setLastPosition(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);

            if (opts.useBrush){
                boardActionArray.push({mouseX: lastX, mouseY: lastY, brushImg: opts.brushImage, mode: "brush", action: "begin"});
            }
            else {
                boardActionArray.push({mouseX: lastX, mouseY: lastY, size: opts.lineWidth, color: opts.color, mode: "draw", action: "begin"});
            }
        });

        $(this).mousemove(function(e) {
            if (mousePressed) {
                if (opts.useBrush) {
                    BrushDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                    boardActionArray.push({mouseX: lastX, mouseY: lastY, brushImg: opts.brushImage, mode: "brush"});
                }
                else {
                    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                    boardActionArray.push({mouseX: lastX, mouseY: lastY, size: opts.lineWidth, color: opts.color, mode: "draw"});
                }
            }
        });

        $(this).mouseup(function (e) {
            mousePressed = false;
            setLastPosition(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
            
            if (opts.useBrush){
                boardActionArray.push({mouseX: lastX, mouseY: lastY, brushImg: opts.brushImage, mode: "brush", action: "end"});
            }
            else {
                boardActionArray.push({mouseX: lastX, mouseY: lastY, size: opts.lineWidth, color: opts.color, mode: "draw", action: "end"});
            }
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
        drawStraight: false,
        brushImage: new Image(),
        loadedImageCache: null
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
            x = lastPoint.x + (Math.sin(angle) * i) - 12;
            y = lastPoint.y + (Math.cos(angle) * i) - 12;
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

    //Setzt das Whiteboard zurück +
    //zeichnet den Inhalt des boardActionArrays in das Whiteboard
    function redraw() {

        $.fn.whiteboard.clearArea();

        if (opts.loadedImageCache != null) {
            context.putImageData(opts.loadedImageCache, 0, 0);
        }

        var pointX, pointY;

        $.each(boardActionArray, function(index, val){
            if (val.mode === "draw") {
                //zeichne mit pinsel
                context.lineWidth = val.size;
                context.strokeStyle = val.color;
                context.lineJoin = opts.lineJoin;
                if (val.action === "begin"){
                    pointX = val.mouseX;
                    pointY = val.mouseY;
                }
                context.beginPath();
                context.moveTo(pointX, pointY);
                context.lineTo(val.mouseX, val.mouseY);
                pointX = val.mouseX;
                pointY = val.mouseY;
                context.closePath();
                context.stroke();
            }
            else {
                //zeichne mit brush image
                if (val.action === "begin"){
                    pointX = val.mouseX;
                    pointY = val.mouseY;
                }
                var distance = distanceBetween({x: pointX, y: pointY}, {x: val.mouseX, y: val.mouseY});
                var angle = angleBetween({x: pointX, y: pointY}, {x: val.mouseX, y: val.mouseY});
                for (var i = 0; i < distance; i++) {
                    x = pointX + (Math.sin(angle) * i) - 12;
                    y = pointY + (Math.cos(angle) * i) - 12;
                    context.drawImage(val.brushImg, x, y);
                }

                pointX = val.mouseX;
                pointY = val.mouseY;       
            }
        });
    }


    //Setzt die Canvas Fläche zurück
    $.fn.whiteboard.clearArea = function(clearUndo = false) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        if (clearUndo) {
            boardActionArray = [];
        }
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
        opts.brushImage = new Image();
        opts.brushImage.src = "../img/brush/" + imageName + ".svg";
        opts.useBrush = true;
    }

    //Gibt die Farbe des "Brushes" zurück

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

    $.fn.whiteboard.setLineWidth = function(width) {
        opts.lineWidth = width;
    }


    //Löscht eine im einen Schritt gezeichnete Linie
    //und ruft die "redraw" Methode auf.
    $.fn.whiteboard.undo = function() {
        for (var i = boardActionArray.length - 1; i > 0; i--) {

            if (boardActionArray[i].action === "begin") {
                boardActionArray.pop();
                break;
            }

            boardActionArray.pop();
        }

        redraw();
    }

    $.fn.whiteboard.drawStraight = function(val) {
        opts.drawStraight = val;
    }

    $.fn.whiteboard.cacheLoadedImage = function(imageData) {
        opts.loadedImageCache = imageData;
    }


}(jQuery));