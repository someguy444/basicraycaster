$(function() {
    var screenWidth = 640;
    var screenHeight = 480;
    var texWidth = 64;
    var texHeight = 64;
    var mapWidth = 24;
    var mapHeight = 24;

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    var worldMap = [
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7]
        , [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 7]
        , [4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]
        , [4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]
        , [4, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 7]
        , [4, 0, 4, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 0, 7, 7, 7, 7, 7]
        , [4, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 7, 0, 0, 0, 7, 7, 7, 1]
        , [4, 0, 6, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0, 8]
        , [4, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 1]
        , [4, 0, 8, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0, 8]
        , [4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 7, 7, 7, 1]
        , [4, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 1]
        , [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
        , [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]
        , [6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
        , [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 6, 0, 6, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3]
        , [4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2]
        , [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 0, 0, 5, 0, 0, 2, 0, 0, 0, 2]
        , [4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2]
        , [4, 0, 6, 0, 6, 0, 0, 0, 0, 4, 6, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 2]
        , [4, 0, 0, 5, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2]
        , [4, 0, 6, 0, 6, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 5, 0, 0, 2, 0, 0, 0, 2]
        , [4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2]
        , [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3]
    ];

    var tex1 = [];
    for (x = 0; x < texWidth; x++) {
        for (y = 0; y < texHeight; y++) {
            if (x > ((texWidth / 2) - 10) && x > ((texWidth / 2) + 10)) {
                tex1[texWidth * y + x] = "rgb(0,0,0)";
            } else if (y < ((texHeight / 2) + 5) && y > ((texHeight / 2) - 5)) {
                tex1[texWidth * y + x] = "rgb(0,0,0)";
            } else {
                tex1[texWidth * y + x] = "rgb(0,255,0)";
            }
        }
    }

    var posX = 22.0;
    var posY = 11.5; //x and y start position
    var dirX = -1.0;
    var dirY = 0.0; //initial direction vector
    var planeX = 0.0;
    var planeY = 0.66; //the 2d raycaster version of camera plane

    var c = document.getElementById("myCanvas");
    var screen = c.getContext("2d");

    //start the main loop
    function mainLoop() {
        window.requestAnimationFrame(mainLoop);

        screen.clearRect(0, 0, screenWidth, screenHeight);
        screen.fillStyle = "grey";
        screen.fillRect(0, screenHeight / 2, screenWidth, screenHeight / 2);

        var oldTime = new Date();
        for (x = 0; x < screenWidth; x += 1) {
            //calculate ray position and direction
            var cameraX = 2 * x / parseFloat(screenWidth) - 1; //x-coordinate in camera space
            var rayPosX = posX;
            var rayPosY = posY;
            var rayDirX = dirX + planeX * cameraX;
            var rayDirY = dirY + planeY * cameraX;

            //which box of the map we're in
            var mapX = parseInt(rayPosX);
            var mapY = parseInt(rayPosY);

            //length of ray from current position to next x or y-side
            var sideDistX;
            var sideDistY;

            //length of ray from one x or y-side to next x or y-side
            var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
            var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
            var perpWallDist;

            //what direction to step in x or y-direction (either +1 or -1)
            var stepX;
            var stepY;

            var hit = 0; //was there a wall hit?
            var side; //was a NS or a EW wall hit?

            //calculate step and initial sideDist
            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (rayPosX - mapX) * deltaDistX;
            } else {
                stepX = 1;
                sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX;
            }
            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (rayPosY - mapY) * deltaDistY;
            } else {
                stepY = 1;
                sideDistY = (mapY + 1.0 - rayPosY) * deltaDistY;
            }
            //perform DDA
            while (hit == 0) {
                //jump to next map square, OR in x-direction, OR in y-direction
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                //Check if ray has hit a wall
                if (worldMap[mapX][mapY] > 0) hit = 1;
            }

            //Calculate distance of perpendicular ray (Euclidean distance will give fisheye effect!)
            if (side == 0) {
                perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
            } else {
                perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
            }

            //Calculate height of line to draw on screen
            var lineHeight = parseInt(screenHeight / perpWallDist);

            //calculate lowest and highest pixel to fill in current stripe
            var drawStart = -lineHeight / 2 + screenHeight / 2;
            if (drawStart < 0) drawStart = 0;
            var drawEnd = lineHeight / 2 + screenHeight / 2;
            if (drawEnd >= screenHeight) drawEnd = screenHeight - 1;


            //calculate value of wallX
            var wallX; //where exactly the wall was hit
            if (side == 0) {
                wallX = rayPosY + perpWallDist * rayDirY;
            } else {
                wallX = rayPosX + perpWallDist * rayDirX;
            }
            wallX -= Math.floor((wallX));

            var texX = parseInt(wallX * parseFloat(texWidth));
            if (side == 0 && rayDirX > 0) texX = texWidth - texX - 1;
            if (side == 1 && rayDirY < 0) texX = texWidth - texX - 1;


            var r = parseInt(clamp(255 * (lineHeight / 640), 0, 255));
            var g = parseInt(clamp(r * 2, 0, 255));
            screen.fillStyle = "rgba(" + r + "," + g + ",0,1)";
            screen.fillRect(x, drawStart, 1, drawEnd - drawStart);

        }

        time = new Date();

        var frameTime = (time.getTime() - oldTime.getTime()) / 1000.0; //frametime is the time this frame has taken, in seconds

        //speed modifiers
        var moveSpeed = (frameTime + 0.01) * 60.0; //the constant value is in squares/second
        var rotSpeed = (frameTime + 0.002) * 30.0; //the constant value is in radians/second

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '38') {
                if (worldMap[parseInt(posX + dirX * moveSpeed)][parseInt(posY)] == false) posX += dirX * moveSpeed;
                if (worldMap[parseInt(posX)][parseInt(posY + dirY * moveSpeed)] == false) posY += dirY * moveSpeed;
            } else if (e.keyCode == '40') {
                if (worldMap[parseInt(posX - dirX * moveSpeed)][parseInt(posY)] == false) posX -= dirX * moveSpeed;
                if (worldMap[parseInt(posX)][parseInt(posY - dirY * moveSpeed)] == false) posY -= dirY * moveSpeed;
            } else if (e.keyCode == '37') {
                //both camera direction and camera plane must be rotated
                var oldDirX = dirX;
                dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
                dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
                var oldPlaneX = planeX;
                planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
                planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
            } else if (e.keyCode == '39') {
                //both camera direction and camera plane must be rotated
                var oldDirX = dirX;
                dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
                dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
                var oldPlaneX = planeX;
                planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
                planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
            }
        }
    }

    mainLoop();
});


//window.setInterval(function(){ mainLoop(); }, 5);
