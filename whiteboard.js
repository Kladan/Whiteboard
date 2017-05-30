/**
 * Created by Thorsten on 24.05.2017.
 */

(function($) {

    $.fn.whiteboard = function(options){

        var opts = $.extend({}, $.fn.whiteboard.defaults, options);
    }

    $.fn.whiteboard.defaults = {

        color: "blue",
        lineWidth: 5,
        lineJoin: "round"
    }
}(jQuery));

var mousePressed = false;
var lastX, lastY;
var ctx;


function InitThis() {
    ctx = document.getElementById('whiteboard').getContext("2d");

    ctx.canvas.style.width = '0%';
    ctx.canvas.style.height = '70%';
    ctx.canvas.style.left = '50%';
    setTimeout(function(){
        ctx.canvas.style.width = '80%';
        ctx.canvas.style.left = '0%';
    }, 0);
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;

    $('#whiteboard').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#whiteboard').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#whiteboard').mouseup(function (e) {
        mousePressed = false;
    });
    $('#whiteboard').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {

    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function tools() {
    if (document.getElementById('tools').style.left == '0em') {
        setTimeout(function() {
            document.getElementById('tools').style.left = '-5em';
        })
    }
    else {
        setTimeout(function() {
            document.getElementById('tools').style.left = '0em';
        })
    }
}