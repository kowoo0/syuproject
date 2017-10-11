const limitIndex = 224;

const showMoreText = (function() {
  return function() {
    // JQuery는 Arrow function이 먹지 않음.. ㅜㅜ
    $('.more').on('click', function(e) {
      e.preventDefault();
      $(this).css('display', 'none');
      $(this).prev().css('display', 'none');
      $(this).parent().next().css('display', 'inline-block');
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

  text = text.replace(/[.\n]/g, '<br>');
  splitIndex = text.lastIndexOf('<br>', limitIndex);
  lastIndex = text.lastIndexOf('<br>', splitIndex - 1);
  // console.log(text, splitIndex, text.length);
  if(lastIndex < 0 || lastIndex === text.length - 4 || splitIndex === text.length - 4) {
    return text;
  } else {
    let vsText = text.substring(0, lastIndex);
    let invsText = text.substring(lastIndex).replace(/<br>/, '');

    return `${vsText}
      <span class="el">${ellipsis}</span>
      <a href="javascript:;" class="more"> + more</a>
      <p class="invs">${invsText}</p>`;
  }
};
