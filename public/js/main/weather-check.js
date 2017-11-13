let weatherCheck = function(status, hours) {
  let value = "";
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
