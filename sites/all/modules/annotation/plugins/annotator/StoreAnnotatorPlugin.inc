<?php

/**
 * @file
 * Store Annotator Plugin.
 */

$plugin = array(
  'name' => 'store',
  'label' => t('Store'),
  'module' => 'annotator',
  'handler' => array(
    'class' => 'StoreAnnotatorPlugin',
  ),
);
