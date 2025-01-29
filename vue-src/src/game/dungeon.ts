import type { Enum, EnumValue } from '../../submodules/MadCakeUtil-ts/mod';

const Moves: Enum = {
	DOWN: 0,
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
};

type Corridor = EnumValue<typeof Moves>[];

const corridorsSeed: Corridor[] = [
	[Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.RIGHT],
	[Moves.DOWN, Moves.RIGHT, Moves.DOWN],
];

type CorridorMap = Record<
	EnumValue<typeof Moves>,
	EnumValue<typeof Moves> | undefined
>;

const mirror: CorridorMap = {
	[Moves.LEFT]: Moves.RIGHT,
	[Moves.RIGHT]: Moves.LEFT,
};

const spinner: CorridorMap = {
	[Moves.DOWN]: Moves.LEFT,
	[Moves.LEFT]: Moves.UP,
	[Moves.UP]: Moves.RIGHT,
	[Moves.RIGHT]: Moves.DOWN,
};

function mapCorridor(corridor: Corridor, map: CorridorMap): Corridor {
	return corridor.map((move) => map[move] ?? move);
}

// TODO: remove duplicates

function getValidCorridors(corridorsSeed: Corridor[]) {
	const allCorridors = corridorsSeed.slice();

	for (const corridor of corridorsSeed) {
		allCorridors.push(mapCorridor(corridor, mirror));
	}

	let lastSpin = allCorridors.slice();
	for (const _ in Array.from({ length: 5 })) {
		lastSpin = lastSpin.map((corridor) => mapCorridor(corridor, spinner));
		for (const corridor of lastSpin) {
			allCorridors.push(corridor);
		}
	}

	return allCorridors;
}

console.log(JSON.stringify(getValidCorridors(corridorsSeed)));

// ------- algorithm

/*
Make a full set of valid corridor shapes:
1. Take a seed array of corridors
2. Add mirrorer version
3. Add 3 spinned versions

Pick a room.
Pick random corridor direction.
Try placing a new room.
If successful, loop. If unsuccessful, keep trying different corridors.
If no valid corridors left, ban this room and pick another.
There will always be a possibility to spawn a new room, so stop when you have enough.
*/
