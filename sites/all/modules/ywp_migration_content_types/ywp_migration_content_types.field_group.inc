<?php
/**
 * @file
 * ywp_migration_content_types.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function ywp_migration_content_types_field_group_info() {
  $field_groups = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_media|node|playlist|form';
  $field_group->group_name = 'group_media';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'playlist';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Add media',
    'weight' => '1',
    'children' => array(
      0 => 'field_image',
      1 => 'field_audio',
      2 => 'field_media_upload',
      3 => 'field_media_embed',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'label' => 'Add media',
      'instance_settings' => array(
        'required_fields' => 0,
        'id' => '',
        'classes' => 'group-media field-group-fieldset',
        'description' => '',
      ),
      'formatter' => 'collapsed',
    ),
  );
  $field_groups['group_media|node|playlist|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_media|node|x_post|form';
  $field_group->group_name = 'group_media';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'x_post';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Add Media',
    'weight' => '3',
    'children' => array(
      0 => 'field_image',
      1 => 'field_audio',
      2 => 'field_media_embed',
      3 => 'field_media_upload',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'label' => 'Add Media',
      'instance_settings' => array(
        'required_fields' => 0,
        'id' => '',
        'classes' => 'group-media field-group-fieldset',
        'description' => '',
      ),
      'formatter' => 'collapsed',
    ),
  );
  $field_groups['group_media|node|x_post|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_media|node|xp|form';
  $field_group->group_name = 'group_media';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'xp';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Add media',
    'weight' => '2',
    'children' => array(
      0 => 'field_image',
      1 => 'field_audio',
      2 => 'field_media_upload',
      3 => 'field_media_embed',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-media field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_media|node|xp|form'] = $field_group;

  // Translatables
  // Included for use with string extractors like potx.
  t('Add Media');
  t('Add media');

  return $field_groups;
}
