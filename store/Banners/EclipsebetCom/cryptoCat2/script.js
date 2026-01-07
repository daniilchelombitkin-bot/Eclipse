document.addEventListener('DOMContentLoaded', function() {
    const bannerWrapper = document.querySelector('.banner-wrapper');
    const coinsRain = document.querySelector('.coins-rain');

    // URLs монет
    const coinUrls = [
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_90f202c2c649cbf8fc0a731b3f9c36a9.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_cd07e8d0f61f479fba3e7ac0ef6aaa93.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_8614dbe064d78a119fac238ae65a6e79.png',
        'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_dabb3062160bd8148188326ab9bd9519.png'
    ];

    // Создание одной монеты
    function createCoin() {
        const coin = document.createElement('img');
        coin.src = coinUrls[Math.floor(Math.random() * coinUrls.length)];
        coin.className = 'coin';

        // Размер монеты относительно ширины баннера (от 2% до 6%)
        const bannerWidth = bannerWrapper.offsetWidth;
        const minSize = bannerWidth * 0.02; // 2% от ширины баннера
        const maxSize = bannerWidth * 0.06; // 6% от ширины баннера
        const size = minSize + Math.random() * (maxSize - minSize);
        coin.style.width = size + 'px';

        // Случайная начальная позиция по горизонтали
        const bannerHeight = bannerWrapper.offsetHeight;
        const startX = Math.random() * 100;
        const startY = -150;
        const endY = bannerHeight + 150;
        const drift = (Math.random() - 0.5) * 50;
        const endX = startX + drift;
        const rotation = Math.random() * 360 - 180;
        const duration = 8 + Math.random() * 6; // 8-14 секунд

        coin.style.left = startX + '%';
        coin.style.top = startY + 'px';

        coinsRain.appendChild(coin);

        // Плавная анимация с ease-out для естественного падения
        coin.style.opacity = '1';
        coin.style.transition = `top ${duration}s ease-out, left ${duration}s ease-in-out, transform ${duration}s ease-in-out`;

        // Запускаем сразу
        requestAnimationFrame(() => {
            coin.style.top = endY + 'px';
            coin.style.left = endX + '%';
            coin.style.transform = `rotate(${rotation}deg)`;
        });

        // Удаляем монету после анимации
        setTimeout(() => {
            coin.remove();
        }, duration * 1000 + 500);
    }

    // Левитация основной группы монет - больший диапазон
    const coinsGroup = document.querySelector('.coins-group');
    let positionX = 0;
    let positionY = 0;
    let rotation = 0;
    let targetX = 0;
    let targetY = 0;
    let targetRotation = 0;
    let lastUpdate = Date.now();

    function animateCoinsGroup() {
        const now = Date.now();

        // Обновляем целевые значения только раз в 3.5 секунды
        if (now - lastUpdate > 3500) {
            targetX = (Math.random() - 0.5) * 12; // от -6% до 6% (увеличено в 2 раза)
            targetY = (Math.random() - 0.5) * 16; // от -8% до 8% (увеличено в 2 раза)
            targetRotation = (Math.random() - 0.5) * 8; // от -4deg до 4deg (увеличено в 2 раза)
            lastUpdate = now;
        }

        // Супер плавное движение - почти незаметный переход
        positionX += (targetX - positionX) * 0.008;
        positionY += (targetY - positionY) * 0.008;
        rotation += (targetRotation - rotation) * 0.008;

        // Применяем трансформацию
        if (coinsGroup) {
            coinsGroup.style.transform = `translateX(${positionX}%) translateY(${positionY}%) rotate(${rotation}deg)`;
        }

        requestAnimationFrame(animateCoinsGroup);
    }

    // Запускаем левитацию основной группы монет после выезда (1s задержка + 1s анимация = 2s)
    if (coinsGroup) {
        setTimeout(() => {
            animateCoinsGroup();
        }, 2000);
    }

    // Создаем монеты с интервалом - меньше задержки
    function startCoinRain() {
        createCoin();
        const nextCoinDelay = 600 + Math.random() * 800; // 0.6-1.4 секунды между монетами (быстрее)
        setTimeout(startCoinRain, nextCoinDelay);
    }

    // Запускаем монетный дождь сразу
    startCoinRain();

    // Клик по баннеру
    bannerWrapper.addEventListener('click', function() {
        console.log('Banner clicked!');
        // Здесь можно добавить переход на нужную страницу
        // window.location.href = 'https://your-link-here.com';
    });

    // Добавляем курсор pointer на весь баннер
    bannerWrapper.style.cursor = 'pointer';
});
