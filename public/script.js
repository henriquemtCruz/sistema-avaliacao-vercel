document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-btn');
    const reviewInput = document.getElementById('review-input');
    const message = document.getElementById('message');
    const reviewsList = document.getElementById('reviews-list');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            rating = parseInt(star.dataset.value);
            updateStars(rating);
            submitBtn.disabled = false;
        });
    });

    function updateStars(rate) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rate) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    async function loadReviews() {
        try {
            const response = await fetch('/api/rate'); // agora GET no mesmo endpoint
            const reviews = await response.json();
    
            reviewsList.innerHTML = '';
            reviews.slice(0, 5).forEach(r => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
                    <p>${r.review || 'Sem comentário'}</p>
                `;
                reviewsList.appendChild(li);
            });
        } catch (error) {
            reviewsList.innerHTML = '<li>Erro ao carregar avaliações.</li>';
        }
    }
    

    submitBtn.addEventListener('click', async () => {
        const review = reviewInput.value;
        submitBtn.disabled = true;
        message.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, review })
            });

            const result = await response.json();
            if (response.ok) {
                message.textContent = 'Obrigado por sua avaliação!';
                reviewInput.value = '';
                rating = 0;
                updateStars(0);
                loadReviews(); // recarregar lista
                setTimeout(() => {
                    message.textContent = '';
                }, 3000);
            } else {
                throw new Error(result.error || 'Erro ao enviar avaliação.');
            }
        } catch (error) {
            message.textContent = `Erro: ${error.message}`;
            submitBtn.disabled = false;
        }
    });

    // carregar avaliações ao iniciar
    loadReviews();
});
