import {WebSystemObject} from './WebSystemObject';

/**
 *
 * Based on tne workaround of the:
 *
 * @author Extended, bugfixed and ported to TypeScript: Ikaros Kappler.
 * @modified 2018-xx-xx Added a clone() function.
 * @modified 2018-xx-xx Allowing leading '#' in the makeHEX() function.
 * @modified 2018-11-28 Fixed the checkHEX() function to accept 000000.
 * @modified 2019-11-18 Added a generic parse(string) function that detects the format.
 * @modified 2020-01-09 Fixed a bug in the parse(string) function. Hex colors with only three elements were considered faulty.
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2021-02-08 Added basic tsdoc/jsdoc comments.
 * @modified 2021-11-05 Fixing the regex to parse rgba-strings.
 * @version 0.0.11
 **/


/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at  https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
class Color extends WebSystemObject {
  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  r;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  g;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  b;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  h;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  s;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  l;

  /**
   * @member {number}
   * @memberof Color
   * @instance
   */
  a;

  /**
   * IDE-Memorándum structure to Web colors names (Bultet - Spectrum)
   */
  static spectrum = [
    {
      'name': 'aliceblue',
      'code': '#F0F8FF',
      'rbg': {'red': 240, 'green': 248, 'blue': 255},
    }, {
      'name': 'antiquewhite',
      'code': '#FAEBD7',
      'rbg': {'red': 250, 'green': 235, 'blue': 215},
    }, {
      'name': 'aqua',
      'code': '#00FFFF',
      'rbg': {'red': 0, 'green': 255, 'blue': 255},
    }, {
      'name': 'aquamarine',
      'code': '#7FFFD4',
      'rbg': {'red': 127, 'green': 255, 'blue': 212},
    }, {
      'name': 'azure',
      'code': '#F0FFFF',
      'rbg': {'red': 240, 'green': 255, 'blue': 255},
    }, {
      'name': 'beige',
      'code': '#F5F5DC',
      'rbg': {'red': 245, 'green': 245, 'blue': 220},
    }, {
      'name': 'bisque',
      'code': '#FFE4C4',
      'rbg': {'red': 255, 'green': 228, 'blue': 196},
    }, {
      'name': 'black',
      'code': '#000000',
      'rbg': {'red': 0, 'green': 0, 'blue': 0},
    }, {
      'name': 'blanchedalmond',
      'code': '#FFEBCD',
      'rbg': {'red': 255, 'green': 235, 'blue': 205},
    }, {
      'name': 'blue',
      'code': '#0000FF',
      'rbg': {'red': 0, 'green': 0, 'blue': 255},
    }, {
      'name': 'blueviolet',
      'code': '#8A2BE2',
      'rbg': {'red': 138, 'green': 43, 'blue': 226},
    }, {
      'name': 'brown',
      'code': '#A52A2A',
      'rbg': {'red': 165, 'green': 42, 'blue': 42},
    }, {
      'name': 'burlywood',
      'code': '#DEB887',
      'rbg': {'red': 222, 'green': 184, 'blue': 135},
    }, {
      'name': 'cadetblue',
      'code': '#5F9EA0',
      'rbg': {'red': 95, 'green': 158, 'blue': 160},
    }, {
      'name': 'chartreuse',
      'code': '#7FFF00',
      'rbg': {'red': 127, 'green': 255, 'blue': 0},
    }, {
      'name': 'chocolate',
      'code': '#D2691E',
      'rbg': {'red': 210, 'green': 105, 'blue': 30},
    }, {
      'name': 'coral',
      'code': '#FF7F50',
      'rbg': {'red': 255, 'green': 127, 'blue': 80},
    }, {
      'name': 'cornflowerblue',
      'code': '#6495ED',
      'rbg': {'red': 100, 'green': 149, 'blue': 237},
    }, {
      'name': 'cornsilk',
      'code': '#FFF8DC',
      'rbg': {'red': 255, 'green': 248, 'blue': 220},
    }, {
      'name': 'crimson',
      'code': '#DC143C',
      'rbg': {'red': 220, 'green': 20, 'blue': 60},
    }, {
      'name': 'cyan',
      'code': '#00FFFF',
      'rbg': {'red': 0, 'green': 255, 'blue': 255},
    }, {
      'name': 'darkblue',
      'code': '#00008B',
      'rbg': {'red': 0, 'green': 0, 'blue': 139},
    }, {
      'name': 'darkcyan',
      'code': '#008B8B',
      'rbg': {'red': 0, 'green': 139, 'blue': 139},
    }, {
      'name': 'darkgoldenrod',
      'code': '#B8860B',
      'rbg': {'red': 184, 'green': 134, 'blue': 11},
    }, {
      'name': 'darkgray',
      'code': '#A9A9A9',
      'rbg': {'red': 169, 'green': 169, 'blue': 169},
    }, {
      'name': 'darkgreen',
      'code': '#006400',
      'rbg': {'red': 0, 'green': 100, 'blue': 0},
    }, {
      'name': 'darkgrey',
      'code': '#A9A9A9',
      'rbg': {'red': 169, 'green': 169, 'blue': 169},
    }, {
      'name': 'darkkhaki',
      'code': '#BDB76B',
      'rbg': {'red': 189, 'green': 183, 'blue': 107},
    }, {
      'name': 'darkmagenta',
      'code': '#8B008B',
      'rbg': {'red': 139, 'green': 0, 'blue': 139},
    }, {
      'name': 'darkolivegreen',
      'code': '#556B2F',
      'rbg': {'red': 85, 'green': 107, 'blue': 47},
    }, {
      'name': 'darkorange',
      'code': '#FF8C00',
      'rbg': {'red': 255, 'green': 140, 'blue': 0},
    }, {
      'name': 'darkorchid',
      'code': '#9932CC',
      'rbg': {'red': 153, 'green': 50, 'blue': 204},
    }, {
      'name': 'darkred',
      'code': '#8B0000',
      'rbg': {'red': 139, 'green': 0, 'blue': 0},
    }, {
      'name': 'darksalmon',
      'code': '#E9967A',
      'rbg': {'red': 233, 'green': 150, 'blue': 122},
    }, {
      'name': 'darkseagreen',
      'code': '#8FBC8F',
      'rbg': {'red': 143, 'green': 188, 'blue': 143},
    }, {
      'name': 'darkslateblue',
      'code': '#483D8B',
      'rbg': {'red': 72, 'green': 61, 'blue': 139},
    }, {
      'name': 'darkslategray',
      'code': '#2F4F4F',
      'rbg': {'red': 47, 'green': 79, 'blue': 79},
    }, {
      'name': 'darkslategrey',
      'code': '#2F4F4F',
      'rbg': {'red': 47, 'green': 79, 'blue': 79},
    }, {
      'name': 'darkturquoise',
      'code': '#00CED1',
      'rbg': {'red': 0, 'green': 206, 'blue': 209},
    }, {
      'name': 'darkviolet',
      'code': '#9400D3',
      'rbg': {'red': 148, 'green': 0, 'blue': 211},
    }, {
      'name': 'deeppink',
      'code': '#FF1493',
      'rbg': {'red': 255, 'green': 20, 'blue': 147},
    }, {
      'name': 'deepskyblue',
      'code': '#00BFFF',
      'rbg': {'red': 0, 'green': 191, 'blue': 255},
    }, {
      'name': 'dimgray',
      'code': '#696969',
      'rbg': {'red': 105, 'green': 105, 'blue': 105},
    }, {
      'name': 'dimgrey',
      'code': '#696969',
      'rbg': {'red': 105, 'green': 105, 'blue': 105},
    }, {
      'name': 'dodgerblue',
      'code': '#1E90FF',
      'rbg': {'red': 30, 'green': 144, 'blue': 255},
    }, {
      'name': 'firebrick',
      'code': '#B22222',
      'rbg': {'red': 178, 'green': 34, 'blue': 34},
    }, {
      'name': 'floralwhite',
      'code': '#FFFAF0',
      'rbg': {'red': 255, 'green': 250, 'blue': 240},
    }, {
      'name': 'forestgreen',
      'code': '#228B22',
      'rbg': {'red': 34, 'green': 139, 'blue': 34},
    }, {
      'name': 'fuchsia',
      'code': '#FF00FF',
      'rbg': {'red': 255, 'green': 0, 'blue': 255},
    }, {
      'name': 'gainsboro',
      'code': '#DCDCDC',
      'rbg': {'red': 220, 'green': 220, 'blue': 220},
    }, {
      'name': 'ghostwhite',
      'code': '#F8F8FF',
      'rbg': {'red': 248, 'green': 248, 'blue': 255},
    }, {
      'name': 'gold',
      'code': '#FFD700',
      'rbg': {'red': 255, 'green': 215, 'blue': 0},
    }, {
      'name': 'goldenrod',
      'code': '#DAA520',
      'rbg': {'red': 218, 'green': 165, 'blue': 32},
    }, {
      'name': 'gray',
      'code': '#808080',
      'rbg': {'red': 128, 'green': 128, 'blue': 128},
    }, {
      'name': 'green',
      'code': '#008000',
      'rbg': {'red': 0, 'green': 128, 'blue': 0},
    }, {
      'name': 'greenyellow',
      'code': '#ADFF2F',
      'rbg': {'red': 173, 'green': 255, 'blue': 47},
    }, {
      'name': 'grey',
      'code': '#808080',
      'rbg': {'red': 128, 'green': 128, 'blue': 128},
    }, {
      'name': 'honeydew',
      'code': '#F0FFF0',
      'rbg': {'red': 240, 'green': 255, 'blue': 240},
    }, {
      'name': 'hotpink',
      'code': '#FF69B4',
      'rbg': {'red': 255, 'green': 105, 'blue': 180},
    }, {
      'name': 'indianred',
      'code': '#CD5C5C',
      'rbg': {'red': 205, 'green': 92, 'blue': 92},
    }, {
      'name': 'indigo',
      'code': '#4B0082',
      'rbg': {'red': 75, 'green': 0, 'blue': 130},
    }, {
      'name': 'ivory',
      'code': '#FFFFF0',
      'rbg': {'red': 255, 'green': 255, 'blue': 240},
    }, {
      'name': 'khaki',
      'code': '#F0E68C',
      'rbg': {'red': 240, 'green': 230, 'blue': 140},
    }, {
      'name': 'lavender',
      'code': '#E6E6FA',
      'rbg': {'red': 230, 'green': 230, 'blue': 250},
    }, {
      'name': 'lavenderblush',
      'code': '#FFF0F5',
      'rbg': {'red': 255, 'green': 240, 'blue': 245},
    }, {
      'name': 'lawngreen',
      'code': '#7CFC00',
      'rbg': {'red': 124, 'green': 252, 'blue': 0},
    }, {
      'name': 'lemonchiffon',
      'code': '#FFFACD',
      'rbg': {'red': 255, 'green': 250, 'blue': 205},
    }, {
      'name': 'lightblue',
      'code': '#ADD8E6',
      'rbg': {'red': 173, 'green': 216, 'blue': 230},
    }, {
      'name': 'lightcoral',
      'code': '#F08080',
      'rbg': {'red': 240, 'green': 128, 'blue': 128},
    }, {
      'name': 'lightcyan',
      'code': '#E0FFFF',
      'rbg': {'red': 224, 'green': 255, 'blue': 255},
    }, {
      'name': 'lightgoldenrodyellow',
      'code': '#FAFAD2',
      'rbg': {'red': 250, 'green': 250, 'blue': 210},
    }, {
      'name': 'lightgray',
      'code': '#D3D3D3',
      'rbg': {'red': 211, 'green': 211, 'blue': 211},
    }, {
      'name': 'lightgreen',
      'code': '#90EE90',
      'rbg': {'red': 144, 'green': 238, 'blue': 144},
    }, {
      'name': 'lightgrey',
      'code': '#D3D3D3',
      'rbg': {'red': 211, 'green': 211, 'blue': 211},
    }, {
      'name': 'lightpink',
      'code': '#FFB6C1',
      'rbg': {'red': 255, 'green': 182, 'blue': 193},
    }, {
      'name': 'lightsalmon',
      'code': '#FFA07A',
      'rbg': {'red': 255, 'green': 160, 'blue': 122},
    }, {
      'name': 'lightseagreen',
      'code': '#20B2AA',
      'rbg': {'red': 32, 'green': 178, 'blue': 170},
    }, {
      'name': 'lightskyblue',
      'code': '#87CEFA',
      'rbg': {'red': 135, 'green': 206, 'blue': 250},
    }, {
      'name': 'lightslategray',
      'code': '#778899',
      'rbg': {'red': 119, 'green': 136, 'blue': 153},
    }, {
      'name': 'lightslategrey',
      'code': '#778899',
      'rbg': {'red': 119, 'green': 136, 'blue': 153},
    }, {
      'name': 'lightsteelblue',
      'code': '#B0C4DE',
      'rbg': {'red': 176, 'green': 196, 'blue': 222},
    }, {
      'name': 'lightyellow',
      'code': '#FFFFE0',
      'rbg': {'red': 255, 'green': 255, 'blue': 224},
    }, {
      'name': 'lime',
      'code': '#00FF00',
      'rbg': {'red': 0, 'green': 255, 'blue': 0},
    }, {
      'name': 'limegreen',
      'code': '#32CD32',
      'rbg': {'red': 50, 'green': 205, 'blue': 50},
    }, {
      'name': 'linen',
      'code': '#FAF0E6',
      'rbg': {'red': 250, 'green': 240, 'blue': 230},
    }, {
      'name': 'magenta',
      'code': '#FF00FF',
      'rbg': {'red': 255, 'green': 0, 'blue': 255},
    }, {
      'name': 'maroon',
      'code': '#800000',
      'rbg': {'red': 128, 'green': 0, 'blue': 0},
    }, {
      'name': 'mediumaquamarine',
      'code': '#66CDAA',
      'rbg': {'red': 102, 'green': 205, 'blue': 170},
    }, {
      'name': 'mediumblue',
      'code': '#0000CD',
      'rbg': {'red': 0, 'green': 0, 'blue': 205},
    }, {
      'name': 'mediumorchid',
      'code': '#BA55D3',
      'rbg': {'red': 186, 'green': 85, 'blue': 211},
    }, {
      'name': 'mediumpurple',
      'code': '#9370DB',
      'rbg': {'red': 147, 'green': 112, 'blue': 219},
    }, {
      'name': 'mediumseagreen',
      'code': '#3CB371',
      'rbg': {'red': 60, 'green': 179, 'blue': 113},
    }, {
      'name': 'mediumslateblue',
      'code': '#7B68EE',
      'rbg': {'red': 123, 'green': 104, 'blue': 238},
    }, {
      'name': 'mediumspringgreen',
      'code': '#00FA9A',
      'rbg': {'red': 0, 'green': 250, 'blue': 154},
    }, {
      'name': 'mediumturquoise',
      'code': '#48D1CC',
      'rbg': {'red': 72, 'green': 209, 'blue': 204},
    }, {
      'name': 'mediumvioletred',
      'code': '#C71585',
      'rbg': {'red': 199, 'green': 21, 'blue': 133},
    }, {
      'name': 'midnightblue',
      'code': '#191970',
      'rbg': {'red': 25, 'green': 25, 'blue': 112},
    }, {
      'name': 'mintcream',
      'code': '#F5FFFA',
      'rbg': {'red': 245, 'green': 255, 'blue': 250},
    }, {
      'name': 'mistyrose',
      'code': '#FFE4E1',
      'rbg': {'red': 255, 'green': 228, 'blue': 225},
    }, {
      'name': 'moccasin',
      'code': '#FFE4B5',
      'rbg': {'red': 255, 'green': 228, 'blue': 181},
    }, {
      'name': 'navajowhite',
      'code': '#FFDEAD',
      'rbg': {'red': 255, 'green': 222, 'blue': 173},
    }, {
      'name': 'navy',
      'code': '#000080',
      'rbg': {'red': 0, 'green': 0, 'blue': 128},
    }, {
      'name': 'oldlace',
      'code': '#FDF5E6',
      'rbg': {'red': 253, 'green': 245, 'blue': 230},
    }, {
      'name': 'olive',
      'code': '#808000',
      'rbg': {'red': 128, 'green': 128, 'blue': 0},
    }, {
      'name': 'olivedrab',
      'code': '#6B8E23',
      'rbg': {'red': 107, 'green': 142, 'blue': 35},
    }, {
      'name': 'orange',
      'code': '#FFA500',
      'rbg': {'red': 255, 'green': 165, 'blue': 0},
    }, {
      'name': 'orangered',
      'code': '#FF4500',
      'rbg': {'red': 255, 'green': 69, 'blue': 0},
    }, {
      'name': 'orchid',
      'code': '#DA70D6',
      'rbg': {'red': 218, 'green': 112, 'blue': 214},
    }, {
      'name': 'palegoldenrod',
      'code': '#EEE8AA',
      'rbg': {'red': 238, 'green': 232, 'blue': 170},
    }, {
      'name': 'palegreen',
      'code': '#98FB98',
      'rbg': {'red': 152, 'green': 251, 'blue': 152},
    }, {
      'name': 'paleturquoise',
      'code': '#AFEEEE',
      'rbg': {'red': 175, 'green': 238, 'blue': 238},
    }, {
      'name': 'palevioletred',
      'code': '#DB7093',
      'rbg': {'red': 219, 'green': 112, 'blue': 147},
    }, {
      'name': 'papayawhip',
      'code': '#FFEFD5',
      'rbg': {'red': 255, 'green': 239, 'blue': 213},
    }, {
      'name': 'peachpuff',
      'code': '#FFDAB9',
      'rbg': {'red': 255, 'green': 218, 'blue': 185},
    }, {
      'name': 'peru',
      'code': '#CD853F',
      'rbg': {'red': 205, 'green': 133, 'blue': 63},
    }, {
      'name': 'pink',
      'code': '#FFC0CB',
      'rbg': {'red': 255, 'green': 192, 'blue': 203},
    }, {
      'name': 'plum',
      'code': '#DDA0DD',
      'rbg': {'red': 221, 'green': 160, 'blue': 221},
    }, {
      'name': 'powderblue',
      'code': '#B0E0E6',
      'rbg': {'red': 176, 'green': 224, 'blue': 230},
    }, {
      'name': 'purple',
      'code': '#800080',
      'rbg': {'red': 128, 'green': 0, 'blue': 128},
    }, {
      'name': 'rebeccapurple',
      'code': '#663399',
      'rbg': {'red': 102, 'green': 51, 'blue': 153},
    }, {
      'name': 'red',
      'code': '#FF0000',
      'rbg': {'red': 255, 'green': 0, 'blue': 0},
    }, {
      'name': 'rosybrown',
      'code': '#BC8F8F',
      'rbg': {'red': 188, 'green': 143, 'blue': 143},
    }, {
      'name': 'royalblue',
      'code': '#4169E1',
      'rbg': {'red': 65, 'green': 105, 'blue': 225},
    }, {
      'name': 'saddlebrown',
      'code': '#8B4513',
      'rbg': {'red': 139, 'green': 69, 'blue': 19},
    }, {
      'name': 'salmon',
      'code': '#FA8072',
      'rbg': {'red': 250, 'green': 128, 'blue': 114},
    }, {
      'name': 'sandybrown',
      'code': '#F4A460',
      'rbg': {'red': 244, 'green': 164, 'blue': 96},
    }, {
      'name': 'seagreen',
      'code': '#2E8B57',
      'rbg': {'red': 46, 'green': 139, 'blue': 87},
    }, {
      'name': 'seashell',
      'code': '#FFF5EE',
      'rbg': {'red': 255, 'green': 245, 'blue': 238},
    }, {
      'name': 'sienna',
      'code': '#A0522D',
      'rbg': {'red': 160, 'green': 82, 'blue': 45},
    }, {
      'name': 'silver',
      'code': '#C0C0C0',
      'rbg': {'red': 192, 'green': 192, 'blue': 192},
    }, {
      'name': 'skyblue',
      'code': '#87CEEB',
      'rbg': {'red': 135, 'green': 206, 'blue': 235},
    }, {
      'name': 'slateblue',
      'code': '#6A5ACD',
      'rbg': {'red': 106, 'green': 90, 'blue': 205},
    }, {
      'name': 'slategray',
      'code': '#708090',
      'rbg': {'red': 112, 'green': 128, 'blue': 144},
    }, {
      'name': 'slategrey',
      'code': '#708090',
      'rbg': {'red': 112, 'green': 128, 'blue': 144},
    }, {
      'name': 'snow',
      'code': '#FFFAFA',
      'rbg': {'red': 255, 'green': 250, 'blue': 250},
    }, {
      'name': 'springgreen',
      'code': '#00FF7F',
      'rbg': {'red': 0, 'green': 255, 'blue': 127},
    }, {
      'name': 'steelblue',
      'code': '#4682B4',
      'rbg': {'red': 70, 'green': 130, 'blue': 180},
    }, {
      'name': 'tan',
      'code': '#D2B48C',
      'rbg': {'red': 210, 'green': 180, 'blue': 140},
    }, {
      'name': 'teal',
      'code': '#008080',
      'rbg': {'red': 0, 'green': 128, 'blue': 128},
    }, {
      'name': 'thistle',
      'code': '#D8BFD8',
      'rbg': {'red': 216, 'green': 191, 'blue': 216},
    }, {
      'name': 'tomato',
      'code': '#FF6347',
      'rbg': {'red': 255, 'green': 99, 'blue': 71},
    }, {
      'name': 'turquoise',
      'code': '#40E0D0',
      'rbg': {'red': 64, 'green': 224, 'blue': 208},
    }, {
      'name': 'violet',
      'code': '#EE82EE',
      'rbg': {'red': 238, 'green': 130, 'blue': 238},
    }, {
      'name': 'wheat',
      'code': '#F5DEB3',
      'rbg': {'red': 245, 'green': 222, 'blue': 179},
    }, {
      'name': 'white',
      'code': '#FFFFFF',
      'rbg': {'red': 255, 'green': 255, 'blue': 255},
    }, {
      'name': 'whitesmoke',
      'code': '#F5F5F5',
      'rbg': {'red': 245, 'green': 245, 'blue': 245},
    }, {
      'name': 'yellow',
      'code': '#FFFF00',
      'rbg': {'red': 255, 'green': 255, 'blue': 0},
    }, {
      'name': 'yellowgreen',
      'code': '#9ACD32',
      'rbg': {'red': 154, 'green': 205, 'blue': 50},
    }];

