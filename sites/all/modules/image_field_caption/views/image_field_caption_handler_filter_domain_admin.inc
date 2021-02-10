<?php
class image_field_caption_handler_field_domain_admin extends views_handler_field {

  function get_value($values, $field = NULL) {
    $alias = isset($field) ? $this->aliases[$field] : $this->field_alias;
   
    if (isset($values->{$alias}) && is_numeric($values->{$alias}) && $values->{$alias}>0){
      // $values->{$alias} contains the field value which is our domain ID
      // We then load the domain object from the ID value and return the domain's display name
      $domain = domain_load($values->{$alias});
      return $domain['sitename']; 
    }else{
      return 'not available';
    }
  }
}