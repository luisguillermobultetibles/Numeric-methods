const EventEmitter = require('events');
const ZXing = require('./zxing')();
const Visibility = require('visibilityjs');
const StateMachine = require('fsm-as-promised');

// eslint-disable-next-line require-jsdoc
class ScanProvider {
  constructor(emitter, analyzer, captureImage, scanPeriod, refractoryPeriod) {
    this.scanPeriod = scanPeriod;
    this.captureImage = captureImage;
    this.refractoryPeriod = refractoryPeriod;
    this._emitter = emitter;
    this._frameCount = 0;
    this._analyzer = analyzer;
    this._lastResult = null;
    this._active = false;
  }

  start() {
    this._active = true;
    requestAnimationFrame(() => this._scan());
  }

  stop() {
    this._active = false;
  }

  scan() {
    return this._analyze(false);
  }

  _analyze(skipDups) {
    const analysis = this._analyzer.analyze();
    if (!analysis) {
      return null;
    }

    const {result, canvas} = analysis;
    if (!result) {
      return null;
    }

    if (skipDups && result === this._lastResult) {
      return null;
    }

    clearTimeout(this.refractoryTimeout);
    this.refractoryTimeout = setTimeout(() => {
      this._lastResult = null;
    }, this.refractoryPeriod);

    // eslint-disable-next-line max-len
    const image = this.captureImage ? canvas.toDataURL('image/webp', 0.8) : null;

    this._lastResult = result;

    const payload = {content: result};
    if (image) {
      payload.image = image;
    }

    return payload;
  }

  _scan() {
    if (!this._active) {
      return;
    }

    requestAnimationFrame(() => this._scan());

    if (++this._frameCount !== this.scanPeriod) {
      return;
    } else {
      this._frameCount = 0;
    }

    const result = this._analyze(true);
    if (result) {
      setTimeout(() => {
        this._emitter.emit('scan', result.content, result.image || null);
      }, 0);
    }
  }
}

class Analyzer {
  constructor(video) {
    this.video = video;

    this.imageBuffer = null;
    this.sensorLeft = null;
    this.sensorTop = null;
    this.sensorWidth = null;
    this.sensorHeight = null;

    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    this.canvasContext = null;

    this.decodeCallback = ZXing.Runtime.addFunction(
      (ptr, len, resultIndex, resultCount) => {
        const result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len);
        const str = String.fromCharCode.apply(null, result);
        if (resultIndex === 0) {
          window.zxDecodeResult = '';
        }
        window.zxDecodeResult += str;
      });
  }

  analyze() {
    if (!this.video.videoWidth) {
      return null;
    }

    if (!this.imageBuffer) {
      const videoWidth = this.video.videoWidth;
      const videoHeight = this.video.videoHeight;

      this.sensorWidth = videoWidth;
      this.sensorHeight = videoHeight;
      this.sensorLeft = Math.floor((videoWidth / 2) - (this.sensorWidth / 2));
      this.sensorTop = Math.floor((videoHeight / 2) - (this.sensorHeight / 2));

      this.canvas.width = this.sensorWidth;
      this.canvas.height = this.sensorHeight;

      this.canvasContext = this.canvas.getContext('2d');
      this.imageBuffer = ZXing._resize(this.sensorWidth, this.sensorHeight);
      return null;
    }

    this.canvasContext.drawImage(
      this.video,
      this.sensorLeft,
      this.sensorTop,
      this.sensorWidth,
      this.sensorHeight,
    );

    // eslint-disable-next-line max-len
    const data = this.canvasContext.getImageData(0, 0, this.sensorWidth, this.sensorHeight).data;
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      ZXing.HEAPU8[this.imageBuffer + j] = Math.trunc((r + g + b) / 3);
    }

    const err = ZXing._decode_qr(this.decodeCallback);
    if (err) {
      return null;
    }

    const result = window.zxDecodeResult;
    if (result != null) {
      return {result: result, canvas: this.canvas};
    }

    return null;
  }
}

