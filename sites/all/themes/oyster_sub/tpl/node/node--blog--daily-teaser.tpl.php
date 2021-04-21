<?php
global $base_url;
$user = user_load($node->uid);
$user_link = drupal_get_path_alias('user/' . $node->uid);
$node_link = drupal_get_path_alias('node/' . $node->nid);
?>

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix annotate"<?php print $attributes; ?>>

  <div class="blog_post_page daily-teaser">
    <div class="daily-teaser--image">
      <a href="/daily-read">
        <img src="<?php print path_to_theme();?>/images/the daily deals.png" />
      </a>
      
    </div>
    <div class="daily-teaser--content">
	    
	    <h2 class="daily-teaser--content--title"><?php print $title; ?></h2>
      <div class="daily-teaser--content--author">By <a class="daily-teaser--content--author--link" href="<?php print $user_link; ?>"><?php print $user->name; ?></a>
      </div>
      <div class="daily-teaser--content--more">
        
      </div>

      <div class="daily-teaser--content--body">
        <?php print render($content['body']); ?>

      </div>
      
      <a class="daily-teaser--content--body--link reamdore" href="<?php print $node_link; ?>">
        <?php print t('Read More'); ?>
      </a>
      
    </div>
  </div>
</div>