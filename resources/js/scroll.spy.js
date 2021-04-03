/*
 * name : scroll.spy.js
 * desc : scroll spy
 * writer : glim
 * date : 2019/06/03
 * last : 2020/09/21

 * js-scrollspy-nav : nav
 * js-scrollspy-content : content
 */

/*
* js-elname-
* Container Name : js-scrollspy-####
* Nav Class name : js-scrollspy-#### > js-scrollspy-nav
* Content Classname : js-scrollspy-#### > js-scrollspy-content
*
* Call :  * $('.js-scrollspy-allmenu-brand-cate').scrollSpy({ elName:'allmenu-brand-cate'});
* Markup :
<div class="tab-wrap allmenu-brand-cate-scrollspy-wrap js-scrollspy-allmenu-brand-cate">
    <div class="tab-nav-5 scrollspy-nav-allmenu-brand js-scrollspy-nav">
        <ul class="tab-list">
            <li class="tab-item is-active"><a href="#scrollspy-allmenu-brand-cate-1" class="tab-link"><span><em>타이틀1</em></span></a></li>
            <li class="tab-item"><a href="#scrollspy-allmenu-brand-cate-2" class="tab-link"><span><em>타이틀2</em></span></a></li>
            <li class="tab-item"><span class="tab-link blank"></span></li> << 빈버튼일때
        </ul>
    </div>

    <!--S:scrollspy-content-->
    <div id="scrollspy-allmenu-brand-cate-1" class="blank-anchor js-scrollspy-content">컨텐츠 </div>
    <div id="scrollspy-allmenu-brand-cate-2" class="blank-anchor js-scrollspy-content">컨텐츠 </div>
    <!--E:scrollspy-content-->
</div>
*
* */
(function($) {
    $.fn.scrollSpy = function(config) {
        if($(this).length==0) {
            return null;
        }
        if("undefined" == typeof $(this).data("scrollSpy") || $(this).data("scrollSpy") == null) {
        }else{
            $(window).scrollTop(0);
            return $(this).data();
        }
        var data = {
            element : $(this),

            elName : null,
            elSelector : null,
            elNavSelector : null,
            elContentSelector : null,
            nav : null,
            contents : null,

            posy : [],// tab position y save
            showScollspyNavFixed : false,//Fixed or not
            scrollSpyNavTop : 64,//nav scroll pos
            //function
            scrollTop : function() {
                if(this.container !=null ) {
                    $(window).scrollTop(0);
                }
            },
            /*
            * date : 20190404
            * last : 20200921
            * name : funcPosySet(  )
            * pram : container(container selector), el(tabcontent element selector)
            * desc : container save y pos
            */
            funcPosySet : function (container, el){

                var padTop = 0;
                var citem = $(el,container);

                data.posy = [$(container).offset().top]; //20200921 edit

                $(citem).each(function(i) {
                    data.posy.push ($(this).offset().top + $(this).before().outerHeight() + padTop);  //20200921 edit
                });
                data.funcScrollEvent();
            },

            /*
            * date : 20190603
            * last : 20190603
            * name : funcScrollEvent(  )
            * pram : e(event)
            * desc : scroll event cal
            - Edit active tab at the last time/add top button (hidden when scroll=0)
            */
            funcScrollEvent : function (e){

                var lastScrollTop = $(data.elNavSelector).height() - $(window).height();//last position
                var currenty = $(window).scrollTop();//current position
                var adjusty = currenty;//Correction value

                adjusty = (adjusty < 0 ) ? 0 : adjusty;//Less than 0..

                switch (data.elName) {
                    default:
                        //console.log('Sorry, we are out of ' + expr + '.');
                        data._scrollSpyNavTop = 64;
                }

                if ( data.posy.length < 1) {return;}

                var setPos;
                for ( var i = 0;i < data.posy.length;i++){//Find where current data.posy is
                    if (data.posy[i] <= adjusty && adjusty < data.posy[i+1]){
                        //console.log ( data.posy[i] ,"<", adjusty ,"&&", adjusty ,"<", data.posy[i+1] )
                        setPos = i;
                        break;
                    }
                }

                $(data.elNavSelector).find('li').removeClass('is-active');//tab active remove

                var tg = setPos+1;
                if ( lastScrollTop == currenty ){ tg = data.posy.length-1; }//last scroll pos

                if ( isNaN(tg) == false ){//If the value is nan, do not execute
                    $(data.elNavSelector).find('li:nth-child('+tg+')').addClass('is-active');//tab active
                }
                //nav scroll pos
                if (data.showScollspyNavFixed == false && data.element.parents('.pflick-slide').length == 0 ) {
                    if ($(window).scrollTop() >= data._scrollSpyNavTop && isNaN(tg) == false && $(data.elNavSelector).hasClass('is-fixed') === false) {
                        $(data.elNavSelector).addClass('is-fixed');
                        data.showScollspyNavFixed = true;
                    }
                }else {
                    if ($(window).scrollTop() < data._scrollSpyNavTop && !$('body').hasClass('modal-open') || isNaN(tg) == true) {
                        $(data.elNavSelector).removeClass('is-fixed');
                        data.showScollspyNavFixed = false;
                    }
                }
            }
        };

        data.elName = (config.elName != "") ? "-"+config.elName : "";
        data.elSelector = ".js-scrollspy"+ data.elName ;
        data.elNavSelector = ".js-scrollspy"+ data.elName + " > .js-scrollspy-nav";
        data.elContentSelector = ".js-scrollspy"+ data.elName + " > .js-scrollspy-content";

        data.nav = $(data.elNavSelector);
        data.contents = $(data.elContentSelector);


        setTimeout(function(){
            data.funcPosySet(data.elSelector, data.contents);
        }, 300);


        $('a[href*="#"]', $(data.elNavSelector))
        // Remove links that don't actually link to anything
            .not('[href="#"]')
            .not('[href="#0"]')
            .click(function(event) {
                // On-page links
                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                    &&
                    location.hostname == this.hostname
                ) {
                    // Figure out element to scroll to
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        //console.log(target.offset().top + $('.js-scrollspy-nav').outerHeight())
                        event.preventDefault();

                        var headerTop = 100; // 20200921 edit
                        var padTop = 0;
                        var posVal = target.offset().top - padTop - headerTop; // 20200921 add

                        if (target.hasClass('animation') && target.attr('data-aos') !== undefined) { // 20200921 add
                            posVal -= parseInt(target.css('transform').split(',')[5]);
                        }

                        $('html, body').animate({
                            scrollTop: posVal // 20200921 edit
                        }, 800, function() {
                            // Callback after animation
                            // Must change focus!
                            var $target = $(target);
                            //$target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                                //$target.focus(); // Set focus again
                            };
                        });
                    }
                }
            });


        $(window).scroll(function(event){ //scroll event
            if (data.element.is(':visible') === true ){
                data.funcScrollEvent();
            }
        });

        $(window).resize(function(){//resize tab position resave
            if (data.element.is(':visible') === true ){
                data.funcPosySet(data.elSelector, data.contents);
            }
        });

        $(this).data("scrollSpy", data);
        return data;
    };
})(jQuery);

