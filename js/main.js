/*
 **
 **
 */
const oWrap = document.getElementsByClassName('wrap')[0];
const oContarner = document.querySelector('.container');

//清除移动端默认事件
oContarner.addEventListener('touchstart', ev => {
  ev.preventDefault();
})

function Card(imageIndex) {
  this.status = 'back'; //back select clear
  this.image = imageIndex; // image
  this.dom = document.createElement('li');
  this.dom.innerHTML = `<img src="../images/${this.image}.jpg" alt='test'>`;

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
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (man - min) + min);
}

Game.prototype.init = function (length) {
  this.length = length;
  for (let i = 1; i <= length; i++) {

    this.cardList.push(new Card(i));
    this.cardList.push(new Card(i));

  }

  this.cardList.sort(() => Math.random() - 0.5);
  this.initContainer();
  this.addEvent();
}

Game.prototype.initContainer = function () {
  oWrap.innerHTML = '';
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
      console.log('this over')
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
    this.length --;
    card2.setStatus('clear')
    card1.setStatus('clear')

      if(card2.image == '18'){
        alert('领取红包');
      }

    
    console.log(this.length)
      if(0 == this.length){
        
        alert('完成');
      }
  } else {
    
    card2.setStatus('back')
    card1.setStatus('back')
  }
}

 const game = new Game()

game.init(18);