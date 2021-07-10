/**
 * @file
 * Initializes the Pintura editor.
 */

(function ($) {

  Drupal.behaviors.ywpPinturaInit = {
    attach: function (context) {
      $('body', context).once('ywpPinturaInit', function () {
        const {
          setPlugins,
          plugin_crop,
          plugin_filter,
          plugin_finetune
        } = window.pintura
        setPlugins(plugin_crop, plugin_filter, plugin_finetune);
      });
    }
  }

})(jQuery);
