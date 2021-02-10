<?php

/**
 * @file
 * Contains extra field definitions.
 *
 * @todo: deprecated?
 */

/**
 * Implements hook_field_extra_fields().
 */
function ywp_magazine_field_extra_fields() {
  $extra = array();

  $extra['paragraphs_item']['magazine_page']['display'] = array(
//    'ywp_magazine_genre' => array(
//      'label' => 'YWP: ' . t('Genre'),
//      'description' => t('Paragraph genre.'),
//      'weight' => 0,
//    ),
//    'ywp_magazine_title' => array(
//      'label' => 'YWP: ' . t('Title'),
//      'description' => t('Paragraph title.'),
//      'weight' => 0,
//    ),
//    'ywp_magazine_author' => array(
//      'label' => 'YWP: ' . t('Author'),
//      'description' => t('Paragraph author.'),
//      'weight' => 0,
//    ),
//    'ywp_magazine_text' => array(
//      'label' => 'YWP: ' . t('Text'),
//      'description' => t('Paragraph text.'),
//      'weight' => 0,
//    ),
  );

  return $extra;
}

/**
 * Implements hook_entity_view().
 *
 * @param object $entity
 * @param string $type
 * @param string $view_mode
 * @param string $langcode
 */
function ywp_magazine_entity_view__($entity, $type, $view_mode, $langcode) {
  if ($type == 'paragraphs_item' && $entity->bundle == 'magazine_page') {
    /** @var \ParagraphsItemEntity $entity */
    if ($blog = ywp_magazine_get_paragraph_blog($entity)) {
      $w_blog = entity_metadata_wrapper('node', $blog);
      /** @noinspection PhpUndefinedFieldInspection */
      /** @var \EntityMetadataWrapper $w_author */
      $w_author = $w_blog->author;

      // Blog genre.
      /** @noinspection PhpUndefinedFieldInspection */
      $entity->content['ywp_magazine_genre'] = field_view_field('node', $blog, 'field_playlist_genre', 'full');

      // Blog title.
      $entity->content['ywp_magazine_title'] = array(
        '#prefix' => '<div class="field field-name-title">',
        '#markup' => $blog->title,
        '#suffix' => '</div>',
      );

      // Blog author.
      $author_parts = array($w_author->label());
      /** @noinspection PhpUndefinedFieldInspection */
      if ($author_city = $w_author->field_town_or_city->value()) {
        $author_parts[] = $author_city;
      }
      /** @noinspection PhpUndefinedFieldInspection */
      if ($author_state = $w_author->field_state->value()) {
        $author_parts[] = $author_state;
      }
      $author = implode(', ', $author_parts);
      $entity->content['ywp_magazine_author'] = array(
        '#prefix' => '<div class="field field-name-author">',
        '#markup' => t('By @author', array('@author' => $author)),
        '#suffix' => '</div>',
      );

      // Blog text.
      $entity->content['ywp_magazine_text'] = field_view_field('node', $blog, 'body', 'full');
    }
  }
}
