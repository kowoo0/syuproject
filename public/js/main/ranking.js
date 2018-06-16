var makeRankingContent = function (result) {
  if(result === 'empty') {
    $('.rank-slide-control').append('<p>데이터가 없습니다..</p>');
  } else {
    for(var i=0; i<result.length; i++) {
      var item = result[i];
      var photo = "";
      if(item === undefined) continue;
      switch(item.from) {
        case 1:
          photo = "./images/syu-bamboo.jpg";
          break;
        case 2:
          photo = './images/syu-deliver.jpg';
          break;
        case 3:
          photo = './images/syu-chonghak.jpg';
          break;
        case 4:
          photo = './images/syu-yeonhab.jpg';
          break;
        case 5:
          photo = './images/syu-computer.jpg';
          break;
        case 6:
          photo = './images/syumain.jpg';
          break;
        case 7:
          photo = './images/syu-feedtest.png';
          break;
        case 8:
          photo = './images/syugall.png';
          break;
        default:
          photo = './images/kakaofriends/4.jpg';
      }
      if(item.message === undefined) item.message = "";
      var appendEl = `
        <div class="rank-slide-wrapper">
          <div class="rank-all">
            <img src="${photo}" alt="">
            <span class="rank-from">${item.name}</span>
            <span class="rank-link" href="${item.link}">Link</a>
          </div>
          <div class="rank-slide-section">
            ${rankSectionType(item)}
          </div>
          <div class="rank-footer">
            <div class="rank-date-box">
              <i>Upload</i>&nbsp;&nbsp;${moment(item.created_time, "YYYYMMDDhhmmss").format("YYYY.MM.DD HH:mm")}
            </div>
            <div class="rank-likes">
              <img src="./images/love_icon.png" width="23px" height="23px">
            </div>
            <div class="rank-likes-count">
              ${item.likes}
            </div>
          </div>
        </div>
      `;
      $(`.rank-slide-control > div.swiper-slide:nth-child(${i+1})`).append(appendEl);
      $(`.rank-link`).one('click', function(e) {
        newOpenWindow(e);
      });
    }
  }
}