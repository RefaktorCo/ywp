<?php
/**
 * @file
 * ywp_newsletter.features.inc
 */

/**
 * Implements hook_node_info().
 */
function ywp_newsletter_node_info() {
  $items = array(
    'newsletter' => array(
      'name' => t('Newsletter'),
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

/**
 * Implements hook_paragraphs_info().
 */
function ywp_newsletter_paragraphs_info() {
  $items = array(
    'featured_publication' => array(
      'name' => 'Featured Publication',
      'bundle' => 'featured_publication',
      'locked' => '1',
    ),
    'other_story_photo_left' => array(
      'name' => 'Other Story Photo Left',
      'bundle' => 'other_story_photo_left',
      'locked' => '1',
    ),
    'other_story_photo_right' => array(
      'name' => 'Other Story Photo Right',
      'bundle' => 'other_story_photo_right',
      'locked' => '1',
    ),
    'other_story_photo_top' => array(
      'name' => 'Other Story Photo Top',
      'bundle' => 'other_story_photo_top',
      'locked' => '1',
    ),
  );
  return $items;
}
