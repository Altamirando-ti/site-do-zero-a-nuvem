const API_URL = 'http://localhost:3000/api/itens';

// Função para carregar os itens do banco de dados assim que a página abrir
// async function carregarItens() {
//     try {
//         const response = await fetch(API_URL);
//         const itens = await response.json();
        
//         const itemList = document.getElementById('itemList');
//         itemList.innerHTML = ''; // Limpa a lista atual

//         if (itens.length === 0) {
//             itemList.innerHTML = '<li class="empty-message">Nenhum item cadastrado ainda.</li>';
//             return;
//         }

//         // Renderiza cada item vindo do banco
//         itens.forEach(item => {
//             const li = document.createElement('li');
//             li.innerHTML = `<strong>${item.titulo}</strong>: ${item.descricao}`;
//             itemList.appendChild(li);
//         });
//     } catch (error) {
//         console.error('Erro ao conectar com o backend:', error);
//     }
// }

// Adicionado posteriormente
// Função para carregar os itens do banco de dados assim que a página abrir
async function carregarItens() {
    try {
        const response = await fetch(API_URL);
        const itens = await response.json();

        const itemList = document.getElementById('itemList');
        itemList.innerHTML = ''; // Limpa a lista atual

        if (itens.length === 0) {
            itemList.innerHTML = '<li class="empty-message">Nenhum item cadastrado ainda.</li>';
            return;
        }

        // Renderiza cada item vindo do banco com botão de excluir
        itens.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item-row');

            const textoSpan = document.createElement('span');
            textoSpan.innerHTML = `<strong>${item.titulo}</strong>: ${item.descricao}`;

            const btnExcluir = document.createElement('button');
            btnExcluir.type = 'button';
            btnExcluir.classList.add('btn-delete');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.addEventListener('click', () => excluirItem(item.id));

            li.appendChild(textoSpan);
            li.appendChild(btnExcluir);
            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao conectar com o backend:', error);
    }
}

// Função para excluir um item no backend
async function excluirItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarItens();
        } else {
            alert('Erro ao excluir o item.');
        }
    } catch (error) {
        console.error('Erro ao excluir item:', error);
    }
}

// Evento de envio do formulário
document.getElementById('itemForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, descricao })
        });

        if (response.ok) {
            // Limpa o formulário e recarrega a lista direto do banco
            document.getElementById('titulo').value = '';
            document.getElementById('descricao').value = '';
            carregarItens();
        } else {
            alert('Erro ao salvar o item.');
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
});

// Executa a busca ao carregar a página
carregarItens();