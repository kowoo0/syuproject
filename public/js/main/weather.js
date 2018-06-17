var makeWeatherContent = function (result, date, curHours) {
  for(var i=0; i<result.length; i++) {
    var now = result[i];
    if(now.hour === 24) {
      now.hour = 0;
    }
    if(now.day === 0 && (curHours >= now.hour && curHours < now.hour+3)) {
      var status = weatherCheck(now.status, now.hour);

      var icon = `
        <figure class="icons">
          <canvas class="${status}" width="69" height="64">
        </figure>
      `;
      var desc = `
        <span class="details temperature">${now.temp}℃</span>
        <span class="details temp-max-min">
          <strong>${now.temp_max < -50 ? '-' : now.temp_max}</strong>
          &nbsp;/&nbsp;
          <strong>${now.temp_min < -50 ? '-' : now.temp_min}</strong>
        </span>
        <span class="details rainprob"><strong>강수확률:</strong>  ${now.rainprob}%</span>
        <span class="details humidity"><strong>습도:</strong>  ${now.humidity}%</span>
      `;
      $('.weather-main-icon').append(icon);
      $('.weather-main-desc').append(desc);
      var footer = `
        <div class="weather-footer">
          <div class="mini-weather hour-6"></div>
          <div class="mini-weather hour-9"></div>
          <div class="mini-weather hour-12"></div>
          <div class="mini-weather hour-15"></div>
          <div class="mini-weather hour-18"></div>
          <div class="mini-weather hour-21"></div>
        </div>
      `;
      $('.weather-content').after(footer);
      var itemList = [];
      var padZero = function(hours) {
        var value = "";
        if(hours >= 0 && hours < 10) {
          value = "0" + hours;
          return value;
        } else {
          value = hours;
          return value;
        }
      }

      var dayzero = Array.prototype.slice.call(result);
      for(var j=0; j<dayzero.length; j++) {
        var temp = dayzero[j];
        if(temp.day === 0 && (temp.hour >= 6 && temp.hour <= 21)) {
          itemList.push(temp);
        }
      }
      $.each(itemList, function(index, value) {
        var ministatus = weatherCheck(value.status, value.hour);
        var minidesc = `
          <figure class="icons">
            <canvas class="${ministatus}" width="25%" height="24">
          </figure>
          <div class="mini-hour">${padZero(value.hour)}</div>
          `;
        var target = $(`.hour-${value.hour}`);
        $('.weather-footer').find(target).append(minidesc);
      });
    }

    if(now.day === 1) {
      if(now.hour === 9) {
        var status = weatherCheck(now.status, now.hour);
        var am = `
          <div class="tomorrow-am">
            <h6 class="tomorrow-desc">오전</h6>
            <div class="tomor-box">
              <figure class="icons">
                <canvas class="${status}" width="48" height="48">
              </figure>
              <span class="tomor-temp">${now.temp}<span>℃</span></span>
            </div>
            <div class="tomor-details">
              <img src="../../images/temp-max.png" alt="">
              <span class="tomor-max">${now.temp_max}</span>
              <img src="../../images/temp-min.png" alt="">
              <span class="tomor-min">${now.temp_min}</span>
              <img src="../../images/rainprob.png" alt="">
              <span class="tomor-rainpob">${now.rainprob}%</span>
            </div>
          </div>
        `;
        $('.tomorrow-wrapper').append(am);
      }
      if(now.hour === 15) {
        var status = weatherCheck(now.status, now.hour);
        var pm = `
          <div class="tomorrow-pm">
            <h6 class="tomorrow-desc">오후</h6>
            <div class="tomor-box">
              <figure class="icons">
                <canvas class="${status}" width="48" height="48">
              </figure>
              <span class="tomor-temp">${now.temp}<span>℃</span></span>
            </div>
            <div class="tomor-details">
              <img src="../../images/temp-max.png" alt="">
              <span class="tomor-max"> ${now.temp_max}</span>
              <img src="../../images/temp-min.png" alt="">
              <span class="tomor-min">${now.temp_min}</span>
              <img src="../../images/rainprob.png" alt="">
              <span class="tomor-rainpob"> ${now.rainprob}%</span>
            </div>
          </div>
        `;
        $('.tomorrow-wrapper').append(pm);
      }
    }

    if(now.day === 2) {
      if(now.hour === 9) {
        var status = weatherCheck(now.status, now.hour);
        var am = `
          <div class="dayafter-am">
            <h6 class="dayafter-desc">오전</h6>
            <div class="dayafter-box">
              <figure class="icons">
                <canvas class="${status}" width="48" height="48">
              </figure>
              <span class="dayafter-temp">${now.temp}<span>℃</span></span>
            </div>
            <div class="dayafter-details">
              <img src="../../images/temp-max.png" alt="">
              <span class="dayafter-max"> ${now.temp_max}</span>
              <img src="../../images/temp-min.png" alt="">
              <span class="dayafter-min"> ${now.temp_min}</span>
              <img src="../../images/rainprob.png" alt="">
              <span class="dayafter-rainpob"> ${now.rainprob}%</span>
            </div>
          </div>
        `;
        $('.dayafter-wrapper').append(am);
      }
      if(now.hour === 15) {
        var status = weatherCheck(now.status, now.hour);
        var pm = `
          <div class="dayafter-pm">
            <h6 class="dayafter-desc">오후</h6>
            <div class="dayafter-box">
              <figure class="icons">
                <canvas class="${status}" width="48" height="48">
              </figure>
              <span class="dayafter-temp">${now.temp}<span>℃</span></span>
            </div>
            <div class="dayafter-details">
              <img src="../../images/temp-max.png" alt="">
              <span class="dayafter-max"> ${now.temp_max}</span>
              <img src="../../images/temp-min.png" alt="">
              <span class="dayafter-min"> ${now.temp_min}</span>
              <img src="../../images/rainprob.png" alt="">
              <span class="dayafter-rainpob"> ${now.rainprob}%</span>
            </div>
          </div>
        `;
        $('.dayafter-wrapper').append(pm);
      }
    }
  }
  var icons = new Skycons(),
      list  = [
        "clear-day", "clear-night", "partly-cloudy-day",
        "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
        "fog"
      ],
      i;

  for(i = list.length; i--; )
    icons.set(list[i], list[i]);

  icons.play();
}


