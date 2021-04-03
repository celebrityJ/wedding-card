/*
 file name:	front.js
 description: common js
 author:	celebrityJ
 create date: 2020/09/09
 update date: 2020/09/21
*/

$(document).ready(function (event) {
	setAosAnimation();
	setUIDialog(' [data-popup-trigger]', ' .ui-dialog-contents');;
	gallerySwiperInit();

	$('.js-animation').each(function(){
		$(this).on('animationend webkitAnimationEnd', function() {
			$('.js-animation').addClass('is-complete');
		});
	});

	var wh = $(window).height();
	$('.main-banner-wrap').height(wh);

	var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { //지도를 생성할 때 필요한 기본 옵션
		center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
		level: 3 //지도의 레벨(확대, 축소 정도)
	};

	var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

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
	}
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

/**
 * 레이어 팝업 설정 (jquery UI Dialog)
 * @param selector {string} 레이어 팝업으로 생성할 컨테이너 셀렉터(default: .ui-dialog-contents)
 * @param btnSelector {string} 레이어 팝업을 띄우기 위한 버튼 셀렉터(default: .btn-dialog)
 */
var _dialogCount=0;
function setUIDialog(btnSelector, selector) {
	selector = selector || '.ui-dialog-contents';
	btnSelector = btnSelector || '[data-popup-trigger]';
	if ($(selector).length > 0) {
		// title : 타이틀 스타일 추가를 위해 html 소스로 전달
		$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
			_title: function (title) {
				if (this.options.title) {
					title.html(this.options.title);
				}
			}
		}));

		$(selector).each(function (index) {
			if ( $(this).parents('.ui-dialog').length > 0 ) return false;

			var dialogClass, containerId, dialogId, containerClasses, scrollTop;

			containerId = $(this).data('container');
			containerClasses = 'ui-dialog-container';
			dialogClass = '';

			if (containerId === undefined) {
				containerId = 'body';
			}

			if ($(this).data('class') !== undefined) {
				if (isNaN(parseInt($(this).data('class')))) {
					dialogClass = $(this).data('class');
				} else {
					dialogClass = 'auto';
				}
			}

			dialogId = containerId.replace('#', '') + 'Dialog' + _dialogCount;
			$(containerId).append('<div id="' + dialogId + '" class="' + containerClasses + '"></div>');

			_dialogCount++;

			$(this).dialog({
				appendTo: containerId + ' #' + dialogId,
				autoOpen: false,
				modal: true,
				resizable: false,
				draggable: false,
				minHeight: 'none',
				classes: {
					'ui-dialog': 'ui-corner-all ' + dialogClass,
				},
				position: null,
				open: function (event, ui) {
					var that, inlineStyle;
					that = this;
					inlineStyle = {};
					scrollTop = $(window).scrollTop();
					if (containerId !== 'body') {
						inlineStyle.height = $(containerId).outerHeight();
						inlineStyle.top = $(containerId).find('.os-viewport').length !== 0 ? $(containerId).find('.os-viewport').scrollTop() : $(containerId).scrollTop();
					} else {
						inlineStyle.top = 0;
					}

					// 20201224 수정 | popup 처음 열릴 때만 top 지정
					if ( $(".ui-dialog-container:visible").length === 0 ) {
						$(containerId).css({
							'top': scrollTop * -1,
						});
					}

					// body scroll 비활성화
					$(containerId).addClass('dialog-open');

					// 팝업 2개 이상 노출 시 z-index 지정
					var zNum = 99;
					if ( $(".ui-dialog-container:visible").length > 0 ){
						$(".ui-dialog-container:visible").each(function (){
							zNum = Math.max(zNum, $(this).css('z-index'));
						});
					}
					$(that).closest('.ui-dialog-container').addClass('open').css('z-index', zNum+2);

					// 팝업 close
					if ($('[data-layer-close]', that).length > 0) {
						$('[data-layer-close]', that).off('click').on('click', function () {
							$(that).dialog('close');
						});
					}

					// full popup
					if (dialogClass.indexOf('dialog-full') === 0){
						$(that).find('.dialog-contents').scrollTop(0);

						if (!$(that).parent().hasClass('dialog-mymenu')) setBtnGoTop($(that));

						// 20210202 add | full popup title 개행시 더보기 버튼 추가
						function isEllipsisActive(e) {
							return (e.offsetWidth < e.scrollWidth);
						}

						var popTitle = $(that).find('.dialog-header .pop-title');

						if(isEllipsisActive(popTitle[0]) && !popTitle.parent().hasClass('is-ellipsis')) {
							popTitle.parent().addClass('is-ellipsis');
							popTitle.after('<button type="button" class="btn-title-more js-btn-title-more"></button>');
						}

						popTitle.parent().find('.js-btn-title-more').off().on('click', function(){
							popTitle.parent().toggleClass('is-more');
							var titleHeight = popTitle.parent().outerHeight(true);
							$(that).find('.dialog-contents').css('height', 'calc(100% - '+titleHeight+'px)');

							// 타이틀 더보기 버튼 클릭 시, 탑버튼 위치 재계산
							if(!$(that).find('.js-btn-go-top').hasClass('is-fixed')) moreBtnclickBool = 1;
							setFooterPos($(that));
						});
					}
				},

				close: function (event, ui) {
					var that = this;

					$(that).closest('.ui-dialog-container').removeClass('open').removeAttr('style');

					if ($(containerId).find('.ui-dialog-container.open').length === 0) {
						scrollTopPos = $('body').css('top');
						$('body').removeAttr('style');
						$(containerId).removeClass('dialog-open');
						$(window).scrollTop(parseInt(scrollTopPos) * -1);
					}
				},
			});

		});
	}

	if ($(btnSelector).length > 0) {
		$(btnSelector).each(function () {
			$(this).off('click').on('click', function (event) {
				event.preventDefault();

				$($(this).data('target')).dialog('open');
			});
		});
	}
}