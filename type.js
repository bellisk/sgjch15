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

var types = [
    new Type("angerbush", "angerbush-2", false, {'tile': 1}),
    new Type("boneyard", "boneyard", false, {'tile': 1}),
    new Type("bower", "bower", false, {'tile': 1}),
    new Type("brewer", "brewer", false, {'tile': 1}),
    new Type("butcher", "butcher", false, {'tile': 1}),
    new Type("desert", "desert", false, {'tile': 1}),
    new Type("geysir", "geysir", false, {'tile': 1}),
    new Type("grass", "grass", false, {'tile': 1}),
    new Type("hole", "hole", false, {'tile': 1}),
    new Type("hut", "hut", false, {'tile': 1}),
    new Type("jeweller", "jeweller", false, {'tile': 1}),
    new Type("kitchen", "kitchen", false, {'tile': 1}),
    new Type("meeting-hall", "meeting-hall", false, {'tile': 1}),
    new Type("mountain-dreamer", "mountain-dreamer", false, {'tile': 1}),
    new Type("obsidian", "obsidian", false, {'tile': 1}, null, function () {
        return ['The obsidian is too sharp to climb', null];
    }),
    new Type("rock", "rock", false, {'tile': 1}, null, function (a, world) {
        if (a[1].get('rope')) {
            return null;
        }
        return ['You need a rope to climb this rock', null];
    }),
    new Type("skull-dreamer", "skull-dreamer", false, {'tile': 1}),
    new Type("temple", "temple", false, {'tile': 1}, function (e, world) {
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
                new ActionType('templeVisit', true, '', '', null, function () {
                    return dreams[e.get('dream') - 1];
                }),
                e,
                player[0]
            ];
        }
    }),
    new Type("tree", "tree-1", false, {'tile': 1}),
    new Type("vine-dreamer", "vine-dreamer", false, {'tile': 1}),
    new Type("vines", "vines", false, {'tile': 1}, null, function (a, world) {
        if (a[1].get('machete')) {
            return null;
        }
        return ['You need a machete to get through the vines', null];
    }),
    new Type("wall", "wall", false, {'tile': 1}),
    new Type("water", "water", false, {'tile': 1}, null, function () {
        return ['You can\'t cross the water', null];
    }),
    new Type("weaponsmith", "weaponsmith", false, {'tile': 1}),
    new Type("weaver", "weaver", false, {'tile': 1}),
    new Type("candlemaker", "candlemaker", false, {'tile': 1}),
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
                new ActionType('hello', true, '', '', null, function () {
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
                new ActionType('hello', true, '', '', null, function () {
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
                new ActionType('hello', true, '', '', null, function () {
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