export class Scanner extends EventEmitter {
  constructor(opts) {
    super();

    this.video = this._configureVideo(opts);
    this.mirror = (opts.mirror !== false);
    this.backgroundScan = (opts.backgroundScan !== false);
    this._continuous = (opts.continuous !== false);
    this._analyzer = new Analyzer(this.video);
    this._camera = null;

    const captureImage = opts.captureImage || false;
    const scanPeriod = opts.scanPeriod || 1;
    const refractoryPeriod = opts.refractoryPeriod || (5 * 1000);

    this._scanner = new ScanProvider(this, this._analyzer, captureImage, scanPeriod, refractoryPeriod);
    this._fsm = this._createStateMachine();

    Visibility.change((e, state) => {
      if (state === 'visible') {
        setTimeout(() => {
          if (this._fsm.can('activate')) {
            this._fsm.activate();
          }
        }, 0);
      } else {
        if (!this.backgroundScan && this._fsm.can('deactivate')) {
          this._fsm.deactivate();
        }
      }
    });

    this.addListener('active', () => {
      this.video.classList.remove('inactive');
      this.video.classList.add('active');
    });

    this.addListener('inactive', () => {
      this.video.classList.remove('active');
      this.video.classList.add('inactive');
    });

    this.emit('inactive');
  }

  scan() {
    return this._scanner.scan();
  }

  async start(camera = null) {
    if (this._fsm.can('start')) {
      await this._fsm.start(camera);
    } else {
      await this._fsm.stop();
      await this._fsm.start(camera);
    }
  }

  async stop() {
    if (this._fsm.can('stop')) {
      await this._fsm.stop();
    }
  }

  set captureImage(capture) {
    this._scanner.captureImage = capture;
  }

  get captureImage() {
    return this._scanner.captureImage;
  }

  set scanPeriod(period) {
    this._scanner.scanPeriod = period;
  }

  get scanPeriod() {
    return this._scanner.scanPeriod;
  }

  set refractoryPeriod(period) {
    this._scanner.refractoryPeriod = period;
  }

  get refractoryPeriod() {
    return this._scanner.refractoryPeriod;
  }

  set continuous(continuous) {
    this._continuous = continuous;

    if (continuous && this._fsm.current === 'active') {
      this._scanner.start();
    } else {
      this._scanner.stop();
    }
  }

  get continuous() {
    return this._continuous;
  }

  set mirror(mirror) {
    this._mirror = mirror;

    if (mirror) {
      this.video.style.MozTransform = 'scaleX(-1)';
      this.video.style.webkitTransform = 'scaleX(-1)';
      this.video.style.OTransform = 'scaleX(-1)';
      this.video.style.msFilter = 'FlipH';
      this.video.style.filter = 'FlipH';
      this.video.style.transform = 'scaleX(-1)';
    } else {
      this.video.style.MozTransform = null;
      this.video.style.webkitTransform = null;
      this.video.style.OTransform = null;
      this.video.style.msFilter = null;
      this.video.style.filter = null;
      this.video.style.transform = null;
    }
  }

  get mirror() {
    return this._mirror;
  }

  async _enableScan(camera) {
    this._camera = camera || this._camera;
    if (!this._camera) {
      throw new Error('Camera is not defined.');
    }

    const stream = await this._camera.start();
    this.video.srcObject = stream;

    if (this._continuous) {
      this._scanner.start();
    }
  }

  _disableScan() {
    this.video.src = '';

    if (this._scanner) {
      this._scanner.stop();
    }

    if (this._camera) {
      this._camera.stop();
    }
  }

  _configureVideo(opts) {
    if (opts.video) {
      if (opts.video.tagName !== 'VIDEO') {
        throw new Error('Video must be a <video> element.');
      }
    }

    const video = opts.video || document.createElement('video');
    video.setAttribute('autoplay', 'autoplay');

    return video;
  }

