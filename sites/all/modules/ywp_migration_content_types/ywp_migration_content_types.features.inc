<?php
/**
 * @file
 * ywp_migration_content_types.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function ywp_migration_content_types_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function ywp_migration_content_types_node_info() {
  $items = array(
    'playlist' => array(
      'name' => t('Playlist'),
      'base' => 'node_content',
      'description' => t('This is the content type to create a formal learning group that will include XPs (exercises), Examples and Resources'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'product_display' => array(
      'name' => t('Product Display'),
      'base' => 'node_content',
      'description' => t('Content type with product reference field.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'resource' => array(
      'name' => t('Resource'),
      'base' => 'node_content',
      'description' => t('Use this content to post tips, links, information that will help participants fulfill the intended goals or process of Playlists or XPs. NOTE: this content type has no fields, meaning media will need to be embedded or uploaded to the BODY of the content.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'x_post' => array(
      'name' => t('X-Post'),
      'base' => 'node_content',
      'description' => t('Content type to respond to XPs in Playlists. This content is, by default, private meaning it can only be seen by respective members of the respective Playlist. However, the author can make a post public and it will then mingle nicely for the rest of the community to see and comment upon.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'xp' => array(
      'name' => t('XP'),
      'base' => 'node_content',
      'description' => t('A single step for sequential exercises aimed at helping participants achieve goal or project in a Playlist'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
