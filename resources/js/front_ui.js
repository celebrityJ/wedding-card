/*
 file name:	front.js
 description: common js
 author:	celebrityJ
 create date: 2020/09/09
 update date: 2020/09/21
*/

$(function () {
	setAosAnimation();

	gnbAnchorPos();

	moGnbOnOFF();
	// $('.js-scrollspy').scrollSpy({ elName:'' });

	gallerySwiperInit();

	$('.js-animation').each(function(){
		$(this).on('animationend webkitAnimationEnd', function() {
			$('.js-animation').addClass('is-complete');
		});
	});

	var wh = $(window).height();
	$('.main-banner-wrap').height(wh);
});

$(window).on('resize', function () {
	resize();
});

//scrollEvent
var scrollTop, _scrollTop;
_scrollTop = $(window).scrollTop();

$(window).scroll(function () {
	_scrollTop = scrollTop;
	scrollTop = $(window).scrollTop();

	moFixedHeader();
});

/**********************************************************************************
 ** gallerySwiperInit
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : gallerySwiperInit(  )
* pram :
* desc : product swiper init
*/
function gallerySwiperInit(){
	var galleryThumbs = new Swiper('.gallery-list-wrap .gallery-thumb-wrap', {
		spaceBetween: 10,
		slidesPerView: 4,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	});

	var gallerySwiper = new Swiper('.gallery-list-wrap .gallery-swiper-wrap', {
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
		thumbs: {
			swiper: galleryThumbs,
		}
	});
}

/**********************************************************************************
 ** resize
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : resize(  )
* pram :
* desc : resize event
*/
var ww, _ww;
_ww = $(window).width();

function resize(){
	_ww = ww;
	ww = $(window).width();

	if(_ww !== ww){
		// console.log("resize")
		gnbAnchorPos();
	}
}

/**********************************************************************************
 ** moFixedHeader
 ***********************************************************************************/
/*
* date :  20200921
* last :  20200921
* name :  moFixedHeader ()
* desc :  mo gnb fixed
* pram :
* scroll content fix
*/
function moFixedHeader() {
	var mainHeight = $('.header-container').outerHeight();

	if ($(window).scrollTop() > mainHeight) {
		$('.js-gnb-wrap').addClass('is-fixed');
	}else {
		if(!$('.js-gnb-wrap').hasClass('is-open')){
			$('.js-gnb-wrap').removeClass('is-fixed');
		}
	}
}

/**********************************************************************************
 ** gnbAnchorPos
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : gnbAnchorPos(  )
* pram : parents (default : .contents-container)
* desc : gnb Anchor pc/mo position
*/
function gnbAnchorPos() {
	// anchor tab scroll pos
	setTimeout(function() {
		$('.js-scrollspy-content').each(function () {
			var originContPcTop, originContMoTop;

			if($(window).width() > 768){ // only pc
				originContPcTop = $(this).offset().top - 100;

				if (!$(this).hasClass('aos-animate') && $(this).attr('data-aos') !== undefined) {
					originContPcTop -= parseInt($(this).css('transform').split(',')[5]);
				}
				$(this).data("originPcTop", originContPcTop);
				// console.log('pc', originContPcTop)
			}else if($(window).width() <= 768){ // only mo
				originContMoTop = $(this).offset().top - 80;
				if ($(this).hasClass('aos-animate') && $(this).attr('data-aos') !== undefined) {
					originContMoTop -= parseInt($(this).css('transform').split(',')[5]);

					if($(this).hasClass('support-wrap')){
						originContMoTop += 20;
					}
				}

				$(this).data("originMoTop", originContMoTop);
				// console.log('mo', originContMoTop);
			}
		});

		$('.js-gnb-wrap').find('.js-item').on('click', function (e) {
			var tgAnchorName = $(this).attr('href').split("#")[1];

			$('.js-scrollspy-content').each(function () {
				tgAnchorCont = $(this).attr('id');

				if (tgAnchorName === tgAnchorCont) {
					var contPos;

					if($(window).width() >= 769) { // only pc
						// console.log('pc')
						contPos = $("#" + tgAnchorCont).data("originPcTop");
						// console.log('pc move', contPos);
					}else{
						// console.log('mo')
						contPos = $("#" + tgAnchorCont).data("originMoTop");
						// console.log('mo move', contPos);
					}

					$('html, body').stop().animate({scrollTop: contPos}, 500);
				}
			});

			e.preventDefault();
		});
	},500);
}

/**********************************************************************************
 ** moGnbOnOFF
 ***********************************************************************************/
/*
* date : 20200921
* last : 20200921
* name : moGnbOnOFF(  )
* pram :
* desc : mobile menu on/off
*/

function moGnbOnOFF(){
	$('.js-btn-nav').on('click', function(){
		if($('.js-gnb-wrap').hasClass('is-open')){
			$('.js-gnb-wrap').removeClass('is-open').addClass('is-close');

			if($(window).scrollTop() <= 60){
				$('.js-gnb-wrap').removeClass('is-fixed');
			}
		}else{
			$('.js-gnb-wrap').addClass('is-fixed is-open').removeClass('is-close');
		}
	});

	$('.js-gnb-wrap').find('.gnb .gnb-list .item').on('click', function(){
		if($('.js-gnb-wrap').hasClass('is-open')) $('.js-gnb-wrap').removeClass('is-open').addClass('is-close');
	});
}

/**********************************************************************************
 ** setAosAnimation
 ***********************************************************************************/
/*
* date : 20200921
* last : 20200921
* name : setAosAnimation(  )
* pram :
* desc : aos animation setting
*/
function setAosAnimation(){
	$('.animation').each(function(){
		if($(this).hasClass('fade-up')){
			$(this).attr('data-aos', 'fade-up');
		}else if($(this).hasClass('move-right')){
			$(this).attr('data-aos', 'move-right');
			$(this).attr('data-aos-anchor-placement', 'center-bottom');
		}else if($(this).hasClass('move-left')){
			$(this).attr('data-aos', 'move-left');
			$(this).attr('data-aos-anchor-placement', 'center-bottom');
		}else if($(this).hasClass('fade-left')){
			$(this).attr('data-aos', 'fade-left');
		}else if($(this).hasClass('fade-right')){
			$(this).attr('data-aos', 'fade-right');
		}
	})

	setTimeout(function(){
		AOS.init({
			easing: 'ease-in-out',
			duration: 500,
			offset: 30,
		});
	}, 500);
}
