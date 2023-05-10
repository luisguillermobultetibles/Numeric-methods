// var monedas = new Array(); // registro, debes llevar al estilo DB + o - como los de conceptos...
import {WebSystemObject} from './WebSystemObject.js';

// Es solamente un prototipo, distrútalo.

class Money extends WebSystemObject {
  // Monedas, con sus respectivas tasas de cambio provisionales por 1 CUC...
  static Afgani = new Money(Afganistan, "Afgani", 68.48);
  static Baht = new Money(Tailandia, "Baht", 32.8981);
  static Birr_etiope = new Money(Etiopia, "Birr etiope", 27.56);
  static Bolivar = new Money(Venezuela, "Bolívar", 1.0);
  static Cedi = new Money(Ghana, "Cedi", 3.13);
  static Chelin_de_Uganda = new Money(Uganda, "Chelín de Uganda", 3400.0);
  static Chelin_keniata = new Money(Kenia, "Chelín keniata", 102.19);
  static Chelin_Somali = new Money(Somalia, "Chelín Somali", 613.95);
  static Chelin_Tanzano = new Money(Tanzania, "Chelín Tanzano", 2237.51);
  static Colon_de_Costa_Rica = new Money(Costa_Rica, "Colon de Costa Rica", 585);
  static Colon_del_Salvador = new Money(El_Salvador, "Colón del Salvador", 8.48);
  static Cordoba = new Money(Nicaragua, "Córdoba", 30.33);
  static Corona_Checa = new Money(Republica_Checa, "Corona checa", 21.16);
  static Corona_danesa = new Money(Dinamarca, "Corona danesa", 6.8445);
  static Corona_de_Estonia = new Money(Estonia, "Corona de Estonia", 12.6878);
  static Corona_Eslovaca = new Money(Eslovaquia, "Corona Eslovaca", 24.4291);
  static Corona_islandesa = new Money(Islandia, "Corona islandesa", 94.8767);
  static Corona_noruega = new Money(Noruega, "Corona noruega", 8.134);
  static Corona_sueca = new Money(Suecia, "Corona sueca", 8.836);
  static Dalasi = new Money(Gambia, "Dalasi", 43.11);
  static Dinar_argelino = new Money(Argelia, "Dinar argelino", 72.38);
  static Dinar_Bahraini = new Money(Bahrein, "Dinar Bahraini", 2.6518);
  static Dinar_Iraqui = new Money(Irak, "Dinar Iraquí", 1119.4);
  static Dinar_jordano = new Money(Jordania, "Dinar jordano", 0.71);
  static Dinar_Kuwaiti = new Money(Kuwait, "Dinar Kuwaití", 3.33);
  static Dinar_Libio_Jamahiriya_Arabe = new Money(Libia, "Dinar Libio (Jamahiriya_Arabe)", 1.335);
  static Dinar_tunecino = new Money(Tunez, "Dinar tunecino", 1.5655);
  static Dirham_marroqui = new Money(Marruecos, "Dirham marroquí", 9.86);
  static Dirham_UAE = new Money(Emiratos_Arabes_Unidos, "Dirham de los Emiratos Árabes Unidos", 3.672);
  static Dolar_Australiano = new Money(Tuvalu, "Dólar Australiano", 0.7758);
  static Dolar_de_Barbados = new Money(Barbados, "Dólar de Barbados", 2.005);
  static Dolar_de_Belice = new Money(Belice, "Dólar de Belice", 1.99);
  static Dolar_de_Brunei = new Money(Brunei, "Dólar de Brunei", 1.3181);
  static Dolar_de_Canada = new Money(Canada, "Dólar de Canadá", 1.3046);
  static Dolar_de_Fitji = new Money(Fitji, "Dólar fiyiano", 1.88);
  static Dolar_de_Guyana = new Money(Guyana, "Dólar de Guyana", 207.21);
  static Dolar_de_Jamaica = new Money(Jamaica, "Dólar jamaicano", 120.14);
  static Dolar_de_las_Bahamas = new Money(Bahamas, "Dólar de las Bahamas", 1.0);
  static Dolar_de_las_Islas_Caiman = new Money(Islas_Caiman, "Dólar de las Islas Caimán", 1.227);
  static Dolar_de_las_Islas_Salomon = new Money(Islas_Salomon, "Dólar de las Islas Salomón", 7.27);
  static Dolar_de_Liberia = new Money(Liberia, "Dólar liberiano", 125.91);
  static Dolar_de_Nueva_Zelanda = new Money(Nueva_Zelanda, "Dólar neozelandés", 0.7006);
  static Dolar_de_Singapur = new Money(Singapur, "Dólar de Singapur", 0.75756);
  static Dolar_de_Taiwan_Nuevo = new Money(Taiwan, "Dólar nuevo de Taiwán", 33.46);
  static Dolar_de_Trinidad_y_Tobago = new Money(Trinidad_y_Tobago, "Dólar trinitense", 6.73);
  static Dolar_de_Zimbabwe = new Money(Zimbabwe, "Dólar de Zimbabwe", 373.0);
  static Dolar_del_Caribe_Oriental = new Money(Granada, "Dólar del Caribe Oriental", 2.7);
  static Dolar_estadounidense = new Money(Estados_Unidos, "Dólar estadounidense", 1.0);
  static Dolar_estadounidense_Balboa = new Money(Panama, "Dólar estadounidense/Balboa", 1.0);
  static Dong = new Money(Vietnam, "Dong", 22.648);
  static Dram_armenio = new Money(Armenia, "Dram armenio", 488.3);
  static Ekwele = new Money(Guinea_Ecuatorial, "Ekwele", 1.0);
  static Escudo_de_Cabo_Verde = new Money(Cabo_Verde, "Escudo de Cabo Verde", 89.41372);
  // Oficialmente
  // 1.0000	euro	equivale a 1.0000 dólares
  // 1.2332	dolares	equivale a 0.8109 euros
  static Euro = new Money(Grecia, "Euro", 0.8109);
  static Florin_de_las_Antillas = new Money(Antillas_Holandesas, "Florín antillano (neerlandés)", 1.79);
  static Florin_de_Surinam = new Money(Surinam, "Florín surinamés", 1.0);
  static Forintio = new Money(Hungria, "Florinto húngaro", 258.02);
  static Franco_CFA = new Money(Togo, "Franco CFA", 1.0);
  static Franco_de_Burundi = new Money(Burundi, "Franco burundés", 1.57);
  static Franco_de_Djibouti = new Money(Djibouti, "Franco yibutiano", 179.498);
  static Franco_guineano = new Money(Guinea, "Franco guineano", 7433.0);
  static Franco_de_las_Comores = new Money(Comores, "Franco comorense", 399.0909);
  static Franco_de_Mali = new Money(Mali, "Franco maliense", 1.0);
  static Franco_de_Ruanda = new Money(Ruanda, "Franco ruandés", 584.06);
  static Franco_frances = new Money(Martinica, "Franco francés", 5.31915);
  static Franco_malgache = new Money(Madagascar, "Franco malgache", 456.43367);
  static Franco_Suizo = new Money(Liechtenstein, "Franco Suizo", 1.0393);
  static Gourde_dolar_estadounidense = new Money(Haiti, "Gourde haitiano", 57.53);
  static Grivna = new Money(Ucrania, "Grivna", 24.87);
  static Guarani = new Money(Paraguay, "Guaraní", 5670);
  static Kina = new Money(Papua, "Kina", 260.17);
  static Kip = new Money(Laos, "Kip laosiano", 8.796);
  static Kuna = new Money(Croacia, "Kuna croata", 7.07);
  static Kwacha_Zambiana = new Money(Zambia, "Kwacha", 11.08);
  static Kwacha_Malawi = new Money(Malawi, "Kwacha", 734.83);
  static Kwanza = new Money(Angola, "Kwanza angolana", 102.33);
  static Kyat_de_Myanmar = new Money(Myanmar, "Kyat de Myanmar (birmano)", 1329);
  static Lari = new Money(Georgia, "Lari georgiano", 2.48);
  static Lat = new Money(Letonia, "Lat letón", 0.5699);
  static Lempira = new Money(Honduras, "Lempira", 23.5936);
  static Leone = new Money(Sierra_Leona, "Leone", 4338);
  static Leu = new Money(Rumania, "Leu de Rumanía", 3.71943);
  static Leu_de_Moldova = new Money(Moldova, "Leu de Moldova", 14.87188);
  static Lev = new Money(Bulgaria, "Lev", 1.73);
  static Libra_egipcia = new Money(Egipto, "Libra egipcia", 17.68);
  static Libra_esterlina = new Money(Reino_Unido, "Libra esterlina", 0.70235);
  static Libra_libanesa = new Money(Libano, "Libra libanesa", 1780.98443);
  static Libra_Siria = new Money(Siria, "Libra siria", 214.29);
  static Libra_Sudanesa = new Money(Sudan, "Libra sudanesa", 6.16);
  static Lilangeni = new Money(Suazilandia, "Lilangeni", 7.91);
  // var Lit = new TMoneda(Lituania, 'Lit', 1.00); // Euro
  static Maloti_Rand = new Money(Lesotho, "Maloti-Rand", 7.91);
  static Manat = new Money(Turkmenistan, "Manat turcomano", 3.4);
  static Manat_azeri = new Money(Azerbaiyan, "Manat azerí", 1.05);
  static Marco_convertible = new Money(Bosnia_y_Herzegovina, "Marco convertible", 1.8);
  static Metical = new Money(Mozambique, "Metical", 29.61);
  static Naira = new Money(Nigeria, "Naira", 183.5);
  static Nuevo_dinar = new Money(Yugoslavia, "Nuevo dinar", 0.001); //  El Dinar yugoslavo de 1992 equivalía a 0.001
  static Ouguiya = new Money(Mauritania, "Ouguiya", 35.41);
  static Peso_Argentino = new Money(Argentina, "Peso argentino", 20.4);
  static Peso_Boliviano = new Money(Bolivia, "Peso boliviano", 6.96);
  static Peso_Chileno = new Money(Chile, "Peso chileno", 881, new Date(2022, 6, 21)); // 881 al cierre de 21/06/2022,  valor de referencia anterior: 602.
  static Peso_Colombiano = new Money(Colombia, "Peso colombiano", 2830.89);
  static Peso_cubano_cuc = new Money(Cuba, "Peso cubano cuc", 1.0);
  static Peso_cubano_cup = new Money(Cuba, "Peso cubano cup", 25.0);
  static Peso_de_Guinea_Bissau = new Money(Guinea_Bissau, "Peso de Guinea Bissau", 0.00002850375);
  static Peso_Dominicano = new Money(Republica_Dominicana, "Peso dominicano", 47.65);
  static Peso_filipino = new Money(Filipinas, "Peso filipino", 50.05);
  static Peso_mexicano = new Money(Mexico, "Peso mexicano", 18.01802);
  static Peso_Uruguayo = new Money(Uruguay, "Peso uruguayo", 28.25);
  static Pula = new Money(Botswana, "Pula", 10.74);
  static Quetzal = new Money(Guatemala, "Quetzal", 7.3395);
  static Rand = new Money(Sudafrica, "Rand sudáfricano", 13.265);
  static Real = new Money(Brasil, "Real", 18);
  static Rial_de_Yemen = new Money(Yemen, "Rial yemení", 215);
  static Rial_Irani = new Money(Iran, "Rial iraní", 29.8);
  static Rial_Omani = new Money(Oman, "Rial omani", 2.5974);
  static Rial_Qatari = new Money(Qatar, "Rial catari", 3.64);
  static Rial_Saudita = new Money(Arabia_Saudita, "Rial saudí", 3.76);
  static Riel = new Money(Camboya, "Riel camboyano", 4.058);
  static Ringgit_Malaysio = new Money(Malasia, "Ringgit malasio", 4.14);
  static Rublo_ruso = new Money(Rusia, "Rublo", 57.92);
  static Rublo = new Money(Tayikistan, "Rublo", 7.8769);
  static Rublo_bielorruso = new Money(Bielorrusia, "Rublo bielorruso", 1.93);
  static Rupia = new Money(Indonesia, "Rupiah", 13529.75);
  static Rupia_de_las_Maldivas = new Money(Maldivas, "Rupia maldivas", 1.0);
  static Rupia_de_las_Mauricio = new Money(Mauricio, "Rupia de Mauricio", 33.25);
  static Rupia_de_las_Seychelles = new Money(Seychelles, "Rupia seychellense", 7.99);
  static Rupia_de_Sri_Lanka = new Money(Sri_Lanka, "Rupia de Sri Lanka", 143.99);
  static Rupia_hindu = new Money(India, "Rupia india", 67.74);
  static Rupia_nepali = new Money(Nepal, "Rupia nepalí", 108.9);
  static Rupia_Paquistani = new Money(Pakistan, "Rupia Paquistaní", 104.91);
  static Shekel = new Money(Israel, "Nuevo séquel", 1.0);
  static Sol_peruano = new Money(Peru, "Sol peruano", 3.2176);
  static Som = new Money(Kirguizistan, "Som", 62.44);
  static Som_kupon = new Money(Uzbekistan, "Som kupon", 2816.47);
  static Taka = new Money(Bangla_Desh, "Taka", 78, 42);
  static Tengue = new Money(Kazajstan, "Tengue", 379.48);
  static Tugrik = new Money(Mongolia, "Tugrik", 2005.1);
  static Vatu = new Money(Vanuatu, "Vatu", 110.25);
  static Won_surcoreano = new Money(Corea_del_Sur, "Won (surcoreano)", 142.8571429);
  static Won_norcoreano = new Money(Corea_del_Norte, "Won norcoreano", 125);
  static Yen = new Money(Japon, "Yen", 107.5268817);
  static Yuan_Renminbi = new Money(China, "Yuan Renminbi", 6.327);
  static Zloty = new Money(Polonia, "Esloti", 3.4494);

