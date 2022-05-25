import { select } from "d3-selection"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

export default () => source =>
	new Observable(observer =>
		source
			.pipe(
				/** move shadow element */
				tap(({ x, y, startObjectX, startObjectY }) => {
					select(".dev-suite__shadow-element")
						.style("left", `${startObjectX + x}px`)
						.style("top", `${startObjectY + y}px`)
				})
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
