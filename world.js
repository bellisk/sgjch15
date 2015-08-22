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
}

World.prototype.advance = function () {
    while (!this.entities[this.entityIndex].type.isPlayer) {
        this.entities[this.entityIndex].type.tick(this.entities[this.entityIndex], this);
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
    this.entityIndex = (this.entityIndex + 1) % this.entities.length;

    return player;
};

World.prototype.getNeighbours = function (e) {

};