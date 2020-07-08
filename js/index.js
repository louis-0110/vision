



(function () {

  const oUl = document.querySelector('ul');
  const oContarner = document.querySelector('.container');


  oContarner.addEventListener('touchstart',ev=>{
    ev.preventDefault();
  })


  oUl.addEventListener('touchstart', function (e) {
    let target = e.target;
    console.log('aa');
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