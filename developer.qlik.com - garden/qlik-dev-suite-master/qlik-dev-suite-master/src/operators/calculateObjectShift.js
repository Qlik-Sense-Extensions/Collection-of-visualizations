import { Observable } from "rxjs"
import { map, withLatestFrom } from "rxjs/operators"

export default (toggleMode$, gridSize$) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with grid size */
				withLatestFrom(toggleMode$, gridSize$),
				/** map to shift direction and amount */
				map(
					([
						{ key, shiftMode },
						toggleMode,
						{ width: gridWidth, height: gridHeight, rows: gridRows, columns: gridColumns },
					]) => {
						let shiftX, shiftY, shiftRows, shiftCols
						if (toggleMode === "pixel") {
							/** calculate width and height pixel change as a percentage of grid dimensions */
							shiftX = (1 / gridWidth) * 100 * (shiftMode ? 10 : 1)
							shiftY = (1 / gridHeight) * 100 * (shiftMode ? 10 : 1)
						} else {
							shiftRows = shiftMode ? 2 : 1
							shiftCols = shiftMode ? 2 : 1
							shiftX = (shiftCols / gridColumns) * 100
							shiftY = (shiftRows / gridRows) * 100
						}

						const baseObject = { toggleMode, gridRows, gridColumns }

						/** map to appropriate direction */
						switch (key) {
							case "left":
								return { direction: "x", shift: -shiftX, cells: -shiftCols, ...baseObject }
							case "up":
								return { direction: "y", shift: -shiftY, cells: -shiftRows, ...baseObject }
							case "right":
								return { direction: "x", shift: shiftX, cells: shiftCols, ...baseObject }
							case "down":
								return { direction: "y", shift: shiftY, cells: shiftRows, ...baseObject }
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
