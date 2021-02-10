<?php
/**
 * @file
 * Main template for magazine table of contents in Full view mode.
 *
 * @var object $node
 * @var string $view_mode
 * @var \ParagraphsItemEntity[] $pages
 * @var array $content
 * @var string $ywp_cover_photo
 *
 * @see ywp_magazine_theme_preprocess_ywp_magazine_toc()
 */
?>
<article class="magazine-toc view-mode-full">
  <div class="row no-gutters h-100">
    <div class="col-md-6 d-none d-md-block h-100 toc-media" style="background-image:url(<?=$ywp_cover_photo?>)"></div>
    <div class="col-md-6 h-100">
      <div class="toc-content">
        <h1>Table of Contents</h1>
        <p class="lead text-muted">
          The Voice,
          <?php
          $date = ywp_magazine_get_date($node);
          print date('F Y', $date);
          ?>
        </p>
        <?php print render($content['pages']); ?>
      </div>
    </div>
  </div>
</article>
