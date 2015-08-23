var imgCache = {};

function drawImg(ctx, imgName, x, y) {
    if (!imgCache[imgName]) {
        var ldImg = new Image();
        ldImg.src = "img/" + imgName + ".png";
        imgCache[imgName] = ldImg;
    }
    ctx.drawImage(imgCache[imgName], x, y);
}

function drawImgFromBottom(ctx, imgName, x, bottom) {
    if (!imgCache[imgName]) {
        var ldImg = new Image();
        ldImg.src = "img/" + imgName + ".png";
        imgCache[imgName] = ldImg;
    }
    ctx.drawImage(imgCache[imgName], x, bottom - imgCache[imgName].height);
}

function drawMap(ctx, world, xScroll, yScroll) {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, 800, 600);
    for (var y = -1; y < 700 / 53; y++) { for (var x = 0; x < 800 / 80; x++) {
        var worldX = x + xScroll;
        var worldY = y + yScroll;
        if (worldX < 0 || worldY < 0 || worldX >= world._map[0].length || worldY >= world._map.length) {
            continue;
        }
        var cell = world._map[worldY][worldX];
        cell.forEach(function(e) {
            /*c.fillStyle = e.type.appearance;
            c.fillRect(x * 25, y * 25, 24, 24);*/
            drawImgFromBottom(ctx, e.type.appearance, x * 80, y * 53);
        });
    }}
}
