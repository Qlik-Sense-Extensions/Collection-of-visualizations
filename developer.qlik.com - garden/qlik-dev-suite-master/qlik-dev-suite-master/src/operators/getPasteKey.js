import { Observable } from "rxjs"
import { filter } from "rxjs/operators"

export default () => source =>
	new Observable(observer =>
		source
			.pipe(
				/** filter if not command + v */
				filter(evt => evt.keyCode === 86 && evt.metaKey)
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
