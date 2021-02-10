<?php

/**
 * @file
 * Provides callbacks for YWP Magazine pages.
 */

/**
 * Title callback for YWP Magazine home page.
 *
 * @return string
 *   YWP Magazine home page title.
 */
function ywp_magazine_page_home_title() {
  $title = 'The Voice — ';
  if ($node = ywp_magazine_get_latest_issue()) {
    $date = ywp_magazine_get_date($node);
    $title .= date('M Y', $date);
  }
  return $title;
}

/**
 * Callback for YWP Magazine home page.
 *
 * @return array|int
 *   Latest issue content or 404 error if no issue found.
 */
function ywp_magazine_page_home() {
  if ($node = ywp_magazine_get_latest_issue()) {
    return node_view($node);
  }
  // No issue found - return 404 error page.
  return MENU_NOT_FOUND;
}

/**
 * Title callback for YWP Magazine paragraph page.
 *
 * @param string $month
 *   Magazine issue month.
 * @param string $delta
 *   Magazine issue paragraph delta.
 *
 * @return string
 *   YWP Magazine paragraph page title.
 *
 * @todo: @deprecated?
 */
/*
function ywp_magazine_page_paragraph_title($month, $delta) {
  $title = 'The Voice';
  if ($node = ywp_magazine_get_latest_issue($month)) {
    if ($blog = ywp_magazine_get_blog($month, $delta)) {
      $date = ywp_magazine_get_date($node);
      $title = $blog->title . ' — ' . date('M Y', $date) . ' — ' . $title;
    }
  }
  return $title;
}
*/

/**
 * Callback for YWP Magazine page.
 *
 * @param string $month
 *   Magazine issue month.
 * @param string $delta
 *   Magazine issue paragraph delta.
 *
 * @return array|int
 *   Latest issue content or 404 error if no issue found.
 *
 * @todo: @deprecated?
 */
/*
function ywp_magazine_page_paragraph($month, $delta) {
  if ($paragraph = ywp_magazine_get_paragraph($month, $delta - 1)) {
    return entity_view('paragraphs_item', array($paragraph));
  }
  // No paragraph found - return 404 error page.
  return MENU_NOT_FOUND;
}
*/

/**
 * AJAX callback for YWP Magazine home page.
 *
 * @param \ParagraphsItemEntity $paragraph
 *   Paragraph item being viewed.
 *
 * @return array|int
 *   Latest issue content or 404 error if no issue found.
 */
function ywp_magazine_ajax_page($paragraph) {
  // Contains ajax_command_insert().
  module_load_include('inc', 'system', 'ajax');

  // Adds AJAX stuff.
  drupal_add_library('system', 'drupal.ajax');

  // Paragraph view.
  $content = entity_view('paragraphs_item', array($paragraph));

  return $result = array(
    '#type' => 'ajax',
    '#commands' => array(
      ajax_command_insert(NULL, render($content)),
    ),
  );
}

/**
 * AJAX callback for YWP Magazine home page.
 *
 * @param \ParagraphsItemEntity $paragraph
 *   Paragraph item being viewed.
 * @param string $direction
 *   One of 'prev' or 'next'.
 *
 * @return array|int
 *   Next or prev magazine page or 404 error if no issue found.
 *
 * @todo @deprecated?
 */
function ywp_magazine_ajax_page_nav($paragraph, $direction) {
  // Contains ajax_command_insert().
  module_load_include('inc', 'system', 'ajax');

  // Adds AJAX stuff.
  drupal_add_library('system', 'drupal.ajax');

  // Paragraph view.
  $content = entity_view('paragraphs_item', array($paragraph));

  return $result = array(
    '#type' => 'ajax',
    '#commands' => array(
      ajax_command_insert(NULL, render($content)),
    ),
  );
}

/**
 * AJAX callback for YWP Magazine TOC.
 *
 * @param object $node
 *   Magazine node object.
 *
 * @return array
 *   AJAX commands to show magazine TOC in a dialog.
 */
function ywp_magazine_ajax_toc($node) {
  // Contains ajax_command_insert().
  module_load_include('inc', 'system', 'ajax');

  // Adds AJAX stuff.
  drupal_add_library('system', 'drupal.ajax');

  // Paragraph view.
  $content = array(
    '#theme' => 'ywp_magazine_toc',
    '#node' => $node,
    '#view_mode' => 'full',
  );;

  return $result = array(
    '#type' => 'ajax',
    '#commands' => array(
      ajax_command_insert(NULL, render($content)),
    ),
  );
}
