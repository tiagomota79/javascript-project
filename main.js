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
    use: function(target) {
      target.hp = Math.max((target.hp -= 25), 0);
    },
  },
  {
    name: 'Unusual bomb',
    type: 'bomb',
    value: 14,
    rarity: 1,
    use: function(target) {
      target.hp = Math.max((target.hp -= 50), 0);
    },
  },
  {
    name: 'Rare bomb',
    type: 'bomb',
    value: 28,
    rarity: 2,
    use: function(target) {
      target.hp = Math.max((target.hp -= 75), 0);
    },
  },
  {
    name: 'Epic bomb',
    type: 'bomb',
    value: 56,
    rarity: 3,
    use: function(target) {
      target.hp = 0;
    },
  },
  {
    name: 'Common potion',
    type: 'potion',
    value: 5,
    rarity: 0,
    use: function(target) {
      target.hp = Math.min(player.getMaxHp(), player.hp + 25);
    },
  },
  {
    name: 'Unusual potion',
    type: 'potion',
    value: 10,
    rarity: 1,
    use: function(target) {
      target.hp = Math.min(player.getMaxHp(), player.hp + 50);
    },
  },
  {
    name: 'Rare potion',
    type: 'potion',
    value: 20,
    rarity: 2,
    use: function(target) {
      target.hp = Math.min(player.getMaxHp(), player.hp + 75);
    },
  },
  {
    name: 'Epic potion',
    type: 'potion',
    value: 40,
    rarity: 3,
    use: function(target) {
      target.hp = player.getMaxHp();
    },
  },
  {
    name: 'Epic key',
    type: 'key',
    value: 150,
    rarity: 3,
  },
];
const GAME_STEPS = ['SETUP_PLAYER', 'SETUP_BOARD', 'GAME_START'];
let gameStep = 0; // The current game step, value is index of the GAME_STEPS array.
let board = []; // The board holds all the game entities. It is a 2D array.

function attackSpeedValue() {
  // function to pass the value of the attack and speed properties to the player.
  player.attack = player.level * 10;
  player.speed = 3000 / player.level;
}

function randomPosition() {
  // function to create a random position object.
  let position;
  while (
    !position ||
    (position.row === player.position.row &&
      position.column === player.position.column)
  ) {
    let minRow = 1;
    let maxRow = board.length - 2;
    let minColumn = 1;
    let maxColumn = board[0].length - 2;
    position = {
      row: Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow,
      column:
        Math.floor(Math.random() * (maxColumn - minColumn + 1)) + minColumn,
    };
  }
  return position;
}

function playerPosition() {
  return board[player.position.row][player.position.column];
}

let monsterNum; // Holder for the number of monsters to be automatically created, proportional to the board size.
let itemsNum; // Holder for the number of items to be automatically created, proportional to the board size.
let dungeonsNum; // Holder for the number of dungeons to be automatically created, proportional to the board size.

function autoEntities() {
  // function to automatically calculate the number of monsters, dungeons and items according to the board size. Minimum 2 of each entity by board.
  if (Math.ceil(board.length * board[0].length * 0.025) < 2) {
    monsterNum = 2;
  } else {
    monstersNum = Math.ceil(board.length * board[0].length * 0.025);
  }
  if (Math.ceil(board.length * board[0].length * 0.015) < 2) {
    itemsNum = 2;
  } else {
    itemsNum = Math.ceil(board.length * board[0].length * 0.015);
  }
  if (Math.ceil(board.length * board[0].length * 0.015) < 2) {
    dungeonsNum = 2;
  } else {
    dungeonsNum = Math.ceil(board.length * board[0].length * 0.015);
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
    },
    {
      name: 'steal',
      requiredLevel: 3,
      cooldown: 25000,
    },
  ],
  attack: 0,
  speed: 0,
  hp: 0,
  gold: 0,
  xp: 0,
  type: 'player',
  position: {},
  getMaxHp: function() {
    return player.level * 100;
  },
  levelUp: function() {
    if (player.xp >= player.getExpToLevel()) {
      player.level += 1;
      print(
        'You leveled up! You are now a level ' + player.level + ' character!',
        'blue'
      );
      attackSpeedValue();
      for (let i = 0; i < board.length; i++) {
        for (let l = 0; l < board[i].length; l++) {
          if (board[i][l].type === 'monster') {
            board[i][l].level = player.level;
          }
        }
      }
      for (let i = 0; i < board.length; i++) {
        for (let l = 0; l < board[i].length; l++) {
          if (board[i][l].type === 'keyMonster') {
            board[i][l].level += 1;
          }
        }
      }
      updateAttackSpeed();
    }
  },
  getExpToLevel: function() {
    return player.level * 20;
  },
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
function clone(entity) {
  let clone = {};
  for (let property in entity) {
    if (entity.hasOwnProperty(property)) {
      clone[property] = entity[property];
    }
  }
  return clone;
}

