<div class="shortcode_toggles_shortcode toggles">
	<?php foreach($rows as $row): ?>
		<h5 data-count="1" class="shortcode_toggles_item_title expanded_no"><?php print $row['field_program_name']; ?><span class="ico"></span></h5>
    <div class="shortcode_toggles_item_body">
    	<div class="ip">
        <?php print $row['field_program_description']['safe_value']; ?>
      </div>
    </div>
	<?php endforeach; ?> 
</div>