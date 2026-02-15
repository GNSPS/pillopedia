import type { Pill } from '$lib/types.js';

export function getOverallScore(pill: Pill): number {
	return Math.round((pill.power + pill.reaction_time + pill.agility + pill.coordination + pill.top_speed + pill.recovery) / 6);
}

export function getStatValues(pill: Pill): number[] {
	return [pill.power, pill.reaction_time, pill.agility, pill.coordination, pill.top_speed, pill.recovery];
}
