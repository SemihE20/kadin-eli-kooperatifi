-- ==========================================
-- Gözler Kadıneli Kooperatifi — Başlangıç Verileri
-- Supabase SQL Editor'de çalıştırın (tüm migration'lardan sonra)
-- ==========================================


-- ==========================================
-- ÜRÜNLER
-- ==========================================
INSERT INTO public.products
  (name, slug, description, price, compare_at_price, category_id, category,
   stock_quantity, is_active, is_featured, is_seasonal,
   season_info, usage_info, storage_info, weight, image_url)
SELECT
  v.name, v.slug, v.description, v.price, v.compare_at_price,
  (SELECT id FROM public.categories WHERE slug = v.cat_slug LIMIT 1),
  v.cat_slug,
  v.stock_quantity, v.is_active, v.is_featured, v.is_seasonal,
  v.season_info, v.usage_info, v.storage_info, v.weight, v.image_url
FROM (VALUES
  (
    'Doğal Çam Balı (850g)', 'dogal-cam-bali',
    'Uludağ eteklerinden toplanan saf çam balı. Hiçbir katkı maddesi içermez. Kooperatifimizin en çok tercih edilen ürünlerinden biri olan çam balımız, doğal ortamında arılar tarafından üretilmiş ve hiçbir işlemden geçirilmeden sizlere ulaştırılmaktadır.',
    450.00, 520.00, 'gida', 25, true, true, true,
    'Temmuz - Ağustos',
    'Sabahları aç karna 1 tatlı kaşığı tüketilebilir. Çaylara tatlandırıcı olarak eklenebilir.',
    'Oda sıcaklığında, güneş almayan yerde saklayın. Buzdolabına koymayın.',
    850, '/images/placeholder.jpg'
  ),
  (
    'Kekik Yağı (50ml)', 'kekik-yagi',
    'El distilasyonu ile elde edilmiş saf Türk kekik uçucu yağı. Antibakteriyel ve antifungal özellikleriyle öne çıkar.',
    120.00, NULL, 'bitki', 40, true, true, false,
    NULL,
    'Seyreltilerek (baz yağla 1:10) cilt bakımında veya aromaterapi difüzöründe kullanın.',
    'Serin ve karanlık yerde, ağzı kapalı, cam şişede saklayın.',
    50, '/images/placeholder.jpg'
  ),
  (
    'Lavanta Sabunu (3''lü Set)', 'lavanta-sabunu',
    'Organik lavanta yağı ile yapılmış el yapımı katı sabun seti. Hassas ciltler için uygundur.',
    180.00, NULL, 'bitki', 30, true, true, false,
    NULL,
    'Günlük kullanıma uygundur.',
    'Kuru ve serin yerde saklayın.',
    300, '/images/placeholder.jpg'
  ),
  (
    'Ev Yapımı Domates Sosu (720ml)', 'domates-sosu',
    'Bahçemizin taze domateslerinden, hiçbir katkı maddesi olmadan hazırlanmış sos. Geleneksel tarif, modern lezzet.',
    120.00, NULL, 'gida', 50, true, false, true,
    'Ağustos - Eylül',
    'Kızartma, makarna ve et yemeklerinde kullanabilirsiniz.',
    'Açılmamış kavanozu serin yerde saklayın. Açıldıktan sonra buzdolabında 1 hafta.',
    720, '/images/placeholder.jpg'
  ),
  (
    'Zeytin Fidanı (Gemlik)', 'zeytin-fidani',
    '2-3 yaşında, kök kütlesi sağlam Gemlik zeytini fidanı. Hem bahçe hem de büyük saksı için uygundur.',
    250.00, NULL, 'fidan', 15, true, true, true,
    'Şubat - Nisan',
    'Güneşli, rüzgarsız bir konuma dikin. İlk yıl düzenli sulama yapın.',
    'Alındıktan sonra en kısa sürede dikin.',
    3500, '/images/placeholder.jpg'
  ),
  (
    'Defne Yaprağı (100g)', 'defne-yapragi',
    'Gölgede kurutulmuş, aroması korunmuş doğal defne yaprağı. Yemeklere ve çaylara eklenebilir.',
    45.00, NULL, 'bitki', 60, true, false, false,
    NULL,
    'Yemeklere, çaylara veya doğal deterjan yapımında ekleyin.',
    'Kapalı, hava geçirmez kapta saklayın.',
    100, '/images/placeholder.jpg'
  ),
  (
    'Ev Yapımı Erişte (500g)', 'ev-yapimi-eriste',
    'Köy yumurtası ve un ile elle açılmış geleneksel Anadolu erişte. Makine değil, el emeği.',
    85.00, NULL, 'gida', 35, true, false, false,
    NULL,
    'Kaynar tuzlu suda 8-10 dakika pişirin.',
    'Serin, kuru ve hava geçirmez yerde saklayın.',
    500, '/images/placeholder.jpg'
  ),
  (
    'Limon Fidanı', 'limon-fidani',
    'Saksı ve bahçe için uygun, 1-2 yaşında limon fidanı. Akdeniz ikliminde ve korunaklı ortamlarda iyi gelişir.',
    180.00, NULL, 'fidan', 8, true, false, true,
    'Mart - Mayıs',
    'Tam güneş alan, dondan korunan bir konuma yerleştirin.',
    'Alındıktan sonra en kısa sürede dikin.',
    2000, '/images/placeholder.jpg'
  ),
  (
    'Nane Çayı (50g)', 'nane-cayi',
    'Kendi bahçemizde yetiştirilmiş, gölgede kurutulmuş taze nane. Sindirim ve baş ağrısına iyi gelir.',
    35.00, NULL, 'bitki', 80, true, false, false,
    NULL,
    '1 çay kaşığı 200 ml kaynar suda 5 dakika demleyin.',
    'Kuru ve hava geçirmez kapta saklayın.',
    50, '/images/placeholder.jpg'
  ),
  (
    'Ihlamur Çayı (40g)', 'ihlamur-cayi',
    'Doğadan toplanmış, kurutulmuş ihlamur çiçeği ve yaprağı. Rahatlatıcı ve uyku düzenleyici.',
    40.00, NULL, 'bitki', 70, true, false, true,
    'Haziran - Temmuz',
    'Gece uyku öncesi 1 bardak için.',
    'Kuru ve hava geçirmez kapta saklayın.',
    40, '/images/placeholder.jpg'
  ),
  (
    'Organik Reçel Seti (3''lü)', 'organik-recel-seti',
    'İncir, dut ve kivi reçelinden oluşan el yapımı organik reçel seti. Şeker oranı düşük, meyve aroması yüksek.',
    220.00, 270.00, 'gida', 20, true, true, false,
    NULL,
    'Kahvaltıda, tostlarda veya atıştırmalık olarak tüketin.',
    'Açılmamış reçeli serin yerde saklayın. Açıldıktan sonra buzdolabında 3 ay.',
    750, '/images/placeholder.jpg'
  ),
  (
    'Kuru Domates (250g)', 'kuru-domates',
    'Güneşte kurutulmuş, salamura edilmemiş doğal kuru domates. Yoğun lezzet, uzun raf ömrü.',
    95.00, NULL, 'gida', 45, true, false, true,
    'Ağustos - Eylül',
    'Zeytinyağına yatırarak veya direkt salatalarda, makarnalarda kullanın.',
    'Hava geçirmez kapta, serin ve karanlık yerde saklayın.',
    250, '/images/placeholder.jpg'
  )
) AS v(name, slug, description, price, compare_at_price, cat_slug,
       stock_quantity, is_active, is_featured, is_seasonal,
       season_info, usage_info, storage_info, weight, image_url)
