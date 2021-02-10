<div class="promoblock_wrapper">
	<div class="promo_text_block">
		<div class="promo_text_block_wrapper">
			
		<?php foreach($rows as $row): ?>
			<h3><?php print $row['field_title']; ?></h3>
			<?php print $row['field_body']['safe_value']; ?>
		<?php endforeach; ?> 

		</div>
	</div>
</div>