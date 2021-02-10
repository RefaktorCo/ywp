<div class="promoblock_wrapper">
	<div class="promo_text_block">
		<div class="promo_text_block_wrapper">
		<?php foreach($rows as $row): ?>
			<h3><?php print $row['field_the_impact_title']; ?></h3>
			<?php $count = 0; foreach($row['field_the_impact_images'] as $image): ?>
			<?php if ($count == 0 || $count % 4 == 0) { print '<div class="row impact-img-wrapper">'; } ?>
			<?php if (!file_exists(image_style_path('impact', $image['uri']))) { 
	  	  image_style_create_derivative(image_style_load('impact'), $image['uri'], image_style_path('impact', $image['uri']));} 
	    ?>
			  <div class="span3">
				  <a href="<?php print file_create_url($image['uri']); ?>" class="prettyPhoto" data-rel="prettyPhoto[impact]"><img src="<?php print file_create_url(image_style_path('impact', $image['uri'])); ?>" /></a>
			  </div>  
			  <?php $count++; if ($count == 0 || $count % 4 == 0 || $count == count($row['field_the_impact_images'])) { print '</div>'; } ?>
			<?php endforeach; ?> 
				
			<div class="impact-description">
			  <?php print $row['field_the_impact_description']['safe_value']; ?>
			</div>
		<?php endforeach; ?> 
		</div>
	</div>
</div>