/*
 **
 **
 */
const oWrap = document.getElementsByClassName('wrap')[0];
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
Card.prototype.equal = function (imageIndex) {
  return this.image == imageIndex.image; //返回两次图片序列是不是一样
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

  let cs = this.cardList.filter((e) => {
    return e.status == "select"
  })


  if (cs.length != 2) {
    return;
  }

  var card1 = cs[0],
    card2 = cs[1];

  if (card1.equal(card2)) {

    this.length--;

    this.prec = Math.floor((1 - this.length / this.$length) * 100);


    proBar.set(this.prec);
    progText.innerHTML = this.prec + "%";

    card2.setStatus('clear')
    card1.setStatus('clear')

    if (card2.image == '18') {
      alert('领取红包');
    }

    if (0 == this.length) {

      pop.setContent(1)
      pop.block();
    }
  } else {

    card2.setStatus('back')
    card1.setStatus('back')
  }
}

const game = new Game()



//开始按钮

const oBtn = document.querySelector('button');


oBtn.addEventListener('touchstart', function () {
  const li = Array.from(document.getElementsByTagName('li'));
  oBtn.classList.add('none');
  li.forEach((ele) => {
    ele.className = 'back';
  })

  setTimeout(() => {
    game.init(18);
    uptime.init();
  }, 500)


})

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


const proBar = new ProgressBar('.progressBar', 60);
const timeBar = new ProgressBar('.timeBar', 60);


// 游戏时间
//1.点击shart  开始到即时
//2.时时刷新时间
// 3.到达址时间现实游戏结束  调用弹窗

function UpTime(time) {
  this.time = time;
  this.timer = null;
}

UpTime.prototype.init = function () {
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

    oBtn.classList.remove('none');

    const li = document.querySelectorAll('li');

    //遮罩层弹窗 
    pop.setContent(0);
    pop.block();


    li.forEach((ele) => {
      if(!ele.classList.contains('clear')){
        ele.className = 'select';
      }
    })
  } else {
    timeBar.set(prev);
    timeText.innerHTML = this.time - this.gameTime + "s";
  }
}



const uptime = new UpTime(12);


