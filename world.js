function World(size) {
    this._map = new Array(size);

    for (var i = 0; i < size; i++) {
        this._map[i] = new Array(size);

        for (var j = 0; j < size; j++) {
            this._map[i][j] = new Array();
        }
    }

    this.entities = new Array();
    this.entityIndex = 0;
    this.playerX = -1;
    this.playerY = -1;
}

World.prototype.fill = function(types) {
    for (var y = 0; y < this._map.length; y++) { for (var x = 0; x < this._map.length; x++) {
        var type = null;
        var roll = Math.random();
        for (var i = 0; i < types.length; i += 2) {
            if (roll <= types[i]) {
                type = types[i + 1];
                break;
            } else {
                roll -= types[i];
            }
        }
        var e = new Entity(type, {'x': x, 'y': y});
        this._map[y][x].push(e);
        this.entities.push(e);
    }}
};

World.prototype.add = function(e) {
    this.entities.push(e);
    this._map[e.get('y')][e.get('x')].push(e);
};

World.prototype.updateCellMembership = function(x, y) {
    this._map[y][x].forEach(function(e) {
        if (e.get('x') != x || e.get('y') != y) {
            this._map[e.get('y')][e.get('x')].push(e);
        }
    }, this);
    
    this._map[y][x] = this._map[y][x].filter(function(e) {
        return e.get('x') == x && e.get('y') == y;
    });
};

World.prototype.advance = function () {
    if (this.playerX != -1) {
        this.updateCellMembership(this.playerX, this.playerY);
    }

    while (!this.entities[this.entityIndex].type.isPlayer) {
        var e = this.entities[this.entityIndex];
        var x = e.get('x');
        var y = e.get('y');
        e.type.tick(e, this);
        this.updateCellMembership(x, y);
        this.entityIndex = (this.entityIndex + 1) % this.entities.length;

        if (this.entityIndex == 0) {
            this.entities = this.entities.filter(function (e) {
                return !e.get('dead');
            });

            this._map = this._map.map(function (row) {
                return row.map(function (cell) {
                    return cell.filter(function (e) {
                        return !e.get('dead');
                    });
                });
            });
        }
    }

    var player = this.entities[this.entityIndex];
    this.playerX = player.get('x');
    this.playerY = player.get('y');    
    this.entityIndex = (this.entityIndex + 1) % this.entities.length;

    return player;
};

World.prototype.tileAt = function(x, y) {
    var cell = this._map[y][x];
    for (var i = 0; i < cell.length; i++) {
        if (cell[i].get('tile')) { return cell[i]; }
    }
    throw ("No tile at x=" + x + " y=" + y + ".");
};

World.prototype.getNeighbours = function (e) {
    var l = new Array();
    var ex = e.get('x');
    var ey = e.get('y');
    for (var dy = -1; dy < 2; dy++) { for (var dx = -1; dx < 2; dx++) {
        if (dy < 0 || dx < 0 || dy >= this._map.length || dx >= this._map[0].length) {
            continue;
        }
        this._map[ey + dy][ex + dx].forEach(function (e2) {
            if (!e2.get('dead')) { l.push(e2); }
        });
    }}
    return l;
};
