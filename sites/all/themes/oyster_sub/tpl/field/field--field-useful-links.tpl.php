<div class="useful-links">
<?php foreach($rows as $row): ?>
  <div class="small-link-box">
	  <a href="<?php print $row['field_useful_link_url']; ?>"><?php print $row['field_useful_link_title']; ?></a>		
  </div>
<?php endforeach; ?> 
</div>