  /**
   * Construct a new color with `r=0 g=0 b=0`.
   *
   * Consider using the `makeHex`, `makeRGB` or `makeHSL` functions.
   *
   * @constructor
   * @instance
   * @memberof Color
   */

  constructor(name) {
    super();
    if (arguments.length === 0) {
      this.r = this.g = this.b = 0;
      this.h = this.s = this.l = 0;
      this.a = 1;
    } else {
      if (name instanceof String) {
        let spec = Color.spectrum.find((color) = String(color.name).toLowerCase() === String(name).toLowerCase());
        if (spec) {
          this.r = spec.rbg.red;
          this.g = spec.rbg.green;
          this.b = spec.rbg.blue;
        }
      } else {
        if (arguments.length > 0) {
          this.r = arguments[0];
        }
        if (arguments.length > 1) {
          this.g = arguments[1];
        }
        if (arguments.length > 2) {
          this.b = arguments[2];
        }
        if (arguments.length > 3) {
          this.a = arguments[3];
        }
      }
      let tmp = Color.makeRGB(this.r, this.g, this.b);
      [this.h, this.s, this.l] = [tmp.r, tmp.g, tmp.b];
    }

  }

  // --- RGB ----------------------------------
  /**
   * Get this color as a CSS `rgb` string.
   *
   * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   *
   * @method cssRGB
   * @instance
   * @memberof Color
   * @return {string} This color as a CSS rgb string.
   */
  cssRGB() {
    return 'rgb(' + Math.round(255 * this.r) + ',' + Math.round(255 * this.g) + ',' + Math.round(255 * this.b) + ')';
  }

