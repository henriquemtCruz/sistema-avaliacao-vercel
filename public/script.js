document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-btn');
    const reviewInput = document.getElementById('review-input');
    const message = document.getElementById('message');
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
});