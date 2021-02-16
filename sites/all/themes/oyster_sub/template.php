<?php

/*
 * Prefix your custom functions with oyster_sub. For example:
 * oyster_sub_form_alter(&$form, &$form_state, $form_id) { ... }
 */







function oyster_sub_preprocess_node(&$variables) {
  if (module_exists('og')) {

    if ($variables['type'] == 'playlist') {
      $field_value = &$variables['content']['group_group'][0];
      $is_link = $field_value['#type'] == 'link';
      $class = $is_link ?
              reset($field_value['#options']['attributes']['class']) :
              $field_value['#attributes']['class'];
      switch ($class) {
        case 'group subscribe':
          $field_value['#title'] = t('Join Workshop');
          unset($field_value['#options']['attributes']['title']);
          break;
        case 'group unsubscribe':
          $field_value['#title'] = t('Leave Workshop');
          unset($field_value['#options']['attributes']['title']);
          break;
        case 'group other':
          $field_value['#value'] = t('You are already subscribed to other groups');
          unset($field_value['#attributes']['title']);
          break;
        case 'group closed':
          $field_value['#value'] = t('Workshop Closed.');
          unset($field_value['#attributes']['title']);
          break;
        case 'group manager':
          $field_value['#value'] = t('This is my Workshop');
          unset($field_value['#attributes']['title']);
          break;
      }
    }
  }
}

function rows_from_field_collection(&$vars, $field_name, $field_array) {
  $vars['rows'] = array();
  foreach ($vars['element']['#items'] as $key => $item) {
    $entity_id = $item['value'];
    $entity = field_collection_item_load($entity_id);
    $wrapper = entity_metadata_wrapper('field_collection_item', $entity);
    $row = array();
    foreach ($field_array as $field) {
      $row[$field] = $wrapper->$field->value();
    }
    $vars['rows'][] = $row;
  }
}

