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