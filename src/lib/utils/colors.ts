export const STAT_COLORS: Record<string, string> = {
	power: '#ff6b35',
	reaction_time: '#4ea8de',
	agility: '#84cc16',
	coordination: '#a855f7',
	top_speed: '#eab308',
	recovery: '#ef4444',
};

const NAME_COLOR_MAP: Record<string, string> = {
	red: '#ff3333',
	vermelho: '#ff3333',
	orange: '#ff8c00',
	laranja: '#ff8c00',
	yellow: '#ffd700',
	amarelo: '#ffd700',
	green: '#22cc44',
	verde: '#22cc44',
	blue: '#3388ff',
	azul: '#3388ff',
	purple: '#aa44ff',
	roxo: '#aa44ff',
	pink: '#ff66aa',
	rosa: '#ff66aa',
	white: '#eeeeff',
	branco: '#eeeeff',
	black: '#444444',
	preto: '#444444',
	gold: '#ffd700',
	dourado: '#ffd700',
	silver: '#c0c0c0',
	prata: '#c0c0c0',
	cyan: '#00cccc',
	ciano: '#00cccc',
	magenta: '#ff00ff',
};

export function getPillColor(name: string): string | null {
	const lower = name.toLowerCase();
	for (const [word, color] of Object.entries(NAME_COLOR_MAP)) {
		if (lower.includes(word)) return color;
	}
	return null;
}

export const STAT_LABELS: Record<string, string> = {
	power: 'Power',
	reaction_time: 'Reaction Time',
	agility: 'Agility',
	coordination: 'Coordination',
	top_speed: 'Top Speed',
	recovery: 'Recovery',
};
