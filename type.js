function Type(name, appearance, isPlayer, defaults, tick, respond) {
    this.name = name;
    this.appearance = appearance;
    this.isPlayer = isPlayer;
    this.defaults = defaults;
    this._tick = tick || function() { return null; };
    this._respond = respond || function() { return null; };
}

Type.prototype.tick = function (e, world) {
    return this._tick(e, world);
};

Type.prototype.respond = function (action, world) {
    return this._respond(action, world);
};

var resources = [
    {'name': 'dream1'},
    {'name': 'dream2'},
    {'name': 'dream3'},
    {'name': 'dream4'},
    {'name': 'dream5'},
    {'name': 'dream6'},
    {'name': 'dream7'},
    {'name': 'dream8'},
    {'name': 'machete'},
    {'name': 'rope'},
    {'name': 'candle'}
];

var resourceMap = {};

resources.forEach(function(r) {
    resourceMap[r.name] = r;
});

var types = [
    new Type("angerbush", ["angerbush-2", "grass"], false, {'tile': 1}),
    new Type("boneyard", ["boneyard", "dirt"], false, {'tile': 1}),
    new Type("bower", ["bower", "grass"], false, {'tile': 1}),
    new Type("brewer", ["brewer", "grass"], false, {'tile': 1}),
    new Type("butcher", ["butcher", "grass"], false, {'tile': 1}),
    new Type("desert", ["desert", "desert"], false, {'tile': 1}),
    new Type("geysir", ["geysir", "grass"], false, {'tile': 1}),
    new Type("grass", ["grass", "grass"], false, {'tile': 1}),
    new Type("hole", ["hole", "dirt"], false, {'tile': 1}, function(e, world) {
        while (!e.get('tx')) {
            var cx = randint(world._map.length);
            var cy = randint(world._map.length);
            if (cx != e.get('x') || cy != e.get('y')) {
                var entities = world._map[cy][cx];
                var otherHole = entities.filter(function(e2) {
                    return e2.type.name == 'hole';
                });
                if (otherHole.length > 0) {
                    e.set('tx', cx);
                    e.set('ty', cy);
                    otherHole[0].set('tx', e.get('x'));
                    otherHole[0].set('ty', e.get('y'));
                }
            }
        }
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0 && !player[0].get('caveTraveled') && player[0].get('candle')) {
            return [
                new ActionType('travelThroughCaves', true, true, '', 'candle - 1, caveTraveled = 1, x = ' + e.get('tx') + ', y = ' + e.get('ty'), null, function () {
                    return ["You find a dark hole.\nTravel through it?", "large-hole"];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("hut", ["hut", "grass"], false, {'tile': 1}),
    new Type("jeweller", ["jeweller", "grass"], false, {'tile': 1}),
    new Type("kitchen", ["kitchen", "grass"], false, {'tile': 1}),
    new Type("meeting-hall", ["meeting-hall", "grass"], false, {'tile': 1}),
    new Type("mountain-dreamer", ["mountain-dreamer", "dirt"], false, {'tile': 1}),
    new Type("obsidian", ["obsidian", "dirt"], false, {'tile': 1}, null, function () {
        return ['The obsidian is too sharp to climb', null];
    }),
    new Type("rock", ["rock", "dirt"], false, {'tile': 1}, null, function (a, world) {
        if (a[1].get('rope')) {
            return null;
        }
        return ['You need a rope to climb this rock', null];
    }),
    new Type("skull-dreamer", ["skull-dreamer", "dirt"], false, {'tile': 1}),
    new Type("temple", ["temple", "grass"], false, {'tile': 1}, function (e, world) {
        if (!e.get('dream')) {
            e.set('dream', randint(dreams.length) + 1);
        }
        if (e.get('visitedTemple')) {
            return null;
        }
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0) {
            e.set('visitedTemple', 1);
            return [
                new ActionType('templeVisit', true, false, '', 'dream' + (e.get('dream')) + ' = 1', null, function () {
                    return dreams[e.get('dream') - 1];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("tree", ["tree-1", "grass"], false, {'tile': 1}),
    new Type("vine-dreamer", ["vine-dreamer", "dirt"], false, {'tile': 1}),
    new Type("vines", ["vines", "dirt"], false, {'tile': 1}, null, function (a, world) {
        if (a[1].get('machete')) {
            return null;
        }
        return ['You need a machete to get through the vines', null];
    }),
    new Type("wall", ["wall", "grass"], false, {'tile': 1}),
    new Type("water", [null, "water"], false, {'tile': 1}, null, function () {
        return ['You can\'t cross the water', null];
    }),
    new Type("weaponsmith", ["weaponsmith", "grass"], false, {'tile': 1}, function(e, world) {
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0 && !player[0].get('machete')) {
            return [
                new ActionType('giveMachete', true, false, '', 'machete = 1', null, function () {
                    return ["You visit a weaponsmith who\ngifts you a machete", "large-machete"];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("weaver", ["weaver", "grass"], false, {'tile': 1}, function(e, world) {
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0 && !player[0].get('rope')) {
            return [
                new ActionType('giveRope', true, false, '', 'rope = 1', null, function () {
                    return ["You visit a weaver who gifts you\na rope", "large-rope"];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("candlemaker", ["candlemaker", "grass"], false, {'tile': 1}, function(e, world) {
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0 && player[0].get('candle') < 5) {
            return [
                new ActionType('giveCandles', true, false, '', 'candle + 3', null, function () {
                    return ["You visit a candlemaker who gifts\nyou some candles", "large-candle"];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("bat", "native", false, {}, function (e, world) {
        if (e.get('saidHello')) {
            return null;
        }
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0) {
            e.set('saidHello', 1);
            return [
                new ActionType('hello', true, false, '', '', null, function () {
                    return ["You meet a local villager with the\nhead of a bat", "bat"]
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("star-nosed-mole", "native", false, {}, function (e, world) {
        if (e.get('saidHello')) {
            return null;
        }
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0) {
            e.set('saidHello', 1);
            return [
                new ActionType('hello', true, false, '', '', null, function () {
                    return ["You meet a local villager with the\nhead of a star-nosed mole", "star-nosed-mole"]
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("bower-bird", "native", false, {}, function (e, world) {
        if (e.get('saidHello')) {
            return null;
        }
        var neighbours = world.getNeighbours(e);
        var player = neighbours.filter(function(e2) {
            return e.get('x') == e2.get('x') && e.get('y') == e2.get('y') && e2.type.isPlayer;
        });
        if (player.length > 0) {
            e.set('saidHello', 1);
            return [
                new ActionType('hello', true, false, '', '', null, function () {
                    return ["You meet a local villager with the\nhead of a bower bird", "bower-bird"]
                }),
                e,
                player[0]
            ];
        }
    })
];

var typeMap = {};

types.forEach(function(t) {
    typeMap[t.name] = t;
});

var dreams = [
    ["A didactic donkey", "dream1"],
    ["Floating towards the sky", "dream2"],
    ["A dream of suffocation", "dream3"],
    ["A man made of multitudes", "dream4"],
    ["A dream of time and death", "dream5"],
    ["The servant of a squirrel", "dream6"],
    ["A bat and an elephant confer", "dream7"],
    ["A tired sphinx", "dream8"]
]
