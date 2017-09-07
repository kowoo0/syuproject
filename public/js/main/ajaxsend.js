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
  fbfeedload: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const fbResult = JSON.parse(xhr.responseText);
      fn(fbResult);
    });
  },
  dcfeedload: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const dcResult = JSON.parse(xhr.responseText);
      fn(dcResult);
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
        fn(updatedResult);
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
  }
}
