<?php

/**
 * @file
 * YWP: Magazine mail stuff.
 */

/**
 * Implements hook_mail().
 *
 * @param string $key
 * @param array $message
 * @param array $params
 */
function ywp_magazine_mail($key, &$message, $params) {
  switch ($key) {
    case 'approve_comment':
      $comment = $params['comment'];

      $message['subject'] = 'The Voice: new comment to approve';
      $message['body'][] = '<p>' . t('@name has left a comment that should be approved before publication:', array('@name' => $comment->name)) . '</p>';
      $body = field_view_field('comment', $comment, 'comment_body', 'magazine');
      $message['body'][] = render($body);
      $message['body'][] = '<p>' . t('See it here: @url', array('@url' => url('comment/' . $comment->cid . '/edit', array('absolute' => TRUE)))) . '</p>';
      break;
  }
}
