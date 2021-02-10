<div class="story-photo-top">
<?php foreach($rows as $row): ?>
  <?php if (!file_exists(image_style_path('story_photo', $row['field_story_photo']['uri']))) { 
	  image_style_create_derivative(image_style_load('story_photo'), $row['field_story_photo']['uri'], image_style_path('story_photo', $row['field_story_photo']['uri']));} 
  ?>
  <div class="story-photo-top-wrapper">
	  <img src="<?php print file_create_url(image_style_path('story_photo', $row['field_story_photo']['uri'])); ?>">
	  
	  <div class="testimonial-box">
		  <?php print $row['field_story_body']['safe_value']; ?>
	  </div>
	  
  </div>
<?php endforeach; ?> 
</div>