  /**
   * Get this color as a CSS `rgba` string.
   *
   * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   *
   * @method cssRGBA
   * @instance
   * @memberof Color
   * @return {string} This color as a CSS rgba string.
   */
  cssRGBA() {
    return (
      'rgba(' + Math.round(255 * this.r) + ',' + Math.round(255 * this.g) + ',' + Math.round(255 * this.b) + ',' + this.a + ')'
    );
  }

  /**
   * Get the red component of this RGB(A)color. This method just returns the `r` color attribute.
   *
   * @method red
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  red() {
    return this.r;
  }

  /**
   * Get the green component of this RGB(A) color. This method just returns the `g` color attribute.
   *
   * @method green
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  green() {
    return this.g;
  }

  /**
   * Get the blue component of this RGB(A) color. This method just returns the `b` color attribute.
   *
   * @method blue
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  blue() {
    return this.b;
  }

  // --- HSL ----------------------------------
  /**
   * Get this color as a CSS `hsl` string.
   *
   * @method cssHSL
   * @instance
   * @memberof Color
   * @return {string} This color as a CSS hsl string.
   */
  cssHSL() {
    return 'hsl(' + Math.round(360 * this.h) + ',' + Math.round(100 * this.s) + '%,' + Math.round(100 * this.l) + '%)';
  }

