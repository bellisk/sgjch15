function Type(name, appearance, isPlayer, tick, respond) {
    this.name = name;
    this.appearance = appearance;
    this.isPlayer = isPlayer;
    this._tick = tick;
    this._respond = respond;
}

Type.prototype.tick = function (e, world) {
    return this._tick(e, world);
};

Type.prototype.respond = function (e, world, action) {
    return this._respond(e, world, action);
};