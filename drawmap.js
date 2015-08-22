function drawMap(ctx, world, xScroll, yScroll) {
    c.fillStyle = '#333333';
    c.fillRect(0, 0, 800, 600);
    for (var y = 0; y < 600 / 25; y++) { for (var x = 0; x < 800 / 25; x++) {
        var worldX = x + xScroll;
        var worldY = y + yScroll;
        if (worldX < 0 || worldY < 0 || worldX >= world._map[0].length || worldY >= world._map.length) {
            continue;
        }
        var cell = world._map[worldY][worldX];
        cell.forEach(function(e) {
            c.fillStyle = e.type.appearance;
            c.fillRect(x * 25, y * 25, 24, 24);
        });
    }}
}