  _createStateMachine() {
    return StateMachine.create({
      initial: 'stopped',
      events: [
        {
          name: 'start',
          from: 'stopped',
          to: 'started',
        },
        {
          name: 'stop',
          from: ['started', 'active', 'inactive'],
          to: 'stopped',
        },
        {
          name: 'activate',
          from: ['started', 'inactive'],
          to: ['active', 'inactive'],
          condition: function(options) {
            if (Visibility.state() === 'visible' || this.backgroundScan) {
              return 'active';
            } else {
              return 'inactive';
            }
          },
        },
        {
          name: 'deactivate',
          from: ['started', 'active'],
          to: 'inactive',
        },
      ],
      callbacks: {
        onenteractive: async (options) => {
          await this._enableScan(options.args[0]);
          this.emit('active');
        },
        onleaveactive: () => {
          this._disableScan();
          this.emit('inactive');
        },
        onenteredstarted: async (options) => {
          await this._fsm.activate(options.args[0]);
        },
      },
    });
  }
}

// 1. Include scanner.js to your HTML document

// <script type="text/javascript" src="//cdn.asprise.com/scannerjs/scanner.js"></script>

// 2. Initiate A Scan

// To initiate a scan, you can simply call scanner.scan with proper arguments. For example, the code below initiates a scan that will output images in jpg format:

// -------------- Optional status display, depending on JQuery --------------
function displayStatus(loading, mesg, clear) {
  if (loading) {
    $('#info').html((clear ? '' : $('#info').html()) + '<p><img src="https://asprise.com/legacy/prd/asic_wia_ica/applet/loading.gif" style="vertical-align: middle;" hspace="8"> ' + mesg + '</p>');
  } else {
    $('#info').html((clear ? '' : $('#info').html()) + mesg);
  }
}

// -------------- scanning related code: independent of any 3rd JavaScript library --------------
function scanAsJpg() {
  displayStatus(true, 'Scanning', true);
  scanner.scan(handleImages,
    {
      'output_settings': [{
        'type': 'return-base64',
        'format': 'jpg',
      }], 'i18n': {'lang': getLang()},
    }, true, false);
}

function scanSimple() {
  displayStatus(true, 'Scanning', true);
  scanner.scan(handleImages,
    {
      'prompt_scan_more': true,
      'output_settings': [{
        'type': 'return-base64',
        'format': 'jpg',
      }], 'i18n': {'lang': getLang()},
    }, false, false);
}

function scanAsPdf() {
  displayStatus(true, 'Scanning', true);
  scanner.scan(handleImages,
    {
      'output_settings': [{
        'type': 'return-base64',
        'format': 'pdf',
      }], 'i18n': {'lang': getLang()},
    }, true, false);
}

function scanThenUpload() {
  displayStatus(true, 'Scanning', true);
  scanner.scan(handleUploadResponse,
    {
      'output_settings': [{
        'type': 'upload',
        'format': 'pdf',
        'pdf_force_black_white': false,
        'upload_target': {
          'url': 'https://asprise.com/scan/applet/upload.php?action=dump',
          'cookies': 'name=value; poweredBy=Asprise',
        },
      }], 'i18n': {'lang': getLang()},
    }
    , true, false);
}

/** Returns true if it is successfully or false if failed and reports error. */
function checkIfSuccessfully(successful, mesg, response) {
  displayStatus(false, '', true);
  if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
    displayStatus(false, '<pre>' + 'User cancelled.' + '</pre>', true);
    return false;
  } else if (!successful) {
    displayStatus(false, '<pre>' + 'Failed: ' + mesg + '\n' + response + '</pre>', true);
    return false;
  }
  return true;
}

/** Callback function to retrieve scanned images. Returns number of images retrieved. */
function handleImages(successful, mesg, response) {
  if (!checkIfSuccessfully(successful, mesg, response)) {
    return 0;
  }

  const scannedImages = scanner.getScannedImages(response, true, false);
  displayStatus(false, '<pre>' + 'Scanned Successfully' + '</pre>', true);
  for (let i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
    const img = scannedImages[i];
    displayStatus(false, '\n<pre>  ' + img.toString() + '</pre>', false);
    appendImage(img, document.getElementById('images'));

    const info = img.getInfo();
    const barcodes = info == null ? null : info.barcodes;
    for (let b = 0; Array.isArray(barcodes) && b < barcodes.length; b++) {
      displayStatus(false, '\n<pre>  Barcode: ' + barcodes[b].data + ' (' + barcodes[b].type + ')' + '</pre>', false);
    }
  }
  return (scannedImages instanceof Array) ? scannedImages.length : 0;
}

