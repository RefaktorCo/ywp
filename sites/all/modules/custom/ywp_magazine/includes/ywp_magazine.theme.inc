<?php

/**
 * @file
 * YWP: Magazine theming/preprocess functions.
 */

/**
 * Implements hook_theme().
 */
function ywp_magazine_theme() {
  return array(
    'ywp_magazine_toc' => array(
      'template' => 'templates/ywp-magazine-toc',
      'render element' => 'element',
    ),
  );
}

/**
 * Prepares variables for YWP: Magazine TOC templates.
 *
 * @param array $variables
 */
function template_preprocess_ywp_magazine_toc(&$variables) {
  $element = $variables['element'];
  $node = $element['#node'];
  $view_mode = $element['#view_mode'];

  $variables['node'] = $node;
  $variables['view_mode'] = $view_mode;

  $variables['theme_hook_suggestions'][] = 'ywp_magazine_toc__' . $view_mode;
}

/**
 * Returns render array for blog field referenced from media paragraph.
 *
 * @param \ParagraphsItemEntity $media_paragraph
 *   Media paragraph.
 * @param string $view_mode
 *   View mode.
 *
 * @return array
 *   Blog field render array.
 */
function ywp_magazine_media_paragraph_view_blog_field($media_paragraph, $view_mode) {
  if ($blog = ywp_magazine_get_paragraph_blog($media_paragraph)) {
    /** @noinspection PhpUndefinedFieldInspection */
    $blog_field_name = $media_paragraph->field_blog_field_name[LANGUAGE_NONE][0]['value'];
    /** @noinspection PhpUndefinedFieldInspection */
    $blog_field_delta = $media_paragraph->field_blog_field_delta[LANGUAGE_NONE][0]['value'];

    // Make a copy of original blog object to not mutate it, as it may still be
    // used during current request.
    $blog_copy = clone $blog;
    $blog_copy->{$blog_field_name}[LANGUAGE_NONE] = array_slice($blog->{$blog_field_name}[LANGUAGE_NONE], $blog_field_delta, 1);

    return field_view_field('node', $blog_copy, $blog_field_name, 'magazine_' . $view_mode);
  }

  return array();
}