  /**
   * Get this color as a CSS `hsla` string.
   *
   * @method cssHSLA
   * @instance
   * @memberof Color
   * @return {string} This color as a CSS hsla string.
   */
  cssHSLA() {
    return (
      'hsla(' +
      Math.round(360 * this.h) +
      ',' +
      Math.round(100 * this.s) +
      '%,' +
      Math.round(100 * this.l) +
      '%,' +
      Math.round(this.a) +
      ')'
    );
  }

  /**
   * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
   *
   * @method hue
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  hue() {
    return this.h;
  }

  /**
   * Get the saturation component of this HSL(A) color. This method just returns the `s` color attribute.
   *
   * @method saturation
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  saturation() {
    return this.s;
  }

  /**
   * Get the lightness component of this HSL(A) color. This method just returns the `l` color attribute.
   *
   * @method lightness
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  lightness() {
    return this.l;
  }

  // --- HEX ----------------------------------
  /**
   * Get this color as a CSS-HEX string (non-alpha): #rrggbb
   *
   * @method cssHEX
   * @instance
   * @memberof Color
   * @return {string} This color as a CSS-HEX string.
   */
  cssHEX() {
    return (
      '#' +
      (255 * this.r < 16 ? '0' : '') +
      Math.round(255 * this.r).toString(16) +
      (255 * this.g < 16 ? '0' : '') +
      Math.round(255 * this.g).toString(16) +
      (255 * this.b < 16 ? '0' : '') +
      Math.round(255 * this.b).toString(16)
    );
  }

