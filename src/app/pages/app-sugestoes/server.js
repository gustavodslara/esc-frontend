document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("modalSugestao");
    const btn = document.getElementById("btnNovaSugestao");
    const span = document.getElementsByClassName("close")[0];
    const form = document.getElementById("formSugestao");
    const muralSugestoes = document.getElementById("muralSugestoes");

    // Abrir modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // Fechar modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Fechar modal clicando fora
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Submissão do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Captura os dados do formulário
        const nome = document.getElementById('nome').value || "Anônimo";
        const sugestaoTexto = document.getElementById('sugestao').value;
        const motivo = document.getElementById('motivo').value;
        const atribuir = document.getElementById('atribuir').value || "Não atribuído";

        // Gera a data atual
        const dataAtual = new Date().toLocaleDateString();

        // Cria o novo card de sugestão
        const novoCard = document.createElement('div');
        novoCard.classList.add('card');
        novoCard.innerHTML = `
            <h3>${nome}</h3>
            <p><strong>Sugestão:</strong> ${sugestaoTexto}</p>
            <p><strong>Motivo:</strong> ${motivo}</p>
            <p><strong>A quem se atribui:</strong> ${atribuir}</p>
            <p class="data">Data: ${dataAtual}</p>
        `;

        // Adiciona o novo card ao mural
        muralSugestoes.insertBefore(novoCard, muralSugestoes.firstChild);

        // Limpa o formulário e fecha o modal
        form.reset();
        modal.style.display = "none";
    });
});
