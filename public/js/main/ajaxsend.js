const AJAX = {
  // allfeedload : 모든 피드, fbfeedload : 페북 피드, dcfeedload : 디시 피드, updatefeed: 업데이트된 피드
  allfeedload: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const allResult = JSON.parse(xhr.responseText);
      fn(allResult);
    });
  },

  updatefeed: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    // 프로세스 종료 시 계속해서 돌아가는 setInterval 종료
    xhr.addEventListener('error', () => {
      console.log('Error: Node Process exit.. setInterval will stop soon!');
      clearInterval(checkLoop);
    });
    xhr.addEventListener('load', () => {
      const updatedResult = JSON.parse(xhr.responseText);
      if(updatedResult.hasUpdate === 'no') {
        console.log('not updated..');
      } else {
        fn(updatedResult.data);
      }
    });
  },

  morefeed: (url, count, type, fn) => {
    let data = { 'count': count, 'type': type };
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const moreResult = JSON.parse(xhr.responseText);
      fn(moreResult);
    });
  },

  reqcomments: (url, count, id, fn) => {
    let data = { 'count': count, 'id': id };
    data = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const commentResult = JSON.parse(xhr.responseText);
      console.log(commentResult);
      // commentResult.sort(function(a, b) {
      //   return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
      // })
      fn(commentResult);
    });
  },

  reqnotice: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const noticeResult = JSON.parse(xhr.responseText);
      fn(noticeResult.data, noticeResult.from);
    });
  },

  reqweatherinfo: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const weatherResult = JSON.parse(xhr.responseText);
      fn(weatherResult);
    });
  },

  reqimagelist: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const imgListResult = JSON.parse(xhr.responseText);
      fn(imgListResult);
    });
  },

  reqrankingslide: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const rankslideResult = JSON.parse(xhr.responseText);
      fn(rankslideResult.data);
    });
  },

  reqrankingtype: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const ranktypeResult = JSON.parse(xhr.responseText);
      fn(ranktypeResult.data, ranktypeResult.type);
    });
  },
  
}
