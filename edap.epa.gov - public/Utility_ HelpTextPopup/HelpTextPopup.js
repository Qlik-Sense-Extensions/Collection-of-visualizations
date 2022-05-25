define(["qlik", "./sanitize-html.min", "./sanitize-html.config", "css!./style.css"], function (qlik, sanitizeHtml, sanitizeConfig) {

	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				HelpBoxInfo: {
                    type: "items",
					ref: "listItems",
					label: "Help Text Box Info",
					items: {
                        ShowBoxTitle: {
                            type: "boolean",
                            component: "switch",
                            label: "Show box title",
                            ref: "ShowBoxTitle",
                            options: [{
                                value: true,
                                label: "On"
                            }, {
                                value: false,
                                label: "Off"
                                }],
                            defaultValue: true
                        },
						BoxTitle: {
                            ref: "BoxTitle",
							label: "Help Box Title",
							type: "string",
							defaultValue: "Title",
							expression: "optional",
                            show: function(x) {
                                return x.ShowBoxTitle;
                            }
                        },
						BoxWidth: {
                            ref: "BoxWidth",
							label: "Width of box as % of window",
							type: "string",
							defaultValue: "50",
							expression: "optional"
						},
						BoxHeight: {
                            ref: "BoxHeight",
                            label: "Height of box as % of window",
							type: "string",
							defaultValue: "50",
							expression: "optional"
						},
						HelpText: {
							label: "HTML Help Text",
							component: "textarea",
							rows: 7,
							maxlength: 100000,
                            ref: "HelpText",
							expression: "optional",
						},
                        HelpBoxModal: {
                            type: "boolean",
                            component: "switch",
                            label: "Modal",
                            ref: "HelpBoxModal",
                            options: [{
                                value: true,
                                label: "On"
                            }, {
                                value: false,
                                label: "Off"
                            }],
                            defaultValue: true
                        },
					}
				},
				settings: {
					uses: "settings",
					items: {
						HelpIcon:{
							label:"Help Icon Settings",
							type:"items",
							items:{
                                HelpIconColor: {
                                    type: "string",
									label: "Help Icon Color Expression",
                                    ref: "HelpIconColor",
                                    expression: "optional"
								},
                                HelpIconSize: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Help Icon Size",
                                    ref: "HelpIconSize",
                                    options: [{
                                        value: "2",
                                        label: "Large (20px)",
                                        tooltip: "Large icon"
                                    }, {
                                        value: "1",
                                        label: "Medium (16px)",
                                        tooltip: "Medium icon"
                                    }, {
                                        value: "0",
                                        label: "Small (12px)",
                                        tooltip: "Small icon"
                                    }],
                                    defaultValue: "1"
                                }
                            }
						}
						
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
        paint: function ($element, layout) {
            var iconSizeClass = ["lui-icon--small", "", "lui-icon--large"];
			var objectID = layout.qInfo.qId,
				linkHTML = '',
				templateHTML = '';


            var sanitizeOptions = {
                allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
                allowedAttributes: {
                    //                    a: [ 'href', 'name', 'target' ],
                    a: ['name', 'target'],
                    // We don't currently allow img itself by default, but this
                    // would make sense if we did. You could add srcset here,
                    // and if you do the URL is checked for safety
                    img: ['src']
                },
                // Lots of these won't come up by default because we don't allow them
                selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
                // URL schemes we permit
                allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
                allowedSchemesByTag: {},
                allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
                allowProtocolRelative: true
            };

            // Create the html string for the help box
            // Adapted from the Leonardo documentation
            if (layout.HelpBoxModal) {
                templateHTML += '<div id="help-box-modal-background-' + objectID + '" class="lui-modal-background" style="display: none;"></div>';
            }
            templateHTML += '<div id="help-box-container-' + objectID + '" style="display: none;">';
            templateHTML += '  <div id="help-box-content-' + objectID + '" style="">';
            templateHTML += '    <div class="lui-dialog dialog-content"  style="">';
            templateHTML += '      <div class="lui-dialog__header" style="' + (layout.ShowBoxTitle ? '' : 'display:none;') + '">';
            templateHTML += '        <div class="lui-dialog__title" id="Dialog-Title" ></div>';
            templateHTML += '      </div>';
            templateHTML += '      <div id="help-text-' + objectID + '" class="lui-dialog__body"></div>';
            templateHTML += '      <div class="lui-dialog__footer">';
            templateHTML += '        <button class="lui-button  lui-dialog__button cancel" >Close</button>';
            templateHTML += '      </div>';
            templateHTML += '  </div>';
            templateHTML += '</div>';
            if (layout.HelpBoxModal) {
                templateHTML += '</div>';
            }
            if ($('#help-box-container-' + objectID).length != 0) {
                $('#help-box-container-' + objectID).remove();
            }
            if ($('#help-box-modal-background-' + objectID).length != 0) {
                $('#help-box-modal-background-' + objectID).remove();
            }
            if ($('#help-box-container-' + objectID).length == 0) {
				if ($('#grid').length > 0) {
					$('#grid').append(templateHTML);
				} else {
					$('body').append(templateHTML);
				}
				
				$(function () {
                    $("#help-box-container-" + objectID).draggable({ handle: "div.lui-dialog__header" });
				});
            }
            linkHTML = '<div class="lui-buttongroup">';
            linkHTML += '<span id="help-icon-' + objectID + '" class="lui-icon ' + iconSizeClass[layout.HelpIconSize] + ' lui-icon--help view_dialog">' + '</span>';
            linkHTML += '</div>';
            $element.html(linkHTML);
            if (layout.HelpIconColor.length != 0) {
                $('#help-icon-' + objectID).css("color", layout.HelpIconColor);
            }
			$(".cancel").click(function () {
				$('#help-box-container-' + objectID).css("display", "none");
                $('#help-box-modal-background-' + objectID).css("display", "none");
			});

			$(".view_dialog").click(function () {
				$('#download_file').hide();
                if (layout.HelpBoxModal) {
                    $("#help-box-modal-background-" + objectID).css("display", "");
                    $("#help-box-modal-background-" + objectID).css("width", "100%");
                    $("#help-box-modal-background-" + objectID).css("height", '"' + window.innerHeight + 'px"');
                }
                $("#help-box-container-" + objectID).css("border", "5px");
                $("#help-box-container-" + objectID).css("border-color", "#3a7391");
                $('#help-box-container-' + objectID + ' #Dialog-Title').html(layout.BoxTitle);
				$("#help-box-container-" + objectID).css("display", "");
                $(".dialog-content").css("width", layout.BoxWidth + "%");
                $("#help-text-" + objectID).show().css("height", ((layout.BoxHeight / 100) * window.innerHeight) + "px").html(sanitizeHtml(layout.HelpText, sanitizeConfig.getConfig()));
			});
			return qlik.Promise.resolve();
		}
	};
});
