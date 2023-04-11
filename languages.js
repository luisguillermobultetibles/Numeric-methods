class Languages {

  /* Global variables */
  static languagesHashOld = [];
  static languagesHash = [];
  static languagesRegexHash = [];

  constructor() {
    /* Initialize the languages arrays */
    Languages.languagesHash['aeb'] = 'زَوُن';
    Languages.languagesHash['afr'] = Languages.languagesHashOld['af'] = 'Afrikaans';
    Languages.languagesHash['ara'] = Languages.languagesHashOld['ar'] = 'العربية';
    Languages.languagesHash['ary'] = 'الدارجة';
    Languages.languagesHash['asm'] = Languages.languagesHashOld['as'] = 'অসমীয়া';
    Languages.languagesHash['ast'] = 'Asturianu';
    Languages.languagesHash['aze'] = Languages.languagesHashOld['az'] = 'azərbaycanca';
    Languages.languagesHash['azb'] = 'South Azerbaijani';
    Languages.languagesHash['ba'] = 'Bašqort';
    Languages.languagesHash['bcc'] = 'balojî Balójí';
    Languages.languagesHash['ben'] = Languages.languagesHashOld['bn'] = 'বাংলা';
    Languages.languagesHash['bel'] = Languages.languagesHashOld['be'] = 'Беларуская';
    Languages.languagesHash['bel-tasrask'] = Languages.languagesHashOld['be-tarask'] = 'тарашкевіца, клясычны правапіс';
    Languages.languagesHash['bam'] = Languages.languagesHashOld['bm'] = 'Bamanankan';
    Languages.languagesHash['bul'] = Languages.languagesHashOld['bg'] = 'Български';
    Languages.languagesHash['bjn'] = 'Bahasa Banjar';
    Languages.languagesHash['ebn'] = Languages.languagesHashOld['bn'] = 'বাংলা';
    Languages.languagesHash['bre'] = Languages.languagesHashOld['br'] = 'Brezhoneg';
    Languages.languagesHash['cat'] = Languages.languagesHashOld['ca'] = 'Català';
    Languages.languagesHash['ces'] = Languages.languagesHashOld['cs'] = 'Česky';
    Languages.languagesHash['chv'] = Languages.languagesHashOld['cv'] = 'Чӑвашла';
    Languages.languagesHash['ckb'] = 'کوردیی ناوەندی';
    Languages.languagesHash['cym'] = Languages.languagesHashOld['cy'] = 'Cymraeg';
    Languages.languagesHash['deu'] = Languages.languagesHashOld['de'] = 'Deutsch';
    Languages.languagesHash['dan'] = Languages.languagesHashOld['da'] = 'Dansk';
    Languages.languagesHash['dsb'] = 'Dolnoserbski';
    Languages.languagesHash['ell'] = Languages.languagesHashOld['el'] = 'Ελληνικά';
    Languages.languagesHash['eng'] = Languages.languagesHashOld['en'] = 'English';
    Languages.languagesHash['epo'] = Languages.languagesHashOld['eo'] = 'Esperanto';
    Languages.languagesHash['ful'] = Languages.languagesHashOld['ff'] = 'Fulfulde';
    Languages.languagesHash['spa'] = Languages.languagesHashOld['es'] = 'Español';
    Languages.languagesHash['est'] = Languages.languagesHashOld['et'] = 'Eesti';
    Languages.languagesHash['fas'] = Languages.languagesHashOld['fa'] = 'فارسی';
    Languages.languagesHash['fin'] = Languages.languagesHashOld['fi'] = 'Suomi';
    Languages.languagesHash['fo'] = 'Føroyskt';
    Languages.languagesHash['fra'] = Languages.languagesHashOld['fr'] = 'Français';
    Languages.languagesHash['frp'] = 'Provençau';
    Languages.languagesHash['gl'] = 'Galego';
    Languages.languagesHash['grn'] = Languages.languagesHashOld['gn'] = 'Avañe\'ẽ';
    Languages.languagesHash['guj'] = Languages.languagesHashOld['gu'] = 'ગુજરાતી';
    Languages.languagesHash['gsw'] = 'Schwyzerdütsch';
    Languages.languagesHash['hak'] = '客家話/客家话';
    Languages.languagesHash['hau'] = Languages.languagesHashOld['ha'] = 'Hausa';
    Languages.languagesHash['heb'] = Languages.languagesHashOld['he'] = 'עברית';
    Languages.languagesHash['hin'] = Languages.languagesHashOld['hi'] = 'हिन्दी';
    Languages.languagesHash['hif-latn'] = 'Fiji Baat';
    Languages.languagesHash['hrv'] = Languages.languagesHashOld['hr'] = 'Олык Марий';
    Languages.languagesHash['hrx'] = 'Riograndenser Hunsrückisch';
    Languages.languagesHash['hsb'] = 'Hornjoserbsce';
    Languages.languagesHash['hat'] = Languages.languagesHashOld['ht'] = 'Kreyol ayisyen';
    Languages.languagesHash['hun'] = Languages.languagesHashOld['hu'] = 'Magyar';
    Languages.languagesHash['hye'] = Languages.languagesHashOld['hy'] = 'Հայերեն';
    Languages.languagesHash['ia'] = 'Interlingua';
    Languages.languagesHash['ind'] = Languages.languagesHashOld['id'] = 'Bahasa Indonesia';
    Languages.languagesHash['ie'] = 'Interlingue';
    Languages.languagesHash['ilo'] = 'Ilokano';
    Languages.languagesHash['ita'] = Languages.languagesHashOld['it'] = 'Italiano';
    Languages.languagesHash['jav'] = Languages.languagesHashOld['jv'] = 'Basa Jawa';
    Languages.languagesHash['jpn'] = Languages.languagesHashOld['ja'] = '日本語';
    Languages.languagesHash['kat'] = Languages.languagesHashOld['ka'] = 'ქართული';
    Languages.languagesHash['kaz'] = Languages.languagesHashOld['kk'] = 'Қазақша';
    Languages.languagesHash['khm'] = Languages.languagesHashOld['km'] = 'ភាសាខ្មែរ';
    Languages.languagesHash['kir'] = Languages.languagesHashOld['ky'] = 'قىرعىز تىلى';
    Languages.languagesHash['kan'] = Languages.languagesHashOld['kn'] = 'ಕನ್ನಡ';
    Languages.languagesHash['kor'] = Languages.languagesHashOld['ko'] = '한국어';
    Languages.languagesHash['kor-kp'] = Languages.languagesHashOld['ko-kp'] = '조선어';
    Languages.languagesHash['ksh'] = 'Ripoarisch';
    Languages.languagesHash['kur'] = Languages.languagesHashOld['ku'] = 'kurdî';
    Languages.languagesHash['lat'] = Languages.languagesHashOld['la'] = 'Lingua Latīna';
    Languages.languagesHash['lb'] = 'Lëtzebuergesch';
    Languages.languagesHash['li'] = 'Limburgs';
    Languages.languagesHash['lit'] = Languages.languagesHashOld['lt'] = 'Lietuvių';
    Languages.languagesHash['lv'] = 'Latviešu';
    Languages.languagesHash['map-bms'] = 'Basa Banyumasan';
    Languages.languagesHash['mkd'] = Languages.languagesHashOld['mk'] = 'Македонски';
    Languages.languagesHash['mal'] = Languages.languagesHashOld['ml'] = 'മലയാളം';
    Languages.languagesHash['mar'] = Languages.languagesHashOld['mr'] = 'मराठी';
    Languages.languagesHash['mlg'] = Languages.languagesHashOld['mg'] = 'Malagasy';
    Languages.languagesHash['mon'] = Languages.languagesHashOld['mn'] = 'Монгол хэл';
    Languages.languagesHash['msa'] = Languages.languagesHashOld['ms'] = 'Bahasa Melayu';
    Languages.languagesHash['mt'] = 'Malti';
    Languages.languagesHash['mya'] = Languages.languagesHashOld['my'] = 'မြန်မာဘာသာ';
    Languages.languagesHash['nep'] = Languages.languagesHashOld['ne'] = 'नेपाली';
    Languages.languagesHash['new'] = 'नेपाल भाषा';
    Languages.languagesHash['nld'] = Languages.languagesHashOld['nl'] = 'Nederlands';
    Languages.languagesHash['nob'] = Languages.languagesHashOld['nb'] = 'Norsk (bokmål)';
    Languages.languagesHash['nor'] = Languages.languagesHashOld['no'] = 'Norsk (bokmål)';
    Languages.languagesHash['nno'] = Languages.languagesHashOld['nn'] = 'Norsk (nynorsk)';
    Languages.languagesHash['oci'] = Languages.languagesHashOld['oc'] = 'Occitan';
    Languages.languagesHash['ori'] = Languages.languagesHashOld['or'] = 'ଓଡ଼ିଆ';
    Languages.languagesHash['pdc'] = 'Pennsilfaanisch Deitsch';
    Languages.languagesHash['pol'] = Languages.languagesHashOld['pl'] = 'Język polski';
    Languages.languagesHash['pms'] = 'Piemontèis';
    Languages.languagesHash['ps'] = 'پښتو';
    Languages.languagesHash['por'] = Languages.languagesHashOld['pt'] = 'Português';
    Languages.languagesHash['por-pt'] = Languages.languagesHashOld['pt-br'] = 'Português do Brasil';
    Languages.languagesHash['qu'] = 'Runa Simi';
    Languages.languagesHash['rm'] = 'Rumantsch';
    Languages.languagesHash['ron'] = Languages.languagesHashOld['ro'] = 'Română';
    Languages.languagesHash['rus'] = Languages.languagesHashOld['ru'] = 'Русский';
    Languages.languagesHash['rue'] = 'Русиньскый';
    Languages.languagesHash['san'] = Languages.languagesHashOld['sa'] = 'संस्कृतम्';
    Languages.languagesHash['sh'] = 'Srpskohrvatski / Српскохрватски';
    Languages.languagesHash['sin'] = Languages.languagesHashOld['si'] = 'සිංහල';
    Languages.languagesHash['slk'] = Languages.languagesHashOld['sk'] = 'Slovenčina';
    Languages.languagesHash['slv'] = Languages.languagesHashOld['sl'] = 'Slovenščina';
    Languages.languagesHash['sq'] = 'Shqip';
    Languages.languagesHash['srp'] = Languages.languagesHashOld['sr'] = 'Српски';
    Languages.languagesHash['srp-ec'] = Languages.languagesHashOld['sr-ec'] = 'Српски (ћирилица)';
    Languages.languagesHash['srp-el'] = Languages.languagesHashOld['sr-el'] = 'Srpski (latinica)';
    Languages.languagesHash['su'] = 'Basa Sunda';
    Languages.languagesHash['swe'] = Languages.languagesHashOld['sv'] = 'Svenska';
    Languages.languagesHash['swa'] = Languages.languagesHashOld['sw'] = 'Kiswahili';
    Languages.languagesHash['ta'] = 'தமிழ்';
    Languages.languagesHash['tuk'] = Languages.languagesHashOld['tk'] = 'Türkmen dili';
    Languages.languagesHash['tcy'] = 'ತುಳು';
    Languages.languagesHash['tel'] = Languages.languagesHashOld['te'] = 'తెలుగు';
    Languages.languagesHash['tgl'] = Languages.languagesHashOld['tl'] = 'Wikang Tagalog';
    Languages.languagesHash['tha'] = Languages.languagesHashOld['th'] = 'ไทย';
    Languages.languagesHash['tly'] = 'толышә зывон';
    Languages.languagesHash['tt-cyrl'] = 'Татарча';
    Languages.languagesHash['tur'] = Languages.languagesHashOld['tr'] = 'Türkçe';
    Languages.languagesHash['ug-arab'] = 'ئۇيغۇرچە';
    Languages.languagesHash['ukr'] = Languages.languagesHashOld['uk'] = 'Українська';
    Languages.languagesHash['urd'] = Languages.languagesHashOld['ur'] = 'اردو';
    Languages.languagesHash['uzb'] = Languages.languagesHashOld['uz'] = 'Oʻzbekcha';
    Languages.languagesHash['vie'] = Languages.languagesHashOld['vi'] = 'Tiếng Việt';
    Languages.languagesHash['yi'] = 'ייִדיש';
    Languages.languagesHash['vec'] = 'Vèneto';
    Languages.languagesHash['wol'] = Languages.languagesHashOld['yo'] = 'Wolof';
    Languages.languagesHash['zho'] = Languages.languagesHashOld['zh'] = '中文';
    Languages.languagesHash['zho-hans'] = Languages.languagesHashOld['zh-hans'] = '中文(简体)';
    Languages.languagesHash['zho-hant'] = Languages.languagesHashOld['zh-hant'] = '中文(繁體)';
    Languages.languagesHash['zho-hk'] = Languages.languagesHashOld['zh-hk'] = '中文(香港)';
    Languages.languagesHash['zza'] = Languages.languagesHashOld['diq'] = 'Zāzākī';
    this.buildLanguagesRegexHash();
  }

  getLanguageNameFromISO(code) {
    if (code instanceof Array) {
      return code.map((eachOne) => {
        return this.getLanguageNameFromISOCode(eachOne);
      }).join(', ');
    }
    let language = Languages.languagesHash[code] || Languages.languagesHashOld[code] || '';
    if (!language && code) {
      language = '("' + code + '" is not registered in library: languages.js)';
    }
    return language;
  }

  // deprecated, included for compatibility
  getLanguageNameFromISOCodes(codes) {
    this.getLanguageNameFromISOCode(codes);
  }

  /* Be careful, this function returns false, also if undefined - that
   * means nothing because the table this.languagesHashOld is not complete */
  isOldLanguageCode(code) {
    return Languages.languagesHashOld[iso] ? true : false;
  }

  buildLanguagesRegexHash() {
    Languages.languagesHash.forEach((code) => {
      Languages.languagesRegexHash[Languages.languagesHash[code]] = code;
    });
    Languages.languagesHashOld.forEach((code) => {
      Languages.languagesRegexHash[Languages.languagesHashOld[code]] = '^(' + (regex ? regex + '|' : '') + code + ')$';
    });
  }

  getLanguageRegex(language) {
    return Languages.languagesRegexHash[language] || '';
  }

}

