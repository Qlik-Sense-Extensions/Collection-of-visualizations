import { from, Observable } from "rxjs"
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators"
import { v4 as uuid4 } from "uuid"

export default (app, sheetObj$) => source =>
	new Observable(observer =>
		source
			.pipe(
				/** get clipboard contents from localStorage */
				map(() => JSON.parse(window.localStorage.getItem("dev-suite_clipboard"))),
				/** stop if clipboard doesn't have a sheetId & selected objects */
				filter(clipboard => clipboard.sheetId && clipboard.selectedObjects),
				/** stop if no selected objects */
				filter(clipboard => clipboard.selectedObjects.length > 0),
				/** get source sheet object */
				switchMap(clipboard => from(app.getObject(clipboard.sheetId).then(sheetObj => ({ sheetObj, clipboard })))),
				/** get property tree of source sheet */
				switchMap(({ sheetObj, clipboard }) =>
					from(sheetObj.getFullPropertyTree().then(propertyTree => ({ propertyTree, clipboard })))
				),
				/** create new qChildren and qCells that will be added */
				map(({ propertyTree, clipboard }) => {
					/** generate new uuid for each object being copied */
					const newObjIds = clipboard.selectedObjects.reduce((acc, val) => ({ ...acc, [val]: uuid4() }), {})
					/** find the source children to be copied and add new qId */
					const qChildrenToCopy = propertyTree.qChildren
						.filter(qChild => clipboard.selectedObjects.includes(qChild.qProperty.qInfo.qId))
						.map(qChild => ({
							...qChild,
							qProperty: {
								...qChild.qProperty,
								qInfo: { ...qChild.qProperty.qInfo, qId: newObjIds[qChild.qProperty.qInfo.qId] },
							},
						}))

					/** find the source cells to be copied and add new qId */
					const qCellsToCopy = propertyTree.qProperty.cells
						.filter(cell => clipboard.selectedObjects.includes(cell.name))
						.map(cell => ({ ...cell, name: newObjIds[cell.name] }))

					return { qChildrenToCopy, qCellsToCopy, clipboard }
				}),
				/** get current sheet obj */
				withLatestFrom(sheetObj$),
				/** get property tree of current sheet */
				switchMap(([props, sheetObj]) =>
					from(sheetObj.getFullPropertyTree().then(propertyTree => ({ sheetObj, propertyTree, ...props })))
				),
				/** add new qChildren and qCells to current sheet property tree */
				map(({ sheetObj, propertyTree, qChildrenToCopy, qCellsToCopy }) => {
					return {
						sheetObj,
						newProps: {
							...propertyTree,
							qChildren: [...propertyTree.qChildren, ...qChildrenToCopy],
							qProperty: { ...propertyTree.qProperty, cells: [...propertyTree.qProperty.cells, ...qCellsToCopy] },
						},
					}
				}),
				/** set sheet property tree */
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
