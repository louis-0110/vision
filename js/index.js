/*
 **
 **
 */
const oWrap = document.getElementsByClassName('wrap')[0];
const oFluidWrap = document.querySelector('.fluidWrap');
const oContarner = document.querySelector('.container');

// 时间 span
const timeText = document.querySelector('.timeText');

// 完成度 span

const progText = document.querySelector('.progText');

//清除移动端默认事件
oContarner.addEventListener('touchstart', ev => {
  ev.preventDefault();
})

function Card(imageIndex) {
  this.status = 'back'; //back select clear
  this.image = imageIndex; // image
  this.dom = document.createElement('li');
  this.dom.innerHTML = `<img src="http://117.51.157.103/vision/images/${imageIndex}.jpg" alt='test'>`;

  const _this = this;
  this.dom.addEventListener('touchstart', function () {

    if (_this.onClick) {

      _this.onClick(); // 触发点击事件
    }
  })
}
Card.prototype.equal = function (cardObj) {
  return this.image == cardObj.image; //返回两次图片序列是不是一样
}

Card.prototype.setStatus = function (status) {
  const _this = this;

  if (status == 'back') {
    this.status = 'back';
    this.dom.className = '';
  } else if (status == 'select') {
    this.status = 'select';
    this.dom.className = 'select';

    _this.dom.addEventListener('transitionend', () => {
      if (_this.onTransitionEnd) {
        _this.onTransitionEnd();
      }
    }, {
      once: true
    });
  } else if (status == 'clear') {
    this.status = 'clear';
    this.dom.className = 'clear';
  } else {
    throw new Error('status is not find')
  }
}

Card.prototype.appendTo = function (containerNode) {
  containerNode && containerNode.appendChild(this.dom);
}

function Game() {
  this.cardList = [];
  this.isFlipping = false;
  this.prec = 0;
  this.time = 1;
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (man - min) + min);
}

Game.prototype.init = function (length) {
  //初始化常量
  this.cardList = [];
  this.prec = 0;
  this.isFlipping = false;
  this.length = this.$length = length;

  for (let i = 1; i <= length; i++) {
    this.cardList.push(new Card(i));
    this.cardList.push(new Card(i));
  }

  this.cardList.sort(() => Math.random() - 0.5);
  this.initContainer();
  this.addEvent();
  proBar.set(this.prec);
}

Game.prototype.initContainer = function () {
  oWrap.innerHTML = '';

  progText.innerHTML = '0%';
  let len = this.cardList.length;
  for (let i = 0; i < len; i++) {
    this.cardList[i].appendTo(oWrap);
  }
}

Game.prototype.addEvent = function () {
  const _this = this;
  for (let i = 0; i < this.cardList.length; i++) {
    let c = this.cardList[i];
    c.onClick = function () {
      if (this.status === "back" && !_this.isFlipping) {
        _this.isFlipping = true;
        this.setStatus('select')
      }

    }



    c.onTransitionEnd = function () {
      _this.isFlipping = false;
      _this.compareCards();
    }
  }
}

Game.prototype.compareCards = function () {
  //返回card是select 的数组
  let cs = this.cardList.filter((e) => {
    return e.status == "select"
  })


  if (cs.length != 2) {
    return;
  }

  var card1 = cs[0],
    card2 = cs[1];

  //检查图片是不是一致
  if (card1.equal(card2)) {

    this.length--;

    this.prec = Math.floor((1 - this.length / this.$length) * 100);

    //更改进度条百分比
    proBar.set(this.prec);
    progText.innerHTML = this.prec + "%";
    //一致后消灭图片
    card2.setStatus('clear')
    card1.setStatus('clear')
    //检查消灭的是不是红包 18 
    if (card2.image == '18') {
      alert('领取红包');
    }
    //检查有没有完成游戏 
    if (0 == this.length) {
      
      uptime.cancle();
      pop.setContent(1)
      pop.block();
      if(this.time == 2){
        pop.nextBtn.classList.add('none');
        pop.lastBtn.classList.remove('none');
      }
      this.time ++;
      // oBtn.classList.remove('none');
    }
  } else {
    //两张图片不一致的话，就自动翻到背面
    card2.setStatus('back')
    card1.setStatus('back')
  }
}

const game = new Game()



//开始按钮

const oBtn = document.querySelector('button');

function initGame(num, time) {
  const li = Array.from(document.getElementsByTagName('li'));
  li.forEach((ele) => {
    ele.className = 'back';
  })
  setTimeout(() => {
    game.init(num);
    uptime.init(time);
  }, 500)
}

//开始游戏
oBtn.addEventListener('touchstart', function () {
  oBtn.classList.add('none');
  initGame(2, 10)
})

//下一关
//最后一关
//在popups模块绑定


//进度条构造函数

function ProgressBar(barNode, TotalLen) {  // .timeBar  .progressBar
  this.totL = TotalLen; // 60vw
  this.dom = document.querySelector(barNode);
}

//游戏进度
// 1. 显示游戏进度 tx
ProgressBar.prototype.set = function (prec) {
  let tx = Math.floor(prec / 100 * this.totL);
  this.dom.style.transform = `translate(${tx - this.totL}vw)`;
}

// 60 是bar的长度 60vw
const proBar = new ProgressBar('.progressBar', 60);
const timeBar = new ProgressBar('.timeBar', 60);


// 游戏时间
//1.点击shart  开始到即时
//2.时时刷新时间
// 3.到达址时间现实游戏结束  调用弹窗

function UpTime(time) {
  this.timer = null;
}

UpTime.prototype.init = function (time) {
  this.time = time;
  this.lastTime = new Date() - 0;
  this.timeOut();
}

UpTime.prototype.timeOut = function () {
  this.timer = requestAnimationFrame(() => {
    this.timeOut();
  })
  this.render();
}

UpTime.prototype.cancle = function () {
  window.cancelAnimationFrame(this.timer);
}

UpTime.prototype.render = function () {
  let interimT = 0;
  let prev = 0.5;
  this.currTime = new Date() - 0;
  this.gameTime = Math.floor((this.currTime - this.lastTime) / 1000);

  prev = Math.ceil((this.gameTime / this.time) * 100);

  if (prev >= 101) {
    this.cancle();

    // oBtn.classList.remove('none');

    const li = Array.from(document.getElementsByTagName('li'));

    //遮罩层弹窗 倒计时结束前未完成游戏
    li.forEach((ele) => {
      if (!ele.classList.contains('clear')) {
        ele.className = 'select';
      }
    })

    // 加倒计时方式翻转图片穿透遮罩层
    setTimeout(() => {
      pop.nextBtn.classList.add('none');
      pop.lastBtn.classList.add('none');
      pop.setContent(0);
      pop.block();
    }, 500)

  } else {
    timeBar.set(prev);
    timeText.innerHTML = this.time - this.gameTime + "s";
  }
}

const uptime = new UpTime();


