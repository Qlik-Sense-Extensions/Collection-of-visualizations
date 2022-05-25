import { Observable, from } from "rxjs"
import { switchMap, withLatestFrom } from "rxjs/operators"

export default obj$ => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with object handle */
				withLatestFrom(obj$),
				/** set properties */
				switchMap(([props, obj]) => from(obj.setProperties(props)))
			)
			.subscribe({
				next(status) {
					observer.next(status)
				},
				error(err) {
					observer.error(err)
				},
				complete() {
					observer.complete()
				},
			})
	)
