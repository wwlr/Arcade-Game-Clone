//将行高和列宽统一保存起来，方便后面调整位置时调用
var ROW_HEIGHT = 83;
var COL_WIDTH = 101;

//声明敌人和玩家得图片变量
var enemySprite = 'images/enemy-bug.png';
var playerSprite = 'images/char-boy.png';

// 这是我们的玩家要躲避的敌人 
var Enemy = function (x, y, sprite, speed) {

    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = x;
    this.y = y;
    this.speed = speed;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = sprite;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function (dt) {
    this.x += dt * this.speed;

    //敌人横穿屏幕，重置横轴位置和速度
    if (this.x > COL_WIDTH * 5) {
        this.x = randomPositionInRow();
        this.speed = randomEnemySpeed();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
//通过call()函数从Enemy类继承x,y,sprite属性的继承
var Player = function (x, y, sprite) {
    Enemy.call(this, x, y, sprite);
};

// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
//从Enemy类继承update()函数

//通过Object.create()实现原型链继承
Player.prototype = Object.create(Enemy.prototype);
//赋值构造函数为Player自己
Player.constructor = Player;


//玩家复位函数，与敌人发生碰撞或成功过河时调用
Player.prototype.playerReset = function () {
    this.x = COL_WIDTH * 2;
    this.y = ROW_HEIGHT * 4;
};
Player.prototype.update = function (dt) {
    // 将 this 保存到一个叫做 self 的变量
    var self = this;

    //判断玩家得位置是否与敌人有重合，玩家与敌人发生重合后，游戏重新开始
    allEnemies.forEach(function (element) {

        // 在匿名函数内部通过 变量 self 来访问 this
        if (self.y == element.y) {
            if (self.x - COL_WIDTH < element.x && element.x < self.x + COL_WIDTH) {
                self.playerReset();
                return;
            }
        }
    });

    //玩家获胜后出现相应的动画,游戏重新开始，玩家位置重置
    if (this.y == 0) {
        alert('win');
        this.playerReset();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出玩家，
// Player.prototype.render = function () {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

//接收document.addEventListener监听到的键盘事件，控制玩家移动，
//判断玩家位置，玩家无法移动至屏幕外
Player.prototype.handleInput = function (movement) {
    switch (movement) {
        case 'left':
            if (this.x >= COL_WIDTH) {
                this.x -= COL_WIDTH;
            }
            break;
        case 'right':
            if (this.x <= COL_WIDTH * 3) {
                this.x += COL_WIDTH;
            }
            break;
        case 'up':
            if (this.y >= ROW_HEIGHT) {
                this.y -= ROW_HEIGHT;
            }
            break;
        case 'down':
            if (this.y <= ROW_HEIGHT * 4) {
                this.y += ROW_HEIGHT;
            }
            break;
            // case 'pause': 
    }
};

// 现在实例化你的所有对象
// 通过调用randomPositionInRow()函数,实现敌人速度不同和出场时间不同

var enemy1 = new Enemy(randomPositionInRow(), ROW_HEIGHT, enemySprite, randomEnemySpeed()); //row1
var enemy2 = new Enemy(randomPositionInRow(), ROW_HEIGHT * 2, enemySprite, randomEnemySpeed()); // row2
var enemy3 = new Enemy(randomPositionInRow(), ROW_HEIGHT * 3, enemySprite, randomEnemySpeed()); //row3
var player1 = new Player(COL_WIDTH * 2, ROW_HEIGHT * 4, playerSprite);

// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);

// 把玩家对象放进一个叫 player 的变量里面
var player = player1;

// 随机生成敌人横轴位置的函数,初始化或敌人超出屏幕时调用
function randomPositionInRow() {
    return Math.floor(Math.random() * (COL_WIDTH * 2) - COL_WIDTH * 5);
}

//随机生成敌人速度的函数，初始化或敌人超出屏幕时调用
function randomEnemySpeed() {
    return Math.floor(Math.random() * (COL_WIDTH * 3) + COL_WIDTH / 2);
}


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'pause'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});