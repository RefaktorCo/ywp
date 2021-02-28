<?php
/**
 * @file
 * Contains the admin functionalities for the file upload form.
 */

/**
 * This function will upload the files added by the jQuery multiple file upload.
 */
function jquery_upload_fapi_ajax_callback() {
  global $base_url;
  foreach ($_FILES['files']['size'] as $key => $size) {
    $form_name = $key;
    $file_size = $size;
  }
  // Get the maximum allowed size and allowed extensions from the configuration
  // values.
  $image_upload_max = variable_get('jquery_upload_fapi_image_upload_max', 2);
  $image_upload_extensions = variable_get('jquery_upload_fapi_image_upload_extensions', 'jpg,jpeg,png,gif');

  $docs_upload_max = variable_get('jquery_upload_fapi_docs_upload_max', 2);
  $docs_upload_extensions = variable_get('jquery_upload_fapi_docs_upload_extensions', 'doc,docx,odt,pdf');
  // Get the upload type and theme type that is posted from ajax submit.
  $upload_type = $_POST['uploadType'];
  $theme_type = $_POST['themetype'];

  if ($upload_type == 'images') {
    $max_file_size = $image_upload_max * (1024 * 1024);
    $allowed_file_types_string = $image_upload_extensions;
    $allowed_file_types = explode(',', $image_upload_extensions);
  }
  else {
    $max_file_size = $docs_upload_max * (1024 * 1024);
    $allowed_file_types_string = $docs_upload_extensions;
    $allowed_file_types = explode(',', $docs_upload_extensions);
  }

  $allowed_file_types_no_comma = str_replace(',', ' ', $image_upload_extensions);
  if ($file_size < $max_file_size) {
    if (array_key_exists('files', $_FILES)) {
      $allowed_file_types_no_comma = array('file_validate_extensions' => array($allowed_file_types_no_comma));
      $file = file_save_upload($form_name, $allowed_file_types_no_comma);
      $secure_file_name = file_munge_filename($file->filename, "gif jpeg jpg png tiff asf avi mpeg mpg wmv vob mov mp4 flv txt doc docx xls xlsx ppt pptx mp3");
      $pathinfo = pathinfo($file->uri);
      if ($file && in_array($pathinfo['extension'], $allowed_file_types)) {
        $file_details = array(
          'fid' => $file->fid,
          'name' => $file->filename,
          'trimmed_name' => (drupal_strlen($file->filename) > 23) ?
          truncate_utf8($file->filename, 22, FALSE, TRUE, 3) . $pathinfo['extension'] : $file->filename,
          'size' => $file->filesize,
          'url' => $base_url . '/sites/default/files/' . $secure_file_name,
        );
        $file_details['thumbnail_status'] = TRUE;
        if ($upload_type == 'images' && $theme_type == 'image-default') {
          // Load the image style thumbnail.
          $style = image_style_load('thumbnail');
          $destination = variable_get('file_public_path', conf_path() . '/files') . '/temp_thumbnail_styles/' . $pathinfo['basename'];
          if (image_style_create_derivative($style, $file->uri, $destination)) {
            $file_details['thumbnail_url'] = $base_url . '/' . $destination;
          }
          $theme_name = 'file_list_item_image_default';
        }

        elseif ($upload_type == 'attachments') {
          $file_details['thumbnail_status'] = FALSE;

          // Detemine the type of the file from the file extension.
          if ($pathinfo['extension'] == 'pdf') {
            $type = $pathinfo['extension'];
          }
          elseif (in_array($pathinfo['extension'], array('doc', 'docx', 'odt'))) {
            $type = 'doc';
          }
          else {
            $type = 'other';
          }
          $file_details['thumbnail_type'] = $type;
          $theme_name = 'file_list_item';
        }
        $file_data = theme($theme_name, $file_details);
        $status = array(
          'files' => array(
            'status' => $file->fid,
            'data' => $file_data,
          ),
        );
      }
    }
  }
  // Clear error and messages.
  drupal_get_messages();

  drupal_json_output($status);
}

/**
 * This function will load a list of files which are submitted via ajax POST.
 *
 * We will get the values by ajax post.
 */
function jquery_upload_fapi_load_files() {
  global $base_url;

  $file_details = array();

  // Load the file for the load function.
  module_load_include('inc', 'jquery_upload_fapi', 'includes/jquery_upload_fapi.common');

  $existing_files = explode(',', $_POST['existingFilesValue']);
  $theme_type = $_POST['themeType'];
  $upload_type = $_POST['uploadType'];
  $files_data = jquery_upload_fapi_get_file_details($existing_files);
  foreach ($files_data as $fid => $file) {
    $pathinfo = pathinfo($file['uri']);
    $secure_file_name = file_munge_filename($file['filename'], "gif jpeg jpg png tiff asf avi mpeg mpg wmv vob mov mp4 flv txt doc docx xls xlsx ppt pptx mp3");
    $file_details = array(
      'fid' => $fid,
      'name' => $file['filename'],
      'size' => $file['filesize'],
      'url' => $base_url . '/sites/default/files/' . $secure_file_name,
    );

    $file_details['thumbnail_url'] = '';
    $file_details['thumbnail_status'] = TRUE;
    if ($upload_type == 'images' && $theme_type == 'image-standard') {
      // Load the image style thumbnail.
      if (strpos($pathinfo['dirname'], 'temporary') === FALSE) {
        $file_details['thumbnail_url'] = image_style_url('thumbnail', $file['uri']);
      }
      else {
        $destination = variable_get('file_public_path', conf_path() . '/files') . '/temp_thumbnail_styles/' . $pathinfo['basename'];
        $file_details['thumbnail_url'] = $base_url . '/' . $destination;
      }
      $theme_name = 'file_list_item';
    }
    if ($upload_type == 'images' && $theme_type == 'image-default') {
      // Load the image style thumbnail.
      if (strpos($pathinfo['dirname'], 'temporary') === FALSE) {
        $file_details['thumbnail_url'] = image_style_url('thumbnail', $file['uri']);
      }
      else {
        $destination = variable_get('file_public_path', conf_path() . '/files') . '/temp_thumbnail_styles/' . $pathinfo['basename'];
        $file_details['thumbnail_url'] = $base_url . '/' . $destination;
      }
      $theme_name = 'file_list_item_image_default';
    }
    elseif ($upload_type == 'attachments') {
      $file_details['thumbnail_status'] = FALSE;

      // Determine the type of the file from the file extension.
      if ($pathinfo['extension'] == 'pdf') {
        $type = $pathinfo['extension'];
      }
      elseif (in_array($pathinfo['extension'], array('doc', 'docx', 'odt'))) {
        $type = 'doc';
      }
      else {
        $type = 'other';
      }
      $file_details['thumbnail_type'] = $type;
      $theme_name = 'file_list_item';
    }
    $file_data[] = array(
      '#theme' => $theme_name,
      '#thumbnail_url' => $file_details['thumbnail_url'],
      '#thumbnail_type' => isset($file_details['thumbnail_type']) ? $file_details['thumbnail_type'] : '',
      '#thumbnail_status' => $file_details['thumbnail_status'],
      '#fid' => $fid,
      '#name' => $file_details['name'],
      '#trimmed_name' => (drupal_strlen($file_details['name']) > 23) ?
      truncate_utf8($file_details['name'], 22, FALSE, TRUE) . $pathinfo['extension'] : $file_details['name'],
      '#size' => $file_details['size'],
    );
  }
  $file_data_html = render($file_data);
  drupal_json_output($file_data_html);
}
