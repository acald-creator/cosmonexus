import { createRxDatabase, addRxPlugin, type RxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import {
	novelSchema, chapterSchema, progressSchema, authorSchema,
	type NovelCollection, type ChapterCollection, type ProgressCollection, type AuthorCollection,
} from './schemas'
import { migrateFromLocalStorage } from './migrate-localstorage'

export type AppCollections = {
	novels: NovelCollection
	chapters: ChapterCollection
	progress: ProgressCollection
	authors: AuthorCollection
}

export type AppDatabase = RxDatabase<AppCollections>

let dbPromise: Promise<AppDatabase> | null = null

export async function getDatabase(): Promise<AppDatabase> {
	if (typeof window === 'undefined') {
		throw new Error('[data] RxDB cannot be initialized outside the browser.')
	}
	if (!dbPromise) {
		dbPromise = initDatabase()
	}
	return dbPromise
}

async function initDatabase(): Promise<AppDatabase> {
	addRxPlugin(RxDBDevModePlugin)
	addRxPlugin(RxDBMigrationSchemaPlugin)

	const db = await createRxDatabase<AppCollections>({
		name: 'cosmonexus-novel',
		storage: wrappedValidateAjvStorage({ storage: getRxStorageDexie() }),
		multiInstance: true,
		eventReduce: true,
	})

	await db.addCollections({
		novels: { schema: novelSchema, migrationStrategies: {} },
		chapters: { schema: chapterSchema, migrationStrategies: {} },
		progress: { schema: progressSchema, migrationStrategies: {} },
		authors: { schema: authorSchema, migrationStrategies: {} },
	})

	await migrateFromLocalStorage(db)

	return db
}
