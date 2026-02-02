let meetingId = null;
let jitsiApi = null;

// Crear reunión
document.getElementById('btnCreate').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/meetings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                medicId: "101999550",
                patientId: "201001205556"
            })
        });

        const data = await response.json();
        if (!data.error) {
          const meetingData = data.body
          console.log(meetingData);
          meetingId = meetingData.id || meetingData.roomName;
          console.log('Reunión creada:', meetingId);
          document.getElementById('btnJoin').disabled = false;
        } else {
          console.log(data);
        }

    } catch (error) {
        console.error('Error creando la reunión', error);
    }
});

// Obtener token y unirse
document.getElementById('btnJoin').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/meetings/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meetingId,
                userId: "101999550"
            })
        });

        console.log(response);

        const data = await response.json();

        iniciarJitsi(data);

    } catch (error) {
        console.error('Error obteniendo token', error);
    }
});

function iniciarJitsi({ token, roomName, url }) {

    if (jitsiApi) {
        jitsiApi.dispose();
    }

    const domain = new URL(url).hostname;

    const options = {
        roomName: roomName,
        parentNode: document.getElementById('jitsi-container'),
        jwt: token,
        width: '100%',
        height: 600,
        configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false
        },
        interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false
        },
        userInfo: {
            displayName: 'Usuario de prueba'
        }
    };

    jitsiApi = new JitsiMeetExternalAPI(domain, options);

    jitsiApi.addEventListener('readyToClose', () => {
        console.log('Reunión cerrada');
    });
}
