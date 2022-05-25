import { from } from "rxjs"

export default app => {
	return from(
		app.createSessionObject({
			qInfo: { qType: "SheetList" },
			qAppObjectListDef: {
				qType: "sheet",
				qData: {
					title: "/qMetaDef/title",
					description: "/qMetaDef/description",
					thumbnail: "/thumbnail",
					cells: "/cells",
					rank: "/rank",
					columns: "/columns",
					rows: "/rows",
				},
			},
		})
	)
}