var weatherSlideOnChange = function (activeIndex) {
  if(activeIndex === 0) {
    $('.today').css('color', '#1DDB16');
    $('.tomorrow').css('color', '#000');
    $('.dayafter').css('color', '#000');
  }
  else if(activeIndex === 1) {
    $('.today').css('color', '#000');
    $('.tomorrow').css('color', '#1DDB16');
    $('.dayafter').css('color', '#000');
  }
  else {
    $('.today').css('color', '#000');
    $('.tomorrow').css('color', '#000');
    $('.dayafter').css('color', '#1DDB16');
  }
}

var weatherCheck = function (status, hours) {
  var value = "";
  if(status === "구름 많음" || status === "흐림") {
    value = "cloudy";
    return value;
  }
  if(status === "비") {
    value = "rain";
    return value;
  }
  if(status === "눈") {
    value = "snow";
    return value;
  }
  if(status === "안개") {
    value = "fog"
    return value;
  }
  if((hours >= 0 && hours < 6) || (hours >= 18 && hours <= 24)) {
    if(status === "맑음") {
      value = "clear-night";
      return value;
    }
    else if(status === "구름 조금") {
      value = "partly-cloudy-night";
      return value;
    }
  }
  if(hours >= 6 && hours < 18) {
    if(status === "맑음") {
      value = "clear-day";
      return value;
    }
    else if(status === "구름 조금") {
      value = "partly-cloudy-day";
      return value;
    }
  }

  return "wind";
}
