// PRIMEIRA PARTE DO EXERCÍCIO

// // Aguarda o HTML carregar completamente antes de executar o script
// document.addEventListener('DOMContentLoaded', () => {
//     const searchInput = document.getElementById('search-input');
//     const tableRows = document.querySelectorAll('#users-table tbody tr');

//     // Escuta o evento de digitação no campo de busca
//     searchInput.addEventListener('input', (event) => {
//         const searchTerm = event.target.value.toLowerCase().trim();

//         // Passa por cada linha da tabela para verificar o nome
//         tableRows.forEach(row => {
//             // Pega o texto da primeira célula (coluna Nome)
//             const userName = row.cells[0].textContent.toLowerCase();

//             // Se o nome contiver o termo digitado, mostra a linha. Se não, esconde.
//             if (userName.includes(searchTerm)) {
//                 row.style.display = '';
//             } else {
//                 row.style.display = 'none';
//             }
//         });
//     });
// });

// SEGUNDA PARTE DO EXERCÍCO

// 

// TERCEIRA PARTE DO EXERCÍCIO

// document.addEventListener('DOMContentLoaded', () => {
//     // --- LÓGICA DO FILTRO DE BUSCA ---
//     const searchInput = document.getElementById('search-input');
//     const tableRows = document.querySelectorAll('#users-table tbody tr');

//     searchInput.addEventListener('input', (event) => {
//         const searchTerm = event.target.value.toLowerCase().trim();

//         tableRows.forEach(row => {
//             const userName = row.cells[0].textContent.toLowerCase();
//             if (userName.includes(searchTerm)) {
//                 row.style.display = '';
//             } else {
//                 row.style.display = 'none';
//             }
//         });
//     });

//     // --- LÓGICA DO MODO ESCURO ---
//     const themeToggleBtn = document.getElementById('theme-toggle');

//     themeToggleBtn.addEventListener('click', () => {
//         document.body.classList.toggle('dark-mode');
//     });

//     // --- LÓGICA DE ALTERAR STATUS ---
//     const toggleButtons = document.querySelectorAll('.btn-toggle');

//     toggleButtons.forEach(button => {
//         button.addEventListener('click', (event) => {
//             // Encontra a linha (tr) onde o botão foi clicado
//             const currentRow = event.target.closest('tr');
            
//             // Seleciona o elemento do status (badge) dentro dessa linha
//             const statusBadge = currentRow.querySelector('.badge');

//             // Verifica o estado atual e faz a inversão
//             if (statusBadge.classList.contains('active')) {
//                 statusBadge.classList.remove('active');
//                 statusBadge.classList.add('inactive');
//                 statusBadge.textContent = 'Inativo';
//             } else {
//                 statusBadge.classList.remove('inactive');
//                 statusBadge.classList.add('active');
//                 statusBadge.textContent = 'Ativo';
//             }
//         });
//     });
// });

// ABAIXO O NOVO CÓDIGO

