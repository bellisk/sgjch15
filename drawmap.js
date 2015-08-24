var imgCache = {};

var bgLayers = ["water", "dirt", "grass", "desert"];

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
    bgLayers.forEach(function(bgLayer) {
        for (var y = -1; y < 700 / 53; y++) { for (var x = 0; x < 800 / 80; x++) {
            var worldX = x + xScroll;
            var worldY = y + yScroll;
            if (worldX < 0 || worldY < 0 || worldX >= world._map[0].length || worldY >= world._map.length) {
                continue;
            }
            var cell = world._map[worldY][worldX];
            cell.forEach(function(e) {
                var app = e.type.appearance;
                if (app.constructor == Array && app[1] == bgLayer) {
                    if (!e.get('imgVariant')) {
                        e.set('imgVariant', randint(2) + 1);
                    }
                    drawImgFromBottom(ctx, 'bg-' + bgLayer + '-' + (e.get('imgVariant') - 1), x * 80 - 8, y * 53 + 8);
                }
            });
        }}
    });
    for (var y = -1; y < 700 / 53; y++) { for (var x = 0; x < 800 / 80; x++) {
        var worldX = x + xScroll;
        var worldY = y + yScroll;
        if (worldX < 0 || worldY < 0 || worldX >= world._map[0].length || worldY >= world._map.length) {
            continue;
        }
        var cell = world._map[worldY][worldX];
        cell.forEach(function(e) {
            var app = e.type.appearance;
            if (app.constructor == Array) {
                if (app[0]) {
                    drawImgFromBottom(ctx, app[0], x * 80, y * 53);
                }
            } else {
                drawImgFromBottom(ctx, app, x * 80, y * 53);
            }
        });
    }}
}
