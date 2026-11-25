document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita recarregar a página

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    const itemList = document.getElementById('itemList');

    // Remove a mensagem de "vazio" se for o primeiro item
    const emptyMsg = itemList.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Cria o elemento visual na lista
    const li = document.createElement('li');
    li.innerHTML = `<strong>${titulo}</strong>: ${descricao}`;
    itemList.appendChild(li);

    // Limpa o formulário
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
});