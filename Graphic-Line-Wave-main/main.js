document.addEventListener('DOMContentLoaded', function() {
    console.log('全畫面波浪動畫已載入！');
    
    // 建立 canvas 元素並插入 body
    let canvas = document.getElementById('waveCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'waveCanvas';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    // 設定基本參數，使用隨機值
    const verticalCenter = window.innerHeight * (0.3 + Math.random() * 0.4); // 隨機位置在畫面30%-70%之間
    let baseAmplitude = (97.5 + Math.random() * 39); // 增加 30%（從 75-105 增加到 97.5-136.5）
    
    // 波形參數 - 使用隨機值初始化
    const waveParams = {
        frequency: (0.0013 + Math.random() * 0.00195), // 增加 30%
        phase: Math.random() * Math.PI * 2, // 隨機相位
        speed: 0.01 + Math.random() * 0.02, // 隨機速度
        horizontalSpeed: 1 + Math.random() * 0.5, // 水平移動速度 (每幀移動的像素數)
        floatSpeed: 0.0008 + Math.random() * 0.0004, // 飄浮速度
        floatAmplitude: 30 + Math.random() * 20 // 飄浮幅度
    };
    
    // 用於創建自然變化的多個波
    const subWaves = [
        { 
            frequency: waveParams.frequency * (0.325 + Math.random() * 0.13), // 增加 30%
            amplitude: baseAmplitude * 0.195, // 增加 30%
            speed: waveParams.speed * 0.7,
            phase: Math.random() * Math.PI * 2
        },
        { 
            frequency: waveParams.frequency * (0.975 + Math.random() * 0.195), // 增加 30%
            amplitude: baseAmplitude * 0.0975, // 增加 30%
            speed: waveParams.speed * 1.3,
            phase: Math.random() * Math.PI * 2
        }
    ];
    
    // 新增兩條波浪線的參數
    const additionalWaves = [
        { frequency: waveParams.frequency * 1.2, amplitude: baseAmplitude * 0.8, speed: waveParams.speed * 1.1, phase: Math.random() * Math.PI * 2 },
        { frequency: waveParams.frequency * 0.8, amplitude: baseAmplitude * 1.2, speed: waveParams.speed * 0.9, phase: Math.random() * Math.PI * 2 }
    ];
    
    // 時間變數
    let time = Math.random() * 100; // 隨機的起始時間
    
    // 水平偏移量 - 用於實現右至左的移動
    let horizontalOffset = 0;
    
    // 儲存前一幀的波形，用於高比例平滑過渡
    let previousWavePoints = [];
    
    // 延伸參數 - 讓線條延伸到畫面外
    const extensionFactor = 0.3; // 每側延伸畫面寬度的30%

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // 重設前一幀波形
        previousWavePoints = Array(Math.ceil(canvas.width * (1 + extensionFactor * 2))).fill(verticalCenter);
    }

    // 使用平滑曲線繪製波浪
    function drawSmoothWave(points) {
        if (points.length < 2) return;
        
        const startX = -canvas.width * extensionFactor;
        
        ctx.beginPath();
        ctx.moveTo(startX, points[0]);
        
        // 使用平滑的曲線連接點
        for (let i = 1; i < points.length; i++) {
            const x = startX + i;
            ctx.lineTo(x, points[i]);
        }
        
        ctx.stroke();
    }
    
    // 自然平滑波形函數 - 加入水平偏移
    function generateWavePoint(x, time, offset) {
        // 添加水平偏移，實現右至左移動
        const adjustedX = x + offset;
        
        // 主波
        let value = Math.sin(adjustedX * waveParams.frequency + time * waveParams.speed + waveParams.phase) * baseAmplitude;
        
        // 添加子波，創造更自然的波形
        for (const wave of subWaves) {
            value += Math.sin(adjustedX * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
        }
        
        return value;
    }

    function drawWave() {
        time += 0.01;
        horizontalOffset += waveParams.horizontalSpeed;
        const verticalShift = Math.sin(time * waveParams.floatSpeed) * waveParams.floatAmplitude;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 繪製主波浪
        const totalWidth = Math.ceil(canvas.width * (1 + extensionFactor * 2));
        const currentWavePoints = [];

        for (let i = 0; i < totalWidth; i++) {
            const x = i;
            const waveValue = Math.sin(x * waveParams.frequency + time * waveParams.speed + waveParams.phase) * baseAmplitude;
            let y = verticalCenter + waveValue + verticalShift;
            if (previousWavePoints[i]) {
                y = previousWavePoints[i] * 0.85 + y * 0.15;
            }
            currentWavePoints[i] = y;
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 0.5;
        drawSmoothWave(currentWavePoints);

        // 繪製額外的波浪
        additionalWaves.forEach(wave => {
            const additionalWavePoints = [];
            for (let i = 0; i < totalWidth; i++) {
                const x = i;
                const waveValue = Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
                let y = verticalCenter + waveValue + verticalShift;
                if (previousWavePoints[i]) {
                    y = previousWavePoints[i] * 0.85 + y * 0.15;
                }
                additionalWavePoints[i] = y;
            }

            ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
            ctx.lineWidth = 0.5;
            drawSmoothWave(additionalWavePoints);
        });

        previousWavePoints = [...currentWavePoints];
        requestAnimationFrame(drawWave);
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
    });
    
    resizeCanvas();
    // 開始動畫循環
    requestAnimationFrame(drawWave);
});

// 新增 Web Serial API 支援，接收 Arduino 數據並更新波浪振幅
async function connectToArduino() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const decoder = new TextDecoderStream();
        const inputDone = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;

        const reader = inputStream.getReader();
        console.log("Connected to Arduino!");

        // 持續讀取 Arduino 傳輸的數據
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Arduino connection closed.");
                break;
            }
            if (value) {
                const potValue = parseInt(value.trim(), 10);
                if (!isNaN(potValue)) {
                    updateWaveAmplitude(potValue);
                }
            }
        }
    } catch (error) {
        console.error("Error connecting to Arduino:", error);
    }
}

// 更新波浪振幅
function updateWaveAmplitude(potValue) {
    const normalizedValue = potValue / 1023; // 將值歸一化到 0-1
    baseAmplitude = 200 + normalizedValue * 300; // 動態調整振幅範圍
    console.log("Updated amplitude:", baseAmplitude);
}

// 在頁面加載後自動連接 Arduino
window.addEventListener("DOMContentLoaded", () => {
    const connectButton = document.createElement("button");
    connectButton.textContent = "Connect to Arduino";
    connectButton.style.position = "absolute";
    connectButton.style.top = "10px";
    connectButton.style.left = "10px";
    connectButton.style.zIndex = "10";
    document.body.appendChild(connectButton);

    connectButton.addEventListener("click", connectToArduino);
});