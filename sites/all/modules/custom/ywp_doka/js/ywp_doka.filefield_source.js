/**
 * Provides Doka Image Editor filefield source field.
 */

(function ($) {

  Drupal.behaviors.ywpDokaFilefieldSource = {
    attach: function (context) {
      $('.filefield-source-doka', context).once('ywpDokaFilefieldSource', function () {
        const {
          // editor
          openEditor,
          createDefaultImageReader,
          createDefaultImageWriter,
          locale_en_gb,

          // plugins
          plugin_crop_defaults,
          plugin_crop_locale_en_gb,
          plugin_filter_defaults,
          plugin_filter_locale_en_gb,
          plugin_finetune_defaults,
          plugin_finetune_locale_en_gb,
          plugin_decorate_defaults,
          plugin_decorate_locale_en_gb,
          component_shape_editor_locale_en_gb,
        } = window.doka

        const $this = $(this);
        const $select = $this.find('.filefield-source-doka-select');
        const $file = $this.find('.filefield-source-doka-file');
        const $filename = $this.find('.filefield-source-doka-filename');
        const $contents = $this.find('.filefield-source-doka-contents');
        const $submit = $this.find('.filefield-source-doka-submit');

        // Open file browser on "Select" button clicks.
        $select.click(function (e) {
          $file.click();
          e.preventDefault();
        })

        // Do the stuff when the file is selected.
        $file.change(function () {
          if (this.files && this.files.length) {

            // Create the Doka instance.
            const editor = openEditor({
              src: this.files[0],
              imageReader: createDefaultImageReader(),
              imageWriter: createDefaultImageWriter(),
              ...plugin_crop_defaults,
              ...plugin_filter_defaults,
              ...plugin_finetune_defaults,
              ...plugin_decorate_defaults,
              locale: {
                ...locale_en_gb,
                ...plugin_crop_locale_en_gb,
                ...plugin_finetune_locale_en_gb,
                ...plugin_filter_locale_en_gb,
                ...plugin_decorate_locale_en_gb,
                ...component_shape_editor_locale_en_gb,
              },
            });

            // Clear the file input as it's no more needed.
            $file.val(null);

            // Do the stuff when image is ready.
            editor.on('process', function (res) {
              const file = res.dest;
              const reader = new FileReader();

              // Set file name.
              $filename.val(file.name);

              // Read and set file contents.
              reader.readAsDataURL(file);
              reader.onload = function () {
                $contents.val(reader.result);

                // Upload the form automatically when file contents is set.
                $submit.val('Uploading...');
                $submit.mousedown();

                // Change the "Select file" button appearance.
                $select.prop('disabled', true);
                $select.hide();
              };
            });
          }
        });
      });
    }

  }

})(jQuery);