ON CONFLICT (slug) DO NOTHING;


-- ==========================================
-- BLOG YAZILARI
-- ==========================================
INSERT INTO public.posts
  (title, slug, summary, content, category, author, read_time, is_published, published_at)
VALUES
(
  'Evde Hazırlayabileceğiniz 5 Sağlıklı Bitki Çayı Karışımı',
  'dogal-bitki-cayi-karisimlari',
  'Kekik, nane, lavanta ve daha fazlasını bir araya getirerek evinizde kolayca doğal çay karışımları hazırlayabilirsiniz.',
  'Doğal bitkisel çaylar hem sağlık hem de ruh hali üzerinde inanılmaz faydalar sağlar. Kooperatifimizin ürettiği tıbbi bitkilerden yola çıkarak evde kolayca hazırlayabileceğiniz 5 farklı çay karışımını sizinle paylaşmak istiyoruz.

**1. Rahatlatıcı Lavanta-Nane Karışımı**

Gece uyku öncesi için ideal olan bu karışım, zihinsel stresi azaltmaya yardımcı olur. 1 tatlı kaşığı kurutulmuş lavanta çiçeği ve 1 tatlı kaşığı nane yaprağını 200 ml kaynar suda 5-7 dakika demlendirin.

**2. Bağışıklık Güçlendirici Kekik-Zencefil**

Özellikle kış aylarında tüketilmesi önerilen bu çay, antioksidanlar açısından zengindir. Taze zencefil dilimleri ile kekik yaprağını birleştirin.

**3. Sindirim Düzenleyici Rezene-Papatya**

Yemek sonrası tüketim için ideal. Rezene tohumları ile papatya çiçeklerini eşit oranda karıştırın ve 10 dakika demleyin.

**4. Enerji Verici Kuşburnu-Hibiskus**

C vitamini bakımından zengin bu karışım, sabahları kahve yerine tercih edilebilir. Kırmızı-pembe rengi ve ekşimsi tadıyla özel bir içecek deneyimi sunar.

**5. Detoks Karışımı: Isırgan-Karahindiba**

İlkbahar detoksu için mükemmel olan bu karışım, karaciğeri destekler ve vücuttan toksinlerin atılmasına yardımcı olur.

**Demleme İpuçları**

Tüm bitkisel çayları kaynayan değil, kaynamak üzere olan (90-95°C) suda demleyin. Bu, uçucu yağların ve aktif bileşiklerin korunmasını sağlar. Demlik yerine kapaklı bir kap kullanın.',
  'Doğal Yaşam', 'Fatma Hanım', 4, true, '2025-06-20'
),
(
  'Zeytin Fidanı Dikim ve Bakım Rehberi: Başlangıçtan Hasada',
  'zeytin-fidani-dikimi-rehberi',
  'Zeytin fidanı seçiminden dikime, sulamadan budamaya kadar bilmeniz gereken her şey bu kapsamlı rehberde.',
  'Zeytin ağacı, Akdeniz havzasının simgesi olarak binlerce yıllık bir tarihe sahiptir. Doğru dikimden itibaren sabırla bakıldığında ömür boyu ürün verebilecek bu ağaçları yetiştirmek, hem geleneksel bilgiyi yaşatmak hem de sürdürülebilir bir yaşam tarzı benimsemek anlamına gelir.

**Fidan Seçimi**

Kooperatifimizden temin edebileceğiniz Gemlik ve Memecik çeşitleri, Türkiye iklimine en uygun varyetelerin başında gelir. 2-3 yaşında, kök kütlesi sağlam, yaprakları canlı yeşil fidanları tercih edin.

**Dikim Zamanı**

En uygun dikim dönemi Şubat-Nisan aylarıdır. Don riskinin geçtiği, toprağın ısındığı bu dönemde dikilen fidanlar daha kolay tutunur.

**Dikim Tekniği**

- Çukurun derinliği en az 60 cm, genişliği 80 cm olmalıdır
- Alt kısmına iyi yanmış çiftlik gübresi karıştırılmış toprak koyun
- Fidan kök boğazı toprak seviyesinde kalacak şekilde yerleştirin
- Dikim sonrası bol su verin

**Sulama**

İlk 2 yılda düzenli sulama kritik öneme sahiptir. Haftada 1-2 kez, dip sulama yöntemiyle sulayın. Olgunlaşmış ağaçlar kuraklığa dayanıklıdır.

**Budama**

Her yıl Ocak-Şubat aylarında hafif budama yapın. Havalanmayı artıracak şekilde iç dalları temizleyin.',
  'Bahçıvanlık', 'Zeynep Hanım', 7, true, '2025-06-10'
),
(
  'Kooperatifimizin Özel Ev Yapımı Domates Sosu Tarifi',
  'ev-yapimi-domates-sosu-tarifi',
  'Yazın bolluğunu kışa taşıyan geleneksel domates sosu yapımının sırrını paylaşıyoruz. Az malzeme, büyük lezzet.',
  'Annelerimizden öğrendiğimiz, nesiller boyu aktarılan bu tarif, taze domates bolluğunu yıl boyu sofranıza taşır. Kooperatifimizin ürettiği domateslerden hazırladığımız sos, hiçbir katkı maddesi içermez.

**Malzemeler (5 litre sos için)**

- 10 kg olgun domates
- 3 yemek kaşığı tuz
- 1 çorba kaşığı şeker (opsiyonel)
- 5-6 fesleğen yaprağı

**Hazırlanışı**

1. Domatesleri iyice yıkayın, sap kısımlarını çıkarın
2. Blender veya domates sıkacağında geçirin
3. Geniş bir tencereye alın, orta ateşte kaynatmaya başlayın
4. Köpükleri alın, tuz ve şekeri ekleyin
5. Sürekli karıştırarak 45-60 dakika pişirin; sos koyulaşana kadar devam edin
6. Sterilize edilmiş kavanozlara doldurun
7. Kapakları sıkıca kapatın, ters çevirin ve soğumaya bırakın

**Saklama**

Serin ve karanlık bir ortamda 12 aya kadar saklanabilir. Açıldıktan sonra buzdolabında 1 hafta tazeliğini korur.

**İpucu**

En lezzetli sos, domates mevsiminin doruk noktası olan Ağustos ortasında yapılır. Domateslerin iyice olgunlaşmış, güneşte kızarmış olması tadı belirleyen en önemli faktördür.',
  'Reçeteler', 'Ayşe Hanım', 5, true, '2025-05-28'
),
(
  'Küçük Bir Balkon veya Bahçede Lavanta Yetiştiriciliği',
  'lavanta-bahcesi-kurma',
  'Lavanta yetiştirmek için geniş bir alana ihtiyacınız yok. Saksıda bile mükemmel lavanta bahçesi kurabilirsiniz.',
  'Lavanta, hem görsel güzelliği hem de kokusuyla bahçelerin vazgeçilmez bitkilerinden biridir. Rahatlatıcı aroması, tıbbi özellikleri ve her ortama uyum sağlayan yapısıyla küçük bahçelerden geniş arazilere kadar her yerde yetişebilir.

**Yer Seçimi**

Lavanta, tam güneş ışığı alan ve iyi drene edilmiş toprakları sever. Günde en az 6 saat doğrudan güneş alması idealdir.

**Toprak Hazırlığı**

Killi ve nemli topraklara kum veya iri çakıl karıştırın. Lavanta, alkali (pH 6.5-7.5) toprakları tercih eder.

**Saksıda Yetiştirme**

- En az 30 cm çapında, drenaj delikli saksı seçin
- Saksı toprağının 1/3''ünü perlit veya kum ile karıştırın
- Saksının altına iri taş veya çakıl koyun

**Sulama**

Az sulayın. Fazla su, kök çürümesine neden olur. Toprağın üst 5 cm''si tamamen kuruyunca sulayın.

**Hasat**

Çiçek tomurcukları açmaya başladığında hasada başlayın. Sabah erken saatlerde kesin.',
  'Bahçıvanlık', 'Zeynep Hanım', 5, true, '2025-05-15'
),
(
  'Çam Balı ile 3 Nefis Tatlı Tarifi',
  'cam-bali-ile-tatlilar',
  'Rafine şeker yerine saf çam balı kullanarak hem sağlıklı hem lezzetli tatlılar yapabilirsiniz.',
  'Çam balı, yoğun aroması ve zengin mineral içeriğiyle tatlılara rafine şekerden çok daha derin bir lezzet katar. Glikemik indeksi şekere göre daha düşük olan bal, bilinçli beslenenlerin tercih ettiği doğal tatlandırıcıların başında gelir.

**1. Bal Tatlısı (Tek Malzeme)**

- 200g ceviz içi veya fındık
- 4 yemek kaşığı çam balı
- İsteğe bağlı: tarçın

Cevizleri küçük parçalara bölün, üzerine ılık balı gezdirin. Servis tabağına alın, tarçın serpin. 10 dakika bekletip servis edin.

**2. Baklava Soslu Gözleme**

- 2 su bardağı un, 1 su bardağı ılık su, tuz
- İç harcı: beyaz peynir veya ceviz
- Sos: 3 yemek kaşığı çam balı, 1 yemek kaşığı tereyağı

Gözlemeyi kızartın, üzerine eritilmiş tereyağı ve çam balı karışımını gezdirin.

**3. Sütlü Bal Muhallebisi**

- 1 lt süt, 3 yemek kaşığı nişasta, 3 yemek kaşığı çam balı
- Süslemek için: tarçın, ceviz

Nişastayı soğuk sütte eritin, ocakta karıştırarak pişirin. Bal ekleyip ateşten alın, kaplara paylaştırın.',
  'Reçeteler', 'Ayşe Hanım', 6, true, '2025-05-05'
),
(
  'Evde Doğal Temizlik Ürünleri Yapımı: Kimyasalsız Yaşam',
  'dogal-temizlik-urunleri',
  'Tıbbi bitkiler ve doğal malzemelerle kendi temizlik ürünlerinizi yaparak hem sağlığınızı hem çevreyi koruyun.',
  'Marketlerde satılan temizlik ürünleri, onlarca kimyasal bileşen içerir. Bunların birçoğu hem ev halkının sağlığını hem de çevreyi olumsuz etkiler. Kooperatifimizin bitkilerini kullanarak evinizde kolayca hazırlayabileceğiniz, doğal ve etkili temizlik ürünleri yapabilirsiniz.

**Çok Amaçlı Sprey**

- 250 ml su
- 250 ml beyaz sirke
- 15 damla lavanta veya çay ağacı yağı
- 10 damla kekik yağı

Hepsini bir sprey şişesine doldurun. Mutfak tezgahları, banyo yüzeyleri ve kapı kollarında kullanabilirsiniz.

**Kireç Çözücü**

- Beyaz sirke (seyreltilmemiş)
- Limon suyu

Lavaboya döküp 30 dakika bekletin, fırçayla temizleyin.

**Doğal Çamaşır Suyu Alternatifi**

- 1 lt su
- 100 ml hidrojen peroksit (%3)
- 20 damla lavanta yağı

Beyaz kumaşları beyazlatmak ve dezenfekte etmek için çamaşır suyuna alternatif olarak kullanın.

**Önemli Notlar**

Doğal ürünlerde bekleme süresi kimyasal ürünlerden daha uzundur. Kekik ve çay ağacı yağı güçlü antibakteriyeldir; doğrudan cilde uygulamayın.',
  'Doğal Yaşam', 'Fatma Hanım', 6, true, '2025-04-22'
),
(
  'Kekik Yağının Bilinmeyen 7 Faydası ve Kullanım Alanları',
  'kekik-yaginin-faydalari',
  'Antibakteriyel, antifungal ve antioksidan özellikleriyle kekik yağı nasıl kullanılır? Uzman tavsiyeleri ile kapsamlı rehber.',
  'Kekik yağı, doğanın sunduğu en güçlü doğal ilaçlardan biridir. Ana etken maddesi olan timol, bilimsel çalışmalarla kanıtlanmış antibakteriyel ve antifungal özelliklere sahiptir.

**1. Doğal Antibiyotik**

Kekik yağı, gram pozitif ve gram negatif bakterilere karşı etkilidir. Enfeksiyonlarda baz yağla seyreltilerek bölgesel uygulanabilir.

**2. Bağışıklık Sistemi Güçlendirici**

İçeriğindeki karvakrol, vücudun savunma mekanizmasını destekler. Kış aylarında difüzörde kullanımı önerilir.

**3. Sindirim Düzenleyici**

Gaz, şişkinlik ve hazımsızlık şikayetlerinde karın bölgesine seyreltilerek uygulanabilir.

**4. Saç ve Saç Derisi Bakımı**

Kepek ve saç dökülmesinde zeytinyağına 5-10 damla ekleyerek saç derisine masaj yapın.

**5. Ağız Bakımı**

1 bardak ılık suya 2 damla ekleyerek gargara yapın. Diş eti problemlerine iyi gelir.

**6. Ev Temizliği**

Temizlik sularına eklendiğinde güçlü bir dezenfektan görevi görür.

**7. Böcek Kovucu**

Lavanta yağıyla karıştırılıp sulandırılarak giysilere veya cilde sürülebilir.

**Güvenli Kullanım**

Hiçbir zaman seyreltmeden uygulamayın. Hamile ve emziren anneler kullanmadan önce doktora danışmalıdır.',
  'Doğal Yaşam', 'Fatma Hanım', 5, true, '2025-04-10'
),
(
  'Mevsiminde Yemenin Önemi: Mevsimlik Ürünler Rehberi',
  'mevsimlik-urunler-rehberi',
  'Her meyve ve sebzenin kendi mevsiminde tüketilmesi hem sağlık açısından hem de çevre açısından neden önemli?',
  'Günümüzde süpermarketlerde her ürün yıl boyunca bulunabilmektedir. Ama bu durum, "her şeyin her zaman taze" olduğu anlamına gelmez. Mevsiminde yetişmeyen ürünler ya sera ortamında üretilir ya da soğuk zincirde aylarca bekletilir.

**Neden Mevsiminde Tüketelim?**

Mevsiminde toplanan ürünler tam olgunluğa ulaştığı için hem besin değeri hem de lezzet açısından üstündür. Dışarıdan getirilen veya sera ürünleri, hasat öncesi toplanan ve olgunlaşmadan sofralarımıza ulaşan ürünlerdir.

**İlkbahar (Mart - Mayıs)**

- Ispanak, semizotu, radika
- Çilek, vişne
- Kuşkonmaz, bezelye

**Yaz (Haziran - Ağustos)**

- Domates, biber, patlıcan, kabak
- Şeftali, kayısı, karpuz
- Fasulye, mısır

**Sonbahar (Eylül - Kasım)**

- Elma, armut, ayva
- Balkabağı, kereviz
- Mantar, nar

**Kış (Aralık - Şubat)**

- Portakal, mandalina, greyfurt
- Pırasa, ıspanak, lahana
- Kivi, nar

**Kooperatif Yaklaşımı**

Biz yalnızca mevsiminde ürün satıyoruz. Bu politikamız çevre açısından sürdürülebilirliği desteklerken sizlere en taze ve besleyici ürünleri sunmamızı sağlıyor.',
  'Doğal Yaşam', 'Zeynep Hanım', 4, true, '2025-03-25'
)
ON CONFLICT (slug) DO NOTHING;
