import { Observable } from "rxjs"
import { filter, pluck, withLatestFrom } from "rxjs/operators"

export default inEditMode$ => source =>
	new Observable(observer =>
		source
			.pipe(
				/** get edit mode */
				withLatestFrom(inEditMode$),
				/** stop if not in edit mode */
				filter(([_, inEditMode]) => inEditMode),
				/** get main prop */
				pluck(0)
			)
			.subscribe({
				next(props) {
					observer.next(props)
				},
				error(err) {
					observer.error(err)
				},
				complete() {
					observer.complete()
				},
			})
	)
