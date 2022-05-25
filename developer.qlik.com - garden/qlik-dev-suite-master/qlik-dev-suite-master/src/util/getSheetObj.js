import { from } from "rxjs"
import { shareReplay } from "rxjs/operators"

export default (app, qlik) => {
	const currentSheetId = qlik.navigation.getCurrentSheetId().sheetId

	return from(app.getObject(currentSheetId)).pipe(shareReplay(1))
}