function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (typeof obj == 'string') {
    return obj.trim().length == 0;
  } else if (Array.isArray(obj)) {
    return obj.length == 0;
  }
  return false;
}

/** Callback function to retrieve upload response */
function handleUploadResponse(successful, mesg, response) {
  if (!checkIfSuccessfully(successful, mesg, response)) {
    return 0;
  }

  const uploadResponse = scanner.getUploadResponse(response);
  if (!isEmpty(uploadResponse)) {
    displayStatus(false, '<h2>Upload Response from the Server Side: </h2>' + uploadResponse, true);
  } else {
    displayStatus(false, '<pre>' + 'Failed: ' + mesg + '\n' + response + '</pre>', true);
  }
}

/** Displays general response to the page - for demo purpose only. */
function universalHandlerForDemo(successful, mesg, response) {
  try {
    if (!checkIfSuccessfully(successful, mesg, response)) {
      return;
    }

    // Original images
    const imgCount = handleImages(successful, mesg, response);

    // Thumbnails
    const thumbs = scanner.getScannedImages(response, false, true);
    if (thumbs.length > 0) {
      displayStatus(false, '<pre>' + 'Thumbnails acquired: ' + thumbs.length + '</pre>', false);

      $('#info').append('<div id="thumbs"></div>');

      for (let i = 0; i < thumbs.length; i++) {
        const t = thumbs[i];
        appendImage(t, document.getElementById('thumbs'), true);
      }
    }

    const saveResponse = scanner.getSaveResponse(response);
    if (saveResponse) {
      displayStatus(false, '<h2>File Save Result: </h2>' + saveResponse, false);
    }
    const uploadResponse = scanner.getUploadResponse(response);
    if (!isEmpty(uploadResponse)) {
      displayStatus(false, '<h2>Upload Response from the Server Side: </h2>' + uploadResponse, false);
    }
  } catch (e) {
    displayStatus(false, '<h2>Exception</h2><p>' +
      (e == null ? e : e.toString().replace(/[\x26\x0A\<>'"]/g, function(r) {
        return '&#' + r.charCodeAt(0) + ';';
      })) +
      '</p>', false);
  }
}

/** To track all the images (thumbnails excluded) scanned so far. */
/** @type ScannedImage[] */
var imagesScanned = [];

/**
 * Appends image to given dom node.
 * @param scannedImage ScannedImage
 * @param domParent
 */
function appendImage(scannedImage, domParent, isThumbnail) {
  if (!scannedImage) {
    return;
  }
  scanner.logToConsole('Appending scanned image: ' + scannedImage.toString());
  if (!isThumbnail) {
    imagesScanned.push(scannedImage);
  }
  if (scannedImage.mimeType == scanner.MIME_TYPE_BMP || scannedImage.mimeType == scanner.MIME_TYPE_GIF || scannedImage.mimeType == scanner.MIME_TYPE_JPEG || scannedImage.mimeType == scanner.MIME_TYPE_PNG) {
    const elementImg = scanner.createDomElementFromModel(
      {
        'name': 'img',
        'attributes': {
          'class': 'scanned zoom thumb thumb-img',
          'src': scannedImage.src,
          'height': '100',
        },
      },
    );
    domParent.appendChild(elementImg);
    // optional UI effect that allows the user to click the image to zoom.
    enableZoom();
  } else if (scannedImage.mimeType == scanner.MIME_TYPE_PDF) {
    const elementA = scanner.createDomElementFromModel({
      'name': 'a',
      'attributes': {
        'href': 'javascript:previewPdf(' + (imagesScanned.length - 1) + ');',
        'class': 'thumb thumb-pdf',
      },
    });
    domParent.appendChild(elementA);
  }
}

