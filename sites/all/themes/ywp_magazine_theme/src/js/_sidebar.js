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