// returns true or false to indicate whether 2 different objects have the same keys and values
function assertEqual(obj1, obj2) {
  let obj1keys = Object.keys(obj1);
  let obj1values = Object.values(obj1);
  let obj2keys = Object.keys(obj2);
  let obj2values = Object.values(obj2);
  if (obj1keys.length !== obj2keys.length) {
    return false;
  }
  for (let i = 0; i < obj1keys.length; i++) {
    if (obj1keys[i] !== obj2keys[i] || obj1values[i] !== obj2values[i]) {
      return false;
    }
  }
  return true;
}

// Clones an array of objects
// returns a new array of cloned objects. Useful to clone an array of item objects
function cloneArray(objs) {
  let clonedArray = [];
  for (let property in objs) {
    if (objs.hasOwnProperty(property)) {
      clonedArray[property] = objs[property];
    }
  }
  return clonedArray;
}

// Uses a player item (note: this consumes the item, need to remove it after use)
// itemName is a string, target is an entity (i.e. monster, tradesman, player, dungeon)
// If target is not specified, item should be used on player for type 'potion'. Else, item should be used on the entity at the same position
// First item of matching type is used
function useItem(name) {
  let indexOfItem = player.items
    .map(function(item) {
      return item.name;
    })
    .indexOf(name);
  if (indexOfItem === -1) {
    print("You don't have this item in your inventory!", 'red');
  } else if (player.items[indexOfItem].type === 'potion') {
    player.items[indexOfItem].use(player);
    print(
      name + ' used successfully! You restored your hp to ' + player.hp,
      'blue'
    );
    player.items.splice(indexOfItem, 1);
  } else if (player.items[indexOfItem].type === 'bomb') {
    if (
      playerPosition().type === 'monster' ||
      playerPosition().type === 'keyMonster'
    ) {
      player.items[indexOfItem].use(playerPosition());
      print(
        name +
          ' used successfully! ' +
          playerPosition().name +
          ' hp is now ' +
          playerPosition().hp,
        'blue'
      );
      player.items.splice(indexOfItem, 1);
    } else if (playerPosition().type === 'grass') {
      player.items[indexOfItem].use(player);
      print('Oh no! You used a bomb on yourself!', 'red');
      if (player.hp > 0) {
        print('You HP is now ' + player.hp + '.', 'red');
        player.items.splice(indexOfItem, 1);
      } else if (player.hp === 0) {
        print(
          "You were already hurt from your last battle. You didn't survive the injury and perished.",
          'red'
        );
        gameOver();
      }
    } else if (playerPosition().type === 'dungeon') {
      print('Bombs are innefective on dungeons.', 'blue');
    } else if (playerPosition().type === 'tradesman') {
      print("Please don't hurt the nice tradesman.", 'blue');
    }
  }
}

