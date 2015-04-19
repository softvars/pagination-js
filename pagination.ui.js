(function() {
    function isContains(obj, key) {
        return obj.hasOwnProperty(key);
    }
    var Pagination_UI = function(o){
        if (!(this instanceof Pagination_UI)) {
            return new Pagination_UI(o);
        }
        o = o || {};
        Pagination.call(this, o);
        
        this.dataDiv = null;
        this.pageNumDiv = null;
        this.concat = false;
        this.concatWith = null;

        this.init = function(o){
            if(o) {
                this.dataDiv =  isContains(o, 'dataDiv') ? o.dataDiv : this.dataDiv;
                this.pageNumDiv = isContains(o, 'pageNumDiv') ? o.pageNumDiv : this.pageNumDiv;
                this.concat = isContains(o, 'concat') && o.concat ? o.concat : this.concat;
                this.concatWith = isContains(o, 'concatWith') ? o.concatWith : this.concatWith;
            }
            this.renderPage(1);
            this.addEventHandlers();
        };

        /* Rendering Page Numbers */
        this.renderPageNumbers = function() {
            var pageNumHtml = ''; 
            var rang = this.getPageRange();
            var prevClsName = this.hasPreviousPage() ? '' : ' class="disabled"'; 
            var nextClsName = this.hasNextPage() ? '': ' class="disabled"'; 
            pageNumHtml += '<span'+prevClsName+'><a href="#" id="first-page-link" data-state="first" title="First">|&lt;</a></span>';
            pageNumHtml += '<span'+prevClsName+'><a href="#" id="prev-range-first-page-link" data-state="prev-range" title="Previous Range">&lt;&lt;</a></span>';
            pageNumHtml += '<span'+prevClsName+'><a href="#" id="prev-page-link" data-state="prev" title="Previous">&lt;</a></span>';
            for(var idx = 0; idx < rang.length; idx ++) {
                var pageNum = rang[idx];
                pageNumHtml += "<span" + (this.current == pageNum  ? " class='current'" : "") + 
                    "><a href='#page_" + pageNum +"' data-state='" + pageNum +"'>"+pageNum+"</a></span>";
            }
            pageNumHtml += '<span'+nextClsName+'><a href="#" id="next-page-link" data-state="next" title="Next">&gt;</a></span>';
            pageNumHtml += '<span'+nextClsName+'><a href="#" id="next-range-first-page-link" data-state="next-range" title="Next Range">&gt;&gt;</a></span>';
            pageNumHtml += '<span'+nextClsName+'><a href="#" id="last-page-link" data-state="last" title="Last">&gt;|</a></span>';
            $(this.pageNumDiv).html(pageNumHtml);
        };

        /* Page */
        this.createHtml = function(data) {
            var pageNumHtml = '';
            if(PUtil.isArray(data) && data.length) { //else if object
                pageNumHtml = data.join(this.concatWith ? this.concatWith : ''); // Concat, template.
            }
            return pageNumHtml;
        };
        
        this.stateMap = {
            'first'     : 'getFirstPage',
            'prev-range': 'getPrevRangePage',
            'prev'      : 'getPreviousPage',
            'next'      : 'getNextPage',
            'next-range': 'getNextRangePage',
            'last'      : 'getLastPage'
        };

        this.renderPage = function(state) {
            var fn = this.stateMap[state];
            var pageData = (fn ? this[fn]() : !(isNaN(Number(state))) ? this.getPage(state) : []);
            if(pageData.length) {
                $(this.dataDiv).html(this.createHtml(pageData));
                this.renderPageNumbers();
            }
            return pageData;
        };
        
        /* Pagination */
        this.addEventHandlers = function() {
            var thisObj = this;
            $(document.body).on('click', thisObj.pageNumDiv+' a', function(e){
                var $this = $(this);
                var $thisParent = $this.parent('.disabled, .current');
                if($thisParent.length > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                var state = $this.data('state');
                thisObj.renderPage(state);
            });
        };
        this.init(o);
    };
    
    Pagination_UI.prototype = Object.create(Pagination.prototype);
    Pagination_UI.prototype.constructor = Pagination_UI;
    
    this.Pagination_UI = Pagination_UI;
}.call(this));
