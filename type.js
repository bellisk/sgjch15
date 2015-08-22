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
