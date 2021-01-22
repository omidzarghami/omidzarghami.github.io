jQuery(function($){

	"use strict";

	/*------------------------------------------------------------------
		Passed Options From Back-End
	------------------------------------------------------------------*/

	var home_url = ronika_data.home_url;
	var lightbox_gallery_mode = ronika_data.lightbox_gallery_mode;
	var lightbox_close_button = ronika_data.lightbox_close_button;
	var lightbox_close_button_position = ronika_data.lightbox_close_button_position;
	var lightbox_align = ronika_data.lightbox_align;
	var navigation_scroll_speed = ronika_data.navigation_scroll_speed;
	var animation_switch = ronika_data.animation_switch;
	var sticky_header_switch = ronika_data.sticky_header_switch;


	/*------------------------------------------------------------------
		Provide fallback for SVGs
	------------------------------------------------------------------*/

	if (!Modernizr.svg) {
		$('img[src$="svg"]').attr('src', function() {
			return $(this).attr('src').replace('.svg', '.png');
		});
	}


	/*------------------------------------------------------------------
		Ronika Gallery Slider
	------------------------------------------------------------------*/

	var ronika_gallery_slider = 0;

	$('.ronika-gallery-items').imagesLoaded().always( function( instance ) {
		
		$('.ronika-gallery-items').isotope({
			itemSelector : '.item',
			layoutMode: 'fitColumns',
			animationEngine : 'jquery'
		}, function() {
			$(this).find('img').css('height','auto');
			var i = 0,
			$children = $(this).children('.isotope-item'),
			children_size = $children.size();
			var interval = setInterval( function() {
				$children.eq(i).addClass('stage-ready');
				i++;
				if ( i > children_size ) clearInterval(interval);
			}, 300);
		});

		if ( $('.ronika-gallery-items').width() > $('.ronika-gallery-items').parent().width() + 25 ) {
			TweenLite.to( $('#scrollbar'), 2, { css: { 'opacity': '1' }, ease: Power2.easeInOut, delay: 0 });
		}


		ronika_gallery_slider = new Sly( jQuery(".ronika-gallery-slider"), {
			scrollBar : '#scrollbar',
			horizontal: 1,
			scrollBy: 100,
			dragHandle: 1,
			dynamicHandle: 1,
			itemNav: 0,
			clickBar: 1,
			speed: 600,
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing:  1,
			swingSpeed: 0.1,
			elasticBounds: 1,
			cycleBy: null,
			cycleInterval: 4000
		}).init();


		$('.ronika-gallery-items .mfp').magnificPopup({
			type: 'inline',
			gallery: {
				enabled: Boolean(parseInt(lightbox_gallery_mode, 10))
			},
			removalDelay: 600,
			showCloseBtn: Boolean(parseInt(lightbox_close_button, 10)),
			closeBtnInside: (lightbox_close_button_position == 'true'),
			alignTop: (lightbox_align == 'true'),
			mainClass: 'mfp-fade'
		});

	});


	/*------------------------------------------------------------------
		Responsive Main Menu
	------------------------------------------------------------------*/

	selectnav('main-navigation' , {
		indent: '»'
	});


	/*------------------------------------------------------------------
		Main Menu
	------------------------------------------------------------------*/

	if ( $('body').hasClass('home') && $('body').hasClass('page-template-template-home-php') ) {

		var mainnav_offset = 83,
		mainnav_offset_mobile = 80;

		if ( sticky_header_switch == 0 ) {
			mainnav_offset = 0;
			mainnav_offset_mobile = 0;
		}

		$('#main-navigation').onePageNav({
			currentClass: 'current_page_item',
			changeHash: false,
			scrollSpeed: parseInt(navigation_scroll_speed, 10),
			scrollOffset: mainnav_offset,
			scrollThreshold: 0.5,
			filter: ':not(.external)',
			easing: 'easeInOutExpo'
		});

		var page_url = window.location.href,
		hash = page_url.substring( page_url.lastIndexOf("#") + 1 );
		if ( $('div[id="' + hash + '"]' ).length > 0 ) {
			var top = $('div[id="' + hash + '"]' ).offset().top - mainnav_offset;
			$("html, body").animate({ scrollTop : top } , 600, 'easeInOutExpo');
		}
		
	}

	$('#selectnav1').change( function() { 
		var target = $(this).val(),
		index = target.indexOf("#"),
		target = target.substring(index);
		$(window).scrollTop( $(target).offset().top - mainnav_offset_mobile);
		return false; 
	});


	// Center Sub Menu 
	$('#main-navigation').children('li').hover( function() {
		if ( $(this).children('ul').length > 0 ) {
			var li_width = $(this).outerWidth(false),
			sub = $(this).children('ul'),
			sub_width = sub.outerWidth(),
			point = null;
			if ( sub_width > li_width ) {
				point = (sub_width/2) - (li_width/2);
				sub.css('left',-point);
			} else {
				point = (li_width/2) - (sub_width/2);
				sub.css('left', point);
			}
		}
	});


	/*------------------------------------------------------------------
		Animate Elements
	------------------------------------------------------------------*/

	function animate( $element, speed, delay, offset, state ) {

		if ( state === 'scale-up') {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', scaleX: 0.9 * offset, scaleY: 0.9 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', scaleX: 1, scaleY: 1}, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'scale-down' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', scaleX: 1.1 * offset, scaleY: 1.1 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', scaleX: 1, scaleY: 1}, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'fade' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0' } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', x: 0, y: 0 }, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'fade-from-top' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', y: -35 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', x: 0, y: 0 }, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'fade-from-bottom' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', y: 35 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', x: 0, y: 0 }, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'fade-from-left' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', x: -35 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', x: 0, y: 0 }, ease: Power4.easeInOut, delay: delay });
		} else if ( state === 'fade-from-right' ) {
			TweenLite.to( $element, 0, { css: { 'opacity': '0', x: 35 * offset } } );
			TweenLite.to( $element, speed, { css: { 'opacity': '1', x: 0, y: 0 }, ease: Power4.easeInOut, delay: delay });
		}

	}


	if ( Modernizr.touch && animation_switch == 0 ) {  // If it was a touch device and animation is off

		// Avoid scolling animation on touch devices

	} else {

			$('.effect-scale-up, .effect-scale-down, .effect-fade, .effect-fade-from-top, .effect-fade-from-bottom, .effect-fade-from-left, .effect-fade-from-right').each( function() {
				TweenLite.to(
					$(this),
					0,
					{
						css: {
							'opacity': '0'
						}
					}
				);
			});

			$('.effect-scale-up').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'scale-up' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-scale-down').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'scale-down' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-fade').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'fade' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-fade-from-top').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'fade-from-top' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-fade-from-bottom').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'fade-from-bottom' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-fade-from-left').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'fade-from-left' );
			}, { offset: '90%' , triggerOnce: true });

			$('.effect-fade-from-right').waypoint( function() {
				animate( $(this), $(this).attr('data-effect-speed'), $(this).attr('data-effect-delay'), $(this).attr('data-effect-offset'), 'fade-from-right' );
			}, { offset: '90%' , triggerOnce: true });


			TweenLite.to( $('.default-animate'), 0, { css:{ 'opacity': '0', scaleX: 0.9, scaleY: 0.9 }});
			TweenLite.to( $('.title-animate span'), 0, { css:{ 'opacity': '0', scaleX: 0.1, scaleY: 0.1 }});
			TweenLite.to( $('.title-animate strong'), 0, { css:{ 'opacity': '0', x: -80 }});
			TweenLite.to( $('.content-container.centering .title-animate'), 0, { css:{ 'opacity': '0', y: -40 }});
			TweenLite.to( $('.content-container.centering .title-animate strong'), 0, { css:{ 'opacity': '1', y: 0, x: 0 }});

			$('.default-animate').waypoint( function() {
				animate( $(this), 1, 0 );
			}, { offset: '90%' , triggerOnce: true });

			$('.title-animate').waypoint( function() {
				TweenLite.to( $(this).children('span'), 1, { css: { 'opacity': '1', scaleX: 1, scaleY: 1 }, ease: Power4.easeInOut, delay: 0 });
				TweenLite.to( $(this).children('strong'), 1, { css: { 'opacity': '1', x: 0 }, ease: Power4.easeInOut, delay: 0.6 });
			}, { offset: '90%' , triggerOnce: true });

			$('.content-container.centering .title-animate').waypoint( function() {
				TweenLite.to( $(this), 1, { css: { 'opacity': '1', y: 0 }, ease: Power4.easeInOut, delay: 0 });
			}, { offset: '90%' , triggerOnce: true });

	}


	/*------------------------------------------------------------------
		Flexslider Initializing
	------------------------------------------------------------------*/

	$('.flexslider').flexslider({
		animation: "fade",
		directionNav: true,
		controlNav: false,
		smoothHeight: true
	});
	

	/*------------------------------------------------------------------
		Background Parallax Effect
	------------------------------------------------------------------*/

	if ( !Modernizr.touch ) {
		if ( $(window).width() > 961 ) {
			$.stellar({
				horizontalScrolling: false,
				verticalScrolling: true,
				horizontalOffset: 0,
				verticalOffset: 0,
				responsive: false,
				scrollProperty: 'scroll',
				positionProperty: 'position',
				parallaxBackgrounds: true,
				parallaxElements: false,

			});
		}
	}


	/*------------------------------------------------------------------
		Alerts
	------------------------------------------------------------------*/

	$('.alert-message').click( function() {
		TweenLite.to( $(this), 0.6, { css: { 'opacity': '0', scaleX: 1.1, scaleY: 1.1, 'display' : 'none' }, delay: 0 });
	});


	/*------------------------------------------------------------------
		Skills
	------------------------------------------------------------------*/

	$('.skill').css( 'width', function() {
		return $(this).attr('data-size');
	});


    /*------------------------------------------------------------------
		Gap
	------------------------------------------------------------------*/

	$('.gap').css('height', function () {
	    return $(this).attr('data-height-size');
	});


	/*------------------------------------------------------------------
		Featured Portfollio Hover
	------------------------------------------------------------------*/

	$('.portfolio-image').hover( function() {
		$(this).children('.portfolio-hover').css( 'height', function() {
			return $(this).parent().height();
		});
	});


	/*------------------------------------------------------------------
		Featured Portfolio Lightbox
	------------------------------------------------------------------*/

	$('.featured-portfolio').magnificPopup({
		type: 'inline',
		delegate: 'a.item-format',
		gallery: {
			enabled: Boolean(parseInt(lightbox_gallery_mode, 10))
		},
		removalDelay: 600,
		showCloseBtn: Boolean(parseInt(lightbox_close_button, 10)),
		closeBtnInside: (lightbox_close_button_position == 'true'),
		alignTop: (lightbox_align == 'true'),
		mainClass: 'mfp-fade'
	});


	/*------------------------------------------------------------------
		Enquire
	------------------------------------------------------------------*/

	var screen_sizes = ['large-desktop','small-desktop','tablet','phone'].join(' ');
	function body_class(size) {
		$('body').removeClass(screen_sizes);
		$('body').addClass(size);
	}

	enquire.register("screen and (min-width: 1183px)", {

		match : function() {
			body_class('large-desktop');
			$('.page-container, .blog-container').css({
				marginTop : ''
			});
		}

	}).register("screen and (min-width: 962px) and (max-width: 1182px)", {

		match : function() {
			body_class('small-desktop');
			$('.page-container, .blog-container').css({
				marginTop : ''
			});
		}

	}).register("screen and (min-width: 481px) and (max-width: 961px)", {

		match : function() {
			body_class('tablet');
			$('.page-container, .blog-container').css({
				marginTop : function() {
					return $('.header').outerHeight();
				}
			});
		}

	}).register("screen and (max-width: 480px)", {

		match : function() {
			body_class('phone');
			$('.page-container, .blog-container').css({
				marginTop : function() {
					return $('.header').outerHeight();
				}
			});
		}

	});


	/*------------------------------------------------------------------
		Sticky Header
	------------------------------------------------------------------*/

	function update_header_func() {

		if ( sticky_header_switch == 1 ) {  // If sticky header switch was on

			var window_scroll = jQuery(window).scrollTop();
			if ( jQuery('body').hasClass('tablet') || jQuery('body').hasClass('phone') ) {
				if ( window_scroll > 50 ) {
					jQuery('.header').addClass('on-scroll on-touch');
					jQuery('.page-container').addClass('sticky-header-on');
					jQuery('.blog-container').addClass('sticky-header-on');
				} else {
					jQuery('.header').removeClass('on-scroll on-touch');
					jQuery('.page-container').removeClass('sticky-header-on');
					jQuery('.blog-container').removeClass('sticky-header-on');
					setTimeout( function() {
						jQuery('.page-container, .blog-container').css({
							marginTop : function() {
								return jQuery('.header').outerHeight();
							}
						});
					} , 300);
				}
			} else if ( window_scroll > 50 ) {
				jQuery('.header').removeClass('on-touch');
				jQuery('.header').addClass('on-scroll');
			} else {
				jQuery('.header').removeClass('on-scroll on-touch');
			}

		}

		if ( ronika_gallery_slider !== 0 ) {  // If Ronika Gallery Slider was enable
			setTimeout( function() {
				ronika_gallery_slider.reload();
			}, 1000);
		}
		
	}

	var update_header = _.throttle( update_header_func, 100);

	jQuery(window).scroll(update_header);
	jQuery(window).resize(update_header);


	/*------------------------------------------------------------------
		Comment List Width Calc
	------------------------------------------------------------------*/

	function update_comment_width_func() {

		if ( jQuery(window).width() < 961 ) {
			jQuery('.comment-meta').css( 'width' , function() {
				var parent_width = jQuery(this).parent().width(),
				avatar_width = jQuery(this).siblings('.avatar-border').width(),
				comment_header_width = (parent_width - avatar_width) - 20;
				return comment_header_width;
			});
		} else {
			jQuery('.comment-meta').css('width', '');
		}

	}

	update_comment_width_func();  // Execute once after DOM loaded
	var update_comment_width = _.throttle( update_comment_width_func, 100);

	jQuery(window).resize(update_comment_width);


	/*------------------------------------------------------------------
		Fixing & Polishing
	------------------------------------------------------------------*/

	$("body").fitVids();


});