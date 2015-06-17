'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$mdThemingProvider', '$mdIconProvider',
	function($locationProvider, $mdThemingProvider, $mdIconProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');

        // $mdThemingProvider.definePalette('afruPrimary', {
        //     '50': 'FFF3E0',
        //     '100': 'FFE0B2',
        //     '200': 'FFCC80',
        //     '300': 'FFB74D',
        //     '400': 'FFA726',
        //     '500': 'FF9800',
        //     '600': 'FB8C00',
        //     '700': 'F57C00',
        //     '800': 'EF6C00',
        //     '900': 'E65100',
        //     'A100': 'FFD180',
        //     'A200': 'FFAB40',
        //     'A400': 'FF9100',
        //     'A700': 'FF6D00',
        //     'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        //                                         // on this palette should be dark or light
        //     'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        //      '200', '300', '400', 'A100'],
        //     'contrastLightColors': undefined    // could also specify this if default was 'dark'
        // });

        //Primary Theme
        $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('red');

        $mdIconProvider
       .iconSet('social', 'public/lib/material-design-icons/social/svg', 24)
       .iconSet('action', 'public/lib/material-design-icons/action/svg', 24)
       .iconSet('social', 'public/lib/material-design-icons/social/svg', 24)
       .iconSet('social', 'public/lib/material-design-icons/social/svg', 24)
       

        //Alternative Theme
        // $mdThemingProvider.theme('altTheme')
        // .primaryPalette('grey')
        // .accentPalette('accentPalette');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
