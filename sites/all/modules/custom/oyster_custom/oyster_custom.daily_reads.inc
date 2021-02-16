<?php

/**
 * Implements hook_entity_info_alter().
 */
function oyster_custom_entity_info_alter(&$entity_info) {
  $entity_info['node']['view modes']['daily_teaser'] = array(
    'label' => t('Daily Teaser'),
    'custom settings' => TRUE,
  );
}

function oyster_custom_preprocess_node(&$variables) {
    if ($variables['view_mode'] == 'daily_teaser') {
      $variables['theme_hook_suggestions'][] = 'node__' . $variables['type'] . '__daily_teaser';
  }
}