/*
NOTE: You will need to add and modify code in this file to complete this project.
I have defined a few functions and variables to help guide you but that doesn't mean no other variables or functions are necessary.
If you think you have a better / different way to do things, you are free to do so :)
*/

const monsterNames = [
  'Bigfoot',
  'Centaur',
  'Cerberus',
  'Chimera',
  'Ghost',
  'Goblin',
  'Golem',
  'Manticore',
  'Medusa',
  'Minotaur',
  'Ogre',
  'Vampire',
  'Wendigo',
  'Werewolf',
];

const RARITY_LIST = ['Common', 'Unusual', 'Rare', 'Epic'];
const items = [
  // Array of item objects. These will be used to clone new items with the appropriate properties.
  {
    name: 'Common bomb',
    type: 'bomb',
    value: 7,
    rarity: 0,
    use: '** function',
  },
  {
    name: 'Unusual bomb',
    type: 'bomb',
    value: 14,
    rarity: 1,
    use: '** function',
  },
  {
    name: 'Rare bomb',
    type: 'bomb',
    value: 28,
    rarity: 2,
    use: '** function',
  },
  {
    name: 'Rare bomb',
    type: 'bomb',
    value: 56,
    rarity: 3,
    use: '** function',
  },
  {
    name: 'Common potion',
    type: 'potion',
    value: 5,
    rarity: 0,
    use: '** function',
  },
  {
    name: 'Unusual potion',
    type: 'potion',
    value: 10,
    rarity: 1,
    use: '** function',
  },
  {
    name: 'Rare potion',
    type: 'potion',
    value: 20,
    rarity: 2,
    use: '** function',
  },
  {
    name: 'Rare potion',
    type: 'potion',
    value: 40,
    rarity: 3,
    use: '** function',
  },
  {
    name: 'Epic key',
    type: 'key',
    value: 150,
    rarity: 3,
    use: '** function',
  },
];
const GAME_STEPS = ['SETUP_PLAYER', 'SETUP_BOARD', 'GAME_START'];
let gameStep = 0; // The current game step, value is index of the GAME_STEPS array.
let board = []; // The board holds all the game entities. It is a 2D array.

function attackValue(character) {
  // function to pass the value of the attack property to the characters.
  if (character.type === 'player') {
    character.attack = character.level * 10;
  }
  if (character.type === 'monster') {
    character.attack = character.level * 10;
  }
}

function speedValue(character) {
  // function to pass the value of the speed property to the characters.
  if (character.type === 'player') {
    character.speed = 3000 / character.level;
  }
  if (character.type === 'monster') {
    character.speed = 6000 / character.level;
  }
}

let player = {
  // The player object
  name: undefined,
  level: 1,
  items: [],
  skills: [
    {
      name: 'confuse',
      requiredLevel: 1,
      cooldown: 10000,
      use: '** function',
    },
    {
      name: 'steal',
      requiredLevel: 3,
      cooldown: 25000,
      use: '** function',
    },
  ],
  attack: 0,
  speed: 0,
  hp: 0,
  gold: 0,
  xp: 0,
  type: 'player',
  position: {},
  getMaxHp: '** function',
  levelUp: '** function',
  getExpToLevel: '** function',
};

// Utility function to print messages with different colors. Usage: print('hello', 'red');
function print(arg, color) {
  if (typeof arg === 'object') console.log(arg);
  else console.log('%c' + arg, `color: ${color};`);
}

// Prints a blue string with the indicated number of dashes on each side of the string. Usage: printSectionTitle('hi', 1) // -hi-
// We set a default value for the count to be 20 (i.e. 20 dashes '-')
function printSectionTitle(title, count = 20) {
  print('-'.repeat(count) + title + '-'.repeat(count), 'blue');
}

// Returns a new object with the same keys and values as the input object
function clone(entity) {}

// returns true or false to indicate whether 2 different objects have the same keys and values
function assertEqual(obj1, obj2) {}

// Clones an array of objects
// returns a new array of cloned objects. Useful to clone an array of item objects
function cloneArray(objs) {}

// Uses a player item (note: this consumes the item, need to remove it after use)
// itemName is a string, target is an entity (i.e. monster, tradesman, player, dungeon)
// If target is not specified, item should be used on player for type 'potion'. Else, item should be used on the entity at the same position
// First item of matching type is used
function useItem(itemName, target) {}

// Uses a player skill (note: skill is not consumable, it's useable infinitely besides the cooldown wait time)
// skillName is a string. target is an entity (typically monster).
function useSkill(skillName, target) {}

// Sets the board variable to a 2D array of rows and columns
// First and last rows are walls
// First and last columns are walls
// All the other entities are grass entities
function createBoard(rows, columns) {
  if (rows < 8 || columns < 8) {
    print(
      'Your board is too small for an adventure! Rows and columns should have a length of at least 8. Please try again.',
      'blue'
    );
  } else {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        if (i === 0 || j === 0 || i === rows - 1 || j === columns - 1) {
          board[i][j] = {
            type: 'wall',
            position: { row: i, column: j },
          };
        } else {
          board[i][j] = {
            type: 'grass',
            position: { row: i, column: j },
          };
        }
      }
    }
  }
}

