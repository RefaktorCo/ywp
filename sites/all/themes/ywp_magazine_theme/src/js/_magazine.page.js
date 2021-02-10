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