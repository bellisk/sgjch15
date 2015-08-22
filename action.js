function ActionType(name, blockable, srcChanges, trgChanges, valid) {
    this.name = name;
    this.blockable = blockable;
    this.srcChanges = srcChanges;
    this.trgChanges = trgChanges;
    this.valid = valid || function() {};
}

ActionType.prototype.isValid = function(src, trg, world) {
    return this._valid(src, trg, world);
};

function isActionValid(a, world) {
    return a[0].isValid(a[1], a[2], world);
}

function isActionAllowed(a, world) {
    return !a[0].blockable || a[2].type.respond(a, world);
}

function runAction(a, world) {
    return a[0].run(a[1], a[2], world);
}

function applyChanges(e, changes) {
    changes.split(",").forEach(function(ch) {
        ch = ch.trim();
        ch = ch.split(" ");
        if (ch.length == 1) {
            e.set(ch, 1);
        } else {
            var n = ch[0];
            var op = ch.length == 3 ? ch[1] : "=";
            var v = ch.length == 3 ? parseInt(ch[2]) : parseInt(ch[1]);
            switch (op) {
                case "=":
                    e.set(n, v);
                    break;
                case "+":
                    e.set(n, e.get(n) + v)
                    break;
                case "-":
                    e.set(n, e.get(n) - v)
                    break;
            }
        }
    });
}

ActionType.prototype.run = function(src, trg, world) {
    applyChanges(src, this.srcChanges);
    applyChanges(trg, this.trgChanges);
};

var moveActionTypes = [
    new ActionType("move", true, "y - 1", ""),
    new ActionType("move", true, "y + 1", ""),
    new ActionType("move", true, "x - 1", ""),
    new ActionType("move", true, "x + 1", ""),
];
