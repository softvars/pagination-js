(function() {
    var Pagination_UI = function(o){
        if (!(this instanceof Pagination_UI)) {
            return new Pagination_UI(o);
        }
        o = o || {};
        Pagination.call(this, o);
        
        this.dataContainer = null;
        this.pageNumContainer = null;
        this.renderType = 'array-concat'; // template
        this.concat = true;
        this.template = null;
        this.concatWith = "";
        
        this.init = function(o){
            __.mergeIt.call(this, o, ['dataContainer', 'pageNumContainer', 'template', 'concat', 'concatWith']);
            this.renderPage(1);
            this.addEventHandlers();
        };

        /* Rendering Page Numbers */
        this.renderPageNumbers = function() {
            var pageNumHtml = ''; 
            var rang = this.getPageRange();
            var prevClsName = this.hasPreviousPage() ? '' : ' class="disabled"'; 
            var nextClsName = this.hasNextPage() ? '': ' class="disabled"'; 
            pageNumHtml += '<span'+prevClsName+'><a href="#first" id="first-page-link" data-state="first" title="First">|&lt;</a></span>';
            pageNumHtml += '<span'+prevClsName+'><a href="#prev-range" id="prev-range-first-page-link" data-state="prev-range" title="Previous Range">&lt;&lt;</a></span>';
            pageNumHtml += '<span'+prevClsName+'><a href="#prev" id="prev-page-link" data-state="prev" title="Previous">&lt;</a></span>';
            for(var idx = 0; idx < rang.length; idx ++) {
                var pageNum = rang[idx];
                pageNumHtml += "<span" + (this.current == pageNum  ? " class='current'" : "") + 
                    "><a href='#page_" + pageNum +"' data-state='" + pageNum +"'>"+pageNum+"</a></span>";
            }
            pageNumHtml += '<span'+nextClsName+'><a href="#next" id="next-page-link" data-state="next" title="Next">&gt;</a></span>';
            pageNumHtml += '<span'+nextClsName+'><a href="#next-range" id="next-range-first-page-link" data-state="next-range" title="Next Range">&gt;&gt;</a></span>';
            pageNumHtml += '<span'+nextClsName+'><a href="#last" id="last-page-link" data-state="last" title="Last">&gt;|</a></span>';
            $(this.pageNumContainer).html(pageNumHtml);
        };

        /* Page */
        this.createHtml = function(data) {
            var html = '';
            var isValidArr = __.isArray(data) && data.length;
            var isValidObject = __.isObject(data) && __.keys(data).length;
            
            if(this.concat && isValidArr) { //else if object
                html = data.join(this.concatWith); // Concat, template.
            } else {
                if(__.isFunction(this.template)) {
                    html = this.template(data);
                }
            }
            return html;
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
                $(this.dataContainer).html(this.createHtml(pageData));
                this.renderPageNumbers();
            }
            return pageData;
        };
        
        /* Pagination */
        this.addEventHandlers = function() {
            var thisObj = this;
            $(document.body).on('click', thisObj.pageNumContainer+' a', function(e) {
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
