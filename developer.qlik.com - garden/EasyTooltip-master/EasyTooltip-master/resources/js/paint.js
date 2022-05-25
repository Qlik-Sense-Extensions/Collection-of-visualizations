define(["text!../css/EasyTooltip.css"],
function(css, html) {

    'use strict';
		
	return function(element, layout, scope) {
		
		let object = {};									// Initialisation de l'objet courant
		object.id = layout.qInfo.qId;						// Attribution de l'id
		object.div = element;								// Attribution du <DIV> : Contient l'affichage de l'objet
		object.article = object.div.closest('article');		// Attribution du <ARTICLE> : Contient l'objet
		object.header = object.article.find('header');		// Attribution du <HEADER> : Contient le titre de l'objet
		
		object.article.attr('id', 'article-' + object.id);	// Attribution de l'id au <ARTICLE> (utilisé pour distinguer les objets dans le CSS)
			
		let style = $('style#style-' + object.id);			// Récupération du style de l'objet
		if(style.length == 0){								// Si il n'est pas encore défini
			style = $('<style>');							// On le crée
			style.attr('id', 'style-' + object.id);			// On lui met un identifiant
			style.appendTo('head');							// On l'ajoute au <HEAD>
		}
		object.css = css.split('%%_ARTICLE_ID_%%')
						.join('article-' + object.id)
						.split('%%_TOOLTIP_BACKGROUND_COLOR_%%')
						.join(layout.eTooltip.tooltipBackgroundColor.color);
		
		let text = layout.qHyperCube.qGrandTotalRow[0].qText;
		let description = undefined;
		if(layout.qHyperCube.qGrandTotalRow[1] != undefined) {
			description = layout.qHyperCube.qGrandTotalRow[1].qText;
		}
	
		let div = $('<div>');
		let divText = $('<div>');
		let span = $('<span>');
	
		div.addClass('eTooltip-div');
		divText.addClass('eTooltip-div-text');
		span.addClass('eTooltip-span');
		
		if(layout.eTooltip.type == 'image'){
			let img = $('<div>');
			divText.append(img);
			img.addClass(layout.eTooltip.alignement + '-' + layout.eTooltip.verticalPosition);
			object.css = object.css.split('%%_IMAGE_%%').join(text);
		}
		else {
			divText.html(text);
		}
		
		div.append(divText);
		
		if(layout.eTooltip.border == true) {
			div.css('border', 'solid 1px ' + layout.eTooltip.borderColor.color);
		}
		div.css({
			'cursor': layout.eTooltip.cursor,
			'text-align': layout.eTooltip.alignement
		});
		divText.css({
			'background-color': layout.eTooltip.backgroundColor.color,
			'color': layout.eTooltip.textColor.color,
			'vertical-align': layout.eTooltip.verticalPosition,
			'font-size': layout.eTooltip.fontSize
		});
	
		element.html('');
		
		if(description != undefined){
			if(layout.eTooltip.tooltipType == 'image'){
				let img = $('<img>');
				img.attr('src', description);
				span.append(img);
			}
			else {
				span.html(description);
			}
			
			if(layout.eTooltip.tooltipWidth != '') {
				span.css('max-width', layout.eTooltip.tooltipWidth);
			}
			
			span.css({
				'background-color': layout.eTooltip.tooltipBackgroundColor.color,
				'color': layout.eTooltip.tooltipTextColor.color,
				'text-align': layout.eTooltip.tooltipAlignement,
				'font-size': layout.eTooltip.tooltipFontSize,
			});
			
			span.addClass('eTooltip-span-' + layout.eTooltip.tooltipPosition);
			
			element.append(span);
	
			div.mouseover(function(e) {
				let left = 0;
				let top = 0;
				
				object.article.css('z-index', 8);
				span.show();
				
				if(layout.eTooltip.tooltipPosition == 'left'){
					left = div.offset().left - span.width() - 30;
					top = div.offset().top + (div.height() / 2) - (span.height() / 2); // e.pageY - (span.height() / 2);
				}
				else if(layout.eTooltip.tooltipPosition == 'top'){
					left = div.offset().left + (div.width() / 2) - (span.width() / 2); // e.pageX - (span.width() / 2);
					top = div.offset().top - span.height() - 20;
				}
				
				else if(layout.eTooltip.tooltipPosition == 'right'){
					left = div.offset().left + div.width() + 15;
					top = div.offset().top + (div.height() / 2) - (span.height() / 2); // e.pageY - (span.height() / 2);
				}
				else if(layout.eTooltip.tooltipPosition == 'bottom'){
					left = div.offset().left + (div.width() / 2) - (span.width() / 2); // e.pageX - (span.width() / 2);
					top = div.offset().top + div.height() + 20;
				}
				
				span.css({
					'top': top,
					'left': left
				});
				
			});
			div.mouseout(function() {
				span.hide();
				object.article.css('z-index', 2);
				
			});
			
		}
		
		element.append(div);
		style.html(object.css);
		
		return object;										// Pour finir on retourne l'objet
		
	}

});
	
	


