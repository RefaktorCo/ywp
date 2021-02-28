// Create the instance
console.log('Image field exist');
[
  {supported: 'Promise' in window, fill: 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js'},
  {supported: 'fetch' in window, fill: 'https://cdn.jsdelivr.net/npm/fetch-polyfill@0.8.2/fetch.min.js'},
  {supported: 'CustomEvent' in window && 'log10' in Math && 'sign' in Math && 'assign' in Object && 'from' in Array &&
            ['find', 'findIndex', 'includes'].reduce(function (previous, prop) {
      return (prop in Array.prototype) ? previous : false;
    }, true), fill: '../doka/bin/polyfill/doka.polyfill.min.js'}
].forEach(function (p) {
  if (p.supported)
    return;
  document.write('<script src="' + p.fill + '"><\/script>');
});

(function ($) {

  Drupal.behaviors.Doka = {
    attach: function (context) {


      function FilePondDoka() {
        FilePond.registerPlugin(
                FilePondPluginImageExifOrientation,
                FilePondPluginImagePreview,
                FilePondPluginImageCrop,
                FilePondPluginImageResize,
                FilePondPluginImageTransform,
                FilePondPluginImageEdit
                );

        FilePond.create(document.querySelector('#edit-field-image .form-file'), {

          // default crop aspect ratio
          imageCropAspectRatio: 1,

          // resize to width of 200
          // imageResizeTargetWidth: 200,

          // open editor on image drop
          imageEditInstantEdit: true,
          server: {
            url: '/sites/default/files/private/',
          },
          // configure Doka
          imageEditEditor: Doka.create({
            cropAspectRatioOptions: [
              {
                label: 'Free',
                value: null
              },
              {
                label: 'Portrait',
                value: 1.25
              },
              {
                label: 'Square',
                value: 1
              },
              {
                label: 'Landscape',
                value: .75
              }
            ]
          })

        });
      }

FilePondDoka();

      $(document).ajaxComplete(function () {
        console.log('AJAX');
        FilePondDoka();
      });

    }
  };
}
)(jQuery);