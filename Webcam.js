// Webcam class, hay algo en educación\contenido para estudiar\webcam
import {Camera} from './Camera';

export class Webcam extends Camera {
  constructor(webcamElement, canvasElement, videoElement) {
    super();
    if (webcamElement) {
      if (webcamElement instanceof String) { // dom id

      } else {
        this.webcamElement = webcamElement;
      }
    }
    if (canvasElement) {
      if (canvasElement instanceof String) { // dom id

      } else {
        this.canvasElement = canvasElement;
      }
    }
    if (videoElement) {
      if (videoElement instanceof String) { // dom id

      } else {
        this.videoElement = videoElement;
      }
    }
    ////// This attach to a real camera
    this.resolutions = [[320, 320, 640, 800, 960, 1024, 1280, 1920, 2560], [180, 240, 480, 600, 540, 768, 720, 1080, 1440]];
    this.videoSources = [];
    this.autoPlay = false;
    this.selectedResolution = 'Normal';

    // Initialization

    var handlersVideoSourcesReady = [];
    var videoSourcesReady;
    var videoSourcesInitInProgress;
    // Ha a videoSources inicializálva van, akkor true, egyébként false.
    // Ha a visszatérési érték false, akkor a paraméterként átadott függvényt meghívja az inicializálás befejeztével.
    this.initVideoSources = (handler) => {
      if (videoSourcesReady) return true;
      if (handler != null) handlersVideoSourcesReady.push(handler);
      if (videoSourcesInitInProgress) return false;
      videoSourcesInitInProgress = true;
      navigator.mediaDevices.enumerateDevices().then(function(media_sources) {
        media_sources.forEach(function(media_source) {
          if (media_source.kind === 'videoinput') {
            this_videoSources.push(media_source);
          }
        });
        videoSourcesReady = true;
        executeFunctions(handlersVideoSourcesReady);
      });
      return false;
    };

    this.initVideoSources(null);

    function StartVideo() {
      $('.streamClientCamera').each(function() {
        $(this).get(0).play();
      });
    }

    function StopVideo(videoId) {
      var video = document.getElementById(videoId + '_video');
      video.pause();
    }

    function SetImage(videoId, imageID) {
      var video = document.getElementById(videoId + '_video');
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = document.getElementById(imageID);
      img.src = canvas.toDataURL();
    }

    function SaveImage(videoId) {
      if (!this_cameravideo[0].srcObject) {
        InitCamera('_video', this.autoPlay);
        return;
      }
      var video = this_cameravideo[0];
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = canvas.toDataURL();
      var cc = encodeURIComponent(img);
      clientAction(videoId, 'image=' + cc + '&width=' + canvas.width + '&height=' + canvas.height);
    }

    function ParseResOption(objekt) {
      var b;
      var c;
      var v;
      if (objekt.innerHTML) {
        b = objekt.selectedIndex;
        c = objekt[b];
        v = c.innerHTML;
      } else {

        var a = objekt.srcElement || objekt.currentTarget;
        b = a.selectedIndex;
        c = a[b];
        v = c.innerHTML;
      }
      return v;
    }

    function SetInitialResolution(videoId, res) {
      this.selectedResolution = res;
    }

    function InitCamera(videoId, autoplay, readycall) {
      if (!readycall) {
        $(document).ready(function() {
          InitCamera(videoId, autoplay, true);
        });
        return;
      }
      if (!initVideoSources(function() {
        InitCamera(videoId, autoplay, readycall);
      })) {
        return;
      }

      if (autoplay) {
        this.autoPlay = autoplay;
      }

      let this_cameravideo = document.getElementById('streamClientCamera');
      var cameraCombos = document.getElementById('select[id*=\'_cameraCombo\']');
      for (i = 0; i < cameraCombos.length; i++) {
        refreshCameraComboValues(cameraCombos.get(i));
      }

      if (!this.selectedCamera) {
        this.selectedCamera = this_videoSources[0];
      }

      var v = 'Normal (640x480)';
      if (this.selectedResolution) {
        v = this.selectedResolution;
      }

      if (this.autoPlay && this.selectedCamera != undefined) InitCamera_getUserMedia(v, this.selectedCamera.deviceId);
    }

    function refreshCameraComboValues(cameraCombo) {
      if (document.getElementById(cameraCombo).children().length == this_videoSources.length) return;
      this_videoSources.forEach(function addList(videoSource) {
        var option = document.createElement('option');
        option.text = option.value = videoSource.label;
        cameraCombo.add(option, 0);
        if (this_videoSources.length > 1) {
          $(cameraCombo).css('display', 'initial');
        }
      });
    }

    var cameraReady = false;
    var handlersCameraReady = [];

    function InitCamera_getUserMedia(res, CameraDeviceId) {
      if (localCameraStream) {
        localCameraStream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      var resWidth;
      var resHeight;
      switch (res) {
        case 'Low (320x240)':
          resWidth = 320;
          resHeight = 240;
          break;
        case 'Normal (640x480)':
          resWidth = 640;
          resHeight = 480;
          break;
        case 'High (1280x720)':
          resWidth = 1280;
          resHeight = 720;
          break;
      }

      var constraints = {
        video: {
          deviceId: CameraDeviceId,
          width: {
            exact: resWidth,

          },
          height: {
            exact: resHeight,
          },
        },
      };

      cameraReady = false;
      navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
    }

    var localCameraStream;

    function successCallback(stream) {
      localCameraStream = stream;
      try {
        var streamClientCameraList = $('.streamClientCamera');
        streamClientCameraList.each(function() {
          var video = $(this).get(0);
          if (video.mozSrcObject !== undefined) { // FF18a
            video.mozSrcObject = stream;
          } else if (video.srcObject !== undefined) {
            video.srcObject = stream;
          } else { // FF16a, 17a
            video.src = stream;
          }
        });
        if (this.autoPlay) {
          StartVideo();
        }
        HideError();
        cameraReady = true;
        executeFunctions(handlersCameraReady);
      } catch (e) {
        console.log('Error setting video src: ', e);
      }
    }

    function errorCallback(error) {
      ShowError(error);
    }

    function HideError() {
      $('label[id*=\'_errorLabel\']').css('display', 'none');
    }

    function ShowError(error) {

      $('label[id*=\'_errorLabel\']').css('display', 'block');
    }

    //*************************************************************
    // Stream
    //*************************************************************
    var streamVideoID;
    var streamCanvas;
    var streamingInProgress;
    var video;
    var streamTimerCamera;

    function StartStreamWhenCameraReady(videoId) {
      if (!cameraReady) {
        handlersCameraReady.push(function() {
          StartStreamIfVideoDataLoaded(videoId);
        });
        return;
      }
      StartStreamIfVideoDataLoaded(videoId);
    }

    function StartStreamIfVideoDataLoaded(videoId) {
      streamVideoID = videoId;
      streamingInProgress = true;
      video = this_cameravideo[0];
      streamCanvas = document.createElement('canvas');
      // readyState === 0, ha még nincs médiainformáció, így még a szélesség és magasság sem elérhető
      if (video.readyState === 0) {
        video.addEventListener('loadeddata', function() {
          StartStream(videoId);
        });
        return;
      }
      StartStream(videoId);
    }

    function StartStream(videoId) {
      streamCanvas.width = video.videoWidth;
      streamCanvas.height = video.videoHeight;
      if (streamTimerCamera) {
        clearTimeout(streamTimerCamera);
      }
      streamTimerCamera = setTimeout(SendFrame, 1000);
    }

    function StopStream() {
      streamingInProgress = false;
    }

    function SendFrame() {
      streamCanvas.getContext('2d').drawImage(video, 0, 0, streamCanvas.width, streamCanvas.height);
      var img = streamCanvas.toDataURL('image/jpeg');
      var cc = encodeURIComponent(img);
      socketAction(streamVideoID, 'image=' + cc + '&width=' + streamCanvas.width + '&height=' + streamCanvas.height);
      if (streamingInProgress) streamTimerCamera = setTimeout(SendFrame, 1000);
    }

    //*************************************************************
    // Support
    //*************************************************************
    function executeFunctions(handlers) {
      handlers.reverse();
      while (handlers.length) {
        var thisHandler = handlers.pop();
        thisHandler();
      }
    }

    //////
  }


  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  async setup() {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices.getUserMedia !== undefined) {
        navigator.mediaDevices.getUserMedia({
          audio: false, video: {facingMode: 'user'},
        })
          .then((mediaStream) => {
            if ('srcObject' in this.webcamElement) {
              this.webcamElement.srcObject = mediaStream;
            } else {
              // For older browsers without the srcObject.
              this.webcamElement.src = window.URL.createObjectURL(mediaStream);
            }
            this.webcamElement.addEventListener(
              'loadeddata',
              async () => {
                this.adjustVideoSize(
                  this.webcamElement.videoWidth,
                  this.webcamElement.videoHeight,
                );
                resolve();
              },
              false,
            );
          });
      } else {
        reject();
      }
    });
  }

  _drawImage() {
    const imageWidth = this.webcamElement.videoWidth;
    const imageHeight = this.webcamElement.videoHeight;

    const context = this.canvasElement.getContext('2d');
    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;

    context.drawImage(this.webcamElement, 0, 0, imageWidth, imageHeight);
    return {imageHeight, imageWidth};
  }

  takeBlobPhoto() {
    const {imageWidth, imageHeight} = this._drawImage();
    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob((blob) => {
        resolve({blob, imageHeight, imageWidth});
      });
    });
  }

  takeBase64Photo({type, quality} = {type: 'png', quality: 1}) {
    const {imageHeight, imageWidth} = this._drawImage();
    const base64 = this.canvasElement.toDataURL('image/' + type, quality);
    return {base64, imageHeight, imageWidth};
  }
}
