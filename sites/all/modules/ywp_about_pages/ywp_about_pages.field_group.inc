<?php
/**
 * @file
 * ywp_about_pages.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function ywp_about_pages_field_group_info() {
  $field_groups = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_additional_services|node|about_teachers|form';
  $field_group->group_name = 'group_additional_services';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_teachers';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Additional Services',
    'weight' => '5',
    'children' => array(
      0 => 'field_additional_services_title',
      1 => 'field_additional_services_intro',
      2 => 'field_additional_services',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-additional-services field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_additional_services|node|about_teachers|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_getting_started|node|general_about|form';
  $field_group->group_name = 'group_getting_started';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'general_about';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Getting Started',
    'weight' => '4',
    'children' => array(
      0 => 'field_getting_started',
      1 => 'field_getting_started_intro',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-getting-started field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_getting_started|node|general_about|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_mentor_testimonials|node|about_mentors|form';
  $field_group->group_name = 'group_mentor_testimonials';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_mentors';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Mentor Testimonials',
    'weight' => '8',
    'children' => array(
      0 => 'field_mentor_testimonials_headli',
      1 => 'field_mentor_testimonials',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-mentor-testimonials field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_mentor_testimonials|node|about_mentors|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_our_programs|node|about_mentors|form';
  $field_group->group_name = 'group_our_programs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_mentors';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Our Programs',
    'weight' => '5',
    'children' => array(
      0 => 'field_our_programs',
      1 => 'field_our_programs_intro',
      2 => 'field_our_programs_title',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-our-programs field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_our_programs|node|about_mentors|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_our_programs|node|about_teachers|form';
  $field_group->group_name = 'group_our_programs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_teachers';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Our Programs',
    'weight' => '4',
    'children' => array(
      0 => 'field_our_programs',
      1 => 'field_our_programs_intro',
      2 => 'field_our_programs_title',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-our-programs field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_our_programs|node|about_teachers|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_our_programs|node|about_youth|form';
  $field_group->group_name = 'group_our_programs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_youth';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Our Programs',
    'weight' => '4',
    'children' => array(
      0 => 'field_our_programs_title',
      1 => 'field_our_programs_intro',
      2 => 'field_our_programs',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-our-programs field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_our_programs|node|about_youth|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_our_programs|node|general_about|form';
  $field_group->group_name = 'group_our_programs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'general_about';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Our Programs',
    'weight' => '6',
    'children' => array(
      0 => 'field_our_programs_intro',
      1 => 'field_our_programs',
      2 => 'field_our_programs_title',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-our-programs field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_our_programs|node|general_about|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_testimonials|node|about_teachers|form';
  $field_group->group_name = 'group_testimonials';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_teachers';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Testimonials',
    'weight' => '7',
    'children' => array(
      0 => 'field_mentor_testimonials_headli',
      1 => 'field_mentor_testimonials',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-testimonials field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_testimonials|node|about_teachers|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_testimonials|node|about_youth|form';
  $field_group->group_name = 'group_testimonials';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_youth';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Testimonials',
    'weight' => '6',
    'children' => array(
      0 => 'field_mentor_testimonials_headli',
      1 => 'field_mentor_testimonials',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-testimonials field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_testimonials|node|about_youth|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_useful_links|node|about_mentors|form';
  $field_group->group_name = 'group_useful_links';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_mentors';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Useful Links',
    'weight' => '7',
    'children' => array(
      0 => 'field_useful_links',
      1 => 'field_useful_links_headline',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-useful-links field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_useful_links|node|about_mentors|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_useful_links|node|about_teachers|form';
  $field_group->group_name = 'group_useful_links';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_teachers';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Useful Links',
    'weight' => '6',
    'children' => array(
      0 => 'field_useful_links_headline',
      1 => 'field_useful_links',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-useful-links field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_useful_links|node|about_teachers|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_useful_links|node|about_youth|form';
  $field_group->group_name = 'group_useful_links';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_youth';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Useful Links',
    'weight' => '5',
    'children' => array(
      0 => 'field_useful_links_headline',
      1 => 'field_useful_links',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-useful-links field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_useful_links|node|about_youth|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_useful_links|node|general_about|form';
  $field_group->group_name = 'group_useful_links';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'general_about';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Useful Links',
    'weight' => '9',
    'children' => array(
      0 => 'field_useful_links_headline',
      1 => 'field_useful_links',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-useful-links field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_useful_links|node|general_about|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_where_to_begin|node|about_youth|form';
  $field_group->group_name = 'group_where_to_begin';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'about_youth';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Where To Begin',
    'weight' => '3',
    'children' => array(
      0 => 'field_where_to_begin_title',
      1 => 'field_infographic',
      2 => 'field_media_embed',
      3 => 'field_where_to_begin_body',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-where-to-begin field-group-fieldset',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $field_groups['group_where_to_begin|node|about_youth|form'] = $field_group;

  // Translatables
  // Included for use with string extractors like potx.
  t('Additional Services');
  t('Getting Started');
  t('Mentor Testimonials');
  t('Our Programs');
  t('Testimonials');
  t('Useful Links');
  t('Where To Begin');

  return $field_groups;
}
