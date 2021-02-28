Jquery upload fapi Module
-------------------------------------

Jquery upload fapi Module allow us to multi file upload.

The module is dependent on drupal module libraries.
Make sure you have installed the modules.

For this module you need to download jquery multifile upload js and css
to libraries.
Download jquery multifile upload with
version 9.11.2 from https://github.com/blueimp/jQuery-File-Upload/tags.
Extract it to jquery_multifile_upload folder in sites/all/libraries.

Admin configuration of multifile upload is in /admin/file-config


Add following code to form for setting multi-file images upload fields.
----------------------------------------------------------------

$default_images is the array values of attached fids. These array value
implode with ',' is stored in hidden field(id => 'uploaded-images').
The js file automatically taken the fids and display
the thumbnail in 'uploaded-images-list' div.
You can remove  the files from attached list by clicking close icon.

eg: $default_images = array();
  $form['image_upload_fieldset']['upload'] = array(
    '#type' => 'file',
    '#title' => t('Upload Images'),
    '#name' => 'files[]',
    '#attributes' => array(
      'id' => 'file_upload',
      'class' => array('file_upload_field', 'upload-images'),
      'jquery_multi_file_upload' => TRUE,
      'upload-type' => 'images',
      'themetype' => 'image-default',
      'default-image-storage' => 'default-image-selected',
      'uploaded-images-list-id' => 'uploaded-images',
      'append-element-id' => 'uploaded-images-list',
      'multiple' => 'multiple',
    ),
  );
$form['image_upload_fieldset']['uploaded_images_list'] = array(
  '#markup' => '<div id="uploaded-images-list" class="uploaded-files-list">
   </div>',
);
$form['image_upload_fieldset']['uploaded_images'] = array(
  '#type' => 'hidden',
  '#required' => TRUE,
  '#title' => t('Images'),
  '#attributes' => array(
    'id' => 'uploaded-images',
  ),
  '#default_value' => implode(',', $default_images),
);


Add following code to form for setting multi-file documents upload fields.
----------------------------------------------------------------

$default_attachments is the array value of attached documents fids.
These array value implode with ',' and is stored in hidden field with
id (id =>'uploaded-attachments'). The js file automatically taken
the fids and display the filename in 'uploaded-attachments-list' div.
You can remove  the files from attached list by clicking close icon.

$default_attachments = array();
$form['upload_fieldset']['upload'] = array(
  '#type' => 'file',
  '#title' => t('Upload Files'),
  '#attributes' => array(
    'id' => 'file_upload_attachment',
    'class' => array('file_upload_field', 'upload-files'),
    'upload-type' => 'attachments',
    'themetype' => 'image-attachments',
    'uploaded-images-list-id' => 'uploaded-attachments',
    'append-element-id' => 'uploaded-attachments-list',
  ),
);
$form['uploaded_attachments_list'] = array(
  '#markup' => '<div id="uploaded-attachments-list"></div>',
);
$form['upload_fieldset']['uploaded_attachments'] = array(
  '#type' => 'hidden',
  '#attributes' => array(
    'id' => 'uploaded-attachments',
  ),
  '#default_value' => implode(',', $default_attachments),
);
