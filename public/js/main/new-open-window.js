function newOpenWindow(e) {
  let target = e.currentTarget;
  let link = target.getAttribute('href');
  let width = $('body').width();
  let height = $('body').height();
  let strWindowFeatures = `location=yes,width=${width},height=${height},scrollbars=yes,status=yes`;
  window.open(link, '', strWindowFeatures);
}
