/**
 * E-mergo UI Utility library
 *
 * @version 20200124
 *
 * @package E-mergo
 * @subpackage E-mergo Table Inspector
 *
 * @param  {Object} qlik                Qlik's core API
 * @param  {Object} qvangular           Qlik's Angular implementation
 * @param  {Object} $                   jQuery
 * @param  {Object} _                   Underscore
 * @param  {Object} $q                  Angular's promise library
 * @param  {Object} arrayUtil           Qlik's array utility library
 * @param  {Object} StringNormalization Qlik's string normalization library
 */
define([
	"qlik",
	"qvangular",
	"jquery",
	"underscore",
	"ng!$q",
	"general.utils/array-util",
	"general.utils/string-normalization"
], function( qlik, qvangular, $, _, $q, arrayUtil, StringNormalization ) {

	var cachedData = {},

	/**
	 * Holds the reference to the current app's API
	 *
	 * @type {Object}
	 */
	app = qlik.currApp(),

	/**
	 * Holds the limit of items to show in the popover
	 *
	 * @type {Number}
	 */
	ITEM_LIMIT = 100,

	/**
	 * Filter a list of structured data matching the term
	 *
	 * NOTE: this function is copied 1:1 from Qlik's popover code for requirements.
	 *
	 * @param  {Array} data List of structured data
	 * @param  {String} term Term to filter by
	 * @return {Array} Filtered list
	 */
	listFilter = function( data, term ) {
		if ( term === "" ) {
			return data;
		}

		return data.filter( function ( entity ) {
			if ( typeof entity.value === "undefined" ) {
				return false;
			}
			return StringNormalization.string( entity.value.toLowerCase() ).indexOf( StringNormalization.string( term.toLowerCase() ) ) > -1;
		} );
	},

	/**
	 * Setup a searchable list popover
	 *
	 * @param  {Object} options Popover options
	 * @return {Object} Popover show/close methods
	 */
	uiSearchableListPopover = function( options ) {

		// Parse defaults
		options = _.defaults(options || {}, {
			title: "Items",
			template: '<lui-popover class="add-popover-wrapper" style="min-width: 200px;width: 230px;" align-to="alignTo" position="position" collision="\'flipfit\'" on-close-view="close(event)" qva-outside-ignore-for="{{qvaOutsideIgnoreFor}}"><object-add-typeahead><lui-popover-header><div class="lui-input-group"><input class="lui-input" type="text" name="item" autocomplete="off" ng-model="search.term" tid="item-input" qva-focus="autoFocus" maxlength="255" object-add-typeahead-input on-escape="onEscape($event)" on-enter="onEnter($event)"/></div></lui-popover-header><div class="object-add-popover-content" object-add-typeahead-menu><div class="object-add-popover-list-header" ng-if="items.length">{{title}}</div><ul class="lui-list"><li class="lui-list__item lui-list__action" ng-repeat="item in items" tid="item" object-add-typeahead-item="item" on-select="select(item)"><span qve-highlight text="{{item.value}}" title="{{item.value}}" query="search.term" class="lui-list__text lui-list__text--ellipsis"></span></li></ul><div class="object-add-popover-nohits" ng-if="!items.length" q-translation="Toolbox.Search.Nohits"></div></div></object-add-typeahead></lui-popover>',
			get: function( setItems ) { setItems([]); },
			select: function( item ) {},
			alignTo: function() { return ""; },
			closeOnEscape: true,
			outsideIgnore: false,
			dock: "right"
		});

		/**
		 * Holds the popover
		 *
		 * @type {Object}
		 */
		var popover,

		/**
		 * Flag for the popover's active state
		 *
		 * @type {Boolean}
		 */
		active = false,

		/**
		 * Open the popover
		 *
		 * @return {Void}
		 */
		open = function() {
			active = true;

			// Open the popover
			popover = qvangular.getService("luiPopover").show({
				template: options.template,
				controller: ["$scope", function( $scope ) {
					$scope.title = options.title;
					$scope.search = {
						term: ""
					};

					$scope.autoFocus = true;

					$scope.onEscape = function( event ) {
						if ($scope.search.term !== "") {
							event.stopPropagation();
							$scope.search.term = "";
						} else {
							$scope.close();
						}
					};

					$scope.onEnter = function( event ) {
						if ($scope.search.term !== "") {
							event.stopPropagation();
							$scope.selectFromName($scope.search.term);
						} else {
							$scope.close();
						}
					};

					$scope.selectFromName = function( term ) {
						var items = listFilter(cache.items, term);

						if (items.length) {
							$scope.select(items[0]);
						}
					};

					$scope.select = function( item ) {
						$scope.close();
						options.select(item);
					};

					var cache = null;

					$scope.$watch("search.term", function( term ) {
						function setItems() {
							var items = listFilter(cache.items, term);

							if (items.length > ITEM_LIMIT) {
								items = arrayUtil.limit(items, ITEM_LIMIT);
							}


							$scope.items = items;
						}

						if (! cache) {
							options.get( function( items ) {
								cache = {
									items: items
								};

								setItems();
							});
						} else {
							setItems();
						}
					});
				}],
				alignTo: options.alignTo(),
				closeOnEscape: options.closeOnEscape,
				outsideIgnore: options.outsideIgnore,
				dock: options.dock
			});

			// Runs when pressing outside of the button
			popover.closing.then( function( event ) {
				if (event && !$(event.target).is(options.outsideIgnore)) {
					active = false;
				}
			});

			popover.closed.then( function() {
				popover = null;
				active = false;
			});
		},

		/**
		 * Close the popover
		 *
		 * @return {Void}
		 */
		close = function() {
			if (popover) {
				popover.close();
				popover = null;
			}
		};

		return {
			open: open,
			close: close,
			isActive: function() {
				return active;
			}
		};
	};

	return {
		uiSearchableListPopover: uiSearchableListPopover
	};
});