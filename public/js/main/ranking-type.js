function reduceText(msg, type) {
  if(msg === undefined) {
    return "";
  }

  var splitIndex;
  var ellipsis = "..."
  var length = msg.length;

  if(type === 1) {
    splitIndex = 75; // picture & msg
  } else {
    splitIndex = 147; // only msg
  }

  if(length > splitIndex) {
    msg = msg.substring(0, splitIndex);
    // msg = msg.replace(/\n/g, '<br>');
    msg = msg + ellipsis;
    return msg;
  }
  return msg;
}

var makeRankingType = function (result, type) {
  for(var i=result.length-1; i>=0; i--) {
    var item = result[i];
    if(!item || !item.message) {
      continue;
    } else {
      var appendEl = `
        <li class="rank-item">
          <div class="rank-item-link" href="${item.link}">
            <div class="rank-item-img">
              ${item.likes}
              <img src="./images/like_yellow.png" alt="" width="18" height="18">
            </div>
            <p class="rank-item-msg">${item.message}</p>
            <p class="rank-item-click">click</p>
          </div>
        </li>
      `;
      $(`.ranktype-${type}`).prepend(appendEl);
    }
  }
  $(`.rank-item-link`).one('click', function(e) {
    newOpenWindow(e);
  });
}

var rankSectionType = function (item) {
  if(item.source) {
    var el = `
      <div class="section-source">
        <video x-webkit-airplay='allow'
          controls
          autoplay
          muted
          src='${item.source}'
          poster='${item.picture}'>
        </video>
      </div>
    `;

    return el;
  }
  else if(item.picture) {
    var el;
    if(!item.message) {
      el = `
        <span class="section-only-picture">
          <img src="${item.picture}" alt="">
        </span>
      `
      return el;
    }

    el = `
      <div class="section-msg-picture">
        <img src="${item.picture}" alt="">
        <div class="section-msg-box">
          ${reduceText(item.message, 1)}
        </div>
      </div>
    `
    return el;
  }
  else {
    if(!item.message) return;
    var el = `
      <span class="section-only-msg">
        ${reduceText(item.message, 2)}
      </span>
    `;
    return el;
  }
}
