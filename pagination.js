(function() {
function isExist(obj)
{
    return typeof obj !== "undefined";
}

function isEmpty(obj)
{
    return !isExist(obj) || obj === null || obj === '';
}

var PAGINATION = function(o){
    o = o || {};
    if (o instanceof PAGINATION) return o;
    if (!(this instanceof PAGINATION)){
        return new PAGINATION(o);
    }
    this.offset = o.offset && o.offset > 0 ? o.offset : 0;
    this.perPage = 10;
    this.lastPageSize = null;
    this.result = [];
    this.total = null;
    this.pageCount = null;
    this.current = 1;
    this.rangeLength = 11;
    this.rangeStaticPos = null;
};

PAGINATION.prototype.init = function(config){
    if(config) {
        if(config.result) {
            this.result =  config.result;
        }
        if(config.perPage) {
            this.perPage = config.perPage ;
        }
    }
    this.offset = 0;
    this.current = 1;
    this.rangeStaticPos = Math.ceil(this.rangeLength / 2);
    
    var isResultExist = this.result && this.result.length > 0;
    this.total = isResultExist ? this.result.length : 0;
    this.lastPageSize = this.total % this.perPage;
    this.pageCount = isResultExist ? Math.floor(this.total / this.perPage) + (this.lastPageSize ? 1 : 0) : 0;
};

PAGINATION.prototype.hasPreviousPage = function(){
    return this.current > 1 ;
};

PAGINATION.prototype.hasNextPage = function(){
    return this.current < this.pageCount;
};

PAGINATION.prototype.getRange = function(start, stop){
    var len = Math.max((stop - start), 0);
    var range = Array(len);
    for (var i = 0; i < len; i++) {
      range[i] = start;
    }
    return range;
};

PAGINATION.prototype.getPageRange = function(){
    var start = 1, stop = this.pageCount + 1;
    var isPagesNotWithInRangeCount = this.pageCount > this.rangeLength;

    if(isPagesNotWithInRangeCount) {
        if(this.rangeStaticPos)
        {
            var staticPos = this.rangeStaticPos;
            var staticPosRest = this.rangeLength - staticPos;
            var isBeforeStaticPos = this.current <= staticPos;

            start = isBeforeStaticPos ? 1 : (this.current < (this.pageCount - staticPosRest) ? (this.current - staticPos) + 1: this.pageCount - this.rangeLength);
            stop = (isBeforeStaticPos ? this.rangeLength : (this.current < (this.pageCount - staticPosRest) ? (this.current + staticPosRest): this.pageCount) ) + 1;
        }
        else
        {
            var isRangeEndWithInPageCount = (this.current + this.rangeLength) <  this.pageCount ;
            start = isRangeEndWithInPageCount ? this.current : (this.pageCount - this.rangeLength);
            stop = isRangeEndWithInPageCount ? (this.current + this.rangeLength) : this.pageCount+1;
        }
    }
    return this.getRange(start, stop);
};

PAGINATION.prototype.isTail = function(){
    return (this.current === this.pageCount) && this.lastPageSize;
};

PAGINATION.prototype.getPreviousPage = function(){
    var toRet = [];
    if(this.hasPreviousPage()) {
        var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
        this.offset -= perPage;
        toRet = this.result.slice(this.offset - this.perPage, this.offset);
        this.current--;
    }
    return toRet;
};

PAGINATION.prototype.getNextPage = function(){
    var toRet = [];
    if(this.hasNextPage()) {
        this.current++ ;
        var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
        toRet = this.result.slice(this.offset, this.offset + perPage);
        this.offset += perPage;
    }
    return toRet;
};

PAGINATION.prototype.getPage = function(pageNumber){
    var toRet = [];
    this.current = pageNumber;
    this.offset = (pageNumber-1) * this.perPage;
    var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
    if(pageNumber === 1) {
        toRet = this.result.slice(0, perPage);
    }
    else if (pageNumber > 1 && pageNumber <= this.pageCount) {
        toRet = this.result.slice(this.offset, this.offset + perPage);
    }
    this.offset += this.perPage;
    return toRet;
};
this.PAGINATION = PAGINATION;
}.call(this));
