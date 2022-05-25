import { Observable } from "rxjs"
import { map, withLatestFrom } from "rxjs/operators"

export default sheetProps$ => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with sheetProps */
				withLatestFrom(sheetProps$),
				/** map to new props */
				map(([objectsToMove, sheetProps]) => {
					return {
						...sheetProps,
						/** map all cells */
						cells: sheetProps.cells.map(cell => {
							/** find object to move */
							const objectToMove = objectsToMove.find(({ id }) => id === cell.name)
							/** if found, calculate new x and y bounds from delta */
							if (objectToMove) {
								const { delta, toggleMode, gridRows, gridColumns } = objectToMove
								if (toggleMode === "pixel") {
									return {
										...cell,
										bounds: {
											...cell.bounds,
											...(delta.x ? { x: cell.bounds.x + delta.x } : {}),
											...(delta.y ? { y: cell.bounds.y + delta.y } : {}),
										},
										/** remove col and row properties to remove grid snapping */
										col: undefined,
										row: undefined,
										colspan: undefined,
										rowspan: undefined,
									}
								} else {
									let col,
										row,
										colspan,
										rowspan,
										x = cell.bounds.x,
										y = cell.bounds.y,
										width = cell.bounds.width,
										height = cell.bounds.height
									if (delta.x) {
										col = Math.round(((cell.bounds.x + delta.x) / 100) * gridColumns)
										x = (col / gridColumns) * 100
										colspan = Math.round((width / 100) * gridColumns)
										width = (colspan / gridColumns) * 100
									}
									if (delta.y) {
										row = Math.round(((cell.bounds.y + delta.y) / 100) * gridRows)
										y = (row / gridRows) * 100
										rowspan = Math.round((height / 100) * gridRows)
										height = (rowspan / gridRows) * 100
									}
									return {
										...cell,
										bounds: { ...cell.bounds, x, y, width, height },
										col,
										row,
										colspan,
										rowspan,
									}
								}
							}
							// else, return cell as is
							else return cell
						}),
					}
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
