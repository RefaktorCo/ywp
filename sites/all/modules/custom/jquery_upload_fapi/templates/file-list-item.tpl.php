<?php
/**
 * @file
 * Display uploaded files.
 */
?>
<div id="<?php print $fid; ?>" class="file-list-item">
  <span class="file__thumbnail">
    <?php if ($thumbnail_status): ?>
      <img src="<?php !empty($thumbnail_url) ? print ($thumbnail_url) : 'alt'; ?>"/>
    <?php else: ?>
      <i class="attachment-<?php print $thumbnail_type; ?>"></i>
    <?php endif; ?>
  </span>
  <?php if (isset($trimmed_name)): ?>
    <span class="file__name" title="<?php print isset($name) ? $name : $trimmed_name ?>"><?php print $trimmed_name; ?></span>
  <?php endif; ?>
  <span class="file__delete">
    <a title="<?php print t('remove'); ?>" href=#></a>
  </span>
</div>
