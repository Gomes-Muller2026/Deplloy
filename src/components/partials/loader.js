function loadPartial(filePath, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return Promise.resolve();

  return fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Falha ao carregar ${filePath}`);
      return response.text();
    })
    .then((html) => {
      target.innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
      target.innerHTML = '<div class="empty-state"><p>Não foi possível carregar o conteúdo.</p></div>';
    });
}

window.loadPartial = loadPartial;
