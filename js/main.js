/*
**
**
*/
const oWrap = document.getElementsByClassName('wrap')[0];
const oContarner = document.querySelector('.container');

  //清除移动端默认事件
  oContarner.addEventListener('touchstart',ev=>{
    ev.preventDefault();
  })

function Card(imageIndex) {
  this.status = 'back';   //back select clear
  this.image = imageIndex; // image
  this.dom = document.createElement('li');
  this.dom.innerHTML = `<img src="../images/${this.image}.jpg">`;

  const _this = this;
  this.dom.addEventListener('touchstart', function () {

    if (_this.onClick) {

      _this.dom.addEventListener('transitionend', () => {

        if (_this.onTransitionEnd) {
          _this.onTransitionEnd();
        }
      }, { once: true });

      _this.onClick();
    }

  })


}
Card.prototype.equal = function (imageIndex) {
  return this.image == imageIndex.image;
}

Card.prototype.setStatus = function (status) {
  const _this = this;

  if (status == 'back') {
    this.status = 'bakc';
    this.dom.className = '';
  }
  else if (status == 'select') {
    this.status = 'select';
    this.dom.className = 'select';
  }
  else if (status == 'clear') {
    this.status = 'clear';
    this.dom.className = 'clear';
  }
  else {
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

  for (let i = 1; i <= length; i++) {

    this.cardList.push(new Card(i));
    this.cardList.push(new Card(i));

  }

  this.cardList.sort(() => Math.random() - 0.5)
  console.log(this.cardList)

  this.initContainer();
  this.addEvent();
}

Game.prototype.initContainer = function () {
  oWrap.innerHTML = '';
  for (let i = 0; i < this.cardList.length; i++) {
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
      // this.setStatus('back')
      // console.log('this over')
      _this.compareCards();
    }
  }
}

Game.prototype.compareCards = function(){
  console.log(this.cardList);
  let cs = this.cardList.filter((e)=>{
console.log(e.status);
    return e.status == "select"
  })

console.log(cs);


  if (cs.length != 2){
    return;
  }

  var card1 = cs[0],card2 = cs[1];

  if(card1.equal(card2)){
    card1.setStatus('clear')
    card2.setStatus('clear')
  }else{
    card1.setStatus('back')
    card2.setStatus('back')
  }
  console.log(cs);
}

game = new Game()

game.init(18);











