var makeNoticeContent = function (result, from) {
  for(var i=result.length-1; i>=0; i--) {
    var addClass = "";
    if(result[i].category === "공지") {
      addClass = "notice-gongji";
    }
    var getInfoText = `
      <li class="notice-feed">
        <div class="notice-cg">
          <span class="${addClass}">${result[i].category.replace(/\[/, "").replace(/\]/, "")}</span>
        </div>
        <div class="message-wrap">
          <span class="notice-msg" href="${result[i].link}">${result[i].text}</span>
          <span class="notice-date">${result[i].date}</span>
        </div>
      </li>
    `;
    $(`.${from}-contents`).prepend(getInfoText);
  }
  
  $(`.notice-msg`).one('click', function(e) {
    newOpenWindow(e);
  });
}

var noticeSlideOnChange = function (curSlide) {
  switch(curSlide) {
    case 0:
      $('.notice-title').text('학사');
      $('.notice').css('background', '#D5D5DF');
      $('.circle').css('background', '#7B7B7B');
      $('.notice-text').css('color', '#454545');
      break;
    case 1:
      $('.notice-title').text('생활');
      $('.notice').css('background', '#C9FFC3');
      $('.circle').css('background', '#009300');
      $('.notice-text').css('color', '#10620A');
      break;
    case 2:
      $('.notice-title').text('행사');
      $('.notice').css('background', '#FFC19E');
      $('.circle').css('background', '#FF7012');
      $('.notice-text').css('color', '#930000');
      break;
    case 3:
      $('.notice-title').text('취업');
      $('.notice').css('background', '#D4F4F2');
      $('.circle').css('background', '#00A2C9');
      $('.notice-text').css('color', '#00365D');
      break;
    case 4:
      $('.notice-title').text('장학');
      $('.notice').css('background', '#1F50B5');
      $('.circle').css('background', '#C6F9FF');
      $('.notice-text').css('color', '#FFFFFF');
      break;
    case 5:
      $('.notice-title').text('기관');
      $('.notice').css('background', '#660033');
      $('.circle').css('background', '#D941C5');
      $('.notice-text').css('color', '#F6F6F6');
      break;
    default:
      break;
  }
}

var makeImagelistContent = function (result) {
  for(var i=result.length-1; i>=0; i--) {
    if(/^\//.test(result[i].link)) {
      result[i].link = `https://www.syu.ac.kr${result[i].link}`;
    }
    var item = `
      <div class="plate-image-item">
        <div class="plate-link" href="${result[i].link}">
          <h5 class="plate-text"><img src="./images/pattern.png"> ${result[i].title}</h5>
          <img class="plate-img" src="${result[i].source}">
        </div>
      </div>
    `;
    $('.flat-plate').append(item);
  }
  $('.plate-link').one('click', function(e) {
    var target = e.currentTarget;
    var link = target.getAttribute('href');
    var width = $('body').width();
    var height = $('body').height();
    var strWindowFeatures = `location=yes,width=${width},height=${height},scrollbars=yes,status=yes`;
    window.open(link, '', strWindowFeatures);
  });
}