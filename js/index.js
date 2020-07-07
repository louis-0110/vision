



(function () {

  const oUl = document.querySelector('ul');




  // oUl.addEventListener('touchstart', function (e) {
  //   let target = e.target;

    
  //   if(target.nodeName =="IMG"){
  //     target = target.parentElement;
  //     console.log(target);
  //   }

  //   if (target.classList.contains('select')) {
  //     target.classList.remove('select');
  //   } else {
  //     target.classList.add('select');
  //   }

  // }, false)

  oUl.ontouchstart = function (e) {
    let event = e || window.event;
    let target = event.target || event.srcElement;
  
    if(target.nodeName =="IMG"){
      target = target.parentElement;
      console.log(target);
    }

    if (target.classList.contains('select')) {
      target.classList.remove('select');
    } else {
      target.classList.add('select');
    }

  }


  const oT = document.querySelector('.test');

  oT.addEventListener('touchstart',function(e){
    this.style.backgroundColor = 'red';
  },false)

}())