function Entity(type, properties) {
    this.type = type;
    this.properties = $.extend({}, type.defaults || {}, properties || {});
}

Entity.prototype.get = function (name) {
    return this.properties[name] || 0;
};

Entity.prototype.set = function(name, value) {
    this.properties[name] = value;
};

