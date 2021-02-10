<?php 
  global $base_url;
	$user = user_load($uid);
	
	if (isset($user->picture->uri)) {
		$photo = theme('image_style', array('style_name' => 'author_thumbnail', 'path' => $user->picture->uri));
	}
	else {
		$photo = $user_picture;
	}
	
	if (isset($content['field_audio']['#items'][0])) {
		if ($content['field_audio']['#items'][0]['fid'] != '') {
			$audio_file = file_load($content['field_audio']['#items'][0]['fid']);
			$audio_title = $audio_file->filename;
			$audio_uri = $audio_file->uri;
			$audio_url = file_create_url($audio_uri);
		}
	}
	if (isset($content['field_audio_upload']['#items'][0])) {
		if ($content['field_audio_upload']['#items'][0]['fid'] != '') {
			$audio_upload_file = file_load($content['field_audio_upload']['#items'][0]['fid']);
			$audio_upload_title = $audio_upload_file->filename;
			$audio_upload_uri = $audio_upload_file->uri;
			$audio_upload_url = file_create_url($audio_upload_uri);
		}
	}
	if (isset($content['field_audio_record']['#items'][0])) {
		if ($content['field_audio_record']['#items'][0]['fid'] != '') {
			$audio_record_file = file_load($content['field_audio_record']['#items'][0]['fid']);
			$audio_record_title = $audio_record_file->filename;
			$audio_record_uri = $audio_record_file->uri;
			$audio_record_url = file_create_url($audio_record_uri);
		}
	}
	
?>
  
<?php if (!$teaser && isset($node->field_workshop_challenge['und'][0])): ?>
<?php $workshop = ywp_workshop_get_workshop($node); ?>
<div class="playlist-breadcrumbs">
	<a href="<?php print $base_url.'/node/'.$workshop->nid; ?>">Workshop</a> > <a href="<?php print $base_url.'/node/'.$node->field_workshop_challenge['und'][0]['target_id']; ?>">Challenge</a> > <?php print $title; ?>
</div>
<?php endif; ?>

<?php if (!$teaser && !isset($node->field_workshop_challenge['und'][0])): ?>
<div class="prev_next_links">
  <?php if (oyster_node_pagination($node, 'p') != NULL) : ?>
    <div class="fleft"><a href="<?php print url('node/' . oyster_node_pagination($node, 'p'), array('absolute' => TRUE)); ?>"><?php print t('Previous Post'); ?></a></div>
  <?php endif; ?>
  <?php if (oyster_node_pagination($node, 'n') != NULL) : ?>
    <div class="fright"><a href="<?php print url('node/' . oyster_node_pagination($node, 'n'), array('absolute' => TRUE)); ?>"><?php print t('Next Post'); ?></a></div>
  <?php endif; ?>
</div>
<?php endif; ?>

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix annotate"<?php print $attributes; ?>>

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
        <?php if ( theme_get_setting('article_meta_comments') == '1' && isset($comment_count) ) : ?>
        <span><a href="<?php print $node_url;?>/#comments"><?php print $comment_count; ?> comment<?php if ($comment_count != "1" ) { echo "s"; } ?></a></span>
        <?php endif; ?>
        <?php if (render($content['field_ywp_tags'])): ?><span><?php print t('tags: '); print render($content['field_ywp_tags']); ?></span><?php endif;?>
        <?php if (render($content['field_challenge'])): ?><span><?php print t('challenge: '); print render($content['field_challenge']); ?></span><?php endif;?>
        <?php if (render($content['field_project'])): ?><span><?php print t('project: '); print render($content['field_project']); ?></span><?php endif;?>
        <?php if (isset($content['field_playlist_genre'])): ?>
          <span><?php print t('genre: '); print render($content['field_playlist_genre']); ?></span>
        <?php endif; ?>  
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
	      hide($content['field_like']);
	      hide($content['field_not_for_publication']);
	      hide($content['field_published_on']);
	      print render($content);
	    ?>
	    
	    <?php 
		    if (!$teaser && isset($content['field_not_for_publication']['#items'][0])) {
			    if ($content['field_not_for_publication']['#items'][0]['value'] == 'YES') {
			    	print '<div class="published">'.render($content['field_published_on']).'</div>';
		    	}
		    	else {
			    	print '<div class="published">'.render($content['field_not_for_publication']).'</div>';
		    	}
	    	}
	    ?>
	    
	    <?php if (isset($audio_url)): ?>
	    <div class="audio-download">
				<h5><?php print t('Audio download:');?></h5> <a href="<?php print $audio_url; ?>"><?php print $audio_title; ?></a>
  		</div>
  		<?php endif; ?>
  		
  		<?php if (isset($audio_upload_url)): ?>
	    <div class="audio-download">
				<h5><?php print t('Audio download:');?></h5> <a href="<?php print $audio_upload_url; ?>"><?php print $audio_upload_title; ?></a>
  		</div>
  		<?php endif; ?>
  		
  		<?php if (isset($audio_record_url)): ?>
	    <div class="audio-download">
				<h5><?php print t('Audio download:');?></h5> <a href="<?php print $audio_record_url; ?>"><?php print $audio_record_title; ?></a>
  		</div>
  		<?php endif; ?>

	    	<?php
		    	
    unset($content['links']['comment']['#links']['comment-add']);
    unset($content['links']['flag']);
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
		    <div class="post-date">
			    Posted: <?php print format_date($node->created, 'custom', 'm'); ?>.<?php print format_date($node->created, 'custom', 'd'); ?>.<?php print format_date($node->created, 'custom', 'y'); ?> 
		    </div>  
	      <?php if (module_exists('statistics') && user_access("view post access counter")): ?>
	      <div class="post-views"><i class="stand_icon icon-eye"></i> <span><?php $var = statistics_get($nid); print ($var['totalcount']) +1; ?></span></div>
	      <?php endif; ?>
	      <?php if (!isset($node->field_workshop_challenge['und'][0])) {print flag_create_link('loves', $node->nid);} ?>	   
	    </div> 
	    <?php endif; ?>
	    
	    <div class="clear"></div>
    </div>
    
    </article>
    
  </div> 
  
  <?php if (!$teaser): ?>
  	<?php if (module_exists('ywp_author') && !isset($node->field_workshop_challenge['und'][0])): ?>
			<?php print theme('about_the_author', array('author' => $user, 'picture' => $photo, 'path' => $base_url)); ?>
		<?php endif; ?>
	<?php print render($content['comments']); ?>
	<?php endif; ?>
 
</div>