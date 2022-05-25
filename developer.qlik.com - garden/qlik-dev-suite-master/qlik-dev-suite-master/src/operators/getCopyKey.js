import { Observable } from "rxjs"
import { filter } from "rxjs/operators"

export default () => source =>
	new Observable(observer =>
		source
			.pipe(
				/** filter if not command + c */
				filter(evt => evt.keyCode === 67 && evt.metaKey)
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
