(function() {
    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var __ = {
        isArray: Array.isArray || function(obj) {
            return toString.call(obj) === '[object Array]';
        },
        has: function(obj, key) {
            return hasOwnProperty.call(obj, key);
        },
        isValidNum: function (obj, def) {
            return __.isNumber(obj) && obj > 0 ? obj : def;
        },
        keys: function (obj) {
          var result = [], prop;
          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }
          return result;
        },
        mergeIt: function(o, a) {
            if(__.isObject(o)) {
                var isKeyMap = __.isObject(a);
                b = __.isArray(a) ? a : (__.isString(a) ? [a] : ( isKeyMap ? __.keys(a) : __.keys(o)) );
                if(__.isArray(b)) {
                    for(i in b) {
                        var prop = b[i];
                        if(__.has(o, prop)) {
                            var value = o[prop];
                            var isValid = !isKeyMap ? true : ( __.isFunction(a[prop]) ? a[prop].call(this, value) : true);
                            if(isValid) {
                                this[prop] = __.isObject(value) ? __.mergeIt.call(this[prop], value) : value;
                            }
                        }
                    }
                }
            }
            return this;
        }
    };
    
    (function(){
        //var f = ['Arguments', 'Function', 'Object', 'Boolean', 'String', 'Number', 'Date', 'RegExp'];
        var f = ['Function', 'Object', 'String', 'Number'];
        for(idx in f) {
            (function(name) {
                __['is' + name] = function(obj) {
                    return toString.call(obj) === '[object ' + name + ']';
                };
            })(f[idx]);
        };
    })();
    
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
            var keyMap = { 
                'data': __.isArray, 
                'perPage': __.isValidNum, 
                'offset': __.isValidNum, 
                'rangeLength': __.isValidNum
            };
            __.mergeIt.call(this, o, keyMap);
            
            this.total = this.data && this.data.length > 0 ? this.data.length : 0;
            this.lastPageSize = this.total % this.perPage;
            this.pageCount = this.total ? Math.floor(this.total / this.perPage) + (this.lastPageSize ? 1 : 0) : 0;
            this.rangeStaticPos = Math.ceil(this.rangeLength / 2);
            this.current = 1;
        };

        this.hasPreviousPage = function() {
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
                this.current = pageNumber;
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
    this.__ = __;
}.call(this));
