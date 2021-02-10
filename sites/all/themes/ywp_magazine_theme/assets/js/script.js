// Rigger library handles these imports:
/**
 * YWP Theme tools.
 */

(function ($) {

  Drupal.ywpTools = Drupal.ywpTools || {};

  /**
   * Checks whether screen size matches given Bootstrap breakpoint.
   *
   * @param {string} breakpoint
   *   Breakpoint name ("sm", "md" or "lg") or breakpoint-and-up name ("sm-up",
   *   "md-up" or "lg-up").
   *
   * @returns {*}
   */
  Drupal.ywpTools.checkBreakpoint = function (breakpoint) {
    return $('#ywp-is-' + breakpoint).is(':visible');
  }

})(jQuery);
/**
 * @file
 * Sidebar script.
 */

(function ($) {

  Drupal.behaviors.ywpMagazineThemeSidebar = {
    attach: function (context) {
      $(context)
          .find('.region-sidebar')
          .once('ywpMagazineThemeSidebar')
          .each(function () {
            var $sidebar = $(this),
                $toggler = $sidebar.find('.sidebar-toggler');

            $toggler.click(function (e) {
              $sidebar.toggleClass('open');
              e.preventDefault();
            });

          });
    }
  }

})(jQuery);
/**
 * @file
 * Magazine node.
 */

(function ($) {

  Drupal.behaviors.ywpMagazineThemeMagazineNodeFull = {
    attach: function (context) {
      $('.node-magazine.view-mode-full', context)
          .once('ywpMagazineThemeMagazineNodeFull')
          .each(function () {
            var $node = $(this),
                $pagesScroll = $node
                    .children('.paragraphs-items-field-magazine-pages')
                    .children('.field-name-field-magazine-pages')
                    .children('.field-items');

            $pagesScroll.mCustomScrollbar({
              axis: 'x',
              scrollbarPosition: 'outside'
            });

            // Allows scrolling magazine pages with mouse.
            var $scrollContainer = $pagesScroll.find('.mCSB_container'),
                touchEnabled = false,
                scrollInterval,
                scrollDirection = 0,
                scrollWidth = $pagesScroll.width();

            // Checks if we are on the device with touch support.
            $scrollContainer.on('touchstart pointerdown MSPointerDown', function (event)  {
              var t = event.originalEvent.pointerType;
              if (!t || t === 'touch' || t === 2) {
                touchEnabled = true;
                clearInterval(scrollInterval);
              }
            });

            // Start scrolling when mouse enters scrolling container.
            $scrollContainer.on('mouseenter', function () {
              scrollInterval = setScrollInterval();
            });

            // When mouse is moving inside scrolling container, look for
            // scrolling direction change and restart scrolling if needed.
            $scrollContainer.on('mousemove', function (event) {
              var newScrollDirection = event.clientX > 4 * scrollWidth / 5  ? -1 : (event.clientX < scrollWidth / 5 ? 1 : 0);
              if (newScrollDirection !== scrollDirection) {
                scrollDirection = newScrollDirection;
                clearInterval(scrollInterval);
                scrollInterval = setScrollInterval();
              }
            });

            // Stop scrolling when mouse leaves scrolling container.
            $scrollContainer.on('mouseleave', function () {
              clearInterval(scrollInterval);
            });

            // Re-calculate scrolling container width on window resize.
            $(window).resize(function () {
              scrollWidth = $scrollContainer.width();
            });

            if (location.hash) {
              var initialPage = location.hash.substr(1),
                  initialPageLink = $('a[href="/ajax/thevoice/page/' + initialPage + '"]');
              if (initialPageLink.length) {}
              initialPageLink.click();
            }

            /**
             * Sets and returns scrolling interval.
             *
             * @returns {number}
             */
            function setScrollInterval() {
              if (!touchEnabled && scrollDirection) {
                return setInterval(function () {
                  var offset = 10 * scrollDirection;
                  $pagesScroll.mCustomScrollbar('scrollTo', '+=' + offset, {
                    scrollInertia: 0,
                    timeout: 0
                  });
                }, 20);
              }
              return 0;
            }

          });
    }
  }

})(jQuery);
/**
 * @file
 * Magazine single page.
 */

(function ($) {

  Drupal.behaviors.ywpMagazineThemeMagazinePageFull = {
    attach: function (context) {
      $('.entity-paragraphs-item.paragraphs-item-magazine-page.view-mode-full', context)
          .once('ywpMagazineThemeMagazinePageFull')
          .each(function() {
            var $page = $(this),
                $column_media = $page.find('.column-media'),
                $page_media_items = $column_media.find('.field-name-field-magazine-page-media > .field-items'),
                $page_media_images = $page_media_items.find('img'),
                $comments_wrapper = $page.find('.paragraph-comments'),
                $comments_toggle = $page.find('.comments-toggle');

            if ($page_media_items.children('.field-item').length > 1) {
              // Initialize Owl Carousel.
              var owl_carousel = $page_media_items
                  .addClass('owl-carousel')
                  .owlCarousel({
                    items: 1,
                    margin: 10,
                    autoHeight: true,
                    nav: true
                  });

              // Refresh Owl Carousel when first image loads to fit it size.
              $page_media_images.first().load(function () {
                owl_carousel.trigger('refresh.owl.carousel');
              });
            }

            alignHeights();
            $(window).resize(alignHeights);

            $comments_toggle.click(function () {
              $comments_wrapper.toggleClass('d-md-none');
              return false;
            });

            /**
             * Aligns element heights so that:
             * - Images are always fully visible.
             * - Elements with .ywp-full-height class cover all space.
             */
            function alignHeights() {
              var height, hasCarousel, hasAuthors, maxHeight;
              if (Drupal.ywpTools.checkBreakpoint('md-up')) {
                height = $column_media.height();
                hasCarousel = $page_media_items.find('.owl-nav').length > 0;
                hasAuthors = $page_media_items.find('.field-name-field-media-author').length > 0 ;
                maxHeight = height
                    - (hasCarousel ? 58 : 0) // Slider navbar is about 58px high
                    - (hasAuthors ? 32 : 0); // Author block is 32px high
              }
              else {
                maxHeight = '';
              }
              // Set image max height so they are always fully visible.
              $page_media_images.css({
                maxHeight: maxHeight
              });
              // Set elements height so they cover all available space.
              $column_media.find('.ywp-full-height').css({
                height: maxHeight
              });
            }

          });
    }
  }

})(jQuery);
//# sourceMappingURL=script.js.map
