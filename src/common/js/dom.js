export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

let elementStyle = document.createElement("div").style;

let vendor = (()=>{
  let transformName = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformName){
    if (elementStyle[transformName[key]]!= "undefined"){
      return key;
    }
  }
  return false;
})()

export function prefixStyle(style) {
  if (vendor === false){
    return false;
  }

  if (vendor === 'standard'){
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
