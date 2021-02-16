<?php

/**
 * Implements hook_block_info().
 */
function oyster_custom_block_info() {
  // This example comes from node.module.
  $blocks['create_block'] = array(
    'info' => t('Create'), 
    'cache' => DRUPAL_NO_CACHE,
  );
  return $blocks;
}

/**
 * Implements hook_block_view().
 */
function oyster_custom_block_view($delta = '') {
  $block = array();
  switch ($delta) {
    case 'create_block':
      $content = theme('oyster_custom_create_block');
      $block['subject'] = t('Create');
      $block['content'] = $content;
      break;
  }
  return $block;
}


