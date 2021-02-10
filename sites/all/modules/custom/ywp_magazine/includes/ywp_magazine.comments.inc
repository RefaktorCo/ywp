<?php

/**
 * @file
 * Provides forms for YWP: Magazine module.
 */

/**
 * Returns array of comment ids in thread order.
 *
 * @param object $node
 *   Node to get comments thread form.
 *
 * @return array
 *   Array of comment ids.
 *
 * @see comment_get_thread()
 */
function ywp_magazine_comment_get_thread($node) {
  $mode = variable_get('comment_default_mode_' . $node->type, COMMENT_MODE_THREADED);

  $query = db_select('comment', 'c');
  $query->addField('c', 'cid');
  $query
    ->condition('c.nid', $node->nid)
    ->addTag('node_access')
    ->addTag('comment_filter')
    ->addMetaData('node', $node);

  if (!user_access('administer comments')) {
    $query->condition('c.status', COMMENT_PUBLISHED);
  }

  if ($mode === COMMENT_MODE_FLAT) {
    $query->orderBy('c.cid', 'ASC');
  }
  else {
    $query->addExpression('SUBSTRING(c.thread, 1, (LENGTH(c.thread) - 1))', 'torder');
    $query->orderBy('torder', 'ASC');
  }

  return $query->execute()->fetchCol();
}

/**
 * @param array $form
 * @param array $form_state
 * @param object $comment
 *
 * @return array
 *
 * @throws \Exception
 *
 * @see comment_form()
 */
