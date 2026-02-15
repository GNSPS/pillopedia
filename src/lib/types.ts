export interface Pill {
	id: number;
	name: string;
	image_url: string;
	power: number;
	reaction_time: number;
	agility: number;
	coordination: number;
	top_speed: number;
	recovery: number;
	created_at: string;
}

export type StatKey = 'power' | 'reaction_time' | 'agility' | 'coordination' | 'top_speed' | 'recovery';
export const STAT_KEYS: StatKey[] = ['power', 'reaction_time', 'agility', 'coordination', 'top_speed', 'recovery'];
