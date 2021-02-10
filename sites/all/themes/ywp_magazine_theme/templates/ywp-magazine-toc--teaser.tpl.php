<?php
/**
 * @file
 * Main template for magazine table of contents in Teaser view mode.
 *
 * @var object $node
 * @var string $view_mode
 */
?>
<?php
$nid = $node->nid;
?>
<article class="paragraphs-item-magazine-page view-mode-teaser ywp-media-type-toc ywp-media-type-no-image">
  <div class="outline"></div>
  <div class="content">
    <div class="icon">
      <i class="fas fa-list"></i>
    </div>
  </div>
  <a href="/<?=YWP_MAGAZINE_AJAX_PATH?>/toc/<?=$nid?>" class="overlay mfp-ajax" data-mfp-options="<?=ywp_magazine_popup_options()?>">
    <div class="overlay-content">
      <h4 class="title">
        Table of Contents
      </h4>
    </div>
  </a>
</article>
