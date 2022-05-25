export default function($element, layout) {
	// ..paint code here
	const viz = this.$scope.viz

	viz.layout$.next(layout)
	viz.retrieveNewSheetProps$.next()
}
