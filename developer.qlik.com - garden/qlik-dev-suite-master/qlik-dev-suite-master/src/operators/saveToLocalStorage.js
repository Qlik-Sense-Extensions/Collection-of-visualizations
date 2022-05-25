import { Observable, from } from "rxjs"
import { tap, withLatestFrom, switchMap, map, delay } from "rxjs/operators"

export default (sheetObj$, selectedObjects$) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with sheet objects */
				withLatestFrom(sheetObj$),
				/** get current sheet id */
				switchMap(([_, sheetObj]) => from(sheetObj.getProperties().then(props => props.qInfo.qId))),
				/** get current selected objects */
				withLatestFrom(selectedObjects$),
				/** map to sheetId and selectedObjects */
				map(([sheetId, selectedObjects]) => ({ sheetId, selectedObjects })),
				delay(10),
				/** clear qlik clipboard and set dev-suite clipboard */
				tap(clipboard => {
					window.localStorage.setItem("QlikView-clipboard", "")
					window.localStorage.setItem("dev-suite_clipboard", JSON.stringify(clipboard))
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
