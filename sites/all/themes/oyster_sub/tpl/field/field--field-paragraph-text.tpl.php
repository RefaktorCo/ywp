<div class="promoblock_wrapper headline-1">
	<div class="promo_text_block">
		<div class="promo_text_block_wrapper">
		<?php foreach ($items as $delta => $item): ?>
		  <p><?php print render($item); ?></p>
		<?php endforeach; ?>
		</div>
	</div>
</div>