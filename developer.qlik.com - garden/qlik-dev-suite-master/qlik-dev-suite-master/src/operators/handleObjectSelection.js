import { Observable } from "rxjs"
import { map, withLatestFrom, tap } from "rxjs/operators"
import { actions } from "../util"

export default (objects$, selectObject, clearSelectedObjects) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** get clicked target and shiftkey */
				map(({ target, shiftKey }) => ({ target, shiftKey })),
				/** with all objects */
				withLatestFrom(objects$),
				tap(([{ target, shiftKey }, sheetObjects]) => {
					/** check if target is a sheet object */
					const clickedObject = sheetObjects.find(({ el, type }) => el.contains(target) && type !== "dev-suite")
					/** if object clicked select object */
					if (clickedObject)
						selectObject({ type: actions.SELECT_OBJECT, payload: { id: clickedObject.id, shiftMode: shiftKey } })
					/** else, clear objects if not in shiftMode */ else if (shiftKey === false)
						clearSelectedObjects({ type: actions.CLEAR_SELECTED_OBJECTS })
				})
			)
			.subscribe({
				next() {
					observer.next("updated")
				},
				error(err) {
					observer.error(err)
				},
				complete() {
					observer.complete()
				},
			})
	)
