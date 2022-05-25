define(['qlik'], function (qlik) {
	return {
		initialProperties: {},
		definition: {
			type: 'items',
			component: 'accordion',
			items: {
				settings: {
					uses: 'settings',
					type: 'items',
					items: {
						css: {
							ref: "css",
							label: "CSS",
							component: "textarea",
							defaultValue: ""
						},
						title: {
							type: 'items',
							label: 'Title',
							items: {
								html: {
									ref: "titleHTML",
									label: "HTML",
									type: "string",
									defaultValue: ""
								},
								css: {
									ref: "titleCSS",
									label: "CSS",
									component: "textarea",
									defaultValue: ""
								},
							}
						},
						containers: {
							type: 'array',
							ref: 'containers',
							label: 'Containers',
							addTranslation: 'Add Container',
							allowAdd: true,
							allowRemove: true,
							items: {
								css: {
									ref: "css",
									label: "CSS",
									component: "textarea",
									defaultValue: ""
								},
								objects: {
									type: 'array',
									ref: 'objects',
									label: 'Objects',
									addTranslation: 'Add Object',
									allowAdd: true,
									allowRemove: true,
									items: {
										object: {
											type: 'string',
											component: 'dropdown',
											label: 'Master Object',
											ref: 'id',
											options: function() {
												var app = qlik.currApp();
												return app.getList('masterobject').then(function(model) {
													app.destroySessionObject(model.layout.qInfo.qId);
													return model.layout.qAppObjectList.qItems.map(function(item) {
														return {
															label: item.qMeta.title,
															value: item.qInfo.qId,
														}
													})
												})
											}
										},
										css: {
											ref: "css",
											label: "CSS",
											component: "textarea",
											defaultValue: ""
										},
									}
								}
							}
						}
					}
				}
			}
		},
		paint: function ($element, layout) {
			var app = qlik.currApp();
			$element.html("");
			$element.attr('style', layout.css);
			$title = $("<div></div>");
			$title.html(layout.titleHTML);
			$title.attr('style', layout.titleCSS);
			$title = $title.appendTo($element);
			layout.containers.forEach(function(container) {
				var $container = $("<div></div>");
				$container.attr('style', container.css);
				$container = $container.appendTo($element);
				container.objects.forEach(function(object) {
					var $object = $("<div></div>");
					$object.attr('style', object.css);
					$object = $object.appendTo($container);
					app.visualization.get(object.id).then(function(vis){
						vis.show($object);
					});
				});
			});
		}
	};
});

