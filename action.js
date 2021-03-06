function ActionType(name, showMessage, blockable, srcChanges, trgChanges, valid, describe) {
    this.name = name;
    this.showMessage = showMessage;
    this.blockable = blockable;
    this.srcChanges = srcChanges;
    this.trgChanges = trgChanges;
    this.valid = valid || function() { return true; };
    this.describe = describe || function () { return [name, null]; };
}

ActionType.prototype.isValid = function(src, trg, world) {
    return this._valid(src, trg, world);
};

function isActionValid(a, world) {
    return a[0].isValid(a[1], a[2], world);
}

function isActionAllowed(a, world) {
    return !a[0].showMessage || !a[2].type.respond(a, world);
}

function getActionResponse(a, world) {
    return a[2].type.respond(a, world);
}

function getActionDescription(a, world) {
    return a[0].describe(a, world);
}

function runAction(a, world) {
    return a[0].run(a[1], a[2], world);
}

function applyChanges(e, changes, world) {
    changes.split(",").forEach(function(ch) {
        ch = ch.trim();
        ch = ch.split(" ");
        if (ch.length == 1) {
            e.set(ch, 1);
        } else {
            var n = ch[0];
            if (n == 'type') {
                e.setType(typeMap[ch[1]]);
            } else if (n == 'new') {
                world.add(new Entity(typeMap[ch[1]], {'x': e.get('x'), 'y': e.get('y')}));
            } else {
                var op = ch.length == 3 ? ch[1] : "=";
                var v = ch.length == 3 ? ch[2] : ch[1];
                switch (op) {
                    case "=":
                        e.set(n, parseInt(v));
                        break;
                    case "+":
                        e.set(n, e.get(n) + parseInt(v))
                        break;
                    case "-":
                        e.set(n, e.get(n) - parseInt(v))
                        break;
                }
            }
        }
    });
}

ActionType.prototype.run = function(src, trg, world) {
    applyChanges(src, this.srcChanges, world);
    applyChanges(trg, this.trgChanges, world);
};

var moveActionTypes = [
    new ActionType("move", true, true, "y - 1, caveTraveled = 0", ""),
    new ActionType("move", true, true, "y + 1, caveTraveled = 0", ""),
    new ActionType("move", true, true, "x - 1, caveTraveled = 0", ""),
    new ActionType("move", true, true, "x + 1, caveTraveled = 0", ""),
];
