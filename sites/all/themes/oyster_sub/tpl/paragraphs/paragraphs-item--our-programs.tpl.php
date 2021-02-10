<div class="promoblock_wrapper">
	<div class="promo_text_block">
		<div class="promo_text_block_wrapper">
			<?php if (render($content['field_programs_title'])): ?>
			<h3><?php print render($content['field_programs_title']); ?></h3>
			<?php endif; ?>
			<?php if (render($content['field_programs_body'])): ?>
			<div class="our-programs-info">
				<?php print render ($content['field_programs_body']) ; ?>
			</div>
			<?php endif; ?>
			<?php print render ($content['field_our_programs']) ; ?>
		</div>
	</div>
</div>