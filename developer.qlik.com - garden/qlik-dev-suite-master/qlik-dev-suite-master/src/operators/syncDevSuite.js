import { from, Observable } from "rxjs"
import { concatMap, map, switchMap, tap, filter } from "rxjs/operators"
import { v4 as uuid4 } from "uuid"

const devSuiteQChild = {
	qChildren: [],
	qProperty: {
		showTitles: false,
		mode: "grid",
		title: "",
		subtitle: "",
		footnote: "",
		showDetails: false,
		qStateName: "",
		qInfo: { qType: "dev-suite", qId: "" },
		visualization: "dev-suite",
		qHyperCubeDef: { qDimensions: [], qMeasures: [], qInitialDataFetch: [] },
		extensionMeta: {
			translationKey: "",
			icon: "puzzle",
			iconChar: "puzzle",
			isLibraryItem: true,
			visible: true,
			name: "Dev Suite",
			description: "Dev Suite",
			template: "dev-suite",
			iconPath:
				"M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
			isThirdParty: true,
			type: "visualization",
			author: "John Bellizzi",
		},
	},
}

const devSuiteCell = {
	name: "",
	type: "dev-suite",
	col: undefined,
	row: undefined,
	colspan: undefined,
	rowspan: undefined,
	bounds: { y: -5.8050383351588195, x: 12.410656270305394, width: 87.36192332683562, height: 5.494706097115732 },
}

export default app => source =>
	new Observable(observer =>
		source
			.pipe(
				map(layout => layout.qAppObjectList.qItems),
				switchMap(sheets => from(sheets)),
				concatMap(sheet =>
					from(app.getObject(sheet.qInfo.qId)).pipe(
						switchMap(sheetObj =>
							from(sheetObj.getFullPropertyTree().then(propertyTree => ({ propertyTree, sheetObj })))
						),
						filter(
							({ propertyTree }) =>
								!propertyTree.qChildren.map(child => child.qProperty.qInfo.qType).includes("dev-suite")
						),
						map(({ propertyTree, sheetObj }) => {
							const objId = uuid4()
							return {
								newProps: {
									...propertyTree,
									qChildren: [
										...propertyTree.qChildren,
										{
											...devSuiteQChild,
											qProperty: {
												...devSuiteQChild.qProperty,
												qInfo: { ...devSuiteQChild.qProperty.qInfo, qId: objId },
											},
										},
									],
									qProperty: {
										...propertyTree.qProperty,
										cells: [...propertyTree.qProperty.cells, { ...devSuiteCell, name: objId }],
									},
								},
								sheetObj,
							}
						}),
						switchMap(({ sheetObj, newProps }) => sheetObj.setFullPropertyTree(newProps))
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