function oyster_sub_preprocess_field(&$vars, $hook) {
  $fields = array('field_our_philosophy', 'field_how_to_apply', 'field_mentors_vs_artist_coaches');

  if ($vars['element']['#field_name'] == 'field_getting_started') {
    $vars['theme_hook_suggestions'][] = 'field__field_getting_started';
    $field_array = array('field_getting_started_text', 'field_getting_started_link');
    rows_from_field_collection($vars, 'field_getting_started', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_our_programs') {
    $vars['theme_hook_suggestions'][] = 'field__field_our_programs';
    $field_array = array('field_program_name', 'field_program_description');
    rows_from_field_collection($vars, 'field_our_programs', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_additional_services') {
    $vars['theme_hook_suggestions'][] = 'field__field_additional_services';
    $field_array = array('field_program_name', 'field_program_description');
    rows_from_field_collection($vars, 'field_additional_services', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_the_impact') {
    $vars['theme_hook_suggestions'][] = 'field__field_the_impact';
    $field_array = array('field_the_impact_title', 'field_the_impact_images', 'field_the_impact_description');
    rows_from_field_collection($vars, 'field_the_impact', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_useful_links') {
    $vars['theme_hook_suggestions'][] = 'field__field_useful_links';
    $field_array = array('field_useful_link_title', 'field_useful_link_url');
    rows_from_field_collection($vars, 'field_useful_links', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_mentor_testimonials') {
    $vars['theme_hook_suggestions'][] = 'field__field_mentor_testimonials';
    $field_array = array('field_mentor_image', 'field_mentor_testimonial');
    rows_from_field_collection($vars, 'field_mentor_testimonials', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_title_body') {
    $vars['theme_hook_suggestions'][] = 'field__field_title_body';
    $field_array = array('field_title', 'field_body');
    rows_from_field_collection($vars, 'field_title_body', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_story_photo_top') {
    $vars['theme_hook_suggestions'][] = 'field__field_story_photo_top';
    $field_array = array('field_story_photo', 'field_story_link', 'field_story_body');
    rows_from_field_collection($vars, 'field_story_photo_top', $field_array);
  }
  if ($vars['element']['#field_name'] == 'field_xp_components') {
    $vars['theme_hook_suggestions'][] = 'field__field_xp_components';
    $field_array = array('field_component_title', 'field_component_icon', 'field_component_body');
    rows_from_field_collection($vars, 'field_xp_components', $field_array);
  }

  foreach ($fields as $field) {
    if ($vars['element']['#field_name'] == $field) {
      $vars['theme_hook_suggestions'][] = 'field__' . $field;
      $field_array = array('field_about_title', 'field_about_body');
      rows_from_field_collection($vars, $field, $field_array);
    }
  }
}

/**
 * Check if user has one of the roles passed as an array
 *
 * @param array $roles : array of roles as int (rid stored in database.
 * @param int $user_id : optionnal, default to current user if not defined
 * @return bool
 */
function oyster_sub_user_has_role($roles = array(), $user_id = null) {
  if (is_null($user_id)) {
    $user_id = $GLOBALS['user']->uid;
  }
  $user = user_load($user_id);
  if ($user->uid == 1) {
    return TRUE;
  }
  $user_roles = array_keys($user->roles);
  foreach ($roles as $role) {
    if (in_array($role, $user_roles)) {
      return TRUE;
    }
  }
  return FALSE;
}

function oyster_sub_form_comment_form_alter(&$form, &$form_state, $form_id) {
  unset($form['subject']);
}

function oyster_sub_item_list($variables) {
  $items = $variables['items'];
  $title = $variables['title'];
  $type = $variables['type'];
  $attributes = $variables['attributes'];

  // Only output the list container and title, if there are any list items.
  // Check to see whether the block title exists before adding a header.
  // Empty headers are not semantic and present accessibility challenges.
  $output = '<div class="item-list">';
  if (isset($title) && $title !== '') {
    $output .= '<h3>' . $title . '</h3>';
  }

  if (!empty($items)) {
    $output .= "<$type" . drupal_attributes($attributes) . '>';
    $num_items = count($items);
    $i = 0;
    foreach ($items as $item) {
      $attributes = array();
      $children = array();
      $data = '';
      $i++;
      if (is_array($item)) {
        foreach ($item as $key => $value) {
          if ($key == 'data') {
            $data = $value;
          } elseif ($key == 'children') {
            $children = $value;
          } else {
            $attributes[$key] = $value;
          }
        }
      } else {
        $data = $item;
      }
      if (count($children) > 0) {
        // Render nested list.
        $data .= theme_item_list(array('items' => $children, 'title' => NULL, 'type' => $type, 'attributes' => $attributes));
      }
      if ($i == 1) {
        $attributes['class'][] = 'first';
      }
      if ($i == $num_items) {
        $attributes['class'][] = 'last';
      }
      $output .= '<li' . drupal_attributes($attributes) . '>' . $data . "</li>\n";
    }
    $output .= "</$type>";
  }
  $output .= '</div>';
  return $output;
}

function oyster_sub_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'commerce_cart_add_to_cart_form_1') {
    $form['submit']['#value'] = 'donate';
    $form['#submit'][] = '_oyster_sub_donate_submit';
  }
}

function _oyster_sub_donate_submit() {
  global $base_url;
  drupal_goto($base_url . '/checkout');
}

/**
 * Assign theme hook suggestions for custom templates.
 */
function oyster_sub_preprocess_page(&$vars, $hook) {
  $header = drupal_get_http_header("status");
  if (isset($vars['node'])) {
    $suggest = "page__node__{$vars['node']->type}";
    $vars['theme_hook_suggestions'][] = $suggest;
  }
  libraries_load('owl.carousel', 'default');
  if ($header == "403 Forbidden") {

  }
}

/**
 * Modify theme_field()
 */
function oyster_sub_field($variables) {
  $output = '';
  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $output .= '<div class="field-label"' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }
  switch ($variables['element']['#field_name']) {
    case 'field_tags':
    case 'field_ywp_tags':
      foreach ($variables['items'] as $delta => $item) {
        $rendered_tags[] = drupal_render($item);
      }
      $output .= implode(', ', $rendered_tags);
      break;
    case 'field_portfolio_category':
    case 'field_category':
    case 'field_article_category':
    case 'field_challenge':
    case 'field_project':
    case 'field_skill':
    case 'field_meta_tag':

      foreach ($variables['items'] as $delta => $item) {
        $rendered_tags[] = drupal_render($item);
      }
      $output .= implode(', ', $rendered_tags);
      break;
    case 'field_portfolio_skills':
      foreach ($variables['items'] as $delta => $item) {
        $output .= '<span class="preview_skills">' . drupal_render($item) . '</span>';
      }
      break;
    case 'field_slideshow':
      if ($variables['element']['#bundle'] == 'article') {
        foreach ($variables['items'] as $delta => $item) {
          $output .= '<div class="item">' . drupal_render($item) . '</div>';
        }
        // Add Owl Carousel to the article images.
        if (count($variables['items'])) {
          $variables['classes'] .= ' owl-carousel owl-theme';
          $output = '<div class="' . $variables['classes'] . '"' . $variables['attributes'] . '>' . $output . '</div>';
          libraries_load('owl.carousel', 'default');
        }
      }
      break;
    case 'field_image':
      if ($variables['element']['#bundle'] == 'portfolio') {
        foreach ($variables['items'] as $delta => $item) {
          $output .= drupal_render($item);
        }
      }
      break;
    case 'field_media_embed':
    case 'field_oyster_page_video':
    case 'field_headline_1':
    case 'field_getting_started_intro':
    case 'field_useful_links_headline':
    case 'field_about_title':
    case 'field_about_body':
    case 'field_mentor_testimonials_headli':
    case 'field_mentor_image':
    case 'field_mentor_testimonial':
    case 'field_story_photo':
    case 'field_story_link':
    case 'field_story_body':
    case 'field_featured_publication_link':
    case 'field_featured_publication_photo':
    case 'field_featured_publication_body':
    case 'field_component_title':
    case 'field_component_icon':
    case 'field_component_body':
      foreach ($variables['items'] as $delta => $item) {
        $output .= drupal_render($item);
      }
      break;
    default:
      // Render the items.
      $output .= '<div class="field-items"' . $variables['content_attributes'] . '>';
      foreach ($variables['items'] as $delta => $item) {
        $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
        $output .= '<div class="' . $classes . '"' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
      }
      $output .= '</div>';

      // Render the top-level DIV.
      $output = '<div class="' . $variables['classes'] . '"' . $variables['attributes'] . '>' . $output . '</div>';
      break;
  }

  return $output;
}
