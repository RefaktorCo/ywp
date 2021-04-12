/**
 * @file
 * Initializes the Doka editor.
 */

(function ($) {

  Drupal.behaviors.ywpDokaInit = {
    attach: function (context) {
      $('body', context).once('ywpDokaInit', function () {
        const {
          setPlugins,
          plugin_crop,
          plugin_filter,
          plugin_finetune,
          plugin_decorate
        } = window.doka
        setPlugins(plugin_crop, plugin_filter, plugin_finetune, plugin_decorate);
      });
    }
  }

})(jQuery);