  constructor(pais, nombre, tasa, cierre = Date()) {
    super(nombre);
    this.pais = pais;
    this.nombre = nombre;
    this.tasa = tasa; // Un dólar equivale a... pudes usar la función usdChanges.
    this.cierre = cierre; // Fecha del cierre...
    // monedas.push(this);
    this.loadExchangeRates();
  }

  // Función para obtener los datos del archivo JSON y almacenarlos en sessionStorage
  async loadExchangeRates() {
    const cacheKey = 'exchangeRates';
    const cacheTimeout = 10 * 1000; // 10 segundos en milisegundos
    let data;

    // Verificar si los datos de intercambio de divisas ya están en caché
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}_timestamp`);
    if (cachedData && cacheTime && (Date.now() - cacheTime) < cacheTimeout) {
      data = JSON.parse(cachedData);
    } else {
      try {
        const response = await fetch('http://www.floatrates.com/daily/usd.json', {timeout: 10000});
        data = await response.json();

        // Almacenar los datos de intercambio de divisas en caché
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
      } catch (error) {
        console.error('No se pudo obtener los datos del archivo JSON:', error.message);
      }
    }

    return data;
  }

  // Función para obtener la tasa de cambio de una moneda a otra
  async  getExchangeRate(fromCurrency, toCurrency) {
    let exchangeRates = JSON.parse(localStorage.getItem('exchangeRates'));
    let rate;

    if (!exchangeRates) {
      exchangeRates = await loadExchangeRates();
    }

    if (exchangeRates && exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      rate = exchangeRates[fromCurrency][toCurrency].rate;
    } else {
      console.error(`No se pudo obtener la tasa de cambio de ${fromCurrency} a ${toCurrency}`);
    }

    return rate;
  }

  // Función para convertir una suma de una moneda a otra
  convertCurrency(amount, fromCurrency, toCurrency) {
    const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * exchangeRate;
    return convertedAmount;
  }

  // Función para formatear una cantidad de dinero en una moneda determinada
  formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat(navigator.language, {style: 'currency', currency});
    const formattedAmount = formatter.format(amount);
    return formattedAmount;
  }


  async usdChanges() {
    /*
         To access one of our free online JSON data feed with latest foreign exchange rates which updates daily (once in 12 hours at 12 AM/PM) use any URL
        from the list below. Please note, you can use any currency code available on our site to get appropriate JSON currency rate feed.
         El cambio con respecto al dólar se obtiene en http://www.floatrates.com/daily/usd.json
         Para el caso cualquier moneda sirve por devaluada que esté, se toma como referencia el dólar norteaméricano, por motivos históricos y de simplificación de operaciones.
         Si está en linea se tratará de bajar automáticamente, sino utiliza este viejo... puedes actualizarlo de vez en cuando o gusrdarlos.
    */
    if (this.online) {
      let response = await fetch('http://www.floatrates.com/daily/usd.json');
      return await response.json();
    } else {
      // Cierre 13 enero de 2023
      return {
        "eur": {
          "code": "EUR",
          "alphaCode": "EUR",
          "numericCode": "978",
          "name": "Euro",
          "rate": 0.92762674664343,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.0780198001173
        }, "gbp": {
          "code": "GBP",
          "alphaCode": "GBP",
          "numericCode": "826",
          "name": "U.K. Pound Sterling",
          "rate": 0.82095234488431,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.2180975013122
        }, "aud": {
          "code": "AUD",
          "alphaCode": "AUD",
          "numericCode": "036",
          "name": "Australian Dollar",
          "rate": 1.4383235673187,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.69525385158236
        }, "chf": {
          "code": "CHF",
          "alphaCode": "CHF",
          "numericCode": "756",
          "name": "Swiss Franc",
          "rate": 0.93075876240834,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.0743922489781
        }, "cad": {
          "code": "CAD",
          "alphaCode": "CAD",
          "numericCode": "124",
          "name": "Canadian Dollar",
          "rate": 1.337412214933,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.74771262654431
        }, "jpy": {
          "code": "JPY",
          "alphaCode": "JPY",
          "numericCode": "392",
          "name": "Japanese Yen",
          "rate": 130.60434260487,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00765671324594
        }, "hnl": {
          "code": "HNL",
          "alphaCode": "HNL",
          "numericCode": "340",
          "name": "Honduran Lempira",
          "rate": 24.447457627119,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.040904048807542
        }, "kes": {
          "code": "KES",
          "alphaCode": "KES",
          "numericCode": "404",
          "name": "Kenyan shilling",
          "rate": 122.63915655822,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0081540025882784
        }, "bhd": {
          "code": "BHD",
          "alphaCode": "BHD",
          "numericCode": "048",
          "name": "Bahrain Dinar",
          "rate": 0.37547477254523,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 2.6632947753621
        }, "egp": {
          "code": "EGP",
          "alphaCode": "EGP",
          "numericCode": "818",
          "name": "Egyptian Pound",
          "rate": 29.531073363055,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.033862636406947
        }, "krw": {
          "code": "KRW",
          "alphaCode": "KRW",
          "numericCode": "410",
          "name": "South Korean Won",
          "rate": 1242.0649143635,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00080511089914528
        }, "mro": {
          "code": "MRO",
          "alphaCode": "MRO",
          "numericCode": "478",
          "name": "Mauritanian Ouguiya",
          "rate": 36.179726815241,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.027639788578468
        }, "cop": {
          "code": "COP",
          "alphaCode": "COP",
          "numericCode": "170",
          "name": "Colombian Peso",
          "rate": 4719.0850575403,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00021190548333139
        }, "bbd": {
          "code": "BBD",
          "alphaCode": "BBD",
          "numericCode": "052",
          "name": "Barbadian Dollar",
          "rate": 2.0001848941481,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.49995378073581
        }, "djf": {
          "code": "DJF",
          "alphaCode": "DJF",
          "numericCode": "262",
          "name": "Djiboutian franc",
          "rate": 176.35407751559,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.005670410427066
        }, "mzn": {
          "code": "MZN",
          "alphaCode": "MZN",
          "numericCode": "943",
          "name": "Mozambican metical",
          "rate": 63.541850220264,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.015737659456462
        }, "ugx": {
          "code": "UGX",
          "alphaCode": "UGX",
          "numericCode": "800",
          "name": "Ugandan shilling",
          "rate": 3654.7297297297,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00027361804400074
        }, "hkd": {
          "code": "HKD",
          "alphaCode": "HKD",
          "numericCode": "344",
          "name": "Hong Kong Dollar",
          "rate": 7.8099268668564,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.12804217210327
        }, "mad": {
          "code": "MAD",
          "alphaCode": "MAD",
          "numericCode": "504",
          "name": "Moroccan Dirham",
          "rate": 10.211453804851,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.097929248774053
        }, "zar": {
          "code": "ZAR",
          "alphaCode": "ZAR",
          "numericCode": "710",
          "name": "South African Rand",
          "rate": 16.816489993059,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.05946544138597
        }, "mdl": {
          "code": "MDL",
          "alphaCode": "MDL",
          "numericCode": "498",
          "name": "Moldova Lei",
          "rate": 19.040199944504,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.052520456870972
        }, "pab": {
          "code": "PAB",
          "alphaCode": "PAB",
          "numericCode": "590",
          "name": "Panamanian Balboa",
          "rate": 0.99579504571598,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.004222710589
        }, "fjd": {
          "code": "FJD",
          "alphaCode": "FJD",
          "numericCode": "242",
          "name": "Fiji Dollar",
          "rate": 2.1642492747824,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.46205398410058
        }, "cdf": {
          "code": "CDF",
          "alphaCode": "CDF",
          "numericCode": "976",
          "name": "Congolese franc",
          "rate": 2039.2082940622,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00049038639304862
        }, "sdg": {
          "code": "SDG",
          "alphaCode": "SDG",
          "numericCode": "938",
          "name": "Sudanese pound",
          "rate": 561.97402597403,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0017794416712886
        }, "top": {
          "code": "TOP",
          "alphaCode": "TOP",
          "numericCode": "776",
          "name": "Tongan pa\u02bbanga",
          "rate": 2.3634278223825,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.42311425402106
        }, "vuv": {
          "code": "VUV",
          "alphaCode": "VUV",
          "numericCode": "548",
          "name": "Vanuatu vatu",
          "rate": 120.31028442739,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0083118413754854
        }, "kwd": {
          "code": "KWD",
          "alphaCode": "KWD",
          "numericCode": "414",
          "name": "Kuwaiti Dinar",
          "rate": 0.30470001544392,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 3.2819164729713
        }, "thb": {
          "code": "THB",
          "alphaCode": "THB",
          "numericCode": "764",
          "name": "Thai Baht",
          "rate": 33.193362376935,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.030126505071835
        }, "twd": {
          "code": "TWD",
          "alphaCode": "TWD",
          "numericCode": "901",
          "name": "New Taiwan Dollar ",
          "rate": 30.392006785242,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.032903388284501
        }, "irr": {
          "code": "IRR",
          "alphaCode": "IRR",
          "numericCode": "364",
          "name": "Iranian rial",
          "rate": 41803.869124398,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 2.3921230760345e-5
        }, "bob": {
          "code": "BOB",
          "alphaCode": "BOB",
          "numericCode": "068",
          "name": "Bolivian Boliviano",
          "rate": 6.8599302473049,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.14577407698757
        }, "lrd": {
          "code": "LRD",
          "alphaCode": "LRD",
          "numericCode": "430",
          "name": "Liberian dollar",
          "rate": 152.90459363957,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0065400258827882
        }, "pgk": {
          "code": "PGK",
          "alphaCode": "PGK",
          "numericCode": "598",
          "name": "Papua New Guinean kina",
          "rate": 3.4905219004598,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.28649010907746
        }, "bwp": {
          "code": "BWP",
          "alphaCode": "BWP",
          "numericCode": "072",
          "name": "Botswana Pula",
          "rate": 12.652631578947,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.079034941763729
        }, "omr": {
          "code": "OMR",
          "alphaCode": "OMR",
          "numericCode": "512",
          "name": "Omani Rial",
          "rate": 0.3835430190011,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 2.6072694599015
        }, "ils": {
          "code": "ILS",
          "alphaCode": "ILS",
          "numericCode": "376",
          "name": "Israeli New Sheqel",
          "rate": 3.419777204823,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.29241671024348
        }, "pen": {
          "code": "PEN",
          "alphaCode": "PEN",
          "numericCode": "604",
          "name": "Peruvian Nuevo Sol",
          "rate": 3.783576689435,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.26430017998375
        }, "uzs": {
          "code": "UZS",
          "alphaCode": "UZS",
          "numericCode": "860",
          "name": "Uzbekistan Sum",
          "rate": 11217.994461099,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 8.9142493648729e-5
        }, "etb": {
          "code": "ETB",
          "alphaCode": "ETB",
          "numericCode": "230",
          "name": "Ethiopian birr",
          "rate": 53.094478527609,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.018834350157145
        }, "ttd": {
          "code": "TTD",
          "alphaCode": "TTD",
          "numericCode": "780",
          "name": "Trinidad Tobago Dollar",
          "rate": 6.7297045101089,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.14859493436864
        }, "zmw": {
          "code": "ZMW",
          "alphaCode": "ZMW",
          "numericCode": "967",
          "name": "Zambian kwacha",
          "rate": 18.151006711409,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.055093362913664
        }, "khr": {
          "code": "KHR",
          "alphaCode": "KHR",
          "numericCode": "116",
          "name": "Cambodian riel",
          "rate": 4078.4165881244,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00024519319652431
        }, "sek": {
          "code": "SEK",
          "alphaCode": "SEK",
          "numericCode": "752",
          "name": "Swedish Krona",
          "rate": 10.423303186985,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.095938876770719
        }, "sgd": {
          "code": "SGD",
          "alphaCode": "SGD",
          "numericCode": "702",
          "name": "Singapore Dollar",
          "rate": 1.3253056052916,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.75454294919395
        }, "huf": {
          "code": "HUF",
          "alphaCode": "HUF",
          "numericCode": "348",
          "name": "Hungarian Forint",
          "rate": 368.33756486998,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.002714900937006
        }, "byn": {
          "code": "BYN",
          "alphaCode": "BYN",
          "numericCode": "933",
          "name": "Belarussian Ruble",
          "rate": 2.8718245353022,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.34821068895658
        }, "tjs": {
          "code": "TJS",
          "alphaCode": "TJS",
          "numericCode": "972",
          "name": "Tajikistan Ruble",
          "rate": 10.169385052784,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.098334362875387
        }, "gmd": {
          "code": "GMD",
          "alphaCode": "GMD",
          "numericCode": "270",
          "name": "Gambian dalasi",
          "rate": 62.531791907514,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.015991865409503
        }, "cve": {
          "code": "CVE",
          "alphaCode": "CVE",
          "numericCode": "132",
          "name": "Cape Verde escudo",
          "rate": 102.29787234042,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0097753743760405
        }, "all": {
          "code": "ALL",
          "alphaCode": "ALL",
          "numericCode": "008",
          "name": "Albanian lek",
          "rate": 108.05303768073,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0092547143649469
        }, "scr": {
          "code": "SCR",
          "alphaCode": "SCR",
          "numericCode": "690",
          "name": "Seychelles rupee",
          "rate": 12.772136953955,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.078295433536699
        }, "dop": {
          "code": "DOP",
          "alphaCode": "DOP",
          "numericCode": "214",
          "name": "Dominican Peso",
          "rate": 56.307579202863,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.017759598515099
        }, "cny": {
          "code": "CNY",
          "alphaCode": "CNY",
          "numericCode": "156",
          "name": "Chinese Yuan",
          "rate": 6.7346226227705,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.14848641950907
        }, "isk": {
          "code": "ISK",
          "alphaCode": "ISK",
          "numericCode": "352",
          "name": "Icelandic Krona",
          "rate": 143.16917363743,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0069847438145621
        }, "lyd": {
          "code": "LYD",
          "alphaCode": "LYD",
          "numericCode": "434",
          "name": "Libyan Dinar",
          "rate": 4.8379108187957,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.20670079244018
        }, "clp": {
          "code": "CLP",
          "alphaCode": "CLP",
          "numericCode": "152",
          "name": "Chilean Peso",
          "rate": 818.61548088931,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0012215747482733
        }, "bsd": {
          "code": "BSD",
          "alphaCode": "BSD",
          "numericCode": "044",
          "name": "Bahamian Dollar",
          "rate": 0.99159009143196,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.0084812349788
        }, "xpf": {
          "code": "XPF",
          "alphaCode": "XPF",
          "numericCode": "953",
          "name": "CFP Franc",
          "rate": 109.997712194,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0090910981697176
        }, "lsl": {
          "code": "LSL",
          "alphaCode": "LSL",
          "numericCode": "426",
          "name": "Lesotho loti",
          "rate": 16.896524795002,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.059183767794417
        }, "tzs": {
          "code": "TZS",
          "alphaCode": "TZS",
          "numericCode": "834",
          "name": "Tanzanian shilling",
          "rate": 2311.5384615384,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00043261231281199
        }, "ang": {
          "code": "ANG",
          "alphaCode": "ANG",
          "numericCode": "532",
          "name": "Neth. Antillean Guilder",
          "rate": 1.7876484080029,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.55939411548894
        }, "lbp": {
          "code": "LBP",
          "alphaCode": "LBP",
          "numericCode": "422",
          "name": "Lebanese Pound",
          "rate": 1508.3708052581,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00066296695515059
        }, "myr": {
          "code": "MYR",
          "alphaCode": "MYR",
          "numericCode": "458",
          "name": "Malaysian Ringgit",
          "rate": 4.3488079895152,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.2299480690826
        }, "kzt": {
          "code": "KZT",
          "alphaCode": "KZT",
          "numericCode": "398",
          "name": "Kazakhstani Tenge",
          "rate": 460.0511056582,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0021736715501842
        }, "htg": {
          "code": "HTG",
          "alphaCode": "HTG",
          "numericCode": "332",
          "name": "Haitian gourde",
          "rate": 147.05825510788,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0068000262839132
        }, "bnd": {
          "code": "BND",
          "alphaCode": "BND",
          "numericCode": "096",
          "name": "Brunei Dollar",
          "rate": 1.3199121522694,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.75762617859124
        }, "kmf": {
          "code": "KMF",
          "alphaCode": "KMF",
          "numericCode": "174",
          "name": "\tComoro franc",
          "rate": 454.49007457199,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0022002680717323
        }, "ssp": {
          "code": "SSP",
          "alphaCode": "SSP",
          "numericCode": "728",
          "name": "South Sudanese pound",
          "rate": 673.59900373598,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0014845627657608
        }, "mru": {
          "code": "MRU",
          "alphaCode": "MRU",
          "numericCode": "929",
          "name": "Mauritanian ouguiya",
          "rate": 36.06,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.027731558513588
        }, "mnt": {
          "code": "MNT",
          "alphaCode": "MNT",
          "numericCode": "496",
          "name": "Mongolian togrog",
          "rate": 3415.3117600632,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0002927990386393
        }, "jod": {
          "code": "JOD",
          "alphaCode": "JOD",
          "numericCode": "400",
          "name": "Jordanian Dinar",
          "rate": 0.70862743297091,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.4111787851728
        }, "php": {
          "code": "PHP",
          "alphaCode": "PHP",
          "numericCode": "608",
          "name": "Philippine Peso",
          "rate": 55.068003523326,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.018159365439432
        }, "xof": {
          "code": "XOF",
          "alphaCode": "XOF",
          "numericCode": "952",
          "name": "West African CFA Franc",
          "rate": 609.21638048955,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0016414529090574
        }, "amd": {
          "code": "AMD",
          "alphaCode": "AMD",
          "numericCode": "051",
          "name": "Armenia Dram",
          "rate": 393.17263510477,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0025434120045855
        }, "uyu": {
          "code": "UYU",
          "alphaCode": "UYU",
          "numericCode": "858",
          "name": "Uruguayan Peso",
          "rate": 39.574344167294,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.025268896327698
        }, "jmd": {
          "code": "JMD",
          "alphaCode": "JMD",
          "numericCode": "388",
          "name": "Jamaican Dollar",
          "rate": 151.3006993007,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0066093547790719
        }, "ghs": {
          "code": "GHS",
          "alphaCode": "GHS",
          "numericCode": "936",
          "name": "Ghanaian Cedi",
          "rate": 10.500363989323,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.095234793862082
        }, "cup": {
          "code": "CUP",
          "alphaCode": "CUP",
          "numericCode": "192",
          "name": "Cuban peso",
          "rate": 0.99159009143196,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.0084812349788
        }, "nzd": {
          "code": "NZD",
          "alphaCode": "NZD",
          "numericCode": "554",
          "name": "New Zealand Dollar",
          "rate": 1.5684212978041,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.63758379295159
        }, "try": {
          "code": "TRY",
          "alphaCode": "TRY",
          "numericCode": "949",
          "name": "Turkish Lira",
          "rate": 18.780225187964,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.053247497833034
        }, "ngn": {
          "code": "NGN",
          "alphaCode": "NGN",
          "numericCode": "566",
          "name": "Nigerian Naira",
          "rate": 449.23163060279,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0022260231289996
        }, "kgs": {
          "code": "KGS",
          "alphaCode": "KGS",
          "numericCode": "417",
          "name": "Kyrgyzstan Som",
          "rate": 85.263969899111,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.011728283367327
        }, "mga": {
          "code": "MGA",
          "alphaCode": "MGA",
          "numericCode": "969",
          "name": "Malagasy ariary",
          "rate": 4512.2002085506,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00022162137178776
        }, "srd": {
          "code": "SRD",
          "alphaCode": "SRD",
          "numericCode": "968",
          "name": "Surinamese dollar",
          "rate": 31.770925110132,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.031475318912923
        }, "mwk": {
          "code": "MWK",
          "alphaCode": "MWK",
          "numericCode": "454",
          "name": "Malawian kwacha",
          "rate": 1016.7293233083,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00098354594194858
        }, "yer": {
          "code": "YER",
          "alphaCode": "YER",
          "numericCode": "886",
          "name": "Yemeni rial",
          "rate": 247.87764220656,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0040342484747644
        }, "nok": {
          "code": "NOK",
          "alphaCode": "NOK",
          "numericCode": "578",
          "name": "Norwegian Krone",
          "rate": 9.9083690909524,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.10092478296081
        }, "qar": {
          "code": "QAR",
          "alphaCode": "QAR",
          "numericCode": "634",
          "name": "Qatari Rial",
          "rate": 3.6456794005616,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.2742972955455
        }, "czk": {
          "code": "CZK",
          "alphaCode": "CZK",
          "numericCode": "203",
          "name": "Czech Koruna",
          "rate": 22.240739097277,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.044962534546455
        }, "hrk": {
          "code": "HRK",
          "alphaCode": "HRK",
          "numericCode": "191",
          "name": "Croatian Kuna",
          "rate": 7.1351874417603,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.14015048772892
        }, "rsd": {
          "code": "RSD",
          "alphaCode": "RSD",
          "numericCode": "941",
          "name": "Serbian Dinar",
          "rate": 108.42972393252,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0092225633685311
        }, "nio": {
          "code": "NIO",
          "alphaCode": "NIO",
          "numericCode": "558",
          "name": "Nicaraguan C\u00f3rdoba",
          "rate": 36.180602006689,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.02763911998521
        }, "sbd": {
          "code": "SBD",
          "alphaCode": "SBD",
          "numericCode": "090",
          "name": "Solomon Islands dollar",
          "rate": 8.3359660951647,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.11996210020336
        }, "mmk": {
          "code": "MMK",
          "alphaCode": "MMK",
          "numericCode": "104",
          "name": "Myanma Kyat",
          "rate": 2080.3846153846,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00048068034756887
        }, "mur": {
          "code": "MUR",
          "alphaCode": "MUR",
          "numericCode": "480",
          "name": "Mauritian Rupee",
          "rate": 43.272,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.023109632094657
        }, "ves": {
          "code": "VES",
          "alphaCode": "VES",
          "numericCode": "928",
          "name": "Venezuelan Bolivar",
          "rate": 18.683075822703,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.053524377328964
        }, "bdt": {
          "code": "BDT",
          "alphaCode": "BDT",
          "numericCode": "050",
          "name": "Bangladeshi taka",
          "rate": 104.14290125539,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0096021907201116
        }, "ron": {
          "code": "RON",
          "alphaCode": "RON",
          "numericCode": "946",
          "name": "Romanian New Leu",
          "rate": 4.5755311897642,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.21855385932831
        }, "dzd": {
          "code": "DZD",
          "alphaCode": "DZD",
          "numericCode": "012",
          "name": "Algerian Dinar",
          "rate": 136.2748508116,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0073381111338181
        }, "ars": {
          "code": "ARS",
          "alphaCode": "ARS",
          "numericCode": "032",
          "name": "Argentine Peso",
          "rate": 179.8824052617,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.005559187395483
        }, "stn": {
          "code": "STN",
          "alphaCode": "STN",
          "numericCode": "930",
          "name": "S\u00e3o Tom\u00e9 and Pr\u00edncipe Dobra",
          "rate": 22.846884899683,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.043769643187281
        }, "bif": {
          "code": "BIF",
          "alphaCode": "BIF",
          "numericCode": "108",
          "name": "Burundian franc",
          "rate": 2053.725676317,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00048691994823443
        }, "szl": {
          "code": "SZL",
          "alphaCode": "SZL",
          "numericCode": "748",
          "name": "Swazi lilangeni",
          "rate": 16.896524795002,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.059183767794417
        }, "sos": {
          "code": "SOS",
          "alphaCode": "SOS",
          "numericCode": "706",
          "name": "Somali shilling",
          "rate": 563.14419573139,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0017757441301534
        }, "aed": {
          "code": "AED",
          "alphaCode": "AED",
          "numericCode": "784",
          "name": "U.A.E Dirham",
          "rate": 3.6705893666483,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.27243581346532
        }, "idr": {
          "code": "IDR",
          "alphaCode": "IDR",
          "numericCode": "360",
          "name": "Indonesian Rupiah",
          "rate": 15263.647887482,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 6.5515138148602e-5
        }, "mxn": {
          "code": "MXN",
          "alphaCode": "MXN",
          "numericCode": "484",
          "name": "Mexican Peso",
          "rate": 18.87064747844,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.052992352336745
        }, "uah": {
          "code": "UAH",
          "alphaCode": "UAH",
          "numericCode": "980",
          "name": "Ukrainian Hryvnia",
          "rate": 36.674971626556,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.027266551428656
        }, "crc": {
          "code": "CRC",
          "alphaCode": "CRC",
          "numericCode": "188",
          "name": "Costa Rican Col\u00f3n",
          "rate": 580.29894182722,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0017232497389212
        }, "bzd": {
          "code": "BZD",
          "alphaCode": "BZD",
          "numericCode": "084",
          "name": "Belize dollar",
          "rate": 1.9967698767939,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.50080883712331
        }, "gnf": {
          "code": "GNF",
          "alphaCode": "GNF",
          "numericCode": "324",
          "name": "Guinean franc",
          "rate": 8534.9112426036,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00011716583471991
        }, "ern": {
          "code": "ERN",
          "alphaCode": "ERN",
          "numericCode": "232",
          "name": "Eritrean nakfa",
          "rate": 14.931677018634,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.066971713810314
        }, "wst": {
          "code": "WST",
          "alphaCode": "WST",
          "numericCode": "882",
          "name": "Samoan tala",
          "rate": 2.6635479502647,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.3754390830098
        }, "brl": {
          "code": "BRL",
          "alphaCode": "BRL",
          "numericCode": "986",
          "name": "Brazilian Real",
          "rate": 5.132731684051,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.1948280295086
        }, "inr": {
          "code": "INR",
          "alphaCode": "INR",
          "numericCode": "356",
          "name": "Indian Rupee",
          "rate": 81.405835312885,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.01228413167381
        }, "npr": {
          "code": "NPR",
          "alphaCode": "NPR",
          "numericCode": "524",
          "name": "Nepalese Rupee",
          "rate": 129.91600418862,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0076972810720698
        }, "xaf": {
          "code": "XAF",
          "alphaCode": "XAF",
          "numericCode": "950",
          "name": "Central African CFA Franc",
          "rate": 610.95312599769,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0016367867802738
        }, "azn": {
          "code": "AZN",
          "alphaCode": "AZN",
          "numericCode": "944",
          "name": "Azerbaijan Manat",
          "rate": 1.6902311469599,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.59163505642328
        }, "pyg": {
          "code": "PYG",
          "alphaCode": "PYG",
          "numericCode": "600",
          "name": "Paraguayan Guaran\u00ed",
          "rate": 7342.9017727404,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0001361859426899
        }, "gyd": {
          "code": "GYD",
          "alphaCode": "GYD",
          "numericCode": "328",
          "name": "Guyanese dollar",
          "rate": 207.25130513913,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0048250600850436
        }, "rwf": {
          "code": "RWF",
          "alphaCode": "RWF",
          "numericCode": "646",
          "name": "Rwandan franc",
          "rate": 1061.1083864639,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00094241079682016
        }, "syp": {
          "code": "SYP",
          "alphaCode": "SYP",
          "numericCode": "760",
          "name": "Syrian pound",
          "rate": 2545.4117647059,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00039286374560917
        }, "mop": {
          "code": "MOP",
          "alphaCode": "MOP",
          "numericCode": "446",
          "name": "Macanese pataca",
          "rate": 7.9778761061945,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.12534664448142
        }, "bam": {
          "code": "BAM",
          "alphaCode": "BAM",
          "numericCode": "977",
          "name": "Bosnia and Herzegovina convertible mark",
          "rate": 1.8103166966489,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.5523895359586
        }, "dkk": {
          "code": "DKK",
          "alphaCode": "DKK",
          "numericCode": "208",
          "name": "Danish Krone",
          "rate": 6.8817819601888,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.14531120075949
        }, "lkr": {
          "code": "LKR",
          "alphaCode": "LKR",
          "numericCode": "144",
          "name": "Sri Lanka Rupee",
          "rate": 364.17402174253,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0027459399635787
        }, "tnd": {
          "code": "TND",
          "alphaCode": "TND",
          "numericCode": "788",
          "name": "Tunisian Dinar",
          "rate": 3.0774052026555,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.32494908344767
        }, "vnd": {
          "code": "VND",
          "alphaCode": "VND",
          "numericCode": "704",
          "name": "Vietnamese Dong",
          "rate": 23450.373197724,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 4.2643244590114e-5
        }, "iqd": {
          "code": "IQD",
          "alphaCode": "IQD",
          "numericCode": "368",
          "name": "Iraqi dinar",
          "rate": 1452.8863364673,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.00068828508803483
        }, "afn": {
          "code": "AFN",
          "alphaCode": "AFN",
          "numericCode": "971",
          "name": "Afghan afghani",
          "rate": 88.983939624506,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.011237982991311
        }, "nad": {
          "code": "NAD",
          "alphaCode": "NAD",
          "numericCode": "516",
          "name": "Namibian dollar",
          "rate": 16.889929742389,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.059206877426511
        }, "lak": {
          "code": "LAK",
          "alphaCode": "LAK",
          "numericCode": "418",
          "name": "Lao kip",
          "rate": 16903.125,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 5.9160658162322e-5
        }, "gtq": {
          "code": "GTQ",
          "alphaCode": "GTQ",
          "numericCode": "320",
          "name": "Guatemalan Quetzal",
          "rate": 7.7687612208257,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.12872065076724
        }, "pkr": {
          "code": "PKR",
          "alphaCode": "PKR",
          "numericCode": "586",
          "name": "Pakistani Rupee",
          "rate": 227.3941418439,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0043976506689714
        }, "bgn": {
          "code": "BGN",
          "alphaCode": "BGN",
          "numericCode": "975",
          "name": "Bulgarian Lev",
          "rate": 1.8105627670169,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.55231446167846
        }, "rub": {
          "code": "RUB",
          "alphaCode": "RUB",
          "numericCode": "643",
          "name": "Russian Rouble",
          "rate": 69.672358592811,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.014352894321324
        }, "tmt": {
          "code": "TMT",
          "alphaCode": "TMT",
          "numericCode": "934",
          "name": "New Turkmenistan Manat",
          "rate": 3.4810136959652,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.28727264163283
        }, "svc": {
          "code": "SVC",
          "alphaCode": "SVC",
          "numericCode": "222",
          "name": "Salvadoran colon",
          "rate": 8.6717434869741,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.11531706415234
        }, "xcd": {
          "code": "XCD",
          "alphaCode": "XCD",
          "numericCode": "951",
          "name": "East Caribbean Dollar",
          "rate": 2.6865338051779,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.37222684414864
        }, "aoa": {
          "code": "AOA",
          "alphaCode": "AOA",
          "numericCode": "973",
          "name": "Angolan kwanza",
          "rate": 509.08235294118,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.0019643187280458
        }, "mvr": {
          "code": "MVR",
          "alphaCode": "MVR",
          "numericCode": "462",
          "name": "Maldivian rufiyaa",
          "rate": 15.317522123894,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.065284710667405
        }, "sar": {
          "code": "SAR",
          "alphaCode": "SAR",
          "numericCode": "682",
          "name": "Saudi Riyal",
          "rate": 3.7537526211939,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.26640008037662
        }, "pln": {
          "code": "PLN",
          "alphaCode": "PLN",
          "numericCode": "985",
          "name": "Polish Zloty",
          "rate": 4.342965521722,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.23025741166913
        }, "gip": {
          "code": "GIP",
          "alphaCode": "GIP",
          "numericCode": "292",
          "name": "Gibraltar pound",
          "rate": 0.81842527453055,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 1.2218586487002
        }, "gel": {
          "code": "GEL",
          "alphaCode": "GEL",
          "numericCode": "981",
          "name": "Georgian lari",
          "rate": 2.6757933885305,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.37372093237333
        }, "mkd": {
          "code": "MKD",
          "alphaCode": "MKD",
          "numericCode": "807",
          "name": "Macedonian denar",
          "rate": 57.035904465651,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.017532815677574
        }, "awg": {
          "code": "AWG",
          "alphaCode": "AWG",
          "numericCode": "533",
          "name": "Aruban florin",
          "rate": 1.7933606863111,
          "date": "Fri, 13 Jan 2023 11:55:01 GMT",
          "inverseRate": 0.55761231281197
        }
      };
    }

  }

// Devuelve la cantidad equivalente a ese valor en otra moneda a tantos decimales (usualmente dos)
  convertir(cantidad, otraMoneda, decimales) {
    if (otraMoneda instanceof Money) {
      return formatearA(decimales, (cantidad * otraMoneda.tasa) / this.tasa);
    }
  }

  currency(countryName, no) {
    no = no ? no : 0;
    for (let i = 0; i < _countries.length; i++) {
      if (_countries[i].nombre === countryName) {
        return _countries[i].currencies[no];
      }
    }
    return null;
  }

}
