import {
	formatSchematicSummary,
	inspectSchematicFile
} from '../building/schematicInspection.js'

const main = async () => {
	const paths = process.argv.slice(2)

	if (paths.length === 0) {
		console.error(
			'Usage: npm run inspect-schematic -- <path-to-file.schem> [more-files...]'
		)
		process.exitCode = 1
		return
	}

	for (let index = 0; index < paths.length; index += 1) {
		const filePath = paths[index]!
		const summary = await inspectSchematicFile(filePath)
		if (index > 0) {
			console.log('')
		}
		console.log(formatSchematicSummary(summary))
	}
}

main().catch(error => {
	console.error(
		error instanceof Error ? error.message : 'Unknown schematic inspection error'
	)
	process.exitCode = 1
})
