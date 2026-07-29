function loadPartialViaXhr(filePath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function onReadyStateChange() {
      if (xhr.readyState !== 4) return;
      const ok = (xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && !!xhr.responseText);
      if (ok) {
        resolve(xhr.responseText);
        return;
      }
      reject(new Error(`Falha ao carregar ${filePath} via XHR (status: ${xhr.status})`));
    };
    xhr.onerror = function onError() {
      reject(new Error(`Erro de rede ao carregar ${filePath} via XHR`));
    };
    xhr.send();
  });
}

function loadPartial(filePath, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return Promise.resolve();

  const isFileProtocol = window.location.protocol === 'file:';
  const loaderPromise = isFileProtocol
    ? loadPartialViaXhr(filePath)
    : fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Falha ao carregar ${filePath}`);
        return response.text();
      })
      .catch(() => loadPartialViaXhr(filePath));

  return loaderPromise
    .then((html) => {
      target.innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
      target.innerHTML = '<div class="empty-state"><p>Não foi possível carregar o conteúdo.</p></div>';
    });
}

window.loadPartial = loadPartial;
