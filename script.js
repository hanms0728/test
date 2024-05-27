document.addEventListener('DOMContentLoaded', (event) => {
    const serverURL = window.SERVER_URL;
    const weightSlider = document.getElementById('weight');
    const weightValue = document.getElementById('weightValue');
    const weightForm = document.getElementById('weightForm');
    const resultDiv = document.getElementById('result');
    const weightList = document.getElementById('weightList');
    const fetchWeightsButton = document.getElementById('fetchWeightsButton');
    const closeWeightsButton = document.getElementById('closeWeightsButton');
    const startGameButton = document.getElementById('startGameButton');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');

    // 슬라이더의 초기 값 설정
    weightValue.textContent = weightSlider.value;

    // 슬라이더 값 변경 이벤트 리스너
    weightSlider.addEventListener('input', (e) => {
        weightValue.textContent = e.target.value;
    });

    // 폼 제출 이벤트 리스너
    weightForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const weight = parseInt(weightSlider.value, 10);

        // 이미지를 표시
        const img = document.createElement('img');
        img.src = weight > 50 ? 'hamster.jpg' : 'nohamster.jpg';
        img.alt = weight > 50 ? 'Hamster' : 'No Hamster';
        img.style.width = '150px';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(img);

        // 서버에 데이터 전송
        try {
            const response = await fetch(`${serverURL}/weights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight }),
            });

            if (response.ok) {
                console.log('Weight saved successfully!');
            } else {
                console.error('Error saving weight');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // 서버로부터 데이터를 불러오는 함수
    async function fetchWeights() {
        try {
            const response = await fetch('http://localhost:3000/weights');
            if (response.ok) {
                const weights = await response.json();
                displayWeights(weights);
            } else {
                console.error('Error fetching weights');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // 불러온 데이터를 표시하는 함수
    function displayWeights(weights) {
        weightList.innerHTML = '';
        weights.forEach(weight => {
            const li = document.createElement('li');
            li.textContent = `Weight: ${weight.weight} kg, Date: ${new Date(weight.date).toLocaleString()}`;
            weightList.appendChild(li);
        });
    }

    // 데이터 숨기기
    function closeWeights() {
        weightList.innerHTML = '';
    }

    // 버튼 클릭 이벤트 리스너 추가
    fetchWeightsButton.addEventListener('click', fetchWeights);
    closeWeightsButton.addEventListener('click', closeWeights);

    // 이미지 갤러리 클릭 이벤트
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach(image => {
        image.addEventListener('click', (e) => {
            const src = e.target.src;
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.cursor = 'pointer';
            const img = document.createElement('img');
            img.src = src;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            modal.appendChild(img);
            document.body.appendChild(modal);
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
    });

    // 이미지 슬라이더
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slides');
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    };
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // 3초마다 슬라이드 변경

    // 게임 변수 설정
    let hamster = { x: 50, y: 200, width: 50, height: 50, dx: 2, dy: 2 };
    let sandbag = { x: 700, y: 200, width: 50, height: 50 };
    let score = 0;

    function drawHamster() {
        ctx.fillStyle = 'brown';
        ctx.fillRect(hamster.x, hamster.y, hamster.width, hamster.height);
    }

    function drawSandbag() {
        ctx.fillStyle = 'grey';
        ctx.fillRect(sandbag.x, sandbag.y, sandbag.width, sandbag.height);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateHamster() {
        if (hamster.x + hamster.width > canvas.width || hamster.x < 0) {
            hamster.dx *= -1;
        }
        if (hamster.y + hamster.height > canvas.height || hamster.y < 0) {
            hamster.dy *= -1;
        }
        hamster.x += hamster.dx;
        hamster.y += hamster.dy;
    }

    function checkCollision() {
        if (
            hamster.x < sandbag.x + sandbag.width &&
            hamster.x + hamster.width > sandbag.x &&
            hamster.y < sandbag.y + sandbag.height &&
            hamster.y + hamster.height > sandbag.y
        ) {
            return true;
        }
        return false;
    }

    function updateScore() {
        if (checkCollision()) {
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
            // 샌드백의 위치를 랜덤하게 이동
            sandbag.x = Math.random() * (canvas.width - sandbag.width);
            sandbag.y = Math.random() * (canvas.height - sandbag.height);
        }
    }

    function gameLoop() {
        clearCanvas();
        drawHamster();
        drawSandbag();
        updateHamster();
        updateScore();
        requestAnimationFrame(gameLoop);
    }

    startGameButton.addEventListener('click', () => {
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameLoop();
    });
});
