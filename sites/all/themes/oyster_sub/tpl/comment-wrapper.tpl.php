<?php
/**
 * @file comment-wrapper.tpl.php
 * Oyster's custom comment wrapper template.
 */
?>
<div id="comments" class="<?php print $classes; ?>"<?php print $attributes; ?>>
	
	<?php if ($content['comment_form']): ?>
    <h4><?php print t('Leave a comment!'); ?></h4>
    <?php print render($content['comment_form']); ?>
  <?php endif; ?>
	
  <?php if ($content['comments'] && $node->type != 'forum'): ?>
    <?php print render($title_prefix); ?>
    <h4 class="title"><?php print t('Comments'); ?></h2>
    <?php print render($title_suffix); ?>
  <?php endif; ?>

  <?php print render($content['comments']); ?>

</div>
