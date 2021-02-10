<?php foreach($rows as $row): ?>
	<div class="row testimonial-wrapper">	
		<div class="span4"><img src="<?php print file_create_url($row['field_mentor_image']['uri']); ?>"></div>
		<div class="span8 testimonial-box">
		<?php print $row['field_mentor_testimonial']['safe_value']; ?>
		</div>
	</div>
<?php endforeach; ?> 