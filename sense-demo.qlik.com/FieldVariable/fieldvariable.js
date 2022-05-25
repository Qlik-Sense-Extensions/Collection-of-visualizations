define("extensions/fieldvariable/util", ["qlik"], function(e) {
    "use strict";

    function t(e, t, n) {
        var r = document.createElement(e);
        return t && (r.className = t), n !== undefined && (r.innerHTML = n), r
    }

    function n(e, t) {
        e.childNodes.length === 0 ? e.appendChild(t) : e.replaceChild(t, e.childNodes[0])
    }

    function r(e) {
        var n = t("link");
        n.rel = "stylesheet", n.type = "text/css", n.href = require.toUrl(e), document.head.appendChild(n)
    }

    function i(t) {
        var n = e.currApp();
        n.variable.getByName ? n.variable.getByName(t).then(function() {}, function() {
            n.variable.create(t)
        }) : n.variable.create(t)
    }
    return {
        createElement: t,
        setChild: n,
        addStyleSheet: r,
        createVariable: i
    }
}), define("extensions/fieldvariable/properties", ["./util"], function(e) {
    "use strict";
    return {
        initialProperties: {
            variableValue: {},
            variableName: "",
            render: "f",
            alternatives: [],
            min: 0,
            max: 100,
            step: 1,
            style: "qlik",
            width: "",
            customwidth: "",
            qListObjectDef: {
                "qStateName": "$",
                "qShowAlternatives": true,
                "qInitialDataFetch": [{
                    "qTop": 0,
                    "qLeft": 0,
                    "qHeight": 50,
                    "qWidth": 1
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimension: {
                    type: "items",
                    label: "Dimensions",
                    ref: "qListObjectDef",
                    min: 1,
                    max: 1,
                    items: {
                        label: {
                            type: "string",
                            ref: "qListObjectDef.qDef.qFieldLabels.0",
                            label: "Label",
                            show: true
                        },
                        libraryId: {
                            type: "string",
                            component: "library-item",
                            libraryItemType: "dimension",
                            ref: "qListObjectDef.qLibraryId",
                            label: "Dimension",
                            show: function(data) {
                                return data.qListObjectDef && data.qListObjectDef.qLibraryId;
                            }
                        },
                        field: {
                            type: "string",
                            expression: "always",
                            expressionType: "dimension",
                            ref: "qListObjectDef.qDef.qFieldDefs.0",
                            label: "Field",
                            show: function(data) {
                                return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
                            }
                        },
                        frequency: {
                            type: "string",
                            component: "dropdown",
                            label: "Frequency mode",
                            ref: "qListObjectDef.qFrequencyMode",
                            options: [{
                                value: "N",
                                label: "No frequency"
                            }, {
                                value: "V",
                                label: "Absolute value"
                            }, {
                                value: "P",
                                label: "Percent"
                            }, {
                                value: "R",
                                label: "Relative"
                            }],
                            defaultValue: "V"
                        }
                    }
                },
                settings: {
                    uses: "settings",
                    items: {
                        variable: {
                            type: "items",
                            label: "Variable",
                            items: {
                                name: {
                                    ref: "variableName",
                                    label: "Name",
                                    type: "string",
                                    change: function(t) {
                                        e.createVariable(t.variableName), t.variableValue = t.variableValue || {}, t.variableValue.qStringExpression = "=" + t.variableName
                                    }
                                },
                                style: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Style",
                                    ref: "style",
                                    options: [{
                                        value: "qlik",
                                        label: "Qlik"
                                    }, {
                                        value: "bootstrap",
                                        label: "Bootstrap"
                                    }, {
                                        value: "material",
                                        label: "Material"
                                    }]
                                },
                                width: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Width",
                                    ref: "width",
                                    options: [{
                                        value: "",
                                        label: "Default"
                                    }, {
                                        value: "fill",
                                        label: "Fill"
                                    }, {
                                        value: "custom",
                                        label: "Custom"
                                    }]
                                },
                                customwidth: {
                                    type: "string",
                                    ref: "customwidth",
                                    label: "Custom width",
                                    expression: "optional",
                                    show: function(e) {
                                        return e.width === "custom"
                                    }
                                },
                                render: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Render as",
                                    ref: "render",
                                    options: [{
                                        value: "b",
                                        label: "Button"
                                    }, {
                                        value: "s",
                                        label: "Select"
                                    }, {
                                        value: "f",
                                        label: "Field"
                                    }, {
                                        value: "l",
                                        label: "Slider"
                                    }],
                                    defaultValue: "f"
                                },
                                alternatives: {
                                    type: "array",
                                    ref: "alternatives",
                                    label: "Alternatives",
                                    itemTitleRef: "label",
                                    allowAdd: !0,
                                    allowRemove: !0,
                                    addTranslation: "Add Alternative",
                                    items: {
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Value",
                                            expression: "optional"
                                        },
                                        label: {
                                            type: "string",
                                            ref: "label",
                                            label: "Label",
                                            expression: "optional"
                                        }
                                    },
                                    show: function(e) {
                                        return e.render === "b" || e.render === "s"
                                    }
                                },
                                min: {
                                    ref: "min",
                                    label: "Min",
                                    type: "number",
                                    defaultValue: 0,
                                    show: function(e) {
                                        return e.render === "l"
                                    }
                                },
                                max: {
                                    ref: "max",
                                    label: "Max",
                                    type: "number",
                                    defaultValue: 100,
                                    show: function(e) {
                                        return e.render === "l"
                                    }
                                },
                                step: {
                                    ref: "step",
                                    label: "Step",
                                    type: "number",
                                    defaultValue: 1,
                                    show: function(e) {
                                        return e.render === "l"
                                    }
                                },
                                rangelabel: {
                                    ref: "rangelabel",
                                    label: "Slider label",
                                    type: "boolean",
                                    defaultValue: !1,
                                    show: function(e) {
                                        return e.render === "l"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}), define(["qlik", "./util", "./properties"], function(e, t, n) {
    "use strict";

    function r(e) {
        return (e.value - e.min) * 100 / (e.max - e.min)
    }

    function i(e, t, n) {
        switch (e) {
            case "material":
            case "bootstrap":
                if (n) return "selected";
                break;
            default:
                switch (t) {
                    case "button":
                        return n ? "qui-button-selected" : "qui-button";
                    case "select":
                        return "qui-select";
                    case "input":
                        return "qui-input"
                }
        }
    }

    function s(e) {
        if (e.render === "l") return "98%";
        if (e.width === "custom") return e.customwidth;
        if (e.width === "fill") return e.render !== "b" ? "100%" : "calc( " + 100 / e.alternatives.length + "% - 3px)"
    }
    return t.addStyleSheet("extensions/variable/variable.css"), {
        initialProperties: n.initialProperties,
        definition: n.definition,
        paint: function(n, o) {
            var u = t.createElement("div", o.style || "qlik"),
                a = s(o),
                f = this;
            o.alternatives = [];
            f.backendApi.eachDataRow(function(rownum, row) {
                //html += '<span class=" data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
                o.alternatives.push({
                    value: row[0].qText,
                    label: row[0].qText
                });
                //html += '</span>';
            });
            if (o.render === "b") o.alternatives.forEach(function(n) {
                var r = t.createElement("button", i(o.style, "button", n.value === o.variableValue), n.label);
                r.onclick = function() {
                    e.currApp(f).variable.setContent(o.variableName, n.value)
                }, r.style.width = a, u.appendChild(r)
            });
            else if (o.render === "s") {
                var l = t.createElement("select", i(o.style, "select"));
                l.style.width = a, o.alternatives.forEach(function(e) {
                    var n = t.createElement("option", undefined, e.label);
                    n.value = e.value, n.selected = e.value === o.variableValue, l.appendChild(n)
                }), l.onchange = function() {
                    e.currApp(f).variable.setContent(o.variableName, this.value)
                }, u.appendChild(l)
            } else if (o.render === "l") {
                var c = t.createElement("input");
                c.style.width = a, c.type = "range", c.min = o.min || 0, c.max = o.max || 100, c.step = o.step || 1, c.value = o.variableValue, c.onchange = function() {
                    this.label ? (this.label.style.left = r(this) + "%", this.label.textContent = this.value) : this.title = this.value, e.currApp(f).variable.setContent(o.variableName, this.value)
                }, c.oninput = function() {
                    this.label ? (this.label.style.left = r(this) + "%", this.label.textContent = this.value) : this.title = this.value
                }, u.appendChild(c);
                if (o.rangelabel) {
                    var h = t.createElement("div", "labelwrap");
                    c.label = t.createElement("div", "rangelabel", o.variableValue), c.label.style.left = r(c) + "%", h.appendChild(c.label), u.appendChild(h)
                } else c.title = o.variableValue
            } else {
                var p = t.createElement("input", i(o.style, "input"));
                p.style.width = a, p.type = "text", p.value = o.variableValue, p.onchange = function() {
                    e.currApp(f).variable.setContent(o.variableName, this.value)
                }, u.appendChild(p)
            }
            t.setChild(n[0], u)
        }
    }
});
