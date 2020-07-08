



(function () {

  const oUl = document.querySelector('ul');
  const oContarner = document.querySelector('.container');

  //清除移动端默认事件
  oContarner.addEventListener('touchstart',ev=>{
    ev.preventDefault();
  })

  


  oUl.addEventListener('touchstart', function (e) {
    
    let target = e.target;
    if (target.nodeName == "IMG") {
      target = target.parentElement;
    }

    if (target.classList.contains('select')) {
      target.classList.remove('select');
    } else {
      target.classList.add('select');
    }
  }, false)

}())