<?php

/**
 * @file
 * YWP Magazine tools.
 */

/**
 * Checks whether current path belongs to YWP Magazine.
 *
 * @return bool
 */
function ywp_magazine_is_magazine_path() {
  $path = current_path();
  if (path_is_admin($path)) {
    return FALSE;
  }
  if ($node = menu_get_object()) {
    return $node->type == 'magazine';
  }
  return strpos($path, YWP_MAGAZINE_PATH) === 0
    || strpos($path, YWP_MAGAZINE_AJAX_PATH) === 0;
}

/**
 * Checks whether current path is YWP Magazine's home path.
 *
 * @return bool
 */
function ywp_magazine_is_home_path() {
  $path = current_path();
  return $path == YWP_MAGAZINE_PATH;
}

/**
 * Returns timestamp of magazine issue month.
 *
 * @param object $node
 *   Magazine node.
 *
 * @return int
 *   Issue month timestamp.
 */
function ywp_magazine_get_date($node) {
  if ($node->type == 'magazine') {
    $date = $node->field_month[LANGUAGE_NONE][0]['value'];
    return strtotime($date);
  }
  return 0;
}

/**
 * @return string
 *   Current month in format 'Y-m'.
 */
function ywp_magazine_get_current_month() {
  return date('Y-m');
}

/**
 * Returns latest magazine issue for a month.
 *
 * @param string|null $month
 *   Month to get latest magazine issue for.
 *
 * @return object|false
 *   Latest magazine issue or FALSE if no magazine node found.
 */
function ywp_magazine_get_latest_issue($month = NULL) {
  if (empty($month)) {
    $month = ywp_magazine_get_current_month();
  }

  $nodes = &drupal_static(__FUNCTION__, array());

  if (!isset($nodes[$month])) {
    // Initial value.
    $nodes[$month] = FALSE;

    $query = new EntityFieldQuery();
    try {
      $query
        ->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'magazine')
        ->propertyCondition('status', 1)
        ->fieldCondition('field_month', 'value', "$month-01 00:00:00", '<=')
        ->fieldOrderBy('field_month', 'value', 'DESC')
        ->range(0, 1);

      $result = $query->execute();
      if (isset($result['node'])) {
        $nids = array_keys($result['node']);
        $nid = reset($nids);
        $nodes[$month] = node_load($nid);
      }
    }
    catch (EntityFieldQueryException $e) {
      ywp_log_error('Cannot load latest magazine issue with error: %error', $e);
    }
  }

  return $nodes[$month];
}

/**
 * Returns paragraph for a month and delta.
 *
 * @param string $month
 *   Month of magazine issue.
 * @param string $delta
 *   Index (starting from 0) of paragraph within magazine issue node.
 *
 * @return \ParagraphsItemEntity|false
 *   Paragraph object or FALSE if no paragraph item found.
 */
function ywp_magazine_get_paragraph($month, $delta) {
  $paragraphs = &drupal_static(__FUNCTION__, array());

  if (!isset($paragraphs[$month][$delta])) {
    // Fallback value.
    $paragraphs[$month][$delta] = FALSE;

    if ($node = ywp_magazine_get_latest_issue($month)) {
      if (!empty($node->field_magazine_pages[LANGUAGE_NONE][$delta]['value'])) {
        $pid = $node->field_magazine_pages[LANGUAGE_NONE][$delta]['value'];
        $paragraphs[$month][$delta] = paragraphs_item_load($pid);
      }
    }
  }

  return $paragraphs[$month][$delta];
}

/**
 * Returns blog node for a magazine page paragraph.
 *
 * @param \ParagraphsItemEntity $paragraph
 *   Magazine page paragraph.
 *
 * @return object|false
 *   Paragraph's blog or FALSE if something went wrong.
 */
function ywp_magazine_get_paragraph_blog(ParagraphsItemEntity $paragraph) {
  $blogs = &drupal_static(__FUNCTION__, array());

  /** @noinspection PhpUndefinedFieldInspection */
  if (!empty($paragraph->field_blog_entry[LANGUAGE_NONE][0]['target_id'])) {
    /** @noinspection PhpUndefinedFieldInspection */
    $nid = $paragraph->field_blog_entry[LANGUAGE_NONE][0]['target_id'];

    if (!isset($blogs[$nid])) {
      $blogs[$nid] = node_load($nid);
    }

    return $blogs[$nid];
  }

  return NULL;
}

/**
 * Returns blog for a month and delta.
 *
 * @param string $month
 *   Month to get blog for.
 * @param string $delta
 *   Delta (starting from 1) of the issue page.
 *
 * @return object|null
 *   Blog node or NULL if something went wrong.
 */
function ywp_magazine_get_blog($month, $delta) {
  if ($paragraph = ywp_magazine_get_paragraph($month, $delta - 1)) {
    if ($blog = ywp_magazine_get_paragraph_blog($paragraph)) {
      return $blog;
    }
  }
  return NULL;
}

/**
 * Returns array of media paragraphs for a page paragraph and view mode.
 *
 * @param \ParagraphsItemEntity $page_paragraph
 *   Page paragraph entity.
 * @param string $view_mode
 *   View mode.
 *
 * @return \ParagraphsItemEntity[]
 *   Array of media paragraphs for a page paragraph and view mode.
 */
function ywp_magazine_get_media_paragraphs($page_paragraph, $view_mode) {
  /** @noinspection PhpUndefinedFieldInspection */
  if (!empty($page_paragraph->field_magazine_page_media[LANGUAGE_NONE])) {
    $media_paragraph_ids = array();

    if ($view_mode == 'full') {
      /** @noinspection PhpUndefinedFieldInspection */
      foreach ($page_paragraph->field_magazine_page_media[LANGUAGE_NONE] as $delta => $item) {
        $media_paragraph_ids[$delta] = $item['value'];
      }
    }
    // When in "teaser" or "toc" view mode, we only need the first media
    // paragraph.
    elseif (in_array($view_mode, array('teaser', 'toc'))) {
      /** @noinspection PhpUndefinedFieldInspection */
      $media_paragraph_ids[] = $page_paragraph->field_magazine_page_media[LANGUAGE_NONE][0]['value'];
    }

    if ($media_paragraph_ids) {
      return paragraphs_item_load_multiple($media_paragraph_ids);
    }
  }

  return array();
}

/**
 * Returns render array for node comments.
 *
 * @param object $node
 *   Node object.
 *
 * @return array
 *   Comment render array.
 */
function ywp_magazine_view_comments($node) {
  if ($cids = ywp_magazine_comment_get_thread($node)) {
    $comments = comment_load_multiple($cids);
    comment_prepare_thread($comments);
    $view = comment_view_multiple($comments, $node, 'magazine');
    $view['#prefix'] = '<div class="ywp-magazine-comments">';
    $view['#suffix'] = '</div>';
    return $view;
  }
  return array();
}

/**
 * Returns JSON-encoded options for YWP Magazine page popups.s
 *
 * @return string
 */
function ywp_magazine_popup_options() {
  return check_plain(json_encode(array(
    'mainClass' => 'magazine-page-popup',
    'tClose' => t('Return to front page'),
  )));
}
