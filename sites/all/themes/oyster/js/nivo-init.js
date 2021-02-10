(function($) {
  Drupal.behaviors.nivoSlider = {
    attach: function(context, settings) {
	    
		  /* NivoSlider */
		jQuery('.nivoSlider').each(function(){
			jQuery(this).nivoSlider({
				directionNav: false,
				controlNav: true,
				effect:'fade',
				pauseTime:4000,
				slices: 1
			});
		});
    }
  }
})(jQuery);