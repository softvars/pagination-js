(function() {
    var PUtil = {
        isArray:  Array.isArray, //TD: H2U
        isValidNum: function (obj, def) {
            return Number(obj) && obj > 0 ? obj : def;
        }
    };    
    
    var Pagination = function(o){
        if (!(this instanceof Pagination)){
            return new Pagination(o);
        }
        o = o || {};
        this.offset = 0;
        this.perPage = 10;
        this.lastPageSize = null;
        this.data = null;
        this.total = null;
        this.pageCount = null;
        this.current = 1;
        this.rangeLength = 11;
        this.rangeStaticPos = null;

        this.process = function(o){
            if(o) {
                this.data = PUtil.isArray(o.data)? o.data : this.data;
                this.perPage = PUtil.isValidNum(o.perPage, this.perPage);
                this.offset = PUtil.isValidNum(o.offset, this.offset);
                this.rangeLength = PUtil.isValidNum(o.rangeLength, this.rangeLength);
            }
            this.total = this.data && this.data.length > 0 ? this.data.length : 0;
            this.lastPageSize = this.total % this.perPage;
            this.pageCount = this.total ? Math.floor(this.total / this.perPage) + (this.lastPageSize ? 1 : 0) : 0;
            this.rangeStaticPos = Math.ceil(this.rangeLength / 2);
            this.current = 1;
        };

        this.hasPreviousPage = function(){
            return this.current > 1 ;
        };

        this.hasNextPage = function(){
            return this.current < this.pageCount;
        };
        this.getRange = function(start, stop){
            var len = Math.max((stop - start), 0);
            var range = Array(len);
            for (var i = 0; i < len; i++, start++) {
              range[i] = start;
            }
            return range;
        };
        this.getPageRange = function(){
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

        this.isTail = function(){
            return (this.current === this.pageCount) && this.lastPageSize;
        };

        this.getPreviousPage = function() {
            var toRet = [];
            if(this.hasPreviousPage()) {
                var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
                this.offset -= perPage;
                toRet = this.data.slice(this.offset - this.perPage, this.offset);
                this.current--;
            }
            return toRet;
        };

        this.getNextPage = function(){
            var toRet = [];
            if(this.hasNextPage()) {
                this.current++ ;
                var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
                toRet = this.data.slice(this.offset, this.offset + perPage);
                this.offset += perPage;
            }
            return toRet;
        };

        this.isValidPageNum = function(num){
            return num > 0 && num <= this.pageCount;
        };

        this.getPage = function(pageNumber){
            var toRet = [];
            pageNumber = Number(pageNumber);
            if (this.isValidPageNum(pageNumber)) {
                this.current = pageNumber; // TD: have to create prop update config object
                this.offset = (pageNumber-1) * this.perPage;
                var perPage = (this.isTail() ? this.lastPageSize : this.perPage);
                toRet = this.data.slice(this.offset, this.offset + perPage);
                this.offset += perPage;
            }
            return toRet;
        };        

        this.getPrevRangePage = function() {
            var toRet = [];
            if (this.hasPreviousPage()) {
                pageNumber = this.current - this.rangeLength ;
                pageNumber = pageNumber > 0 ? pageNumber : 1;
                toRet = this.getPage(pageNumber);
            }
            return toRet;
        };

        this.getNextRangePage = function(){
            var toRet = [];
            if(this.hasNextPage()) {
                pageNumber = this.current + this.rangeLength ;
                pageNumber = pageNumber > this.pageCount ? this.pageCount : pageNumber;
                toRet = this.getPage(pageNumber);
            }
            return toRet;
        };

        this.getFirstPage = function(){
            return this.getPage(1);
        };

        this.getLastPage = function(){
            return this.getPage(this.pageCount);
        };

        this.process(o);
    };
    this.Pagination = Pagination;
    this.PUtil = PUtil;
}.call(this));
