// 全球城市数据 - 精简去重版（含智能分层）
// tier: 1=全球一线, 2=区域二线, 3=中国三线, 4=中国四线, 5=中国五线(东北边城)
const C = [
    // ========== 全球 Tier 1（一线城市） ==========
    // 中国
    {n:"北京",ne:"Beijing",c:"CN",la:39.9042,lo:116.4074,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"上海",ne:"Shanghai",c:"CN",la:31.2304,lo:121.4737,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"广州",ne:"Guangzhou",c:"CN",la:23.1291,lo:113.2644,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"深圳",ne:"Shenzhen",c:"CN",la:22.5431,lo:114.0579,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"香港",ne:"Hong Kong",c:"HK",la:22.3193,lo:114.1694,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"台北",ne:"Taipei",c:"TW",la:25.0330,lo:121.5654,lang:"zh-CN",greeting:"你好",tier:1},
    {n:"澳门",ne:"Macau",c:"MO",la:22.1987,lo:113.5439,lang:"zh-CN",greeting:"你好",tier:1},

    // 日本
    {n:"东京",ne:"Tokyo",c:"JP",la:35.6762,lo:139.6503,lang:"ja-JP",greeting:"こんにちは",tier:1},
    {n:"大阪",ne:"Osaka",c:"JP",la:34.6937,lo:135.5023,lang:"ja-JP",greeting:"こんにちは",tier:1},
    {n:"京都",ne:"Kyoto",c:"JP",la:35.0116,lo:135.7681,lang:"ja-JP",greeting:"こんにちは",tier:1},
    {n:"横滨",ne:"Yokohama",c:"JP",la:35.4437,lo:139.6380,lang:"ja-JP",greeting:"こんにちは",tier:1},
    {n:"首尔",ne:"Seoul",c:"KR",la:37.5665,lo:126.9780,lang:"ko-KR",greeting:"안녕하세요",tier:1},

    // 美国
    {n:"纽约",ne:"New York",c:"US",la:40.7128,lo:-74.0060,lang:"en-US",greeting:"Hello",tier:1},
    {n:"洛杉矶",ne:"Los Angeles",c:"US",la:34.0522,lo:-118.2437,lang:"en-US",greeting:"Hello",tier:1},
    {n:"芝加哥",ne:"Chicago",c:"US",la:41.8781,lo:-87.6298,lang:"en-US",greeting:"Hello",tier:1},
    {n:"旧金山",ne:"San Francisco",c:"US",la:37.7749,lo:-122.4194,lang:"en-US",greeting:"Hello",tier:1},
    {n:"西雅图",ne:"Seattle",c:"US",la:47.6062,lo:-122.3321,lang:"en-US",greeting:"Hello",tier:1},
    {n:"波士顿",ne:"Boston",c:"US",la:42.3601,lo:-71.0589,lang:"en-US",greeting:"Hello",tier:1},
    {n:"华盛顿",ne:"Washington D.C.",c:"US",la:38.9072,lo:-77.0369,lang:"en-US",greeting:"Hello",tier:1},
    {n:"迈阿密",ne:"Miami",c:"US",la:25.7617,lo:-80.1918,lang:"en-US",greeting:"Hello",tier:1},
    {n:"拉斯维加斯",ne:"Las Vegas",c:"US",la:36.1699,lo:-115.1398,lang:"en-US",greeting:"Hello",tier:1},

    // 英国
    {n:"伦敦",ne:"London",c:"GB",la:51.5074,lo:-0.1278,lang:"en-GB",greeting:"Hello",tier:1},
    {n:"曼彻斯特",ne:"Manchester",c:"GB",la:53.4808,lo:-2.2426,lang:"en-GB",greeting:"Hello",tier:1},
    {n:"爱丁堡",ne:"Edinburgh",c:"GB",la:55.9533,lo:-3.1883,lang:"en-GB",greeting:"Hello",tier:1},

    // 法国
    {n:"巴黎",ne:"Paris",c:"FR",la:48.8566,lo:2.3522,lang:"fr-FR",greeting:"Bonjour",tier:1},
    {n:"马赛",ne:"Marseille",c:"FR",la:43.2965,lo:5.3698,lang:"fr-FR",greeting:"Bonjour",tier:1},
    {n:"里昂",ne:"Lyon",c:"FR",la:45.7640,lo:4.8357,lang:"fr-FR",greeting:"Bonjour",tier:1},

    // 德国
    {n:"柏林",ne:"Berlin",c:"DE",la:52.5200,lo:13.4050,lang:"de-DE",greeting:"Hallo",tier:1},
    {n:"慕尼黑",ne:"Munich",c:"DE",la:48.1351,lo:11.5820,lang:"de-DE",greeting:"Hallo",tier:1},
    {n:"法兰克福",ne:"Frankfurt",c:"DE",la:50.1109,lo:8.6821,lang:"de-DE",greeting:"Hallo",tier:1},
    {n:"汉堡",ne:"Hamburg",c:"DE",la:53.5511,lo:9.9937,lang:"de-DE",greeting:"Hallo",tier:1},

    // 意大利
    {n:"罗马",ne:"Rome",c:"IT",la:41.9028,lo:12.4964,lang:"it-IT",greeting:"Ciao",tier:1},
    {n:"米兰",ne:"Milan",c:"IT",la:45.4642,lo:9.1900,lang:"it-IT",greeting:"Ciao",tier:1},
    {n:"威尼斯",ne:"Venice",c:"IT",la:45.4408,lo:12.3155,lang:"it-IT",greeting:"Ciao",tier:1},
    {n:"佛罗伦萨",ne:"Florence",c:"IT",la:43.7696,lo:11.2558,lang:"it-IT",greeting:"Ciao",tier:1},

    // 西班牙
    {n:"马德里",ne:"Madrid",c:"ES",la:40.4168,lo:-3.7038,lang:"es-ES",greeting:"Hola",tier:1},
    {n:"巴塞罗那",ne:"Barcelona",c:"ES",la:41.3851,lo:2.1734,lang:"es-ES",greeting:"Hola",tier:1},

    // 其他欧洲
    {n:"阿姆斯特丹",ne:"Amsterdam",c:"NL",la:52.3676,lo:4.9041,lang:"nl-NL",greeting:"Hallo",tier:1},
    {n:"维也纳",ne:"Vienna",c:"AT",la:48.2082,lo:16.3738,lang:"de-AT",greeting:"Hallo",tier:1},
    {n:"苏黎世",ne:"Zurich",c:"CH",la:47.3769,lo:8.5417,lang:"de-CH",greeting:"Gruezi",tier:1},
    {n:"布鲁塞尔",ne:"Brussels",c:"BE",la:50.8503,lo:4.3517,lang:"fr-BE",greeting:"Bonjour",tier:1},
    {n:"斯德哥尔摩",ne:"Stockholm",c:"SE",la:59.3293,lo:18.0686,lang:"sv-SE",greeting:"Hej",tier:1},
    {n:"哥本哈根",ne:"Copenhagen",c:"DK",la:55.6761,lo:12.5683,lang:"da-DK",greeting:"Hej",tier:1},
    {n:"奥斯陆",ne:"Oslo",c:"NO",la:59.9139,lo:10.7522,lang:"no-NO",greeting:"Hei",tier:1},
    {n:"赫尔辛基",ne:"Helsinki",c:"FI",la:60.1699,lo:24.9384,lang:"fi-FI",greeting:"Hei",tier:1},
    {n:"莫斯科",ne:"Moscow",c:"RU",la:55.7558,lo:37.6173,lang:"ru-RU",greeting:"Привет",tier:1},
    {n:"圣彼得堡",ne:"Saint Petersburg",c:"RU",la:59.9311,lo:30.3609,lang:"ru-RU",greeting:"Привет",tier:1},

    // 澳大利亚
    {n:"悉尼",ne:"Sydney",c:"AU",la:-33.8688,lo:151.2093,lang:"en-AU",greeting:"Hello",tier:1},
    {n:"墨尔本",ne:"Melbourne",c:"AU",la:-37.8136,lo:144.9631,lang:"en-AU",greeting:"Hello",tier:1},
    {n:"布里斯班",ne:"Brisbane",c:"AU",la:-27.4698,lo:153.0251,lang:"en-AU",greeting:"Hello",tier:1},
    {n:"珀斯",ne:"Perth",c:"AU",la:-31.9505,lo:115.8605,lang:"en-AU",greeting:"Hello",tier:1},

    // 加拿大
    {n:"多伦多",ne:"Toronto",c:"CA",la:43.6532,lo:-79.3832,lang:"en-CA",greeting:"Hello",tier:1},
    {n:"温哥华",ne:"Vancouver",c:"CA",la:49.2827,lo:-123.1207,lang:"en-CA",greeting:"Hello",tier:1},
    {n:"蒙特利尔",ne:"Montreal",c:"CA",la:45.5017,lo:-73.5673,lang:"fr-CA",greeting:"Bonjour",tier:1},

    // 中东
    {n:"迪拜",ne:"Dubai",c:"AE",la:25.2048,lo:55.2708,lang:"ar-AE",greeting:"مرحبا",tier:1},
    {n:"利雅得",ne:"Riyadh",c:"SA",la:24.7136,lo:46.6753,lang:"ar-SA",greeting:"مرحبا",tier:1},
    {n:"特拉维夫",ne:"Tel Aviv",c:"IL",la:32.0853,lo:34.7818,lang:"he-IL",greeting:"שלום",tier:1},
    {n:"多哈",ne:"Doha",c:"QA",la:25.2854,lo:51.5310,lang:"ar-QA",greeting:"مرحبا",tier:1},

    // 亚洲
    {n:"新加坡",ne:"Singapore",c:"SG",la:1.3521,lo:103.8198,lang:"en-SG",greeting:"Hello",tier:1},
    {n:"曼谷",ne:"Bangkok",c:"TH",la:13.7563,lo:100.5018,lang:"th-TH",greeting:"สวัสดี",tier:1},
    {n:"清迈",ne:"Chiang Mai",c:"TH",la:18.7883,lo:98.9853,lang:"th-TH",greeting:"สวัสดี",tier:1},
    {n:"胡志明市",ne:"Ho Chi Minh City",c:"VN",la:10.8231,lo:106.6297,lang:"vi-VN",greeting:"Xin chào",tier:1},
    {n:"河内",ne:"Hanoi",c:"VN",la:21.0278,lo:105.8342,lang:"vi-VN",greeting:"Xin chào",tier:1},
    {n:"孟买",ne:"Mumbai",c:"IN",la:19.0760,lo:72.8777,lang:"hi-IN",greeting:"नमस्ते",tier:1},
    {n:"新德里",ne:"New Delhi",c:"IN",la:28.6139,lo:77.2090,lang:"hi-IN",greeting:"नमस्ते",tier:1},
    {n:"班加罗尔",ne:"Bangalore",c:"IN",la:12.9716,lo:77.5946,lang:"hi-IN",greeting:"नमस्ते",tier:1},
    {n:"雅加达",ne:"Jakarta",c:"ID",la:-6.2088,lo:106.8456,lang:"id-ID",greeting:"Halo",tier:1},
    {n:"巴厘岛",ne:"Bali",c:"ID",la:-8.3405,lo:115.0920,lang:"id-ID",greeting:"Halo",tier:1},
    {n:"吉隆坡",ne:"Kuala Lumpur",c:"MY",la:3.1390,lo:101.6869,lang:"ms-MY",greeting:"Hello",tier:1},
    {n:"马尼拉",ne:"Manila",c:"PH",la:14.5995,lo:120.9842,lang:"en-PH",greeting:"Hello",tier:1},
    {n:"釜山",ne:"Busan",c:"KR",la:35.1796,lo:129.0756,lang:"ko-KR",greeting:"안녕하세요",tier:1},

    // 美洲
    {n:"墨西哥城",ne:"Mexico City",c:"MX",la:19.4326,lo:-99.1332,lang:"es-MX",greeting:"Hola",tier:1},
    {n:"坎昆",ne:"Cancun",c:"MX",la:21.1619,lo:-86.8515,lang:"es-MX",greeting:"Hola",tier:1},
    {n:"圣保罗",ne:"São Paulo",c:"BR",la:-23.5505,lo:-46.6333,lang:"pt-BR",greeting:"Olá",tier:1},
    {n:"里约热内卢",ne:"Rio de Janeiro",c:"BR",la:-22.9068,lo:-43.1729,lang:"pt-BR",greeting:"Olá",tier:1},
    {n:"布宜诺斯艾利斯",ne:"Buenos Aires",c:"AR",la:-34.6037,lo:-58.3816,lang:"es-AR",greeting:"Hola",tier:1},

    // 非洲
    {n:"约翰内斯堡",ne:"Johannesburg",c:"ZA",la:-26.2041,lo:28.0473,lang:"en-ZA",greeting:"Hello",tier:1},
    {n:"开普敦",ne:"Cape Town",c:"ZA",la:-33.9249,lo:18.4241,lang:"en-ZA",greeting:"Hello",tier:1},
    {n:"开罗",ne:"Cairo",c:"EG",la:30.0444,lo:31.2357,lang:"ar-EG",greeting:"مرحبا",tier:1},

    // ========== 全球 Tier 2（二线城市） ==========
    // 美国
    {n:"亚特兰大",ne:"Atlanta",c:"US",la:33.7490,lo:-84.3880,lang:"en-US",greeting:"Hello",tier:2},
    {n:"达拉斯",ne:"Dallas",c:"US",la:32.7767,lo:-96.7970,lang:"en-US",greeting:"Hello",tier:2},
    {n:"休斯顿",ne:"Houston",c:"US",la:29.7604,lo:-95.3698,lang:"en-US",greeting:"Hello",tier:2},
    {n:"费城",ne:"Philadelphia",c:"US",la:39.9526,lo:-75.1652,lang:"en-US",greeting:"Hello",tier:2},
    {n:"凤凰城",ne:"Phoenix",c:"US",la:33.4484,lo:-112.0740,lang:"en-US",greeting:"Hello",tier:2},
    {n:"丹佛",ne:"Denver",c:"US",la:39.7392,lo:-104.9903,lang:"en-US",greeting:"Hello",tier:2},
    {n:"底特律",ne:"Detroit",c:"US",la:42.3314,lo:-83.0458,lang:"en-US",greeting:"Hello",tier:2},
    {n:"圣地亚哥",ne:"San Diego",c:"US",la:32.7157,lo:-117.1611,lang:"en-US",greeting:"Hello",tier:2},
    {n:"波特兰",ne:"Portland",c:"US",la:45.5152,lo:-122.6784,lang:"en-US",greeting:"Hello",tier:2},
    {n:"奥斯汀",ne:"Austin",c:"US",la:30.2672,lo:-97.7431,lang:"en-US",greeting:"Hello",tier:2},
    {n:"盐湖城",ne:"Salt Lake City",c:"US",la:40.7608,lo:-111.8910,lang:"en-US",greeting:"Hello",tier:2},

    // 欧洲
    {n:"巴伦西亚",ne:"Valencia",c:"ES",la:39.4699,lo:-0.3763,lang:"es-ES",greeting:"Hola",tier:2},
    {n:"塞维利亚",ne:"Seville",c:"ES",la:37.3891,lo:-5.9845,lang:"es-ES",greeting:"Hola",tier:2},
    {n:"里斯本",ne:"Lisbon",c:"PT",la:38.7223,lo:-9.1393,lang:"pt-PT",greeting:"Olá",tier:2},
    {n:"波尔图",ne:"Porto",c:"PT",la:41.1579,lo:-8.6291,lang:"pt-PT",greeting:"Olá",tier:2},
    {n:"雅典",ne:"Athens",c:"GR",la:37.9838,lo:23.7275,lang:"el-GR",greeting:"Γειά σου",tier:2},
    {n:"布拉格",ne:"Prague",c:"CZ",la:50.0755,lo:14.4378,lang:"cs-CZ",greeting:"Ahoj",tier:2},
    {n:"华沙",ne:"Warsaw",c:"PL",la:52.2297,lo:21.0122,lang:"pl-PL",greeting:"Cześć",tier:2},
    {n:"克拉科夫",ne:"Krakow",c:"PL",la:50.0647,lo:19.9450,lang:"pl-PL",greeting:"Cześć",tier:2},
    {n:"布达佩斯",ne:"Budapest",c:"HU",la:47.4979,lo:19.0402,lang:"hu-HU",greeting:"Szia",tier:2},
    {n:"都柏林",ne:"Dublin",c:"IE",la:53.3498,lo:-6.2603,lang:"en-IE",greeting:"Hello",tier:2},
    {n:"布加勒斯特",ne:"Bucharest",c:"RO",la:44.4268,lo:26.1025,lang:"ro-RO",greeting:"Salut",tier:2},
    {n:"索菲亚",ne:"Sofia",c:"BG",la:42.6977,lo:23.3219,lang:"bg-BG",greeting:"Здравей",tier:2},
    {n:"贝尔格莱德",ne:"Belgrade",c:"RS",la:44.7866,lo:20.4489,lang:"sr-RS",greeting:"Zdravo",tier:2},
    {n:"萨格勒布",ne:"Zagreb",c:"HR",la:45.8150,lo:15.9819,lang:"hr-HR",greeting:"Bok",tier:2},
    {n:"卢布尔雅那",ne:"Ljubljana",c:"SI",la:46.0569,lo:14.5058,lang:"sl-SI",greeting:"Pozdrav",tier:2},

    // 日本其他
    {n:"名古屋",ne:"Nagoya",c:"JP",la:35.1815,lo:136.9066,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"札幌",ne:"Sapporo",c:"JP",la:43.0642,lo:141.3469,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"福冈",ne:"Fukuoka",c:"JP",la:33.5904,lo:130.4017,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"神户",ne:"Kobe",c:"JP",la:34.6901,lo:135.1955,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"冲绳",ne:"Okinawa",c:"JP",la:26.2124,lo:127.6809,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"奈良",ne:"Nara",c:"JP",la:34.6851,lo:135.8048,lang:"ja-JP",greeting:"こんにちは",tier:2},
    {n:"广岛",ne:"Hiroshima",c:"JP",la:34.3853,lo:132.4553,lang:"ja-JP",greeting:"こんにちは",tier:2},

    // 韩国其他
    {n:"仁川",ne:"Incheon",c:"KR",la:37.4563,lo:126.7052,lang:"ko-KR",greeting:"안녕하세요",tier:2},
    {n:"大邱",ne:"Daegu",c:"KR",la:35.8714,lo:128.6014,lang:"ko-KR",greeting:"안녕하세요",tier:2},
    {n:"光州",ne:"Gwangju",c:"KR",la:35.1595,lo:126.8526,lang:"ko-KR",greeting:"안녕하세요",tier:2},
    {n:"济州岛",ne:"Jeju",c:"KR",la:33.4996,lo:126.5312,lang:"ko-KR",greeting:"안녕하세요",tier:2},

    // 加拿大其他
    {n:"卡尔加里",ne:"Calgary",c:"CA",la:51.0447,lo:-114.0719,lang:"en-CA",greeting:"Hello",tier:2},
    {n:"渥太华",ne:"Ottawa",c:"CA",la:45.4215,lo:-75.6972,lang:"en-CA",greeting:"Hello",tier:2},
    {n:"埃德蒙顿",ne:"Edmonton",c:"CA",la:53.5461,lo:-113.4938,lang:"en-CA",greeting:"Hello",tier:2},

    // 澳大利亚其他
    {n:"阿德莱德",ne:"Adelaide",c:"AU",la:-34.9285,lo:138.6007,lang:"en-AU",greeting:"Hello",tier:2},
    {n:"堪培拉",ne:"Canberra",c:"AU",la:-35.2809,lo:149.1300,lang:"en-AU",greeting:"Hello",tier:2},
    {n:"黄金海岸",ne:"Gold Coast",c:"AU",la:-28.0167,lo:153.4000,lang:"en-AU",greeting:"Hello",tier:2},

    // 中东其他
    {n:"伊斯坦布尔",ne:"Istanbul",c:"TR",la:41.0082,lo:28.9784,lang:"tr-TR",greeting:"Merhaba",tier:2},
    {n:"安卡拉",ne:"Ankara",c:"TR",la:39.9334,lo:32.8597,lang:"tr-TR",greeting:"Merhaba",tier:2},
    {n:"麦加",ne:"Makkah",c:"SA",la:21.3891,lo:39.8579,lang:"ar-SA",greeting:"مرحبا",tier:2},
    {n:"吉达",ne:"Jeddah",c:"SA",la:21.4858,lo:39.1925,lang:"ar-SA",greeting:"مرحبا",tier:2},
    {n:"阿布扎比",ne:"Abu Dhabi",c:"AE",la:24.4539,lo:54.3773,lang:"ar-AE",greeting:"مرحبا",tier:2},
    {n:"科威特城",ne:"Kuwait City",c:"KW",la:29.3759,lo:47.9774,lang:"ar-KW",greeting:"مرحبا",tier:2},
    {n:"马斯喀特",ne:"Muscat",c:"OM",la:23.5880,lo:58.3829,lang:"ar-OM",greeting:"مرحبا",tier:2},
    {n:"贝鲁特",ne:"Beirut",c:"LB",la:33.8938,lo:35.5018,lang:"ar-LB",greeting:"مرحبا",tier:2},

    // 东南亚
    {n:"芭提雅",ne:"Pattaya",c:"TH",la:12.9279,lo:100.8825,lang:"th-TH",greeting:"สวัสดี",tier:2},
    {n:"普吉岛",ne:"Phuket",c:"TH",la:7.8804,lo:98.3923,lang:"th-TH",greeting:"สวัสดี",tier:2},
    {n:"甲米",ne:"Krabi",c:"TH",la:8.0863,lo:98.9063,lang:"th-TH",greeting:"สวัสดี",tier:2},
    {n:"芽庄",ne:"Nha Trang",c:"VN",la:12.2388,lo:109.1968,lang:"vi-VN",greeting:"Xin chào",tier:2},
    {n:"大叻",ne:"Dalat",c:"VN",la:11.9404,lo:108.4583,lang:"vi-VN",greeting:"Xin chào",tier:2},
    {n:"下龙湾",ne:"Ha Long Bay",c:"VN",la:20.9101,lo:107.1839,lang:"vi-VN",greeting:"Xin chào",tier:2},
    {n:"万隆",ne:"Bandung",c:"ID",la:-6.9175,lo:107.6191,lang:"id-ID",greeting:"Halo",tier:2},
    {n:"泗水",ne:"Surabaya",c:"ID",la:-7.2575,lo:112.7521,lang:"id-ID",greeting:"Halo",tier:2},
    {n:"日惹",ne:"Yogyakarta",c:"ID",la:-7.7956,lo:110.3695,lang:"id-ID",greeting:"Halo",tier:2},
    {n:"槟城",ne:"Penang",c:"MY",la:5.4141,lo:100.3288,lang:"ms-MY",greeting:"Hello",tier:2},
    {n:"马六甲",ne:"Malacca",c:"MY",la:2.1896,lo:102.2501,lang:"ms-MY",greeting:"Hello",tier:2},
    {n:"宿雾",ne:"Cebu",c:"PH",la:10.3157,lo:123.8854,lang:"en-PH",greeting:"Hello",tier:2},
    {n:"长滩岛",ne:"Boracay",c:"PH",la:11.9674,lo:121.9248,lang:"en-PH",greeting:"Hello",tier:2},

    // 南亚
    {n:"加尔各答",ne:"Kolkata",c:"IN",la:22.5726,lo:88.3639,lang:"hi-IN",greeting:"नमस्ते",tier:2},
    {n:"金奈",ne:"Chennai",c:"IN",la:13.0827,lo:80.2707,lang:"hi-IN",greeting:"नमस्ते",tier:2},
    {n:"海德拉巴",ne:"Hyderabad",c:"IN",la:17.3850,lo:78.4867,lang:"hi-IN",greeting:"नमस्ते",tier:2},
    {n:"浦那",ne:"Pune",c:"IN",la:18.5204,lo:73.8567,lang:"hi-IN",greeting:"नमस्ते",tier:2},
    {n:"斋浦尔",ne:"Jaipur",c:"IN",la:26.9124,lo:75.7873,lang:"hi-IN",greeting:"नमस्ते",tier:2},
    {n:"科伦坡",ne:"Colombo",c:"LK",la:6.9271,lo:79.8612,lang:"si-LK",greeting:"ආයුබෝවන්",tier:2},
    {n:"加德满都",ne:"Kathmandu",c:"NP",la:27.7172,lo:85.3240,lang:"ne-NP",greeting:"नमस्ते",tier:2},

    // 拉美
    {n:"瓜达拉哈拉",ne:"Guadalajara",c:"MX",la:20.6597,lo:-103.3496,lang:"es-MX",greeting:"Hola",tier:2},
    {n:"蒙特雷",ne:"Monterrey",c:"MX",la:25.6866,lo:-100.3161,lang:"es-MX",greeting:"Hola",tier:2},
    {n:"巴西利亚",ne:"Brasilia",c:"BR",la:-15.7975,lo:-47.8919,lang:"pt-BR",greeting:"Olá",tier:2},
    {n:"蒙得维的亚",ne:"Montevideo",c:"UY",la:-34.9011,lo:-56.1645,lang:"es-UY",greeting:"Hola",tier:2},
    {n:"智利圣地亚哥",ne:"Santiago",c:"CL",la:-33.4489,lo:-70.6693,lang:"es-CL",greeting:"Hola",tier:2},
    {n:"利马",ne:"Lima",c:"PE",la:-12.0464,lo:-77.0428,lang:"es-PE",greeting:"Hola",tier:2},
    {n:"波哥大",ne:"Bogota",c:"CO",la:4.7110,lo:-74.0721,lang:"es-CO",greeting:"Hola",tier:2},

    // 非洲
    {n:"德班",ne:"Durban",c:"ZA",la:-29.8587,lo:31.0218,lang:"en-ZA",greeting:"Hello",tier:2},
    {n:"亚历山大",ne:"Alexandria",c:"EG",la:31.2001,lo:29.9187,lang:"ar-EG",greeting:"مرحبا",tier:2},
    {n:"卡萨布兰卡",ne:"Casablanca",c:"MA",la:33.5731,lo:-7.5898,lang:"ar-MA",greeting:"مرحبا",tier:2},
    {n:"马拉喀什",ne:"Marrakech",c:"MA",la:31.6295,lo:-7.9811,lang:"ar-MA",greeting:"مرحبا",tier:2},
    {n:"内罗毕",ne:"Nairobi",c:"KE",la:-1.2921,lo:36.8219,lang:"en-KE",greeting:"Hello",tier:2},
    {n:"拉各斯",ne:"Lagos",c:"NG",la:6.5244,lo:3.3792,lang:"en-NG",greeting:"Hello",tier:2},

    // ========== 中国 Tier 2（二线城市） ==========
    // 直辖市
    {n:"天津",ne:"Tianjin",c:"CN",la:39.0842,lo:117.2010,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"重庆",ne:"Chongqing",c:"CN",la:29.4316,lo:106.9123,lang:"zh-CN",greeting:"你好",tier:2},

    // 广东
    {n:"东莞",ne:"Dongguan",c:"CN",la:23.0430,lo:113.7633,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"佛山",ne:"Foshan",c:"CN",la:23.0218,lo:113.1214,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"珠海",ne:"Zhuhai",c:"CN",la:22.2707,lo:113.5767,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"惠州",ne:"Huizhou",c:"CN",la:23.1115,lo:114.4152,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"中山",ne:"Zhongshan",c:"CN",la:22.5176,lo:113.3926,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"汕头",ne:"Shantou",c:"CN",la:23.3536,lo:116.6820,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"江门",ne:"Jiangmen",c:"CN",la:22.5783,lo:113.0820,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"湛江",ne:"Zhanjiang",c:"CN",la:21.2707,lo:110.3594,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"茂名",ne:"Maoming",c:"CN",la:21.6618,lo:110.9253,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"肇庆",ne:"Zhaoqing",c:"CN",la:23.0470,lo:112.4651,lang:"zh-CN",greeting:"你好",tier:2},

    // 江苏
    {n:"南京",ne:"Nanjing",c:"CN",la:32.0603,lo:118.7969,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"苏州",ne:"Suzhou",c:"CN",la:31.2989,lo:120.5853,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"无锡",ne:"Wuxi",c:"CN",la:31.4912,lo:120.3119,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"常州",ne:"Changzhou",c:"CN",la:31.8113,lo:119.9740,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"南通",ne:"Nantong",c:"CN",la:31.9808,lo:120.8943,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"徐州",ne:"Xuzhou",c:"CN",la:34.2044,lo:117.2842,lang:"zh-CN",greeting:"你好",tier:2},

    // 浙江
    {n:"杭州",ne:"Hangzhou",c:"CN",la:30.2741,lo:120.1551,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"宁波",ne:"Ningbo",c:"CN",la:29.8683,lo:121.5440,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"温州",ne:"Wenzhou",c:"CN",la:27.9943,lo:120.6994,lang:"zh-CN",greeting:"你好",tier:2},

    // 安徽
    {n:"合肥",ne:"Hefei",c:"CN",la:31.8206,lo:117.2272,lang:"zh-CN",greeting:"你好",tier:2},

    // 福建
    {n:"福州",ne:"Fuzhou",c:"CN",la:26.0745,lo:119.2965,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"厦门",ne:"Xiamen",c:"CN",la:24.4798,lo:118.0894,lang:"zh-CN",greeting:"你好",tier:2},

    // 山东
    {n:"青岛",ne:"Qingdao",c:"CN",la:36.0671,lo:120.3826,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"济南",ne:"Jinan",c:"CN",la:36.6512,lo:117.1201,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"烟台",ne:"Yantai",c:"CN",la:37.4638,lo:121.4479,lang:"zh-CN",greeting:"你好",tier:2},

    // 河南
    {n:"郑州",ne:"Zhengzhou",c:"CN",la:34.7466,lo:113.6253,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"洛阳",ne:"Luoyang",c:"CN",la:34.6197,lo:112.4540,lang:"zh-CN",greeting:"你好",tier:2},

    // 湖北
    {n:"武汉",ne:"Wuhan",c:"CN",la:30.5928,lo:114.3055,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"宜昌",ne:"Yichang",c:"CN",la:30.6913,lo:111.2869,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"襄阳",ne:"Xiangyang",c:"CN",la:32.0089,lo:112.1226,lang:"zh-CN",greeting:"你好",tier:2},

    // 湖南
    {n:"长沙",ne:"Changsha",c:"CN",la:28.2282,lo:112.9388,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"岳阳",ne:"Yueyang",c:"CN",la:29.3570,lo:113.1287,lang:"zh-CN",greeting:"你好",tier:2},

    // 四川
    {n:"成都",ne:"Chengdu",c:"CN",la:30.5728,lo:104.0668,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"绵阳",ne:"Mianyang",c:"CN",la:31.4668,lo:104.6796,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"南充",ne:"Nanchong",c:"CN",la:30.7952,lo:106.0826,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"宜宾",ne:"Yibin",c:"CN",la:28.7514,lo:104.6427,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"泸州",ne:"Luzhou",c:"CN",la:28.8717,lo:105.4426,lang:"zh-CN",greeting:"你好",tier:2},

    // 云南
    {n:"昆明",ne:"Kunming",c:"CN",la:25.0389,lo:102.7183,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"大理",ne:"Dali",c:"CN",la:25.6065,lo:100.2675,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"丽江",ne:"Lijiang",c:"CN",la:26.8721,lo:100.2270,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"西双版纳",ne:"Xishuangbanna",c:"CN",la:22.0076,lo:100.7985,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"曲靖",ne:"Qujing",c:"CN",la:25.4900,lo:103.7966,lang:"zh-CN",greeting:"你好",tier:2},

    // 贵州
    {n:"贵阳",ne:"Guiyang",c:"CN",la:26.6470,lo:106.6302,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"遵义",ne:"Zunyi",c:"CN",la:27.7256,lo:106.9272,lang:"zh-CN",greeting:"你好",tier:2},

    // 陕西
    {n:"西安",ne:"Xi'an",c:"CN",la:34.3416,lo:108.9398,lang:"zh-CN",greeting:"你好",tier:2},

    // 山西
    {n:"太原",ne:"Taiyuan",c:"CN",la:37.8706,lo:112.5489,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"大同",ne:"Datong",c:"CN",la:40.0762,lo:113.2952,lang:"zh-CN",greeting:"你好",tier:2},

    // 河北
    {n:"石家庄",ne:"Shijiazhuang",c:"CN",la:38.0428,lo:114.5149,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"保定",ne:"Baoding",c:"CN",la:38.8738,lo:115.4647,lang:"zh-CN",greeting:"你好",tier:2},

    // 辽宁
    {n:"沈阳",ne:"Shenyang",c:"CN",la:41.8057,lo:123.4315,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"大连",ne:"Dalian",c:"CN",la:38.9140,lo:121.6147,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"鞍山",ne:"Anshan",c:"CN",la:41.1076,lo:122.9956,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"抚顺",ne:"Fushun",c:"CN",la:41.8619,lo:123.9573,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"本溪",ne:"Benxi",c:"CN",la:41.2941,lo:123.7641,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"锦州",ne:"Jinzhou",c:"CN",la:41.0952,lo:121.1268,lang:"zh-CN",greeting:"你好",tier:2},

    // 黑龙江
    {n:"哈尔滨",ne:"Harbin",c:"CN",la:45.8038,lo:126.5350,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"齐齐哈尔",ne:"Qiqihar",c:"CN",la:47.3543,lo:123.9181,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"佳木斯",ne:"Jiamusi",c:"CN",la:46.7993,lo:130.3192,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"牡丹江",ne:"Mudanjiang",c:"CN",la:44.5512,lo:129.6329,lang:"zh-CN",greeting:"你好",tier:2},

    // 吉林
    {n:"长春",ne:"Changchun",c:"CN",la:43.8171,lo:125.3235,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"延吉",ne:"Yanji",c:"CN",la:42.9040,lo:129.5093,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"通化",ne:"Tonghua",c:"CN",la:41.7213,lo:125.9393,lang:"zh-CN",greeting:"你好",tier:2},

    // 广西
    {n:"南宁",ne:"Nanning",c:"CN",la:22.8170,lo:108.3665,lang:"zh-CN",greeting:"你好",tier:2},

    // 江西
    {n:"南昌",ne:"Nanchang",c:"CN",la:28.6829,lo:115.8579,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"赣州",ne:"Ganzhou",c:"CN",la:25.8452,lo:114.9332,lang:"zh-CN",greeting:"你好",tier:2},

    // 海南（省会升为Tier2）
    {n:"海口",ne:"Haikou",c:"CN",la:20.0444,lo:110.1999,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"三亚",ne:"Sanya",c:"CN",la:18.2528,lo:109.5119,lang:"zh-CN",greeting:"你好",tier:2},

    // 内蒙古
    {n:"呼和浩特",ne:"Hohhot",c:"CN",la:40.8427,lo:111.7497,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"包头",ne:"Baotou",c:"CN",la:40.6558,lo:109.8400,lang:"zh-CN",greeting:"你好",tier:2},

    // 新疆
    {n:"乌鲁木齐",ne:"Urumqi",c:"CN",la:43.8256,lo:87.6168,lang:"zh-CN",greeting:"你好",tier:2},

    // 西藏
    {n:"拉萨",ne:"Lhasa",c:"CN",la:29.6520,lo:91.1721,lang:"zh-CN",greeting:"你好",tier:2},

    // 青海
    {n:"西宁",ne:"Xining",c:"CN",la:36.6171,lo:101.7782,lang:"zh-CN",greeting:"你好",tier:2},

    // 宁夏
    {n:"银川",ne:"Yinchuan",c:"CN",la:38.4872,lo:106.2309,lang:"zh-CN",greeting:"你好",tier:2},

    // 甘肃
    {n:"兰州",ne:"Lanzhou",c:"CN",la:36.0611,lo:103.8343,lang:"zh-CN",greeting:"你好",tier:2},

    // ========== 中国 Tier 3（三线城市） ==========
    // 江苏
    {n:"扬州",ne:"Yangzhou",c:"CN",la:32.3932,lo:119.4250,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"盐城",ne:"Yancheng",c:"CN",la:33.3477,lo:120.1633,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"泰州",ne:"Taizhou",c:"CN",la:32.4849,lo:119.9226,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"镇江",ne:"Zhenjiang",c:"CN",la:32.1880,lo:119.4550,lang:"zh-CN",greeting:"你好",tier:3},

    // 浙江
    {n:"湖州",ne:"Huzhou",c:"CN",la:30.8927,lo:120.0930,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"嘉兴",ne:"Jiaxing",c:"CN",la:30.7522,lo:120.7551,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"绍兴",ne:"Shaoxing",c:"CN",la:30.0003,lo:120.5820,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"金华",ne:"Jinhua",c:"CN",la:29.0789,lo:119.6478,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"衢州",ne:"Quzhou",c:"CN",la:28.9356,lo:118.8740,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"舟山",ne:"Zhoushan",c:"CN",la:29.9853,lo:122.1074,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"台州",ne:"Taizhou-ZJ",c:"CN",la:28.6563,lo:121.4209,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"丽水",ne:"Lishui",c:"CN",la:28.4677,lo:119.9229,lang:"zh-CN",greeting:"你好",tier:3},

    // 安徽
    {n:"芜湖",ne:"Wuhu",c:"CN",la:31.3350,lo:118.4328,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"蚌埠",ne:"Bengbu",c:"CN",la:32.9169,lo:117.3890,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"淮南",ne:"Huainan",c:"CN",la:32.6255,lo:116.9997,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"马鞍山",ne:"Ma'anshan",c:"CN",la:31.6701,lo:118.5073,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"淮北",ne:"Huaibei",c:"CN",la:33.9745,lo:116.7980,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"铜陵",ne:"Tongling",c:"CN",la:30.9409,lo:117.8122,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"安庆",ne:"Anqing",c:"CN",la:30.5431,lo:117.0634,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黄山",ne:"Huangshan",c:"CN",la:29.7147,lo:118.3376,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"滁州",ne:"Chuzhou",c:"CN",la:32.3017,lo:118.3170,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"阜阳",ne:"Fuyang",c:"CN",la:32.8908,lo:115.8142,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"宿州",ne:"Suzhou-AH",c:"CN",la:33.6466,lo:116.9644,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"六安",ne:"Lu'an",c:"CN",la:31.7348,lo:116.5082,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"亳州",ne:"Bozhou",c:"CN",la:33.8446,lo:115.7784,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"池州",ne:"Chizhou",c:"CN",la:30.6644,lo:117.4912,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"宣城",ne:"Xuancheng",c:"CN",la:30.9407,lo:118.7586,lang:"zh-CN",greeting:"你好",tier:3},

    // 福建
    {n:"莆田",ne:"Putian",c:"CN",la:25.4540,lo:119.0103,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"三明",ne:"Sanming",c:"CN",la:26.2634,lo:117.6389,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"泉州",ne:"Quanzhou",c:"CN",la:24.8740,lo:118.6758,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"漳州",ne:"Zhangzhou",c:"CN",la:24.5134,lo:117.6474,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"南平",ne:"Nanping",c:"CN",la:26.6418,lo:118.1779,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"龙岩",ne:"Longyan",c:"CN",la:25.0752,lo:117.0173,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"宁德",ne:"Ningde",c:"CN",la:26.6592,lo:119.5477,lang:"zh-CN",greeting:"你好",tier:3},

    // 江西
    {n:"景德镇",ne:"Jingdezhen",c:"CN",la:29.2688,lo:117.1787,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"萍乡",ne:"Pingxiang",c:"CN",la:27.6229,lo:113.8545,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"九江",ne:"Jiujiang",c:"CN",la:29.7048,lo:116.0018,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"新余",ne:"Xinyu",c:"CN",la:27.8178,lo:114.9167,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"鹰潭",ne:"Yingtan",c:"CN",la:28.2606,lo:117.0694,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"吉安",ne:"Jian",c:"CN",la:27.1138,lo:114.9933,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"宜春",ne:"Yichun-JX",c:"CN",la:27.8136,lo:114.4163,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"抚州",ne:"Fuzhou-JX",c:"CN",la:27.9493,lo:116.3583,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"上饶",ne:"Shangrao",c:"CN",la:28.4552,lo:117.9433,lang:"zh-CN",greeting:"你好",tier:3},

    // 山东
    {n:"淄博",ne:"Zibo",c:"CN",la:36.8132,lo:118.0548,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"枣庄",ne:"Zaozhuang",c:"CN",la:34.8107,lo:117.3239,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"东营",ne:"Dongying",c:"CN",la:37.4346,lo:118.6749,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"潍坊",ne:"Weifang",c:"CN",la:36.7068,lo:119.1619,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"济宁",ne:"Jining",c:"CN",la:35.4147,lo:116.5871,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"泰安",ne:"Tai'an",c:"CN",la:36.1949,lo:117.0892,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"威海",ne:"Weihai",c:"CN",la:37.5091,lo:122.1216,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"日照",ne:"Rizhao",c:"CN",la:35.4164,lo:119.5269,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"临沂",ne:"Linyi",c:"CN",la:35.1041,lo:118.3566,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"德州",ne:"Dezhou",c:"CN",la:37.4360,lo:116.3575,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"聊城",ne:"Liaocheng",c:"CN",la:36.4569,lo:115.9853,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"滨州",ne:"Binzhou",c:"CN",la:37.3816,lo:117.9706,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"菏泽",ne:"Heze",c:"CN",la:35.2334,lo:115.4809,lang:"zh-CN",greeting:"你好",tier:3},

    // 河南
    {n:"许昌",ne:"Xuchang",c:"CN",la:34.0267,lo:113.8526,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"漯河",ne:"Luohe",c:"CN",la:33.5813,lo:114.0420,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"三门峡",ne:"Sanmenxia",c:"CN",la:34.7726,lo:111.1941,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"南阳",ne:"Nanyang",c:"CN",la:32.9908,lo:112.5283,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"商丘",ne:"Shangqiu",c:"CN",la:34.4143,lo:115.6564,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"信阳",ne:"Xinyang",c:"CN",la:32.1285,lo:114.0928,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"周口",ne:"Zhoukou",c:"CN",la:33.6250,lo:114.6497,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"驻马店",ne:"Zhumadian",c:"CN",la:32.9808,lo:114.0246,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"濮阳",ne:"Puyang",c:"CN",la:35.7616,lo:115.0292,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"焦作",ne:"Jiaozuo",c:"CN",la:35.2157,lo:113.2420,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"鹤壁",ne:"Hebi",c:"CN",la:35.7478,lo:114.2972,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"平顶山",ne:"Pingdingshan",c:"CN",la:33.7669,lo:113.1925,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"开封",ne:"Kaifeng",c:"CN",la:34.7972,lo:114.3074,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"新乡",ne:"Xinxiang",c:"CN",la:35.3028,lo:113.9268,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"安阳",ne:"Anyang",c:"CN",la:36.0997,lo:114.3926,lang:"zh-CN",greeting:"你好",tier:3},

    // 湖北
    {n:"十堰",ne:"Shiyan",c:"CN",la:32.6292,lo:110.7980,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"荆州",ne:"Jingzhou",c:"CN",la:30.3340,lo:112.2394,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"鄂州",ne:"Ezhou",c:"CN",la:30.3916,lo:114.8946,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"荆门",ne:"Jingmen",c:"CN",la:31.0354,lo:112.1993,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"孝感",ne:"Xiaogan",c:"CN",la:30.9268,lo:113.9169,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黄冈",ne:"Huanggang",c:"CN",la:30.4534,lo:114.8725,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"咸宁",ne:"Xianning",c:"CN",la:29.8416,lo:114.3224,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"随州",ne:"Suizhou",c:"CN",la:31.7270,lo:113.3826,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"恩施",ne:"Enshi",c:"CN",la:30.2722,lo:109.4882,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黄石",ne:"Huangshi",c:"CN",la:30.2013,lo:115.0389,lang:"zh-CN",greeting:"你好",tier:3},

    // 湖南
    {n:"株洲",ne:"Zhuzhou",c:"CN",la:27.8274,lo:113.1340,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"湘潭",ne:"Xiangtan",c:"CN",la:27.8292,lo:112.9442,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"衡阳",ne:"Hengyang",c:"CN",la:26.8934,lo:112.5718,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"邵阳",ne:"Shaoyang",c:"CN",la:27.2389,lo:111.4674,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"常德",ne:"Changde",c:"CN",la:29.0317,lo:111.6980,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"张家界",ne:"Zhangjiajie",c:"CN",la:29.1248,lo:110.4794,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"益阳",ne:"Yiyang",c:"CN",la:28.5539,lo:112.3552,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"郴州",ne:"Chenzhou",c:"CN",la:25.7702,lo:113.0149,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"永州",ne:"Yongzhou",c:"CN",la:26.4346,lo:111.6130,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"怀化",ne:"Huaihua",c:"CN",la:27.5500,lo:109.9772,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"娄底",ne:"Loudi",c:"CN",la:27.6983,lo:111.9944,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"湘西",ne:"Xiangxi",c:"CN",la:28.3117,lo:109.7387,lang:"zh-CN",greeting:"你好",tier:3},

    // 广西
    {n:"柳州",ne:"Liuzhou",c:"CN",la:24.3263,lo:109.4286,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"桂林",ne:"Guilin",c:"CN",la:25.2738,lo:110.2900,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"梧州",ne:"Wuzhou",c:"CN",la:23.4769,lo:111.2791,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"北海",ne:"Beihai",c:"CN",la:21.4734,lo:109.1193,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"防城港",ne:"Fangchenggang",c:"CN",la:21.7054,lo:108.3541,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"钦州",ne:"Qinzhou",c:"CN",la:21.9813,lo:108.6542,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"贵港",ne:"Guigang",c:"CN",la:23.1113,lo:109.5988,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"玉林",ne:"Yulin",c:"CN",la:22.6541,lo:110.1810,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"百色",ne:"Baise",c:"CN",la:23.9027,lo:106.6181,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"贺州",ne:"Hezhou",c:"CN",la:24.4048,lo:111.5669,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"河池",ne:"Hechi",c:"CN",la:24.6929,lo:108.0853,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"来宾",ne:"Laibin",c:"CN",la:23.7517,lo:109.2216,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"崇左",ne:"Chongzuo",c:"CN",la:22.4038,lo:107.3641,lang:"zh-CN",greeting:"你好",tier:3},

    // 海南
    {n:"儋州",ne:"Danzhou",c:"CN",la:19.5175,lo:109.5808,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"琼海",ne:"Qionghai",c:"CN",la:19.2588,lo:110.4746,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"文昌",ne:"Wenchang",c:"CN",la:19.5431,lo:110.7544,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"万宁",ne:"Wanning",c:"CN",la:18.7959,lo:110.3880,lang:"zh-CN",greeting:"你好",tier:3},

    // 山西
    {n:"运城",ne:"Yuncheng",c:"CN",la:35.0227,lo:111.0077,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"临汾",ne:"Linfen",c:"CN",la:36.0881,lo:111.5190,lang:"zh-CN",greeting:"你好",tier:3},

    // 广东
    {n:"梅州",ne:"Meizhou",c:"CN",la:24.2888,lo:116.1227,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"潮州",ne:"Chaozhou",c:"CN",la:23.6567,lo:116.6224,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"揭阳",ne:"Jieyang",c:"CN",la:23.5479,lo:116.3728,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"韶关",ne:"Shaoguan",c:"CN",la:24.8100,lo:113.5970,lang:"zh-CN",greeting:"你好",tier:3},

    // ========== 中国 Tier 4（四线城市） ==========
    // 河北
    {n:"迁安",ne:"Qian'an",c:"CN",la:39.9373,lo:118.7014,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"遵化",ne:"Zunhua",c:"CN",la:40.1857,lo:117.9654,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"滦州",ne:"Luanzhou",c:"CN",la:39.7468,lo:118.7746,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"武安",ne:"Wu'an",c:"CN",la:36.6913,lo:114.2194,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"南宫",ne:"Nangong",c:"CN",la:37.3579,lo:115.4126,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"辛集",ne:"Xinji",c:"CN",la:37.9412,lo:115.2176,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"晋州",ne:"Jinzhou-HB",c:"CN",la:38.0298,lo:115.0417,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"新乐",ne:"Xinle",c:"CN",la:38.3438,lo:114.6834,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"泊头",ne:"Botou",c:"CN",la:38.0833,lo:116.5667,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"任丘",ne:"Renqiu",c:"CN",la:38.7333,lo:116.1167,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"黄骅",ne:"Huanghua",c:"CN",la:38.3711,lo:117.3300,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"河间",ne:"Hejian",c:"CN",la:38.4459,lo:116.0836,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"霸州",ne:"Bazhou",c:"CN",la:39.0909,lo:116.3901,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"三河",ne:"Sanhe",c:"CN",la:39.9828,lo:117.0695,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"涿州",ne:"Zhuozhou",c:"CN",la:39.4827,lo:115.9708,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"定州",ne:"Dingzhou",c:"CN",la:38.5132,lo:114.8155,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"安国",ne:"Anguo",c:"CN",la:38.4158,lo:115.3267,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"高碑店",ne:"Gaobeidian",c:"CN",la:39.3266,lo:115.8961,lang:"zh-CN",greeting:"你好",tier:4},

    // 山东
    {n:"昌邑",ne:"Changyi",c:"CN",la:36.8699,lo:119.3977,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"高密",ne:"Gaomi",c:"CN",la:36.3838,lo:119.7552,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"青州",ne:"Qingzhou",c:"CN",la:36.6850,lo:118.4791,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"诸城",ne:"Zhucheng",c:"CN",la:35.9954,lo:119.4104,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"寿光",ne:"Shouguang",c:"CN",la:36.8557,lo:118.7906,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"安丘",ne:"Anqiu",c:"CN",la:36.4780,lo:119.2184,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"临朐",ne:"Linqu",c:"CN",la:36.5126,lo:118.5402,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"昌乐",ne:"Changle",c:"CN",la:36.7007,lo:118.8429,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"龙口",ne:"Longkou",c:"CN",la:37.6464,lo:120.4778,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"莱阳",ne:"Laiyang",c:"CN",la:36.9786,lo:120.7114,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"莱州",ne:"Laizhou",c:"CN",la:37.1770,lo:119.9423,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"蓬莱",ne:"Penglai",c:"CN",la:37.8103,lo:120.7545,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"栖霞",ne:"Qixia",c:"CN",la:37.3059,lo:120.8495,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"海阳",ne:"Haiyang",c:"CN",la:36.6886,lo:121.1737,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"招远",ne:"Zhaoyuan",c:"CN",la:37.3554,lo:120.4318,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"荣成",ne:"Rongcheng",c:"CN",la:37.1652,lo:122.4863,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"乳山",ne:"Rushan",c:"CN",la:36.9196,lo:121.5355,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"文登",ne:"Wendeng",c:"CN",la:37.1935,lo:122.0573,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"临清",ne:"Linqing",c:"CN",la:36.8383,lo:115.7063,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"乐陵",ne:"Leling",c:"CN",la:37.7299,lo:117.2314,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"禹城",ne:"Yucheng",c:"CN",la:36.9333,lo:116.6381,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"滕州",ne:"Tengzhou",c:"CN",la:35.1140,lo:117.1659,lang:"zh-CN",greeting:"你好",tier:4},

    // 浙江
    {n:"龙泉",ne:"Longquan",c:"CN",la:28.0718,lo:119.1328,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"义乌",ne:"Yiwu",c:"CN",la:29.3063,lo:120.0747,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"东阳",ne:"Dongyang",c:"CN",la:29.2892,lo:120.2423,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"永康",ne:"Yongkang",c:"CN",la:28.8885,lo:120.0476,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"慈溪",ne:"Cixi",c:"CN",la:30.1692,lo:121.2665,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"余姚",ne:"Yuyao",c:"CN",la:30.0371,lo:121.1546,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"临海",ne:"Linhai",c:"CN",la:28.8583,lo:121.1440,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"温岭",ne:"Wenling",c:"CN",la:28.3717,lo:121.3856,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"玉环",ne:"Yuhuan",c:"CN",la:28.1265,lo:121.2305,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"瑞安",ne:"Rui'an",c:"CN",la:27.7792,lo:120.6544,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"乐清",ne:"Yueqing",c:"CN",la:28.1133,lo:120.9830,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"平湖",ne:"Pinghu",c:"CN",la:30.6772,lo:121.0151,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"桐乡",ne:"Tongxiang",c:"CN",la:30.6302,lo:120.5655,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"海宁",ne:"Haining",c:"CN",la:30.5097,lo:120.6818,lang:"zh-CN",greeting:"你好",tier:4},

    // 江苏
    {n:"江阴",ne:"Jiangyin",c:"CN",la:31.9110,lo:120.2865,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"宜兴",ne:"Yixing",c:"CN",la:31.3403,lo:119.8232,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"邳州",ne:"Pizhou",c:"CN",la:34.3389,lo:117.9595,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"新沂",ne:"Xinyi",c:"CN",la:34.3697,lo:118.3544,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"溧阳",ne:"Liyang",c:"CN",la:31.4160,lo:119.4843,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"常熟",ne:"Changshu",c:"CN",la:31.6538,lo:120.7527,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"张家港",ne:"Zhangjiagang",c:"CN",la:31.8756,lo:120.5549,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"昆山",ne:"Kunshan",c:"CN",la:31.3848,lo:120.9580,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"太仓",ne:"Taicang",c:"CN",la:31.4572,lo:121.1308,lang:"zh-CN",greeting:"你好",tier:4},

    // 安徽
    {n:"桐城",ne:"Tongcheng",c:"CN",la:31.0446,lo:116.9556,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"天长",ne:"Tianchang",c:"CN",la:32.6773,lo:118.9874,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"明光",ne:"Mingguang",c:"CN",la:32.7827,lo:117.9830,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"界首",ne:"Jieshou",c:"CN",la:33.2581,lo:115.3633,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"宁国",ne:"Ningguo",c:"CN",la:30.6247,lo:118.8744,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"广德",ne:"Guangde",c:"CN",la:30.8972,lo:119.4101,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"当涂",ne:"Dangtu",c:"CN",la:31.6707,lo:118.4889,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"霍邱",ne:"Huoqiu",c:"CN",la:32.3523,lo:116.2747,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"舒城",ne:"Shucheng",c:"CN",la:31.4795,lo:116.9396,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"金寨",ne:"Jinzhai",c:"CN",la:31.6777,lo:115.8783,lang:"zh-CN",greeting:"你好",tier:4},

    // ========== 西北地区地级市（Tier 3） ==========
    // 陕西
    {n:"咸阳",ne:"Xianyang",c:"CN",la:34.3299,lo:108.7048,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"宝鸡",ne:"Baoji",c:"CN",la:34.3616,lo:107.2376,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"延安",ne:"Yan'an",c:"CN",la:36.5853,lo:109.4897,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"榆林",ne:"Yulin-SX",c:"CN",la:38.2852,lo:109.7413,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"汉中",ne:"Hanzhong",c:"CN",la:33.0685,lo:107.0283,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"渭南",ne:"Weinan",c:"CN",la:34.4996,lo:109.5094,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"安康",ne:"Ankang",c:"CN",la:32.6841,lo:109.0293,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"商洛",ne:"Shangluo",c:"CN",la:33.8686,lo:109.9195,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"铜川",ne:"Tongchuan",c:"CN",la:34.8966,lo:108.9450,lang:"zh-CN",greeting:"你好",tier:3},

    // 甘肃
    {n:"天水",ne:"Tianshui",c:"CN",la:34.5809,lo:105.7249,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"嘉峪关",ne:"Jiayuguan",c:"CN",la:39.7725,lo:98.2889,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"酒泉",ne:"Jiuquan",c:"CN",la:39.7324,lo:98.4942,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"张掖",ne:"Zhangye",c:"CN",la:38.9255,lo:100.4499,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"武威",ne:"Wuwei",c:"CN",la:37.9282,lo:102.6346,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"定西",ne:"Dingxi",c:"CN",la:35.5796,lo:104.6263,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"平凉",ne:"Pingliang",c:"CN",la:35.5421,lo:106.6651,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"庆阳",ne:"Qingyang",c:"CN",la:35.7341,lo:107.6382,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"陇南",ne:"Longnan",c:"CN",la:33.3998,lo:104.9218,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"临夏",ne:"Linxia",c:"CN",la:35.5996,lo:103.2109,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"甘南",ne:"Gannan",c:"CN",la:34.9864,lo:102.9113,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"白银",ne:"Baiyin",c:"CN",la:36.5448,lo:104.1385,lang:"zh-CN",greeting:"你好",tier:3},

    // 宁夏
    {n:"石嘴山",ne:"Shizuishan",c:"CN",la:38.9843,lo:106.3854,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"吴忠",ne:"Wuzhong",c:"CN",la:37.9975,lo:106.1991,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"固原",ne:"Guyuan",c:"CN",la:36.0153,lo:106.2425,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"中卫",ne:"Zhongwei",c:"CN",la:37.5200,lo:105.1963,lang:"zh-CN",greeting:"你好",tier:3},

    // 青海
    {n:"格尔木",ne:"Golmud",c:"CN",la:36.4028,lo:94.9054,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"德令哈",ne:"Delingha",c:"CN",la:37.3693,lo:97.3692,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"海东",ne:"Haidong",c:"CN",la:36.5024,lo:102.1025,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"玉树",ne:"Yushu",c:"CN",la:32.9928,lo:97.0082,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"果洛",ne:"Guoluo",c:"CN",la:34.4736,lo:100.2448,lang:"zh-CN",greeting:"你好",tier:3},

    // 新疆
    {n:"喀什",ne:"Kashgar",c:"CN",la:39.4703,lo:75.9895,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"伊宁",ne:"Yining",c:"CN",la:43.9023,lo:81.3274,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"库尔勒",ne:"Korla",c:"CN",la:41.7258,lo:86.1740,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"阿克苏",ne:"Aksu",c:"CN",la:41.1681,lo:80.2638,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"克拉玛依",ne:"Karamay",c:"CN",la:45.5795,lo:84.8892,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"吐鲁番",ne:"Turpan",c:"CN",la:42.9513,lo:89.1895,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"哈密",ne:"Hami",c:"CN",la:42.8331,lo:93.5151,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"和田",ne:"Hotan",c:"CN",la:37.1167,lo:79.9303,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"石河子",ne:"Shihezi",c:"CN",la:44.3020,lo:86.0417,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"昌吉",ne:"Changji",c:"CN",la:44.0115,lo:87.3082,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"塔城",ne:"Tacheng",c:"CN",la:46.7452,lo:82.9804,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"阿勒泰",ne:"Altay",c:"CN",la:47.8443,lo:88.1395,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"博乐",ne:"Bole",c:"CN",la:44.8986,lo:82.0744,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"奎屯",ne:"Kuitun",c:"CN",la:44.4267,lo:84.9030,lang:"zh-CN",greeting:"你好",tier:3},

    // 西藏
    {n:"日喀则",ne:"Shigatse",c:"CN",la:29.2671,lo:88.8800,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"林芝",ne:"Nyingchi",c:"CN",la:29.6486,lo:94.3618,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"山南",ne:"Shannan",c:"CN",la:29.2363,lo:91.7732,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"那曲",ne:"Nagqu",c:"CN",la:31.4762,lo:92.0513,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"昌都",ne:"Qamdo",c:"CN",la:31.1363,lo:97.1716,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"阿里",ne:"Ali",c:"CN",la:32.5003,lo:80.1054,lang:"zh-CN",greeting:"你好",tier:3},

    // 内蒙古补充
    {n:"鄂尔多斯",ne:"Ordos",c:"CN",la:39.6086,lo:109.7814,lang:"zh-CN",greeting:"你好",tier:2},
    {n:"赤峰",ne:"Chifeng",c:"CN",la:42.2685,lo:118.9556,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"通辽",ne:"Tongliao",c:"CN",la:43.6526,lo:122.2440,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"兴安盟",ne:"Hinggan",c:"CN",la:46.0826,lo:122.0706,lang:"zh-CN",greeting:"你好",tier:3},

    // ========== 西南地区地级市（Tier 3） ==========
    // 四川
    {n:"德阳",ne:"Deyang",c:"CN",la:31.1267,lo:104.3979,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"乐山",ne:"Leshan",c:"CN",la:29.5523,lo:103.7659,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"自贡",ne:"Zigong",c:"CN",la:29.3391,lo:104.7784,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"达州",ne:"Dazhou",c:"CN",la:31.2098,lo:107.4678,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"广安",ne:"Guang'an",c:"CN",la:30.4742,lo:106.6335,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"遂宁",ne:"Suining",c:"CN",la:30.5325,lo:105.5927,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"眉山",ne:"Meishan",c:"CN",la:30.0752,lo:103.8487,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"内江",ne:"Neijiang",c:"CN",la:29.5872,lo:105.0584,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"凉山",ne:"Liangshan",c:"CN",la:27.8862,lo:102.2674,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"甘孜",ne:"Garze",c:"CN",la:31.6236,lo:100.0100,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"阿坝",ne:"Ngawa",c:"CN",la:32.9068,lo:101.6928,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"广元",ne:"Guangyuan",c:"CN",la:32.4353,lo:105.8444,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"雅安",ne:"Ya'an",c:"CN",la:29.9999,lo:103.0010,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"巴中",ne:"Bazhong",c:"CN",la:31.8678,lo:106.7474,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"资阳",ne:"Ziyang",c:"CN",la:30.1228,lo:104.6278,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"攀枝花",ne:"Panzhihua",c:"CN",la:26.5820,lo:101.7182,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"万源",ne:"Wanyuan",c:"CN",la:32.0626,lo:108.0351,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"江油",ne:"Jiangyou",c:"CN",la:31.7780,lo:104.7454,lang:"zh-CN",greeting:"你好",tier:4},

    // 重庆
    {n:"万州",ne:"Wanzhou",c:"CN",la:30.8074,lo:108.3780,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"涪陵",ne:"Fuling",c:"CN",la:29.7031,lo:107.3895,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"江津",ne:"Jiangjin",c:"CN",la:29.2892,lo:106.2593,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"合川",ne:"Hechuan",c:"CN",la:29.9714,lo:106.2764,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"永川",ne:"Yongchuan",c:"CN",la:29.3563,lo:105.9270,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"南川",ne:"Nanchuan",c:"CN",la:29.1569,lo:107.0985,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"大足",ne:"Dazu",c:"CN",la:29.7080,lo:105.7154,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"綦江",ne:"Qijiang",c:"CN",la:29.0284,lo:106.6514,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"璧山",ne:"Bishan",c:"CN",la:29.5925,lo:106.2280,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"铜梁",ne:"Tongliang",c:"CN",la:29.8436,lo:106.0553,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"潼南",ne:"Tongnan",c:"CN",la:30.1906,lo:105.8404,lang:"zh-CN",greeting:"你好",tier:4},
    {n:"荣昌",ne:"Rongchang",c:"CN",la:29.4036,lo:105.5940,lang:"zh-CN",greeting:"你好",tier:4},

    // 云南
    {n:"玉溪",ne:"Yuxi",c:"CN",la:24.3518,lo:102.5462,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"昭通",ne:"Zhaotong",c:"CN",la:27.3382,lo:103.7176,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"保山",ne:"Baoshan",c:"CN",la:25.1121,lo:99.1614,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"临沧",ne:"Lincang",c:"CN",la:23.8864,lo:100.0928,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"普洱",ne:"Pu'er",c:"CN",la:22.8251,lo:100.9665,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"文山",ne:"Wenshan",c:"CN",la:23.3675,lo:104.2452,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"红河",ne:"Honghe",c:"CN",la:23.3667,lo:103.3750,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"楚雄",ne:"Chuxiong",c:"CN",la:25.0448,lo:101.5458,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"德宏",ne:"Dehong",c:"CN",la:24.4336,lo:98.5783,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"迪庆",ne:"Diqing",c:"CN",la:27.8188,lo:99.7022,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"怒江",ne:"Nujiang",c:"CN",la:25.8606,lo:98.8542,lang:"zh-CN",greeting:"你好",tier:3},

    // 贵州
    {n:"六盘水",ne:"Liupanshui",c:"CN",la:26.5928,lo:104.8303,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"安顺",ne:"Anshun",c:"CN",la:26.2457,lo:105.9340,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"毕节",ne:"Bijie",c:"CN",la:27.2998,lo:105.2856,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"铜仁",ne:"Tongren",c:"CN",la:27.7180,lo:109.1913,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黔东南",ne:"Qiandongnan",c:"CN",la:26.5836,lo:107.9778,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黔南",ne:"Qiannan",c:"CN",la:26.2543,lo:107.5226,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"黔西南",ne:"Qianxinan",c:"CN",la:25.0878,lo:104.8973,lang:"zh-CN",greeting:"你好",tier:3},
    {n:"凯里",ne:"Kaili",c:"CN",la:26.5725,lo:107.9805,lang:"zh-CN",greeting:"你好",tier:3},

    // ========== 中国 Tier 5（五线/东北边城） ==========
    // 内蒙古
    {n:"满洲里",ne:"Manzhouli",c:"CN",la:49.5979,lo:117.3784,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"二连浩特",ne:"Erenhot",c:"CN",la:43.6529,lo:111.9706,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"锡林浩特",ne:"Xilinhot",c:"CN",la:43.9333,lo:116.0500,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"霍林郭勒",ne:"Holing Gol",c:"CN",la:45.5333,lo:119.6500,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"丰镇",ne:"Fengzhen",c:"CN",la:40.4371,lo:113.1097,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"乌兰浩特",ne:"Ulan Hot",c:"CN",la:46.0769,lo:122.0932,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"额尔古纳",ne:"E'erguna",c:"CN",la:50.2425,lo:120.1806,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"根河",ne:"Genhe",c:"CN",la:50.7745,lo:121.5190,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"扎兰屯",ne:"Zhalantun",c:"CN",la:48.0138,lo:122.7373,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"牙克石",ne:"Yakeshi",c:"CN",la:49.2855,lo:120.6558,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"阿尔山",ne:"A'ertshan",c:"CN",la:47.1773,lo:119.9456,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"额济纳旗",ne:"Ejin Banner",c:"CN",la:41.9553,lo:101.0651,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"巴彦淖尔",ne:"Bayan Nur",c:"CN",la:40.7574,lo:107.3877,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"乌兰察布",ne:"Wulanchabu",c:"CN",la:40.9945,lo:113.1327,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"呼伦贝尔",ne:"Hulunbuir",c:"CN",la:49.2115,lo:119.7657,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"科尔沁右翼前旗",ne:"Horqin Right Front Banner",c:"CN",la:46.0764,lo:122.0837,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"扎赉特旗",ne:"Zhalaid Banner",c:"CN",la:46.7233,lo:122.9008,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"突泉",ne:"Tuquan",c:"CN",la:45.3341,lo:121.5357,lang:"zh-CN",greeting:"你好",tier:5},

    // 黑龙江边城
    {n:"漠河",ne:"Mohe",c:"CN",la:52.9633,lo:122.5386,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"呼中",ne:"Huzhong",c:"CN",la:51.9667,lo:123.0333,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"加格达奇",ne:"Jiagedaqi",c:"CN",la:50.4117,lo:124.1969,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"塔河",ne:"Tahe",c:"CN",la:52.3333,lo:124.7000,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"呼玛",ne:"Huma",c:"CN",la:51.7236,lo:126.6611,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"逊克",ne:"Xunke",c:"CN",la:49.2467,lo:128.4583,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"孙吴",ne:"Sunwu",c:"CN",la:49.4263,lo:127.3348,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"嫩江",ne:"Nenjiang",c:"CN",la:49.1749,lo:125.2219,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"北安",ne:"Bei'an",c:"CN",la:48.2414,lo:126.5106,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"五大连池",ne:"Wudalianchi",c:"CN",la:48.5144,lo:126.1310,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"抚远",ne:"Fuyuan",c:"CN",la:48.3631,lo:134.2969,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"同江",ne:"Tongjiang",c:"CN",la:47.6426,lo:132.5093,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"饶河",ne:"Raohe",c:"CN",la:46.8014,lo:134.0086,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"富锦",ne:"Fujin",c:"CN",la:47.2503,lo:132.0321,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"虎林",ne:"Hulin",c:"CN",la:45.7610,lo:132.8371,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"密山",ne:"Mishan",c:"CN",la:45.5475,lo:131.8783,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"绥芬河",ne:"Suifenhe",c:"CN",la:44.4102,lo:131.1550,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"东宁",ne:"Dongning",c:"CN",la:44.0626,lo:131.2306,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"穆棱",ne:"Muling",c:"CN",la:44.9189,lo:130.3652,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"宁安",ne:"Ning'an",c:"CN",la:44.3476,lo:129.4830,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"海林",ne:"Hailin",c:"CN",la:44.5727,lo:129.3809,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"林口",ne:"Linkou",c:"CN",la:45.7167,lo:130.2833,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"宝清",ne:"Baoqing",c:"CN",la:46.3283,lo:131.7860,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"集贤",ne:"Jixian",c:"CN",la:46.8006,lo:131.1401,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"汤原",ne:"Tangyuan",c:"CN",la:46.7269,lo:129.8511,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"桦川",ne:"Huachuan",c:"CN",la:47.0223,lo:130.6839,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"桦南",ne:"Huanan",c:"CN",la:46.2426,lo:130.5650,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"绥化",ne:"Suihua",c:"CN",la:46.6381,lo:126.9929,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"安达",ne:"Anda",c:"CN",la:46.4178,lo:125.3418,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"海伦",ne:"Hailun",c:"CN",la:47.4576,lo:126.9927,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"铁力",ne:"Tieli",c:"CN",la:46.9752,lo:128.0323,lang:"zh-CN",greeting:"你好",tier:5},

    // 辽宁边城
    {n:"新民",ne:"Xinmin",c:"CN",la:41.9985,lo:122.8267,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"瓦房店",ne:"Wafangdian",c:"CN",la:39.6263,lo:121.9794,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"庄河",ne:"Zhuanghe",c:"CN",la:39.6950,lo:122.9944,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"凌源",ne:"Lingyuan",c:"CN",la:41.2456,lo:119.4011,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"北票",ne:"Beipiao",c:"CN",la:41.8081,lo:120.4564,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"开原",ne:"Kaiyuan",c:"CN",la:42.5429,lo:124.0404,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"海城",ne:"Haicheng",c:"CN",la:40.8514,lo:122.7503,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"东港",ne:"Donggang",c:"CN",la:40.1314,lo:124.1501,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"凤城",ne:"Fengcheng",c:"CN",la:40.4523,lo:124.0676,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"兴城",ne:"Xingcheng",c:"CN",la:40.6271,lo:120.7567,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"绥中",ne:"Suizhong",c:"CN",la:40.3247,lo:120.3498,lang:"zh-CN",greeting:"你好",tier:5},

    // 吉林边城
    {n:"公主岭",ne:"Gongzhuling",c:"CN",la:43.8500,lo:124.8167,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"临江",ne:"Linjiang",c:"CN",la:41.8100,lo:126.9181,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"抚松",ne:"Fusong",c:"CN",la:42.2294,lo:127.2557,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"长白",ne:"Changbai",c:"CN",la:41.4150,lo:128.1783,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"榆树",ne:"Yushu",c:"CN",la:44.8263,lo:126.5331,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"德惠",ne:"Dehui",c:"CN",la:44.5361,lo:125.6875,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"蛟河",ne:"Jiaohe",c:"CN",la:43.7146,lo:127.3395,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"洮南",ne:"Taonan",c:"CN",la:45.3357,lo:122.7877,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"大安",ne:"Da'an",c:"CN",la:45.5025,lo:124.2565,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"镇赉",ne:"Zhenlai",c:"CN",la:45.8477,lo:123.1937,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"通榆",ne:"Tongyu",c:"CN",la:44.8079,lo:123.0733,lang:"zh-CN",greeting:"你好",tier:5},

    // 新疆边境
    {n:"霍尔果斯",ne:"Khorgos",c:"CN",la:44.2133,lo:80.4167,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"塔什库尔干",ne:"Taxkorgan",c:"CN",la:37.7723,lo:75.2286,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"阿图什",ne:"Artux",c:"CN",la:39.7157,lo:76.1680,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"图木舒克",ne:"Tumxuk",c:"CN",la:39.8676,lo:79.0778,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"阿拉尔",ne:"Aral",c:"CN",la:40.5479,lo:81.2806,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"北屯",ne:"Beitun",c:"CN",la:47.3534,lo:87.8244,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"铁门关",ne:"Tiemenguan",c:"CN",la:41.8272,lo:85.6499,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"可克达拉",ne:"Kokdala",c:"CN",la:43.9456,lo:81.0432,lang:"zh-CN",greeting:"你好",tier:5},

    // 西藏边境
    {n:"亚东",ne:"Yadong",c:"CN",la:27.4842,lo:88.9060,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"墨脱",ne:"Motuo",c:"CN",la:29.3241,lo:95.3322,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"扎达",ne:"Zanda",c:"CN",la:31.4785,lo:79.8019,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"普兰",ne:"Burang",c:"CN",la:30.2945,lo:81.1763,lang:"zh-CN",greeting:"你好",tier:5},

    // 云南边境
    {n:"瑞丽",ne:"Ruili",c:"CN",la:23.9982,lo:97.8552,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"腾冲",ne:"Tengchong",c:"CN",la:25.0219,lo:98.4955,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"芒市",ne:"Mangshi",c:"CN",la:24.4341,lo:98.5882,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"孟连",ne:"Menglian",c:"CN",la:22.3292,lo:99.5853,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"勐海",ne:"Menghai",c:"CN",la:21.9578,lo:100.4524,lang:"zh-CN",greeting:"你好",tier:5},
    {n:"勐腊",ne:"Mengla",c:"CN",la:21.4591,lo:101.5646,lang:"zh-CN",greeting:"你好",tier:5},
];
