let padZero = function(t) {
  if(t<10) {
    return '0' + t;
  }
  return t;
}

let fbDateFix = function(rawDate) {
  let local = new Date(rawDate.replace(/-/g, '.').replace('T', ' ').replace('+0000', ''));
  local.setSeconds(local.getSeconds() + 32400);

  let month = padZero(local.getMonth()+1);
  let date = padZero(local.getDate());
  let hour = padZero(local.getHours());
  let min = padZero(local.getMinutes());
  let sec = padZero(local.getSeconds());

  let localDate = `${local.getFullYear()}${month}${date}${hour}${min}${sec}`;
  localDate = Number(localDate);

  return localDate;
}

module.exports = fbDateFix;
