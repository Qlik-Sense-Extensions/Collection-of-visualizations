import { Observable } from "rxjs"
import { map, withLatestFrom } from "rxjs/operators"

export default (objectDragStart$, toggleMode$, gridSize$) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with objectDragStart$ */
				withLatestFrom(objectDragStart$, toggleMode$, gridSize$),
				/** calculate delta positions */
				map(
					([
						{ object, clientX, clientY },
						{ startObjectX, startObjectY, startClientX, startClientY },
						toggleMode,
						{ width: gridWidth, height: gridHeight, rows: gridRows, columns: gridColumns },
					]) => {
						const mouseX = clientX - startClientX
						const mouseY = clientY - startClientY

						let deltaX = mouseX,
							deltaY = mouseY

						if (toggleMode === "grid") {
							const deltaCol = Math.round((mouseX / gridWidth) * gridColumns)
							deltaX = (deltaCol / gridColumns) * gridWidth
							const deltaRow = Math.round((mouseY / gridHeight) * gridRows)
							deltaY = (deltaRow / gridRows) * gridHeight
						}

						return {
							x: deltaX,
							y: deltaY,
							startObjectX,
							startObjectY,
							object,
						}
					}
				)
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
