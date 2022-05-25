import { from, Observable } from "rxjs"
import { concatMap, map, mergeMap, take, withLatestFrom } from "rxjs/operators"

export default (appSheetsObj$, app) => source =>
	new Observable(observer =>
		source
			.pipe(
				withLatestFrom(appSheetsObj$),
				mergeMap(([_, appSheetsObj]) => from(appSheetsObj.getLayout())),
				map(layout =>
					layout.qAppObjectList.qItems.map(qItem => ({
						sheetId: qItem.qInfo.qId,
						objects: qItem.qData.cells.filter(cell => cell.type === "dev-suite").map(cell => cell.name),
					}))
				),
				mergeMap(sheets => from(sheets)),
				concatMap(sheet =>
					from(app.getObject(sheet.sheetId).then(obj => ({ sheetObj: obj, objects: sheet.objects }))).pipe(
						mergeMap(({ sheetObj, objects }) =>
							from(sheetObj.getFullPropertyTree().then(propertyTree => ({ propertyTree, sheetObj, objects })))
						),
						map(({ propertyTree, sheetObj, objects }) => {
							const newQChildren = propertyTree.qChildren.filter(
								qChild => !objects.includes(qChild.qProperty.qInfo.qId)
							)
							const newCells = propertyTree.qProperty.cells.filter(cell => !objects.includes(cell.name))

							return {
								sheetObj,
								newProps: {
									...propertyTree,
									qChildren: newQChildren,
									qProperty: { ...propertyTree.qProperty, cells: newCells },
								},
							}
						}),
						mergeMap(({ sheetObj, newProps }) => from(sheetObj.setFullPropertyTree(newProps))),
						take(1)
					)
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
