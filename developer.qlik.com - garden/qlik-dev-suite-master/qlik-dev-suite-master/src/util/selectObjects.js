import { merge, Subject } from "rxjs"
import { scan, shareReplay, startWith, takeUntil } from "rxjs/operators"
import * as actions from "./actions"

export default destroy$ => {
	/** select object listener */
	const select$ = new Subject()
	/** clear objects listener */
	const clear$ = new Subject()

	/** selected objects state. fire on select$ or clear$ stream */
	const selectedObjects$ = merge(select$, clear$).pipe(
		scan((acc, { type, payload }) => {
			/** CLEAR_SELECTED_OBJECTS */
			switch (type) {
				case actions.CLEAR_SELECTED_OBJECTS:
					/** return empty array */
					return []

				/** SELECT_OBJECT */
				case actions.SELECT_OBJECT:
					/** get payload */
					const { id, shiftMode } = payload
					// if shiftMode..
					if (shiftMode) {
						// if object already selected..
						if (acc.includes(id)) {
							// remove from state
							const objectIndex = acc.indexOf(id)
							return [...acc.slice(0, objectIndex), ...acc.slice(objectIndex + 1)]
						}
						// else, add to state
						else return [...acc, id]
					}
					// else return clicked object as only selection
					else return [id]

				default:
					return acc
			}
		}, []),
		startWith([]),
		/** stop on destroy */
		takeUntil(destroy$),
		shareReplay(1)
	)

	/** select function */
	const select = id => select$.next(id)
	/** clear function */
	const clear = id => clear$.next(id)

	return { selectedObjects$, select, clear }
}
