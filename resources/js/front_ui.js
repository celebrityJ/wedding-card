/*
 file name:	front.js
 description: common js
 author:	celebrityJ
 create date: 2020/09/09
 update date: 2020/09/21
*/

$(document).ready(function (event) {
	$('.js-animation').each(function(){
		$(this).on('animationend webkitAnimationEnd', function() {
			$('.js-animation').addClass('is-complete');
		});
	});

	var wh = $(window).height();
	$('.main-banner-wrap').height(wh);

	setAosAnimation();
	setUIDialog(' [data-popup-trigger]', ' .ui-dialog-contents');;
	gallerySwiperInit();
	clipboard();
	mapApi();
	mapMarker();
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
 ** mapMarker
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : mapMarker(  )
* pram :
* desc : mapMarker
*/

function mapMarker(){
	var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
		center : new kakao.maps.LatLng(37.387337, 127.122438), // 지도의 중심좌표
		level : 14 // 지도의 확대 레벨
	});

	// 마커 클러스터러를 생성합니다
	var clusterer = new kakao.maps.MarkerClusterer({
		map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
		minLevel: 10 // 클러스터 할 최소 지도 레벨
	});

	// 데이터를 가져오기 위해 jQuery를 사용합니다
	// 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
	$.get("/download/web/data/chicken.json", function(data) {
		// 데이터에서 좌표 값을 가지고 마커를 표시합니다
		// 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
		var markers = $(data.positions).map(function(i, position) {
			return new kakao.maps.Marker({
				position : new kakao.maps.LatLng(position.lat, position.lng)
			});
		});

		// 클러스터러에 마커들을 추가합니다
		clusterer.addMarkers(markers);
	});
}

/**********************************************************************************
 ** mapApi
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : mapApi(  )
* pram :
* desc : mapApi
*/
function mapApi(){
	var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { //지도를 생성할 때 필요한 기본 옵션
		center: new kakao.maps.LatLng(37.387337, 127.122438), //지도의 중심좌표.
		level: 4 //지도의 레벨(확대, 축소 정도)
	};

	var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
}

/**********************************************************************************
 ** clipboard
 ***********************************************************************************/
/*
* date : 20200909
* last : 20200921
* name : clipboard(  )
* pram :
* desc : clipboard
*/
function clipboard(){
	var clipboard = new Clipboard('.btn-copy');
	clipboard.on('success', function(e) {
		console.log(e);
	});
	clipboard.on('error', function(e) {
		console.log(e);
	});
}

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