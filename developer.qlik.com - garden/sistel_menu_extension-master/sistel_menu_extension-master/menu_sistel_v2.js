define(['qlik', 'jquery',
    './src/properties', './src/initialproperties',
    'css!./src/css/main.css',
    'text!./src/partials/template.ng.html'
], 

function(qlik, $, props, initProps, cssContent,htmlTemplate){
    'use strict';

    $( '<style>' ).html(cssContent).appendTo( 'head' );

    return {
        definition: props,
        initialProperties: initProps,
        template: htmlTemplate,
        controller: ['$scope', function ($scope) {
            
            $scope.navigate = function(to){
                qlik.navigation.gotoSheet(to);
            }

            $scope.hoverEnterEvent = function(event){
                var style = {
                    'background-color': $scope.layout.color_fondo_resaltado.color + ' !important',
                    'color' :  event.target.style.color = $scope.layout.color_fuente_resaltada.color + ' !important'
                };

                $(event.target).css(style);
                //Allow submenus to overlap other objects
                $(document.body).find(".qv-object-menu_sistel_v2").parent().parent().parent().parent().css("z-index","2147483629");
            }

            $scope.hoverExitEvent = function(event){
                const targetClass = $(event.target).attr('class');

                var style = {
                    'background-color': $scope.layout.color_fondo.color + ' !important',
                    'color' :  $scope.layout.color_fuente.color + ' !important'
                }

                var currSheetId = qlik.navigation.getCurrentSheetId().sheetId;

                //Remove hover styles
                if(!event.target.id.includes(currSheetId)){
                    $(event.target).css(style);
                }

                //Close subenu
                var positionOutOfSubmenu = $(event.relatedTarget).parents('.sistel-dropdown-menu').length == 0 ? true : false;
                if(targetClass.includes('submenu-close-onexit') && positionOutOfSubmenu){
                    var parentMenu = $(event.target).parents('.sistel-dropdown-menu');
                    $(parentMenu[0]).addClass('hide');
                    $(parentMenu[0]).removeClass('show');
                }

                //Prevent menu from overlapping unwanted objects
                $(document.body).find(".qv-object-menu_sistel_v2").parent().parent().parent().parent().css("z-index","1");
            }

            $scope.toggleDropdown = function(index){
                $(document.body).find(".qv-object-menu_sistel_v2").parent().parent().parent().parent().css("z-index","2147483629");
                var dropdown = $('ul[data-dropdownoption="' + index + '-dropdown"]');
                dropdown.toggleClass("hide");
                dropdown.toggleClass("show");
            }

            // Toggle Sheet title visibility on property change
            $scope.$watch('layout.opciones_hoja.oculta_menu', setSheetTitleVisibility);

            function setSheetTitleVisibility(){
                if($scope.layout.opciones_hoja.oculta_menu){
                    $('.qv-panel-sheet .sheet-title-container').css({'display' : 'none'});
                }else{
                    $('.qv-panel-sheet .sheet-title-container').css({'display' : 'block'});
                }
            }

            $(document).ready(()=>{
                // Destaca la opción del menú que corresponde con la hoja actual
                function setHoverCurrentSheet(){
                    var style = {
                        'background-color': $scope.layout.color_fondo_resaltado.color + ' !important',
                        // 'border-bottom': '2px solid ' + $scope.layout.color_fuente_resaltada.color,
                        'color' : $scope.layout.color_fuente_resaltada.color + ' !important'
                    };
                    var currSheetId = '#a-' + qlik.navigation.getCurrentSheetId().sheetId;
                    $(currSheetId).css(style);
                }
               

                setHoverCurrentSheet();
                setSheetTitleVisibility();
            });
        }]
    }
});