const AJAX = {

  feedload: (url, fn) => {
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      const dcResult = JSON.parse(xhr.responseText);
      fn(dcResult);
    })
  }
}
