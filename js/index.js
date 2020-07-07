



(function(){

  const oUl = document.querySelector('ul');

  oUl.addEventListener('touchstart',function(e){
    let target = e.target;
    if(target.classList.contains('select')){
      console.log("aaa")
      target.classList.remove('select');
    }else{
      target.classList.add('select');
    }
    
  },false)

}())