import { event, select, selectAll } from "d3-selection"
import { Subject } from "rxjs"
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from "rxjs/operators"
import { inEditMode, setProps } from "../operators"

const resizePositions = ["top", "right", "bottom", "left", "top-left", "top-right", "bottom-right", "bottom-left"]

export default (sheetObj$, sheetObjects$, gridSize$, sheetProps$, toggleMode$, inEditMode$, destroy$) => {
	const objectResizeDragStart$ = new Subject().pipe(takeUntil(destroy$))
	const objectResizeDragging$ = new Subject().pipe(takeUntil(destroy$))
	const objectResizeDragEnd$ = new Subject().pipe(takeUntil(destroy$))
	const isResizing$ = new Subject().pipe(takeUntil(destroy$))

	sheetObjects$
		.pipe(
			inEditMode(inEditMode$),
			withLatestFrom(sheetProps$, gridSize$, toggleMode$),
			tap(
				([
					objects,
					sheetProps,
					{ width: gridWidth, height: gridHeight, columns: gridColumns, rows: gridRows },
					toggleMode,
				]) => {
					objects.forEach(object => {
						const objectEl = select(object.el)
						const resizeSelection = objectEl
							.selectAll("div.resize-accessor")
							.data(resizePositions.map(d => ({ position: d, gridWidth, gridHeight, gridColumns, gridRows })))
						resizeSelection
							.enter()
							.append("div")
							.attr("class", d => `resize-accessor resize-${d.position}`)
							.merge(resizeSelection)
							.on("mousedown.drag", d => {
								const objBounds = sheetProps.cells.find(cell => cell.name === object.id).bounds
								let xShift = 0,
									yShift = 0,
									width = objBounds.width,
									height = objBounds.height

								if (toggleMode === "grid") {
									const col = Math.round((objBounds.x / 100) * gridColumns)
									const colXPos = (col / gridColumns) * gridWidth
									const currXPos = (objBounds.x / 100) * gridWidth
									xShift = colXPos - currXPos
									const colspan = Math.round((width / 100) * gridColumns)
									width = (colspan / gridColumns) * gridWidth

									const row = Math.round((objBounds.y / 100) * gridRows)
									const rowYPos = (row / gridRows) * gridHeight
									const currYPos = (objBounds.y / 100) * gridHeight
									yShift = rowYPos - currYPos
									const rowspan = Math.round((height / 100) * gridRows)
									height = (rowspan / gridRows) * gridHeight
								}

								const { x, y, width: objWidth, height: objHeight } = object.el.getBoundingClientRect()
								objectResizeDragStart$.next({
									position: d.position,
									startObjectX: x + xShift,
									startObjectY: y + yShift,
									startObjectWidth: toggleMode === "pixel" ? objWidth : width,
									startObjectHeight: toggleMode === "pixel" ? objHeight : height,
									startClientX: event.clientX,
									startClientY: event.clientY,
								})

								select(event.view)
									.on(
										"mousemove.drag",
										() => {
											event.preventDefault()
											event.stopImmediatePropagation()
											if (object.type !== "dev-suite") {
												objectResizeDragging$.next({
													position: d.position,
													object,
													clientX: event.clientX,
													clientY: event.clientY,
												})
											}
										},
										true
									)
									.on(
										"mouseup.drag",
										() => {
											objectResizeDragEnd$.next({ startObjectX: x, startObjectY: y, event, object })
											select(event.view).on("mousemove.drag mouseup.drag", null)
										},
										true
									)
							})

						resizeSelection.exit().remove()
					})
				}
			)
		)
		.subscribe()

	objectResizeDragStart$
		.pipe(
			inEditMode(inEditMode$),
			switchMap(({ startObjectX, startObjectY, startObjectWidth, startObjectHeight }) =>
				objectResizeDragging$.pipe(
					tap(() => isResizing$.next(true)),
					tap(() => {
						select("body")
							.append("div")
							.attr("class", "dev-suite__shadow-element")
							.style("width", `${startObjectWidth}px`)
							.style("height", `${startObjectHeight}px`)
							.style("left", `${startObjectX}px`)
							.style("top", `${startObjectY}px`)
					}),
					take(1)
				)
			)
		)
		.subscribe()

	const resizeDelta$ = objectResizeDragging$.pipe(
		inEditMode(inEditMode$),
		withLatestFrom(objectResizeDragStart$, toggleMode$, gridSize$),
		map(
			([
				{ object, clientX, clientY },
				{ position, startObjectX, startObjectY, startObjectWidth, startObjectHeight, startClientX, startClientY },
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
					x: ["left", "top-left", "bottom-left"].includes(position) ? startObjectX + deltaX : startObjectX,
					y: ["top", "top-left", "top-right"].includes(position) ? startObjectY + deltaY : startObjectY,
					width: ["right", "top-right", "bottom-right"].includes(position)
						? startObjectWidth + deltaX
						: ["left", "top-left", "bottom-left"].includes(position)
						? startObjectWidth - deltaX
						: startObjectWidth,
					height: ["bottom", "bottom-left", "bottom-right"].includes(position)
						? startObjectHeight + deltaY
						: ["top", "top-left", "top-right"].includes(position)
						? startObjectHeight - deltaY
						: startObjectHeight,
					object,
					deltaX: ["left", "top-left", "bottom-left"].includes(position) ? deltaX : 0,
					deltaY: ["top", "top-left", "top-right"].includes(position) ? deltaY : 0,
					deltaWidth: ["right", "top-right", "bottom-right"].includes(position)
						? deltaX
						: ["left", "top-left", "bottom-left"].includes(position)
						? -deltaX
						: 0,
					deltaHeight: ["bottom", "bottom-left", "bottom-right"].includes(position)
						? deltaY
						: ["top", "top-left", "top-right"].includes(position)
						? -deltaY
						: 0,
				}
			}
		)
	)

	resizeDelta$
		.pipe(
			inEditMode(inEditMode$),
			tap(({ x, y, width, height }) => {
				select(".dev-suite__shadow-element")
					.style("top", `${y}px`)
					.style("left", `${x}px`)
					.style("width", `${width}px`)
					.style("height", `${height}px`)
			})
		)
		.subscribe()

	objectResizeDragEnd$
		.pipe(
			inEditMode(inEditMode$),
			withLatestFrom(isResizing$, sheetObjects$),
			filter(([_, isResizing]) => isResizing),
			tap(([{ event, object }, _isResizing, sheetObjects]) => {
				selectAll(".dev-suite__shadow-element").remove()
			}),
			tap(() => isResizing$.next(false)),
			withLatestFrom(resizeDelta$, gridSize$),
			map(
				([
					_,
					{ object, deltaX, deltaY, deltaWidth, deltaHeight },
					{ width: gridWidth, height: gridHeight, rows: gridRows, columns: gridColumns },
				]) => {
					const deltaXAsAPercent = (deltaX / gridWidth) * 100
					const deltaYAsAPercent = (deltaY / gridHeight) * 100
					const deltaWidthAsAPercent = (deltaWidth / gridWidth) * 100
					const deltaHeightAsAPercent = (deltaHeight / gridHeight) * 100
					return {
						object,
						deltaXAsAPercent,
						deltaYAsAPercent,
						deltaWidthAsAPercent,
						deltaHeightAsAPercent,
						gridWidth,
						gridHeight,
						gridRows,
						gridColumns,
					}
				}
			),
			withLatestFrom(sheetProps$, toggleMode$),
			map(
				([
					{
						object,
						deltaXAsAPercent,
						deltaYAsAPercent,
						deltaWidthAsAPercent,
						deltaHeightAsAPercent,
						gridWidth,
						gridHeight,
						gridRows,
						gridColumns,
					},
					sheetProps,
					toggleMode,
				]) => {
					const updateCells = sheetProps.cells.map(cell => {
						if (cell.name === object.id) {
							if (toggleMode === "pixel") {
								return {
									...cell,
									bounds: {
										...cell.bounds,
										x: cell.bounds.x + deltaXAsAPercent,
										y: cell.bounds.y + deltaYAsAPercent,
										width: cell.bounds.width + deltaWidthAsAPercent,
										height: cell.bounds.height + deltaHeightAsAPercent,
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

								col = Math.round(((cell.bounds.x + deltaXAsAPercent) / 100) * gridColumns)
								x = (col / gridColumns) * 100
								colspan = Math.round(((width + deltaWidthAsAPercent) / 100) * gridColumns)
								width = (colspan / gridColumns) * 100

								row = Math.round(((cell.bounds.y + deltaYAsAPercent) / 100) * gridRows)
								y = (row / gridRows) * 100
								rowspan = Math.round(((height + deltaHeightAsAPercent) / 100) * gridRows)
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
						} else return cell
					})
					return { ...sheetProps, cells: updateCells }
				}
			),
			setProps(sheetObj$)
		)
		.subscribe()
}
