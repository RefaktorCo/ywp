/**
 * @file
 * Converts some image fields into carousels.
 */
(function ($) {

  /**
   * Adds Ow.Carousel to Article "slideshow" field.
   */
  Drupal.behaviors.oysterGallery = {
    attach: function (context) {


      $('.gallery-wrap .owl-carousel', context)
        .each(function () {
          $(this)
            .owlCarousel({
              items: 1,
              margin: 0,
              autoHeight: false,
              nav: true,
              dots: false,
              autoplay: true,
              autoplayTimeout: 5000,
              loop: true
            });
        });

      $('.view-thanks-for-all-your-support- .owl-carousel', context)
          .each(function () {
            $(this)
                .owlCarousel({
                  margin:10,
                  loop:true,
                  autoWidth:true,
                  items:4
                });
          });
    }
  }

})(jQuery);
