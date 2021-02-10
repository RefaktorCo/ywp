<?php

/**
 * Prepares variables for all templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess(&$variables) {
  $variables['ywp_magazine_home'] = ywp_magazine_is_home_path();
}

/**
 * Prepares variables for html templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_html(&$variables) {
  if ($menu_item = menu_get_item()) {
    if (!empty($menu_item['page_callback'])) {
      if ($menu_item['page_callback'] == 'ywp_magazine_page_paragraph') {
        $variables['classes_array'][] = 'page-magazine--inner';
      }
    }
  }

  $viewport = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'viewport',
      'content' =>  'width=device-width, initial-scale=1, maximum-scale=1',
    ),
    '#weight' => 1,
  );
  $font_roboto = array(
    '#type' => 'markup',
    '#markup' => '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,500i" rel="stylesheet">',
  );

  drupal_add_html_head($font_roboto, 'roboto');
  drupal_add_html_head($viewport, 'viewport');
}

/**
 * Prepares variables for page templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_page(&$variables) {
//  $variables['ywp_logo_thevoice'] = '/' . path_to_theme() . '/assets/images/logo_thevoice.png';
}

/**
 * Prepares variables for region templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_region(&$variables) {
  switch ($variables['region']) {
    case 'sidebar':
      if ($variables['ywp_magazine_home']) {
        $variables['classes_array'][] = 'open';
      }
      break;
  }
}

/**
 * Prepares variables for block templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_block(&$variables) {
  $block = $variables['block'];
  $variables['classes_array'][] = drupal_html_class('block-' . $block->module . '-' . $block->delta);
  $variables['title_attributes_array']['class'][] = 'block-title';
}

/**
 * Prepares variables for node templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_node(&$variables) {
  $node = $variables['node'];
  $view_mode = $variables['view_mode'];

  $variables['theme_hook_suggestions'][] = 'node__' . $node->type . '__' . $view_mode;
  $variables['classes_array'][] = 'view-mode-' . $view_mode;

  if ($node->type == 'magazine') {
    if ($view_mode == 'full') {
      libraries_load('malihu-custom-scrollbar');
      $variables['ywp_logo_thevoice'] = '/' . path_to_theme() . '/assets/images/logo_thevoice.png';
      $variables['attributes_array']['style'][] = 'background-image: url(' . file_create_url($variables['field_cover_photo'][0]['uri']) . ')';
    }
  }
}

/**
 * Prepares variables for field templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_field(&$variables) {
  $element = $variables['element'];

  $field_name = $element['#field_name'];
  $field_type = $element['#field_type'];
  $entity_type = $element['#entity_type'];
  $bundle = $element['#bundle'];
  $view_mode = $element['#view_mode'];
  $object = $element['#object'];

  if ($entity_type == 'node' && $bundle == 'magazine' && $field_name == 'field_magazine_pages') {
    $toc = array(
      '#theme' => 'ywp_magazine_toc',
      '#node' => $object,
      '#view_mode' => 'teaser',
    );
    array_unshift($variables['items'], $toc);
  }
}

/**
 * Prepares variables for comment templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_comment(&$variables) {
  $node = $variables['node'];
  $view_mode = $variables['elements']['#view_mode'];

  $variables['view_mode'] = $view_mode;
  $variables['theme_hook_suggestions'][] = 'comment__node_' . $node->type;
  $variables['theme_hook_suggestions'][] = 'comment__node_' . $node->type . '__' . $view_mode;
  $variables['classes_array'][] = 'comment-node-' . $node->type;
  $variables['classes_array'][] = 'view-mode-' . $view_mode;
}

/**
 * Prepares variables for entity templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_entity(&$variables) {
  $entity = $variables['elements']['#entity'];
  $entity_type = $variables['elements']['#entity_type'];
  $bundle = $variables['elements']['#bundle'];
  $view_mode = $variables['elements']['#view_mode'];

  if ($entity_type == 'paragraphs_item') {
    /** @var \ParagraphsItemEntity $entity */
    $id = $entity->identifier();
    $host = $entity->hostEntity();

    $variables['ywp_host'] = $host;
    $variables['classes_array'][] = drupal_html_class('view-mode-' . $view_mode);

    // Magazine pages.
    if ($bundle == 'magazine_page') {
      $blog = ywp_magazine_get_paragraph_blog($entity);
      $media_paragraphs = ywp_magazine_get_media_paragraphs($entity, $view_mode);

      $blog_wrapper = entity_metadata_wrapper('node', $blog);
      /** @noinspection PhpUndefinedFieldInspection */
      /** @var \EntityMetadataWrapper $author_wrapper */
      $author_wrapper = $blog_wrapper->author;
      /** @noinspection PhpUndefinedMethodInspection */
      $author_id = $author_wrapper->getIdentifier();

      if (in_array($view_mode, array('full', 'toc'))) {
        $author_label_parts = array(l($author_wrapper->label(), 'blog/' . $author_id, array('attributes' => array('target' => '_blank'))));
      }
      else {
        $author_label_parts = array($author_wrapper->label());
      }
      /** @noinspection PhpUndefinedFieldInspection */
      if ($author_city = $author_wrapper->field_town_or_city->value()) {
        $author_label_parts[] = $author_city;
      }
      /** @noinspection PhpUndefinedFieldInspection */
      if ($author_state = $author_wrapper->field_state->value()) {
        $author_label_parts[] = $author_state;
      }
      $author_label = implode(', ', $author_label_parts);

      $variables['ywp_blog'] = $blog;
      $variables['ywp_blog_wrapper'] = $blog_wrapper;
      $variables['ywp_author_wrapper'] = $author_wrapper;
      $variables['ywp_author_name'] = $author_wrapper->label();
      $variables['ywp_author_label'] = $author_label;
      $variables['ywp_author_url'] = user_access('access user profiles') ? url('user/' . $author_id) : NULL;
      $variables['ywp_author_blog_url'] = url('blog/' . $author_id);

      if (in_array($view_mode, array('teaser', 'toc')) && $media_paragraphs) {
        $media_paragraph = reset($media_paragraphs);
        $media_paragraph_bundle = $media_paragraph->bundle();
        if ($media_paragraph_bundle == 'magazine_page_media_quote') {
          $media_type = 'quote';
          $variables['content']['ywp_media'] = '<i class="fas fa-quote-left"></i>';
        }
        elseif ($media_paragraph_bundle == 'magazine_page_media_custom') {
          $media_type = 'image';
          $variables['content']['ywp_media'] = field_view_field('paragraphs_item', $media_paragraph, 'field_media_image', 'teaser');
        }
        elseif ($media_paragraph_bundle  == 'magazine_page_media_blog') {
          switch ($media_paragraph->field_blog_field_name[LANGUAGE_NONE][0]['value']) {
            case 'field_image':
              $media_type = 'image';
              $variables['content']['ywp_media'] = ywp_magazine_media_paragraph_view_blog_field($media_paragraph, 'teaser');
              break;
            case 'field_audio_upload':
            case 'field_audio_record':
            case 'field_audio':
              $media_type = 'audio';
              $variables['content']['ywp_media'] = '<i class="fas fa-volume-up"></i>';
              break;
            case 'field_media_embed':
            case 'field_media_upload':
              $media_type = 'video';
              $variables['content']['ywp_media'] = '<i class="fas fa-video"></i>';
              break;
          }
        }

        if (isset($media_type)) {
          $variables['ywp_media_type'] = $media_type;
          $variables['classes_array'][] = 'ywp-media-type-' . $media_type;
          if ($media_type != 'image') {
            $variables['classes_array'][] = 'ywp-media-type-no-image';
            $variables['content']['ywp_media'] = '<div class="icon">' . $variables['content']['ywp_media'] . '</div>';
          }
        }
      }
      elseif ($view_mode == 'full') {
        // Blog genre is blog's category.
//        $variables['content']['ywp_genre'] = field_view_field('node', $blog, 'field_category', 'magazine_full');

        // Blog title.
        $variables['content']['ywp_title'] = array(
          '#markup' => $blog->title,
        );

        // Blog author.
        $variables['content']['ywp_author'] = array(
          '#markup' => t('By !author', array('!author' => $author_label)),
        );

        // Blog text.
        $variables['content']['ywp_text'] = field_view_field('node', $blog, 'body', 'magazine_full');

        // Previous and next page ids.
        $delta = 0;
        foreach ($host->field_magazine_pages[LANGUAGE_NONE] as $d => $v) {
          if ($host->field_magazine_pages[LANGUAGE_NONE][$d]['value'] == $id) {
            $delta = $d;
            break;
          }
        }
        $variables['ywp_prev_page_id'] = isset($host->field_magazine_pages[LANGUAGE_NONE][$delta - 1]['value'])
          ? $host->field_magazine_pages[LANGUAGE_NONE][$delta - 1]['value'] : NULL;
        $variables['ywp_next_page_id'] = isset($host->field_magazine_pages[LANGUAGE_NONE][$delta + 1]['value'])
          ? $host->field_magazine_pages[LANGUAGE_NONE][$delta + 1]['value'] : NULL;

        // Page layout.
        /** @noinspection PhpUndefinedFieldInspection */
        $page_layout = $entity->field_magazine_page_layout[LANGUAGE_NONE][0]['value'];
        $variables['ywp_page_layout'] = $page_layout;
        $variables['classes_array'][] = drupal_html_class('page-layout-' . $page_layout);

        libraries_load('owl.carousel', 'js');
      }
    }
    // Magazine page media (from blog).
    elseif ($bundle == 'magazine_page_media_blog') {
      $variables['content']['ywp_media'] = ywp_magazine_media_paragraph_view_blog_field($entity, $view_mode);

      if ($view_mode == 'full') {

        /** @noinspection PhpUndefinedFieldInspection */
        if (!empty($entity->field_media_image[LANGUAGE_NONE][0]['uri'])) {
          $style = isset($variables['attributes_array']['style']) ? $variables['attributes_array']['style'] : '';
          /** @noinspection PhpUndefinedFieldInspection */
          $uri = $entity->field_media_image[LANGUAGE_NONE][0]['uri'];
          $style .= 'background-image: url(' . image_style_url('huge', $uri) . ');';
          $variables['attributes_array']['style'] = $style;
          $variables['classes_array'][] = 'ywp-full-height';
        }

        /** @noinspection PhpUndefinedFieldInspection */
        if (!empty($entity->field_media_author[LANGUAGE_NONE][0]['value'])) {
          /** @noinspection PhpUndefinedFieldInspection */
          $author = $entity->field_media_author[LANGUAGE_NONE][0]['value'];
        }

        /** @noinspection PhpUndefinedFieldInspection */
        if (!empty($entity->field_blog_show_link[LANGUAGE_NONE][0]['value'])) {
          $blog = ywp_magazine_get_paragraph_blog($entity);
          $blog_wrapper = entity_metadata_wrapper('node', $blog);

          /** @noinspection PhpUndefinedFieldInspection */
          if (empty($author)) {
            /** @noinspection PhpUndefinedFieldInspection */
            $author = $blog_wrapper->author->label();
          }

          $author = l($author, 'blog/' . $blog->uid, array(
            'attributes' => array('target' => '_blank'),
          ));
        }

        // Rewrite Media Author field content to respect all possible options
        // (linked or not, field content or blog's author username).
        if (!empty($author)) {
          $variables['content']['field_media_author'] = array(
            '#prefix' => '<div class="field-name-field-media-author">',
            '#markup' => t('By !author', array('!author' => $author)),
            '#suffix' => '</div>',
          );
        }
      }
    }
    elseif ($bundle == 'magazine_page_media_custom') {

      if ($view_mode == 'full') {
        $author = NULL;
        /** @noinspection PhpUndefinedFieldInspection */
        if (!empty($entity->field_media_author_user[LANGUAGE_NONE][0]['target_id'])) {
          /** @noinspection PhpUndefinedFieldInspection */
          if ($author = user_load($entity->field_media_author_user[LANGUAGE_NONE][0]['target_id'])) {
            $uid = $author->uid;
            $author = format_username($author);
            $author = l($author, 'blog/' . $uid, array(
              'attributes' => array('target' => '_blank'),
            ));

          }
        }
        if (!empty($author)) {
          $variables['content']['field_media_author'] = array(
            '#prefix' => '<div class="field-name-field-media-author">',
            '#markup' => t('By !author', array('!author' => $author)),
            '#suffix' => '</div>',
          );
        }
        else {
          $variables['content']['field_media_author'] = NULL;
        }
      }
    }
  }
}

