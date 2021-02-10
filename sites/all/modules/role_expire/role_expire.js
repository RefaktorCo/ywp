
/**
 * @file
 * Role Expire js
 *
 * Set of jQuery related routines.
 */

// See http://drupal.org/node/756722 for conversion to D7 and Drupal.behaviors.

(function ($) {

  Drupal.behaviors.role_expire = {
    attach: function (context, settings) {
      $('input.role-expire-role-expiry', context).parent().hide();

      // Change rolesKey if Role Delegation or Role Assign modules are used.
      if ($('#edit-roles-change').length > 0) {
        var rolesKey = 'roles-change';
      }
      else if ($('#edit-roleassign-roles').length > 0) {
        rolesKey = 'roleassign-roles';
      }
      else {
        rolesKey = 'roles';
      }

      var checkBoxes = $('#edit-' + rolesKey + ' input.form-checkbox', context);

      checkBoxes.each(function() {
        var textfieldId = this.id.replace(rolesKey, "role-expire");

        // Move all expiry date fields under corresponding checkboxes
        $(this).closest('div.form-item').after($('#' + textfieldId).parent());

        // Show all expiry date fields that have checkboxes checked
        if ($(this).is(":checked")) {
          $('#' + textfieldId).parent().show();
        }
      });

      checkBoxes.click(function() {
        var textfieldId = this.id.replace(rolesKey, "role-expire");

        // Toggle expiry date fields
        if ($(this).is(":checked")) {
          $('#' + textfieldId).parent().show(200);
        }
        else {
          $('#' + textfieldId).parent().hide(200);
        }
      });
    }
  }

})(jQuery);