// Uses a player skill (note: skill is not consumable, it's useable infinitely besides the cooldown wait time)
// skillName is a string. target is an entity (typically monster).
function useSkill(name) {
  let indexOfSkill = player.skills
    .map(function(skill) {
      return skill.name;
    })
    .indexOf(name);
  if (name === 'steal') {
    if (
      player.level >= player.skills[indexOfSkill].requiredLevel &&
      player.skills[indexOfSkill].cooldown === 25000
    ) {
      for (let i = 0; i < playerPosition().items.length; i++) {
        if (playerPosition().items[i].rarity <= 1) {
          player.items.push(playerPosition().items[i]);
          playerPosition().items.splice(i, 1, {
            name: 'Out of stock',
            value: Infinity,
          });
        }
      }
      print('Steal successful. You thief!', 'blue');
      player.skills[indexOfSkill].cooldown = 0;
      let cooldownID = setInterval(cooldown, 1000);
      function cooldown() {
        if (player.skills[indexOfSkill].cooldown === 25000) {
          clearInterval(cooldownID);
        } else {
          player.skills[indexOfSkill].cooldown += 1000;
        }
      }
    } else if (player.level < 3) {
      print('You must be level 3 or higher to use this skill.', 'red');
    } else if (player.skills[indexOfSkill].cooldown !== 25000) {
      print(
        'You must wait ' +
          (25 - player.skills[indexOfSkill].cooldown / 1000) +
          ' seconds to steal something again!',
        'red'
      );
    }
  } else if (name === 'confuse') {
    if (
      player.level >= player.skills[indexOfSkill].requiredLevel &&
      player.skills[indexOfSkill].cooldown === 10000
    ) {
      let split = playerPosition().name.split('');
      let reversedNameArr = [];
      let reversedName;
      for (let i = playerPosition().name.length - 1; i >= 0; i--) {
        reversedNameArr.push(split[i]);
      }
      reversedName = reversedNameArr.join('');
      print('Confusing ' + playerPosition().name + '...', 'blue');
      print(
        reversedName + ' is confused and hurts itself in the process!',
        'blue'
      );
      playerPosition().name = reversedName;
      playerPosition().hp = Math.max(
        playerPosition().hp - 25 * player.level,
        0
      );
      print(
        playerPosition().name + ' hit! -' + 25 * player.level + 'HP',
        'purple'
      );
      print('HP left: ' + playerPosition().hp, 'purple');
      player.skills[indexOfSkill].cooldown = 0;
      let cooldownID = setInterval(cooldown, 1000);
      function cooldown() {
        if (player.skills[indexOfSkill].cooldown === 10000) {
          clearInterval(cooldownID);
        } else {
          player.skills[indexOfSkill].cooldown += 1000;
        }
      }
    } else if (player.skills[indexOfSkill].cooldown !== 10000) {
      print(
        'You must wait ' +
          (10 - player.skills[indexOfSkill].cooldown / 1000) +
          ' seconds to use Confuse again!',
        'red'
      );
    }
  }
}

