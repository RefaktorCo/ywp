/**
 * Provides JS dialog functionality built on the top of Magnific Popup library.
 */

(function($) {

  // Open dialog on element click.
  Drupal.behaviors.ywpDialog = {
    attach: function(context) {

        // Inline content.
        $('.mfp-inline', context)
          .once('ywpDialogInline', function() {
            var $link = $(this),
                src = $link.attr('href') || $link.data('target'),
                title = $link.data('mfp-title') || $link.attr('title'),
                options = $link.data('mfp-options');

            // Prepare dialog options.
            options = Drupal.ywpDialog.optionsInline(src, title, options);

            // Open dialog on $link click.
            $link.magnificPopup(options);

          }); // Inline content.

        // Content loaded by AJAX.
        $('.mfp-ajax', context)
          .once('ywpDialogAjax', function() {
            var $link = $(this),
                href = $link.attr('href'),
                title = $link.data('mfp-title') || $link.attr('title'),
                options = $link.data('mfp-options');

            // Prepare dialog options.
            options = Drupal.ywpDialog.optionsAjax(href, title, options);

            // Open dialog on $link click.
            $link.magnificPopup(options);

          }); // Content loaded by AJAX

        // Image gallery.
        $('.mfp-gallery', context)
          .once('ywpDialogGallery')
          .magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
              enabled: true,
              navigateByImgClick: true,
              preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            }
          });

        // Update AJAX dialog content.
        $('.mfp-update-ajax[href]', context)
            .once('ywpDialogUpdateAjax')
            .click(function (e) {
              var $this = $(this),
                  url = $this.attr('href');

              $this.closest('.mfp-ajax-content-wrapper').children('div')
                  .replaceWith('<div id="mfp-ajax-content"></div>');

              Drupal.ywpDialog.callAjax(url);

              e.preventDefault();
            });

    }
  };

  // Show popups, i.e. dialogs that start automatically on page load.
  Drupal.behaviors.ywpDialogPopups = {
    attach: function (context, settings) {

      $('body', context)
        .once('ywpDialogPopups', function () {
          if (settings.ywpDialog && settings.ywpDialog.popup) {
            // Just shortcuts.
            var popup = settings.ywpDialog.popup,
                type = popup.type,
                src = popup.src,
                title = popup.title,
                options = popup.options;

            // Show popup.
            Drupal.ywpDialog.open(type, src, title, options);
          }
        });
    }
  };

  // YWP Dialog API.
  Drupal.ywpDialog = Drupal.ywpDialog || {};

  /**
   * Immediately opens dialog.
   *
   * @param {string} type
   *   Dialog type. Either 'inline' or 'ajax'.
   * @param {string} src
   *   Dialog content id prepended with '#' or url of AJAX dialog content.
   * @param {string} title
   *   Dialog title (optional).
   * @param {object} options
   *   Dialog options (optional).
   */
  Drupal.ywpDialog.open = function (type, src, title, options) {

    switch (type) {

      case 'inline':
        // Prepare dialog options.
        options = Drupal.ywpDialog.optionsInline(src, title, options);
        break;

      case 'ajax':
        // Prepare dialog options.
        options = Drupal.ywpDialog.optionsAjax(src, title, options);
        break;
    }

    // Immediately open Magnific Popup dialog.
    $.magnificPopup.open(options);
  };

  /**
   * Immediately closes dialog.
   */
  Drupal.ywpDialog.close = function () {
    // Immediately open Magnific Popup dialog that is currently opened.
    $.magnificPopup.close();
  };

  /**
   * Prepares options for inline dialog.
   *
   * @param {string} src
   *   Source content selector.
   * @param {string} title
   *   Dialog title (optional).
   * @param {object} options
   *   Initial dialog options (optional).
   *
   * @return {object}
   *   Prepared options object.
   */
  Drupal.ywpDialog.optionsInline = function (src, title, options) {
    // Ensure arguments are defined.
    title = title || '';
    options = options || {};

    // Extends initial options with ones required for inline dialog.
    $.extend(options, {
      key: 'inline',
      items: {
        src: src,
        type: 'inline'
      },
      callbacks: {
        open: function() {
          Drupal.ywpDialog.onOpen(this);
        },
        beforeAppend: function() {
          Drupal.ywpDialog.addTitle(this, title);
        },
        close: function() {
          Drupal.ywpDialog.onClose(this);
        }
      }
    });

    return options;
  };

  /**
   * Prepares options for AJAX dialog.
   *
   * @param {string} href
   *   Url to load AJAX content from.
   * @param {string} title
   *   Dialog title (optional).
   * @param {object} options
   *   Initial dialog options (optional).
   *
   * @return {object}
   *   Prepared options object.
   */
  Drupal.ywpDialog.optionsAjax = function (href, title, options) {
    // Ensure optional arguments are defined.
    title = title || '';
    options = options || {};

    $.extend(options, {
      key: 'ajax',
      items: {
        src: '<div class="mfp-ajax-content-wrapper"><div id="mfp-ajax-content"></div></div>',
        type: 'inline'
      },
      callbacks: {
        open: function() {
          Drupal.ywpDialog.onOpen(this);

          // Add special class to dialog container to be able to add
          // special styles to loaded content.
          this.container.addClass('mfp-inline-ajax-holder');
          Drupal.ywpDialog.callAjax(href);
        },
        beforeAppend: function() {
          Drupal.ywpDialog.addTitle(this, title);
        },
        close: function() {
          Drupal.ywpDialog.onClose(this);
        }
      }
    });

    return options;
  };

  /**
   * Default 'mfpOpen' handler.
   *
   * @param dialog
   *   MagnificPopup dialog instance.
   */
  Drupal.ywpDialog.onOpen = function (dialog) {
    // Prevent html from scrolling on mobile.
    $('html').addClass('mfp-prevent-scroll');

    // Fire 'open' event on dialog content.
    dialog.content.trigger('mfpOpen', dialog.ev);

    // Fire 'open' event on document, for global actions that should be bound
    // to dialog open despite of its content.
    $(document).trigger('mfpOpen');
  };

  /**
   * Default 'mfpClose' handler.
   *
   * @param {object} dialog
   *   MagnificPopup dialog instance.
   */
  Drupal.ywpDialog.onClose = function (dialog) {
    // Remove dialog title before dialog close.
    dialog.contentContainer.remove('.mfp-dialog-title');

    // Allow html to scroll again.
    $('html').removeClass('mfp-prevent-scroll');

    // Fire 'close' event on document, for global actions that should be bound
    // to dialog close despite of its content.
    $(document).trigger('mfpClose');
  };

  /**
   * Attaches title bar to the dialog.
   *
   * @param {object} dialog
   *   MagnificPopup dialog instance.
   * @param {string} title
   *   Dialog title.
   */
  Drupal.ywpDialog.addTitle = function (dialog, title) {
    var $contentContainer = dialog.contentContainer;

    // Add dialog title if it's available.
    var $dialogTitle = $('<div class="mfp-dialog-title">' + title + '</div>');

    // Prevent dialog closing on title click.
    $dialogTitle.click(function(e) {
      e.stopPropagation();
    });

    // Add title before dialog content inside content container.
    $contentContainer.prepend($dialogTitle);
  };

  /**
   * Simple cache that stores received AJAX responses.
   *
   * @type {{}}
   */
  Drupal.ywpDialog.ajaxResponses = {};

  /**
   * Performs AJAX call to replace .mfp-ajax-content element.
   *
   * @param {string} href
   *   AJAX url.
   */
  Drupal.ywpDialog.callAjax = function (href) {
    // Drupal AJAX object to be run to load actual dialog content.
    var ajax = new Drupal.ajax('mfp-ajax-content', false, {
      wrapper: 'mfp-ajax-content',
      url: href
    });

    // If AJAX response was cached, fetch it from the cache immediately.
    if (Drupal.ywpDialog.ajaxResponses[href]) {
      ajax.success.apply(ajax, Drupal.ywpDialog.ajaxResponses[href]);
    }
    // Otherwise perform AJAX request and cache its results.
    else {
      // Override AJAX success callback to save response in the cache.
      var success = ajax.options.success;
      ajax.options.success = function (response, status, xmlhttprequest) {
        Drupal.ywpDialog.ajaxResponses[href] = [];
        // Filter response to include only settings and html insert commands
        // into the cache. Otherwise it will load all CSS and JS scripts again
        // and again on every call.
        var r, resp = [];
        for (var i = 0; i < response.length; i++) {
          r = response[i];
          if (r.command === 'settings' || r.command === 'insert' && r.selector !== 'head') {
            resp.push(r);
          }
        }
        Drupal.ywpDialog.ajaxResponses[href].push(resp);
        Drupal.ywpDialog.ajaxResponses[href].push(status);

        return success(response, status, xmlhttprequest);
      };

      // This immediately runs AJAX request.
      ajax.beforeSerialize(ajax.element, ajax.options);
      $.ajax(ajax.options);
    }
  }

})(jQuery);
