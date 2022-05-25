define([], function() {
    'use strict'
    return {
        type: "items",
        component: "accordion",
        items: {
            exportSettings: {
                type: "items",
                label: "Button Settings",
                items: {
                    outputMethod: {
                        ref: "props.outputMethod",
                        component: "radiobuttons",
                        type: "integer",
                        label: "Output Method",
                        options: [{
                                value: 1,
                                label: "Open New Tab"
                            },
                            {
                                value: 2,
                                label: "Copy To Clipboard"
                            },
                            {
                                value: 3,
                                label: "Create New Email"
                            }
                        ],
                        defaultValue: 2,
                    },
                    appId: {
                        ref: "props.appId",
                        type: "string",
                        label: "Alternate App ID"
                    },
                    sheetId: {
                        ref: "props.sheetId",
                        type: "string",
                        label: "Alternate Sheet ID"
                    },
                    maxSelected: {
                        ref: "props.maxSelected",
                        type: "integer",
                        label: "Max Values Selected in One Field",
                        defaultValue: "100",
                        min: 1
                    },
                    emailRecipients: {
                        ref: "props.emailRecipients",
                        type: "string",
                        label: "E-mail Recipients",
                        defaultValue: ";",
                        show: function(data) {
                            if (data.props.outputMethod === 3) {
                                return data.props.emailRecipients;
                            }
                        }
                    },
                    emailTopic: {
                        ref: "props.emailTopic",
                        type: "string",
                        label: "E-mail Subject",
                        defaultValue: "Link to Qlik Sense application",
                        show: function(data) {
                            if (data.props.outputMethod === 3) {
                                return data.props.emailTopic;
                            }
                        }
                    },
                    emailBody: {
                        ref: "props.emailBody",
                        type: "string",
                        label: "E-mail Body",
                        expression: "optional",
                        defaultValue: "Thought you might be interested in seeing this: ",
                        show: function(data) {
                            if (data.props.outputMethod === 3) {
                                return data.props.emailBody;
                            }
                        }
                    }
                }
            },
            ButtonStyle: {
                type: "items",
                label: "Button Style",
                items: {
                    buttonText: {
                        ref: "props.buttonText",
                        type: "string",
                        label: "Button Text",
                        defaultValue: "Button Text",
                    },
                    buttonFontColor: {
                        ref: "props.font_color",
                        type: "string",
                        label: "Font Color (Hex)",
                        defaultValue: "#FFFFF"
                    },
                    buttonFontSize: {
                        ref: "props.font_size",
                        type: "string",
                        label: "Font Size",
                        defaultValue: "10px"
                    },
                    buttonFontWeight: {
                        ref: "props.font_weight",
                        type: "string",
                        label: "Font Weight",
                        defaultValue: "normal"
                    },
                    buttonBackground: {
                        ref: "props.buttonBackground_color",
                        type: "string",
                        label: "Button Color (Hex)",
                        defaultValue: "#008080"
                    },
                    borderColor: {
                        ref: "props.border_color",
                        type: "string",
                        label: "Border Color (Hex)",
                        defaultValue: "#008080"
                    },
                    borderStyle: {
                        ref: "props.border_style",
                        type: "string",
                        label: "Border Size / Style",
                        defaultValue: "1px solid transparent"
                    },
                    borderRadius: {
                        ref: "props.border_radius",
                        type: "string",
                        label: "Border Radius",
                        defaultValue: "4px"
                    },
                    buttonIconShow: {
                        ref: "props.iconShow",
                        type: "boolean",
                        label: "Show Icon?",
                        defaultValue: false
                    },
                    buttonIcon: {
                        ref: "props.icon",
                        type: "string",
                        label: "Leonardo UI Icon",
                        defaultValue: "lui-icon--tick",
                        show: function(data) {
                            return data.props.iconShow
                        }
                    },
                    buttonIconSize: {
                        ref: "props.iconSize",
                        type: "string",
                        component: "dropdown",
                        label: "Leonardo UI Icon Size",
                        defaultValue: " ",
                        options: [{
                            value: "lui-icon--small",
                            label: "Small (12px)"
                        }, {
                            value: " ",
                            label: "Default (16px)"
                        }, {
                            value: "lui-icon--large",
                            label: "Large (20px)"
                        }],
                        show: function(data) {
                            return data.props.iconShow
                        }
                    }
                }
            },
            settings: {
                uses: "settings"
            }
        }
    }
})