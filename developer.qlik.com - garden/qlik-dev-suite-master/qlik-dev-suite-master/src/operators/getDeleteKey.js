import { Observable } from "rxjs"
import { filter } from "rxjs/operators"

export default () => source =>
	new Observable(observer =>
		source
			.pipe(
				/** filter if not delete key */
				filter(evt => evt.keyCode === 8)
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
