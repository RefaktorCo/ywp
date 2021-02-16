<div class="node--block">
  <h3 class="text-center"><?php print $title; ?></h3>
  <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
    <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>">
    <?php endif; ?>
    <?php if (isset($content['field_image'])): ?>
      <?php print render($content['field_image']); ?>
    <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
    </a>
  <?php endif; ?>
  <?php print render($content['body']); ?>
</div>
