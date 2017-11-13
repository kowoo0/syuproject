const limitIndex = 224;

const showMoreText = (function() {
  return function() {
    // JQuery는 Arrow function이 먹지 않음.. ㅜㅜ
    $('.more').on('click', function(e) {
      e.preventDefault();
      $(this).css('display', 'none');
      $(this).prev().css('display', 'none');
      $(this).parent().next().css('display', 'block');
    });
  };
})();

let textReduce = (text) => {
  if(text === undefined) {
    return "";
  }

  let splitIndex;
  let lastIndex;
  let ellipsis = "...";

  text = text.replace(/\n/g, '<br>');
  text = text.replace(/<br><br><br>/g, '<br><br>');
  splitIndex = text.lastIndexOf('<br>', limitIndex);
  lastIndex = text.lastIndexOf('<br>', splitIndex - 1);
  // console.log(text, splitIndex, text.length);
  if(splitIndex < 0 || lastIndex === text.length - 4 || splitIndex === text.length - 4) {
    return text;
  } else {
    let vsText = "";
    let invsText = "";
    if(lastIndex < 0) {
      vsText = text.substring(0, splitIndex);
      invsText = text.substring(splitIndex).replace(/<br>/, '');
    } else {
      vsText = text.substring(0, lastIndex);
      invsText = text.substring(lastIndex).replace(/<br>/, '');
    }

    return `${vsText}
      <span class="el">${ellipsis}</span>
      <a href="javascript:;" class="more">계속 읽기</a>
      <p class="invs">${invsText}</p>`;
  }
};
