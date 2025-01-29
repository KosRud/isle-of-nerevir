import type { Enum, EnumValue } from '../../submodules/MadCakeUtil-ts/mod';

const Moves: Enum = {
	DOWN: 0,
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
};

type MoveValue = EnumValue<typeof Moves>;
type Corridor = MoveValue[];

const corridorsSeed: Corridor[] = [
	[Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.RIGHT],
	[Moves.DOWN, Moves.RIGHT, Moves.DOWN],
];

type CorridorMap = Record<MoveValue, MoveValue | undefined>;

const moveMaps = {
	mirror: {
		[Moves.LEFT]: Moves.RIGHT,
		[Moves.RIGHT]: Moves.LEFT,
	},

	spin: {
		[Moves.DOWN]: Moves.LEFT,
		[Moves.LEFT]: Moves.UP,
		[Moves.UP]: Moves.RIGHT,
		[Moves.RIGHT]: Moves.DOWN,
	},
} as const;

type CorridorMapFunc = (corridor: Corridor) => Corridor;

function corridorMapper(map: CorridorMap): CorridorMapFunc {
	return (corridor: Corridor) => corridor.map((move) => map[move] ?? move);
}

type CorridorMappers = { [key in keyof typeof moveMaps]: CorridorMapFunc };

const mappers: CorridorMappers = Object.fromEntries(
	Object.entries(moveMaps).map(([name, map]) => [name, corridorMapper(map)])
) as CorridorMappers;

// TODO: remove duplicates

function getValidCorridors(corridorsSeed: Corridor[]) {
	const allCorridors = corridorsSeed.slice();

	allCorridors.splice(
		allCorridors.length,
		0,
		...corridorsSeed.map(mappers.mirror)
	);

	let lastSpin = allCorridors.slice();
	for (const _ in Array.from({ length: 5 })) {
		lastSpin = lastSpin.map(mappers.spin);
		allCorridors.splice(allCorridors.length, 0, ...lastSpin);
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
