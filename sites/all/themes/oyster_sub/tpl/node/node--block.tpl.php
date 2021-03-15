<?php
$layout = $content['field_layout']['#items'][0]['value'];
?>

<?php if ($layout == 2) { ?>
  <div id="node--block--2" class="block-row">
    <div class="span6">
      <div class="block-row--content">
      <h1 class="text-center"><?php print $title; ?></h1>
      <?php print render($content['body']); ?>
      <?php  if(!user_is_logged_in()){?>
      <a class="btn shortcode_button btn_small btn_type5" href="/user/login">Join/Log in</a>
      <?php }else{ ?>
      <a class="btn shortcode_button btn_small btn_type5" href="/node/add/blog">Make a Post</a>
      <?php }?>
      </div>
    </div>
    <div class="span6">
      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
        <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>">
        <?php endif; ?>
        <?php if (isset($content['field_image'])): ?>
          <?php print render($content['field_image']); ?>
        <?php endif; ?>
        <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
        </a>
      <?php endif; ?>
    </div>
  </div>
<?php }else { ?>
  <div class="node--block">
    
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>
        <?php print render($content['field_image']); ?>
      <?php endif; ?>
      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
    <?php endif; ?>
    <h3><?php print $title; ?></h3>
    <?php print render($content['body']); ?>
  </div>
<?php } ?>



