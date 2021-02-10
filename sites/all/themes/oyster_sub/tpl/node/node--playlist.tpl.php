<?php 
	global $base_url, $user;	
	$author = user_load($node->uid);
	
	if (isset($content['group_group'][0])) {
		$content['group_group'][0]['#options']['attributes']['class'][] = 'shortcode_button btn_small btn_type5';
	}
?>

<h4><?php print t('Workshop Description:'); ?></h4>
<?php 
	hide($content['comments']);
	hide($content['field_schedule']);
	hide($content['field_category']);
	hide($content['field_skill']);
	hide($content['field_meta_tag']);
	hide($content['field_playlist_summary']);
	print render($content); 
?>

<?php if (oyster_sub_user_has_role(array('3', '8', '10', '7'))): ?>
  <a href="<?php print $base_url; ?>/node/add/challenge?field_playlist_reference=<?php print $node->nid; ?>" class="respond shortcode_button btn_small btn_type5"><?php print t('Create Challenge'); ?></a>
<?php endif; ?>

<h4><?php print t('More Info:'); ?></h4>

<h5 class="accordion-toggle">Instructor and Mentor info<span class="ico"></span></h5>
<div class="accordion-content">
	<h6><a href="<?php print $base_url; ?>/user/<?php print $author->uid; ?>"><?php print $author->field_firstname['und'][0]['value']; ?> <?php print $author->field_last_name['und'][0]['value']; ?></a></h6>
	<a href="mailto:<?php print $author->mail ?>" class="shortcode_button btn_small btn_type5">email</a>
	<a href="<?php print $base_url; ?>/messages/new/<?php print $author->uid; ?>" class="shortcode_button btn_small btn_type5">message</a>
	
	<?php if (isset($author->field_author_info['und'])): ?>
	<p class="playlist-author-info"><strong>Info:</strong> <?php print $author->field_author_info['und'][0]['value']; ?></p>
	<?php endif; ?>
	
	<?php print $user_picture; ?>
	
	<blockquote class="playlist-sig"><?php print $author->signature; ?></blockquote>
</div>	


<?php if (render($content['field_schedule'])): ?>	
<h5 class="accordion-toggle">Schedule, Live Conferences<span class="ico"></span></h5>
<div class="accordion-content">
	<?php print render($content['field_schedule']); ?>
</div>
<?php endif; ?>