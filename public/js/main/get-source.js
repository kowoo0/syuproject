let hasSource = function(source, picture, link) {
  let sourceEl = ""
  if(typeof source === 'string') {
    sourceEl = `
      <div class='source-wrap'>
        <a href='javascript:;' class='source-link'>
          <video x-webkit-airplay='allow'
            width='100%'
            controls
            src='${source}'
            poster='${picture}'>
          </video>
        </a>
      </div>
    `;
  }
  return sourceEl;
}
