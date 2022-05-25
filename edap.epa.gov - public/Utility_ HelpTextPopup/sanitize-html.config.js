/*global define*/
define( [
	'jquery',
	'underscore',
	'ng!$http',
	'ng!$q',
	'qlik'
], function ( $,
			  _,
			  $http,
			  $q,
			  qlik ) {
	'use strict';

  /* Uncomment this code and comment out the other definition in order to invoke the default settings of sanitize-html. */
  /*
  function getConfig () {
    return null
  }
  */
	function getConfig () {
		return {
			allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 
			'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'span',
			'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe' ],
			allowedAttributes: {
				a: [ 'href', 'name', 'target' ],
				// a: [ 'name', 'target' ],
				// We don't currently allow img itself by default, but this
				// would make sense if we did. You could add srcset here,
				// and if you do the URL is checked for safety
				img: [ 'src' ],
				p: ['style'],
				div: ['style'],
				span: ['style']
			},
			allowedStyles: {
				'*': {
					// Match HEX and RGB
					'color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
					'background-color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
					'text-align': [/^left$/, /^right$/, /^center$/],
					// Match any number with px, em, or %
					'font-size': [/^\d+(?:px|em|%)$/]
				},
				'p': {
					'font-size': [/^\d+rem$/]
				}
			},
			// Lots of these won't come up by default because we don't allow them
			selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
			// URL schemes we permit
			allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
			allowedSchemesByTag: {},
			allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
			allowProtocolRelative: true
		}
	}

	return {
		getConfig: getConfig,
	}
} );
