jQuery(document).ready(function ($) {
  $('.accordion-toggle').click(function(){
    //Expand or collapse this panel
    $(this).next().slideToggle('fast');
    $(this).toggleClass('open');
  });
  
  $('.view-xp-tabs .shortcode_tab_item_title:first').removeClass('expand_no');
  $('.view-xp-tabs .shortcode_tab_item_title:first').addClass('expand_yes');
  
  $('.ywp_write .sprout').after('<div class="tooltip">Click to create a post that relates to this one.</div>')
  
  // Quick solution for "youth" registration field validation
  $('#user-register-form').submit(function() {
	  var selectedOption = $('#edit-field-user-type-und').children("option:selected").val();
    if (selectedOption == 'youth') {
	    if ( !$('#edit-field-parent-first-name-und-0-value').val() || !$('#edit-field-parent-last-name-und-0-value').val() || !$('#edit-field-school-name-und-0-value').val() || !$('#edit-field-grade-in-school-und-0-value').val() ) {
        alert('Please fill out the required youth fields');
        return false;
      }
    }
	});
	
});