function ywp_magazine_comment_form($form, &$form_state, $comment) {
  global $user;

  // During initial form build, add the comment entity to the form state for
  // use during form building and processing. During a rebuild, use what is in
  // the form state.
  if (!isset($form_state['comment'])) {
    $defaults = array(
      'name' => '',
      'mail' => '',
      'homepage' => '',
      'subject' => '',
      'comment' => '',
      'cid' => NULL,
      'pid' => NULL,
      'language' => LANGUAGE_NONE,
      'uid' => 0,
    );
    foreach ($defaults as $key => $value) {
      if (!isset($comment->$key)) {
        $comment->$key = $value;
      }
    }
    $form_state['comment'] = $comment;
  }
  else {
    $comment = $form_state['comment'];
  }

  $node = node_load($comment->nid);
  $form['#node'] = $node;

  // Use #comment-form as unique jump target, regardless of node type.
  $form['#id'] = drupal_html_id('ywp_magazine_comment_form');
  $form['#attributes']['class'][] = 'comment-form';
  $form['#attributes']['class'][] = 'ywp-magazine-comment-form';
  $form['#theme'] = array('comment_form__node_' . $node->type, 'comment_form');

  $form['author'] = array(
    '#weight' => -2,
  );

  $anonymous_contact = variable_get('comment_anonymous_' . $node->type, COMMENT_ANONYMOUS_MAYNOT_CONTACT);
  if ($user->uid) {
    $author = $user->name;
  }
  else {
    $author = ($comment->name ? $comment->name : '');
  }

  if ($user->uid) {
    $form['author']['_author'] = array(
      '#type' => 'item',
      '#title' => t('Your name'),
      '#markup' => theme('username', array('account' => $user)),
    );
    $form['author']['name'] = array(
      '#type' => 'value',
      '#value' => $author,
    );
  }
  else {
    $form['author']['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Your name'),
      '#default_value' => $author,
      '#required' => TRUE,
      '#maxlength' => 60,
      '#size' => 30,
    );
  }

  // Add author e-mail and homepage fields depending on the current user.
  $form['author']['mail'] = array(
    '#type' => 'textfield',
    '#title' => t('E-mail'),
    '#default_value' => $comment->mail,
    '#required' => (!$user->uid && $anonymous_contact == COMMENT_ANONYMOUS_MUST_CONTACT),
    '#maxlength' => 64,
    '#size' => 30,
    '#description' => t('The content of this field is kept private and will not be shown publicly.'),
    '#access' => !$user->uid && $anonymous_contact != COMMENT_ANONYMOUS_MAYNOT_CONTACT,
  );
  $form['author']['homepage'] = array(
    '#type' => 'textfield',
    '#title' => t('Homepage'),
    '#default_value' => $comment->homepage,
    '#maxlength' => 255,
    '#size' => 30,
    '#access' => !$user->uid && $anonymous_contact != COMMENT_ANONYMOUS_MAYNOT_CONTACT,
  );

  $form['subject'] = array(
    '#type' => 'textfield',
    '#title' => t('Subject'),
    '#maxlength' => 64,
    '#default_value' => $comment->subject,
    '#access' => variable_get('comment_subject_field_' . $node->type, 1) == 1,
    '#weight' => -1,
  );

  // Used for conditional validation of author fields.
  $form['is_anonymous'] = array(
    '#type' => 'value',
    '#value' => ($comment->cid ? !$comment->uid : !$user->uid),
  );

  // Add internal comment properties.
  foreach (array('cid', 'pid', 'nid', 'language', 'uid') as $key) {
    $form[$key] = array('#type' => 'value', '#value' => $comment->$key);
  }
  $form['node_type'] = array('#type' => 'value', '#value' => 'comment_node_' . $node->type);

  // Add form actions.
  $form['actions'] = array('#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
    '#weight' => 19,
    '#ajax' => array(
      'callback' => 'ywp_magazine_comment_form_submit_ajax',
      'wrapper' => $form['#id'],
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // Attach fields.
  $comment->node_type = 'comment_node_' . $node->type;
  $langcode = entity_language('comment', $comment);
  field_attach_form('comment', $comment, $form, $form_state, $langcode);

  // Do not use audio record field on this simplified form.
  $form['field_audio_record']['#access'] = FALSE;

  return $form;
}

/**
 * Validate comment form submissions.
 *
 * @param array $form
 * @param array $form_state
 *
 * @see comment_form_validate()
 */
function ywp_magazine_comment_form_validate($form, &$form_state) {
  comment_form_validate($form,$form_state);
}

/**
 * Process comment form submissions; prepare the comment, store it, and set a
 * redirection target.
 *
 * @param array $form
 * @param array $form_state
 *
 * @throws \Exception
 *
 * @see comment_form_submit()
 */
function ywp_magazine_comment_form_submit($form, &$form_state) {
  $comment = comment_form_submit_build_comment($form, $form_state);

  comment_save($comment);
  $form_state['values']['cid'] = $comment->cid;

  // Add an entry to the watchdog log.
  watchdog('content', 'Comment posted: %subject.', array('%subject' => $comment->subject), WATCHDOG_NOTICE, l(t('view'), 'comment/' . $comment->cid, array('fragment' => 'comment-' . $comment->cid)));

  // Explain the approval queue if necessary.
  if ($comment->status == COMMENT_NOT_PUBLISHED) {
    if (!user_access('administer comments')) {
      drupal_set_message(t('Your comment has been queued for review by site administrators and will be published after approval.'));
      $admin_mail = variable_get('site_mail', ini_get('sendmail_from'));
      drupal_mail('ywp_magazine', 'approve_comment', $admin_mail, language_default(), array('comment' => $comment));
    }
  }
  else {
    drupal_set_message(t('Your comment has been posted.'));
  }

  // Clear the block and page caches so that anonymous users see the comment
  // they have posted.
  cache_clear_all();
}

/**
 * AJAX submit callback for comment form.
 *
 * @param array $form
 * @param array $form_state
 *
 * @return array
 * @throws \Exception
 *
 * @see ajax_comments_submit_js()
 */
function ywp_magazine_comment_form_submit_ajax($form, &$form_state) {
  // Return the actual form if it contains errors.
  if (form_get_errors()) {
    return $form;
  }

  $node = $form['#node'];

  $commands = array();

  $comments = ywp_magazine_view_comments($node);
  $selector = '.ywp-magazine-comments';
  $commands[] = ajax_command_replace($selector, render($comments));

  $new_form_state = array();
  $new_form_state['build_info']['args'][] = (object) array('nid' => $node->nid);
  $new_form_state['input'] = array();
  $new_form_build = drupal_build_form($form['#form_id'], $new_form_state);
  $selector = '.ywp-magazine-comment-form';
  $commands[] = ajax_command_replace($selector, render($new_form_build));

  $messages = theme('status_messages');
  $commands[] = ajax_command_before($selector, $messages);

  return array('#type' => 'ajax', '#commands' => $commands);
}
