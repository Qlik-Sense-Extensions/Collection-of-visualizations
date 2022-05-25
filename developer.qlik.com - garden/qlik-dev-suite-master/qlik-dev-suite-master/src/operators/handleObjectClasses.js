import { Observable } from "rxjs"
import { tap, withLatestFrom } from "rxjs/operators"

export default sheetObjects$ => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with sheet objects */
				withLatestFrom(sheetObjects$),
				tap(([selectedObjects, sheetObjects]) => {
					sheetObjects.forEach(({ id, el }) => {
						// if object is selected, add selected class
						if (selectedObjects.includes(id)) el.classList.add("dev-suite__selected")
						// else remove class
						else el.classList.remove("dev-suite__selected")
					})
				})
			)
			.subscribe({
				next() {
					observer.next()
				},
				error(err) {
					observer.error(err)
				},
				complete() {
					observer.complete()
				},
			})
	)
