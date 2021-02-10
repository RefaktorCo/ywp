<?php
class image_field_caption_handler_filter_domain_admin extends views_handler_filter_equality {
      
  function query() {
    $this->ensure_my_table();
    $field = "$this->table_alias.$this->real_field";   
    global $user;
    $domains = domain_get_user_domains($user); // Load the domains the current user is assigned to
   
    if (empty($this->value)) {                       
      $this->query->add_where(
        $this->options['group'],
        db_or()
          ->condition($field, $domains, 'IN')
          ->condition('entityform.uid', $user->uid, '=')
        );
    }   
  }
}