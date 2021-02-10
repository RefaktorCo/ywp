
<?php object_log('node', $node); ?>
<?php include path_to_theme() . '/tpl/inc/header.tpl.inc'; ?>
<?php print render($page['fullscreen']); ?>

<div class="main_wrapper <?php if (render($page['fullscreen'])){ print "hidden"; } ?>">
  <?php if ($page['left_sidebar'] || $page['right_sidebar']): ?><div class="bg_sidebar <?php if ($page['left_sidebar']) { print "is_left-sidebar"; }?> <?php if ($page['right_sidebar']) { print "is_right-sidebar";} ?>"></div><?php endif; ?>  
  <div class="content_wrapper">
    <div class="container main-container">
      <div class="content_block row <?php if (!$page['left_sidebar'] && $page['right_sidebar']) { print "right-sidebar"; } if ($page['left_sidebar'] && !$page['right_sidebar']) { print "left-sidebar"; } if (!$page['left_sidebar'] && !$page['right_sidebar']) { print "no-sidebar"; } ?>">
        <div class="fl-container <?php if ($page['right_sidebar']) { print "hasRS"; } ?>">
          <div class="row">
            
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
			      <div id="content" class="posts-block <?php if ($page['left_sidebar']) { print "hasLS"; } ?>">
              sdsfdsfd
			      </div>
              
          
		        <?php if ($page['left_sidebar']): ?>
		        <div class="left-sidebar-block">
		          <?php print render($page['left_sidebar']); ?> 
		        </div>
		        <?php endif; ?>
		        
		      </div>
        </div><!-- .fl-container -->     
        
        <?php if ($page['right_sidebar']): ?>
        <div class="right-sidebar-block">
          <?php print render($page['right_sidebar']); ?> 
        </div>
        <?php endif; ?>
        
      </div>
    </div>
  </div>
</div>  
<?php print render($page['after_content']); ?>  

