<?php
	global $base_url, $user;	
	$author = user_load($node->uid);
  
if(isset($content['field_layout']['#items'][0]['value'])){
$layout = $content['field_layout']['#items'][0]['value'];
}else{
$layout = 1;  
}
?>

<?php if ($layout == 2) { ?>
  <div id="node--block--2" class="block-row">
    <div class="span6">
      <div class="block-row--content">
        <h1 class="text-center"><?php print $title; ?></h1>
        <?php print render($content['body']); ?>
        <?php if (!user_is_logged_in()) { ?>
          <a class="btn shortcode_button btn_small btn_type5" href="/user/login" target="_blank">Join/Log in</a>
        <?php } else { ?>
          <a class="btn shortcode_button btn_small btn_type5" href="/node/add/blog" target="_blank">Make a Post</a>
        <?php } ?>
      </div>
    </div>
    <div class="span6">
      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
        <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
        <?php endif; ?>
        <?php if (isset($content['field_image'])): ?>

          <?php
          if (isset($node->field_image['und'][0]['filename'])) {

            $image = file_load($node->field_image['und'][0]['fid']);
            print (
                    theme('image_style',
                            array(
                                'style_name' => '520x300', //'oyster_portfolio_grid1', 
                                'path' => $image->uri,
                                'getsize' => FALSE
                            )
                    )
            );
          }
          ?>
        <?php endif; ?>
      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
        </a>
      
    <?php endif; ?>
      <div class="credit-text">
        <?php print render($content['field_title_of_the_art']); ?>        
      </div>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>
<?php } else if ($layout == 3) { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>
        <?php print render($content['field_image']); ?>
      <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
    <?php endif; ?>
      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
  <?php endif; ?>

      <h3 class="center"><?php print $title; ?></h3>

    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
  <?php endif; ?>

    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>
<?php } else if ($layout == 4) { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>
        <?php print render($content['field_image']); ?>
      <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
  <?php endif; ?>

    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>
<?php } else if ($layout == 5) { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>

        <?php
        if (isset($node->field_image['und'][0]['filename'])) {

          $image = file_load($node->field_image['und'][0]['fid']);
          print (
                  theme('image_style',
                          array(
                              'style_name' => '330x530',
                              'path' => $image->uri,
                              'getsize' => FALSE
                          )
                  )
          );
        }
        ?>
    <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
      <?php endif; ?>

    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>

<?php } else if ($layout == 6) { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>

        <?php
        if (isset($node->field_image['und'][0]['filename'])) {

          $image = file_load($node->field_image['und'][0]['fid']);
          print (
                  theme('image_style',
                          array(
                              'style_name' => '330x150',
                              'path' => $image->uri,
                              'getsize' => FALSE
                          )
                  )
          );
        }
        ?>
    <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
      <?php endif; ?>

    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>

<?php } else if ($layout == 7) { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>

        <?php
        if (isset($node->field_image['und'][0]['filename'])) {

          $image = file_load($node->field_image['und'][0]['fid']);
          print (
                  theme('image_style',
                          array(
                              'style_name' => '330',
                              'path' => $image->uri,
                              'getsize' => FALSE
                          )
                  )
          );
        }
        ?>
    <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
      <?php endif; ?>

    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>
  <?php } else { ?>
  <div class="node--block">

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
  <?php endif; ?>

      <h3 class="center"><?php print $title; ?></h3>

    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
    <?php endif; ?>

      <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      <a href="<?php print render($content['field_link']['#items'][0]['url']); ?>" target="_blank">
      <?php endif; ?>
      <?php if (isset($content['field_image'])): ?>
        <?php print render($content['field_image']); ?>
    <?php endif; ?>
    <?php if (isset($content['field_link']['#items'][0]['url'])): ?>
      </a>
      <?php endif; ?>
    <div class="block-row--body">
    <?php print render($content['body']); ?>
    </div>
    <?php if (in_array('administrator', $user->roles)) : ?>
      <a href="/node/<?php print $node->nid; ?>/edit" target='_blank'>[Edit]</a>
  <?php endif; ?>
  </div>
<?php } ?>