function submitForm1() {
  displayStatus(true, 'Submitting in progress, please standby ...', true);
  if (!scanner.submitFormWithImages('form1', imagesScanned, function(xhr) {
    if (xhr.readyState == 4) { // 4: request finished and response is ready
      displayStatus(false, '<h2>Response from the server: </h2>' + xhr.responseText, true);
    }
  })) {
    displayStatus(false, 'Form submission cancelled. Please scan an image first.', true);
  }
}

function clearScans() {
  if ((imagesScanned instanceof Array) && imagesScanned.length > 0) {
    if (window.confirm('Are you sure that you want to clear scanned images?')) {
      imagesScanned = [];
      document.getElementById('images').innerHTML = '';
    }
  }
}

function getLang() {
  const langSelected = $('#lang').val();
  const licType = getParameterByName('license');
  if (langSelected != 'en' && licType && (licType.indexOf('Lite') == 0 || licType.indexOf('Standard') == 0 || licType.indexOf('Pro') == 0)) {
    window.alert('UI language selection is not supported by Lite and Standard licenses.');
    return 'en';
  }
  return langSelected;
}

// Low level scanner access demos
function selectASource() {
  displayStatus(true, 'Selecting a source ...', true);
  scanner.getSource(handleLowLevelApiResponse, 'select', true, null, null, false, null, {
    'i18n': {
      'lang': getLang(),
    },
  });
}

function listSources() {
  displayStatus(true, 'Lists all sources ...', true);
  scanner.listSources(handleLowLevelApiResponse, false, 'all', false, false, null);
}

function getSourceCaps() {
  displayStatus(true, 'Gets source capabilities ...', true);
  scanner.getSource(handleLowLevelApiResponse, 'select', false, 'all', false, true, 'CAP_FEEDERENABLED: false; ICAP_UNITS: TWUN_INCHES', {
    'i18n': {
      'lang': getLang(),
    },
  });
}

function getSystemInfo() {
  displayStatus(true, 'Gets system info ...', true);
  scanner.callFunction(handleLowLevelApiResponse, 'asprise_scan_system_info');
}

function handleLowLevelApiResponse(successful, mesg, result) {
  displayStatus(false, (successful ? 'OK' : 'ERROR') + '<pre>' + (mesg ? ' - ' + mesg : '') + '\n' + result + '</pre>', true);
}

$(function() {
  if (window.scanner.hasJava()) {
    displayStatus(false, 'JRE: ' + window.scanner.deployJava.getJREs(), false);
  } else {
    if (!window.scanner.isWindows()) {
      displayStatus(false, '<p class=\'warn\'>Currently, only Windows is supported.</p>', false);
    }
  }

  // Lite, Standard don't support UI language change
  const licType = getParameterByName('license');
  const langSelected = $('#lang').val();
  if (langSelected != 'en' && licType && (licType.indexOf('Lite') == 0 || licType.indexOf('Standard') == 0 || licType.indexOf('Pro') == 0)) {
    $('#lang').val('en');
  }
});

// to prevent unintended window close when preview PDF
window.addEventListener('beforeunload', function(e) {
  if ($('#images').children().length > 0) {
    if (!window.confirm('Are you sure you want to exit scanning demo?')) {
      e.preventDefault();
      e.returnValue = '';
      return;
    }
  }
});

// GET param
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


// 3. Handle The Scan Result Using A Callback Function

/** Processes the scan result */
function displayImagesOnPage(successful, mesg, response) {
  if (!successful) { // On error
    console.error('Failed: ' + mesg);
    return;
  }

  if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User canceled.
    console.info('User canceled');
    return;
  }

  const scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
  for (let i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
    const scannedImage = scannedImages[i];
    processScannedImage(scannedImage);
  }
}

/** Images scanned so far. */
var imagesScanned = [];

/** Processes a ScannedImage */
function processScannedImage(scannedImage) {
  imagesScanned.push(scannedImage);
  const elementImg = createDomElementFromModel({
    'name': 'img',
    'attributes': {
      'class': 'scanned',
      'src': scannedImage.src,
    },
  });
  document.getElementById('images').appendChild(elementImg);
}
