<?php
/**
 * @file
 * Default theme implementation for a single Magazine Page paragraph item in a
 * Full view mode.
 *
 * Available variables:
 * - $content: An array of content items. Use render($content) to print them
 *   all, or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. By default the following classes are available, where
 *   the parts enclosed by {} are replaced by the appropriate values:
 *   - entity
 *   - entity-paragraphs-item
 *   - paragraphs-item-{bundle}
 *
 * Other variables:
 * - $classes_array: Array of html class attribute values. It is flattened into
 *   a string within the variable $classes.
 *
 * @see template_preprocess()
 * @see template_preprocess_entity()
 * @see template_process()
 *
 * @var string $classes
 * @var string $attributes
 * @var string $content_attributes
 * @var array $content
 * @var object $ywp_host
 * @var string $ywp_author_name
 * @var string $ywp_author_blog_url
 * @var \ParagraphsItemEntity $paragraphs_item
 * @var int $ywp_prev_page_id
 * @var int $ywp_next_page_id
 * @var string $ywp_page_layout
 */
?>
<?php
$id = $paragraphs_item->identifier();

$media_class = 'paragraph-column column-media d-flex align-items-center';
$content_class = 'paragraph-column column-content col-md-6';
$comments_class = 'paragraph-comments d-md-none';

if ($ywp_page_layout == 'media_only') {
  $media_class .= ' col-md-12';
}
else {
  $media_class .= ' col-md-6';
}
if ($ywp_page_layout == 'media_right') {
  $media_class .= ' order-md-2';
  $content_class .= ' order-md-1';
}
?>
<article class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <div class="paragraph-nav">
    <div class="caption d-none d-sm-block text-muted">
      The Voice,
      <?php
      $date = ywp_magazine_get_date($ywp_host);
      print date('F Y', $date);
      ?>
    </div>
    <?php if ($ywp_prev_page_id): ?>
      <a href="/<?php print YWP_MAGAZINE_AJAX_PATH; ?>/page/<?php print $ywp_prev_page_id; ?>" title="<?php print t('Previous page'); ?>" class="mfp-update-ajax">
        <i class="fas fa-chevron-left"></i>
      </a>
    <?php else: ?>
      <span>
        <i class="fas fa-chevron-left"></i>
      </span>
    <?php endif; ?>
    <a href="/<?php print YWP_MAGAZINE_AJAX_PATH; ?>/toc/<?php print $ywp_host->nid; ?>" title="<?php print t('Table of Contents'); ?>" class="mfp-update-ajax">
      <i class="fas fa-list"></i>
    </a>
    <?php if ($ywp_next_page_id): ?>
      <a href="/<?php print YWP_MAGAZINE_AJAX_PATH; ?>/page/<?php print $ywp_next_page_id; ?>" title="<?php print t('Next page'); ?>" class="mfp-update-ajax">
        <i class="fas fa-chevron-right"></i>
      </a>
    <?php else: ?>
      <span>
        <i class="fas fa-chevron-right"></i>
      </span>
    <?php endif; ?>
  </div>
  <div class="row no-gutters paragraph-row">
    <div class="<?php print $media_class; ?>">
      <?php print render($content['field_magazine_page_media']); ?>
    </div>
    <?php if ($ywp_page_layout != 'media_only'): ?>
    <div class="<?php print $content_class; ?>">
      <div class="content">
        <div class="blog-genre">
          <?php /*print render($content['ywp_genre']);*/ ?>
          <?php print render($content['field_magazine_page_caption']); ?>
        </div>
        <h1 class="blog-title">
          <?php print render($content['ywp_title']); ?>
        </h1>
        <div class="blog-author">
          <?php print render($content['ywp_author']); ?>
        </div>
        <?php print render($content['field_magazine_page_inline_media']); ?>
        <?php print render($content['field_quote']); ?>
        <?php print render($content['ywp_text']); ?>
        <div class="blog-extra">
          
        </div>
      </div>
    </div>
    <?php else: ?>
     
    <?php endif; ?>
    
  </div>
</article>
