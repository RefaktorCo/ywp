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
                          merge: true,
                          nav: true,
                          dots: false,
                          autoplay: false,
                          autoplayTimeout: 5000,
                          loop: true,
//                          responsive: {
//                            0: {
//                              items: 1,
//                            },
//                            768: {
//                              items: 2,
//                            },
//                            992: {
//                              items: 3,
//                            }
//                          }
                        });
              });
//      $('.view-thanks-for-all-your-support- .owl-carousel', context)
//          .each(function () {
//            $(this)
//                .owlCarousel({
//                  margin:10,
//                  loop:true,
//                  nav: true,
//                  dots: false,
//                  autoWidth:true,
//                  items:4
//                });
//          });
    }
  }

})(jQuery);
