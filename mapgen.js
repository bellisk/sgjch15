var dreamerTypes = [
    {
        'type': typeMap['mountain-dreamer'],
        'biome': [
            0.2,
            typeMap['rock'],
            0.1,
            typeMap['angerbush'],
            0.05,
            typeMap['geysir'],
            0.02,
            typeMap['hole'],
            0.01,
            typeMap['obsidian'],
            100,
            typeMap['grass']
        ]
    },
    {
        'type': typeMap['skull-dreamer'],
        'biome': [
            0.3,
            typeMap['boneyard'],
            0.2,
            typeMap['hole'],
            0.1,
            typeMap['desert'],
            100,
            typeMap['grass']
        ]
    },
    {
        'type': typeMap['vine-dreamer'],
        'biome': [
            0.6,
            typeMap['vines'],
            0.1,
            typeMap['tree'],
            0.02,
            typeMap['hole'],
            100,
            typeMap['grass']
        ]
    },
];

var tribeTypes = [
    {
        'image': 'bat',
        'creature': 'bat',
        'dreamer': dreamerTypes[0],
        'buildings': ['hut', 'hut', 'hut', 'brewer', 'candlemaker', 'kitchen', 'meeting-hall', 'temple'].map(function(n) { return typeMap[n]; })
    },
    {
        'image': 'star-nosed-mole',
        'creature': 'star-nosed-mole',
        'dreamer': dreamerTypes[1],
        'buildings': ['hut', 'hut', 'hut', 'kitchen', 'meeting-hall', 'temple'].map(function(n) { return typeMap[n]; })
    },
    {
        'image': 'bower-bird',
        'creature': 'bower-bird',
        'dreamer': dreamerTypes[2],
        'buildings': ['hut', 'hut', 'hut', 'bower', 'bower', 'bower', 'kitchen', 'meeting-hall', 'temple', 'weaver', 'weaponsmith'].map(function(n) { return typeMap[n]; })
    }
];

