import { selectAll } from "d3-selection"
import { Observable } from "rxjs"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"
import { actions } from "../util"

export default (
	isDragging$,
	sheetObjects$,
	dragDelta$,
	gridSize$,
	toggleMode$,
	sheetProps$,
	selectObject,
	clearSelectedObjects
) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** with isDragging and sheetObjects */
				withLatestFrom(isDragging$, sheetObjects$),
				/** stop if mouseup was not fired from a dragging event */
				filter(([_, isDragging]) => isDragging),
				/** add object to selected objects and remove shadow element */
				tap(([{ event, object }, _isDragging, sheetObjects]) => {
					/** get shift mode */
					const { shiftKey } = event
					/** find object being dragged */
					const clickedObject = sheetObjects.find(({ id }) => object.id === id)
					/** if found, select object */
					if (clickedObject)
						selectObject({ type: actions.SELECT_OBJECT, payload: { id: clickedObject.id, shiftMode: shiftKey } })
					/** else, clear selected objects */ else if (shiftKey === false)
						clearSelectedObjects({ type: actions.CLEAR_SELECTED_OBJECTS })

					/** remove shadow element */
					selectAll(".dev-suite__shadow-element").remove()
				}),
				/** set isDragging$ to false */
				tap(() => isDragging$.next(false)),
				/** with dragDelta and gridSize */
				withLatestFrom(dragDelta$, gridSize$),
				/** map deltas as sheet percent */
				map(([_, { object, x, y }, { width: gridWidth, height: gridHeight, rows: gridRows, columns: gridColumns }]) => {
					/** calculate x and y delta positions as percent of sheet dimensions */
					const xDeltaAsAPercent = (x / gridWidth) * 100
					const yDeltaAsAPercent = (y / gridHeight) * 100
					return { object, xDeltaAsAPercent, yDeltaAsAPercent, gridWidth, gridHeight, gridRows, gridColumns }
				}),
				/** with sheetProps$ */
				withLatestFrom(sheetProps$, toggleMode$),
				/** create new prop object */
				map(
					([
						{ object, xDeltaAsAPercent, yDeltaAsAPercent, gridWidth, gridHeight, gridRows, gridColumns },
						sheetProps,
						toggleMode,
					]) => {
						/** map prop cells */
						const updateCells = sheetProps.cells.map(cell => {
							/** if cell is the object dragged */
							if (cell.name === object.id) {
								if (toggleMode === "pixel") {
									/** update bounds to new delta position */
									return {
										...cell,
										bounds: {
											...cell.bounds,
											x: cell.bounds.x + xDeltaAsAPercent,
											y: cell.bounds.y + yDeltaAsAPercent,
										},
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
										x,
										y,
										width = cell.bounds.width,
										height = cell.bounds.height

									col = Math.round(((cell.bounds.x + xDeltaAsAPercent) / 100) * gridColumns)
									x = (col / gridColumns) * 100
									colspan = Math.round((width / 100) * gridColumns)
									width = (colspan / gridColumns) * 100
									row = Math.round(((cell.bounds.y + yDeltaAsAPercent) / 100) * gridRows)
									y = (row / gridRows) * 100
									rowspan = Math.round((height / 100) * gridRows)
									height = (rowspan / gridRows) * 100

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
							// else return cell
							else return cell
						})

						/** find object that was just moved */
						const movedObjectIndex = updateCells.findIndex(cell => cell.name === object.id)
						const movedObject = updateCells[movedObjectIndex]
						/** place recently moved object at end of cells so it displays on top */
						const resortedCells = [
							...updateCells.slice(0, movedObjectIndex),
							...updateCells.slice(movedObjectIndex + 1),
							movedObject,
						]

						return { ...sheetProps, cells: resortedCells }
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