  // --- Transparency ----------------------------------

  /**
   * Get the alpha channel (transparency) of this color.
   *
   * @method alpha
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  alpha() {
    return this.a;
  }

  // --- Modifiers ----------------------------------

  saturate(v) {
    if ('string' == typeof v && v.indexOf('%') > -1 && !isNaN((v = parseInt(v)))) {
      this.s += v / 100;
    } else if ('number' == typeof v)
      // range 255
    {
      this.s += v / 255;
    } else {
      throw new Error('error: bad modifier format (percent or number)');
    }
    if (this.s > 1) {
      this.s = 1;
    } else if (this.s < 0) this.s = 0;
    Color.#Converter.HSLToRGB(this);
  }

  desaturate(v) {
    this.saturate('-' + v);
  }

  lighten(v) {
    if ('string' == typeof v && v.indexOf('%') > -1 && !isNaN((v = parseInt(v)))) {
      this.l += v / 100;
    } else if ('number' == typeof v)
      // range 255
    {
      this.l += v / 255;
    } else {
      throw new Error('error: bad modifier format (percent or number)');
    }
    if (this.l > 1) {
      this.l = 1;
    } else if (this.l < 0) this.l = 0;
    Color.#Converter.HSLToRGB(this);
  }

  darken(v) {
    this.lighten('-' + v);
  }

  fadein(v) {
    if ('string' == typeof v && v.indexOf('%') > -1 && !isNaN((v = parseInt(v)))) {
      this.a += v / 100;
    } else if ('number' == typeof v)
      // range 255
    {
      this.a += v / 255;
    } else {
      throw new Error('error: bad modifier format (percent or number)');
    }
    if (this.a > 1) {
      this.a = 1;
    } else if (this.a < 0) this.a = 0;
    Color.#Converter.HSLToRGB(this);
  }

  fadeout(v) {
    this.fadein('-' + v);
  }

  spin(v) {
    if ('string' == typeof v && v.indexOf('%') > -1 && !isNaN((v = parseInt(v)))) {
      this.h += v / 100;
    } else if ('number' == typeof v)
      // range 360
    {
      this.h += v / 360;
    } else {
      throw new Error('error: bad modifier format (percent or number)');
    }
    if (this.h > 1) {
      this.h = 1;
    } else if (this.h < 0) this.h = 0;
    Color.#Converter.HSLToRGB(this);
  }

  static makeRGB(...args) {
    const c = new Color();
    let sanitized = [];
    if (arguments.length < 3 || arguments.length > 4) throw new Error('error: 3 or 4 arguments');
    sanitized = Color.#Sanitizer.RGB(arguments[0], arguments[1], arguments[2]);
    c.r = sanitized[0];
    c.g = sanitized[1];
    c.b = sanitized[2];
    if (arguments.length === 4) c.a = arguments[3];
    Color.#Converter.RGBToHSL(c);
    return c;
  }

  static makeHSL(...args) {
    const c = new Color();
    let sanitized = [];
    if (arguments.length < 3 || arguments.length > 4) throw new Error('error: 3 or 4 arguments');
    sanitized = Color.#Sanitizer.HSL(arguments[0], arguments[1], arguments[2]);
    c.h = sanitized[0];
    c.s = sanitized[1];
    c.l = sanitized[2];
    if (arguments.length === 4) c.a = arguments[3];
    Color.#Converter.HSLToRGB(c);
    return c;
  }

  static makeHEX(value) {
    let c = new Color(),
      sanitized;
    // Edit Ika 2018-0308
    // Allow leading '#'
    if (value && value.startsWith('#')) value = value.substr(1);
    Color.#Validator.checkHEX(value);
    if (value.length === 3) {
      sanitized = Color.#Sanitizer.RGB(
        parseInt(value.substr(0, 1) + value.substr(0, 1), 16),
        parseInt(value.substr(1, 1) + value.substr(1, 1), 16),
        parseInt(value.substr(2, 1) + value.substr(2, 1), 16),
      );
    } else if (value.length === 6) {
      sanitized = Color.#Sanitizer.RGB(
        parseInt(value.substr(0, 2), 16),
        parseInt(value.substr(2, 2), 16),
        parseInt(value.substr(4, 2), 16),
      );
    } else {
      throw new Error('error: 3 or 6 arguments');
    }
    c.r = sanitized[0];
    c.g = sanitized[1];
    c.b = sanitized[2];
    Color.#Converter.RGBToHSL(c);
    return c;
  }

  /**
   * Parse the given color string. Currently only these formate are recognized: hex, rgb, rgba.
   *
   * @method parse
   * @static
   * @memberof Color
   * @param {string} str - The string representation to parse.
   * @return {Color} The color instance that's represented by the given string.
   */
  static parse(str) {
    if (typeof str == 'undefined') return null;
    if ((str = str.trim().toLowerCase()).length === 0) return null;
    if (str.startsWith('#')) return Color.makeHEX(str.substring(1, str.length));
    if (str.startsWith('rgb')) {
      var parts = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d*(?:\.\d+\s*)?)\)$/);
      if (!parts) {
        throw 'Unrecognized color format (2): ' + str;
      }
      // [ str, r, g, b, a|undefined ]
      if (typeof parts[4] == 'undefined') {
        return Color.makeRGB(parts[1], parts[2], parts[3]);
      } else {
        return Color.makeRGB(parts[1], parts[2], parts[3], parts[4]);
      }
    } else {
      throw 'Unrecognized color format (1): ' + str;
    }
  }

  static #Sanitizer = {
    RGB: function(...args) {
      var o = [];
      if (arguments.length === 0) {
        return [];
      }
      // const allAreFrac = Color.testFrac( arguments );
      for (var i = 0; i < arguments.length; i++) {
        var c = arguments[i];
        if ('string' == typeof c && c.indexOf('%') > -1) {
          if (isNaN((c = parseInt(c)))) throw new Error('Bad format');
          if (c < 0 || c > 100) throw new Error('Bad format');
          o[i] = c / 100;
        } else {
          // console.log( 'allAreFrac', allAreFrac, arguments );
          if ('string' == typeof c && isNaN((c = parseInt(c)))) throw new Error('Bad format');
          if (c < 0) {
            throw new Error('Bad format');
          }//else if( allAreFrac ) o[i] = c; // c >= 0 && c <= 1 (all)
          else if (c >= 0 && c < 1) {
            o[i] = c;
          }// else if(c >= 0.0 && c <= 1.0) o[i] = c;
          else if (c >= 1 && c < 256) {
            o[i] = c / 255;
          }// ???
          // else if(c >= 0 && c < 256) o[i] = c/255;
          else {
            throw new Error('Bad format (' + c + ')');
          }
        }
      }
      return o;
    },

    HSL: function(args) {
      if (arguments.length < 3 || arguments.length > 4) throw new Error('3 or 4 arguments required');
      var h = arguments[0],
        s = arguments[1],
        l = arguments[2];
      if ('string' == typeof h && isNaN((h = parseFloat(h)))) throw new Error('Bad format for hue');
      if (h < 0 || h > 360) {
        throw new Error('Hue out of range (0..360)');
      } else if ((('' + h).indexOf('.') > -1 && h > 1) || ('' + h).indexOf('.') === -1) h /= 360;
      if ('string' == typeof s && s.indexOf('%') > -1) {
        if (isNaN((s = parseInt(s)))) throw new Error('Bad format for saturation');
        if (s < 0 || s > 100) throw new Error('Bad format for saturation');
        s /= 100;
      } else if (s < 0 || s > 1) throw new Error('Bad format for saturation');
      if ('string' == typeof l && l.indexOf('%') > -1) {
        if (isNaN((l = parseInt(l)))) throw new Error('Bad format for lightness');
        if (l < 0 || l > 100) throw new Error('Bad format for lightness');
        l /= 100;
      } else if (l < 0 || l > 1) throw new Error('Bad format for lightness');
      return [h, s, l];
    },
  }; // ENd sanitizer

  static #Validator = {
    /**
     * Check a hexa color (without #)
     */
    checkHEX: (value) => {
      if (value.length !== 6 && value.length !== 3) throw new Error('Hexa color: bad length (' + value.length + '),' + value);
      value = value.toLowerCase();
      //for( var i in value ) {
      for (var i = 0; i < value.length; i++) {
        var c = value.charCodeAt(i);
        if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102))) {
          throw new Error(`Hexa color: out of range for "${value}" at position ${i}.`);
        }
      }
    },
  };

  static #Converter = {
    /**
     * Calculates HSL Color.
     * RGB must be normalized.
     * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     */
    RGBToHSL: (color) => {
      var r = color.r;
      var g = color.g;
      var b = color.b;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      color.l = (max + min) / 2;
      if (max === min) {
        color.h = color.s = 0; // achromatic
      } else {
        var d = max - min;
        color.s = color.l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            color.h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            color.h = (b - r) / d + 2;
            break;
          case b:
            color.h = (r - g) / d + 4;
            break;
        }
        color.h /= 6;
      }
    },

    /**
     * Calculates RGB color (nomalized).
     * HSL must be normalized.
     *
     * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     */
    HSLToRGB: (color) => {
      var h = color.h;
      var s = color.s;
      var l = color.l;
      if (s === 0) {
        color.r = color.g = color.b = l; // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        color.r = Color.#Converter.hue2rgb(p, q, h + 1 / 3);
        color.g = Color.#Converter.hue2rgb(p, q, h);
        color.b = Color.#Converter.hue2rgb(p, q, h - 1 / 3);
      }
    },

    hue2rgb: (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    },
  };

  /**
   * Create a clone of this color (RGB).
   *
   * @method clone
   * @instance
   * @memberof Color
   * @return {Color} A clone of this color (in RGB mode).
   */
  clone() {
    return Color.makeRGB(this.r, this.g, this.b, this.a);
  }

  /**
   * Interpolate this color on the RGB scale.
   *
   * @method interpolate
   * @instance
   * @memberof Color
   * @param {Color} c - The color to interpolate to.
   * @param {number} t - An interpolation value between 0.0 and 1.0.
   * @return {Color} A clone of this color (in RGB mode).
   */
  interpolate(c, t) {
    this.r += (c.r - c.r) * t;
    this.g += (c.g - c.g) * t;
    this.b += (c.b - c.b) * t;
    this.a += (c.a - c.a) * t;
    return this;
  }
} // END class
