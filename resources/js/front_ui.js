/*
 파일명:		abc.front.js
 설  명:		공통 자바스크립트
 작성자:		glim
 최초작성일:	2020/11/
 최종수정일:
*/

// IE 10 NodeList.forEach 함수 선언
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}


$(function () {


});

var ewha = ewha || {};
ewha.ui = ewha.ui || {};

ewha.ui.front = ewha.ui.front || (function () {
	var _front = {}, _dialogCount = 0;

	////////////////////////////////////////////////////////////
	// 공통 UI 스크립트
	////////////////////////////////////////////////////////////
	/**
	 * gnb setting
	 */
	function setHeader() {
		var didScroll;
		var lastScrollTop = 0;
		var fixedBool = 1;

		setScrollUp();
		setSearchOnOff();
		pageTitleEllipsis();

		// portlet 타이틀영역 스크롤up시 hidden
		$(window).on('scroll', function(event){
			didScroll = true;
		});

		setInterval(function() {
			if (didScroll) {
				setScrollUp();
				didScroll = false;
			}
		}, 250);

		function setScrollUp() {
			var headerWrap = $('.header-wrap');
			if (!headerWrap.parent().hasClass('portlet')) return;

			var st = $(this).scrollTop();
			var bannerPos = $('.main-banner-box').offset().top + $('.main-banner-box').outerHeight(true) + headerWrap.outerHeight(true);
			var delta = 3;

			if(Math.abs(lastScrollTop - st) <= delta) return; // delta값 보다 스크롤 움직인 값이 적은경우 return

			if(st > bannerPos){
				// 20210108 추가
				headerWrap.removeClass('animate-remove')
				
				if(fixedBool === 1) {
					headerWrap.addClass('is-fixed');
					fixedBool = 0;
				}

				if (st > lastScrollTop){
					// Scroll Down
					headerWrap.addClass('scroll-down').removeClass('scroll-up');
				} else {
					// Scroll Up
					if(st + $(window).height() < $(document).height()) {
						headerWrap.removeClass('scroll-down').addClass('scroll-up');
					}
				}
				fixedBool = 1;
			}else{
				// 20210108 수정
				headerWrap.removeClass('is-fixed scroll-down scroll-up');
				headerWrap.addClass('animate-remove')
				fixedBool = 0;
			}

			lastScrollTop = st;
		}

		// 검색버튼 클릭시 검색 input OnOff
		function setSearchOnOff(){
			$('.js-header-search-box .js-btn-search-active').on('click', function(){
				$(this).parents('.js-header-search-box').addClass('is-active');
				$(this).parents('.js-header-search-box').find('.ui-input').focus();

			});

			$('.js-header-search-box .js-btn-search-close').on('click', function(){
				$(this).parents('.js-header-search-box').removeClass('is-active');
			});
		}

		//페이지 타이틀 말줄임 체크
		function pageTitleEllipsis(){
			if(!$('.header-wrap .title-box .page-title').length > 0) return;

			function isEllipsisActive(e) {
				return (e.offsetWidth < e.scrollWidth);
			}

			var pageTitle = document.querySelectorAll('.header-wrap .title-box .page-title');

			if(isEllipsisActive(pageTitle[0])) {
				$('.header-wrap').addClass('is-ellipsis');
				$('.title-box').append('<button type="button" class="btn-title-more js-btn-title-more"></button>');
			}

			$('.js-btn-title-more').on('click', function(){
				$('.header-wrap').toggleClass('is-more');
				$('.contents-wrap').css('padding-top', $('.header-wrap').height());
				// 20210104 수정 | 타이틀 더보기시 tab list top 조절 추가
				if($('.contents-section').hasClass('tab-wrap')) $('.tab-wrap .tab-list').css('top', $('.header-wrap').height());
			});
		}
	}


	/**
	 * 테이블 캡션 생성
	 * @param selector 테이블 DOM 셀렉터(default : .tbl-wrap table)
	 */
	function setTableCaption(selector) {
		selector = selector ? selector + ' .tbl-wrap table' : '.tbl-wrap table';
		$(selector).each(function (index) {
			var table, tableClass, captionText, captionComplex, theadHeader, tbodyHeader, bodyToHeadIdxs, hasThead,
				captionSubFix;
			table = $(this);
			tableClass = $(this).closest('.tbl-wrap, .tbl-col').attr("class");
			captionTextOrigin = $(this).find("caption").text();
			captionComplex = "";
			captionSubFix = "";
			theadHeader = [];
			tbodyHeader = [];
			bodyToHeadIdxs = [];
			hasThead = false;

			if (tableClass.match("tbl-form") && tableClass.match("form-view") !== null) {
				captionSubFix = "을(를) 입력하는 표입니다.";
			} else {
				captionSubFix = "을(를) 나타낸 표입니다.";
			}

			// thead th값 추출
			if ($(this).find("thead th").length > 0) {
				$(this).find("thead th").each(function (index) {
					theadHeader.push($(this).text());
				});
			}
			// tbody th값 추출
			if ($(this).find("tbody th").length > 0) {
				$(this).find("tbody th").each(function (index) {
					// tbody th가 thead th의 서브 헤더인 경우(thead th와 tbody th가 둘 다 존재하는 경우)
					if (theadHeader.length > 0) {
						if (tbodyHeader[$(this).index()] === undefined) {
							tbodyHeader[$(this).index()] = theadHeader[$(this).index()] + " 컬럼의 하위로";
						}
						tbodyHeader[$(this).index()] += " " + $(this).text();
					} else {
						tbodyHeader.push($(this).text());
					}
				});

				tbodyHeader = tbodyHeader.filter(function (n) {
					return n !== undefined;
				});
			}

			if (theadHeader.length > 0 && tbodyHeader.length > 0) {
				captionComplex += theadHeader.join(", ") + " " + tbodyHeader.join(", ");
			} else if (theadHeader.length > 0) {
				captionComplex += theadHeader.join(", ");
			} else if (tbodyHeader.length > 0) {
				captionComplex += tbodyHeader.join(", ");
			}

			//console.log(captionTextOrigin + " 목록이며 " + captionComplex +  " 을(를) 나타낸 표입니다.");
			$(this).find("caption").text(captionTextOrigin + " 테이블로 " + captionComplex + captionSubFix);
		});
	}


	/**
	 * jQuery UI 다이얼로그 설정
	 * @param btnSelector 다이얼로그 오픈 버튼 DOM 셀렉터(default : [data-popup-trigger])
	 * @param selector 다이얼로그 DOM 셀렉터(default : .ui-dialog-contents)
	 */
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


	/**
	 * 버튼으로 toast 메세지 실행
	 * @param btnSelector toast message 오픈 버튼 DOM 셀렉터(default : [data-toast-trigger])
	 */
	function toastBtnTrigger(btnSelector) {
		btnSelector = btnSelector || '[data-toast-trigger]';
		$(btnSelector).on('click', function(){
			var toastMessage = $(this).attr('data-toast-message');
			var toastTime = $(this).attr('data-toast-time') ? $(this).attr('data-toast-time') : 2000;
			setToastMessage(toastMessage, toastTime, $(this));
		});
	}


	/**
	 * toast message
	 * @param msg 노출되는 메세지 내용
	 * @param timer toast 노출 시간 밀리세컨드로 계산(default: 2000)
	 * @param tg toast 이벤트 발생되는 타겟(default: body)
	 */
	function setToastMessage(msg, timer, tg){
		tg = tg || 'body';

		if (!timer) { timer = 2000; }
		var $elem = $("<div class='toast-wrap'><span class='toast-message'>" + msg + "</span></div>");

		if($(tg).attr('data-toast-message')){ // 버튼 클릭으로 토스트 메세지 노출 시
			if($('body').find('.toast-wrap').length < 1) $(tg).after($elem);
		}else{
			if($('body').find('.toast-wrap').length < 1) $('body').append($elem);
		}

		$elem.slideToggle(100, function() {
			if (!isNaN(timer)) {
				setTimeout(function() {
					$elem.fadeOut(function() {
						$(this).remove();
					});
				}, timer);
			}
		});
	}

	/**
	 * top 버튼 setting
	 * @param container top 버튼이 노출되는 container (default: contents-wrap)
	 */
	function setBtnGoTop(container) {
		container = container || '.contents-wrap';

		// top button move scroll 0
		$(container).find('.js-btn-go-top').on('click', function () {
			if ($(container).parent().hasClass('ui-dialog')) {
				$(container).find('.dialog-contents').scrollTop(0);
				bottomPos = 20;
				oldBottomPos = bottomPos;
			}else{
				$(window).scrollTop(0);
			}
		});

		// 하단 버튼 offset 구하기
		setFooterPos(container);
	}

	/**
	 * 하단 버튼 offset 구하기
	 * @param container top 버튼이 노출되는 container (default: contents-wrap)
	 */
	function setFooterPos(container){
		container = container || '.contents-wrap';

		var eventTg, tg, bottomEl, pageBottomPosition, pdt;
		tg = $(container);
		if(tg.hasClass('contents-wrap')) { // 페이지인 경우
			eventTg = $(window);
			pdt = 10;
		}else if(tg.parent().hasClass('ui-dialog')){ // 팝업인 경우
			eventTg = tg.find('.dialog-contents');
			pdt = -14;
		}

		//201224 수정 .tab-wrap => .tab-wrap.js-tab
		bottomEl = (tg.find('.tab-wrap.js-tab').length > 0) ? tg.find('.tab-content').eq(0).find('.js-contents-bottom') : tg.find('.js-contents-bottom');

		if(bottomEl.length > 0 && !(bottomEl.hasClass('fixed'))) {
			// 20210202 수정 pageBottomPosition 계산 시, $(eventTg) scrollTop 값 추가
			pageBottomPosition = $(eventTg).scrollTop() + bottomEl.offset().top + pdt;
		}

		// 20210202 추가 최초 setScrollFixedTop 실행
		setScrollFixedTop(tg, pageBottomPosition);

		$(eventTg).off('scroll').on('scroll', function() {
			setScrollFixedTop(tg, pageBottomPosition);
		});
	}

	/**
	 * 탭 active시, 하단 버튼 offset 계산
	 * @param container top 버튼이 노출되는 container (default: contents-wrap)
	 */
	function tabActiveFooterPos(container){
		container = container || '.contents-wrap';
		var activeTab;
		var eventTg, tg, bottomEl, pageBottomPosition, pdt;

		tg = $(container);
		if(tg.hasClass('contents-wrap')) { // 페이지인 경우
			eventTg = $(window);
			pdt = 10;
		}else if(tg.parent().hasClass('ui-dialog')){ // 팝업인 경우
			eventTg = tg.find('.dialog-contents');
			pdt = -14;
		}

		// tab content scroll 0으로 초기화
		$(eventTg).scrollTop(0);

		// active tab
		$('.js-tab .tabs .tab-item').each(function(){
			if($(this).hasClass('ui-tabs-active')){
				activeTab = $(this).find('.tab-link').attr('href').replace('#','');
			}
		});

		activeTab = $('#'+activeTab);
		bottomEl = $(activeTab).find('.js-contents-bottom');

		if(bottomEl.length > 0 && !(bottomEl.hasClass('fixed'))) {
			pageBottomPosition = bottomEl.offset().top + pdt;
		}

		// 하단 고정 버튼인 경우 top버튼에 tab-fixed class 추가
		if(bottomEl.hasClass('fixed')){
			$(container).find('.js-btn-go-top').addClass('tab-fixed');
		}else{
			$(container).find('.js-btn-go-top').removeClass('tab-fixed');
		}

		$(eventTg).off('scroll').on('scroll', function() {
			setScrollFixedTop(tg, pageBottomPosition);
		});
	}

	/**
	 * top 버튼 scroll
	 * @param container top 버튼이 노출되는 container (default: contents-wrap)
	 * @param maxPos 페이지 하단 버튼(고정 x) offset
	 */

	var scrollVal, oldBottomPos, oldScrollTop;
	var bottomPos = 20;
	var bottomPosBool = 1;
	var moreBtnclickBool = 0; // 20210202 추가 타이틀 더보기 버튼 click boolean 값 추가
	function setScrollFixedTop(container, maxPos){
		container = container || '.contents-wrap';

		var currentScrollTop;
		var topBtnViewVal = Math.floor($(window).height() / 5);
		var tg;

		// 현재 스크롤값 set
		if(!($(container).parent().hasClass('ui-dialog'))) { // container가 페이지인 경우
			tg = $('.contents-wrap').find('> .js-btn-go-top');
			currentScrollTop = $(window).scrollTop();
		}else{ // container가 팝업인 경우
			tg = $(container).find('.js-btn-go-top')
			currentScrollTop = $(container).find('.dialog-contents').scrollTop();
		}

		// top button show/hide
		if (currentScrollTop <= topBtnViewVal) {
			tg.removeClass('is-active').addClass('is-fixed');
		} else {
			tg.addClass('is-active is-fixed');
		}

		// 페이지 하단 버튼 까지만 top버튼 노출하는 위치 조절
		var scrollPosition = window.innerHeight + currentScrollTop;
		if (maxPos !== undefined) {
			if($(container).parent().hasClass('ui-dialog')){
				if ($(container).find('.contents-bottom').length > 0) {
					if (scrollPosition > maxPos) {
						tg.removeClass('is-fixed');
						scrollVal = currentScrollTop - oldScrollTop;

						if(scrollVal > 1 && bottomPosBool === 1){
							bottomPos -= maxPos - (oldScrollTop + window.innerHeight);
							bottomPosBool = 0;
						}

						oldBottomPos = bottomPos;
						oldScrollTop = currentScrollTop;

						bottomPos = oldBottomPos + scrollVal;

						// 20210202 추가 팝업 타이틀 더보기 버튼 클릭 시 위치 재계산 추가
						var popHeader = $(container).find('.dialog-header');
						if(popHeader.hasClass('is-ellipsis') && moreBtnclickBool === 1){ // 더보기버튼 있는 경우
							if(popHeader.hasClass('is-more')){ // 더보기 상태
								bottomPos = bottomPos - 24;
							}else{ // 말줄임 상태
								bottomPos = bottomPos + 24;
							}

							moreBtnclickBool = 0;
						}

						tg.css('bottom', bottomPos + 'px');

					} else {
						tg.removeAttr('style');
						oldScrollTop = currentScrollTop;
						bottomPos = 20;
						oldBottomPos = bottomPos;
						bottomPosBool = 1;
					}
				}
			}else{
				if (scrollPosition > maxPos) {
					tg.removeClass('is-fixed');
				}
			}
		}
	}

	/**
	 * input clear 버튼 노출
	 */
	function setInputClear(){
		if($('.input-wrap .ui-input').length > 0){
			var clearBtn, tg;

			$('.input-wrap .js-btn-clear').on('click', function(e){
				$(this).parent().find('.ui-input').val('').focus();
				$(this).hide();
			});

			$('.input-wrap .ui-input').each(function(){
				tg = $(this);

				tg.on({
					'focusin': function(){
						clearBtn = $(this).parent().find('.js-btn-clear');
						clearBtn.toggle(Boolean($(this).val()));
						$(this).parent().addClass('is-focus');
					},
					'focusout': function(e){
						$(this).parent().removeClass('is-focus');

						setTimeout(function(){
							if (clearBtn.is(':visible')) clearBtn.hide();
						}, 50);
					},
					'keyup': function(){
						clearBtn.toggle(Boolean($(this).val()));
					},
				});
			});
		}
	}

	/**
	 * dropdown list on off
	 * 20201224 수정 : dropdown 영역 제외 클릭시 close 수정
	 */
	function dropdownOnOff(){
		if($('.js-dropdown-wrap').length > 0){
			$(document).on('click', function(event){
				if($(event.target).closest('.js-dropdown-wrap').length === 0){
					$('.js-dropdown-wrap').removeClass('is-active');
				}
			});

			$('.js-dropdown-wrap').each(function(){
				var tg = $(this);

				tg.find('.js-btn-dropdown').on('click', function(){
					$('.js-dropdown-wrap').not(tg).removeClass('is-active');
					tg.toggleClass('is-active');
				});

				$('.js-dropdown-wrap .js-dropdown-list .js-option-link').on('click', function(){
					var papa;
					papa = $(this).parents('.js-dropdown-wrap');
					papa.removeClass('is-active');

					// sorting인 경우
					if($('.js-dropdown-wrap').hasClass('sort')){
						var selectVal;
						selectVal = $(this).text();
						papa.find('.js-btn-dropdown').text(selectVal);
						papa.find('.js-dropdown-list .option-item').removeClass('is-selected');
						$(this).parent().addClass('is-selected');
					}
				});
			});
		}
	}

	/**
	 * Fold box 기본 설정
	 * @param selector Fold box 컨테이너 DOM 셀렉터(default : .js-fold)
	 */
	function setFoldBox(selector) {
		selector = selector ? selector : '.js-fold';
		if ($(selector).length > 0) {
			$(selector).find('.fold-box').each(function (index) {
				$(this).find('.js-fold-trigger').off('click').on('click', function (event) {
					// 20210104 수정 | fold trigger 버튼 포함시 return
					if ($(this).hasClass('fold-box-header') && ($(event.target).is('a') || $(event.target).is('button'))) {
						event.preventDefault();
						return;
					}

					var isExpanded;
					isExpanded = $(this).closest('.fold-box').hasClass('expanded');
					if ($(event.currentTarget).closest(selector).data('type') === 'single') {
						$(this).closest(selector).find('.fold-box').removeClass('expanded');
						isExpanded ? $(this).closest('.fold-box').removeClass('expanded')
							: $(this).closest('.fold-box').addClass('expanded');
					} else {
						$(event.currentTarget).closest('.fold-box').toggleClass('expanded');
					}

					if ($(event.currentTarget).hasClass('btn-more')){
						$(this).closest('.fold-box').hasClass('expanded') ? $(this).find('.text').text('닫기') : $(this).find('.text').text('더보기');
					}
				});
			});
		}
	}

	/**
	 * 더보기 리스트 설정
	 * @param selector Fold box 컨테이너 DOM 셀렉터(default : .js-fold)
	 */
	function setMoreListBox(selector){
		selector = selector ? selector : '.js-category-list';
		if ($(selector).length > 0) {
			$(selector).find('.category-box').each(function (index) {
				function isEllipsisActive(e) {
					return (e.offsetHeight < e.scrollHeight);
				}

				var ellipsisText = $(this).find('.js-ellipsis-text');

				if(isEllipsisActive(ellipsisText[0])) {
					$(this).addClass('is-ellipsis');
					$(this).append('<button type="button" class="btn-more js-btn-more"><span class="text">더보기</span> <i class="ico-more"></i></button>');
				}

				$(this).find('.js-btn-more').off('click').on('click', function (event) {
					if($(event.currentTarget).closest('.category-box').hasClass('is-more')){
						$(event.currentTarget).closest('.category-box').removeClass('is-more');
						$(event.currentTarget).find('.text').text('더보기');
					}else{
						$(event.currentTarget).closest('.category-box').addClass('is-more');
						$(event.currentTarget).find('.text').text('닫기');
					}
				});
			});
		}
	}

	/**
	 * jQuery UI Datepicker 생성
	 */
	function setDatepicker() {
		$.datepicker.setDefaults({
			dateFormat: 'yy.mm.dd',
			monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
			showMonthAfterYear: true,
			showOn: 'both',
			buttonImage: '../../resources/images/ui/form/form_ico_datepicker.png',
			buttonImageOnly: false,
			showOtherMonths: true,
			selectOtherMonths: false,
			changeMonth: true,
			changeYear: true,
		});

		if ($('.js-datepicker-box').length > 0) {
			$('.js-datepicker-box input').each(function (index) {
				var isDisabled;
				isDisabled = $(this).attr('disabled');

				// 한글 입력 막기
				$(this).off('input').on('input', function (event) {
					this.value = this.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
				});

				$(this).datepicker({
					disabled: isDisabled,
				});

				// 언어셋 영문일때 요일 변경
				if($('html').attr('lang') === 'en'){
					$(this).datepicker('option', 'dayNamesMin', ['SUN','MON','TUE','WED','THU','FRI','SAT']);
				}
			})
		}
	}

	/**
	 * jQuery UI 탭 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .js-tab)
	 */
	function setUITabs(selector) {
		selector = selector || '.js-tab';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var disabledTabs;
				disabledTabs = [];
				if ($(this).hasClass('anchor-tab')) {
					return;
				}
				$(this).find('> .tab-list .tabs .tab-link').each(function (index) {
					if ($(this).hasClass('tab-disabled')) {
						disabledTabs.push(index);
					}
				});
				$(this).tabs({
					disabled: disabledTabs,
					create: function (event, ui) {
					},
					beforeActivate: function (event, ui) {
						if ($(ui.newTab).find('a').attr('href').indexOf('#') !== 0) {
							window.open($(ui.newTab).find('a').attr('href'), '_self');
						}
					},
					activate: function(event, ui){
						// tab active 시, 하단 버튼 offset set
						if($(this).closest('.ui-dialog-contents').length > 0){
							var container = $(this).closest('.ui-dialog-contents');
							tabActiveFooterPos(container);
						}else{
							tabActiveFooterPos();
						}
					}
				});
			});
		}
	}

	/**
	 * 리스트 순서 변경 20201224 추가
	 * @param list parent DOM 셀렉터(default : .js-change-list)
	 */
	function setMoveList(selector){
		selector = selector || '.js-change-list';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				$(this).sortable({
					axis: 'y',
					items: $(this).find('> li'),
					handle: $(this).find('.js-btn-move-list'),
					cancel: $(this).find('.js-cancel-area'),
				});
			});
		}
	}

	/**
	 * 포틀릿 탭 menu active
	 * @param tab list DOM 셀렉터(default : .js-portlet-tab-list)
	 */
	function setPortletTabMenuActive(selector){
		selector = selector || '.js-portlet-tab-list';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var papa = $(this);
				papa.find('.btn-category').on('click', function(){
					papa.find('.tab-item').removeClass('is-active');
					$(this).closest('.tab-item').addClass('is-active');
				});
			});
		}
	}

	/**
	 * 기본 UI 설정
	 * @param selector 특정 영역 하위 기본 UI 설정을 위한 DOM 셀렉터
	 */
	function initUI(selector) {
		var initSelector;
		initSelector = {
			tableCaption: selector ? selector + ' .tbl-wrap table' : '.tbl-wrap table',
			tab: selector ? selector + ' .js-tab' : '.js-tab',
			dialog: selector ? selector + ' .ui-dialog-contents' : '.ui-dialog-contents',
			dialogBtn: selector ? selector + ' [data-popup-trigger]' : '[data-popup-trigger]',
			fold: selector ? selector + ' .js-fold' : '.js-fold',
		};

		setUIDialog(initSelector.dialogBtn, initSelector.dialog);
		setTableCaption(initSelector.tableCaption);
		setUITabs(initSelector.tab);
		setFoldBox(initSelector.fold);
		setMoreListBox()
		setDatepicker()
		setBtnGoTop();
		setHeader();
		setInputClear();
		dropdownOnOff();
		toastBtnTrigger();
		setMoveList();
		setPortletTabMenuActive();
	}

	// s : Public 접근 가능한 변수 함수로 선언
	_front.setTableCaption = setTableCaption;
	_front.setUIDialog = setUIDialog;
	_front.setUITabs = setUITabs;
	_front.setFoldBox = setFoldBox;
	_front.setToastMessage = setToastMessage;
	_front.setBtnGoTop = setBtnGoTop;
	_front.setFooterPos = setFooterPos;
	_front.tabActiveFooterPos = tabActiveFooterPos;
	_front.setMoveList = setMoveList;
	_front.initUI = initUI;
	// e : Public 접근 가능한 변수 함수로 선언

	$(document).on("touchstart", function (e) {

	});

	$(document).on("touchend", function (e) {
		/* ios safari 키보드 노출 된 상태로 스크롤 발생 시, 하단 고정 nav bar 만큼 스크롤 영역이 추가로 발생하여
		 	키보드 노출상태에서 touchend 이벤트 발생 시, input에서 focusout하여 키보드 미노출 함 */
		if($(':focus').is('textarea, input[type="text"]')) $(':focus').blur();
	});

	$(document).ready(function (event) {
		// 공통 UI 스크립트
		initUI();
	});

	return _front;
})();