// Updates the board by setting the entity at the entity position
// An entity has a position property, each board cell is an object with an entity property holding a reference to the entity at that position
// When a player is on a board cell, the board cell keeps the current entity property (e.g. monster entity at that position) and may need to have an additional property to know the player is there too.
function updateBoard(entity) {}

// Sets the position property of the player object to be in the middle of the board
// You may need to use Math methods such as Math.floor()
function placePlayer() {
  player.position = {
    row: Math.floor(board.length / 2),
    column: Math.floor(board[0].length / 2),
  };
}

// Creates the board and places player
function initBoard(rows, columns) {
  createBoard(rows, columns);
  placePlayer();
  printBoard();
}

// Prints the board
function printBoard() {
  for (let i = 0; i < board.length; i++) {
    let boardTile = '';
    for (let j = 0; j < board[i].length; j++) {
      if (i === player.position.row && j === player.position.column) {
        boardTile += 'P';
      } else if (board[i][j].type === 'wall') {
        boardTile += '#';
      } else if (board[i][j].type === 'grass') {
        boardTile += '.';
      }
    }
    print(boardTile);
  }
}

// Sets the player variable to a player object based on the specifications of the README file
// The items property will need to be a new array of cloned item objects
// Prints a message showing player name and level (which will be 1 by default)
function createPlayer(name, level = 1, items = []) {
  player.name = name;
  player.level = level;
  player.items = items;
  attackValue(player);
  speedValue(player);
  print(
    'Welcome to the game ' + name + '! Your level is ' + level + '.',
    'blue'
  );
  if (player.items === [] || player.items === undefined) {
    print('You currently have no items', 'blue');
  } else {
    for (let i = 0; i < player.items.length; i++) {
      print('You have a ' + player.items[i].name, 'blue');
    }
  }
}

// Creates a monster object with a random name with the specified level, items and position
// The items property will need to be a new array of cloned item objects
// The entity properties (e.g. hp, attack, speed) must respect the rules defined in the README
function createMonster(level, items, position) {}

// Creates a tradesman object with the specified items and position. hp is Infinity
// The items property will need to be a new array of cloned item objects
function createTradesman(items, position) {}

// Creates an item entity by cloning one of the item objects and adding the position and type properties.
// item is a reference to one of the items in the items variable. It needs to be cloned before being assigned the position and type properties.
function createItem(item, position) {}

// Creates a dungeon entity at the specified position
// The other parameters are optional. You can have unlocked dungeons with no princess for loot, or just empty ones that use up a key for nothing.
function createDungeon(
  position,
  isLocked = true,
  hasPrincess = true,
  items = [],
  gold = 0
) {}

// Moves the player in the specified direction
// You will need to handle encounters with other entities e.g. fight with monster
function move(direction) {
  let newPosition;
  switch (direction) {
    case 'U':
      newPosition = {
        row: player.position.row - 1,
        column: player.position.column,
      };
      break;
    case 'R':
      newPosition = {
        row: player.position.row,
        column: player.position.column + 1,
      };
      break;
    case 'D':
      newPosition = {
        row: player.position.row + 1,
        column: player.position.column,
      };
      break;
    case 'L':
      newPosition = {
        row: player.position.row,
        column: player.position.column - 1,
      };
      break;
  }
  if (board[newPosition.row][newPosition.column].type !== 'wall') {
    player.position = newPosition;
  } else if (board[newPosition.row][newPosition.column].type === 'wall') {
    print('You hit a wall!', 'blue');
  }
  printBoard();
}

function setupPlayer() {
  printSectionTitle('SETUP PLAYER');
  print(
    "Please create a player using the createPlayer function. Usage: createPlayer('Bob')"
  );
  print(
    "You can optionally pass in a level and items, e.g. createPlayer('Bob', 3, [items[0], items[2]]). items[0] refers to the first item in the items variable"
  );
  print("Once you're done, go to the next step with next()");
}

function setupBoard() {
  printSectionTitle('SETUP BOARD');
  print('Please create a board using initBoard(rows, columns)');
  print(
    'Setup monsters, items and more using createMonster(attr), createItem(item, pos), createTradesman(items, pos), createDungeon(pos), updateBoard(entity)'
  );
  print("Once you're done, go to the next step with next()");
}

function startGame() {
  printSectionTitle('START GAME');
  print('Hello ' + player.name);
  print(
    "You are ready to start your adventure. Use move('U' | 'D' | 'L' | 'R') to get going."
  );
  printBoard();
}

function gameOver() {
  printSectionTitle('GAME OVER');
}

function next() {
  gameStep++;
  run();
}

function run() {
  switch (GAME_STEPS[gameStep]) {
    case 'SETUP_PLAYER':
      setupPlayer();
      break;
    case 'SETUP_BOARD':
      setupBoard();
      break;
    case 'GAME_START':
      startGame();
      break;
  }
}

print('Welcome to the game!', 'gold');
print('Follow the instructions to setup your game and start playing');

run();
