import type { Enum, EnumValue } from '../../submodules/MadCakeUtil-ts/mod';

type Corridor = ('d' | 'r' | 'u' | 'd')[];
type SeedCorridor = ['d', ...('d' | 'r')[]];

const Moves: Enum = {
	DOWN: 0,
	LEFT: 1,
	UP: 2,
	RIGHT: 3,
};

const corridors: EnumValue<typeof Moves>[][] = [
	[Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.DOWN],
	[Moves.DOWN, Moves.DOWN, Moves.RIGHT],
	[Moves.DOWN, Moves.RIGHT, Moves.DOWN],
];

const mirror: Record<keyof typeof Moves, number | undefined> = {
	[Moves.LEFT]: Moves.RIGHT,
	[Moves.RIGHT]: Moves.LEFT,
};

const spinner = {
	[Moves.DOWN]: Moves.LEFT,
	[Moves.LEFT]: Moves.UP,
	[Moves.UP]: Moves.RIGHT,
	[Moves.RIGHT]: Moves.DOWN,
};

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
