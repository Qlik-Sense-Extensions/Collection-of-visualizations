import { from, Observable } from "rxjs"
import { map, switchMap } from "rxjs/operators"

export default () => source =>
	new Observable(observer =>
		source
			.pipe(
				map(([{ height: gridHeight }, sheetObj]) => {
					return {
						devSuiteBounds: {
							x: 20,
							y: -(50 / gridHeight) * 100,
							width: 80,
							height: (45 / gridHeight) * 100,
						},
						sheetObj,
					}
				}),
				switchMap(({ sheetObj, devSuiteBounds }) =>
					from(sheetObj.getFullPropertyTree().then(propertyTree => ({ propertyTree, sheetObj, devSuiteBounds })))
				),
				map(({ propertyTree, sheetObj, devSuiteBounds }) => {
					const devSuiteCell = propertyTree.qProperty.cells.find(cell => cell.type === "dev-suite")
					return {
						newProps: {
							...propertyTree,
							qProperty: {
								...propertyTree.qProperty,
								cells: [
									...propertyTree.qProperty.cells.filter(cell => cell.type !== "dev-suite"),
									{
										...devSuiteCell,
										col: undefined,
										row: undefined,
										colspan: undefined,
										rowspan: undefined,
										bounds: devSuiteBounds,
									},
								],
							},
						},
						sheetObj,
					}
				}),
				switchMap(({ sheetObj, newProps }) => from(sheetObj.setFullPropertyTree(newProps)))
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
