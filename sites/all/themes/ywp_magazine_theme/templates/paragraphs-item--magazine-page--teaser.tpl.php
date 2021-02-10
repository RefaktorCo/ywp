<?php
/**
 * @file
 * Default theme implementation for a single Magazine Page paragraph item in a
 * Teaser view mode.
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
 * @var object $ywp_blog
 * @var string $ywp_author_label
 * @var \ParagraphsItemEntity $paragraphs_item
 * @var array|string $ywp_media_content
 * @var string $ywp_media_type
 */
?>
<article class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <div class="outline"></div>
  <div class="content">
    <?php print render($content['ywp_media']); ?>
  </div>
  <a href="/<?php print YWP_MAGAZINE_AJAX_PATH; ?>/page/<?php print $paragraphs_item->identifier(); ?>"
     class="overlay mfp-ajax" data-mfp-options="<?=ywp_magazine_popup_options()?>"
  >
    <div class="overlay-content">
      <h4 class="title">
        <?php print $ywp_blog->title; ?>
      </h4>
      <div class="author">
        By <?php print $ywp_author_label; ?>
      </div>
    </div>
  </a>
</article>
