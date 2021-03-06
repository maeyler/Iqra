"use strict";

/** Sura names in Turkish -- 1-114 */
const sName
=["","Fatiha","Bakara","Ali İmran","Nisa","Maide","Enam","Araf","Enfal",
"Tevbe","Yunus","Hud","Yusuf","Rad","İbrahim","Hicr","Nahl","İsra","Kehf"
,"Meryem","Taha","Enbiya","Hacc","Muminun","Nur","Furkan","Şuara","Neml"
,"Kasas","Ankebut","Rum","Lokman","Secde","Ahzab","Sebe","Fatır","Yasin"
,"Saffat","Sad","Zümer","Mümin","Fussilet","Şura","Zuhruf","Duhan","Casiye"
,"Ahkaf","Muhammed","Fetih","Hucurat","Kaf","Zariyat","Tur","Necm","Kamer"
,"Rahman","Vakıa","Hadid","Mücadele","Haşr","Mümtahine","Saff","Cuma"
,"Münafikun","Tegabun","Talak","Tahrim","Mülk","Kalem","Hakka","Mearic"
,"Nuh","Cinn","Müzzemmil","Müddessir","Kıyamet","İnsan","Mürselat","Nebe"
,"Naziat","Abese","Tekvir","İnfitar","Mutaffifin","İnşikak","Buruc","Tarık"
,"Ala","Gaşiye","Fecr","Beled","Şems","Leyl","Duha","İnşirah","Tin","Alak"
,"Kadir","Beyyine","Zilzal","Adiyat","Karia","Tekasur","Asr","Hümeze","Fil"
,"Kureyş","Maun","Kevser","Kafirun","Nasr","Leheb","İhlas","Felak","Nas"]

/** Sura names in Arabic */
const aName 
=  ["","الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام"
,"الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","ابراهيم"
,"الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج"
,"المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت"
,"الروم","لقمان","السجدة","الأحزاب","سبإ","فاطر","يس","الصافات","ص"
,"الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف"
,"محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر"
,"الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف"
,"الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم"
,"الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الانسان"
,"المرسلات","النبإ","النازعات","عبس","التكوير","الإنفطار","المطففين"
,"الإنشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس"
,"الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة"
,"العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش"
,"الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"]

/**
 * Global array to hold the index numbers of Sajda.
 * 
 * sajdaX.map(i => pageOf(c=toChapter(i), i-last[c-1]))
 * gives sajdaP used in mujam.js
 */
const sajdaX = [1160, 1722, 1950, 2138, 2308, 2613, 2915, 
                3184, 3518, 3994, 4255, 4846, 5905, 6125]

/** Reads a text file -- Quran translation
 *  one line for each verse that begins with "c|v|"
 * 
 *  Usage: kur = new KuranText('tr.yazir.txt', initialPage)
 *    kur.loaded, kur.getVerse(i),  kur.pageToHTML(p)
 */
