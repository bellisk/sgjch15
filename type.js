function Type(name, appearance, isPlayer, defaults, tick, respond) {
    this.name = name;
    this.appearance = appearance;
    this.isPlayer = isPlayer;
    this.defaults = defaults;
    this._tick = tick || function() { return null; };
    this._respond = respond || function() { return true; };
}

Type.prototype.tick = function (e, world) {
    return this._tick(e, world);
};

Type.prototype.respond = function (action, world) {
    return this._respond(action, world);
};

var types = [
    new Type("grass", "green", false, {'tile': 1},
        function (e, world) {
            //var neighbours = world.getNeighbours(e);
            //var player = neighbours.filter(function (n) {
            //    return n.get('x') == e.get('x') && n.get('y') == e.get('y') && n.type.isPlayer;
            //});
            //if (player.length > 0) {
            //    player = player[0];
            //    return [new ActionType('move', true, '', 'x + 1'), e, player];
            //}
            return null;
        }
    ),
    new Type("rock", "gray", false, {'tile': 1},
        function(e, world) {
            if (Math.random() < 0.99) {
                return null;
            }
            var neighbours = world.getNeighbours(e);
            var grass = neighbours.filter(function (n) {
                return n.type.name == 'grass';
            });
            if (grass.length > 0) {
                grass = grass[0];
                return [new ActionType('petrify', false, '', 'type rock'), e, grass];
            }
            return null;
        }, function(action, world) {
            return false;//action[0].name != "move";
        }
    ),
    new Type("flower", "pink", false, {})
];

var typeMap = {};

types.forEach(function(t) {
    typeMap[t.name] = t;
});