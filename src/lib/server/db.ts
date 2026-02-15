import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import path from 'path';
import fs from 'fs';
import type { Pill } from '$lib/types.js';

const DB_PATH = env.DATABASE_PATH || path.join(process.cwd(), 'data', 'pillopedia.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create table
db.exec(`
	CREATE TABLE IF NOT EXISTS pills (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		image_url TEXT NOT NULL DEFAULT '',
		power INTEGER NOT NULL CHECK(power >= 0 AND power <= 100),
		reaction_time INTEGER NOT NULL CHECK(reaction_time >= 0 AND reaction_time <= 100),
		agility INTEGER NOT NULL CHECK(agility >= 0 AND agility <= 100),
		coordination INTEGER NOT NULL CHECK(coordination >= 0 AND coordination <= 100),
		top_speed INTEGER NOT NULL CHECK(top_speed >= 0 AND top_speed <= 100),
		recovery INTEGER NOT NULL CHECK(recovery >= 0 AND recovery <= 100),
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);

// Seed data (only if empty)
const count = db.prepare('SELECT COUNT(*) as count FROM pills').get() as { count: number };
if (count.count === 0) {
	const insert = db.prepare(`
		INSERT INTO pills (name, image_url, power, reaction_time, agility, coordination, top_speed, recovery)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`);
	insert.run('Orange Tesla', '', 97, 32, 78, 44, 89, 95);
	insert.run('Purple Maserati', '', 95, 88, 72, 40, 96, 90);
}

export default db;
export type { Pill };
