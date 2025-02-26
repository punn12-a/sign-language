function translateText() {
    let text = document.getElementById("textInput").value.trim();
    let output = document.getElementById("output");

    if (text === "") {
        output.innerHTML = "<p style='color:red;'>กรุณากรอกข้อความ</p>";
        return;
    }

    output.innerHTML = "<p style='color:blue;'>กำลังแสดงแอนิเมชันภาษามือ...</p>";

    setTimeout(() => {
        output.innerHTML = ""; // ล้างข้อความ
        createHandModel();
    }, 1000);
}

function createHandModel() {
    let output = document.getElementById("output");
    output.innerHTML = "";

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, 300 / 300, 1, 1000);
    let renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(300, 300);
    output.appendChild(renderer.domElement);

    let light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    let handGeometry = new THREE.BoxGeometry(1.5, 1, 0.5);
    let material = new THREE.MeshBasicMaterial({ color: 0xf5c542 });
    let hand = new THREE.Mesh(handGeometry, material);
    scene.add(hand);

    let fingers = [];
    let fingerPositions = [-0.6, -0.3, 0, 0.3, 0.6];

    for (let i = 0; i < 5; i++) {
        let fingerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 10);
        let finger = new THREE.Mesh(fingerGeometry, material);
        finger.position.set(fingerPositions[i], 0.6, 0);
        scene.add(finger);
        fingers.push(finger);
    }

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        hand.rotation.y += 0.01;
        fingers.forEach(finger => finger.rotation.x += 0.02);
        renderer.render(scene, camera);
    }

    animate();
}

function startSpeech() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "th-TH";

    recognition.onstart = function () {
        document.getElementById("output").innerHTML = "<p style='color:blue;'>🎤 กำลังฟัง...</p>";
    };

    recognition.onspeechend = function () {
        document.getElementById("output").innerHTML = "<p style='color:blue;'>⏳ กำลังประมวลผล...</p>";
        recognition.stop();
    };

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("textInput").value = transcript;
        translateText();
    };

    recognition.start();
}
