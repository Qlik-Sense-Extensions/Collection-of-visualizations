define(['qlik', 'text!./data/lui-icons.json'], function(qlik, luiIcons){
    'use strict';

    var sheets = [];

    //Obtén todas las hojas del documento, sin repeticiones
    function getSheets(){
        sheets = [];
        var app = qlik.currApp();
        app.getAppObjectList("sheet", function ( data ) {      
            data.qAppObjectList.qItems.forEach((s)=>{
                var found = false;
                //Impide que se añadan duplicados
                for(var i = 0; i < sheets.length && !found; i++){
                    if(s.qInfo.qId == sheets[i].value){
                        found = true;
                    }
                }

                if(!found){
                    sheets.push({
                        value: s.qInfo.qId,
                        label: s.qMeta.title
                    });
                }
            });
        });
    }

    getSheets();

    var menuColores = {
        type: "items",
        label: "Colors",
        ref: "colors",
        items: {
            color_fondo: {
                label: "Background color",
                ref: "color_fondo",
                type: "object",
                component: "color-picker",
                defaultValue: {
                    color: "#009EE3",
                    index: "-1"
                }
            },
            color_fuente:{
                label: "Font color",
                ref: "color_fuente",
                type: "object",
                component: "color-picker",
                defaultValue: {
                    color: "#fffff",
                    index: "-1"
                }
            },
            color_resaltado: {
                label: "Background hover color",
                ref: "color_fondo_resaltado",
                type: "object", 
                component: "color-picker",
                defaultValue: {
                    color: "#999",
                    index: "-1"
                }
            },
            texto_resaltado: {
                label: "Font hover color",
                ref: "color_fuente_resaltada",
                type: "object",
                component: "color-picker",
                defaultValue: {
                    color: "#fffff",
                    index: "-1"
                }
            }
        }
    };

    var propiedadesHoja = {
        type : "items",
        label : "Sheet options",
        ref : "opciones_hoja",
        items : {
            ocultaMenuSuperior: {
                label: "Hide Sheet Menu",
                ref: "opciones_hoja.oculta_menu",
                type: "boolean",
                component: "switch",
                defaultValue: false,
                options: [
                    {
                        value: true,
                        label: "Yes"
                    },
                    {
                        value: false,
                        label: "No"
                    }
                ]
            }
        }
    }

    var addMenus = {
        type: "array",
        label: 'Menu links',
        ref: 'objetos_menu',
        itemTitleRef: "titulo",
        allowAdd: true,
        addTranslation: 'Add link',
        allowRemove: true,
        allowMove: true,
        items: {
            titulo: {
                type: "string",
                label: "Title",
                ref: "titulo", 
                expression: "optional"
            },
            icono: {
                type: "string",
                component: "dropdown",
                label: "Icon",
                ref: "icono",
                options: function(){
                    var iconList = JSON.parse(luiIcons).icons;
                    var props = [{
                        value: '',
                        label: '>> No icon <<'
                    }];

                    iconList.forEach(function(icon){
                        props.push({
                            value: icon.id,
                            label: icon.name
                        });
                    });

                    return props;
                }

            },
            destino: {
                type: "string",
                component: "dropdown",
                ref: "hoja_destino",
                label: "Sheet",
                options: function(){return sheets;},
                show: function(data){return data.objetos_submenu.length == 0},
                defaultValue: ""
            },
            visibilidad : {
                type: "boolean",
                component: "switch",
                label: "Visible",
                ref: "visible",
                options: [{
                    value: true,
                    label: "Yes"
                },{
                    value: false,
                    label: "No"
                }]
            },
            submenus : {
                type: "array",
                ref: "objetos_submenu",
                label: "Submenus",
                itemTitleRef: "titulo_submenu",
                allowAdd: true,
                allowRemove: true,
                allowMove: true,
                addTranslation: 'Add submenu',
                items: {
                    titulo: {
                        type: "string",
                        label: "Submenu title",
                        ref: "titulo_submenu", 
                        expression: "optional"
                    },
                    destino: {
                        type: "string",
                        component: "dropdown",
                        ref: "hoja_destino_submenu",
                        label: "Sheet",
                        options: function(){
                            return sheets;
                        },
                        defaultValue: ""
                    }
                }
            }
        }
    };

    var brandOptions = {
        type: "items",
        label: "Brand",
        ref: "logo",
        items: {
            toggle: {
                type: "boolean",
                component: "switch",
                label: "Visible",
                ref: "logo.visibilidad_logo",
                defaultValue: false,
                options: [{
                    value: true,
                    label: "Yes"
                },{
                    value: false,
                    label: "No"
                }]
            },
            titulo : {
                type: "string",
                label: "Brand",
                ref: "logo.marca_menu",
                show: function(data){return data.logo.visibilidad_logo}
            },
            grosor: {
                type: "string",
                component: "dropdown",
                label: "Font weight",
                ref: "logo.grosor",
                defaultValue: "normal",
                options: [{
                    value: "normal",
                    label: "Normal"
                },
                {
                    value: "bold",
                    label: "Bold"
                }],
                show: function(data){return data.logo.visibilidad_logo}
            }
        }
    }

    return {
        type: 'items',
        component: "accordion",
        items:{
            menuItems: {
                type: "items",
                component: "expandable-items",
                label: "Menu Items",
                items: {
                    brandOptions: brandOptions,
                    menuOptions: addMenus
                }
            },
            menuSettings: {
                type: "items",
                component: "expandable-items",
                label: "Menu Settings",
                items: {
                    colors: menuColores,
                    propiedadesHoja: propiedadesHoja
                }
            },
            settings: {
                uses: "settings"
            }
        }
    }
});
