<?php 
  // Declare $base_url global.
  global $base_url, $user;
	$author = user_load($uid);
  
  $user = user_load($user->uid);
	$group = og_is_member('node', $node->og_group_ref['und'][0]['target_id'], 'user', $user);
  
	if (isset($author->picture->uri)) {
		$photo = theme('image_style', array('style_name' => 'author_thumbnail', 'path' => $author->picture->uri));
	}
	else {
		$photo = $user_picture;
	}
  
  if (!empty($node->field_xp_components)) {
	  $components = array();
	  foreach ($node->field_xp_components['und'] as $component) {
		  $components[] = $component['value'];
	  }
	  $components = field_collection_item_load_multiple($ids = $components, $conditions = array(), $reset = FALSE);
  }
  
?>

<?php if ($teaser): ?>

<div class="shortcode_tab_item_title expand_no"><?php print $title; ?></div>
<div class="shortcode_tab_item_body tab-content clearfix">
  <div class="ip">
	  <?php print render($content['field_xp_summary']); ?>
	  <a href="<?php print $node_url; ?>" class="shortcode_button btn_small btn_type5"><?php print t('View'); ?></a>
	  <?php if ($group == TRUE): ?>
	  <a href="<?php print $base_url; ?>/node/add/x-post?field_xp_reference=<?php print $node->nid; ?>" target="_blank" class="respond shortcode_button btn_small btn_type5"><?php print t('Respond'); ?></a>
	  <?php endif; ?>
	  
	  <?php if (render($content['field_view_reference'])): ?>
	    <h4 class="xp-responses-heading"><?php print t('All responses to '); print $title; ?></h4>
	    <div class="view-reference-wrapper">
	      <?php print render($content['field_view_reference']); ?>
	    </div>
	  <?php endif; ?>
	  
  </div>  
</div>
 
<?php endif; ?>  
<?php if (!$teaser): ?>

<div class="playlist-breadcrumbs">
	<a href="<?php print $base_url.'/node/'.$node->og_group_ref['und'][0]['target_id']; ?>">Workshop</a> > <?php print $title; ?>
</div>

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <div class="blog_post_page <?php if ($teaser) { print 'blog_teaser'; } ?>">
  
    <div class="blogpreview_top <?php if ( theme_get_setting('article_meta_date') != '1' ) { print "nodate"; } ?>">
      <?php if ( theme_get_setting('article_meta_date') == '1' ) : ?>
      <div class="box_date">
        <span class="box_month"><?php print format_date($node->created, 'custom', 'M'); ?></span>
        <span class="box_day"><?php print format_date($node->created, 'custom', 'd'); ?></span>
      </div>   
      <?php endif; ?>                                         
      <div class="listing_meta">
        <?php if (isset($content['field_category'])): ?>
          <span><?php print render($content['field_category']); ?></span>
        <?php endif; ?>  
        <?php if (render($content['field_challenge'])): ?><span><?php print t('challenge: '); print render($content['field_challenge']); ?></span><?php endif;?>
        <?php if (render($content['field_project'])): ?><span><?php print t('project: '); print render($content['field_project']); ?></span><?php endif;?>
      </div>   
      <?php if ($display_submitted): ?>                                     
        <div class="author_ava"><?php print $photo; ?><div class="author"><?php print $name; ?></div></div>
      <?php endif; ?>
    </div>
    <?php print render($title_prefix); ?>
    <?php if ( theme_get_setting('article_meta_title') == '1' ) : ?>
    <h3<?php print $title_attributes; ?> class="blogpost_title"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h3>
    <?php endif; ?>
    <?php print render($title_suffix); ?>
    
    <?php if (isset($components)): ?>
    <div class="components-wrapper">
	    <?php $count = 1; foreach ($components as $component) {
		    print '<div class="component"><a href="#xp-component-'.$count.'"><i class="fa '.$component->field_component_icon['und'][0]['value'].'"></i><span>'.$component->field_component_title['und'][0]['value'].'</span></a></div>';
	    $count++;}?>
    </div>  
    <?php endif; ?>
    
	
	  <article class="contentarea clearfix"<?php print $content_attributes; ?>>
		  
		<?php print render($content['field_image']); ?>
		  
	    <?php
	      // We hide the comments and links now so that we can render them later.
	      hide($content['comments']);
	      hide($content['links']);
	      hide($content['field_image']);
	      hide($content['field_like']);
	      hide($content['og_group_ref']);
	      print render($content);
	    ?>
	   
			<?php print render($content['og_group_ref']); ?>
 	    
	    	<?php
    unset($content['links']['comment']['#links']['comment-add']);
    // Only display the wrapper div if there are links.
    $links = render($content['links']);
    if ($links):
  ?>
    <div class="link-wrapper">
      <?php print $links; ?>
    </div>

  <?php endif; ?>
  <?php if ($group == TRUE): ?>
  <a href="<?php print $base_url; ?>/node/add/x-post?field_xp_reference=<?php print $node->nid; ?>" target="_blank" class="respond shortcode_button btn_small btn_type5"><?php print t('Respond'); ?></a>
  <?php endif; ?>
	    
		<div class="blog_post-footer">

	    <?php if ($teaser): ?>
	    <a href="<?php print $node_url; ?>" class="shortcode_button btn_small btn_type5 reamdore"><?php print t('Read More'); ?></a>
	    <?php endif; ?>
	    
	    <?php if (render($content['field_like']) || module_exists('statistics')): ?> 
	    <div class="block_likes">
        <div class="block_likes--tags">
                  <?php if (render($content['field_ywp_tags'])): ?><span><?php print t('tags: '); print render($content['field_ywp_tags']); ?></span><?php endif;?>

        </div>
	      <?php if (module_exists('statistics') && user_access("view post access counter")): ?>
	      <div class="post-views"><i class="stand_icon icon-eye"></i> <span><?php $var = statistics_get($nid); print ($var['totalcount']) +1; ?></span></div>
	      <?php endif; ?>
	      <?php print flag_create_link('loves', $node->nid); ?>	   
	    </div> 
	    <?php endif; ?>
	    
	    <div class="clear"></div>
    </div>
    
    </article>
    
  </div> 
  
  <?php // print theme('about_the_author', array('author' => $author, 'picture' => $photo, 'path' => $base_url)); ?>
  
	<?php print render($content['comments']); ?>
 
</div>
<?php endif; ?>