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
      $('.view-thanks-for-all-your-support- .owl-carousel', context)
              .each(function () {
                $(this)
                        .owlCarousel({
                          margin: 10,
                          nav: true,
                          dots: false,
                          autoWidth: true,
                          loop: false,
                          items: 4,
                          responsive: {
                            0: {
                              items: 1,
                            },
                            768: {
                              items: 2,
                            },
                            992: {
                              items: 3,
                            },
                            1180: {
                              items: 4,
                            }
                          }
                        });
              });

    }
  }

})(jQuery);
