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
