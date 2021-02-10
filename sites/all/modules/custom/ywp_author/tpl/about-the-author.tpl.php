<?php global $user; //load the current logged in user info ?>

<div class="blogpost_user_meta">
	
	<div class="author-info">
		<div class="author-ava"><?php print $picture; ?></div>
		<div class="author-name"><h6><?php print t('About the Author:'); ?> <?php print $author->name; ?></h6></div>
		<div class="author-description"><?php print $author->signature; ?></div>
		<a href="<?php print $path; ?>/messages/new/<?php print $author->uid; ?>">MSG</a> / <a href="<?php print $path; ?>/user/<?php print $author->uid; ?>/contact">CONTACT</a>
		
		<?php if (in_array('administrator', array_values($user->roles))): ?>
		  <div class="author-info-admin">
			  <?php if (isset($author->field_firstname) || isset($author->field_last_name)): ?>
				  <strong>Name:</strong> <?php print $author->field_firstname['und'][0]['value'] . $author->field_last_name['und'][0]['value']; ?>
				  <div class="clear"></div>
			  <?php endif; ?>
			  <?php if (isset($author->field_town_or_city) || isset($author->field_state)): ?>
			    <strong>From:</strong> <?php print $author->field_town_or_city['und'][0]['value'] . $author->field_state['und'][0]['value']; ?>
			    <div class="clear"></div>
			  <?php endif; ?>
			  <?php if (isset($author->field_grade_in_school)): ?>
			    <strong>Grade:</strong> <?php print $author->field_grade_in_school['und'][0]['value']; ?>
			    <div class="clear"></div>
			  <?php endif; ?>
		  </div>  
		<?php endif; ?>
		
	</div>
	
	<div class="author-loves">
		<h6><?php print t('RECENT LOVES'); ?></h6>
		<?php print ywp_author_get_loves($author->uid); ?>
	</div>	
	
	<div class="author-comments">
		<h6><?php print t('RECENT COMMENTS'); ?></h6>
		
		<?php print ywp_author_get_comments($author->uid); ?>
	</div>	
	<div class="clear"></div>
</div> 

<hr class="single_hr">