document.addEventListener('DOMContentLoaded', () => {
    // 1. LISTA INICIAL DE RESERVA
    const usuariosIniciais = [
        { nome: "Ana Silva", email: "ana.silva@example.com", ativo: true },
        { nome: "Bruno Santos", email: "bruno.santos@example.com", ativo: true },
        { nome: "Carla Oliveira", email: "carla.oliveira@example.com", ativo: true },
        { nome: "Diego Costa", email: "diego.costa@example.com", ativo: false },
        { nome: "Elena Rodrigues", email: "elena.rodrigues@example.com", ativo: true },
        { nome: "Fabio Almeida", email: "fabio.almeida@example.com", ativo: true },
        { nome: "Gabriela Lima", email: "gabriela.lima@example.com", ativo: false },
        { nome: "Henrique Souza", email: "henrique.souza@example.com", ativo: true },
        { nome: "Isabela Ribeiro", email: "isabela.ribeiro@example.com", ativo: true },
        { nome: "Joao Carvalho", email: "joao.carvalho@example.com", ativo: false }
    ];

    // 2. VARIÁVEIS DE CONTROLE DE DADOS E PAGINAÇÃO
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || usuariosIniciais;
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    let paginaAtual = 1;
    const itensPorPagina = 5;
    let listaFiltradaAtual = [...usuarios]; // Guarda os itens visíveis pós-busca

    // 3. ATUALIZAR CONTADORES DO TOPO
    function atualizarEstatisticas() {
        const total = usuarios.length;
        const ativos = usuarios.filter(u => u.ativo).length;
        const inativos = total - ativos;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-active').textContent = ativos;
        document.getElementById('stat-inactive').textContent = inativos;
    }

    // 4. FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO DA TABELA
    function renderizarTabela() {
        const tbody = document.getElementById('user-rows');
        tbody.innerHTML = '';

        // Calcula os limites da página atual
        const totalPaginas = Math.ceil(listaFiltradaAtual.length / itensPorPagina) || 1;
        
        // Garante que a página atual não passe do limite se itens forem excluídos
        if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        
        // Corta o array para exibir apenas o pedaço da página atual
        const itensDaPagina = listaFiltradaAtual.slice(inicio, fim);

        itensDaPagina.forEach((usuario) => {
            // Encontra o index real no banco principal para não perder a referência
            const indexReal = usuarios.findIndex(u => u.email === usuario.email);
            
            const tr = document.createElement('tr');
            const statusClass = usuario.ativo ? 'active' : 'inactive';
            const statusTexto = usuario.ativo ? 'Ativo' : 'Inativo';

            tr.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td><span class="badge ${statusClass}">${statusTexto}</span></td>
                <td>
                    <button class="btn-toggle" data-index="${indexReal}">Alterar</button>
                    <button class="btn-delete" data-index="${indexReal}">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Atualiza os controles visuais da paginação
        document.getElementById('page-indicator').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
        document.getElementById('btn-prev').disabled = paginaAtual === 1;
        document.getElementById('btn-next').disabled = paginaAtual === totalPaginas;

        configurarEventosBotoes();
        atualizarEstatisticas();
    }

    // 5. EVENTOS DOS BOTÕES INTERNOS DA TABELA (ALTERAR/EXCLUIR)
    function configurarEventosBotoes() {
        // Alterar Status
        document.querySelectorAll('.btn-toggle').forEach(botao => {
            botao.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                usuarios[index].ativo = !usuarios[index].ativo;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                renderizarTabela();
            });
        });

        // Excluir Usuário
        document.querySelectorAll('.btn-delete').forEach(botao => {
            botao.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (confirm(`Excluir o usuário ${usuarios[index].nome}?`)) {
                    usuarios.splice(index, 1);
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    
                    // Atualiza a lista filtrada para refletir a remoção imediatamente
                    const searchInput = document.getElementById('search-input');
                    const termo = searchInput.value.toLowerCase().trim();
                    listaFiltradaAtual = usuarios.filter(u => u.nome.toLowerCase().includes(termo));
                    
                    renderizarTabela();
                }
            });
        });
    }

    // 6. EVENTOS DOS BOTÕES DE PAGINAÇÃO (PRÓXIMO/ANTERIOR)
    document.getElementById('btn-prev').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarTabela();
        }
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        const totalPaginas = Math.ceil(listaFiltradaAtual.length / itensPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarTabela();
        }
    });

    // 7. CADASTRO DE NOVO USUÁRIO
    const userForm = document.getElementById('user-form');
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('new-name');
        const emailInput = document.getElementById('new-email');
        const emailDigitado = emailInput.value.trim().toLowerCase();

        const emailJaExiste = usuarios.some(u => u.email.toLowerCase() === emailDigitado);
        if (emailJaExiste) {
            alert(`O e-mail "${emailInput.value}" já está cadastrado!`);
            emailInput.focus();
            return;
        }

        const novoUsuario = { nome: nameInput.value.trim(), email: emailInput.value.trim(), ativo: true };
        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Reseta o filtro de busca ao cadastrar para o usuário ver o novo item na última página
        document.getElementById('search-input').value = '';
        listaFiltradaAtual = [...usuarios];
        paginaAtual = Math.ceil(listaFiltradaAtual.length / itensPorPagina);
        
        renderizarTabela();
        userForm.reset();
    });

    // 8. FILTRO DE BUSCA (Reseta para a página 1 ao buscar)
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (event) => {
        const termoBusca = event.target.value.toLowerCase().trim();
        listaFiltradaAtual = usuarios.filter(u => u.nome.toLowerCase().includes(termoBusca));
        paginaAtual = 1; 
        renderizarTabela();
    });

    // 9. MODO ESCURO
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Inicialização da primeira tela
    renderizarTabela();

        // --- LÓGICA DE EXPORTAR PARA CSV ---
    const btnExport = document.getElementById('btn-export');

    btnExport.addEventListener('click', () => {
        // 1. Define o cabeçalho do arquivo CSV
        let csvContent = "Nome;E-mail;Status\n";

        // 2. Passa por cada usuário convertendo os dados em linhas de texto
        usuarios.forEach(usuario => {
            const statusTexto = usuario.ativo ? 'Ativo' : 'Inativo';
            // Substitui eventuais pontos e vírgulas do input para não quebrar as colunas do CSV
            const nomeFormatado = usuario.nome.replace(/;/g, ','); 
            
            csvContent += `${nomeFormatado};${usuario.email};${statusTexto}\n`;
        });

        // 3. Cria um arquivo virtual em formato de texto usando o padrão de caracteres UTF-8
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // 4. Cria um link oculto na memória do navegador para forçar o download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", "usuarios_dashboard.csv");
        link.style.visibility = 'hidden';
        
        // 5. Adiciona o link na página, simula o clique do usuário e o remove em seguida
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

});


