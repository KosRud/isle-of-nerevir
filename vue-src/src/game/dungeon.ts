import type { Enum, EnumValue } from '../../submodules/MadCakeUtil-ts/mod';
import '../../submodules/MadCakeUtil-ts/augmentations.ts';

const Move: Enum = {
	DOWN: 0,
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
};

type MoveValue = EnumValue<typeof Move>;
type Corridor = MoveValue[];

const corridorsSeed: Corridor[] = [
	[Move.DOWN, Move.DOWN],
	[Move.DOWN, Move.DOWN, Move.DOWN],
	[Move.DOWN, Move.DOWN, Move.RIGHT],
	[Move.DOWN, Move.RIGHT, Move.DOWN],
];

type MoveMap = Record<MoveValue, MoveValue | undefined>;

const moveMaps = {
	mirror: {
		[Move.LEFT]: Move.RIGHT,
		[Move.RIGHT]: Move.LEFT,
	},

	spin: {
		[Move.DOWN]: Move.LEFT,
		[Move.LEFT]: Move.UP,
		[Move.UP]: Move.RIGHT,
		[Move.RIGHT]: Move.DOWN,
	},
} as const;

type CorridorMapFunc = (corridor: Corridor) => Corridor;

function corridorMapFunc(map: MoveMap): CorridorMapFunc {
	return (corridor: Corridor) => corridor.map((move) => map[move] ?? move);
}

type CorridorMapFuncCollection = {
	[key in keyof typeof moveMaps]: CorridorMapFunc;
};

const mapFuncs: CorridorMapFuncCollection = Object.fromEntries(
	Object.entries(moveMaps).map(([name, map]) => [name, corridorMapFunc(map)])
) as CorridorMapFuncCollection;

function uniqueCorridors(corridors: Corridor[]) {
	return corridors.uniqueByHash((corridor) =>
		corridor.map((move) => String(move)).join('')
	);
}

// TODO: remove duplicates

function getValidCorridors(corridorsSeed: Corridor[]) {
	let allCorridors = corridorsSeed.slice();

	allCorridors.splice(
		allCorridors.length,
		0,
		...corridorsSeed.map(mapFuncs.mirror)
	);
	allCorridors = uniqueCorridors(allCorridors);

	let lastSpin = allCorridors.slice();
	for (const _ in Array.from({ length: 5 })) {
		lastSpin = lastSpin.map(mapFuncs.spin);
		allCorridors.splice(allCorridors.length, 0, ...lastSpin);
	}
	allCorridors = uniqueCorridors(allCorridors);

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
Try placing a new room. (corridor and room itself do not overlap, no adjacent rooms)
If successful, loop. If unsuccessful, keep trying different corridors.
If no valid corridors left, ban this room and pick another.
There will always be a possibility to spawn a new room, so stop when you have enough.
*/
