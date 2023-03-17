import {WebSystemObject} from './WebSystemObject.js';

/*
    Puedes utilizar las funciones de esta clase para conectar o crear un canvas
    o lienzo de dibujo, se incorporan algunas funciones para facilitar el proceso
    de actualización de imágenes según el standard, o bien puedes dibujar de la
    misma forma accediendo directamente al contexto.

    Se reconocen todos los derechos de autor, se agradece a sky-cons-master.

*/

class MyCanvas extends WebSystemObject {
  static needToRepaint = 'needToRepaint';
  static updated = 'updated';
  static updating = 'updating';
  static colors = [{
    'name': 'aliceblue',
    'code': '#F0F8FF',
    'RGB_levels': {'red': 240, 'green': 248, 'blue': 255},
    'HSL_levels': {'h': 31.999999999999993, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'antiquewhite',
    'code': '#FAEBD7',
    'RGB_levels': {'red': 250, 'green': 235, 'blue': 215},
    'HSL_levels': {
      'h': 205.71428571428572,
      's': 77.77777777777773,
      'l': 91.17647058823529,
    },
  }, {
    'name': 'aqua',
    'code': '#00FFFF',
    'RGB_levels': {'red': 0, 'green': 255, 'blue': 255},
    'HSL_levels': {'h': 60, 's': 100, 'l': 50},
  }, {
    'name': 'aquamarine',
    'code': '#7FFFD4',
    'RGB_levels': {'red': 127, 'green': 255, 'blue': 212},
    'HSL_levels': {'h': 80.15625, 's': 100, 'l': 74.90196078431373},
  }, {
    'name': 'azure',
    'code': '#F0FFFF',
    'RGB_levels': {'red': 240, 'green': 255, 'blue': 255},
    'HSL_levels': {'h': 60, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'beige',
    'code': '#F5F5DC',
    'RGB_levels': {'red': 245, 'green': 245, 'blue': 220},
    'HSL_levels': {'h': 180, 's': 55.5555555555556, 'l': 91.1764705882353},
  }, {
    'name': 'bisque',
    'code': '#FFE4C4',
    'RGB_levels': {'red': 255, 'green': 228, 'blue': 196},
    'HSL_levels': {
      'h': 207.45762711864404,
      's': 99.99999999999996,
      'l': 88.4313725490196,
    },
  }, {
    'name': 'black',
    'code': '#000000',
    'RGB_levels': {'red': 0, 'green': 0, 'blue': 0},
    'HSL_levels': {'h': 0, 's': 0, 'l': 0},
  }, {
    'name': 'blanchedalmond',
    'code': '#FFEBCD',
    'RGB_levels': {'red': 255, 'green': 235, 'blue': 205},
    'HSL_levels': {'h': 204.00000000000003, 's': 100, 'l': 90.19607843137256},
  }, {
    'name': 'blue',
    'code': '#0000FF',
    'RGB_levels': {'red': 0, 'green': 0, 'blue': 255},
    'HSL_levels': {'h': 0, 's': 100, 'l': 50},
  }, {
    'name': 'blueviolet',
    'code': '#8A2BE2',
    'RGB_levels': {'red': 138, 'green': 43, 'blue': 226},
    'HSL_levels': {
      'h': 328.8524590163934,
      's': 75.93360995850621,
      'l': 52.74509803921569,
    },
  }, {
    'name': 'brown',
    'code': '#A52A2A',
    'RGB_levels': {'red': 165, 'green': 42, 'blue': 42},
    'HSL_levels': {'h': 240, 's': 40.5940594059406, 'l': 40.588235294117645},
  }, {
    'name': 'burlywood',
    'code': '#DEB887',
    'RGB_levels': {'red': 222, 'green': 184, 'blue': 135},
    'HSL_levels': {'h': 206.20689655172416, 's': 56.86274509803921, 'l': 70},
  }, {
    'name': 'cadetblue',
    'code': '#5F9EA0',
    'RGB_levels': {'red': 95, 'green': 158, 'blue': 160},
    'HSL_levels': {'h': 58.15384615384616, 's': 25.49019607843137, 'l': 50},
  }, {
    'name': 'chartreuse',
    'code': '#7FFF00',
    'RGB_levels': {'red': 127, 'green': 255, 'blue': 0},
    'HSL_levels': {'h': 149.88235294117646, 's': 100, 'l': 50},
  }, {
    'name': 'chocolate',
    'code': '#D2691E',
    'RGB_levels': {'red': 210, 'green': 105, 'blue': 30},
    'HSL_levels': {'h': 215, 's': 66.66666666666666, 'l': 47.05882352941176},
  }, {
    'name': 'coral',
    'code': '#FF7F50',
    'RGB_levels': {'red': 255, 'green': 127, 'blue': 80},
    'HSL_levels': {'h': 223.88571428571427, 's': 100, 'l': 65.68627450980392},
  }, {
    'name': 'cornflowerblue',
    'code': '#6495ED',
    'RGB_levels': {'red': 100, 'green': 149, 'blue': 237},
    'HSL_levels': {
      'h': 21.45985401459854,
      's': 79.19075144508672,
      'l': 66.07843137254902,
    },
  }, {
    'name': 'cornsilk',
    'code': '#FFF8DC',
    'RGB_levels': {'red': 255, 'green': 248, 'blue': 220},
    'HSL_levels': {'h': 192, 's': 100, 'l': 93.13725490196079},
  }, {
    'name': 'crimson',
    'code': '#DC143C',
    'RGB_levels': {'red': 220, 'green': 20, 'blue': 60},
    'HSL_levels': {'h': 252, 's': 74.07407407407408, 'l': 47.05882352941176},
  }, {
    'name': 'cyan',
    'code': '#00FFFF',
    'RGB_levels': {'red': 0, 'green': 255, 'blue': 255},
    'HSL_levels': {'h': 60, 's': 100, 'l': 50},
  }, {
    'name': 'darkblue',
    'code': '#00008B',
    'RGB_levels': {'red': 0, 'green': 0, 'blue': 139},
    'HSL_levels': {'h': 0, 's': 37.466307277628026, 'l': 27.254901960784313},
  }, {
    'name': 'darkcyan',
    'code': '#008B8B',
    'RGB_levels': {'red': 0, 'green': 139, 'blue': 139},
    'HSL_levels': {'h': 60, 's': 37.466307277628026, 'l': 27.254901960784313},
  }, {
    'name': 'darkgoldenrod',
    'code': '#B8860B',
    'RGB_levels': {'red': 184, 'green': 134, 'blue': 11},
    'HSL_levels': {
      'h': 197.34104046242774,
      's': 54.920634920634924,
      'l': 38.23529411764706,
    },
  }, {
    'name': 'darkgray',
    'code': '#A9A9A9',
    'RGB_levels': {'red': 169, 'green': 169, 'blue': 169},
    'HSL_levels': {'h': 0, 's': 0, 'l': 66.27450980392156},
  }, {
    'name': 'darkgreen',
    'code': '#006400',
    'RGB_levels': {'red': 0, 'green': 100, 'blue': 0},
    'HSL_levels': {'h': 120, 's': 100, 'l': 19.607843137254903},
  }, {
    'name': 'darkgrey',
    'code': '#A9A9A9',
    'RGB_levels': {'red': 169, 'green': 169, 'blue': 169},
    'HSL_levels': {'h': 0, 's': 0, 'l': 66.27450980392156},
  }, {
    'name': 'darkkhaki',
    'code': '#BDB76B',
    'RGB_levels': {'red': 189, 'green': 183, 'blue': 107},
    'HSL_levels': {
      'h': 184.39024390243904,
      's': 38.317757009345804,
      'l': 58.03921568627452,
    },
  }, {
    'name': 'darkmagenta',
    'code': '#8B008B',
    'RGB_levels': {'red': 139, 'green': 0, 'blue': 139},
    'HSL_levels': {'h': 300, 's': 37.466307277628026, 'l': 27.254901960784313},
  }, {
    'name': 'darkolivegreen',
    'code': '#556B2F',
    'RGB_levels': {'red': 85, 'green': 107, 'blue': 47},
    'HSL_levels': {'h': 158, 's': 38.96103896103896, 'l': 30.196078431372552},
  }, {
    'name': 'darkorange',
    'code': '#FF8C00',
    'RGB_levels': {'red': 255, 'green': 140, 'blue': 0},
    'HSL_levels': {'h': 207.05882352941177, 's': 100, 'l': 50},
  }, {
    'name': 'darkorchid',
    'code': '#9932CC',
    'RGB_levels': {'red': 153, 'green': 50, 'blue': 204},
    'HSL_levels': {
      'h': 319.87012987012986,
      's': 60.156250000000014,
      'l': 49.80392156862745,
    },
  }, {
    'name': 'darkred',
    'code': '#8B0000',
    'RGB_levels': {'red': 139, 'green': 0, 'blue': 0},
    'HSL_levels': {'h': 240, 's': 37.466307277628026, 'l': 27.254901960784313},
  }, {
    'name': 'darksalmon',
    'code': '#E9967A',
    'RGB_levels': {'red': 233, 'green': 150, 'blue': 122},
    'HSL_levels': {
      'h': 224.86486486486487,
      's': 71.61290322580643,
      'l': 69.6078431372549,
    },
  }, {
    'name': 'darkseagreen',
    'code': '#8FBC8F',
    'RGB_levels': {'red': 143, 'green': 188, 'blue': 143},
    'HSL_levels': {'h': 120, 's': 25.13966480446928, 'l': 64.90196078431373},
  }, {
    'name': 'darkslateblue',
    'code': '#483D8B',
    'RGB_levels': {'red': 72, 'green': 61, 'blue': 139},
    'HSL_levels': {
      'h': 351.53846153846155,
      's': 25.161290322580637,
      'l': 39.21568627450981,
    },
  }, {
    'name': 'darkslategray',
    'code': '#2F4F4F',
    'RGB_levels': {'red': 47, 'green': 79, 'blue': 79},
    'HSL_levels': {'h': 60, 's': 25.396825396825395, 'l': 24.705882352941178},
  }, {
    'name': 'darkslategrey',
    'code': '#2F4F4F',
    'RGB_levels': {'red': 47, 'green': 79, 'blue': 79},
    'HSL_levels': {'h': 60, 's': 25.396825396825395, 'l': 24.705882352941178},
  }, {
    'name': 'darkturquoise',
    'code': '#00CED1',
    'RGB_levels': {'red': 0, 'green': 206, 'blue': 209},
    'HSL_levels': {
      'h': 59.13875598086125,
      's': 69.43521594684385,
      'l': 40.98039215686274,
    },
  }, {
    'name': 'darkviolet',
    'code': '#9400D3',
    'RGB_levels': {'red': 148, 'green': 0, 'blue': 211},
    'HSL_levels': {
      'h': 317.91469194312793,
      's': 70.5685618729097,
      'l': 41.37254901960784,
    },
  }, {
    'name': 'deeppink',
    'code': '#FF1493',
    'RGB_levels': {'red': 255, 'green': 20, 'blue': 147},
    'HSL_levels': {'h': 272.4255319148936, 's': 100, 'l': 53.92156862745098},
  }, {
    'name': 'deepskyblue',
    'code': '#00BFFF',
    'RGB_levels': {'red': 0, 'green': 191, 'blue': 255},
    'HSL_levels': {'h': 44.94117647058823, 's': 100, 'l': 50},
  }, {
    'name': 'dimgray',
    'code': '#696969',
    'RGB_levels': {'red': 105, 'green': 105, 'blue': 105},
    'HSL_levels': {'h': 0, 's': 0, 'l': 41.17647058823529},
  }, {
    'name': 'dimgrey',
    'code': '#696969',
    'RGB_levels': {'red': 105, 'green': 105, 'blue': 105},
    'HSL_levels': {'h': 0, 's': 0, 'l': 41.17647058823529},
  }, {
    'name': 'dodgerblue',
    'code': '#1E90FF',
    'RGB_levels': {'red': 30, 'green': 144, 'blue': 255},
    'HSL_levels': {'h': 30.399999999999995, 's': 100, 'l': 55.88235294117647},
  }, {
    'name': 'firebrick',
    'code': '#B22222',
    'RGB_levels': {'red': 178, 'green': 34, 'blue': 34},
    'HSL_levels': {'h': 240, 's': 48.32214765100671, 'l': 41.56862745098039},
  }, {
    'name': 'floralwhite',
    'code': '#FFFAF0',
    'RGB_levels': {'red': 255, 'green': 250, 'blue': 240},
    'HSL_levels': {'h': 200.00000000000003, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'forestgreen',
    'code': '#228B22',
    'RGB_levels': {'red': 34, 'green': 139, 'blue': 34},
    'HSL_levels': {'h': 120, 's': 31.157270029673583, 'l': 33.921568627450974},
  }, {
    'name': 'fuchsia',
    'code': '#FF00FF',
    'RGB_levels': {'red': 255, 'green': 0, 'blue': 255},
    'HSL_levels': {'h': 300, 's': 100, 'l': 50},
  }, {
    'name': 'gainsboro',
    'code': '#DCDCDC',
    'RGB_levels': {'red': 220, 'green': 220, 'blue': 220},
    'HSL_levels': {'h': 0, 's': 0, 'l': 86.27450980392157},
  }, {
    'name': 'ghostwhite',
    'code': '#F8F8FF',
    'RGB_levels': {'red': 248, 'green': 248, 'blue': 255},
    'HSL_levels': {'h': 0, 's': 100.0000000000004, 'l': 98.62745098039215},
  }, {
    'name': 'gold',
    'code': '#FFD700',
    'RGB_levels': {'red': 255, 'green': 215, 'blue': 0},
    'HSL_levels': {'h': 189.41176470588235, 's': 100, 'l': 50},
  }, {
    'name': 'goldenrod',
    'code': '#DAA520',
    'RGB_levels': {'red': 218, 'green': 165, 'blue': 32},
    'HSL_levels': {
      'h': 197.0967741935484,
      's': 71.53846153846153,
      'l': 49.01960784313725,
    },
  }, {
    'name': 'gray',
    'code': '#808080',
    'RGB_levels': {'red': 128, 'green': 128, 'blue': 128},
    'HSL_levels': {'h': 0, 's': 0, 'l': 50.19607843137255},
  }, {
    'name': 'green',
    'code': '#008000',
    'RGB_levels': {'red': 0, 'green': 128, 'blue': 0},
    'HSL_levels': {'h': 120, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'greenyellow',
    'code': '#ADFF2F',
    'RGB_levels': {'red': 173, 'green': 255, 'blue': 47},
    'HSL_levels': {'h': 156.34615384615384, 's': 100, 'l': 59.21568627450981},
  }, {
    'name': 'grey',
    'code': '#808080',
    'RGB_levels': {'red': 128, 'green': 128, 'blue': 128},
    'HSL_levels': {'h': 0, 's': 0, 'l': 50.19607843137255},
  }, {
    'name': 'honeydew',
    'code': '#F0FFF0',
    'RGB_levels': {'red': 240, 'green': 255, 'blue': 240},
    'HSL_levels': {'h': 120, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'hotpink',
    'code': '#FF69B4',
    'RGB_levels': {'red': 255, 'green': 105, 'blue': 180},
    'HSL_levels': {'h': 270, 's': 99.99999999999997, 'l': 70.58823529411764},
  }, {
    'name': 'indianred',
    'code': '#CD5C5C',
    'RGB_levels': {'red': 205, 'green': 92, 'blue': 92},
    'HSL_levels': {'h': 240, 's': 53.05164319248827, 'l': 58.235294117647065},
  }, {
    'name': 'indigo',
    'code': '#4B0082',
    'RGB_levels': {'red': 75, 'green': 0, 'blue': 130},
    'HSL_levels': {
      'h': 325.38461538461536,
      's': 34.210526315789465,
      'l': 25.49019607843137,
    },
  }, {
    'name': 'ivory',
    'code': '#FFFFF0',
    'RGB_levels': {'red': 255, 'green': 255, 'blue': 240},
    'HSL_levels': {'h': 180, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'khaki',
    'code': '#F0E68C',
    'RGB_levels': {'red': 240, 'green': 230, 'blue': 140},
    'HSL_levels': {'h': 186, 's': 76.92307692307692, 'l': 74.50980392156863},
  }, {
    'name': 'lavender',
    'code': '#E6E6FA',
    'RGB_levels': {'red': 230, 'green': 230, 'blue': 250},
    'HSL_levels': {'h': 0, 's': 66.6666666666666, 'l': 94.11764705882352},
  }, {
    'name': 'lavenderblush',
    'code': '#FFF0F5',
    'RGB_levels': {'red': 255, 'green': 240, 'blue': 245},
    'HSL_levels': {'h': 260.00000000000006, 's': 100, 'l': 97.05882352941177},
  }, {
    'name': 'lawngreen',
    'code': '#7CFC00',
    'RGB_levels': {'red': 124, 'green': 252, 'blue': 0},
    'HSL_levels': {
      'h': 149.52380952380952,
      's': 97.67441860465117,
      'l': 49.411764705882355,
    },
  }, {
    'name': 'lemonchiffon',
    'code': '#FFFACD',
    'RGB_levels': {'red': 255, 'green': 250, 'blue': 205},
    'HSL_levels': {'h': 186, 's': 100, 'l': 90.19607843137256},
  }, {
    'name': 'lightblue',
    'code': '#ADD8E6',
    'RGB_levels': {'red': 173, 'green': 216, 'blue': 230},
    'HSL_levels': {
      'h': 45.263157894736835,
      's': 53.271028037383196,
      'l': 79.01960784313727,
    },
  }, {
    'name': 'lightcoral',
    'code': '#F08080',
    'RGB_levels': {'red': 240, 'green': 128, 'blue': 128},
    'HSL_levels': {'h': 240, 's': 78.87323943661971, 'l': 72.15686274509804},
  }, {
    'name': 'lightcyan',
    'code': '#E0FFFF',
    'RGB_levels': {'red': 224, 'green': 255, 'blue': 255},
    'HSL_levels': {'h': 60, 's': 100, 'l': 93.92156862745098},
  }, {
    'name': 'lightgoldenrodyellow',
    'code': '#FAFAD2',
    'RGB_levels': {'red': 250, 'green': 250, 'blue': 210},
    'HSL_levels': {'h': 180, 's': 79.99999999999991, 'l': 90.19607843137254},
  }, {
    'name': 'lightgray',
    'code': '#D3D3D3',
    'RGB_levels': {'red': 211, 'green': 211, 'blue': 211},
    'HSL_levels': {'h': 0, 's': 0, 'l': 82.74509803921568},
  }, {
    'name': 'lightgreen',
    'code': '#90EE90',
    'RGB_levels': {'red': 144, 'green': 238, 'blue': 144},
    'HSL_levels': {'h': 120, 's': 73.4375, 'l': 74.90196078431373},
  }, {
    'name': 'lightgrey',
    'code': '#D3D3D3',
    'RGB_levels': {'red': 211, 'green': 211, 'blue': 211},
    'HSL_levels': {'h': 0, 's': 0, 'l': 82.74509803921568},
  }, {
    'name': 'lightpink',
    'code': '#FFB6C1',
    'RGB_levels': {'red': 255, 'green': 182, 'blue': 193},
    'HSL_levels': {
      'h': 249.04109589041096,
      's': 100.00000000000004,
      'l': 85.68627450980392,
    },
  }, {
    'name': 'lightsalmon',
    'code': '#FFA07A',
    'RGB_levels': {'red': 255, 'green': 160, 'blue': 122},
    'HSL_levels': {'h': 222.85714285714286, 's': 100, 'l': 73.92156862745098},
  }, {
    'name': 'lightseagreen',
    'code': '#20B2AA',
    'RGB_levels': {'red': 32, 'green': 178, 'blue': 170},
    'HSL_levels': {
      'h': 63.28767123287671,
      's': 48.666666666666664,
      'l': 41.17647058823529,
    },
  }, {
    'name': 'lightskyblue',
    'code': '#87CEFA',
    'RGB_levels': {'red': 135, 'green': 206, 'blue': 250},
    'HSL_levels': {
      'h': 37.04347826086957,
      's': 91.99999999999999,
      'l': 75.49019607843137,
    },
  }, {
    'name': 'lightslategray',
    'code': '#778899',
    'RGB_levels': {'red': 119, 'green': 136, 'blue': 153},
    'HSL_levels': {'h': 30, 's': 14.285714285714283, 'l': 53.333333333333336},
  }, {
    'name': 'lightslategrey',
    'code': '#778899',
    'RGB_levels': {'red': 119, 'green': 136, 'blue': 153},
    'HSL_levels': {'h': 30, 's': 14.285714285714283, 'l': 53.333333333333336},
  }, {
    'name': 'lightsteelblue',
    'code': '#B0C4DE',
    'RGB_levels': {'red': 176, 'green': 196, 'blue': 222},
    'HSL_levels': {
      'h': 26.086956521739147,
      's': 41.07142857142858,
      'l': 78.03921568627452,
    },
  }, {
    'name': 'lightyellow',
    'code': '#FFFFE0',
    'RGB_levels': {'red': 255, 'green': 255, 'blue': 224},
    'HSL_levels': {'h': 180, 's': 100, 'l': 93.92156862745098},
  }, {
    'name': 'lime',
    'code': '#00FF00',
    'RGB_levels': {'red': 0, 'green': 255, 'blue': 0},
    'HSL_levels': {'h': 120, 's': 100, 'l': 50},
  }, {
    'name': 'limegreen',
    'code': '#32CD32',
    'RGB_levels': {'red': 50, 'green': 205, 'blue': 50},
    'HSL_levels': {'h': 120, 's': 60.7843137254902, 'l': 50},
  }, {
    'name': 'linen',
    'code': '#FAF0E6',
    'RGB_levels': {'red': 250, 'green': 240, 'blue': 230},
    'HSL_levels': {'h': 210, 's': 66.6666666666666, 'l': 94.11764705882352},
  }, {
    'name': 'magenta',
    'code': '#FF00FF',
    'RGB_levels': {'red': 255, 'green': 0, 'blue': 255},
    'HSL_levels': {'h': 300, 's': 100, 'l': 50},
  }, {
    'name': 'maroon',
    'code': '#800000',
    'RGB_levels': {'red': 128, 'green': 0, 'blue': 0},
    'HSL_levels': {'h': 240, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'mediumaquamarine',
    'code': '#66CDAA',
    'RGB_levels': {'red': 102, 'green': 205, 'blue': 170},
    'HSL_levels': {
      'h': 80.38834951456312,
      's': 50.73891625615765,
      'l': 60.196078431372555,
    },
  }, {
    'name': 'mediumblue',
    'code': '#0000CD',
    'RGB_levels': {'red': 0, 'green': 0, 'blue': 205},
    'HSL_levels': {'h': 0, 's': 67.21311475409837, 'l': 40.19607843137255},
  }, {
    'name': 'mediumorchid',
    'code': '#BA55D3',
    'RGB_levels': {'red': 186, 'green': 85, 'blue': 211},
    'HSL_levels': {
      'h': 311.9047619047619,
      's': 58.87850467289718,
      'l': 58.0392156862745,
    },
  }, {
    'name': 'mediumpurple',
    'code': '#9370DB',
    'RGB_levels': {'red': 147, 'green': 112, 'blue': 219},
    'HSL_levels': {
      'h': 340.3738317757009,
      's': 59.77653631284914,
      'l': 64.90196078431372,
    },
  }, {
    'name': 'mediumseagreen',
    'code': '#3CB371',
    'RGB_levels': {'red': 60, 'green': 179, 'blue': 113},
    'HSL_levels': {
      'h': 93.27731092436974,
      's': 43.911439114391136,
      'l': 46.86274509803921,
    },
  }, {
    'name': 'mediumslateblue',
    'code': '#7B68EE',
    'RGB_levels': {'red': 123, 'green': 104, 'blue': 238},
    'HSL_levels': {
      'h': 351.4925373134328,
      's': 79.76190476190477,
      'l': 67.05882352941177,
    },
  }, {
    'name': 'mediumspringgreen',
    'code': '#00FA9A',
    'RGB_levels': {'red': 0, 'green': 250, 'blue': 154},
    'HSL_levels': {
      'h': 83.03999999999999,
      's': 96.15384615384616,
      'l': 49.01960784313725,
    },
  }, {
    'name': 'mediumturquoise',
    'code': '#48D1CC',
    'RGB_levels': {'red': 72, 'green': 209, 'blue': 204},
    'HSL_levels': {
      'h': 62.1897810218978,
      's': 59.825327510917035,
      'l': 55.09803921568628,
    },
  }, {
    'name': 'mediumvioletred',
    'code': '#C71585',
    'RGB_levels': {'red': 199, 'green': 21, 'blue': 133},
    'HSL_levels': {
      'h': 277.75280898876406,
      's': 61.37931034482759,
      'l': 43.13725490196079,
    },
  }, {
    'name': 'midnightblue',
    'code': '#191970',
    'RGB_levels': {'red': 25, 'green': 25, 'blue': 112},
    'HSL_levels': {'h': 0, 's': 63.503649635036496, 'l': 26.862745098039216},
  }, {
    'name': 'mintcream',
    'code': '#F5FFFA',
    'RGB_levels': {'red': 245, 'green': 255, 'blue': 250},
    'HSL_levels': {
      'h': 90.00000000000009,
      's': 100.00000000000028,
      'l': 98.03921568627452,
    },
  }, {
    'name': 'mistyrose',
    'code': '#FFE4E1',
    'RGB_levels': {'red': 255, 'green': 228, 'blue': 225},
    'HSL_levels': {'h': 233.99999999999997, 's': 100, 'l': 94.11764705882352},
  }, {
    'name': 'moccasin',
    'code': '#FFE4B5',
    'RGB_levels': {'red': 255, 'green': 228, 'blue': 181},
    'HSL_levels': {
      'h': 201.8918918918919,
      's': 100.00000000000004,
      'l': 85.49019607843138,
    },
  }, {
    'name': 'navajowhite',
    'code': '#FFDEAD',
    'RGB_levels': {'red': 255, 'green': 222, 'blue': 173},
    'HSL_levels': {'h': 204.14634146341461, 's': 100, 'l': 83.92156862745098},
  }, {
    'name': 'navy',
    'code': '#000080',
    'RGB_levels': {'red': 0, 'green': 0, 'blue': 128},
    'HSL_levels': {'h': 0, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'oldlace',
    'code': '#FDF5E6',
    'RGB_levels': {'red': 253, 'green': 245, 'blue': 230},
    'HSL_levels': {
      'h': 200.86956521739128,
      's': 85.18518518518515,
      'l': 94.70588235294117,
    },
  }, {
    'name': 'olive',
    'code': '#808000',
    'RGB_levels': {'red': 128, 'green': 128, 'blue': 0},
    'HSL_levels': {'h': 180, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'olivedrab',
    'code': '#6B8E23',
    'RGB_levels': {'red': 107, 'green': 142, 'blue': 35},
    'HSL_levels': {
      'h': 160.37383177570095,
      's': 32.13213213213213,
      'l': 34.705882352941174,
    },
  }, {
    'name': 'orange',
    'code': '#FFA500',
    'RGB_levels': {'red': 255, 'green': 165, 'blue': 0},
    'HSL_levels': {'h': 201.1764705882353, 's': 100, 'l': 50},
  }, {
    'name': 'orangered',
    'code': '#FF4500',
    'RGB_levels': {'red': 255, 'green': 69, 'blue': 0},
    'HSL_levels': {'h': 223.76470588235296, 's': 100, 'l': 50},
  }, {
    'name': 'orchid',
    'code': '#DA70D6',
    'RGB_levels': {'red': 218, 'green': 112, 'blue': 214},
    'HSL_levels': {
      'h': 297.7358490566038,
      's': 58.88888888888887,
      'l': 64.70588235294117,
    },
  }, {
    'name': 'palegoldenrod',
    'code': '#EEE8AA',
    'RGB_levels': {'red': 238, 'green': 232, 'blue': 170},
    'HSL_levels': {'h': 185.29411764705884, 's': 66.6666666666667, 'l': 80},
  }, {
    'name': 'palegreen',
    'code': '#98FB98',
    'RGB_levels': {'red': 152, 'green': 251, 'blue': 152},
    'HSL_levels': {'h': 120, 's': 92.52336448598129, 'l': 79.01960784313725},
  }, {
    'name': 'paleturquoise',
    'code': '#AFEEEE',
    'RGB_levels': {'red': 175, 'green': 238, 'blue': 238},
    'HSL_levels': {'h': 60, 's': 64.94845360824742, 'l': 80.98039215686275},
  }, {
    'name': 'palevioletred',
    'code': '#DB7093',
    'RGB_levels': {'red': 219, 'green': 112, 'blue': 147},
    'HSL_levels': {
      'h': 259.6261682242991,
      's': 59.77653631284914,
      'l': 64.90196078431372,
    },
  }, {
    'name': 'papayawhip',
    'code': '#FFEFD5',
    'RGB_levels': {'red': 255, 'green': 239, 'blue': 213},
    'HSL_levels': {
      'h': 202.85714285714286,
      's': 100.00000000000007,
      'l': 91.76470588235294,
    },
  }, {
    'name': 'peachpuff',
    'code': '#FFDAB9',
    'RGB_levels': {'red': 255, 'green': 218, 'blue': 185},
    'HSL_levels': {
      'h': 211.71428571428572,
      's': 100.00000000000004,
      'l': 86.27450980392157,
    },
  }, {
    'name': 'peru',
    'code': '#CD853F',
    'RGB_levels': {'red': 205, 'green': 133, 'blue': 63},
    'HSL_levels': {
      'h': 210.42253521126761,
      's': 58.67768595041323,
      'l': 52.54901960784314,
    },
  }, {
    'name': 'pink',
    'code': '#FFC0CB',
    'RGB_levels': {'red': 255, 'green': 192, 'blue': 203},
    'HSL_levels': {'h': 250.47619047619042, 's': 100, 'l': 87.6470588235294},
  }, {
    'name': 'plum',
    'code': '#DDA0DD',
    'RGB_levels': {'red': 221, 'green': 160, 'blue': 221},
    'HSL_levels': {'h': 300, 's': 47.28682170542637, 'l': 74.70588235294117},
  }, {
    'name': 'powderblue',
    'code': '#B0E0E6',
    'RGB_levels': {'red': 176, 'green': 224, 'blue': 230},
    'HSL_levels': {
      'h': 53.33333333333332,
      's': 51.92307692307695,
      'l': 79.6078431372549,
    },
  }, {
    'name': 'purple',
    'code': '#800080',
    'RGB_levels': {'red': 128, 'green': 0, 'blue': 128},
    'HSL_levels': {'h': 300, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'rebeccapurple',
    'code': '#663399',
    'RGB_levels': {'red': 102, 'green': 51, 'blue': 153},
    'HSL_levels': {'h': 330, 's': 33.33333333333333, 'l': 40},
  }, {
    'name': 'red',
    'code': '#FF0000',
    'RGB_levels': {'red': 255, 'green': 0, 'blue': 0},
    'HSL_levels': {'h': 240, 's': 100, 'l': 50},
  }, {
    'name': 'rosybrown',
    'code': '#BC8F8F',
    'RGB_levels': {'red': 188, 'green': 143, 'blue': 143},
    'HSL_levels': {'h': 240, 's': 25.13966480446928, 'l': 64.90196078431373},
  }, {
    'name': 'royalblue',
    'code': '#4169E1',
    'RGB_levels': {'red': 65, 'green': 105, 'blue': 225},
    'HSL_levels': {'h': 15, 's': 72.72727272727272, 'l': 56.86274509803921},
  }, {
    'name': 'saddlebrown',
    'code': '#8B4513',
    'RGB_levels': {'red': 139, 'green': 69, 'blue': 19},
    'HSL_levels': {'h': 215, 's': 34.090909090909086, 'l': 30.980392156862745},
  }, {
    'name': 'salmon',
    'code': '#FA8072',
    'RGB_levels': {'red': 250, 'green': 128, 'blue': 114},
    'HSL_levels': {
      'h': 233.8235294117647,
      's': 93.15068493150683,
      'l': 71.37254901960785,
    },
  }, {
    'name': 'sandybrown',
    'code': '#F4A460',
    'RGB_levels': {'red': 244, 'green': 164, 'blue': 96},
    'HSL_levels': {
      'h': 212.43243243243242,
      's': 87.05882352941178,
      'l': 66.66666666666667,
    },
  }, {
    'name': 'seagreen',
    'code': '#2E8B57',
    'RGB_levels': {'red': 46, 'green': 139, 'blue': 87},
    'HSL_levels': {
      'h': 93.54838709677419,
      's': 28.61538461538461,
      'l': 36.27450980392157,
    },
  }, {
    'name': 'seashell',
    'code': '#FFF5EE',
    'RGB_levels': {'red': 255, 'green': 245, 'blue': 238},
    'HSL_levels': {'h': 215.2941176470588, 's': 100, 'l': 96.66666666666667},
  }, {
    'name': 'sienna',
    'code': '#A0522D',
    'RGB_levels': {'red': 160, 'green': 82, 'blue': 45},
    'HSL_levels': {
      'h': 220.69565217391306,
      's': 37.704918032786885,
      'l': 40.19607843137255,
    },
  }, {
    'name': 'silver',
    'code': '#C0C0C0',
    'RGB_levels': {'red': 192, 'green': 192, 'blue': 192},
    'HSL_levels': {'h': 0, 's': 0, 'l': 75.29411764705883},
  }, {
    'name': 'skyblue',
    'code': '#87CEEB',
    'RGB_levels': {'red': 135, 'green': 206, 'blue': 235},
    'HSL_levels': {
      'h': 42.60000000000001,
      's': 71.4285714285714,
      'l': 72.54901960784314,
    },
  }, {
    'name': 'slateblue',
    'code': '#6A5ACD',
    'RGB_levels': {'red': 106, 'green': 90, 'blue': 205},
    'HSL_levels': {
      'h': 351.6521739130435,
      's': 53.48837209302326,
      'l': 57.84313725490197,
    },
  }, {
    'name': 'slategray',
    'code': '#708090',
    'RGB_levels': {'red': 112, 'green': 128, 'blue': 144},
    'HSL_levels': {'h': 30, 's': 12.598425196850393, 'l': 50.19607843137255},
  }, {
    'name': 'slategrey',
    'code': '#708090',
    'RGB_levels': {'red': 112, 'green': 128, 'blue': 144},
    'HSL_levels': {'h': 30, 's': 12.598425196850393, 'l': 50.19607843137255},
  }, {
    'name': 'snow',
    'code': '#FFFAFA',
    'RGB_levels': {'red': 255, 'green': 250, 'blue': 250},
    'HSL_levels': {'h': 240, 's': 100.00000000000058, 'l': 99.01960784313727},
  }, {
    'name': 'springgreen',
    'code': '#00FF7F',
    'RGB_levels': {'red': 0, 'green': 255, 'blue': 127},
    'HSL_levels': {'h': 90.11764705882354, 's': 100, 'l': 50},
  }, {
    'name': 'steelblue',
    'code': '#4682B4',
    'RGB_levels': {'red': 70, 'green': 130, 'blue': 180},
    'HSL_levels': {
      'h': 32.72727272727272,
      's': 42.307692307692314,
      'l': 49.01960784313726,
    },
  }, {
    'name': 'tan',
    'code': '#D2B48C',
    'RGB_levels': {'red': 210, 'green': 180, 'blue': 140},
    'HSL_levels': {
      'h': 205.7142857142857,
      's': 43.749999999999986,
      'l': 68.62745098039215,
    },
  }, {
    'name': 'teal',
    'code': '#008080',
    'RGB_levels': {'red': 0, 'green': 128, 'blue': 128},
    'HSL_levels': {'h': 60, 's': 33.50785340314136, 'l': 25.098039215686274},
  }, {
    'name': 'thistle',
    'code': '#D8BFD8',
    'RGB_levels': {'red': 216, 'green': 191, 'blue': 216},
    'HSL_levels': {'h': 300, 's': 24.271844660194176, 'l': 79.80392156862746},
  }, {
    'name': 'tomato',
    'code': '#FF6347',
    'RGB_levels': {'red': 255, 'green': 99, 'blue': 71},
    'HSL_levels': {
      'h': 230.86956521739128,
      's': 99.99999999999999,
      'l': 63.921568627450974,
    },
  }, {
    'name': 'turquoise',
    'code': '#40E0D0',
    'RGB_levels': {'red': 64, 'green': 224, 'blue': 208},
    'HSL_levels': {'h': 66, 's': 72.07207207207207, 'l': 56.470588235294116},
  }, {
    'name': 'violet',
    'code': '#EE82EE',
    'RGB_levels': {'red': 238, 'green': 130, 'blue': 238},
    'HSL_levels': {'h': 300, 's': 76.05633802816902, 'l': 72.15686274509804},
  }, {
    'name': 'wheat',
    'code': '#F5DEB3',
    'RGB_levels': {'red': 245, 'green': 222, 'blue': 179},
    'HSL_levels': {
      'h': 200.9090909090909,
      's': 76.74418604651162,
      'l': 83.13725490196077,
    },
  }, {
    'name': 'white',
    'code': '#FFFFFF',
    'RGB_levels': {'red': 255, 'green': 255, 'blue': 255},
    'HSL_levels': {'h': 0, 's': 0, 'l': 100},
  }, {
    'name': 'whitesmoke',
    'code': '#F5F5F5',
    'RGB_levels': {'red': 245, 'green': 245, 'blue': 245},
    'HSL_levels': {'h': 0, 's': 0, 'l': 96.07843137254902},
  }, {
    'name': 'yellow',
    'code': '#FFFF00',
    'RGB_levels': {'red': 255, 'green': 255, 'blue': 0},
    'HSL_levels': {'h': 180, 's': 100, 'l': 50},
  }, {
    'name': 'yellowgreen',
    'code': '#9ACD32',
    'RGB_levels': {'red': 154, 'green': 205, 'blue': 50},
    'HSL_levels': {'h': 160.25806451612902, 's': 60.7843137254902, 'l': 50},
  }];


  options = {
    ancho: ancho,
    autoOrienting: false, //
    autoLeveling: false, //
    autoLocating: false, //
    dotShape: 'box', // o bien "circle" para la forma de los puntos...
    'stroke-width': 1,
    stroke: 'white', // Color de las líneas
    fill: 'blue', // Color de relleno
    lineJoin: 'round', // Cómo van a conectar las líneas ("round", "bevel": recorta, "miter")
    lineCap: 'round', // Cómo va a terminar la línea "round": las redondea, "square": las cuadra, ("Butt": dice que hay poca diferencia)
    pathMethod: 'stroke', // "stroke" solamente dibuja el borde con un estilo de linea, "fill" lo rellena.
    textMethod: 'strokeText', // "strokeText" solamente dibuja el borde con un estilo de linea, "fillText" lo rellena.
    font: 'bold 12px verdana',
    textAlign: 'start',
    textBaseline: 'top',
    textMaxWidth: 600, // text justification section (do not touch)
    FILL: 0, // const to indicate filltext render
    STROKE: 1,
    MEASURE: 2,
    maxSpaceSize: 3, // Multiplier for max space size. If greater then no justificatoin applied
    minSpaceSize: 0.5, // Multiplier for minimum space size
    /* Este contiene todas las capas, (es un arreglo de objetos)                               algunos rótulos, etcétera... */
    currentLayer: 0,
    layers: [], // Para los estilos de flechas
    cabezaFlechaOff: 0,
    cabezaFlechaFinal: 1,
    cabezaFlechaInicial: 2,
    cabezaFlechaInicialFinal: 3,
  };

  canvas; // store canvas element
  ctx; // store canvas 2d context element
  invocableDrawEvent; // store user drawing callable program (your drawer)
  frame; // 24 x sec ?
  constructor(id, opciones = MyCanvas.options, invocableDrawEvent = null) {
    super();
    // Opciones generales del canvas


    // Si no se pasa o no se encuentra un id en el documento, se crea un canvas fuera de pantalla.
    if (id) {
      let tmp = document.getElementById(id);
      if (!tmp) {
        this.canvas = document.createElement('canvas');
        this.incject(id);
      } else {
        this.canvas = tmp;
      }
    } else {
      this.canvas = document.createElement('canvas'); // canvas sin lienzo sin atachar...
    }
    this.ctx = this.canvas.getContext('2d');
    if (invocableDrawEvent) {
      this.#handle = null;
      this.drawer = invocableDrawEvent;
    }

  }

  // setup your drawer as you wish...
  get drawer() {
    return this.invocableDrawEvent;
  }

  set drawer(r) {
    this.invocableDrawEvent = r;
    // Solamente en esos casos, utilizar el esquema de requesAnimationFrame
    this.start();
  }

  // Aquí van los gráficos
  renderCanvas() {
    if (this.state !== MyCanvas.needToRepaint || this.state === MyCanvas.updated) {
      return;
    }

    this.state = MyCanvas.updating;
    try {
      this.drawer();
    } catch (e) {
      console.warn(`Problem with drawer ${JSON.stringify(e)}`);
    }
    this.state = MyCanvas.updated;
  }

  get hidden() {
    return this.canvas.hidden;
  }

  set hidden(v) {
    this.canvas.hidden = Boolean(v);
  }

  refresh() {
    this.state = MyCanvas.needToRepaint;
  }

  // Init, to para dibujar asicrónicamente... just be private and called from canvas driver constructor
  static #raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  // start or restart
  start() {
    this.frame = () => {
      this.#handle = MyCanvas.#raf(this.frame);
      this.renderCanvas();
    };
    this.frame();
  }

  static #caf = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame;

  stop(hand = this.#handle) {
    this.#caf(hand);
    this.#handle = null;
  }

  get paused() {
    return !!this.#handle;
  }

  set paused(p) {
    if (this.paused) {
      if (p) this.start();
    } else {
      if (!p) this.stop();
    }
  }

  paused() {
    return !!this.#handle;
  }

  // Se opone a la inyección, toma la imagen de un elemento del DOM, no la dibuja
  extract(html_id) {
    let img = document.getElementById(html_id);
    this.width = Number(img.width);
    this.height = Number(img.height);
    this.ctx.drawImage(img, 0, 0);
    return this.ctx.getImageData(0, 0, img.width, img.height);
  }

  incject(html_id) {
    this.canvas.id = html_id;
    document.body.appendChild(this.canvas);
  }

  get width() {
    try {
      return this.canvas.width;
    } catch (e) {
      console.warn('fail to get width');
    }
    return parseInt(this.canvas.childNodes[0].style.width);
  }

  set width(w) {
    try {
      this.canvas.width = w;
    } catch (e) {
      console.warn('retry to resize width');
    }
    this.canvas.childNodes[0].style.width = w + 'px';
  }

  get height() {
    try {
      return this.canvas.height;
    } catch (e) {
      console.warn('fail to get height');
    }
    return parseInt(this.canvas.childNodes[0].style.height);
  }

  set height(w) {
    try {
      this.canvas.height = w;
    } catch (e) {
      console.warn('retry to resize height');
    }
    this.canvas.childNodes[0].style.height = w + 'px';
  }


  // útil para cortar un pedacito...
  cloneImage(anotherImageData) {
    return this.ctx.createImageData(anotherImageData);
  }

  // dibuja la imagen en el canvas...

  // útil para crear un sprite...
  blankImage(w, h) {
    return this.ctx.createImageData(w, h);
  }

  // Carga la imagen desde una dirección en memoria...
  loadImage(imagePath, w, h, onLoadFunction) {
    let target;
    if (this.isNumber(w) && this.isNumber(h)) {
      if (!onLoadFunction) {
        target = new Image(imagePath, w, h);
        target.onload = function() {
          this.ctx.drawImage(target, 0, 0);
        };
      } else {
        target = new Image(imagePath, w, h, onLoadFunction); // must draw there
      }
    } else {
      target = new Image(imagePath);
    }
    target.src = imagePath;
    return target;
  }

  // assumes that the canvas context is in ctx and in scope
  drawImage(image, x, y, scale, rotation, alpha) {
    if (alpha) {
      this.ctx.globalAlpha = alpha;
    }
    if (scale || rotation) {
      if (!scale) {
        scale = 1;
      }
      if (!rotation) {
        rotation = 0;
      }
      this.ctx.setTransform(scale, 0, 0, scale, x, y); // set the scale and translation
      if (rotation) {
        this.ctx.rotate(rotation); // add the rotation
      }
      this.ctx.drawImage(image, -image.width / 2, -image.height / 2); // draw the image offset by half its width and height
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // set the context transform back to the default
    } else {
      this.ctx.drawImage(image, x, y);
    }
  } // que no es lo mismo que

  // este otro que se puede usar para los sprites, y la tira completa.
  putImage(imageData, x, y) {
    this.ctx.putImageData(imageData, x, y);
  }


  // Para lograr el efecto...

  putImageDemo() {
    /*
        Warning: Due to the lossy nature of converting to and from premultiplied
        alpha color values, pixels that have just been set using putImageData()
        might be returned to an equivalent getImageData() as different values.

    */

    // function for applying transparency to an extracted imageData
    function applyTransparency(imageData, transparency) {
      let length = imageData.length;
      for (var i = 3; i < length; i += 4) {
        imageData[i] = (imageData[i] < opacity) ? imageData[i] : 1 - transparency;
      }
      return imageData;
    }

    // Just the idea... (se promedian los niveles rgb y se ponderan por opacidad)
    function additiveMix(theImageData1, toTheImageData2, updateTransparency = false) {
      let length = toTheImageData2.length;
      if (theImageData1 !== length) throw new Error('Las imágenes a mezclar deben tener el mismo tamaño.');
      for (var i = 3; i < length; i += 4) {
        let ft = (toTheImageData2[i - 0] + theImageData1[i - 0]);
        if (ft === 0) {
          return theImageData1;
        }
        toTheImageData2[i - 3] = Math.round((toTheImageData2[i] * toTheImageData2[i - 3] + theImageData1[i] * theImageData1[i - 3]) / ft);
        toTheImageData2[i - 2] = Math.round((toTheImageData2[i] * toTheImageData2[i - 2] + theImageData1[i] * theImageData1[i - 2]) / ft);
        toTheImageData2[i - 1] = Math.round((toTheImageData2[i] * toTheImageData2[i - 1] + theImageData1[i] * theImageData1[i - 1]) / ft);
        if (updateTransparency) {
          toTheImageData2[i - 0] = Math.round((toTheImageData2[i] * toTheImageData2[i - 0] + theImageData1[i] * theImageData1[i - 0]) / ft);
        }
      }
      return toTheImageData2;
    }

    function putImageData(
      imageData,
      dx,
      dy,
      dirtyX,
      dirtyY,
      dirtyWidth,
      dirtyHeight,
    ) {
      const data = imageData.data;
      const height = imageData.height;
      const width = imageData.width;
      dirtyX = dirtyX || 0;
      dirtyY = dirtyY || 0;
      dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
      dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
      const limitBottom = dirtyY + dirtyHeight;
      const limitRight = dirtyX + dirtyWidth;
      for (let y = dirtyY; y < limitBottom; y++) {
        for (let x = dirtyX; x < limitRight; x++) {
          const pos = y * width + x;
          this.ctx.fillStyle = `rgba(${data[pos * 4 + 0]}, ${data[pos * 4 + 1]}, ${
            data[pos * 4 + 2]
          }, ${data[pos * 4 + 3] / 255})`;
          this.ctx.fillRect(x + dx, y + dy, 1, 1);
        }
      }
    }

    // Draw content onto the canvas
    ctx.fillRect(0, 0, 100, 100);
    // Create an ImageData object from it
    const imagedata = ctx.getImageData(0, 0, 100, 100);
    // use the putImageData function that illustrates how putImageData works
    putImageData(ctx, imagedata, 150, 0, 50, 50, 25, 25);

  }

  //
  working() {
    /*
    Para el canvas transition de colores rotaciones etc.

    Solamente para idiotas ridículos superdotados
      1._ Cuando la velocidad del objeto es menor a la frecuencia de actualización, se hace un fade in-out en secuencia en el tiempo establecido,
          esto es, una suma (mezcla) aditiva, a la distancia de dos píxeles consecutivos a un tiempo = a c/v cada una (la última iguala), a donde c = fps;
          Las imágenes se superponen a desplazamiento de un píxel, La suma de intensidades de ambas debe ser = a 1, la anterior descendente y la posterior ascendente.
          A una velocidad igual a c, esto no es necesario, la anterior siempre tiene intensidad cero.
      2._ Cuando la ... es igual a FPS, se utiliza una actualización con putaImagen normal, remplazando la anterior.
      3._ Cuando ... es mayor que la frecuencia de muestreo:
          Se calcula la longitud de la "estela" de la siguiente análoga a la dilatación de tiempo de Lorentz:
          Sea c = fps
          Les = 1 / Raíz(1 - v²/c²)
          donde c, es casualmente igual a la frecuencia de muestreo y v, la velocidad en píxels del objeto.
          Esta fórmula también se puede simplificar de la siguiente forma Les = (1/2) * (v²/c²).

    */
  }


  // https://developer.mozilla.org/en-us/docs/Web/HTML/CORS_enabled_image
  getPixel(x, y) {
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    // A  Uint8ClampedArray contains height × width × 4 bytes of data, with index values ranging from 0 to (height×width×4)-1.
    let r = imageData.data[0];
    let g = imageData.data[1];
    let b = imageData.data[2];
    let a = imageData.data[3];
    return {r, g, b, a}; // para 'rgba(r, g, b, a/255)' // hay que dividir entre 255
  }

  /*

    Source: https://stackoverflow.com/users/13833218/rifky-niyas
    In: https://stackoverflow.com/questions/667045/get-a-pixel-from-html-canvas

    // Get pixel data
    var imageData = context.getImageData(x, y, width, height);

    // Color at (x,y) position
    var color = [];
    color['red'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 0];
    color['green'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 1];
    color['blue'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 2];
    color['alpha'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 3];

  */

  // Selective level
  setPixel(x, y, pixel = {r: 0, g: 0, b: 0, a: 0}) {
    // acepta nulos para dejar los otros niveles...
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    let {r, g, b, a} = pixel;
    if (!this.isNumber(pixel.r)) {
      r = imageData.data[0];
      imageData.data[0] = r;
    }
    if (!this.isNumber(pixel.g)) {
      g = imageData.data[1];
      imageData.data[1] = g;
    }
    if (!this.isNumber(pixel.b)) {
      b = imageData.data[2];
      imageData.data[2] = b;
    }
    if (!this.isNumber(pixel.a)) {
      a = imageData.data[3];
      imageData.data[3] = a;
    }
    this.ctx.putImageData(imageData, x, y);
  }

  // Filtros

  // negativo
  invertImage(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];     // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
      // data[i + 3] is transparency
    }
    this.ctx.putImageData(imageData, 0, 0);
  };

  contrast(contrast, img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;
    let factor;

    contrast || (contrast = 100); // Default value

    factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (var i = 0; i < numPixels; i++) {
      var r = pixels[i * 4];
      var g = pixels[i * 4 + 1];
      var b = pixels[i * 4 + 2];

      pixels[i * 4] = factor * (r - 128) + 128;
      pixels[i * 4 + 1] = factor * (g - 128) + 128;
      pixels[i * 4 + 2] = factor * (b - 128) + 128;
    }

    this.ctx.putImageData(imageData, 0, 0);
  };

  // escala de grises
  grayscale(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
      // data[i + 3] is transparency
    }
    this.ctx.putImageData(imageData, 0, 0);
  };

  sepia(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;

    for (var i = 0; i < numPixels; i++) {
      var r = pixels[i * 4];
      var g = pixels[i * 4 + 1];
      var b = pixels[i * 4 + 2];

      pixels[i * 4] = 255 - r;
      pixels[i * 4 + 1] = 255 - g;
      pixels[i * 4 + 2] = 255 - b;

      pixels[i * 4] = (r * .393) + (g * .769) + (b * .189);
      pixels[i * 4 + 1] = (r * .349) + (g * .686) + (b * .168);
      pixels[i * 4 + 2] = (r * .272) + (g * .534) + (b * .131);
    }

    this.ctx.putImageData(imageData, 0, 0);
  };

  // Based on the Patrick Wied Version: 1 (2011-04-04) ( http://www.patrick-wied.at )
  // Copyright (c) 2011 under the terms of the MIT LICENSE
  watermark(opacity, img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;

    let transparency = opacity ? 1 : 1 - (255 / (100 / opacity)); // 50%; // Default value

    for (var i = 3; i < pixels.length; i += 4) {
      pixels[i] = (pixels[i] > transparency) ? pixels[i] : transparency;
    }

    this.ctx.putImageData(pixels, 0, 0);
  };

  save(filename = 'screenshot.jpg') {
    let link = window.document.createElement('a');
    let url = this.canvas.toDataURL();
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  /*

  John D. Cook

  How do you convert a color image to grayscale? If each color pixel is described
  by a triple (R, G, B) of intensities for red, green, and blue, how do you map
  that to a single number giving a grayscale value? The GIMP image software has
  three algorithms.

  The lightness method averages the most prominent and least prominent colors:
  (max(R, G, B) + min(R, G, B)) / 2.

  The average method simply averages the values: (R + G + B) / 3.

  The luminosity method is a more sophisticated version of the average method.
  It also averages the values, but it forms a weighted average to account for
  human perception. We’re more sensitive to green than other colors, so green is
  weighted most heavily. The formula for luminosity is 0.21 R + 0.72 G + 0.07 B.

  */

  // tha same ?
  convert_grey(image_data) {
    for (var x = 0; x < image_data.width; x++) {
      for (var y = 0; y < image_data.height; y++) {
        var i = x * 4 + y * 4 * image_data.width;
        var luma = Math.floor(image_data.data[i] * 299 / 1000 + image_data.data[i + 1] * 587 / 1000 + image_data.data[i + 2] * 114 / 1000);
        image_data.data[i] = luma;
        image_data.data[i + 1] = luma;
        image_data.data[i + 2] = luma;
        image_data.data[i + 3] = 255;
      }
    }
  }


  beginPath() {
    this.ctx.beginPath();
  }

  clearRectangle(x1, y1, x2, y2, fillStyle) {
    if (!fillStyle) {
      fillStyle = this.options.fill;
    }
    this.ctx.fillStyle = fillStyle;
    // Clear the entire canvas
    this.ctx.fillRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    // be sure to use beginPath() after to this if you need to draw something else.

  }

  clearCanvas(color) {
    // Clear the entire canvas, see end note on clearRectangle
    this.ctx.fillRect(0, 0, this.width, this.height, color);
    // console.log( this.clearRectangle(0, 0, this.ctx.width, this.ctx.height, color));
  }

  // revisar fading
  rectangle(x1, y1, x2, y2, fillStyle, lineWidth, lineJoin, lineCap, method) {
    if (!this.isNumber(lineWidth)) {
      lineWidth = this.options['stroke-width'];
    }
    if (!lineJoin) {
      lineJoin = this.options.lineJoin;
    }
    if (!lineCap) {
      lineCap = this.options.lineCap;
    }
    //if (!fillColor) {
    //    let fillColor = this.ctx.fillColor;
    // }
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
    // this.ctx.fillColor = fillColor;

    if (!method) {
      method = this.options.pathMethod;
    }
    // se chequea un error de analogía
    switch (method) {
      case 'stroke': {
        method = 'strokeRect';
        break;
      }
      case 'fill': {
        method = 'fillRect';
        break;
      }
    }
    this.ctx.fillStyle = fillStyle;
    if (method === 'strokeRect') {
      this.ctx.strokeRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    } else if (method === 'fillRect') {
      this.ctx.fillRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    }
  }

  // Cierra un polígono de líneas que se encuentre abierto...
  // El que se utiliza al final es endPath() para que dibuje, que

  moveTo(x2, y2) {
    this.ctx.moveTo(Math.round(x2), Math.round(y2));
  }

  // Sintetizar colores en escala de rojo, verde, azul y transparencia...

  lineTo(x2, y2) {
    this.ctx.lineTo(Math.round(x2), Math.round(y2));
  }

  // Función para el cálculo de colores rgba a profundidad 1 byte 0-255 que puede aumentar en un futuro

  // invoca a alguno de los métodos de stroke() o fill().
  closePath() {
    this.ctx.closePath();
  }

  // por ejemplo: 'rgba(0,200,0,1)'; // verde 200
  color(r, g, b, a) {
    if (args.length < 4) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  }

  // y viceversa
  rgbStringToArray(rgbString) {
    let arr = rgbString.replace(/ /g, '').slice(rgbString.indexOf('(') + 1, rgbString.indexOf(')')).split(',');
    for (let i = 0; i < arr.length; i++) {
      if (arr.length - 1 === i && arr.length === 4) {
        arr[i] = parseFloat(arr[i]);
      } else {
        arr[i] = parseInt(arr[i]);
      }
    }
    return arr;
  }

  // ajusta los niveles de transparencia de rr, gr, br para en el
  // suprimir el componente rs, gs, rr
  // del color rr, gr, y br

  // me devuelve un valor entre 0 y 1 (average o fuerza los canales, pueden usarse indistintamente)
  intensidad(r, g, b) {
    let resultado = r;
    if (this.isNumber(b)) {
      resultado = (resultado + g + b) / 3;
    } else if (this.isNumber(g)) {
      resultado = (resultado + g) / 2;
    }
    var how_deep = 255; // 1 byte 0-255 que puede aumentar en un futuro
    return resultado / how_deep;
  }

  ///////////////////////////////////////////////////


  // must be in this way... pueden utilizanse con rgb y rgba

  // lo que devuelve un valor entre 0 y 1 que significa la distancia entre los colores
  distanciaEntreColores(r1, g1, b1, r2, g2, b2, a1, a2) {
    if (args.length > 6) {
      return Math.sqrt((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2) + (a1 - a2) * (a1 - a2)) / 510;
    } else {
      return Math.sqrt((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)) / 441.6729559300637;
    }
  }

  // distancia subjetiva entre píxeles de un cuadro, valores entre 0 y 1.
  distanciaSubjetivaEntrePixeles(ancho, alto, x, y, r1, g1, b1, r2, g2, b2, a1, a2) {
    let argumentos = [].concat(...args);
    [ancho, alto, x, y] = [argumentos.shift(), argumentos.shift(), argumentos.shift(), argumentos.shift()];
    return Math.sqrt(Math.pow(x / ancho, 2) + Math.pow(y / alto, 2) + Math.pow(this.distanciaEntreColores(argumentos), 2));
  }

  // sobre un fondo rf, gf, bf
  suprimirColor(redBackground, greenBackground, blueBackground, redSupress, greenSupress, blueSupress, redReal, greenReal, blueReal) {
    let umbral = 72 / 255;
    if ((this.intensidad(redReal, greenReal, blueReal) + umbral) < (this.intensidad(redBackground, greenBackground, blueBackground))) {
      return [redSupress, greenSupress, blueSupress, 0];
    } else {
      return [redSupress, greenSupress, blueSupress, 255 - 255 * this.distanciaEntreColores(redSupress, greenSupress, blueSupress, redBackground, greenBackground, blueBackground)];
    }
  }

  // Dibujar un punto seleccionado, pues los puntos reales no son visibles
  // Se representan centrados con 4 veces el ancho de la línea
  // Y mantienen todas sus otras propiedaes... se rellenan o no,

  // según el método activo en this.options.pathMethod
  dot(x, y) {
    this.beginPath();
    this.ctx.lineWidth = this.options['stroke-width'];
    this.ctx.strokeStyle = this.options.stroke;
    this.ctx.lineJoin = this.options.lineJoin;
    this.ctx.lineCap = this.options.lineCap;
    switch (this.options.dotShape) {
      case 'box': {
        this.ctx.moveTo(Math.round(x) - 2 * this.options['stroke-width'], Math.round(y) - 2 * this.options['stroke-width']);
        this.ctx.lineTo(Math.round(x) + 2 * this.options['stroke-width'], Math.round(y) + 2 * this.options['stroke-width']);
        break;
      }
      case 'circle': {
        this.arc(x, y, 2 * this.options['stroke-width'], 0, 2 * Math.PI, true);
        break;
      }
    }
    this.endPath();
  }

  // PARE DIBUJAR LINEAS CON O SIN GRADACIONES
  line(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash) {
    this.beginPath();
    if (!startColor) {
      startColor = 'white';
    }
    if (!this.isNumber(lineWidth)) {
      lineWidth = 1;
    }
    if (!lineJoin) {
      lineJoin = 'round';
    }
    if (!lineCap) {
      lineCap = 'round';
    }
    this.ctx.lineWidth = lineWidth;
    if (endColor && (startColor !== endColor)) {
      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro, en realidad hace un rectángulo.

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    if (dash) {
      this.ctx.setLineDash(dash); // /* dashes are 5px and spaces are 3px */
    } else {
      this.ctx.setLineDash([]);
    }

    this.ctx.moveTo(Math.round(x1), Math.round(y1));
    this.ctx.lineTo(Math.round(x2), Math.round(y2));
    this.endPath();
  }

  polygon(coords, startColor = this.options.stroke, pathMethod = this.options.pathMethod, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap, closePath = false) {
    if (!coords) {
      return;
    }
    this.beginPath();
    this.ctx.lineWidth = lineWidth;
    var x1, y1, x2, y2;
    if (endColor && (startColor !== endColor)) {
      x1 = coords[0];
      y1 = coords[1];
      x2 = coords[coords.length - 2];
      y2 = coords[coords.length - 1];

      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro, en realidad hace un rectángulo

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradación
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
    // recorrer el arreglo de coordenadas en el orden que te expliqué...
    const initialPoint = coords.shift();
    this.ctx.moveTo(initialPoint.x, initialPoint.y);
    coords.forEach(point => this.ctx.lineTo(point.x, point.y));
    if (closePath) {
      this.ctx.closePath(); // cerrar la poligonal...
    }
    this.endPath(pathMethod);
  }

  // curva bezier con tres puntos de control, puedes utilizarla para dibujar los meridianos en otras proyecciones
  bezier(x1, y1, x2, y2, x3, y3, startColor = this.options.stroke, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap, closePath = false) {
    this.beginPath();
    if (endColor && (startColor !== endColor)) {
      var gradacion = this.ctx.createLinearGradient(x1, y1, x3, y3); // puede mejorarse, falta el punto medio

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    this.ctx.moveTo(Math.round(x1), Math.round(y1));
    this.ctx.bezierCurveTo(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2), Math.round(x3), Math.round(y3));
    if (closePath) {
      this.ctx.closePath(); // cerrar la poligonal...
    }
    this.endPath();
  }

  circle(xCenter, yCenter, radius, startAngle = 0, endAngle = 2 * Math.PI, clockWise = true, startColor = this.options.stroke, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap) {
    this.beginPath();
    this.ctx.lineWidth = lineWidth;
    if (endColor && (startColor !== endColor)) {

      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro de la diagonal de un rectángulo

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    this.moveTo(xCenter, yCenter);
    this.ctx.arc(xCenter, yCenter, radius, startAngle, endAngle, !clockWise);
    this.endPath();
  }

  // revisar si redunda con las funciones drawImage que se implementan mas abajo, revisar si se incluyó
  // un drawImaga a partir de una dirección fuente: ej. "vale.jpg"

  insertImage(image, x, y, w, h, sw, sh) { // please this order (inserta en un rango, recorta en el origen)
    if (args.length < 3) { // 2 param
      this.ctx.drawImage(image, x, y);
    } else if (args.length < 5) { // 4 param
      this.ctx.drawImage(image, x, y, w, h); // in destiny
    } else { // 4 param
      this.ctx.drawImage(image, sw, sh, x, y, w, h); // same order as above !== to original func.
    }
  }

  // ie: <img id=”mySheep” src=”sheep.png” style=”display:none;” />
  insertImageFromId(id, x, y, w, h, sw, sh) { // Ídem a insertImage
    // fix me
    this.insertImage(image, x, y, w, h, sw, sh);
  }

  // cambiar el color de fondo del canvas...
  backgroundColor(color) {
    this.canvas.style.backgroundColor = color; // por ejemplo, prueba: '#00F8', refresca instantáneo.
  }

  clearRect(x1, y1, x2, y2) {
    this.ctx.clearRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
  }

  endPath(method = this.options.pathMethod) {
    switch (method) {
      // estas son formas de dibujar lineas
      case 'stroke':
        return this.ctx.stroke();
      // esta otra me rellena un polígono
      case 'fill':
        return this.ctx.fill();
    }
  }

  outText(x, y, texto, font = this.options.font, textAlign = this.options.textAlign, textBaseline = this.options.textBaseline, textMaxWidth = this.options.textMaxWidth, textColor = this.options.stroke, method = this.options.textMethod) {
    // se chequea un error de analogía
    switch (method) {
      case
      'stroke': {
        method = 'strokeText';
        break;
      }
      case 'fill' : {
        method = 'fillText';
        break;
      }
    }
    // y a escribir
    if (method === 'strokeText') {
      return this.ctx.strokeText(texto, x, y, textMaxWidth);
    } else if (method === 'fillText') {
      return this.ctx.fillText(texto, x, y, textMaxWidth);
    }
  }


// POLIGONS & BASIC FORMS DRAWING

// Usage:
// this.drawStar(75,75,5,50,25,'mediumseagreen','gray',9);
// this.drawStar(150,200,8,50,25,'skyblue','gray',3);
// this.drawStar(225,75,16,50,20,'coral','transparent',0);
// this.drawStar(300,200,16,50,40,'gold','gray',3);
// centerX, centerY: the center point of the star
// points: the number of points on the exterior of the star
// inner: the radius of the inner points of the star
// outer: the radius of the outer points of the star
// fill, stroke: the fill and stroke colors to apply
// line: the linewidth of the stroke
  drawStar(centerX, centerY, points, outer, inner, fill, stroke, line) {
    // define the star
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY + outer);

    for (var i = 0; i < 2 * points + 1; i++) {
      var r = (i % 2 == 0) ? outer : inner;
      var a = Math.PI * i / points;
      this.ctx.lineTo(centerX + r * Math.sin(a), centerY + r * Math.cos(a));
    }

    this.ctx.closePath();
// draw
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = line;
    this.ctx.stroke();
  }


  /*
                                                                                        Dibujar un polígono con los bordes redondeados...
                                                                                        usage:

                                                                                        var triangle = [
                                                                                           { x: 200, y : 50 },
                                                                                           { x: 300, y : 200 },
                                                                                           { x: 100, y : 200 }
                                                                                          ];
                                                                                          var cornerRadius = 30;
                                                                                         this.ctx.lineWidth = 4;
                                                                                         this.ctx.fillStyle = "Green";
                                                                                         this.ctx.strokeStyle = "black";
                                                                                         this.ctx.beginPath(); // start a new path
                                                                                          roundedPoly(triangle, cornerRadius);
                                                                                         this.ctx.fill();
                                                                                         this.ctx.stroke();
                                                                                      */
  roundedPoly(points, radius) {
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection,
      drawDirection, angle, halfAngle, cRadius, lenOut;

    function asVec(p, pp, v) { // convert points to a line with len and normalised
      v.x = pp.x - p.x; // x,y as vec
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
      v.nx = v.x / v.len; // normalised
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx); // direction of vec
    }

    v1 = {};
    v2 = {};
    len = points.length; // number points
    p1 = points[len - 1]; // start at end of path
    for (i = 0; i < len; i++) { // do each corner
      p2 = points[(i) % len]; // the corner point that is being rounded
      p3 = points[(i + 1) % len];
      // get the corner as vectors out away from corner
      asVec(p2, p1, v1); // vec back from corner point
      asVec(p2, p3, v2); // vec forward from corner point
      // get corners cross product (asin of angle)
      sinA = v1.nx * v2.ny - v1.ny * v2.nx; // cross product
      // get cross product of first line and perpendicular second line
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
      angle = Math.asin(sinA); // get the angle
      radDirection = 1; // may need to reverse the radius
      drawDirection = false; // may need to draw the arc anticlockwise
      // find the correct quadrant for circle center
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
        } else {
          angle = Math.PI - angle; // move back into the 2nd quadrant
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      halfAngle = angle / 2;
      // get distance from corner to point where round corner touches line
      lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        // ajust the radius of corner rounding to fit
        cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
      y = p2.y + v2.ny * lenOut;
      x += -v2.ny * cRadius * radDirection; // move away from line to circle center
      y += v2.nx * cRadius * radDirection;
      // x,y is the rounded corner circle center
      this.ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
      p1 = p2;
      p2 = p3;
    }
    this.ctx.closePath();
  }

//  * From: Patrick Wied ( http://www.patrick-wied.at ) Under License: MIT License
  classifySkin(r, g, b) {
    // A Survey on Pixel-Based Skin Color Detection Techniques
    let rgbClassifier = ((r > 95) && (g > 40 && g < 100) && (b > 20) && ((Math.max(r, g, b) - Math.min(r, g, b)) > 15) && (Math.abs(r - g) > 15) && (r > g) && (r > b));
    let nurgb = this.toNormalizedRgb(r, g, b);
    let nr = nurgb[0];
    let ng = nurgb[1];
    let nb = nurgb[2];
    let normRgbClassifier = (((nr / ng) > 1.185) && (((r * b) / (Math.pow(r + g + b, 2))) > 0.107) && (((r * g) / (Math.pow(r + g + b, 2))) > 0.112));
    let hsv = this.toHsv(r, g, b);
    let h = hsv[0] * 100;
    let s = hsv[1];
    hsv = this.toHsvTest(r, g, b);
    h = hsv[0];
    s = hsv[1];
    let hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);
    let ycc = this.toYcc(r, g, b);
    let y = ycc[0];
    let cb = ycc[1];
    let cr = ycc[2];
    let yccClassifier = ((y > 80) && (cb > 77 && cb < 127) && (cr > 133 && cr < 173));
    return {
      skin: (rgbClassifier || normRgbClassifier || hsvClassifier),
      class: yccClassifier,
    };
  }
  ;

  toYcc(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let y = 0.299 * r + 0.587 * g + 0.114 * b;
    let cr = r - y;
    let cb = b - y;

    return [y, cr, cb];
  }

  toHsv(r, g, b) {
    return [// hue
      Math.acos((0.5 * ((r - g) + (r - b))) / (Math.sqrt((Math.pow((r - g), 2) + ((r - b) * (g - b)))))), // saturation
      1 - (3 * ((Math.min(r, g, b)) / (r + g + b))), // value
      (1 / 3) * (r + g + b)];
  }

  toHsvTest(r, g, b) {
    let h = 0;
    let mx = Math.max(r, g, b);
    let mn = Math.min(r, g, b);
    let dif = mx - mn;

    if (mx == r) {
      h = (g - b) / dif;
    } else if (mx == g) {
      h = 2 + ((g - r) / dif);
    } else {
      h = 4 + ((r - g) / dif);
    }
    h = h * 60;
    if (h < 0) {
      h = h + 360;
    }

    return [h, 1 - (3 * ((Math.min(r, g, b)) / (r + g + b))), (1 / 3) * (r + g + b)];

  }

  toNormalizedRgb(r, g, b) {
    let sum = r + g + b;
    return [(r / sum), (g / sum), (b / sum)];
  }

  drawCheckbox(text, checked = false, x, y, paint = true) {
    this.ctx.save();
    this.ctx.font = '10px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    var metrics = this.ctx.measureText(text);
    if (paint) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.rect(x - 5, y - 5, 10, 10);
      this.ctx.stroke();
      if (checked) {
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
      }
      this.ctx.fillText(text, x + 5, y);
    }
    this.ctx.beginPath();
    this.ctx.rect(x - 7, y - 7, 12 + metrics.width + 2, 14);

    this.ctx.drawFocusIfNeeded(text);
    this.ctx.restore();
  }

  estratyegiaNotasIntermedias(x, y, radius, cpx, cpy, cp1x, cp1y, cp2x, cp2y) {
    // ✔MDN
    context.moveTo(x, y);
    path.moveTo(x, y);
    // Creates a new subpath with the given point.

    context.closePath();
    path.closePath();
    // Marks the current subpath as closed, and starts a new subpath with a point the same as the start and end of the newly closed subpath.

    context.lineTo(x, y);
    path.lineTo(x, y);
    // Adds the given point to the current subpath, connected to the previous one by a straight line.

    context.quadraticCurveTo(cpx, cpy, x, y);
    path.quadraticCurveTo(cpx, cpy, x, y);
    // Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.

    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    // Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.

    context.arcTo(x1, y1, x2, y2, radius);
    path.arcTo(x1, y1, x2, y2, radius);
  }

  conectarCanvas(nombre) {
    // Primero se carga en un objeto para poder accederlo a código
    this.canvas = document.getElementById(nombre);
    // Y este es el contexto que te permite dibujar
    this.ctx = canvas.getContext('2d');
  }

  colorDeFondo(col) {
    this.canvas.style.backgroundColor = col;
  }

  comenzarDibujo() {
    this.ctx.beginPath();
  }

  terminarDibujo(method) {
    if (!method) {
      method = 'stroke';
    }
    switch (method) {
      // estas son formas de dibujar lineas
      case 'stroke':
        return this.ctx.stroke();
      // esta otra me rellena un polígono
      case 'fill':
        return this.ctx.fill();
    }
  }

// PARE DIBUJAR LINEAS CON O SIN GRADACIONES
  linea(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash) {
    this.comenzarDibujo();
    if (!startColor) {
      startColor = 'white';
    }
    if (!endColor) {
      endColor = startColor;
    }
    if (!isNumber(lineWidth)) {
      lineWidth = 1;
    }
    if (!lineJoin) {
      lineJoin = 'round';
    }
    if (!lineCap) {
      lineCap = 'round';
    }
    this.ctx.lineWidth = lineWidth;
    if (endColor && (startColor !== endColor)) {
      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro, en realidad hace un rectángulo.

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    if (dash) {
      this.ctx.setLineDash(dash); // /* dashes are 5px and spaces are 3px */
    } else {
      this.ctx.setLineDash([]);
    }

    this.ctx.moveTo(Math.round(x1), Math.round(y1));
    this.ctx.lineTo(Math.round(x2), Math.round(y2));
    this.terminarDibujo();
  }

  flecha(fromx, fromy, tox, toy, arrowWidth, color = 'black') {
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy - fromy, tox - fromx);

    this.ctx.save();
    this.ctx.strokeStyle = color;

    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.lineWidth = arrowWidth;
    this.ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    this.ctx.beginPath();
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7),
      toy - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    this.ctx.stroke();
    this.ctx.restore();
  }

  // PARA DIBUJAR FLECHAS Y CABEZAS DE FLECHAS (Los métodos que tienen el prefijo _ son privados para uso propio de la librería)
  // Copyright Patrick Horgan patrick at dbp-consulting dot com
  // Permission to use granted as long as you keep this notice intact
  // use strict is everywhere because some browsers still don't support
  // using it once for the whole file and need per method/function
  // use.
  // Part is derivitive of work by Juan Mendes as noted below as appropriate.
  // Some things depend on code in http://dbp-consulting/scripts/utilities.js
  drawLineAngle = function(x0, y0, angle, length) {
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x0 + length * Math.cos(angle), y0 + length * Math.sin(angle));
    this.ctx.stroke();
  };

  drawHead = function(x0, y0, x1, y1, x2, y2, style, color) {
    if (typeof (x0) == 'string') x0 = parseInt(x0);
    if (typeof (y0) == 'string') y0 = parseInt(y0);
    if (typeof (x1) == 'string') x1 = parseInt(x1);
    if (typeof (y1) == 'string') y1 = parseInt(y1);
    if (typeof (x2) == 'string') x2 = parseInt(x2);
    if (typeof (y2) == 'string') y2 = parseInt(y2);
    var radius = 3;
    var twoPI = 2 * Math.PI;

    // all cases do
    this.ctx.beginPath();
    if (color) this.ctx.strokeStyle = color;
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    switch (style) {
      case 0:
        // curved filled, add the bottom as an arcTo curve and fill
        var backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.arcTo(x1, y1, x0, y0, .55 * backdist);
        this.ctx.fill();
        break;
      case 1:
        // straight filled, add the bottom as a line and fill.
        this.ctx.beginPath();
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x0, y0);
        this.ctx.fill();
        break;
      case 2:
        // unfilled head, just stroke.
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.stroke();
        break;
      case 3:
        //filled head, add the bottom as a quadraticCurveTo curve and fill
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        var cpx = (x0 + x1 + x2) / 3;
        var cpy = (y0 + y1 + y2) / 3;
        this.ctx.quadraticCurveTo(cpx, cpy, x0, y0);
        this.ctx.fill();
        break;
      case 4:
        //filled head, add the bottom as a bezierCurveTo curve and fill
        var cp1x, cp1y, cp2x, cp2y, backdist;
        var shiftamt = 5;
        if (x2 == x0) {
          // Avoid a divide by zero if x2==x0
          backdist = y2 - y0;
          cp1x = (x1 + x0) / 2;
          cp2x = (x1 + x0) / 2;
          cp1y = y1 + backdist / shiftamt;
          cp2y = y1 - backdist / shiftamt;
        } else {
          backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
          var xback = (x0 + x2) / 2;
          var yback = (y0 + y2) / 2;
          var xmid = (xback + x1) / 2;
          var ymid = (yback + y1) / 2;

          var m = (y2 - y0) / (x2 - x0);
          var dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt;
          var dy = m * dx;
          cp1x = xmid - dx;
          cp1y = ymid - dy;
          cp2x = xmid + dx;
          cp2y = ymid + dy;
        }
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
        this.ctx.fill();
        break;
    }
  };

  drawArcedArrow = function(x, y, r, startangle, endangle, anticlockwise, style, which, angle, d) {
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1; // end point gets arrow
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
    d = typeof (d) != 'undefined' ? d : 10;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, startangle, endangle, anticlockwise);
    this.ctx.stroke();
    var sx, sy, lineangle, destx, desty;
    this.ctx.strokeStyle = 'rgba(0,0,0,0)';	// don't show the shaft
    if (which & 1) {	    // draw the destination end
      sx = Math.cos(startangle) * r + x;
      sy = Math.sin(startangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      } else {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      }
      this.flecha(this.ctx, sx, sy, destx, desty, style, 2, angle, d);
    }
    if (which & 2) {	    // draw the origination end
      sx = Math.cos(endangle) * r + x;
      sy = Math.sin(endangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      } else {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      }
      this.flecha(ctx, sx, sy, destx, desty, style, 2, angle, d);
    }
    this.ctx.restore();
  };

  /*
  x1,y1 - the line of the shaft starts here
  x2,y2 - the line of the shaft ends here
  style - type of head to draw

      0 - filled head with back a curve drawn with arcTo
      n.b. some browsers have an arcTo bug that make this look bizarre (no longer but kept for historical purposes. Things get weird during implementation of specs).
      1 - filled head with back a straight line
      2 - unfilled but stroked head
      3 - filled head with back a curve drawn with quadraticCurveTo
      4 - filled head with back a curve drawn with bezierCurveTo
      function(ctx,x0,y0,x1,y1,x2,y2,style) - a function provided by the user to draw the head. Point (x1,y1) is the same as the end of the line, and (x0,y0) and (x2,y2) are the two back corners. The style argument is the this for the function. An example that just draws little circles at each corner of the arrow head is shown later in this document.

  default 3 (filled head with quadratic back)
  which - which end(s) get the arrow

      0 - neither
      1 - x2,y2 end
      2 - x1,y1 end
      3 - (that's 1+2) both ends

  default 1 (destination end gets the arrow)
  angle - the angle θ from shaft to one side of arrow head - default π/8 radians (22 1/2°, half of a 45°)
  length - the distance d in pixels from arrow point back along the shaft to the back of the arrow head - default 10px
  */

  flecha = function(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d) {
    if (which === 0) {
      return this.linea(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash);
    }
    // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
    // would happen instead of addition
    if (typeof (x1) == 'string') x1 = parseInt(x1);
    if (typeof (y1) == 'string') y1 = parseInt(y1);
    if (typeof (x2) == 'string') x2 = parseInt(x2);
    if (typeof (y2) == 'string') y2 = parseInt(y2);
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1; // end point gets arrow
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
    d = typeof (d) != 'undefined' ? d : 10;
    // default to using drawHead to draw the head, but if the style
    // argument is a function, use it instead
    var toDrawHead = typeof (style) != 'method' ? this.drawHead : style;

    // For ends with arrow we actually want to stop before we get to the arrow
    // so that wide lines won't put a flat end on the arrow.
    //
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;
    if (which & 1) {
      tox = Math.round(x1 + (x2 - x1) * ratio);
      toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
      tox = x2;
      toy = y2;
    }
    if (which & 2) {
      fromx = x1 + (x2 - x1) * (1 - ratio);
      fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
      fromx = x1;
      fromy = y1;
    }

    if (!endColor) {
      endColor = startColor;
    }

    // Draw the shaft of the arrow
    this.linea(fromx, fromy, tox, toy, startColor, endColor, lineWidth, lineJoin, lineCap, dash);

    // calculate the angle of the line
    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    // h is the line length of a side of the arrow head
    var h = Math.abs(d / Math.cos(angle));

    if (which & 1) {	// handle far end arrow head
      var angle1 = lineangle + Math.PI + angle;
      var topx = x2 + Math.cos(angle1) * h;
      var topy = y2 + Math.sin(angle1) * h;
      var angle2 = lineangle + Math.PI - angle;
      var botx = x2 + Math.cos(angle2) * h;
      var boty = y2 + Math.sin(angle2) * h;
      this.toDrawHead(topx, topy, x2, y2, botx, boty, style, endColor);
    }
    if (which & 2) { // handle near end arrow head
      var angle1 = lineangle + angle;
      var topx = x1 + Math.cos(angle1) * h;
      var topy = y1 + Math.sin(angle1) * h;
      var angle2 = lineangle - angle;
      var botx = x1 + Math.cos(angle2) * h;
      var boty = y1 + Math.sin(angle2) * h;
      this.toDrawHead(topx, topy, x1, y1, botx, boty, style, startColor);
    }
  };

// Dibuja el borde de un rectángulo, si opcionalmente se le pasa un color de relleno, lo rellena
  rectangulo(x1, y1, x2, y2, colorBorde, colorRelleno) {
    // Cargando
    if (colorRelleno) {
      this.ctx.fillStyle = colorRelleno;
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }

    if (colorBorde) {
      this.ctx.strokeStyle = colorBorde;
    }

    this.linea(x1, y1, x2, y1, colorBorde);
    this.linea(x2, y2, x2, y1, colorBorde);
    this.linea(x1, y1, x1, y2, colorBorde);
    this.linea(x1, y2, x2, y2, colorBorde);
  }

  colorDibujo(col) {
    let tmp = this.ctx.strokeStyle;
    if (col) {
      this.ctx.strokeStyle = col;
    }
    return tmp;
  }

  colorRelleno(col) {
    let tmp = this.ctx.fillStyle;
    if (col) {
      this.ctx.fillStyle = col;
    }
    return tmp;
  }

// Usage:
// drawStar(75,75,5,50,25,'mediumseagreen','gray',9);
// drawStar(150,200,8,50,25,'skyblue','gray',3);
// drawStar(225,75,16,50,20,'coral','transparent',0);
// drawStar(300,200,16,50,40,'gold','gray',3);
// centroX, centroY: the center point of the star
// puntas: the number of points on the exterior of the star
// radioInterior: the radius of the inner points of the star
// radioExterior: the radius of the outer points of the star
// colorRelleno, colorBorde: the fill and stroke colors to apply
// anchoLinea: the linewidth of the stroke
  estrella(centroX, centroY, puntas, radioExterior, radioInterior, colorRelleno, colorBorde, anchoLinea) {
    // define the star
    this.ctx.beginPath();
    this.ctx.moveTo(centroX, centroY + radioExterior);
    for (var i = 0; i < 2 * puntas + 1; i++) {
      var r = (i % 2 == 0) ? radioExterior : radioInterior;
      var a = Math.PI * i / puntas;
      this.ctx.lineTo(centroX + r * Math.sin(a), centroY + r * Math.cos(a));
    }

    this.ctx.closePath();
    // draw
    this.ctx.fillStyle = colorRelleno;
    this.ctx.fill();
    this.ctx.strokeStyle = colorBorde;
    this.ctx.lineWidth = anchoLinea;
    this.ctx.stroke();
  }

  texto(x, y, lines, relleno, borde, fontFace, fontSize) {
    if (!fontFace) { // (es en px)
      fontFace = 'Tahoma';
    }
    if (!fontSize) { // (es en px)
      fontSize = 48;
    }
    this.ctx.font = `${fontSize}px "${fontFace}"'`; //estilo de texto
    this.ctx.beginPath(); //iniciar ruta
    if (!borde && !relleno) {
      relleno = ctx.fillStyle;
    }
    if (borde && relleno) {
      this.ctx.strokeStyle = borde;
      this.ctx.fillStyle = relleno;
      this.ctx.strokeText(lines, x, y); //texto con los dos métodos
      this.ctx.fillText(lines, x, y);
    } else if (borde) {
      this.ctx.strokeStyle = borde;
      this.ctx.strokeText(lines, x, y); //texto con método stroke
    } else if (relleno) { // should be
      this.ctx.fillStyle = relleno;
      this.ctx.fillText(lines, x, y);
    }
  }

// Inyectar un div dentro de un canvas
  inyectar(x, y, divName, colorBorde) {
    var resultado = {width: 0, height: 0};
    var datosElemento = document.getElementById('idtable').getBoundingClientRect();
    resultado.width = Math.round(datosElemento.width);
    resultado.height = Math.round(datosElemento.height) + 40;
    var data = `<svg xmlns='http://www.w3.org/2000/svg' width='${resultado.width}' height='${resultado.height}'>` + '<foreignObject width=\'100%\' height=\'100%\'>' + document.getElementById(divName).innerHTML + '</foreignObject>' + '</svg>';
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    });
    var url = DOMURL.createObjectURL(svg);
    img.onload = function() {
      ctx.drawImage(img, x, y);
      // alert(`${resultado.height} contra ${img.height}`);
      resultado.width = img.width;
      resultado.height = img.height;
      if (colorBorde) {
        this.rectangulo(x, y, x + img.width, y + img.height, colorBorde);
      }
      DOMURL.revokeObjectURL(url);
    };
    img.src = url;
    return resultado; // ancho y alto...
  }

  html_to_xml(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);

    // You must manually set the xmlns if you intend to immediately serialize
    // the HTML document to a string as opposed to appending it to a
    // <foreignObject> in the DOM
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

    // Get well-formed markup
    html = (new XMLSerializer).serializeToString(doc.body);
    return html;
  }

