// collect DOMs
const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Pause', 'Download']
let stateIndex = 0
let mediaRecorder, audioURL = '', isInPause = false;

// mediaRecorder setup for audio
const recordVoice = async () => {
    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
        //Mensagem de não suportado
        console.info('mediaDevices not supported..')
        return;
    }

    console.info('mediaDevices supported..')

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        let chunks = [];
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onpause = () => {
            //Mudar icone do pause pra play
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' })
            chunks = isInPause ? chunks : [];
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL

        }
    } catch (error) {
        console.error('Following error has occured : ', error)
    }
}

recordVoice();

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const pauseRecording = () => {
    stateIndex = 2
    isInPause = true;
    mediaRecorder.stop()
    application(stateIndex)
}

const continueRecording = () => {
    stateIndex = 1
    mediaRecorder.resume()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 3
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            addButton('pause', 'pauseRecording()', 'Pause record')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break
        case 'Pause':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('continue', 'record()', 'Continue record')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)
