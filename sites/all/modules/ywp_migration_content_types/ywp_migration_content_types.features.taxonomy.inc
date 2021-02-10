<?php
/**
 * @file
 * ywp_migration_content_types.features.taxonomy.inc
 */

/**
 * Implements hook_taxonomy_default_vocabularies().
 */
function ywp_migration_content_types_taxonomy_default_vocabularies() {
  return array(
    'hashtags' => array(
      'name' => 'Hashtags',
      'machine_name' => 'hashtags',
      'description' => 'Hashtag vocabulary',
      'hierarchy' => 1,
      'module' => 'hashtags',
      'weight' => -11,
      'rdf_mapping' => array(
        'rdftype' => array(
          0 => 'skos:ConceptScheme',
        ),
        'name' => array(
          'predicates' => array(
            0 => 'dc:title',
          ),
        ),
        'description' => array(
          'predicates' => array(
            0 => 'rdfs:comment',
          ),
        ),
      ),
    ),
    'metatags' => array(
      'name' => 'MetaTags',
      'machine_name' => 'metatags',
      'description' => 'Learning-based terms for cognitive and skills gained with Playlist',
      'hierarchy' => 0,
      'module' => 'taxonomy',
      'weight' => 0,
      'rdf_mapping' => array(
        'rdftype' => array(
          0 => 'skos:ConceptScheme',
        ),
        'name' => array(
          'predicates' => array(
            0 => 'dc:title',
          ),
        ),
        'description' => array(
          'predicates' => array(
            0 => 'rdfs:comment',
          ),
        ),
      ),
    ),
    'skill' => array(
      'name' => 'Skill',
      'machine_name' => 'skill',
      'description' => 'Specific skills gained in XP or the focus of a RESOURCE',
      'hierarchy' => 0,
      'module' => 'taxonomy',
      'weight' => 0,
      'rdf_mapping' => array(
        'rdftype' => array(
          0 => 'skos:ConceptScheme',
        ),
        'name' => array(
          'predicates' => array(
            0 => 'dc:title',
          ),
        ),
        'description' => array(
          'predicates' => array(
            0 => 'rdfs:comment',
          ),
        ),
      ),
    ),
  );
}
