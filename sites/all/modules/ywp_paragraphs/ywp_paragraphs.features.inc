<?php
/**
 * @file
 * ywp_paragraphs.features.inc
 */

/**
 * Implements hook_node_info().
 */
function ywp_paragraphs_node_info() {
  $items = array(
    'sandbox' => array(
      'name' => t('Sandbox'),
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
function ywp_paragraphs_paragraphs_info() {
  $items = array(
    'getting_started_links' => array(
      'name' => 'Getting Started Links',
      'bundle' => 'getting_started_links',
      'locked' => '1',
    ),
    'headline' => array(
      'name' => 'Headline',
      'bundle' => 'headline',
      'locked' => '1',
    ),
    'headline_and_body' => array(
      'name' => 'Headline and Body',
      'bundle' => 'headline_and_body',
      'locked' => '1',
    ),
    'media' => array(
      'name' => 'Media',
      'bundle' => 'media',
      'locked' => '1',
    ),
    'our_programs' => array(
      'name' => 'Our Programs',
      'bundle' => 'our_programs',
      'locked' => '1',
    ),
    'paragraph' => array(
      'name' => 'Paragraph',
      'bundle' => 'paragraph',
      'locked' => '1',
    ),
    'the_impact' => array(
      'name' => 'The Impact',
      'bundle' => 'the_impact',
      'locked' => '1',
    ),
    'useful_links' => array(
      'name' => 'Useful Links',
      'bundle' => 'useful_links',
      'locked' => '1',
    ),
  );
  return $items;
}