/**
 * Prepares variables for textarea theme.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_textarea(&$variables) {
  $variables['element']['#attributes']['class'][] = 'form-control';
}

/**
 * Prepares variables for textfield theme.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_textfield(&$variables) {
  $variables['element']['#attributes']['class'][] = 'form-control';
}

/**
 * Prepares variables for button theme.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_button(&$variables) {
  $variables['element']['#attributes']['class'][] = 'btn';
}

/**
 * Prepares variables for YWP: Magazine TOC templates.
 *
 * @param array $variables
 */
function ywp_magazine_theme_preprocess_ywp_magazine_toc(&$variables) {
  $element = $variables['element'];
  $node = $element['#node'];
  $view_mode = $element['#view_mode'];

  if ($view_mode == 'full') {
    $variables['pages'] = array();
    $paragraph_ids = array();
    if (!empty($node->field_magazine_pages[LANGUAGE_NONE])) {
      foreach ($node->field_magazine_pages[LANGUAGE_NONE] as $delta => $item) {
        $paragraph_ids[] = $node->field_magazine_pages[LANGUAGE_NONE][$delta]['value'];
      }
    }
    if ($paragraph_ids) {
      $pages = paragraphs_item_load_multiple($paragraph_ids);;
      $variables['pages'] = $pages;
      $variables['content']['pages'] = entity_view('paragraphs_item', $pages, 'toc');
    }
    $variables['ywp_cover_photo'] = file_create_url($node->field_cover_photo[LANGUAGE_NONE][0]['uri']);
  }
}