class KuranText {
    constructor(url, callback) {
      let setLine = (v, txt) => v+'. '+txt
      //cannot use function because of "this"
      let process = (tt) => {
        // insert an empty line a[0]
        let a = ('\n'+tt).split('\n')
        //trim the credits at the end
        a.length = nVerse+1 //6236+1
        let num = 0;
        let [ ,v0, t0] = a[1].split('|')
        for (let i=1; i<nVerse; i++) {
          let [ ,v1, t1] = a[i+1].split('|')
          if (t1 == t0) num++
          else if (num==0) a[i] = setLine(v0, t0)
          else { //num>0
            a[i] = setLine((v0-num)+'-'+v0, t0)
            while (num>0) { a[i-num] = num; num-- }
          }
          v0 = v1; t0 = t1
        }
        a[nVerse] = setLine(v0, t0)
        for (let i of sajdaX) a[i] += this.secde 
        this.data = a; this.loaded = true
        console.log(this.url, a.length)
        if (callback) callback(a)
      }
        this.url = url; this.data = []
        if (!url.startsWith('http'))
          url = 'https://maeyler.github.io/BahisQurani/data/'+url
        fetch_text_then(url, process)
    }
    chapName(c)   { return '('+c+') '+sName[c]+' Suresi' }
    get besmele() { return 'Bismillahirrahmanirrahim' }
    get secde()   { return ' [S] ' }
    verseToHTML(cls, s) {
      return '<span class="'+cls+'">'+s+'</span><BR>'
    }
    pageToHTML(p) {
      let toID = (c, v) => 'c'+c+'_'+v
      let newChapter = (c) => {
        out.push('<div class=divider>'+this.chapName(c)+'</div>')
        if (c!=1 && c!=9)
          out.push('<div class=besmele>'+this.besmele+'</div>')
      }
        let i = index[p]+1 //first verse on page
        let k = index[p+1] //last verse on page
        let out = [], num = 0;
        while (i <= k) { //for each verse x
          let [c, v] = toCV(i)
          if (v == 1) newChapter(c)
          let s = this.getVerse(i)
          if (typeof s == 'number') {
            num = s; i = i+s; continue 
          }
          let cls = toID(c, v)
          while (num>0) { cls += ' '+toID(c, v-num); num-- }
          out.push(this.verseToHTML(cls, s))
          i++
        }
        return out.join('\n')
    }
    getVerse(i) { return this.data[i] }
    toString() { return url }
}
/** Reads Quran text in Arabic */
class QuranText extends KuranText {
    constructor(url, callback) { super(url, callback) }
    /** override 4 methods below */
    chapName(c)   { return ' سورة '+aName[c] }
    get besmele() { return 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' }
    get secde()   { return ' ۩ ' }
    verseToHTML(cls, s) {
      let cv = cls.substring(1).replace('_', ':') 
      let [n, ...a] = s.split(/\.? /)  //divide into words
      let num = ' ﴿'+numberToArabic(n)+'﴾ '
      s = a.map(w => '<span>'+w+'</span>').join(' ')
        + '<span id=v='+cv+'>'+num+'</span>' 
      return '<span class='+cls+'>'+s+'</span>' //no <BR>
    }
}

/** Keeps data related to words and roots
 *  Usage: MD = new MujamData()
 *    MD.rootToList('mrj') => ["maraja", ...]
 *    MD.wordToRoot('maraja') => "mrj"
 * Ref: sitepoint.com/javascript-design-patterns-singleton/
 */
class MujamData {
  constructor(url, callback){
    let toWords = (t) => {
      for (let s of t.split('\n')) {
        let [root, ...L] = s.split(' ')
        //keep L in Buckwalter form
        this._root2List.set(root, L)
        for (let w of L) 
          this._word2Root.set(w, root)
      }
      this.loaded = true; Object.freeze(this)
      let n1 = this._root2List.size+' roots'
      let n2 = this._word2Root.size+' words'
      console.log('MujamData', n1, n2)
      if (callback) callback(t)
    }
    if (!MujamData.instance) { //singleton
      this._root2List = new Map()
      this._word2Root = new Map()
      fetch_text_then(url, toWords)
      MujamData.instance = this
    }
    return MujamData.instance
  }
  wordToRoot(w) { return this._word2Root.get(w) }
  rootToList(w) { return this._root2List.get(w) }
}

/** Keeps data related to similarity
 *  Usage: SD = new SimData()
 *    SD.similarTo(1) => [1, 223, ...]
 * Ref: sitepoint.com/javascript-design-patterns-singleton/
 */
class SimData {
  constructor(url, callback){
    let toWords = (t) => {
      let a = t.split('\n')
      for (let i=0; i<a.length; i++) {
        let s = a[i].trim()
        let k = s.indexOf(' ')
        let indx = cvToIndex(s.substring(0, k))
        this._data[indx] = s.substring(k+1)
      }
      this.loaded = true; Object.freeze(this)
      console.log('SimData', this._data.length+' verses')
      if (callback) callback(t)
    }
    if (!SimData.instance) { //singleton
      this._data = new Array(6237) // index 0 not used
      fetch_text_then(url, toWords)
      SimData.instance = this
    }
    return SimData.instance
  }
  similarTo(i) { return this._data[i] }
}

// export {sName, aName, KuranText, QuranText, MujamData, SimData }