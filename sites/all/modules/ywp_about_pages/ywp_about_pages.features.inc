<?php
/**
 * @file
 * ywp_about_pages.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function ywp_about_pages_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function ywp_about_pages_node_info() {
  $items = array(
    'about_mentors' => array(
      'name' => t('About Mentors'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'about_teachers' => array(
      'name' => t('About Teachers'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'about_youth' => array(
      'name' => t('About Youth'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'general_about' => array(
      'name' => t('About General'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
