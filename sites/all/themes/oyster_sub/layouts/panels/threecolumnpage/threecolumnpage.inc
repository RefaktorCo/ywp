<?php

$plugin = array(
  'title' => t('Three Column Page'),
  'category' => t('Oyster'),
  'icon' => 'threecolumnpage.png',
  'theme' => 'threecolumnpage',
  'admin css' => 'threecolumnpage.css',
  'regions' => array( 
    'before_content' => t('Before Content'), 
    'content_left' => t('Content Left'), 
    'content_middle' => t('Content Middle'), 
    'content_right' => t('Content Right'), 
    'after_content' => t('After Content') 
  ),
);
