import { event, select } from "d3-selection"
import { Subject } from "rxjs"
import { takeUntil, tap } from "rxjs/operators"
import { inEditMode } from "../operators"

export default (selectedObjects$, destroy$, inEditMode$) => {
	/** create new subject listener */
	const deleteKeyPress$ = new Subject()

	/** on new selectedObjects$ */
	selectedObjects$
		.pipe(
			/** check if in edit mode */
			inEditMode(inEditMode$),
			tap(selectedObjects => {
				/** if there are selected objects */
				if (selectedObjects.length > 0) {
					/** attach a keydown listener to the document and block other actions from delete key */
					select(document).on(
						"keydown",
						function() {
							if (event.keyCode === 8) {
								event.preventDefault()
								event.stopImmediatePropagation()
								/** trigger deleteKeyPress for deleting objects */
								deleteKeyPress$.next(event)
							}
						},
						true
					)
				}
				// else, remove keydown listener from document
				else {
					select(document).on("keydown", null)
				}
			}),
			takeUntil(destroy$)
		)
		.subscribe()

	return deleteKeyPress$
}
