<div class="getting-started">
	<?php foreach($rows as $row): ?>
		<div class="link-box">
			<a href="<?php print $row['field_getting_started_link']; ?>"><?php print $row['field_getting_started_text']; ?></a>		
		</div>
	<?php endforeach; ?> 
</div>