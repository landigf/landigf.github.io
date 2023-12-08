document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('secretsanta-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const n_persone = document.getElementById('n_persone').value;

        const partecipantiContainer = document.getElementById('partecipanti-container');
        partecipantiContainer.innerHTML = "";

        for (let i = 0; i < n_persone; i++) {
            const nomeInput = document.createElement('input');
            nomeInput.type = 'text';
            nomeInput.id = `nome_${i}`;
            nomeInput.name = `nome_${i}`;
            nomeInput.placeholder = 'Inserisci il nome';
            nomeInput.required = true;

            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.id = `email_${i}`;
            emailInput.name = `email_${i}`;
            emailInput.placeholder = 'Inserisci l\'email';
            emailInput.required = true;

            const label = document.createElement('label');
            label.htmlFor = `nome_${i}`;
            label.innerText = `Partecipante ${i + 1}:`;

            partecipantiContainer.appendChild(label);
            partecipantiContainer.appendChild(nomeInput);
            partecipantiContainer.appendChild(emailInput);
            partecipantiContainer.appendChild(document.createElement('br'));
        }
    });
});
