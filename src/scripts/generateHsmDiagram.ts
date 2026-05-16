import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { buildHsmDrawioDiagram } from '@/hsm/utils/hsmDrawioDiagram.js'

const outputDirectory = resolve(process.cwd(), 'docs', 'diagrams')
const drawioOutputPath = resolve(outputDirectory, 'xstate-machine.drawio')

const main = async () => {
	const diagram = buildHsmDrawioDiagram()

	await mkdir(outputDirectory, { recursive: true })
	await writeFile(drawioOutputPath, diagram.xml, 'utf8')

	console.log(
		JSON.stringify(
			{
				path: drawioOutputPath,
				stateCount: diagram.statePaths.length,
				animatedEdgeCount: diagram.animatedEdgeIds.length
			},
			null,
			2
		)
	)
}

await main()
