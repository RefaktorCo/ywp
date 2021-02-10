<?php
/**
 * @file
 * Main page template.
 *
 * Available variables:
 * @var string $directory
 * @var string $logo
 * @var string $front_page
 * @var array $tabs
 * @var array $page
 * @var array $action_links
 * @var string $messages
 * @var boolean $ywp_magazine_home
 * @var string $ywp_logo_thevoice
*/
?>

<div class="layout-wrapper d-flex flex-column">

  <nav class="navbar navbar-dark">
    <?php if ($logo): ?>
      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home" id="logo" class="navbar-brand logo-front">
        <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
      </a>
    <?php endif; ?>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle menu">
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
  <div class="menu collapse" id="menu">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <?php print render($page['menu']); ?>
  </div>

  <a id="main-content"></a>
  <main class="content-wrapper h-100">
<!--    --><?php //if ($messages): ?>
<!--      <div id="messages">-->
<!--        --><?php //print $messages; ?>
<!--      </div>-->
<!--    --><?php //endif; ?>
<!--    --><?php //if ($tabs): ?>
<!--      <div class="tabs">-->
<!--        --><?php //print render($tabs); ?>
<!--      </div>-->
<!--    --><?php //endif; ?>
<!--    --><?php //print render($page['help']); ?>
<!--    --><?php //if ($action_links): ?>
<!--      <ul class="action-links">-->
<!--        --><?php //print render($action_links); ?>
<!--      </ul>-->
<!--    --><?php //endif; ?>
    <?php print render($page['content']); ?>
  </main>

</div>
<div id="ywp-is-sm" class="d-none d-sm-block d-md-none"></div>
<div id="ywp-is-sm-up" class="d-none d-sm-block"></div>
<div id="ywp-is-md" class="d-none d-md-block d-lg-none"></div>
<div id="ywp-is-md-up" class="d-none d-md-block"></div>
<div id="ywp-is-lg" class="d-none d-lg-block d-xl-none"></div>
<div id="ywp-is-lg-up" class="d-none d-lg-block"></div>