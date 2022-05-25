import { beforeDestroy, controller, definition, initialProperties, paint, resize, template } from "./methods"
import "./style.scss"

window.define(["qlik"], function(qlik) {
	return {
		initialProperties,
		template,
		definition,
		controller: controller(qlik),
		paint,
		resize: resize(qlik),
		beforeDestroy,
	}
})
