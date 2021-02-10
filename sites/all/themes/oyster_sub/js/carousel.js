/**
 * @file
 * Converts some image fields into carousels.
 */
(function ($) {

  /**
   * Adds Ow.Carousel to Article "slideshow" field.
   */
  Drupal.behaviors.ywpArticleOwlCarousel = {
    attach: function (context) {
      $('.field-name-field-slideshow.owl-carousel', context)
          .each(function () {
            $(this)
                .owlCarousel({
                  items: 1,
                  margin: 10,
                  autoHeight: true,
                  nav: false,
                  autoplay: true,
                  autoplayTimeout: 5000,
                  loop: true
                });
          });
    }
  }

})(jQuery);