function mapgen(w) {
    var sz = w._map.length;
    var grid = new Array(sz);
    for (var i = 0; i < sz; i++) {
        grid[i] = new Array(sz);
    }
    
    // Water and land
    var water = typeMap['water'];
    var desert = typeMap['desert'];
    for (var y = 0; y < sz; y++) { for (var x = 0; x < sz; x++) {
        var tp = (y == 0 || y == sz - 1 || x == 0 || x == sz - 1) ? water : desert;
        grid[y][x] = tp;
    }}
    
    for (var lp = 0; lp < 5; lp++) {
        for (var y = 0; y < sz; y++) { for (var x = 0; x < sz; x++) {
            if (grid[y][x] == water) {
                var rd = randdir();
                var x2 = x + rd[0];
                var y2 = y + rd[1];
                if (x2 >= 0 && x2 < sz && y2 >= 0 && y2 < sz) {
                    grid[y2][x2] = water;
                }
            }
        }}
    }
    
    // Islands
    for (var ww = 0; ww < sz * sz / 300; ww++) {
        var x = 0;
        var y = 0;
        if (Math.random() < 0.5) {
            x = Math.floor(Math.random() * sz);
        } else {
            y = Math.floor(Math.random() * sz);
        }
        var dx = 0.01 + Math.random() * 0.5;
        var dy = Math.random() - 0.5;
        while (Math.floor(x) < sz && Math.floor(y) >= 0 && Math.floor(y) < sz) {
            var ix = Math.floor(x);
            var iy = Math.floor(y);
            grid[iy][ix] = water;
            if (iy < sz - 1) {
                grid[iy + 1][ix] = water;
            }
            x += dx;
            y += dy;
        }
    }
    
    // Mountains
    rock = typeMap['rock'];
    for (var ww = 0; ww < sz * sz / 300; ww++) {
        var x = 0;
        var y = 0;
        if (Math.random() < 0.5) {
            x = Math.floor(Math.random() * sz);
        } else {
            y = Math.floor(Math.random() * sz);
        }
        var dx = Math.random() - 0.5;
        var dy = 0.01 + Math.random() * 0.5;
        while (Math.floor(x) < sz && Math.floor(x) >= 0 && Math.floor(y) >= 0 && Math.floor(y) < sz) {
            var ix = Math.floor(x);
            var iy = Math.floor(y);
            if (grid[iy][ix] == desert) {
                grid[iy][ix] = rock;
            }
            if (iy < sz - 1 && grid[iy + 1][ix] == desert) {
                grid[iy + 1][ix] = rock;
            }
            x += dx;
            y += dy;
        }
    }
    
    // Biomes
    for (var di = 0; di < dreamerTypes.length; di++) {
        var dt = dreamerTypes[di];
        var x = 0;
        var y = 0;
        var otherDreamersMinDist = 0;
        while (grid[y][x] != desert || otherDreamersMinDist < sz / 3) {
            y = randint(sz * 3 / 4) + Math.floor(sz / 8);
            x = randint(sz * 3 / 4) + Math.floor(sz / 8);
            otherDreamersMinDist = sz;
            for (var di2 = 0; di2 < di; di2++) {
                otherDreamersMinDist = Math.min(otherDreamersMinDist, Math.sqrt(
                    (x - dreamerTypes[di2].x) * (x - dreamerTypes[di2].x) + (y - dreamerTypes[di2].y) * (y - dreamerTypes[di2].y)
                ));
            }
        }
        grid[y][x] = dt.type;
        dt.x = x;
        dt.y = y;
    }
    
    var grass = typeMap['grass'];
    
    for (var y = 0; y < sz; y++) { for (var x = 0; x < sz; x++) {
        if (grid[y][x] != desert) { continue; }
        
        var dreamerBaseStrength = sz * 0.7;
        
        var dreamerStrengths = dreamerTypes.map(function(dt) {
            return dreamerBaseStrength / Math.pow((x - dt.x) * (x - dt.x) + (y - dt.y) * (y - dt.y), 1.3);
        });
        
        var k = Math.random();
        var i = 0;
        while (i < dreamerStrengths.length && dreamerStrengths[i] < k) {
            k -= dreamerStrengths[i];
            i++;
        }
        
        var tds = 0;
        dreamerStrengths.forEach(function(s) { tds += s; });
        
        var type = tds < 0.1 ? desert : grass;
        if (i < dreamerStrengths.length) {
            var roll = Math.random();
            var types = dreamerTypes[i].biome;
            for (var i = 0; i < types.length; i += 2) {
                if (roll <= types[i]) {
                    type = types[i + 1];
                    break;
                } else {
                    roll -= types[i];
                }
            }
        }
        grid[y][x] = type;
    }}
    
    // Villages
    tribeTypes.forEach(function (tt) {
        var gridSize = tt.buildings.length;
        var gx = 0;
        var gy = 0;
        var dreamerPresent = false;
        var grassCount = 0;
        while (!dreamerPresent || grassCount < tt.buildings.length + 5) {
            gx++;
            if (gx >= sz - gridSize) {
                gx = 0;
                gy++;
            }
            grassCount = 0;
            dreamerPresent = false;
            for (var dy = 0; dy < gridSize; dy++) { for (var dx = 0; dx < gridSize; dx++) {
                if (grid[gy + dy][gx + dx] == grass) {
                    grassCount++;
                }
                if (!tt.dreamer || grid[gy + dy][gx + dx] == tt.dreamer.type) {
                    dreamerPresent = true;
                }
            }}
        }
        tt.buildings.forEach(function (bt) {
            var tx = 0;
            var ty = 0;
            while (grid[ty][tx] != grass) {
                tx = gx + randint(gridSize);
                ty = gy + randint(gridSize);
            }
            grid[ty][tx] = bt;
        });
    });
    
    for (var y = 0; y < sz; y++) { for (var x = 0; x < sz; x++) {
        w.add(new Entity(grid[y][x], {'x': x, 'y': y}));
    }}
}

function plusOrMinusOne() {
    return randint(3) - 1;
}

function randint(n) {
    return Math.floor(Math.random() * n);
}

function randdir() {
    switch (randint(4)) {
        case 0: return [-1, 0];
        case 1: return [1, 0];
        case 2: return [0, -1];
        case 3: return [0, 1];
    }
}
