import { addAlias } from 'module-alias'
import { resolve } from 'path'

addAlias('@src', resolve('dist/src'))
addAlias('@tests', resolve('dist/tests'))
