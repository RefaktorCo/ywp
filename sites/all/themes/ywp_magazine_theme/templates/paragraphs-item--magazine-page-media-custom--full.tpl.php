<?php
/**
 * @file
 * Default theme implementation for a single Custom Media paragraph item in a
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
 */
?>
<article class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php print render($content['field_media_image']); ?>
  <?php print render($content['field_media_author']); ?>
</article>
