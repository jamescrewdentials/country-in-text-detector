var fs = require("fs");

var SPECIAL_CHARS =
  "\\u200B|[\\u2190-\\u21FF]|[\\u2300-\\u23FF]|[\\u2600-\\u27BF]|[\\u2B00-\\u2BFF]|[\\uFE00-\\uFE0F]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]";
var SPECIAL_CHARS_REG = RegExp("(" + SPECIAL_CHARS + ")+", "g");
var SEPARATORS =
  "[\\s,\\.\\+\\*\\?\\[\\]\\^\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-\\d\\/@#~&_;'\"%®ⓥ•｜\\\\]|[\\u4e00-\\u9faf]|[\\uff00-\\uffef]|[\\u3000-\\u30ff]";

function strToReg(str) {
  if (typeof str === "undefined" || str === null || str.length == 0) {
    return null;
  }

  str = str.replace(/\[&\]/gi, " (&|and|und) ");
  str = str.replace(/[\s-']+/gi, "(" + SEPARATORS + ")?");
  str = str.replace(/\[[aáâãäåàāă]\]/gi, "[aáâãäåàāă]");
  str = str.replace(/\[[eéêëěèēĕėę]\]/gi, "[eéêëěèēĕėę]");
  str = str.replace(/\[[iíîïìĩīĭįıįİ]\]/gi, "[iíîïìĩīĭįıįİ]");
  str = str.replace(/\[[yýÿŷ]\]/gi, "[yýÿŷ]");
  str = str.replace(/\[[oóôõöòōŏő]\]/gi, "[oóôõöòōŏő]");
  str = str.replace(/\[[uúûüùũūŭůű]\]/gi, "[uúûüùũūŭůű]");
  str = str.replace(/\[[cćĉċč]\]/gi, "[cćĉċč]");
  str = str.replace(/\[[dďđ]\]/gi, "[dďđ]");
  str = str.replace(/\[[gĝğġģ]\]/gi, "[gĝğġģ]");
  str = str.replace(/\[[lĺłŀľ]\]/gi, "[lĺłŀľ]");
  str = str.replace(/\[[rŕř]\]/gi, "[rŕř]");
  str = str.replace(/\[[sśŝşšș]\]/gi, "[sśŝşšș]");
  str = str.replace(/\[[tţťŧ]\]/gi, "[tţťŧ]");
  str = str.replace(/\[[zźżž]\]/gi, "[zźżž]");
  str = str.replace(/\[[nñňńņŉ]\]/gi, "[nñňńņŉ]");

  return str;
}

function processCSV(csv) {
  var lines = csv.split("\n");

  // first line contains name of colls, extract
  // them as keys and skip the line
  var keys = lines[0].split(separator);
  keys = keys.map(function (key) {
    return key.trim();
  });
  lines[0] = "";

  // parse all not empty lines
  var rows = [];
  for (var l = 0; l < lines.length; l++) {
    if (lines[l].length > 0) {
      var entries = lines[l].split(separator);
      if (
        typeof entries !== "undefined" &&
        entries !== null &&
        entries.length > 0
      ) {
        var entry = {};
        for (var i = 0; i < entries.length; i++) {
          if (
            typeof entries[i] !== "undefined" &&
            entries[i] !== null &&
            entries[i].length > 0
          ) {
            entry[keys[i]] = entries[i].trim();
          }
        }
        result.push(entry);
      }
    }
  }

  rows = rows.map(function (c) {
    var options = c.string_match.split(/,(?=\D)/g);
    options = options.map(function (option) {
      return strToReg(option.trim());
    });
    options = options.filter(function (option) {
      return option !== null;
    });
    if (options.length > 0) {
      c.string_match = RegExp(
        "(?:^|" +
          SEPARATORS +
          ")(" +
          options.join("|") +
          ")(?=" +
          SEPARATORS +
          "|$)",
        "ig"
      );
    } else {
      c.string_match = null;
    }

    return c;
  });

  return rows;
}

function loadCoutries() {
  return processCSV(`country_iso_3166-1_alpha-2;country_name;string_match
	AD;Andorra;(d'?)?Andorr?[ae]
	AE;United Arab Emirates;United Arab Emirates, [E]mirat(e|es|os), UAE, دولة الإمارات العربية المتحدة
	AF;Afghanistan;Af[g]h?[a]n[ie]st[a]n, افغانستان‎
	AG;Antigua and Barbuda;Antigua [&] Barbuda, Antigua, Barbuda
	AI;Anguilla;Anguill?a
	AL;Albania;Alb[a]ni[ae], Albanien, Shqip[ë]ria?, Shq[iy]pnia?
	AM;Armenia;Arm[e]ni[ae], Armenien, Hayastan, Հայաստան
	AN;Netherlands Antilles;Ne(d|th)erlands? Antilles, Nederlandse Antillen, Antia Hulandes
	AO;Angola;A?ngola
	AQ;Antarctica;Antar[ck]ti[ck]a, Antartique, Antarktis, Ant[á]rtida
	AR;Argentina;Argentin[ae], Argentinien
	AS;American Samoa;Ame[rl]ican? S[a]moa
	AT;Austria;Austria, Autriche, [Ö]sterreich, Rakousko
	AU;Australia;Austr[a]li[ae], Australien, Tasmania
	AW;Aruba;Aruba
	AZ;Azerbaijan;Azerbaijan, [Á]zerbajd[ž][á]n, Azǝrbaycan
	BA;Bosnia and Herzegovina;Bosni?a [&] Her[zc]egovina, Bosni?a, Her[zc]egovina, Bosna i Hercegovina, Боснa и Херцеговина
	BB;Barbados;Barbad(os|e)
	BD;Bangladesh;Banglad[e][s](h|ch)?, Bāṃlādēśa, বাংলাদেশ
	BE;Belgium;B[e]lgi(um|que|en|ca), Belgi[ë]
	BF;Burkina Faso;Burkina Faso
	BG;Bulgaria;Bulgari[ae]n?, Bulharsko, България, Bǎlgariya
	BH;Bahrain;Bah?r[ae]in, al-Baḥrayn, البحرين
	BI;Burundi;Burundi, Republika y'Uburundi
	BJ;Benin;B[e]n[i]n, Dahomey
	BL;St. Bartélemy;((St.|Saint)? )?Barth[é]lemy, San Bartolomé
	BM;Bermuda;Bermud[aye]s
	BN;Brunei;(Negara)? Brun[e]i Darussalam, Brun[e]i
	BO;Bolivia;Bol[i]vi[ae]n?, Mborivia, Buliwya, Wuliwya
	BR;Brazil;Br[aé][zs][i]l(ie)?
	BS;Bahamas;Bahama[sy]
	BT;Bhutan;Bh?[u]t[a]n, Bhoutan
	BV;Bouvet Island;Bouvet Island, Bouvetøya
	BW;Botswana;Bots[wu]ana
	BY;Belarus;Belarus, B[ě]lorusko, Беларусь, Bi?e[l]aru[ś], Bielorrusia, Bi[é]lorussie
	BZ;Belize;Beli[zc]e, British Honduras
	CA;Canada;Canad[a], Kanada
	CC;Cocos (Keeling) Islands;(Cocos|Keeling) Islands?, Kokosinseln, (Islas|[I]les) Cocos
	CD;The Democratic Republic of the Congo;(Democratic)? Republic of (the )?[CK]ongo, Zaire, [CK]ongo Kinshasa
	CF;Central African Republic;Central African Republic, Ködörösêse tî Bêafrîka, République centrafricaine, Centrafrique
	CG;Congo;[CK]ongo Brazzaville, [CK]ongo
	CH;Switzerland;Switzerland, [Š]v[í]carsko, Swiss, Suíço, Schweiz, Svizzera, Suisse, Svizra
	CI;Ivory Coast;Ivory Coast, C[ô]te d'?Ivoire, Costa de Marfil
	CK;Cook Islands;Cook Islands, Kūki 'Āirani, (Islas|[I]les) Cook, Cookinseln
	CL;Chile;Chile
	CM;Cameroon;Camero[ou]n, [CK]amer[u]n
	CN;China;China, [Č][í]na
	CO;Colombia;Colombi[ae], Kolumbien?
	CR;Costa Rica;Costa Rica, Kostarika
	CU;Cuba;[CK]uba
	CV;Cape Verde;Ca(pe|bo) Verde, Kap Verde, Cap Vert
	CW;Curaçao;Cura([ç]|z)ao
	CX;Christmas Island;Christmas Island, (Isla|[I]le) Christmas, Weihnachtsinsel
	CY;Cyprus;Cyprus, Kypr, K[ý]pros, K[ı]br[ı]s, Zypern, Ch[iy]pre
	CZ;Czech Republic;Czech Republic, [Č]esk([á]|[é]) Republik[ay], [Č]esk[oa], Morav[ay], Tschechische Republik
	DE;Germany;Germany, Deutschland, N[ě]meck[oua], All?eman(ia|ge)
	DJ;Djibouti;Djibouti, [JG]abuuti
	DK;Denmark;D[eaä]ne?mark, D[á]nsko, Dinamarca
	DM;Dominica;Domini(ca|que), Wai‘tu kubuli
	DO;Dominican Republic;Dominican Republic, Rep[ú]blica Dominicana, Dominik[á]nsk[á] Republika
	DZ;Algeria;Alg[e]ri[ea]n?, al-Jazā'ir
	EC;Ecuador;Ecuador, Ekv[á]dor, Ikwadur, Équateur
	EE;Estonia;Estoni[ae], Est(onsko|land), Eesti
	EG;Egypt;[E]gypte?, M[ia]ṣr, Egipto, Ägypten
	EH;Western Sahara;Western Sahara, Sahara Occidental
	ER;Eritrea;Eritrea, Érythrée
	ES;Spain;Spain, Испании, Espa[ñ]a, Španělsko, Espagne, Spanien, Canary Islands, Islas Canarias, Mallorca, Majorca, Ibiza, Eivissa
	ET;Ethiopia;[E]th?iop[i][ae], Äthiopien
	FI;Finland;Finn?land(e|ia)?, Finsko, Suomi
	FJ;Fiji Islands;Fiji Islands, Fiji, Fiyi, Fidji, Fidschi
	FK;Falkland Islands;Falkland Islands, Islas Malvinas, Falklandy, Falklandské ostrovy, [I]les Malouines, Falklandinseln
	FM;Federated States of Micronesia;Mi[ck]ron[e]si[ae]n?
	FO;Faroe Islands;Fae?roe Islands, Føroyar, Færøerne
	FR;France;France, French Republic, République française
	GA;Gabon;Gab[o]n, Gabonese Republic, République gabonaise, Gabun
	GB;United Kingdom;United Kingdom, UK, Great Britain, GB, Velká Británie, Británie
	GD;Grenada;Grenad[ae]
	GE;Georgia;G[e]orgi[ae].{1,5}EU, G[e]orgi[ae], Gruzie, Sakartvelo, Abkhazia, საქართველო
	GF;French Guiana;French Guiana, Guyane française, Guiana, Guyane
	GH;Ghana;Ghana
	GI;Gibraltar;Gibraltar
	GL;Greenland;Greenland, Kalaallit Nunaat, Grønland, Gr[ó]nsko, Gr[o]e?nland
	GM;Gambia;Gambi[ae]
	GN;Guinea;Guin[e][ae], République de Guinée, Guinée française
	GP;Guadeloupe;Guadelo?upe, Gwadloup
	GQ;Equatorial Guinea;Equatorial Guinea, Rovn[í]kov[á] Guinea, Guinea Ecuatorial, Guinée équatoriale, Guiné Equatorial
	GR;Greece;Gr[e]e?c(e|ia), Ελλάδα, Grecia, [Ř]ecko, Ell[á]da, Hellenic Republic
	GS;South Georgia and the South Sandwich Islands;South Georgia [&] (the )?South Sandwich Islands, SGSSI
	GT;Guatemala;Guatemala
	GU;Guam;Guam, Guåhån
	GW;Guinea-Bissau;Guin[e]a? Bissau
	GY;Guyana;Guyana
	HK;Hong Kong;Hong Kong
	HM;Heard Island and McDonald Islands;Heard Island [&] McDonald Islands
	HN;Honduras;Honduras
	HR;Croatia;Croatia, Hrvatska, Chorvatsko
	HT;Haiti;Ha[i]ti, Ayiti
	HU;Hungary;Hungary, Magyarorsz[á]g, Ma[ď]arsko
	ID;Indonesia;Indon[e]si[ae], Bali, Pulau Bali, Provinsi Bali
	IE;Ireland;Ireland, [É]ire, Airlann, Irsko
	IL;Israel;Israel [&] the Occupied Territories, I[sz]ra[e]l, יִשְׂרָאֵל‎, إِسْرَائِيل‎‎
	IN;India;India, Bhārat Gaṇarājya
	IO;British Indian Ocean Territory;British Indian Ocean Territory
	IQ;Iraq;[I]r[a][qk], Eraq, al-‘?Ir[ā]q
	IR;Iran;[I]r[a]n, Persia
	IS;Iceland;Iceland, Ísland, Ysland, Isl[a]nd(e|a|ij?a)
	IT;Italy;Italy, It[a]li[ae], Repubblica italiana
	JM;Jamaica;Jama[ij][ck]a
	JO;Jordan;Jord[a]n(ia|ie|ien)?
	JP;Japan;Japan, Japão, 日本, Japonsko, Nippon(-koku)?
	KE;Kenya;Kenya, Keňa
	KG;Kyrgyzstan;Kyrgyz Republic, Kyrgyzs?t[a]n, Кыргызстан, Qırğızstan, Киргизия, Kirgizija
	KH;Cambodia;Cambodia, Kampuchea, Kambodža
	KI;Kiribati;Kiribati
	KM;Comoros;Comor[oea]s
	KN;Saint Kitts and Nevis;Saint Kitts [&] Nevis
	KP;North Korea;(North|Seven[i]) Korea
	KR;South Korea;(South|Jižní) Korea, Korea
	KW;Kuwait;Kuwait
	KY;Cayman Islands;Cayman Islands, Kajmansk[é] Ostrovy
	KZ;Kazakhstan;Ka[zs]akhstan, Казахстан, Қазақстан, Qazaqstan
	LA;Laos;Laos
	LB;Lebanon;L[ei]banon
	LC;Saint Lucia;Saint Lucia
	LI;Liechtenstein;Liechtenstein
	LK;Sri Lanka;Sr[i] Lanka, Śrī Laṃkā
	LR;Liberia;Lib[e]ri[ae]
	LS;Lesotho;Lesoth?o
	LT;Lithuania;Lith?uani[ae], Lietuva, Lotyšsko
	LU;Luxembourg;Luxembo?urgo?, L[ë]tzebuerg, Luxemburg
	LV;Latvia;Latvij?a, Litva
	LY;Libyan Arab Jamahiriya;Libyan Arab Jamahiriya, Lib[yi][ae]
	MA;Morocco;Morocc?o, Marokk?o, al-ma[ġ]rib, Maroc
	MC;Monaco;M[o]na[ck]o
	MD;Moldova;Moldova, Transnistria, Moldavsko
	MG;Madagascar;Madagas[ck]ar, Madagasikara
	MH;Marshall Islands;Marshall Islands, Aolepān Aorōkin M̧ajeļ, Mar[š]alovy Ostrovy
	MK;Macedonia;Republic of Macedonia, Ma[ck][e]doni[ae], Македонија, Makedonija
	ML;Mali;Mali
	MM;Myanmar;Myanmar, Burma
	MN;Mongolia;Mongoli[ae], Mongolsko
	MO;Macao;Macao
	MP;Northern Mariana Islands;Northern Mariana Islands
	MQ;Martinique;Martinique, Martinik
	MR;Mauritania;Ma?ur[ie]tan[iy][ae], Murutaane
	MS;Montserrat;Montserrat
	MT;Malta;Malt[ae]
	MU;Mauritius;Mauri[tc]ius, Maurice
	MV;Maldives;Maldives, Maledivy
	MW;Malawi;Mala[wu]i
	MX;Mexico;M[e]xi[ck]o, Mexique
	MY;Malaysia;Mala[iy]si[ae]
	MZ;Mozambique;Mo(z|[ç])ambi(que|k)
	NA;Namibia;Namibi(a|[ë])
	NC;New Caledonia;New Caledonia, Nouvelle Calédonie
	NE;Niger;N[i]ger
	NF;Norfolk Island;Norfolk Island, Norf'k Ailen
	NG;Nigeria;Nig[e]ri[ae]
	NI;Nicaragua;Nicaragua
	NL;Netherlands;Ne(d|th)erlands?, Nizozem[í]
	NO;Norway;Norway, Norge, Noreg, Norga, Norsko, Norv[e]ge, Norwegen, Noruega
	NP;Nepal;N[e]p[a]l
	NR;Nauru;Nauru, Naoero
	NU;Niue;Niu[e]
	NZ;New Zealand;New Zealand, Zealand, Nov[ý] Z[é]land, Z[é]land
	OM;Oman;Om[a]n, ʻ?Um[ā]n
	PA;Panama;Panam[a]
	PE;Peru;Per[u], Piruw
	PF;French Polynesia;French Polynesia, Polyn[é]si[ae]
	PG;Papua New Guinea;Papua New Guinea, New Guinea, Papua Niu gini
	PH;Philippines;Philippines, Filip[í]ny, [PF]ilipinas
	PK;Pakistan;P[a]kist[a]n
	PL;Poland;Poland, Polsko, Polska, Polsce
	PM;Saint Pierre and Miquelon;Saint Pierre [&] Miquelon
	PN;Pitcairn;Pitcairn, Pitkern
	PR;Puerto Rico;P(ue|o)rto Rico
	PS;Palestine;Palestin[ea]
	PT;Portugal;Portugal(sko)?, República Portuguesa
	PW;Palau;Palau, Belau, Pelew
	PY;Paraguay;Paragu[a][yi]
	QA;Qatar;Qatar
	RE;Reunion;R[e]uni[o]n
	RO;Romania;Rom[a]n[i](a|en), Rumunsko
	RU;Russia;Russian Federation, Russ?i[ae], Россия, России, Rossiya, Rusko
	RW;Rwanda;R[wu]anda
	SA;Saudi Arabia;Saudi Arabi[ae]
	SB;Solomon Islands;Solomon Islands
	SC;Seychelles;Seychelles
	SD;Sudan;S[u]d[a]n
	SE;Sweden;S(ch)?weden, Sverige, [Š]v[é]dsko, Suecia, S[u]ede
	SG;Singapore;Singapore, Singap[u]r
	SH;Saint Helena;(St|Saint) H?elena
	SI;Slovenia;E?Slov[e]nij?[ae]
	SJ;Svalbard and Jan Mayen;Svalbard [&] Jan Mayen
	SK;Slovakia;Slovak Republic, Slovakia, Slovensk[á] Republika, Slovensko
	SL;Sierra Leone;Sierra Leone
	SM;San Marino;San Marino, Saint-Marin
	SN;Senegal;S[e]n[e]gal
	SO;Somalia;Somal[iy][ae], Soomaaliya, Somálsko
	SR;Suriname;Suriname?
	ST;Sao Tome and Principe;S[ã]o Tom[é] [&] Pr[í]ncipe
	SV;El Salvador;El Salv[a]dor
	SY;Syria;S[yi]ri[ae]n?, S[ū]riy[ā]
	SZ;Swaziland;Swaziland, kaNgwane, Eswatini
	TC;Turks and Caicos Islands;Turks [&] Caicos Islands
	TD;Chad;Chad, Tsh[ā]d
	TF;French Southern territories;French Southern territories
	TG;Togo;Togo, Togolese Republic, R[é]publique togolaise
	TH;Thailand;Thailand(ia)?, Siam, Thajsko
	TJ;Tajikistan;Tajikistan, Таджикистан
	TK;Tokelau;Tokelau
	TM;Turkmenistan;T[u]rkmenist[a]n, Turkmenia
	TN;Tunisia;Tunisi[ae]n?, T[u]nis, T[u]nez
	TO;Tonga;Tonga
	TP;East Timor;East Timor, Timor Leste
	TR;Turkey;T[u]rke[yi], T[ü]rkiye, Turqu(ía|ie)
	TT;Trinidad and Tobago;Trinidad [&] Tobago
	TV;Tuvalu;Tuvalu, Ellice Islands
	TW;Taiwan;Ta[i]w[a]n
	TZ;Tanzania;Tan[zs]ani[ae]
	UA;Ukraine;Ukrain[ea], Украине, Україна
	UG;Uganda;Uganda
	UM;United States Minor Outlying Islands;(United States|US) (Minor)? Outlying Islands, (Baker|Howland|Jarvis|Wake|Navassa) Island, (Johnston|Midway|Palmyra) Atoll, Kingman Reef
	US;United States;United States( of America)?, USA, 美國
	UY;Uruguay;Uruguay
	UZ;Uzbekistan;O?Uzb[e]kist[a]n, Oʻ?zbekiston
	VA;Holy See (Vatican City State);Holy See, Vatican City, Civitas Vaticana, Citt[à] del Vaticano, Vati[ck][a]n, Vatikanstadt
	VC;Saint Vincent and the Grenadines;Saint Vincent'?s [&] (the )?Grenadines
	VE;Venezuela;Venezuela
	VG;Virgin Islands (British);Virgin Islands
	VI;Virgin Islands (U.S.);Virgin Islands
	VN;Vietnam;Vi[e]t'?nam
	VU;Vanuatu;Vanuatu
	WF;Wallis and Futuna;Wallis [&] Futuna
	WS;Samoa;S[a]moa
	YE;Yemen;[YJ][e]men, al Yaman
	YT;Mayotte;Mayotte
	YU;Yugoslavia;Yugoslavia, Jugosl[a]vij[ae], Југославија
	ZA;South Africa;South Africa
	ZM;Zambia;Zambi[ae]
	ZW;Zimbabwe;[ZS]imbab[wu]e
	ME;Montenegro;Mont[e]n[e]gro, Crna Gora, Црна Гора, [Č]ern[á] Hora
	XK;Kosovo;Kosov[oae], Косово
	RS;Serbia;Serbi[ae], Srbija, Србија, Srbsko
	GB-WLS;Wales;Wales
	GB-SCT;Scotland;Scotland, Skotsko
	GB-ENG;England;England, Inglaterra, Anglie
	US-AL;Alabama;Alabama
	US-AK;Alaska;Alj?a[s]ka
	US-AZ;Arizona;Arizona
	US-AR;Arkansas;Arkansas
	US-CA;California;[CK]aliforni[ae]
	US-CO;Colorado;[CK]olor[a]do
	US-CT;Connecticut;Connecticut
	US-DE;Delaware;Delaware
	US-FL;Florida;Florida
	US-GA;Georgia;Georgia.{1,5}US, state (of )?Georgia, Georgia
	US-HI;Hawaii;Hawaii
	US-ID;Idaho;Idaho
	US-IL;Illinois;Illinois
	US-IN;Indiana;Indiana
	US-IA;Iowa;Iowa
	US-KS;Kansas;Kansas
	US-KY;Kentucky;Kentucky
	US-LA;Louisiana;Louisiana
	US-ME;Maine;Maine
	US-MD;Maryland;Maryland
	US-MA;Massachusetts;Massachusetts
	US-MI;Michigan;Michigan
	US-MN;Minnesota;Minnesota
	US-MS;Mississippi;Mississippi
	US-MO;Missouri;Missouri
	US-MT;Montana;Montana
	US-NE;Nebraska;Nebraska
	US-NV;Nevada;Nevada
	US-NH;New Hampshire;New Hampshire
	US-NJ;New Jersey;New Jersey
	US-NM;New Mexico;New Mexico
	US-NY;New York;state (of )?New York, New York
	US-NC;North Carolina;North Carolina
	US-ND;North Dakota;North Dakota
	US-OH;Ohio;Ohio
	US-OK;Oklahoma;Oklahoma
	US-OR;Oregon;Oregon
	US-PA;Pennsylvania;Pennsylvania
	US-RI;Rhode Island;Rhode Island
	US-SC;South Carolina;South Carolina
	US-SD;South Dakota;South Dakota
	US-TN;Tennessee;Tennessee
	US-TX;Texas;Texas
	US-UT;Utah;Utah
	US-VT;Vermont;Vermont
	US-VA;Virginia;Virginia
	US-WA;Washington;Washington
	US-WV;West Virginia;West Virginia
	US-WI;Wisconsin;Wisconsin
	US-WY;Wyoming;Wyoming`);
}

function loadCities() {
  return processCSV(`country_iso_3166-1_alpha-2;country_name;city_name;string_match
  AF;Afghanistan;Kabul;K[a]b[uo]l, کابل
  US-AK;Alaska;Juneau;Juneau
  AL;Albania;Tirana;Tirana, Tiran[ë], Tirona
  DZ;Algeria;Algiers;Algiers, Alger, الجزائر
  DZ;Algeria;Oran;Oran, Wahr[ā]n, وهران
  AD;Andorra;Andorra la Vella;Andorra la (Vella|Vieja), Andorre la Vieille
  AO;Angola;Luanda;L[uo]anda
  AR;Argentina;Buenos Aires;Buenos Aires
  AR;Argentina;Córdoba;C[ó]rdoba
  AR;Argentina;Rosario;Rosario
  AR;Argentina;San Juan;San Juan
  US-AZ;Arizona;Phoenix;Phoenix
  US-AZ;Arizona;Scottsdale;Scottsdale.{1,5}(Arizona|AZ), Scottsdale
  US-AZ;Arizona;Tucson;Tucson
  US-AR;Arkansas;Austin;Austin.{1,5}(Arkansas|AR)
  US-AR;Arkansas;Little Rock;Little Rock
  US-AR;Arkansas;Portland;Portland.{1,5}(Arkansas|AR)
  AM;Armenia;Yerevan;Y?erevan, Երևան
  AU;Australia;Adelaide;Adelaide
  AU;Australia;Austin;Austin.{1,5}(Australia|AU)
  AU;Australia;Brisbane;Brisbane
  AU;Australia;Canberra;Canberra
  AU;Australia;Melbourne;Melbourne
  AU;Australia;Newcastle;Newcastle.{1,5}(Australia|AU|New South Wales)
  AU;Australia;Perth;Perth
  AU;Australia;Queensland;Queensland, QLD
  AU;Australia;Scottsdale;Scottsdale.{1,5}(Tasmania|TAS|Australia|AU|Reserve)
  AU;Australia;Sydney;Sydney
  AT;Austria;Graz;Graz
  AT;Austria;Innsbruck;Innsbruck
  AT;Austria;Linz;Linz, Linec
  AT;Austria;Salzburg;Salzburg, S[å]izburg
  AT;Austria;Vienna;Vídeň, Wien, Vienna
  AZ;Azerbaijan;Baku;Baku, Bak[ı]
  AZ;Azerbaijan;Stepanakert;Step'?anakert, Khankendi, Vararakn, Ստեփանակերտ
  BD;Bangladesh;Chittagong;Chittagong, Chottogram, Chatga, চট্টগ্রাম
  BD;Bangladesh;Dhaka;Dhaka, Dacca, ঢাকা
  BY;Belarus;Minsk;Minsk, Мінск, Минск, Менск
  BE;Belgium;Antwerp;Antwerp, Antwerpen, Anvers
  BE;Belgium;Brussels;Brussels?, Bruxelles
  BO;Bolivia;Santa Cruz de la Sierra;Santa Cruz( de la Sierra)?
  BA;Bosnia and Herzegovina;Sarajevo;Sarajevo, Сарајево
  BH;Bahrain;Manama;Man[a]ma, المنامة
  BR;Brazil;Belo Horizonte;Belo Horizonte
  BR;Brazil;Brazilia;Bra[sz][i]l(ia)?
  BR;Brazil;Campinas;Campinas
  BR;Brazil;Curitiba;Curitiba
  BR;Brazil;Florianópolis;Florian[ó]polis
  BR;Brazil;Fortaleza;Fortaleza
  BR;Brazil;Goiânia;Goi[â]nia
  BR;Brazil;Porto Alegre;Porto Alegre
  BR;Brazil;Recife;Recife
  BR;Brazil;Rio de Janeiro;Rio( de Janeiro)?
  BR;Brazil;São Paulo;S[ã]o Paulo
  BG;Bulgaria;Burgas;Burgas, Bourgas, Бургас
  BG;Bulgaria;Sofia;Sofiy?a, София
  BF;Burkina Faso;Ouagadougou;Ouagadougou
  US-CA;California;Beverly Hills;Beverly Hills
  US-CA;California;Huntington Beach;Huntington Beach
  US-CA;California;Los Angeles;Los [A]ngeles
  US-CA;California;Oakland;Oakland
  US-CA;California;Norwalk;Norwalk.{1,5}(California|CA)
  US-CA;California;Palm Springs;Palm Springs
  US-CA;California;Sacramento;Sacramento
  US-CA;California;San Diego;San Diego
  US-CA;California;San Francisco;San Francisco
  US-CA;California;San José;San Jos[e]
  US-CA;California;Santa Barbara;Santa Barbara
  US-CA;California;Santa Monica;Santa Monica
  KH;Cambodia;Siem Reap;Siem Reap, ក្រុងសៀមរាប
  KH;Cambodia;Phnom Penh;Phnom Penh, Krong Chaktomuk
  CM;Cameroon;Douala;Do?uala
  CM;Cameroon;Yaoundé;Yaound[é], Jaunde
  CA;Canada;Austin;Austin.{1,5}(Canada|CA|Manitoba|Ontarion|Quebec|Island)
  CA;Canada;Calgary;Calgary
  CA;Canada;Montréal;Montr[e]al
  CA;Canada;Ottawa;Ottawa
  CA;Canada;Portland;Portland.{1,5}(Canada|CA|Ontarion)
  CA;Canada;Portland Island;Portland Island
  CA;Canada;Portland Inlet;Portland Inlet
  CA;Canada;Toronto;Toronto
  CA;Canada;Vancouver;Vancouver
  CA;Canada;Winnipeg;Winnipeg
  CL;Chile;Santiago de Chile;Santiago( de Chile)?
  CN;China;Beijing;Beijing, Peking, 北京市
  CN;China;Changchun;Changchun, 长春市
  CN;China;Changsha;Changsha, Chángshā, 长沙市
  CN;China;Chaozhou;Chaozhou, Chiuchow, Chaochow, Teochew, 潮州市
  CN;China;Chengdu;Chengdu, Chengtu
  CN;China;Chongqing;Chongqing, Chungking, 重庆
  CN;China;Dalian;Dalian, 大连市
  CN;China;Dongguan;Dongguan, 东莞市
  CN;China;Foshan;Foshan, Fatshan, 佛山市
  CN;China;Fuzhou;Fuzhou, Foochow, 福州市
  CN;China;Guangzhou;Guangzhou, Canton, 广州市
  CN;China;Hangzhou;Hangzhou, Hangchow, 杭州市
  CN;China;Harbin;Harbin, 哈尔滨市
  CN;China;Hefei;Hefei, Luzhou, Luchow, Ho-fei, Liu-tcheou, 合肥市
  CN;China;Jinan;Jinan, Tsinan
  CN;China;Lanzhou;Lanzhou, 兰州市
  CN;China;Nanjing;Nanjing, Nanking, Nankin, 南京市
  CN;China;Ningbo;Ning[bp]o, 宁波市
  CN;China;Qingdao;Qingdao, Tsingtao, 青岛市
  CN;China;Quanzhou;Quanzhou, Chinchew, 泉州市
  CN;China;Shanghai;Shanghai, 上海
  CN;China;Shantou;Shantou, Swatow, 汕头市
  CN;China;Shenyang;Shenyang, Mukden, Fengtian, 沈阳市
  CN;China;Shenzhen;Shenzhen, 深圳市
  CN;China;Shijiazhuang;Shijiazhuang, 石家庄市
  CN;China;Suzhou;Suzhou, Soochow, 苏州市
  CN;China;Tainan;Tainan City, 臺南市
  CN;China;Tangshan;Tangshan, Tángshān, 唐山市
  CN;China;Tianjin;Tianjin, Tientsin, 天津市
  CN;China;Tianjin;Tianjin, Tientsin, 天津市
  CN;China;Wenzhou;Wenzhou, 温州市
  CN;China;Wuhan;Wuhan, 武汉市
  CN;China;Xi'an;Xi'?an, 西安市
  CN;China;Xiamen;Xiamen, Amoy, 厦门市
  CN;China;Zhengzhou;Zhengzhou, 郑州市
  CN;China;Zhongshan;Zhongshan, 中山市
  CN;China;Zhuhai;Zhuhai, 珠海市
  CN;China;Zunyi;Zunyi, 遵义市
  CO;Colombia;Barranquilla;Barranquilla
  CO;Colombia;Bogotá;Bogot[á]
  CO;Colombia;Cali;(Santiago de )?Cali
  CO;Colombia;Medellín;Medell[i]n
  US-CO;Colorado;Aspen;Aspen
  US-CO;Colorado;Austin;Austin.{1,5}(Colorado|CO)
  US-CO;Colorado;Denver;Denver
  US-CO;Colorado;Portland;Portland.{1,5}(Colorado|CO)
  US-CT;Connecticut;Hartford;Hartford
  US-CT;Connecticut;Norwalk;Norwalk.{1,5}(Connecticut|CT)
  US-CT;Connecticut;Portland;Portland.{1,5}(Connecticut|CT)
  HR;Croatia;Zagreb;Zagreb
  CU;Cuba;Havana;Havana, La Habana
  CY;Cyprus;Nicosia;Nicosia, Λευκωσία, Lefkoşa
  CZ;Czech Republic;Brno;Brno
  CZ;Czech Republic;Karlovy Vary;Karlovy Vary
  CZ;Czech Republic;Liberec;Liberec
  CZ;Czech Republic;Olomouc;Olomouc[ei]?
  CZ;Czech Republic;Ostrava;Ostrav[aey]
  CZ;Czech Republic;Pilsen;Pi?l[sz]e[n]
  CZ;Czech Republic;Prague;Prague, Pra(ha|hy|ze), Prag
  DO;Dominican Republic;Punta Cana;
  DK;Denmark;Copenhagen;Copenhagen, København, Hafnia
  DK;Denmark;Nuuk;Nuuk, Godth[å]b
  EC;Ecuador;Guayaquil;Santiago de Guayaquil, Guayaquil
  EC;Ecuador;Quito;Quito
  EG;Egypt;Alexandria;Alexandria, الإسكندرية
  EG;Egypt;Cairo;Cairo, Kahire, K[a]hir, Al-Qāhiraha, القاهرة
  EG;Egypt;Giza;G[i]zah?, الجيزة
  EG;Egypt;Sharm El Sheikh;Sharm El Sheikh, شرم الشيخ
  SV;El Salvador;San Salvador;San Salv[a]dor, El Salv[a]dor
  GB-ENG;England;Birmingham;Birmingham
  GB-ENG;England;Bradford;Bradford
  GB-ENG;England;Brighton;Brighton
  GB-ENG;England;Bristol;Bristol
  GB-ENG;England;Cambridge;Cambridge
  GB-ENG;England;Canterbury;Canterbury
  GB-ENG;England;Chelmsford;Chelmsford
  GB-ENG;England;Coventry;Coventry
  GB-ENG;England;Dover;Dover
  GB-ENG;England;Gloucester;Gloucester
  GB-ENG;England;Isle of Portland;Isle of Portland
  GB-ENG;England;Leeds;Leeds
  GB-ENG;England;Leicester;Leicester
  GB-ENG;England;Liverpool;Liverpool
  GB-ENG;England;London;London
  GB-ENG;England;Luton;Luton
  GB-ENG;England;Manchester;Manchester
  GB-ENG;England;Newcastle;Newcastle.{1,5}(England|ENG|GB|upon Tyne)
  GB-ENG;England;Northampton;Northampton
  GB-ENG;England;Norwich;Norwich
  GB-ENG;England;Nottingham;Nottingham
  GB-ENG;England;Oxford;Oxford
  GB-ENG;England;Peterborough;Peterborough
  GB-ENG;England;Plymouth;Plymouth
  GB-ENG;England;Portsmouth;Portsmouth
  GB-ENG;England;Sheffield;Sheffield
  GB-ENG;England;Southampton;Southampton
  GB-ENG;England;Wolverhampton;Wolverhampton
  EE;Estonia;Tallinn;Tallinn
  ET;Ethiopia;Addis Ababa;Addis Ab[a]ba, Addis Abeba, Finfinne, አዲስ አበባ
  FI;Finland;Helsinki;Helsinki, Helsingfors, Helsingin
  US-FL;Florida;Jacksonville;Jacksonville
  US-FL;Florida;Miami;Miami
  US-FL;Florida;Orlando;Orlando
  US-FL;Florida;Palm Beach;Palm Beach
  US-FL;Florida;Tallahassee;Tallahassee
  US-FL;Florida;Tampa;Tampa
  FR;France;Bordeaux;Bordeaux
  FR;France;Calais;Calais, Calés, Kales
  FR;France;Cannes;Cannes, Canas
  FR;France;Le Havre;Le Havre
  FR;France;Le Mans;Le Mans
  FR;France;Lyon;Li?yon
  FR;France;Marne-La-Vallée;Marne-La-Vallée
  FR;France;Marseille;Marseille, Marselha
  FR;France;Montpellier;Montpellier
  FR;France;Nantes;Nantes,Na(un)?ntt?
  FR;France;Paris;Paris
  FR;France;Rennes;Rennes, Roazhon
  FR;France;Rouen;Rouen, Rodomo, Rotomagus
  FR;France;Saint Tropez;(St|Sai?nt?) Trou?p[e]z
  FR;France;Strasbourg;Strasbourg, Strossburi, Stra(ß|ss)burg
  FR;France;Toulouse;Toulouse, Tolosa
  FR;France;Vaucluse;Vauclus[ea]
  FR;France;Verdun;Verdun
  FR;France;Versailles;Versailles
  US-GA;Georgia;Atlanta;Atlanta
  GE;Georgia;Sukhumi;Sukhumi, Akwa, Sokhumi, Аҟәа, სოხუმი
  GE;Georgia;Tbilisi;Tbilisi, Tiflis, თბილისი
  GE;Georgia;Tskhinvali;Tskhinvali, ცხინვალი, Цхинвал(и)
  DE;Germany;Dortmund;Dortmund, D[ü][ö]rpm
  DE;Germany;Berlin;Berl[i]n
  DE;Germany;Cologne;Cologne, K[ö]ln, K[ö]lle
  DE;Germany;Dresden;Dresden, Drezno, Drážďany
  DE;Germany;Frankfurt;Frankfurt( am Main)?
  DE;Germany;Hamburg;Hambur[gk]
  DE;Germany;Hanover;Hann?over
  DE;Germany;Munich;Munich, M[ü]nchen, Mnichov, Minga
  DE;Germany;Stuttgart;Stuttgart, Schduagert
  GH;Ghana;Accra;Accra
  GR;Greece;Athens;Athens, Athína, Αθήνα
  GT;Guatemala;Guatemala City;Guatemala City, Ciudad de Guatemala, Guate
  US-HI;Hawaii;Honolulu;Honolulu
  VA;Holy See (Vatican City State);Vatican City;Holy See, Vatican City, Civitas Vaticana, Citt[à] del Vaticano, Vati[ck][a]n, Vatikanstadt
  HK;Hong Kong;Hong Kong;Hong Kong, 香港
  HU;Hungary;Algyő;Algy[ő]
  HU;Hungary;Budapest;Budapest
  HU;Hungary;Bükkszentlászló;B[ü]kkszentl[á]szl[ó]
  HU;Hungary;Debrecen;Debrecen
  HU;Hungary;Miskolc;Miskolc, Mischkolz, Miškovec, Mi[ș]col[ț]
  IS;Iceland;Akureyri;Akureyri, Akureyrarkaupstaður
  IS;Iceland;Keflavík;Keflav[í]k
  IS;Iceland;Kópavogur;Kópavogur, Kópavogsbær
  IS;Iceland;Reykjavík;Reykjav[í]k
  US-ID;Idaho;Boise;Boise
  US-IL;Illinois;Austin;Austin.{1,5}(Illinois|IL)
  US-IL;Illinois;Chicago;Chicago
  IN;India;Ahmedabad;Ahmedabad, Amdavad, Karnavati, अहमदआबाद
  IN;India;Bengaluru;Bengaluru, Bangalore
  IN;India;Bhopal;Bhopal
  IN;India;Chennai;Chennai, Madras
  IN;India;Delhi;Delh[i], Dill[i]
  IN;India;Hyderabad;Hyderabad
  IN;India;Jaipur;Jaipur
  IN;India;Kanpur;Kanpur, Cawnpore
  IN;India;Kochi;Kochi, Cochin
  IN;India;Kolkata;Kolkata, Calcutta
  IN;India;Lucknow;Lucknow
  IN;India;Mumbai;Mumbai, Bombay
  IN;India;Nagpur;Nagpur
  IN;India;New Delhi;New Delh[i]
  IN;India;Patna;Patna
  IN;India;Pune;Pune, Poona
  IN;India;Surat;Surat, Suryapur
  IN;India;Vadodara;Vadodara, Baroda
  IN;India;Vijayawada;Vijayawada, Bejjamwada, Bezawada, Rajendracholapuram, Vijayavatika
  IN;India;Visakhapatnam;Visakhapatnam, Vizag, Vizagapatam, Waltair
  US-IN;Indiana;Austin;Austin.{1,5}(Indiana|IN)
  US-IN;Indiana;Indianapolis;Indianapolis
  ID;Indonesia;Bandung;Bandung, Stad Bandoeng, Kota Bandung
  ID;Indonesia;Bekasi;(Kota )?Bekasi
  ID;Indonesia;Bogor;Bogor, Buitenzorg
  ID;Indonesia;Denpasar;Denpasar
  ID;Indonesia;Jakarta;Jakarta
  ID;Indonesia;Makassar;Ma[kc]assar
  ID;Indonesia;Malang;Malang
  ID;Indonesia;Medan;Medan
  ID;Indonesia;Palembang;Palembang
  ID;Indonesia;Semarang;S[ea]marang
  ID;Indonesia;Surabaya;Surabaya, Soeraba[ij]a
  US-IA;Iowa;Des Moines;Des Moines
  US-IA;Iowa;Norwalk;Norwalk.{1,5}(Iowa|IA)
  IR;Iran;Isfahan;[IE]sfahan, Esfah[ā]n, Ispahan, اصفهان
  IR;Iran;Karaj;Karaj, کرج
  IR;Iran;Mashhad;Mashhad, Mašhad
  IR;Iran;Shiraz;Shiraz, شیراز
  IR;Iran;Tabriz;Tabriz, T[ə]briz, تبریز
  IR;Iran;Tehran;Tehr[a]n, تهران
  IQ;Iraq;Baghdad;Baghdad, Bagd[a]d, بغداد
  IQ;Iraq;Basra;Basra, al-Baṣrah, البصرة
  IQ;Iraq;Mosul;M[ou]sul, الموصل
  IE;Ireland;Belfast;Belfast, Béal Feirste
  IE;Ireland;Dublin;Dublin, Baile Átha Cliath
  IL;Israel;Jerusalem;Jerusalem, Yerushalayim, ירושלים, القُدس
  IL;Israel;Nazareth;Nazareth, Natzrat, נָצְרַת‎, النَّاصِرَة
  IL;Israel;Tel Aviv;Tel Aviv, תל אביב-יפו, تل أَبيب-يافا
  IT;Italy;Florence;Florence, Firenze, Florencie
  IT;Italy;Genoa;Genov?a, Genua
  IT;Italy;Milan;Mil[aá]no?
  IT;Italy;Naples;Naples, Napoli, Napule
  IT;Italy;Rome;R[o]m[ea]
  IT;Italy;Turin;Turin, (Città di )?Torino
  IT;Italy;Palermo;(Città di )?Palerm[ou]
  IT;Italy;Venice;Venice, Vene[zs]ia
  CI;Ivory Coast;Abidjan;Abidjan
  JP;Japan;Fukuoka;Fukuoka, Fukuoka-shi, 福岡市
  JP;Japan;Hiroshima;Hiroshima, 広島市
  JP;Japan;Kawasaki;Kawasaki, Kawasaki-shi, 川崎市
  JP;Japan;Kobe;Kobe, Kōbe-shi, 神戸市
  JP;Japan;Kyoto;Ky[o]to, 京都市
  JP;Japan;Nagoya;Nagoya, 名古屋
  JP;Japan;Osaka;[Ō]saka(-shi)?, 大阪市
  JP;Japan;Saitama;Saitama, Saitama-shi, さいたま市
  JP;Japan;Sapporo;Sapporo, 札幌市
  JP;Japan;Tokyo;Tokyo( Metropolis)?, 東京都
  JP;Japan;Yokohama;Yokohama, 横浜市
  JO;Jordan;Amman;Amman, عمّان
  US-KS;Kansas;Topeka;Topeka
  KZ;Kazakhstan;Almaty;Almaty, Alma Ata Алматы, Almatı
  KZ;Kazakhstan;Astana;Astana
  US-KY;Kentucky;Austin;Austin.{1,5}(Kentucky|KY)
  US-KY;Kentucky;Lexington;Lexington(.{1,5}(Kentucky|KY))?
  US-KY;Kentucky;Louisville;Louisville(.{1,5}(Kentucky|KY))?
  KE;Kenya;Nairobi;Nairobi
  XK;Kosovo;Pristina;Pristina, Prishtina, Prishtinë, Приштина, Priština, Prishtina
  LV;Latvia;Riga;R[i]ga
  LB;Lebanon;Beirut;Beir[u]t, Bayr[ū]t, Beyrouth
  LY;Libya;Tripoli;Tripoli, Ṭar[ā]bulus, طرابلس
  LI;Liechtenstein;Vaduz;Vaduz
  LT;Lithuania;Vilnius;Vilnius
  US-LA;Louisiana;Baton Rouge;B[a]ton Rouge
  US-LA;Louisiana;New Orleans;New Orleans, La Nouvelle Orl[é]ans
  LU;Luxembourg;Luxembourg;Luxembourg, Lëtzebuerg, Luxemburg
  MK;Macedonia;Skopje;Skopje, Скопје
  US-ME;Maine;Portland;Portland.{1,5}(Maine|ME)
  MY;Malaysia;Kota Kinabalu;Kota Kinabalu, Jesselton, کوتا کينابالو, 亚庇, 亞庇
  MY;Malaysia;Kuala Lumpur;Kuala Lumpur
  MT;Malta;Valletta;Valletta
  US-MD;Maryland;Annapolis;Annapolis
  US-MD;Maryland;Baltimore;Baltimore
  US-MA;Massachusetts;Boston;Boston
  MX;Mexico;Cancún;Cancún
  MX;Mexico;Guadalajara;Guadalajara
  MX;Mexico;Mexico City;M[e]xi[ck]o City, City of M[e]xi[ck]o, Ciudad de México, CDMX
  MX;Mexico;Monterrey;Monterrey
  MX;Mexico;Playa del Carmen;Playa del Carmen.{1,5}MX
  MX;Mexico;Tijuana;Tijuana
  US-MI;Michigan;Detroit;Detroit
  US-MI;Michigan;Lansing;Lansing
  US-MI;Michigan;Norwalk;Norwalk.{1,5}(Michigan|MI)
  US-MN;Minnesota;Austin;Austin.{1,5}(Minnesota|MN)
  US-MN;Minnesota;Minneapolis;Minneapolis
  US-MN;Minnesota;Saint Paul;Saint Paul
  US-MO;Missouri;Austin;Austin.{1,5}(Missoury|MO)
  US-MO;Missouri;Jefferson City;Jefferson City
  US-MO;Missouri;Kansas City;Kansas City
  US-MO;Missouri;St. Louis;(City of )?St. Louis
  MD;Moldova;Kishinev;Kishinev, Chi[ș]in[ă]u, Kishinyov, Кишинёв
  MD;Moldova;Tiraspol;Tiraspol, Тирасполь, Тираспіль
  MC;Monaco;Monaco;Monaco
  ME;Montenegro;Podgorica;Podgorica, Titograd, Подгорица, Титоград
  MA;Morocco;Casablanca;Casablanca, Kaẓa, الدار البيضاء
  MA;Morocco;Marrakech;Marrakech, Murrākuš
  MZ;Mozambique;Maputo;Maputo, Louren[ç]o Marques
  MM;Myanmar;Mandalay;Mandalay
  MM;Myanmar;Yangon;Yangon, Rangoon, ရန်ကုန်
  NP;Nepal;Kathmandu;Kathmandu, काठमाडौं
  NL;Netherlands;Amsterdam;Amsterdam
  NL;Netherlands;Hague;(The )?Hague, (Den )?Haag
  NL;Netherlands;Eindhoven;Eindhoven
  NL;Netherlands;Rotterdam;Rotterdam
  US-NV;Nevada;Austin;Austin.{1,5}(Nevada|NV)
  US-NV;Nevada;Carson City;Carson City
  US-NV;Nevada;Las Vegas;(Las )?Vegas
  US-NJ;New Jersey;Atlantic City;Atlantic City
  US-NM;New Mexico;Santa Fe;Santa F[eé]
  US-NY;New York;Bronx;Bronx
  US-NY;New York;Brooklyn;Brooklyn
  US-NY;New York;Manhattan;Manhattan
  US-NY;New York;Manhattan;Manhattan
  US-NY;New York;New York City;New York City, City (of )?New York, New York, New York.{1,5}(New York|NY), NYC
  US-NY;New York;Queens;Queens
  US-NY;New York;Staten Island;Staten Island
  NZ;New Zealand;Auckland;Auckland, T[ā]maki makau rau
  NZ;New Zealand;Portland;Portland.{1,5}(New Zealand|NZ)
  NI;Nicaragua;Managua;Managua
  NG;Nigeria;Abuja;Abuja
  NG;Nigeria;Ibadan;[I]b[a]d[a]n
  NG;Nigeria;Kano;Kano
  NG;Nigeria;Lagos;Lagos, Èkó
  US-NC;North Carolina;Raleigh;Raleigh
  KP;North Korea;Pyongyang;Pyongyang, 평양시
  NO;Norway;Oslo;Oslo
  US-OH;Ohio;Austin;Austin.{1,5}(Ohio|OH)
  US-OH;Ohio;Cincinnati;Cincinnati
  US-OH;Ohio;Cleveland;Cleveland
  US-OH;Ohio;Dayton;Dayton(.{1,5}(Ohio|OH))?
  US-OH;Ohio;Norwalk;Norwalk.{1,5}(Ohio|OH)
  US-OK;Oklahoma;Oklahoma City;Oklahoma City
  US-OK;Oklahoma;Tulsa;Tulsa
  OM;Oman;Muscat;Muscat, Masqa[ṭ], مسقط
  US-OR;Oregon;Austin;Austin.{1,5}(Oregon|OR)
  US-OR;Oregon;Portland;Portland.{1,5}(Oregon|OR), Portland
  PK;Pakistan;Faisalabad;Faisalabad, Lyallpur, فیصل آباد‎
  PK;Pakistan;Gujranwala;Gujranwala, گوجرانوالا‎
  PK;Pakistan;Islamabad;Isl[a]m[a]b[a]d, اسلام آباد‎
  PK;Pakistan;Karachi;Karachi, Karācī, ڪراچي‎
  PK;Pakistan;Lahore;Lahore, لہور‎, لاہور‎
  PK;Pakistan;Peshawar;Peshawar, پېښور ,پشاور ,پشور
  PK;Pakistan;Rawalpindi;Rawalpindi, Pindi, راولپنڈی, پنڈی‎
  PS;Palestine;Bethlehem;Bethlehem, Bei?t L[ae]he?m, בֵּית לֶחֶם‎, بيت لحم
  US-PA;Pennsylvania;Harrisburg;Harrisburg, Harrisbarrig
  US-PA;Pennsylvania;Philadelphia;Philadelphia, Pennsylvania
  US-PA;Pennsylvania;Pittsburgh;Pittsburgh
  PE;Peru;Cusco;Cu[sz]co
  PE;Peru;Lima;Lima
  PH;Philippines;Caloocan;Caloocan City
  PH;Philippines;Davao City;Davao City, Dakbayan sa Dabaw, Lungsod ng Dabaw
  PH;Philippines;Manila;Manila, Maynilà
  PH;Philippines;Quezon City;Quezon City, Lungsod Quezon, Ciudad Quezón, Kyusi
  PL;Poland;Gdańsk;Gda[ń]sk, Danzig
  PL;Poland;Kraków;Krak[o]w, Cracow
  PL;Poland;Łódź;[Ł][ó]d[ź]h?
  PL;Poland;Poznań;Pozna[ń], Posen
  PL;Poland;Warsaw;Warsaw, Warszawa
  PL;Poland;Wrocław;Wroc[ł]aw, Breslau, Vratislav
  PT;Portugal;Amadora;Amadora, Porcalhota
  PT;Portugal;Braga;Braga
  PT;Portugal;Coimbra;Coimbra
  PT;Portugal;Lisbon;Lisbo[na]
  PT;Portugal;Porto;O?porto
  PT;Portugal;Setúbal;Setúbal
  QA;Qatar;Doha;Doha, الدوحة‎, ad-Dawḥa
  RO;Romania;Bucharest;Bucharest, Bucure[ș]ti
  RO;Romania;Cluj-Napoca;Cluj(-Napoca)?
  RO;Romania;Vrancea;Vrancea
  RU;Russia;Chelyabinsk;Chelyabinsk, Челя́бинск
  RU;Russia;Krasnodar;Krasnodar, Краснода́р
  RU;Russia;Moscow;Moscow, Moskva, Moskau, Москва́
  RU;Russia;Nizhny Novgorod;Nizhny Novgorod, Ни́жний Но́вгород, Gorky, Горький
  RU;Russia;Novosibirsk;Novosibirsk, Новосибирск
  RU;Russia;Omsk;Omsk, Омск
  RU;Russia;Rostov;Rostov, Rostofa, Ростов
  RU;Russia;Rostov on Don;Rostov on Don, Rostov na Donu, Ростов на Дону
  RU;Russia;Saint Petersburg;Saint Petersburg, Sankt Peterburg, Санкт-Петербу́рг
  RU;Russia;Sochi;Sochi, Сочи
  RU;Russia;Yekaterinburg;Yekaterinburg, Ekaterinburg, Екатеринбу́рг
  SM;San Marino;San Marino;San Marino
  SA;Saudi Arabia;Al Khobar;(Al )?Khobar
  SA;Saudi Arabia;Dammam;Damm[a]m, الدمام
  SA;Saudi Arabia;Jeddah;J[ei]ddah?, جدة‎‎
  SA;Saudi Arabia;Mecca;Mecca, [MB]akkah, مكة المكرمة
  SA;Saudi Arabia;Riyadh;Riyadh, الرياض
  GB-SCT;Scotland;Edinburgh;Edinburgh, Dùn Èideann
  GB-SCT;Scotland;Glasgow;Glasgow, Glesga, Glaschu
  SN;Senegal;Dakar;Dakar
  RS;Serbia;Belgrade;Belgrade, Beograd, Београд
  SG;Singapore;Singapore;Singapore
  SK;Slovakia;Bratislava;Bratislava, Pre(ß|ss)burg, Pozsony
  SI;Slovenia;Ljubljana;Ljubljana
  ZA;South Africa;Cape Town;Cape Town, Kaapstad, iKapa
  ZA;South Africa;Durban;Durban, eThekwini
  ZA;South Africa;Ekurhuleni;Ekurhuleni
  ZA;South Africa;Johannesburg;Johannesburg, Joburg, Egoli
  KR;South Korea;Busan;[BP]usan, 부산시
  KR;South Korea;Daegu;[DT]aegu
  KR;South Korea;Daejeon;Daejeon, 대전시
  KR;South Korea;Incheon;Incheon, Inchŏn, 인천시
  KR;South Korea;Kwangju;Kwangju, 광주시
  KR;South Korea;Seoul;Seoul, 서울市
  KR;South Korea;Ulsan;Ulsan, 울산시
  ES;Spain;Barcelona;Barcell?ona
  ES;Spain;Granada;Granada
  ES;Spain;Madrid;Madrid
  ES;Spain;Málaga;M[á]laga
  ES;Spain;Murcia;Murcia
  ES;Spain;Seville;Sevill[ea]
  ES;Spain;Valencia;Val[e]ncia
  ES;Spain;Zaragoza;Zaragoza, Saragossa
  SD;Sudan;Khartoum;Khartoum, al-Kharṭūm, الخرطوم
  SE;Sweden;Gothenburg;Gothenburg, G[ö]teborg
  SE;Sweden;Stockholm;Stockholm
  CH;Switzerland;Bern;Bern[ea], Bernese, Bärn
  CH;Switzerland;Geneva;Geneva, Genèv[ea], Genf, G[ie]nevra, Ženeva
  CH;Switzerland;Zürich;Z[ü]rich
  SY;Syria;Damascus;Damascus, Dimashq, دمشق
  TW;Taiwan;Kaohsiung;Kaohsiung City, Takao, Takow, Takau, 高雄市
  TW;Taiwan;New Taipei City;New Taipei City, 新北市
  TW;Taiwan;Taichung;Taichung City, Táizhōng Shì, 臺中市
  TW;Taiwan;Taipei City;Taipei City, Taipeh-fu, Taihoku
  TZ;Tanzania;Dar es Salaam;D[a]r [ea]s Sal[a]a?m, Mzizima
  US-TN;Tennessee;Memphis;Memphis
  US-TN;Tennessee;Nashville;Nashville
  US-TX;Texas;Austin;Austin.{1,5}(Texas|TX), Austin
  US-TX;Texas;Dallas;Dallas
  US-TX;Texas;El Paso;El Paso
  US-TX;Texas;Houston;Houston
  US-TX;Texas;San Antonio;San Antonio
  TH;Thailand;Bangkok;Bangkok, Krung Thep, กรุงเทพมหานคร
  TH;Thailand;Chiang Mai;Chiang Mai, Chiengmai, Chiangmai, เชียงใหม่
  TH;Thailand;Pattaya;Ph?atth?aya, พัทยา
  TH;Thailand;Phuket;Phuket, Talang, Tanjung Salang, ภูเก็ต
  CD;The Democratic Republic of the Congo;Brazzaville;Brazzaville
  CD;The Democratic Republic of the Congo;Kinshasa;Kinshasa, Ville de Kinshasa, Léopoldville, Leopoldstad
  TN;Tunisia;Djerba;Djerba, Jerba, Jarbah
  TN;Tunisia;Tunis;Tunis, تونس
  TR;Turkey;Ankara;Ankara, Ancyra
  TR;Turkey;Edirne;Edirne
  TR;Turkey;Istanbul;[I]stanbul, Constantinople, Byzantium
  TR;Turkey;İzmir;[İ]zmir
  UG;Uganda;Kampala;Kampala
  UA;Ukraine;Kharkiv;Khark[io]v, Ха́рків, Ха́рьков
  UA;Ukraine;Kiev;K[iy]ev, Kyiv, Kyjev, Київ, Киев
  UA;Ukraine;Odessa;Odess?a, Одесс?а
  AE;United Arab Emirates;Abu Dhabi;Ab[u] Dh?ab[i], أبوظبي
  AE;United Arab Emirates;Dubai;Dubai, Dubayy, دبي
  AE;United Arab Emirates;Ras Al Khaimah;Ra'?s Al Kha[iy]mah
  UY;Uruguay;Montevideo;Montevideo
  US-UT;Utah;Salt Lake City;Salt Lake City
  UZ;Uzbekistan;Tashkent;T[ao]shkent, Ta[š]kent, Тошкент
  VE;Venezuela;Caracas;Santiago de León de Caracas, Caracas
  VE;Venezuela;Maracaibo;Maracaibo
  VN;Vietnam;Hanoi;Hanoi, H[à] N[ộ]i
  VN;Vietnam;Ho Chi Minh City;Ho Chi Minh City, Thành phố Hồ Chí Minh, Saig[o]n, S[à]i G[ò]n
  VN;Vietnam;Saigon;Saigon, S[à]i G[ò]n
  US-VA;Virginia;Virginia Beach;Virginia Beach
  GB-WLS;Wales;Cardiff;Cardiff, Caerdydd
  US-WA;Washington;Seatle;Seatle
  US-WA;Washington;Washington;Washington
  US-WI;Wisconsin;Milwaukee;Milwaukee
  US-WI;Wisconsin;Norwalk;Norwalk.{1,5}(Wisconsin|WI)
  YE;Yemen;Sana'a;Sana'?a, صٓنْعٓاء
  ZM;Zambia;Lusaka;Lusaka, Mwalusaka
  ZW;Zimbabwe;Bulawayo;Bulawayo, koBulawayo
  ZW;Zimbabwe;Harare;Harare, Salisbury`);
}

function cleanFromSpecials(str) {
  str = str.replace(SPECIAL_CHARS_REG, " ");
  str = str.trim();
  return str;
}

module.exports.loadCoutries = loadCoutries;
module.exports.loadCities = loadCities;
module.exports.cleanFromSpecials = cleanFromSpecials;
