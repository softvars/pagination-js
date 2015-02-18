(function() {
    function isValidNum(obj, def) {
        return toString.call(obj) === '[object Number]' && obj > 0 ? obj : def;
    }
    var isArray = Array.isArray || function(obj) {
        return  toString.call(obj) === '[object Array]';
    };
    var isString = function(obj) { // rev it
        return  toString.call(obj) === '[object String]';
    };
    var Pagination = function(o){
        o = o || {};
        if (!(this instanceof Pagination)){
            return new Pagination(o);
        }
        this.process(o);
    };
    Pagination.prototype.offset = 0;
    Pagination.prototype.perPage = 10;
    Pagination.prototype.lastPageSize = null;
    Pagination.prototype.data = null;
    Pagination.prototype.total = null;
    Pagination.prototype.pageCount = null;
    Pagination.prototype.current = 1;
    Pagination.prototype.rangeLength = 11;
    Pagination.prototype.rangeStaticPos = null;
    
    Pagination.prototype.process = function(o){
        if(o) {
            this.data = isArray(o.data)? o.data : this.data;
            this.perPage = isValidNum(o.perPage, this.perPage);
            this.offset = isValidNum(o.offset, this.offset);
            this.rangeLength = isValidNum(o.rangeLength, this.rangeLength);
        }
        this.total = this.data && this.data.length > 0 ? this.data.length : 0;
        this.lastPageSize = this.total % this.perPage;
        this.pageCount = this.total ? Math.floor(this.total / this.perPage) + (this.lastPageSize ? 1 : 0) : 0;
        this.rangeStaticPos = Math.ceil(this.rangeLength / 2);
        this.current = 1;
    };

    Pagination.prototype.hasPreviousPage = function(){
        return this.current > 1 ;
    };

    Pagination.prototype.hasNextPage = function(){
        return this.current < this.pageCount;
    };
    Pagination.prototype.getRange = function(start, stop){
        var len = Math.max((stop - start), 0);
        var range = Array(len);
        for (var i = 0; i < len; i++, start++) {
          range[i] = start;
        }
        return range;
    };
    Pagination.prototype.getPageRange = function(){
        var start = 1, stop = this.pageCount + 1;
        var isPagesNotWithInRangeCount = this.pageCount > this.rangeLength;
        if(isPagesNotWithInRangeCount) {
            if(this.rangeStaticPos) {
                var staticPos = this.rangeStaticPos;
                var staticPosRest = this.rangeLength - staticPos;
                var isBeforeStaticPos = this.current <= staticPos;
                start = isBeforeStaticPos ? 1 : (this.current < (this.pageCount - staticPosRest) ? 
                            (this.current - staticPos) + 1: this.pageCount - this.rangeLength);
                stop = (isBeforeStaticPos ? this.rangeLength : (this.current < (this.pageCount - staticPosRest) ? 
                            (this.current + staticPosRest): this.pageCount) ) + 1;
            } else {
                var isRangeEndWithInPageCount = (this.current + this.rangeLength) <  this.pageCount ;
                start = isRangeEndWithInPageCount ? this.current : (this.pageCount - this.rangeLength);
                stop = isRangeEndWithInPageCount ? (this.current + this.rangeLength) : this.pageCount+1;
            }
        }
        return this.getRange(start, stop);
    };

    Pagination.prototype.isTail = function(){
        return (this.current === this.pageCount) && this.lastPageSize;
    };

    Pagination.prototype.getPreviousPage = function() {
        var toRet = [];
        if(this.hasPreviousPage()) {
            var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
            this.offset -= perPage;
            toRet = this.data.slice(this.offset - this.perPage, this.offset);
            this.current--;
        }
        return toRet;
    };

    Pagination.prototype.getNextPage = function(){
        var toRet = [];
        if(this.hasNextPage()) {
            this.current++ ;
            var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
            toRet = this.data.slice(this.offset, this.offset + perPage);
            this.offset += perPage;
        }
        return toRet;
    };

    Pagination.prototype.getPage = function(pageNumber){
        var toRet = [];
        this.current = pageNumber;
        this.offset = (pageNumber-1) * this.perPage;
        var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
        if(pageNumber === 1) {
            toRet = this.data.slice(0, perPage);
        }
        else if (pageNumber > 1 && pageNumber <= this.pageCount) {
            toRet = this.data.slice(this.offset, this.offset + perPage);
        }
        this.offset += this.perPage;
        return toRet;
    };
    this.Pagination = Pagination;
}.call(this));
