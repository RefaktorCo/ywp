<div class="components-body-wrapper">
<?php $count = 1; foreach($rows as $row): ?>
<div id="xp-component-<?php print $count; ?>">
  <div class="component-header">
	  <div class="component-icon">
		  <i class="fa <?php print $row['field_component_icon']; ?>"></i>
	  </div>
	  <div class="component-title">
		  <?php print $row['field_component_title']; ?>
	  </div>
  </div>
  <div class="component-body">
		<?php print $row['field_component_body']['safe_value']; ?>
  </div>
</div>
<?php $count++; endforeach; ?> 
</div>