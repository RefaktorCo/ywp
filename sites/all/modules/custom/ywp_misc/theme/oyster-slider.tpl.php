<?php if (count($items) == 1): ?>
  <img src="<?php print $items[0]['slide_image']; ?>">
<?php else: ?>
<div class="slider-wrapper theme-default ">
  <div class="nivoSlider"> 
    <?php print theme('oyster_slides', array('items' => $items)); ?>
  </div>  
</div>
<?php endif; ?>