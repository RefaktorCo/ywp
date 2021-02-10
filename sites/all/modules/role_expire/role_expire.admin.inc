<?php

/**
 * @file
 * Administration page.
 */

/**
 * Configuration form.
 */
function role_expire_admin_settings($form, &$form_state) {

  $roles = user_roles();

  $values_raw = variable_get('role_expire_default_roles', '');
  $values = empty($values_raw) ? array() : json_decode($values_raw, TRUE);

  $default = array(
    0 => t('- None -')
  );
  // It is important to respect the keys on this array merge.
  $roles_select = $default + $roles;

  $form['general'] = array(
    '#type' => 'fieldset',
    '#title' => t('General settings'),
    '#weight' => 1,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  foreach ($roles as $rid => $role_name) {
    if ($rid > 2) {
      $form['general'][$rid] = array(
        '#type' => 'select',
        '#options' => $roles_select,
        '#title' => t('Role to assign after the role "!r" expires', array('!r' => $role_name)),
        '#default_value' => isset($values[$rid]) ? $values[$rid] : 0,
      );
    }
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#weight' => 2,
    '#value' => t('Save')
  );

  return $form;
}

/**
 * Submit function.
 */
function role_expire_admin_settings_submit($form, &$form_state) {
  $values = isset($form_state['values']) ? $form_state['values'] : array();

  $data = array();
  $roles = user_roles();
  foreach ($roles as $rid => $role_name) {
    if ($rid > 2) {
      $data[$rid] = $values[$rid];
    }
  }

  variable_set('role_expire_default_roles', json_encode($data));
}
