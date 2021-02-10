<?php
	
	if (!empty(field_view_field('node', $node, 'field_playlist_summary', array('label'=>'hidden')))) {
	  $summary = field_view_field('node', $node, 'field_playlist_summary', array('label'=>'hidden'));
	}
	if (!empty(field_view_field('node', $node, 'field_category', array('label'=>'hidden')))) {
	  $category = field_view_field('node', $node, 'field_category', array('label'=>'hidden'));
	}
	if (!empty(field_view_field('node', $node, 'field_skill', array('label'=>'hidden')))) {
	  $skill = field_view_field('node', $node, 'field_skill', array('label'=>'hidden'));
	}
	if (!empty(field_view_field('node', $node, 'field_meta_tag', array('label'=>'hidden')))) {
	  $tag = field_view_field('node', $node, 'field_meta_tag', array('label'=>'hidden'));
	}
	
?>	

<?php include path_to_theme() . '/tpl/inc/header.tpl.inc'; ?>
<?php print render($page['fullscreen']); ?>

<div class="main_wrapper">
  <div class="bg_sidebar is_left-sidebar"></div>
  <div class="content_wrapper">
    <div class="container main-container">
      <div class="content_block row left-sidebar">
        <div class="fl-container <?php if ($page['right_sidebar']) { print "hasRS"; } ?>">
          <div class="row">
            
            
			      <div id="content" class="posts-block hasLS">
				      
				      <?php if ($messages): ?>
					    <div id="messages"><div class="section clearfix">
					      <?php print $messages; ?>
					    </div></div> <!-- /.section, /#messages -->
					  <?php endif; ?>
            
            <?php if ($tabs): ?>
			        <div class="tabs">
			          <?php print render($tabs); ?>
			        </div>
			      <?php endif; ?>
			      <?php print render($page['help']); ?>
			      <?php if ($action_links): ?>
			        <ul class="action-links">
			          <?php print render($action_links); ?>
			        </ul>
			      <?php endif; ?>
				      
							<h1 class="playlist-title"><?php print drupal_get_title(); ?></h1>
							
							<div class="listing_meta">
								<?php if (isset($category)): ?>
									<span><?php print t('in '); ?><?php print render($category); ?></span>
							  <?php endif; ?>		
							  <?php if (isset($skill)): ?>
									<span><?php print t('skill: '); ?><?php print render($skill); ?></span>
								<?php endif; ?>
								<?php if (isset($tag)): ?>
									<span><?php print t('tags: '); ?><?php print render($tag); ?></span>
								<?php endif; ?>
							</div>
							
							<?php if (isset($summary)): ?> 
							<div class="playlist-summary">
							  <?php print render($summary); ?>
							</div>  
							<?php endif; ?>
							
              <?php print render($page['xp_content']); ?>
			      </div>

		        
		        <div class="left-sidebar-block">

		          <?php 
			          print render($page['content']);
			          print render($page['left_sidebar']); 
			          print render($page['playlist_sidebar']); 
			        ?>
		        </div>
		        
		        
		      </div>
        </div><!-- .fl-container -->     
        
        <?php if ($page['right_sidebar']): ?>
        <div class="right-sidebar-block">
          <?php 
	          print render($page['right_sidebar']); 
	        ?> 
        </div>
        <?php endif; ?>
        
      </div>
    </div>
  </div>
</div>  
<?php print render($page['after_content']); ?>  

<?php include path_to_theme() . '/tpl/inc/footer.tpl.inc'; ?>