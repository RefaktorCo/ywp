(function ($) {

Drupal.behaviors.fbsmpLink = {
  attach: function (context) {
  //Clears the URL field on first focus, i.e. the stub is gone.
  $('.fbsmp-link-url-field:not(.fbsmp-link-url-field-processed)').addClass('fbsmp-link-url-field-processed').each(function() {
    $(this).one('focus', function() {
      $(this).val('');
      $(this).removeClass('fbsmp-link-url-field-processed');
    })
  });

  // Attach the link instead of submitting the form when pressing Enter in the Link textfield
  $(context).find('.fbsmp-link-url-field').keydown(function(e) {
    var $element = $(this).parents('form').find('.statuses-submit');
    var id = $element[0].id;

    if (e.which == 13 && Drupal.settings.ajax && Drupal.settings.ajax[id]) {
      e.preventDefault();
      $(context).find('#edit-fbsmp-link-attach').trigger(Drupal.settings.ajax[id].event);
    }
  });

  //Inline editing of the title and description field.
  $('.fbsmp-link-title-field:not(.fbsmp-link-title-field-processed)').addClass('fbsmp-link-title-field-processed').each(function() {    
    $(this).after("<span class=\"fbsmp-link-title-text-editable\">" + encode($(this).val()) + "</span>");
    $(this).hide();
  });
  
  $('.fbsmp-link-description-field:not(.fbsmp-link-description-field-processed)').addClass('fbsmp-link-description-field-processed').each(function() {
    $(this).after("<span class=\"fbsmp-link-description-text-editable\">" + encode($(this).val()) + "</span>");
    $(this).hide();
  });
  
  $('.fbsmp-link-title-text-editable, .fbsmp-link-description-text-editable').click(function() {
    $(this).prev().show();
    $(this).prev().focus();
    $(this).hide();
  });
  
  $('.fbsmp-link-title-field-processed, .fbsmp-link-description-field-processed').bind('blur', function() {
    $(this).next().html(encode($(this).val()));
    $(this).next().show();
    $(this).hide();
  });
  
  //Changes the selected image and updates the count.
  $link_previous_button = $(context).find('.fbsmp-link-previous-button');
  $link_next_button = $(context).find('.fbsmp-link-next-button');
  
  var current_class = ".fbsmp-link-current-thumbnail";
  var max_class = ".fbsmp-link-thumbnail-count";
  var select_thumbnail_class = ".fbsmp-link-thumbnail-select";

  $link_previous_button.unbind("click").click(function() {
      var current = $(this).parent().parent().find(current_class).val();
      var max = $(this).parent().parent().find(max_class).val();
      current--;
      if (current>0){
          $(this).parent().parent().find(current_class).val(current);
          fbsmp_link_print_count(current, max, $(this).next().next());
          var change = ".fbsmp-link-thumbnail-" + current;
          var new_thumb = $(this).parent().parent().find(change).val();
          $(this).parent().parent().find(select_thumbnail_class).attr('src', new_thumb);
      }   
    } 
  );

  $link_next_button.unbind("click").click(function() {
      var current = $(this).parent().parent().find(current_class).val();
      var max = $(this).parent().parent().find(max_class).val();
      current++;
      if (current<=max){
          $(this).parent().parent().find(current_class).val(current);
          fbsmp_link_print_count(current, max, $(this).next());
          var change = ".fbsmp-link-thumbnail-" + current;
          var new_thumb = $(this).parent().parent().find(change).val();
          $(this).parent().parent().find(select_thumbnail_class).attr('src', new_thumb);
      }  
    } 
  );
}
}

function fbsmp_link_print_count(current, max, where) {
  var link_translations = new Array();
  link_translations['%current'] = current;
  link_translations['%max'] = max;
  where.html(Drupal.t('%current of %max', link_translations));
}

function encode(input){
  var output = $('<div/>').text(input).html();
  if(!output){
    output = "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  return output;
}

})(jQuery);