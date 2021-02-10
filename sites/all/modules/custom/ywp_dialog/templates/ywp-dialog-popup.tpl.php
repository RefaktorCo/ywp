<?php
/**
 * @file
 * Default theme template for a popup.
 *
 * Available variables:
 * @var string $html_id
 *   Unique popup id.
 * @var string|array $content
 *   Popup content.
 * @var string $class
 *   Popup wrapper class (optional).
 */
?>
<div id="<?php print $html_id; ?>" class="mfp-hide <?php print $class; ?>">
  <?php print render($content); ?>
</div>
