<?php
/**
 * @file
 * Display uploaded images.
 */
?>
<div id="<?php print $fid; ?>" class="file-list-item">
  <span class="file__thumbnail">
    <?php if ($thumbnail_status): ?>
      <img src="<?php !empty($thumbnail_url) ? print ($thumbnail_url) : ''; ?>"/>
    <?php else: ?>
      <i class="attachment-<?php print $thumbnail_type; ?>"><i>
    <?php endif; ?>
  </span>
  <?php if (isset($trimmed_name)): ?>
    <span class="file__name" title="<?php print isset($name) ? $name : $trimmed_name ?>"><?php print $trimmed_name; ?></span>
  <?php endif; ?>
  <span class="file-options">
    <span class="file__delete">
      <a title="<?php print t('remove'); ?>" href=#></a>
    </span>
    <span class="default-images" title="<?php print t('Set as tile image'); ?>">
      <a href='#' class="set-default-image unselected"></a>
    </span>
  </span>
</div>
