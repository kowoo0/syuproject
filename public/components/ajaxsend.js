const AJAX = {

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
  }
}
