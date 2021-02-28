<?php
/**
 * @file
 * Contains the admin functionalities for the file upload form.
 */

/**
 * This function will return an array of details for a set of file ids.
 *
 * @param array $file_ids
 *   The array of file ids that should be loaded.
 *
 * @return array $file_details
 *   An associative array that contains thedetails of files
 */
function jquery_upload_fapi_get_file_details($file_ids = array()) {
  $files = file_load_multiple($file_ids);
  foreach ($files as $file) {
    $file_details[$file->fid] = array(
      'filename' => $file->filename,
      'uri' => $file->uri,
      'filesize' => $file->filesize,
    );
  }
  return $file_details;
}
