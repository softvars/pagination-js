(function() {
    var Pagination_UI = function(o){
        if (!(this instanceof Pagination_UI)){
            return new Pagination_UI(o);
        }
        Pagination.call(this, o);
        o = o || {};
    };
    
    Pagination_UI.prototype = Object.create(Pagination.prototype);
    Pagination_UI.prototype.constructor = Pagination_UI;

    this.Pagination_UI = Pagination_UI;
}.call(this));
