<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.

define('URL_MATCH', '([^\/]*)');

return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'Dublin - database management',
	'theme'=>'standard',

	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
		'application.components.helpers.*',
	),

	// application components
	'components'=>array(

		// Log database
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning, info, trace',
				),
				array(
					'class'=>'CProfileLogRoute',
					'levels'=>'error, warning, info, trace',
					'showInFireBug'=>true,
				),
				array(
					'class'=>'CWebLogRoute',
					'levels'=>'error, warning', //, warning, info, trace',
					'showInFireBug'=>true,
				),
			),
		),

		// User settings
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
		),

		// Database settings
		'db'=>array(
			'class' => 'CDbConnection',
			'connectionString' => 'mysql:host=web;dbname=information_schema',
			'charset' => 'utf8',
			'autoConnect' => false,
			'schemaCachingDuration'=>3600,
		),

		'messages'=>array(
		    'class'=>'application.components.messages.CXmlMessageSource',
			'cachingDuration' => 0,
		),

		// URL - Manager (for SEO-friendly URLs)
		'urlManager'=>array(
            'urlFormat'=>'path',
			'showScriptName' => false,
            'rules'=>array(
				// Login
                'login'=>'site/login',

				// Site
                'site/changeLanguage/<id:(.*)>'=>'site/changeLanguage',
                'site/changeTheme/<id:(.*)>'=>'site/changeTheme',

				// Databases
				'databases'=>'database/list',
				'databases/create'=>'database/create',
				'databases/update'=>'database/update',
				'databases/drop'=>'database/drop',

				// Database
               	'database'=>'database/list',
                'database/<schema:'.URL_MATCH.'>'=>'database/show',

					// Table
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/browse'=>'table/browse',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/structure'=>'table/structure',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/sql'=>'table/sql',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/insert'=>'table/insert',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/truncate'=>'table/truncate',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/drop'=>'table/drop',

					// Column
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/columns/move'=>'column/move',
					'database/<schema:'.URL_MATCH.'>/tables/<table:'.URL_MATCH.'>/columns/update'=>'column/update',
            ),
        ),

        /*
        // Cache
        'cache' => array(
        	'class' => 'system.caching.CMemCache',
        	'servers'=>array(
                array(
                    'host'=>'127.0.0.1',
                    'port'=>11211,
                    'weight'=>100,
                ),
            ),
        ),
        */

        // View Renderer (template engine)
        'viewRenderer'=>array(
            'class'=>'CPradoViewRenderer',
        ),

	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'webmaster@example.com',
		'iconpack'=>'images/icons/pma',
	),

	'sourceLanguage'=>'xxx',
);
