import { from, Observable } from "rxjs"
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators"

export default (sheetObj$, selectedObjects$) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** get sheet object */
				withLatestFrom(sheetObj$),
				/** get sheet full property tree */
				switchMap(([_, sheetObj]) =>
					from(sheetObj.getFullPropertyTree().then(propertyTree => ({ propertyTree, sheetObj })))
				),
				/** get all selected objects */
				withLatestFrom(selectedObjects$),
				/** stop if no objects are selected */
				filter(([_propertyTree, selectedObjects]) => selectedObjects.length > 0),
				/** map new properties */
				map(([{ propertyTree, sheetObj }, selectedObjects]) => ({
					sheetObj,
					newProps: {
						...propertyTree,
						qProperty: {
							...propertyTree.qProperty,
							cells: propertyTree.qProperty.cells.filter(cell => !selectedObjects.includes(cell.name)),
						},
						qChildren: propertyTree.qChildren.filter(qChild => !selectedObjects.includes(qChild.qProperty.qInfo.qId)),
					},
				})),
				/** set new properties */
				switchMap(({ newProps, sheetObj }) => sheetObj.setFullPropertyTree(newProps))
			)

			.subscribe({
				next() {
					observer.next("deleted")
				},
				error(err) {
					observer.error(err)
				},
				complete() {
					observer.complete()
				},
			})
	)
