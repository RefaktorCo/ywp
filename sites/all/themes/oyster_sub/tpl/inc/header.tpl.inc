<header class="main_header">
  <div class="header_wrapper">

    <?php if ($page['header_branding']) {
      print render($page['header_branding']);
    } ?>

        <?php if ($logo || $site_name || $site_slogan): ?>
      <div class="logo_sect-wrapp">
        <div class="logo_sect">
          <?php if ($logo): ?> 
            <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home" class="logo"><img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" class="logo_def"></a>
          <?php endif; ?> 

            <?php if ($site_name || $site_slogan): ?>
            <div id="name-and-slogan" <?php if ($disable_site_name && $disable_site_slogan) {
                print ' class="hidden"';
              } ?>>

              <?php if ($site_name): ?>
                <?php if ($title): ?>
                  <div id="site-name" <?php if ($disable_site_name) {
            print ' class="hidden"';
          } ?>>
                    <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><span><?php print $site_name; ?></span></a>
                  </div>
                <?php else: /* Use h1 when the content title is empty */ ?>
                  <h1 id="site-name" <?php if ($disable_site_name) {
                    print ' class="hidden"';
                  } ?>>
                    <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><span><?php print $site_name; ?></span></a>
                  </h1>
      <?php endif; ?>
            <?php endif; ?>

    <?php if ($site_slogan): ?>
                <div id="site-slogan" <?php if (($disable_site_slogan)) {
        print 'class="hidden"';
      } if ((!$disable_site_slogan ) AND ( $disable_site_name)) {
        print 'class="slogan no-name"';
      } else {
        print 'class="slogan"';
      } ?>>
      <?php print $site_slogan; ?>
                </div>
                  <?php endif; ?>

            </div> <!-- /#name-and-slogan -->
              <?php endif; ?>  
        </div> 
      </div>  
          <?php endif; ?> 
    <div class="header-menus-wrapp container">
      <div class="row">
        <div class="header_top_nav">
          <div class="header-serach-wrapp">
<?php if (theme_get_setting('header_search') == '1'): ?>
              <div class="search_fadder"></div>
              <div class="header_search">
                <?php $block = module_invoke('search', 'block_view', 'search');
                print render($block); ?>
              </div>  
            <?php endif; ?> 
<?php if (theme_get_setting('header_search') == '1'): ?>       
              <a class="search_toggler" href="#"><i class="fa fa-search"></i></a>
<?php endif; ?>
          </div>
<?php print render($page['header_top_menu']); ?>
        </div>  
      </div> 
  </div>
    </div>
    <div class="clear"></div>

  </div>
</header>

<div class="main_header main_header--sticky desktop">
  <div class="header_rp">
          <nav>
<?php if (isset($page['header_menu'])): ?> 
              <div class="menu-main-menu-container">
  <?php print render($page['header_menu']); ?>    	
              </div>
<?php endif; ?>
          </nav>     
        </div>
</div>