  conectarCanvas(nombre) {
    // Primero se carga en un objeto para poder accederlo a código
    this.canvas = document.getElementById(nombre);
    // Y este es el contexto que te permite dibujar
    this.ctx = canvas.getContext('2d');
  }

  dibujarConector(x1, y1, x2, y2, salida, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d) {
    if (x1 === x2 || y1 === y2) {
      this.flecha(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d);
    }
  }

// FUNCIONAL, ESTE ES PARA EL FRONT END
  insertarTablaEnCanvas(tableHtml, x, y, colorBorde) {
    var resultado = {x: x, y: y, ancho: 0, alto: 0};
    document.getElementById('idtable').innerHTML = tableHtml;
    let tmp = this.inyectar(x, y, 'mytable', colorBorde); // Aquí va el nombre del div...
    resultado.ancho = tmp.width;
    resultado.alto = tmp.height;
    document.getElementById('idtable').innerHTML = '';
    return resultado;
  }

  // Copyright(c) CpnCrunch (Stackoverflow, validado, inserta con estilos pero hay que darle dimensiones)
  render_html_to_canvas(html, ctx, x, y, width, height, colorBorde) {
    var resultado = {x: x, y: y, ancho: width, alto: height, colorBorde};

    function html_to_xml(html) {
      var doc = document.implementation.createHTMLDocument('');
      doc.write(html);
      // You must manually set the xmlns if you intend to immediately serialize
      // the HTML document to a string as opposed to appending it to a
      // <foreignObject> in the DOM
      doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
      // Get well-formed markup
      html = (new XMLSerializer).serializeToString(doc.body);
      return html;
    }

    var xml = html_to_xml(html);
    xml = xml.replace(/\#/g, '%23');
    var data = 'data:image/svg+xml;charset=utf-8,' + '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' + '<foreignObject width="100%" height="100%">' + xml + '</foreignObject>' + '</svg>';
    var img = new Image();
    img.onload = function() {
      this.#ctx.drawImage(img, x, y);
      if (colorBorde) {
        rectangulo(x, y, x + img.width, y + img.height, colorBorde);
      }
      resultado.x = x;
      resultado.y = y;
      resultado.ancho = img.width;
      resultado.alto = img.height;
      resultado.colorBorde = colorBorde;
    };
    img.src = data;
    return resultado;
  }

  extractToCanvas(html, x, y, colorBorde) {
    document.getElementById('idtable').innerHTML = html;
    var datosElemento = document.getElementById('idtable').getBoundingClientRect();
    return this.render_html_to_canvas(html, ctx, x, y, datosElemento.width, datosElemento.height, colorBorde);
  }


}
