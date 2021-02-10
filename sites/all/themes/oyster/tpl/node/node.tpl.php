<?php if (!$teaser): ?>
<div class="prev_next_links">
  <?php if (oyster_node_pagination($node, 'p') != NULL) : ?>
    <div class="fleft"><a href="<?php print url('node/' . oyster_node_pagination($node, 'p'), array('absolute' => TRUE)); ?>"><?php print t('Previous Post'); ?></a></div>
  <?php endif; ?>
  <?php if (oyster_node_pagination($node, 'n') != NULL) : ?>
    <div class="fright"><a href="<?php print url('node/' . oyster_node_pagination($node, 'n'), array('absolute' => TRUE)); ?>"><?php print t('Next Post'); ?></a></div>
  <?php endif; ?>
</div>
<?php endif; ?>

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
          <span><?php print t('in'); ?> <?php print render($content['field_category']); ?></span>
        <?php endif; ?>  
        <?php if ( theme_get_setting('article_meta_comments') == '1' && isset($comment_count) ) : ?>
        <span><a href="<?php print $node_url;?>/#comments"><?php print $comment_count; ?> Comment<?php if ($comment_count != "1" ) { echo "s"; } ?></a></span>
        <?php endif; ?>
        <?php if (render($content['field_ywp_tags'])): ?><span><?php print t('tags: '); print render($content['field_ywp_tags']); ?></span><?php endif;?>
        <?php if (render($content['field_challenge'])): ?><span><?php print t('challenge: '); print render($content['field_challenge']); ?></span><?php endif;?>
        <?php if (render($content['field_project'])): ?><span><?php print t('project: '); print render($content['field_project']); ?></span><?php endif;?>
      </div>   
      <?php if ($display_submitted): ?>                                     
        <div class="author_ava"><?php print $user_picture; ?><div class="author"><?php print $name; ?></div></div>
      <?php endif; ?>
    </div>
    <?php print render($title_prefix); ?>
    <?php if ( theme_get_setting('article_meta_title') == '1' ) : ?>
    <h3<?php print $title_attributes; ?> class="blogpost_title"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h3>
    <?php endif; ?>
    <?php print render($title_suffix); ?>
	
	  <article class="contentarea clearfix"<?php print $content_attributes; ?>>
		                         	
    <?php print render($content['field_image']); ?>
    
    <?php if (render($content['field_media_embed'])): ?>
      <div class="pf_output_container"><?php print render($content['field_media_embed']);?></div>
    <?php endif; ?>
		  
	    <?php
	      // We hide the comments and links now so that we can render them later.
	      hide($content['comments']);
	      hide($content['links']);
	      hide($content['field_image']);
	      print render($content);
	    ?>
	    
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

		<div class="blog_post-footer">

	    <?php if ($teaser): ?>
	    <a href="<?php print $node_url; ?>" class="shortcode_button btn_small btn_type5 reamdore"><?php print t('Read More'); ?></a>
	    <?php endif; ?>
	    
	    <?php if (render($content['field_like']) || module_exists('statistics')): ?> 
	    <div class="block_likes">
	      <?php if (module_exists('statistics') && user_access("view post access counter")): ?>
	      <div class="post-views"><i class="stand_icon icon-eye"></i> <span><?php $var = statistics_get($nid); print ($var['totalcount']) +1; ?></span></div>
	      <?php endif; ?>
	    </div> 
	    <?php endif; ?>
	    
	    <div class="clear"></div>
    </div>
    
    </article>
    
  </div> 
  
  <?php if (!$teaser): ?>
	<?php print render($content['comments']); ?>
	<?php endif; ?>
 
</div>