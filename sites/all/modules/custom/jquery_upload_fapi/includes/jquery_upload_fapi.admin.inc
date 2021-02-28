<?php
/**
 * @file
 * Contains the configurations for the file upload form.
 */

/**
 * Configuration form for files upload.
 */
function jquery_upload_fapi_file_config_form($form, &$form_state) {
  $form['jquery_upload_fapi_image_upload_max'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum upload size for images (in MB)'),
    '#default_value' => variable_get('jquery_upload_fapi_image_upload_max', 2),
    '#size' => 5,
    '#maxlength' => 2,
    '#required' => TRUE,
  );
  $form['jquery_upload_fapi_image_upload_extensions'] = array(
    '#type' => 'textfield',
    '#title' => t('Allowed extensions for images'),
    '#default_value' => variable_get('jquery_upload_fapi_image_upload_extensions', 'jpg,jepg,png,gif'),
    '#size' => 30,
    '#maxlength' => 50,
    '#description' => t('Type extensions seprated by comma(,).'),
    '#required' => TRUE,
  );
  $form['jquery_upload_fapi_image_upload_max_number'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum number of images that can be uploaded'),
    '#default_value' => variable_get('jquery_upload_fapi_image_upload_max_number', 5),
    '#size' => 5,
    '#maxlength' => 2,
    '#required' => TRUE,
  );

  $form['jquery_upload_fapi_docs_upload_max'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum upload size for documents/attachments (in MB)'),
    '#default_value' => variable_get('jquery_upload_fapi_docs_upload_max', 2),
    '#size' => 5,
    '#maxlength' => 10,
    '#required' => TRUE,
  );
  $form['jquery_upload_fapi_docs_upload_extensions'] = array(
    '#type' => 'textfield',
    '#title' => t('Allowed extensions for documents'),
    '#default_value' => variable_get('jquery_upload_fapi_docs_upload_extensions', 'doc,docx,odt,pdf'),
    '#size' => 30,
    '#maxlength' => 50,
    '#description' => t('Type extensions seprated by comma(,).'),
    '#required' => TRUE,
  );
  $form['jquery_upload_fapi_docs_upload_max_number'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum number of docs that can be uploaded'),
    '#default_value' => variable_get('jquery_upload_fapi_docs_upload_max_number', 5),
    '#size' => 5,
    '#maxlength' => 2,
    '#required' => TRUE,
  );

  return system_settings_form($form);
}
