document.addEventListener('DOMContentLoaded', function() {
    const bannerWrapper = document.querySelector('.banner-wrapper');
    const coinsRain = document.querySelector('.coins-rain');
    const coinsGroup = document.querySelector('.coins-group');
    const bannerText = document.querySelector('.banner-text');
    const cryptoBadges = document.querySelector('.crypto-badges');

    let coinRainTimeout = null;
    let levitationFrameId = null;
    let isAnimating = false;
    let positionX = 0;
    let positionY = 0;
    let rotation = 0;
    let targetX = 0;
    let targetY = 0;
    let targetRotation = 0;
    let lastUpdate = Date.now();

    // URLs монет
    const coinUrls = [
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_90f202c2c649cbf8fc0a731b3f9c36a9.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_cd07e8d0f61f479fba3e7ac0ef6aaa93.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_8614dbe064d78a119fac238ae65a6e79.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_dabb3062160bd8148188326ab9bd9519.png'
    ];

    // Создание одной монеты
    function createCoin() {
        if (!isAnimating) return;

        const coin = document.createElement('img');
        coin.src = coinUrls[Math.floor(Math.random() * coinUrls.length)];
        coin.className = 'coin';

        // Размер монеты относительно ширины баннера (от 2% до 5.5%)
        const bannerWidth = bannerWrapper.offsetWidth;
        const minSize = bannerWidth * 0.02; // 2% от ширины баннера
        const maxSize = bannerWidth * 0.055; // 5.5% от ширины баннера
        const size = minSize + Math.random() * (maxSize - minSize);
        coin.style.width = size + 'px';

        // Случайная начальная позиция по горизонтали
        const bannerHeight = bannerWrapper.offsetHeight;
        const startX = Math.random() * 100;
        const startY = -150;
        const endY = bannerHeight + 150;
        const drift = (Math.random() - 0.5) * 60;
        const endX = startX + drift;
        const coinRotation = Math.random() * 720 - 360; // больше вращения
        const duration = 6 + Math.random() * 4; // 6-10 секунд для постоянного присутствия монет

        coin.style.left = startX + '%';
        coin.style.top = startY + 'px';

        coinsRain.appendChild(coin);

        // Плавная анимация с ease-out для естественного падения
        coin.style.opacity = '1';
        coin.style.transition = `top ${duration}s ease-out, left ${duration}s ease-in-out, transform ${duration}s ease-in-out, opacity 0.8s ease-out`;

        // Запускаем сразу
        requestAnimationFrame(() => {
            coin.style.top = endY + 'px';
            coin.style.left = endX + '%';
            coin.style.transform = `rotate(${coinRotation}deg)`;
        });

        // Плавное исчезновение в конце
        setTimeout(() => {
            coin.style.opacity = '0';
        }, duration * 1000 - 800);

        // Удаляем монету после анимации
        setTimeout(() => {
            coin.remove();
        }, duration * 1000 + 500);
    }

    // Левитация основной группы монет
    function animateCoinsGroup() {
        if (!isAnimating) return;

        const now = Date.now();

        // Обновляем целевые значения только раз в 3.5 секунды
        if (now - lastUpdate > 3500) {
            targetX = (Math.random() - 0.5) * 12; // от -6% до 6%
            targetY = (Math.random() - 0.5) * 16; // от -8% до 8%
            targetRotation = (Math.random() - 0.5) * 8; // от -4deg до 4deg
            lastUpdate = now;
        }

        // Супер плавное движение
        positionX += (targetX - positionX) * 0.008;
        positionY += (targetY - positionY) * 0.008;
        rotation += (targetRotation - rotation) * 0.008;

        // Применяем трансформацию
        if (coinsGroup) {
            coinsGroup.style.transform = `translateX(${positionX}%) translateY(${positionY}%) rotate(${rotation}deg)`;
        }

        levitationFrameId = requestAnimationFrame(animateCoinsGroup);
    }

    // Создаем монеты с интервалом
    function startCoinRain() {
        if (!isAnimating) return;

        createCoin();
        const nextCoinDelay = 400 + Math.random() * 300; // 400-700ms для стабильного дождя
        coinRainTimeout = setTimeout(startCoinRain, nextCoinDelay);
    }

    // Остановка всех анимаций
    function stopAnimations() {
        isAnimating = false;

        // Останавливаем монетный дождь
        if (coinRainTimeout) {
            clearTimeout(coinRainTimeout);
            coinRainTimeout = null;
        }

        // Останавливаем левитацию
        if (levitationFrameId) {
            cancelAnimationFrame(levitationFrameId);
            levitationFrameId = null;
        }

        // Удаляем все падающие монеты
        const coins = coinsRain.querySelectorAll('.coin');
        coins.forEach(coin => coin.remove());
    }

    // Перезапуск всех анимаций
    function restartAnimations() {
        // Сначала останавливаем всё
        stopAnimations();

        // Сбрасываем CSS анимации элементов
        if (bannerText) {
            bannerText.style.animation = 'none';
            void bannerText.offsetHeight; // Принудительный reflow
            bannerText.style.animation = '';
        }

        if (coinsGroup) {
            coinsGroup.style.animation = 'none';
            void coinsGroup.offsetHeight;
            coinsGroup.style.animation = '';
            // Сбрасываем transform
            coinsGroup.style.transform = '';
        }

        if (cryptoBadges) {
            cryptoBadges.style.animation = 'none';
            void cryptoBadges.offsetHeight;
            cryptoBadges.style.animation = '';
        }

        // Сбрасываем переменные левитации
        positionX = 0;
        positionY = 0;
        rotation = 0;
        targetX = 0;
        targetY = 0;
        targetRotation = 0;
        lastUpdate = Date.now();

        // Запускаем анимации заново
        isAnimating = true;

        // Запускаем монетный дождь сразу без паузы
        startCoinRain();

        // Запускаем левитацию после выезда группы монет (2 секунды)
        setTimeout(() => {
            if (isAnimating) {
                animateCoinsGroup();
            }
        }, 2000);
    }

    // Intersection Observer для отслеживания видимости баннера
    const observerOptions = {
        root: null, // относительно viewport
        rootMargin: '0px',
        threshold: 0.5 // баннер виден хотя бы на 50%
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Баннер стал видимым - перезапускаем анимации
                console.log('Banner is visible - restarting animations');
                restartAnimations();
            } else {
                // Баннер скрылся - останавливаем анимации для экономии ресурсов
                console.log('Banner is hidden - stopping animations');
                stopAnimations();
            }
        });
    }, observerOptions);

    // Начинаем наблюдение за баннером
    observer.observe(bannerWrapper);

    // Клик по баннеру
    bannerWrapper.addEventListener('click', function() {
        console.log('Banner clicked!');
        // Здесь можно добавить переход на нужную страницу
        // window.location.href = 'https://your-link-here.com';
    });

    // Добавляем курсор pointer на весь баннер
    bannerWrapper.style.cursor = 'pointer';

    // ВСЕГДА запускаем анимации сразу при загрузке
    restartAnimations();
});