// Sets the board variable to a 2D array of rows and columns
// First and last rows are walls
// First and last columns are walls
// All the other entities are grass entities
function createBoard(rows, columns) {
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

// Updates the board by setting the entity at the entity position
// An entity has a position property, each board cell is an object with an entity property holding a reference to the entity at that position
// When a player is on a board cell, the board cell keeps the current entity property (e.g. monster entity at that position) and may need to have an additional property to know the player is there too.
function updateBoard(entity) {
  board[entity.position.row][entity.position.column] = entity;
}

//Function to buy an item from the tradesman. The bought item is pushed into the player items array and replaced on the tradesman array by an 'Out of stock' item. The value of the item is subtracted from the player's gold.
function buy(number) {
  if (player.gold >= playerPosition().items[number].value) {
    player.gold = player.gold - playerPosition().items[number].value;
    player.items.push(playerPosition().items[number]);
    print(
      'Congratulations! You now have the ' +
        playerPosition().items[number].name +
        '!',
      'blue'
    );
    print('You have ' + player.gold + ' gold left.', 'blue');
    playerPosition().items.splice(number, 1, {
      name: 'Out of stock',
      value: Infinity,
    });
  } else if (
    playerPosition().items[number].value !== Infinity &&
    player.gold < playerPosition().items[number].value
  ) {
    print("You don't have enough gold for this item...", 'blue');
  } else if ((playerPosition().items[number].value = Infinity)) {
    print('Sorry, this item is out of stock.', 'blue');
  }
}

//Function to sell items to the tradesman. The sold item is removed from the player's inventory and added to the tradesman's. The value of the item is added to the player's gold.
// Do the tradesman has infinite money?
function sell(number) {
  print('You sold your ' + player.items[number].name, 'blue');
  player.gold = player.gold + player.items[number].value;
  playerPosition().items.push(player.items[number]);
  player.items.splice(number, 1);
  print('You now have ' + player.gold + ' gold.', 'blue');
  print('You still have these items:', 'blue');
  for (let i = 0; i < player.items.length; i++) {
    print(player.items[i], 'blue');
  }
}

//Function to pick up an item when the player is over it.
function pickUpItem() {
  player.items.push(playerPosition());
  board[player.position.row].splice([player.position.column], 1, {
    type: 'grass',
    position: player.position,
  });
}

// Sets the position property of the player object to be in the middle of the board
// You may need to use Math methods such as Math.floor()
function placePlayer() {
  player.position = {
    row: Math.floor(board.length / 2),
    column: Math.floor(board[0].length / 2),
  };
}

//Function to automatically place entities to the board. Monsters and items are calculated proportionally to the board size. One tradesman and two dungeons are created - one of which has the princess. All entities are randomically placed on the board.
function placeOther() {
  autoEntities();
  updateBoard(createTradesman());
  for (let i = 0; i < itemsNum; i++) {
    updateBoard(createItem());
  }
  for (let i = 0; i < monstersNum - 1; i++) {
    updateBoard(createMonster());
  }
  updateBoard(createKeyMonster());
  updateAttackSpeed();
  updateBoard(createDungeon1());
  updateBoard(createDungeon2());
}

// Creates the board and places player
function initBoard(rows, columns) {
  if (rows < 10 || columns < 10) {
    print(
      'Your board is too small for an adventure! Rows and columns should have a length of at least 10. Please try again.',
      'blue'
    );
  } else {
    createBoard(rows, columns);
    placePlayer();
    placeOther();
    next();
  }
}

//Function to update Attack, Speed and getXp values on monsters
function updateAttackSpeed() {
  for (let i = 0; i < board.length; i++) {
    for (let l = 0; l < board[i].length; l++) {
      if (board[i][l].type === 'monster' || board[i][l].type === 'keyMonster') {
        board[i][l].hp = board[i][l].level * 100;
        board[i][l].attack = board[i][l].level * 10;
        board[i][l].speed = 6000 / board[i][l].level;
        board[i][l].getXp = board[i][l].level * 10;
      }
    }
  }
}

// Prints the board
function printBoard() {
  for (let i = 0; i < board.length; i++) {
    let boardTile = '';
    for (let j = 0; j < board[i].length; j++) {
      if (i === player.position.row && j === player.position.column) {
        boardTile += 'P';
      } else if (board[i][j].type === 'tradesman') {
        boardTile += 'T';
      } else if (
        board[i][j].type === 'monster' ||
        board[i][j].type === 'keyMonster'
      ) {
        boardTile += 'M';
      } else if (
        board[i][j].type === 'bomb' ||
        board[i][j].type === 'potion' ||
        board[i][j].type === 'key'
      ) {
        boardTile += 'I';
      } else if (board[i][j].type === 'wall') {
        boardTile += '#';
      } else if (board[i][j].type === 'grass') {
        boardTile += '.';
      } else if (board[i][j].type === 'dungeon') {
        boardTile += 'D';
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
  attackSpeedValue();
  player.hp = player.getMaxHp();
  print(
    'Welcome to the game ' + name + '! Your level is ' + level + '.',
    'orange'
  );
  if (player.items === [] || player.items === undefined) {
    print('You currently have no items', 'orange');
  } else {
    for (let i = 0; i < player.items.length; i++) {
      print('You have a ' + player.items[i].name, 'orange');
    }
  }
  next();
}

// Function to print player items and gold.
function inventory() {
  print('You have these items:', 'blue');
  for (let i = 0; i < player.items.length; i++) {
    print(player.items[i].name, 'blue');
  }
  print('You have ' + player.gold + ' gold.', 'blue');
}

//Function to print the player's status (level, hp and xp)
function playerStatus() {
  print('Hello ' + player.name + '!', 'blue');
  print('You are a level ' + player.level + ' player.', 'blue');
  print('Your Hp is ' + player.hp + '.', 'blue');
  print('You have ' + player.xp + ' experience points.', 'blue');
}

// Creates a monster object with a random name with the specified level, items and position
// The items property will need to be a new array of cloned item objects
// The entity properties (e.g. hp, attack, speed) must respect the rules defined in the README
function createMonster() {
  let min = 0;
  let max = items.length - 2;
  let monsterItems = [];
  for (let i = 0; i <= 2; i++) {
    monsterItems.push(
      clone(items[Math.floor(Math.random() * (max - min)) + min])
    );
  }
  return {
    name: monsterNames[Math.floor(Math.random() * monsterNames.length)],
    type: 'monster',
    level: player.level,
    items: monsterItems,
    position: randomPosition(),
  };
}

//Function to create the monster which holds the key. It's the only monster with defined items - the key and an Epic potion - and level, 2 points over player level. The name and position are still randomically generated.
function createKeyMonster() {
  return {
    name: monsterNames[Math.floor(Math.random() * monsterNames.length)],
    type: 'keyMonster',
    level: player.level + 2,
    items: [items[6], items[8]],
    position: randomPosition(),
  };
}

// Creates a tradesman object with the specified items and position. hp is Infinity
// The items property will need to be a new array of cloned item objects
function createTradesman() {
  return {
    name: 'Tradesman',
    hp: Infinity,
    type: 'tradesman',
    items: cloneArray(items),
    position: randomPosition(),
  };
}

// Creates an item entity by cloning one of the item objects and adding the position and type properties.
// item is a reference to one of the items in the items variable. It needs to be cloned before being assigned the position and type properties.
function createItem() {
  let min = 0;
  let max = items.length - 2;
  return {
    ...clone(items[Math.floor(Math.random() * (max - min + 1)) + min]),
    position: randomPosition(),
  };
}

// Creates a dungeon entity at the specified position
// This dungeon is open and have items and gold inside.
function createDungeon1() {
  return {
    isLocked: false,
    hasPrincess: false,
    type: 'dungeon',
    position: randomPosition(),
    items: [items[3], items[6]],
    gold: 150,
  };
}

// Creates a dungeon entity at the specified position
// This dungeon is locked and have the princess. Opening this dungeon is the main objective of the game.
function createDungeon2() {
  return {
    isLocked: true,
    hasPrincess: true,
    type: 'dungeon',
    position: randomPosition(),
    items: [],
    gold: 10000,
  };
}

//Function to handle the interaction between player and dungeon entities.
function dungeon() {
  let playerHasKey;
  for (let i = 0; i < player.items.length; i++) {
    if (player.items[i].name === 'Epic key') {
      playerHasKey = true;
      break;
    } else {
      playerHasKey = false;
    }
  }
  if (playerPosition().isLocked === true && playerHasKey === true) {
    print('You unlocked the dungeon!', 'blue');
    playerPosition().isLocked = false;
    let indexOfKey = player.items
      .map(function(item) {
        return item.name;
      })
      .indexOf('Epic key');
    player.items.splice(indexOfKey, 1);
    if ((playerPosition().hasPrincess = true)) {
      print('The Princess was inside!', 'blue');
      print(
        'Congatulations, you freed the princess and completed your quest!',
        'blue'
      );
      playerPosition().hasPrincess = false;
      gameOver();
    }
  } else if (playerPosition().isLocked === true && playerHasKey === false) {
    print(
      'The dungeon is locked! You need the key to open it. Some say a monster has the key. You can also buy one from the Tradesman, but keys are expensive!',
      'blue'
    );
  } else if (
    playerPosition().isLocked === false &&
    playerPosition().gold !== 0
  ) {
    print(
      "This dungeon doesn't have the princess, but you found a loot inside!",
      'blue'
    );
    print('Here are the items added to your inventory:', 'blue');
    for (let i = 0; i < playerPosition().items.length; i++) {
      print(playerPosition().items[i].name, 'blue');
      player.items.push(playerPosition().items[i]);
    }
    playerPosition().items = [];
    print(playerPosition().gold + ' gold', 'blue');
    player.gold = player.gold + playerPosition().gold;
    playerPosition().gold = 0;
  } else if (
    playerPosition().isLocked === false &&
    playerPosition().gold === 0
  ) {
    print('This dungeon is empty. Nothing to see here.', 'blue');
  }
}

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
  if (board[newPosition.row][newPosition.column].type === 'tradesman') {
    print('Welcome to my shop, adventurer!', 'blue');
    print('These are the items on my inventory:', 'blue');
    for (let i = 0; i < playerPosition().items.length; i++) {
      print(
        i +
          ' Item: ' +
          playerPosition().items[i].name +
          '. Price: ' +
          playerPosition().items[i].value,
        'blue'
      );
    }
    print(
      'To buy, use buy(number). To sell, use sell(number). Number refers to the index of the item you want to buy/sell',
      'blue'
    );
    print('You have ' + player.gold + ' gold', 'blue');
  }
  if (
    board[newPosition.row][newPosition.column].type === 'monster' ||
    board[newPosition.row][newPosition.column].type === 'keyMonster'
  ) {
    print(
      'You met an angry ' +
        board[newPosition.row][newPosition.column].name +
        '!',
      'blue'
    );
    battle();
  }
  if (
    board[newPosition.row][newPosition.column].type === 'bomb' ||
    board[newPosition.row][newPosition.column].type === 'potion' ||
    board[newPosition.row][newPosition.column].type === 'key'
  ) {
    print(
      'You found an item! ' + board[newPosition.row][newPosition.column].name,
      'blue'
    );
    pickUpItem();
  }
  if (board[newPosition.row][newPosition.column].type === 'dungeon') {
    dungeon();
  }
  if (!gameEnded) printBoard();
}

// Function to handle battles between the player and monsters.
function battle() {
  let playerAttackID = setInterval(playerAttack, player.speed);
  let monsterAttackID = setInterval(monsterAttack, playerPosition().speed);
  function playerAttack() {
    if (player.hp === 0 && playerPosition().hp > 0) {
      clearInterval(playerAttackID);
      clearInterval(monsterAttackID);
      print(
        'You fought bravely, but perished at the hands of the ' +
          playerPosition().name +
          '!',
        'red'
      );
      gameOver();
    } else if (
      playerPosition().type === 'monster' ||
      playerPosition().type === 'keyMonster'
    ) {
      print(playerPosition().name + ' hit! -' + player.attack + 'HP', 'purple');
      playerPosition().hp = Math.max((playerPosition().hp -= player.attack), 0);
      print('HP left: ' + playerPosition().hp, 'purple');
    } else {
      clearInterval(playerAttackID);
      clearInterval(monsterAttackID);
    }
  }
  function monsterAttack() {
    if (playerPosition().hp === 0 && player.hp > 0) {
      clearInterval(monsterAttackID);
      clearInterval(playerAttackID);
      print('You beat the ' + playerPosition().name + '!', 'blue');
      print(
        'Congratulations! You received 10xp and the following items:',
        'blue'
      );
      for (let i = 0; i < playerPosition().items.length; i++) {
        print(playerPosition().items[i].name, 'blue');
        player.items.push(playerPosition().items[i]);
      }
      board[player.position.row].splice([player.position.column], 1, {
        type: 'grass',
        position: player.position,
      });
      player.xp += 10;
      player.levelUp();
    } else if (
      playerPosition().type === 'monster' ||
      playerPosition().type === 'keyMonster'
    ) {
      print(player.name + ' hit! -' + playerPosition().attack + 'HP', 'red');
      player.hp = Math.max((player.hp -= playerPosition().attack), 0);
      print('HP left: ' + player.hp, 'red');
    } else {
      clearInterval(playerAttackID);
      clearInterval(monsterAttackID);
    }
  }
}

function setupPlayer() {
  printSectionTitle('SETUP PLAYER');
  print(
    "Please create a player using the createPlayer function. Usage: createPlayer('Bob')"
  );
  print(
    "You can optionally pass in a level and items, e.g. createPlayer('Bob', 3, [items[0], items[2]]). items[0] refers to the first item in the items variable"
  );
}

function setupBoard() {
  printSectionTitle('SETUP BOARD');
  print('Please create a board using initBoard(rows, columns)');
  print(
    'Monsters, items, dungeons and the tradesman will be automatically created for you, according to the board size you chose.'
  );
}

function startGame() {
  printSectionTitle('START GAME');
  print('Hello ' + player.name);
  print(
    "You are ready to start your adventure. Use move('U' | 'D' | 'L' | 'R') to get going."
  );
  print(
    'At any point in the game you can call inventory() to see your items and gold, and playerStatus() to see your level, hp and experience points.'
  );
  print(
    "You have two skills: steal and confuse. To use them, call the function useSkill('name of skill')."
  );
  printBoard();
}

let gameEnded = false;
function gameOver() {
  gameEnded = true;
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

print(
  'Hello, Jordan! In order to make the game easier to start playing, and more interesting all over, I made several changes in your proposed structure. Here they are, to guide your grading:',
  'red'
);
print(' ');
print(
  "1- AUTOMATIC NEXT: The createPlayer function works as you intended: the user passes name, level and items. If the player don't pass level, it sets to 1. There's no need to use the next() function, the user will see the SETUP BOARD right after creating the player. The next() function can be called manually anyway.",
  'red'
);
print(' ');
print(
  "2- AUTOMATIC RANDOM ENTITIES: The initBoard function will automatically generate items, monsters, dungeons and tradesman, proportionally to the board size, place them randomically on the board, and jump to START GAME. It's still possible to create entities manually by calling updateBoard(createEntityFunction()) - createEntityFunction should be replaced by createMonster, createItem, createTradesman or createDungeon1 - but no arguments can be passed - items and position will always be automatically and randomically set.",
  'red'
);
print(' ');
print(
  '2.1- MINIMUM BOARD SIZE: The user can choose the board size, but it must be over 10 rows and columns.',
  'red'
);
print(' ');
print(
  '3- KEY MONSTER: No item generated on the board will be the Epic key. One monster will always hold the Epic key and have a level 2 points over the player. Other monsters will carry three random items - but never the key - and have the same level of the player when the game starts.',
  'red'
);
print(' ');
print(
  '3.1- MONSTERS LEVEL-UP: All monsters but the key monster are created with the same level as the player. All monsters level up with the player, including the key monster - which is always two levels above the player.',
  'red'
);
print(' ');
print(
  '4- TWO DUNGEONS: One dungeon will always be locked and contain the princess. The other dungeon will be unlocked and contain one Rare bomb, one Rare potion and 150 gold.',
  'red'
);
print(' ');
print(
  "5- ITEMS USE: Potions will always take effect on the player. Bombs will always assume the use is on the entity at the player position; if the player is over grass, the bomb will affect the player. If the player tried to use a bomb on a dungeon or the tradesman, a message will be shown alerting the player the bomb can't be used in this context, but the bomb won't be consumed. So, the useItem function doesn't require a target as argument, only the name of the item.",
  'red'
);
print(' ');
print('-'.repeat(90), 'red');
print('-'.repeat(90), 'red');
print(' ');
print('Welcome to the game!', 'goldenRod');
print('Follow the instructions to setup your game and start playing');

run();
