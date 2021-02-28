/**
 * @file
 * Contains jquery functions for jQuery multiple file upload.
 */

(function($) {
  $(document).ready(function() {
    if ($('.file_upload_field').length > 0) {
      $('.file_upload_field').on('click', function() {
        var $appendElId = '#' + $(this).attr('append-element-id');
        var $uploadedImagesListId = '#' + $(this).attr('uploaded-images-list-id');
      });
    }
  });

  Drupal.behaviors.jquery_upload_fapi = {
    attach: function (context, settings) {
      // Get the settings from the drupal js settings variable array.
      var $image_upload_max = settings.jquery_upload_fapi.image_upload_max;
      var $image_upload_extensions = new RegExp(settings.jquery_upload_fapi.image_upload_extensions);
      var $image_upload_max_number = settings.jquery_upload_fapi.image_upload_max_number;
      var $docs_upload_max = settings.jquery_upload_fapi.docs_upload_max;
      var $docs_upload_extensions = new RegExp(settings.jquery_upload_fapi.docs_upload_extensions);
      var $docs_upload_max_number = settings.jquery_upload_fapi.docs_upload_max_number;

      var $file_upload = $('.file_upload_field');
      // Set the formdata params at the file upload start by binding to the
      // submit submit event.
      $(".file_upload_field:not(bindedsubmit)").bind('fileuploadsubmit', function (e, data) {
        $file_upload = $(this);
        var $attributes = '#' + $file_upload[0].attributes;
        var $appendElId = '#' + $file_upload.attr('append-element-id');
        var $uploadType = $file_upload.attr('upload-type');
        var $themetype = $file_upload.attr('themetype');
        var $uploadedImagesListId = '#' + $file_upload.attr('uploaded-images-list-id');
        if ($uploadType == 'images') {
          $upload_max_number = $image_upload_max_number;
        }
        else {
          $upload_max_number = $docs_upload_max_number;
        }

        data.formData = {
          uploadType: $(this).attr('upload-type'),
          themetype: $(this).attr('themetype'),
        }
      }).addClass('bindedsubmit');
      // Bind the progress event.
      $(".file_upload_field:not(bindedprogress)").bind('fileuploadprogressall', function (e, data) {
        var $file_upload = $(this);
        var $attributes = '#' + $file_upload[0].attributes;
        var $appendElId = '#' + $file_upload.attr('append-element-id');
        if (data.loaded == data.total) {
          $($appendElId).prev('div').find('.progress-throbber').remove();
        }
      }).addClass('bindedprogress');

      // Bind the add event.
      $(".file_upload_field:not(.bindedadd)").bind('fileuploadadd', function (e, data) {
        $file_upload = $(this);
        var $attributes = '#' + $file_upload[0].attributes;
        var $appendElId = '#' + $file_upload.attr('append-element-id');
        var $uploadType = $file_upload.attr('upload-type');
        var $themetype = $file_upload.attr('themetype');
        var $uploadedImagesListId = '#' + $file_upload.attr('uploaded-images-list-id');
        // Remove the error messages that are currently present.
        $($appendElId).children('.upload-error').remove();
      }).addClass('bindedadd');
      $(".file_upload_field:not(.bindedprocessalways)").bind('fileuploadprocessalways', function (e, data) {
        var $file_upload = $(this);
        var $attributes = '#' + $file_upload[0].attributes;
        var $appendElId = '#' + $file_upload.attr('append-element-id');
        var $uploadedImagesListId = '#' + $(this).attr('uploaded-images-list-id');
        var $uploadType = $file_upload.attr('upload-type');
        var $singleUpload = $file_upload.attr('single-upload');

        var index = data.index,
        file = data.files[index];
        var trimmedfilename = filename = file.name;
        fileExtension = filename.substr((filename.lastIndexOf('.') + 1));
        if (filename.length > 20) {
          trimmedfilename = jQuery.trim(filename).substring(0, 18) + '....' + fileExtension;
        }
        if (file.error) {
          $($appendElId).prepend('<div class="upload-error"><span class="upload-error-msg" title="' + file.error + Drupal.t(' for ') + filename + '">' + file.error + Drupal.t(' for ') + '"' + trimmedfilename + '"' + '</span></div>');
        }
        else {
          if ($($appendElId).prev('div').find('.progress-throbber').length == 0) {
            $($appendElId).prev('div').append('<div class="progress-throbber"></div>');
          }
          // Check if the file count is reached the maximum allowed number of files.
          // Set the condition.
          if ($singleUpload) {
            $upload_max_number = 1;
          }
          else {
            if ($uploadType == 'images') {
              $upload_max_number = $image_upload_max_number;
            }
            else {
              $upload_max_number = $docs_upload_max_number;
            }
          }
          if ($($uploadedImagesListId).val() == '') {
            $file_count = 0;
          }
          else {
            $file_count = $($uploadedImagesListId).val().split(',').length;
          }

          // Since we are being uploaded a new file and it is not an error, so we
          // can increment the file count by one and get the new file count.
          var $file_count_new = $file_count + 1;

          // Disable the file upload field if maximum allowed number of file limit
          // reached.
          if ($file_count_new == $upload_max_number) {
            $($file_upload).prop("disabled", true);
            $($file_upload).next().attr('placeholder', Drupal.t("Maximum limit reached"));
            $($file_upload).next().next().addClass('upload-disabled');
          }
          $($appendElId).prev('.form__field').find('.file-upload').removeClass('redBorder');
          $($appendElId).prev('.form__field').find('label.error').remove();
        }
      }).addClass('bindedprocessalways');

      if ($(".file_upload_field").length > 0) {
        $('.upload-images').fileupload({
          url: Drupal.settings.basePath + 'ajax/file-upload/images',
          dataType: 'json',
          maxFileSize: $image_upload_max * (1024 * 1024),
          acceptFileTypes: $image_upload_extensions,
          done: fileUploadDoneCallback
        });
        $('.upload-files').fileupload({
          url: Drupal.settings.basePath + 'ajax/file-upload/images',
          dataType: 'json',
          maxFileSize: $docs_upload_max * (1024 * 1024),
          acceptFileTypes: $docs_upload_extensions,
          done: fileUploadDoneCallback
        });
        $('.file_upload_field').each(function(i, obj) {
          var $file_upload_id = $(this).attr('id');
          var $appendEl = '#' + $(this).attr('append-element-id');
          var $uploadedImagesListId = '#' + $(this).attr('uploaded-images-list-id');
          var $defaultImageStorage = '#' + $(this).attr('default-image-storage');

          $($appendEl).off('.fileRemove');

          $($appendEl).on('click.fileRemove', '.file__delete a', $uploadedImagesListId, function(e) {
            // Disable default click behaviour.
            e.preventDefault();
            // Get the id of the uploaded image from the id of the parent div.
            $removeFileId = $(this).closest('div').attr('id');
            if (typeof $removeFileId != 'undefined') {
              // Split the string of file ids into an array.
              $filesUploadedArray = $($uploadedImagesListId).val().split(",");

              // Remove the item from the added array of elements.
              $index = $filesUploadedArray.indexOf($removeFileId);
              $filesUploadedArray.splice($index, 1);

              // Set the new array of values as the hidden field value.
              $($uploadedImagesListId).val($filesUploadedArray.toString()).triggerHandler('change');

              // Check if the removing element is the default element, then remove it.
              if ($(this).closest('div').attr('id') == $($defaultImageStorage).val()) {
                $($defaultImageStorage).val('');
              }
              // Check new file count and enable the file upload field if its
              // disabled.
              $file_upload = $('#' + $file_upload_id);
              $uploadType = $($file_upload).attr('upload-type');
              if ($uploadType == 'images') {
                $upload_max_number = $image_upload_max_number;
              }
              else {
                $upload_max_number = $docs_upload_max_number;
              }
              if ($($uploadedImagesListId).val().split(",").length < $upload_max_number) {
                $($file_upload).prop("disabled", false);
                $('#max-msg').remove();
                if ($($file_upload).attr('upload-type') == 'images') {
                  $($file_upload).next().attr('placeholder', Drupal.t("Please choose images"));
                  $('.image-upload-placeholder').prop('disabled', true);
                }
                else {
                  $($file_upload).next().attr('placeholder', Drupal.t("Please choose files"));
                  $('.docs-upload-placeholder').prop('disabled', true);
                }
                if ($($file_upload).next().next().hasClass('upload-disabled')) {
                  $($file_upload).next().next().removeClass('upload-disabled');
                }
              }
            }
            // Remove the element from DOM.
            $(this).closest('div').remove();
          });

          // Handle the selection of default image.
          $($appendEl).off('.fileSelectDefault');
          $($appendEl).on('click.fileSelectDefault', '.set-default-image', $defaultImageStorage, function(e) {
            // Disable default click behaviour.
            e.preventDefault();

            // Toggle between the selected and unselected clases for the elements.
            $('.selected').toggleClass('selected unselected');
            $(this).toggleClass('selected unselected');

            // Set the parent div(main div) id as the value of the hidden field
            // to store the default image id.
            $($defaultImageStorage).val($(this).closest('div').attr('id'));
          });
        });
      }
      // Load the existing images from the hidden field.
      if ($file_upload.length > 0) {
        $('.file_upload_field').each(function(i, obj) {
          var $themeType = $(this).attr('themetype');
          var $uploadType = $(this).attr('upload-type');
          var $appendEl = '#' + $(this).attr('append-element-id');
          var $existingFilesId = '#' + $(this).attr('uploaded-images-list-id');
          var $existingFilesValue = $($existingFilesId).val();
          var $defaultImageStorage = '#' + $(this).attr('default-image-storage');
          var $singleUpload = $(this).attr('single-upload');

          // Set maximum upload limit.
          if ($singleUpload) {
            $upload_max_number = 1;
          }
          else {
            if ($uploadType == 'images') {
              $upload_max_number = $image_upload_max_number;
            }
            else {
              $upload_max_number = $docs_upload_max_number;
            }
          }

          // Call the get image list ajax callback.
          if ($existingFilesValue.length > 0) {
            if ($themeType == 'image-default') {
              getImagesList($appendEl, $existingFilesValue, $uploadType, $themeType, $defaultImageStorage);
            }
            else {
              getImagesList($appendEl, $existingFilesValue, $uploadType, $themeType, null);
            }
            if ($existingFilesValue.split(',').length == $upload_max_number) {
              $(this).prop("disabled", true);
              $(this).next().attr('placeholder', Drupal.t("Maximum limit reached"));
              $(this).next().next().addClass('upload-disabled');
            }
          }
        });
      }
    }
  }
  // Done callback for the file upload.
  function fileUploadDoneCallback(e, data) {
    var $image_upload_max_number = Drupal.settings.jquery_upload_fapi.image_upload_max_number;
    var $docs_upload_max_number = Drupal.settings.jquery_upload_fapi.docs_upload_max_number;

    $file_upload = $(this);
    var $attributes = '#' + $file_upload[0].attributes;
    var $appendElId = '#' + $file_upload.attr('append-element-id');
    var $uploadType = $file_upload.attr('upload-type');
    var $themetype = $file_upload.attr('themetype');
    var $uploadedImagesListId = '#' + $file_upload.attr('uploaded-images-list-id');
    var $singleUpload = $file_upload.attr('single-upload');

    // Set the condition.
    if ($singleUpload) {
      $upload_max_number = 1;
    }
    else {
      if ($uploadType == 'images') {
        $upload_max_number = $image_upload_max_number;
      }
      else {
        $upload_max_number = $docs_upload_max_number;
      }
    }
    if ($($uploadedImagesListId).val() == '') {
      $file_count = 0;
    }
    else {
      $file_count = $($uploadedImagesListId).val().split(',').length;
    }
    $file_count_new = $file_count + 1;
    if ($file_count_new <= $upload_max_number) {
      $.each(data.result, function (index, file) {
        // Check if the total file count is greater than maximum number of allowed files.
        if (file.status > 0) {
          // The status will contain the uploaded file id.
          $fid = file.status;
          if ($singleUpload) {
            $($appendElId).html(file.data);
          }
          else {
            $($appendElId).prepend(file.data);
          }

          $filesUploaded = $($uploadedImagesListId).val();
          if ($filesUploaded == '') {
            $default_files = file.status;
          }
          else if ($singleUpload) {
            $default_files = file.status;
          }
          else {
            $default_files = file.status + ',' + $filesUploaded;
          }
          $($uploadedImagesListId).val($default_files).triggerHandler('change');
        }
      });
    }
    if ($file_count_new == $upload_max_number) {
      $($file_upload).prop("disabled", true);
      $($appendElId).prepend("<p id='max-msg'> Maximum Limit Reached. </p>");
    }
  }

  // Load the image list throgh ajax.
  function getImagesList($appendEl, $existingFilesValue, $uploadType, $themeType, $defaultImageStorage) {
    $.ajax({
      url: Drupal.settings.basePath + 'ajax/load-default-files',
      dataType: 'json',
      method: 'POST',
      data: 'appendEl=' + $appendEl + '&existingFilesValue=' + $existingFilesValue + '&uploadType=' + $uploadType + '&themeType=' + $themeType,
      success: function(data) {
        $($appendEl).html(data);
        // Load the existing default file and select from the listed file.
        if ($defaultImageStorage != null) {
          $defaultImageId = $($defaultImageStorage).val();
          $('#' + $defaultImageId).children('span:nth-child(3)').children('span:nth-child(2)').children().toggleClass('selected unselected');
        }
      }
    });
  }
})(jQuery);
