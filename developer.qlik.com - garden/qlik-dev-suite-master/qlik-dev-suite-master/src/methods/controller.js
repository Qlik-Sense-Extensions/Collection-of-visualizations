import { BehaviorSubject, combineLatest, from, fromEvent, merge, Subject } from "rxjs"
import { map, shareReplay, switchMap, takeUntil, withLatestFrom } from "rxjs/operators"
import {
	attachDragListeners,
	calculateDragDelta,
	calculateObjectShift,
	deleteSelectedObjects,
	getArrowKey,
	getCopyKey,
	getNewObjectPosition,
	getPasteKey,
	getSheetObjects,
	getSheetProps,
	handleObjectClasses,
	handleObjectDragStart,
	handleObjectSelection,
	inEditMode,
	moveDevSuite,
	pasteObjects,
	removeDevSuite,
	saveToLocalStorage,
	setProps,
	shiftObjects,
	syncDevSuite,
	updateShadowElement,
} from "../operators"
import { getAppSheets, getDeleteKeyPress, getSheetObj, objectResize, selectObjects } from "../util"

export default qlik => [
	"$scope",
	"$element",
	function($scope, $element) {
		$element
			.closest(".object-wrapper")
			.find(".qv-object-nav a.lui-icon--expand")
			.addClass("hidden")

		const removeDevSuite$ = new Subject()
		$element.find("button.remove-button").click(() => {
			removeDevSuite$.next()
		})

		const $modeSwitch = $element.find(".toolbar-row .mode-switch-container .switch")

		const backendApi = $scope.$parent.backendApi
		$modeSwitch.click(() => {
			backendApi
				.getProperties()
				.then(props => ({ ...props, mode: props.mode === "grid" ? "pixel" : "grid" }))
				.then(newProps => backendApi.setProperties(newProps))
		})

		const toggleMode$ = new Subject()
		const layout$ = new Subject()

		layout$.subscribe(layout => toggleMode$.next(layout.mode))

		toggleMode$.subscribe(mode => {
			if (mode === "grid") $modeSwitch.removeClass("checked")
			else $modeSwitch.addClass("checked")
		})

		/** destroy listener */
		const destroy$ = new Subject()

		/** get app */
		const app = $scope.ext.model.enigmaModel.app

		const appSheetInvalidation$ = new Subject()
		const appSheetsInvalidationFunction = function() {
			appSheetInvalidation$.next()
		}

		const appSheetsObj$ = getAppSheets(app).pipe(shareReplay(1))
		appSheetsObj$
			.pipe(
				switchMap(obj => from(obj.getLayout())),
				syncDevSuite(app),
				takeUntil(destroy$)
			)
			.subscribe()

		appSheetsObj$.pipe(takeUntil(destroy$)).subscribe(obj => {
			obj.Invalidated.bind(appSheetsInvalidationFunction)
		})

		merge(destroy$, removeDevSuite$)
			.pipe(withLatestFrom(appSheetsObj$))
			.subscribe(([_, obj]) => {
				obj.Invalidated.unbind(appSheetsInvalidationFunction)
			})

		appSheetInvalidation$
			.pipe(
				withLatestFrom(appSheetsObj$),
				switchMap(([_, obj]) => from(obj.getLayout())),
				syncDevSuite(app),
				takeUntil(destroy$)
			)
			.subscribe()

		/** sheet props listener */
		const retrieveNewSheetProps$ = new Subject().pipe(takeUntil(destroy$))
		/** edit mode listener */
		const inEditMode$ = new BehaviorSubject(qlik.navigation.getMode()).pipe(
			map(mode => mode === "edit"),
			takeUntil(destroy$)
		)

		removeDevSuite$
			.pipe(
				inEditMode(inEditMode$),
				removeDevSuite(appSheetsObj$, app)
			)
			.subscribe()

		/** sheet obj */
		const sheetObj$ = getSheetObj(app, qlik).pipe(takeUntil(destroy$))

		/** listen for sheet invalidations */
		const sheetInvalidation$ = new Subject()
		/** invalidation function */
		const invalidationFunction = function() {
			sheetInvalidation$.next()
		}
		/** with sheet obj */
		sheetObj$.subscribe(obj => {
			/** bind invalidation function on invalidations */
			obj.Invalidated.bind(invalidationFunction)
		})
		/** on destroy */
		destroy$.pipe(withLatestFrom(sheetObj$)).subscribe(([_, obj]) => {
			/** unbind invalidation function */
			obj.Invalidated.unbind(invalidationFunction)
		})

		/** sheet properties */
		const sheetProps$ = merge(retrieveNewSheetProps$, sheetInvalidation$, inEditMode$).pipe(
			/** check for edit mode */
			inEditMode(inEditMode$),
			getSheetProps(sheetObj$),
			/** stop when destroy */
			takeUntil(destroy$)
		)

		const gridDimensions$ = sheetProps$.pipe(map(({ rows, columns }) => ({ rows, columns })))

		/** grid size */
		const gridEl$ = new BehaviorSubject(document.querySelector("#grid"))

		const gridSize$ = combineLatest([gridEl$, gridDimensions$]).pipe(
			map(([el, { rows, columns }]) => {
				const { width, height } = el.getBoundingClientRect()
				return { width, height, rows, columns }
			}),
			map(({ width, height, rows, columns }) => ({ width: width - 4, height: height - 4, rows, columns })),
			takeUntil(destroy$),
			shareReplay(1)
		)

		$scope.viz = { retrieveNewSheetProps$, inEditMode$, gridEl$, layout$, destroy$ }

		combineLatest([gridSize$, sheetObj$])
			.pipe(
				inEditMode(inEditMode$),
				moveDevSuite(),
				takeUntil(destroy$)
			)
			.subscribe()

		/** get objects on sheet */
		const sheetObjects$ = sheetProps$.pipe(
			getSheetObjects(),
			shareReplay(1)
		)

		/** removing as there are issues with full-screen mode */
		// /** update object z-index */
		// sheetObjects$
		// 	.pipe(
		// 		inEditMode(inEditMode$),
		// 		takeUntil(destroy$)
		// 	)
		// 	.subscribe(objects => {
		// 		objects.forEach(({ el }, i) => {
		// 			el.style.zIndex = i + 1
		// 		})
		// 	})

		/** manage sheet selected objects */
		const { selectedObjects$, select: selectObject, clear: clearSelectedObjects } = selectObjects(destroy$)

		/** on document click */
		const documentClick$ = fromEvent(document, "click").pipe(
			/** check for edit mode */
			inEditMode(inEditMode$),
			/** stop on destroy */
			takeUntil(destroy$),
			shareReplay(1)
		)

		/** handle selected objects when click */
		documentClick$.pipe(handleObjectSelection(sheetObjects$, selectObject, clearSelectedObjects)).subscribe()

		/** handle object classes when selectedobjects updates */
		selectedObjects$
			.pipe(
				inEditMode(inEditMode$),
				handleObjectClasses(sheetObjects$),
				takeUntil(destroy$)
			)
			.subscribe()

		/** on keydown */
		const documentKeyDown$ = fromEvent(document, "keydown").pipe(
			/** check edit mode */
			inEditMode(inEditMode$),
			/** stop on destroy */
			takeUntil(destroy$),
			shareReplay(1)
		)

		/** arrow keypress */
		const positionShift$ = documentKeyDown$.pipe(
			getArrowKey(),
			calculateObjectShift(toggleMode$, gridSize$)
		)

		/** function to change position of objects by a delta value */
		const shiftObjects$ = new Subject().pipe(takeUntil(destroy$))

		/** on new position, get all selected objects and pass their position shift to shiftObjects$ */
		positionShift$
			.pipe(
				inEditMode(inEditMode$),
				withLatestFrom(selectedObjects$),
				takeUntil(destroy$)
			)
			.subscribe(([{ direction, shift, ...shiftProps }, selectedObjects]) => {
				shiftObjects$.next(selectedObjects.map(id => ({ id, delta: { [direction]: shift }, ...shiftProps })))
			})

		/** on shiftObjects */
		shiftObjects$
			.pipe(
				/** check edit mode */
				inEditMode(inEditMode$),
				shiftObjects(sheetProps$),
				setProps(sheetObj$),
				takeUntil(destroy$)
			)
			.subscribe()

		/** get delete key press for deleting objects */
		const deleteKeyPress$ = getDeleteKeyPress(selectedObjects$, destroy$, inEditMode$)

		/** on deleteKeyPress, delete selected objects */
		deleteKeyPress$
			.pipe(
				inEditMode(inEditMode$),
				deleteSelectedObjects(sheetObj$, selectedObjects$),
				takeUntil(destroy$)
			)
			.subscribe()

		/** object dragging listeners */
		const objectDragStart$ = new Subject().pipe(takeUntil(destroy$))
		const objectDragging$ = new Subject().pipe(takeUntil(destroy$))
		const objectDragEnd$ = new Subject().pipe(takeUntil(destroy$))
		const isDragging$ = new Subject().pipe(takeUntil(destroy$))

		/** on sheetObjects$ */
		sheetObjects$
			.pipe(
				/** check edit mode */
				inEditMode(inEditMode$),
				attachDragListeners(objectDragStart$, objectDragging$, objectDragEnd$, toggleMode$, gridSize$, sheetProps$),
				takeUntil(destroy$)
			)
			.subscribe()

		/** on objectDragStart$ */
		objectDragStart$
			.pipe(
				/** check edit mode */
				inEditMode(inEditMode$),
				handleObjectDragStart(sheetProps$, objectDragging$, isDragging$, toggleMode$)
			)
			.subscribe()

		/** on objectDragging$, calculate delta */
		const dragDelta$ = objectDragging$.pipe(
			/** check edit mode */
			inEditMode(inEditMode$),
			calculateDragDelta(objectDragStart$, toggleMode$, gridSize$),
			shareReplay(1)
		)

		/** on dragDelta$ change */
		dragDelta$
			.pipe(
				/** check edit mode */
				inEditMode(inEditMode$),
				updateShadowElement(),
				takeUntil(destroy$)
			)
			.subscribe()

		/** on objectDragEnd */
		objectDragEnd$
			.pipe(
				/** check edit mode */
				inEditMode(inEditMode$),
				getNewObjectPosition(
					isDragging$,
					sheetObjects$,
					dragDelta$,
					gridSize$,
					toggleMode$,
					sheetProps$,
					selectObject,
					clearSelectedObjects
				),
				setProps(sheetObj$),
				takeUntil(destroy$)
			)
			.subscribe()

		objectResize(sheetObj$, sheetObjects$, gridSize$, sheetProps$, toggleMode$, inEditMode$, destroy$)

		documentKeyDown$
			.pipe(
				inEditMode(inEditMode$),
				getCopyKey(),
				saveToLocalStorage(sheetObj$, selectedObjects$),
				takeUntil(destroy$)
			)
			.subscribe()

		documentKeyDown$
			.pipe(
				inEditMode(inEditMode$),
				getPasteKey(),
				pasteObjects(app, sheetObj$),
				takeUntil(destroy$)
			)
			.subscribe()
	},
]
