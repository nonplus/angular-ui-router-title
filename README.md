angular-ui-router-title
=========================

AngularJS module for updating browser title/history based on the current ui-router state.

Motivation
----------

Using ui-router states with `url` configurations enables browser history support and bookmarking of application state.
It is important that the title in the browser history/bookmark represent the application state so that the user can tell
where she's navigating to.

This module provides a `$title` variable on the `$rootScope` that is populated based on the `$title` value resolved in `$state.$current` (or one of its parent states).

The module also provides a `$breadcrumbs` array that is populated based on the `$title` of `$state.$current` and its parent states.

Installing the Module
---------------------
Installation can be done through bower:
``` shell
bower install angular-ui-router-title
```

In your page add:
```html
  <script src="bower_components/angular-ui-router-title/angular-ui-router-title.js"></script>
```

Loading the Module
------------------

This module declares itself as `ui.router.title`, so it can be declared as a dependency of your application as normal:

```javascript
var app = angular.module('myApp', ['ng', 'ui.router.title']);
```

Using the $title in the page title
----------------------------------

The page title, bookmark title and browser history is sat from the contents of the `<title>` tag.

```html
<html ng-app>
<head>
  <title ng-bind="$title + ' - My Application'">My Application</title>
</head>
...
```

Using the $breadcrumbs
----------------------

The `$breadcrumbs` array contains objects, one for each state that resolves a `$title` value.  Each entry contains:

  * `title`: $title value of this state
  * `state`: name of the state
  * `stateParams`: $stateParams of the state.

```html
<ol class="breadcrumb">
	<li ng-repeat="crumb in $breadcrumbs" ng-class="{ 'active' : $last }">
		<a ng-if="!$last" href="{{$state.href(crumb.state, crumb.stateParams)}}">{{crumb.title}}</a>
		<span ng-if="$last">{{crumb.title}}</span>
	</li>
</ol>
```

Specifying the $title in the state definition
---------------------------------------------

A state defines its title by declaring a `$title` value in its `resolve` block.  It's a good idea for the `$title` to include information from the current state, so it may need to inject the `$stateParam` or another value that was resolved from them.

```javascript
$stateProvider
  .state('home', {
    ...
    resolve: {
      // Constant title
      $title: function() { return 'Home'; }
    }
  })
  .state('about', {
    url: '/about',
    ...
    resolve: {
      // Constant title
      $title: function() { return 'About'; }
    }
  })
  .state('contacts', {
    url: '/contacts',
    ...
    resolve: {
      // List of contacts
      contacts: ['Contacts', function(Contacts) {
        // Use Contacts service to retrieve list
        return Contacts.query();
      }],
      // Dynamic title showing number of contacts
      $title: ['contacts', function(contacts) {
        return 'Contacts (' + contacts.length + ')';
      }]
    }
  })
  .state('contact', {
    url: '/contact/:contactId',
    ...
    resolve: {
      // Single contact
      contact: ['Contacts', '$stateParams', function(Contacts, $stateParams) {
        // Use Contacts service to retrieve a contact
        return Contacts.get({ id: $stateParams.contactId });
      }],
      // Dynamic title showing the name of contact
      $title: ['contact', function(contact) {
        return contact.name;
      }]
    }
  })
  .state('contact.edit', {
    url: '/edit',
    ...
    resolve: {
      // Dynamic title appending to parent state's title
      $title: ['$title', function($title) {
        return $title + " (edit)";
      }]
    }
  })
```

Copyright & License
-------------------

Copyright 2015 Stepan Riha. All Rights Reserved.

This may be redistributed under the MIT licence. For the full license terms, see the LICENSE file which
should be alongside this readme.
