// Butonların Seçilip Değişkenlere Gönderilmesi //
const search = document.querySelector("input");
const form = document.querySelector("form");
const searchResults = document.querySelector(".results");
const errorMsg = document.querySelector(".alert");
const line = document.querySelector("hr");
//Api Keyinin değişkene atanması //
const apiURL =  "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=";

  //Formumuza bir eventlistener ekliyoruz. Web sitemiz çalıştığında kendiliğinden
  //birkaç olay tetiklenebilir. e.preventDefault ile bunu engelliyoruz.
form.addEventListener("submit", (e) => {
  e.preventDefault();
//SearchValue değişkenine, inputa girilen değeri aktarıyoruz ve diyoruz ki,
//inpputa girilen değer boşsa, bize bir hata değeri göster. değilse, 
//girilen değeri al. Bunları, errorMessage ve getResult adındaki iki fonksiyonla
//belirliyoruz.
  const searchValue = search.value;
  if (searchValue === "") {
    errorMessage("Search cannot be empty, please enter a search term.");
  } else {
    getResult(searchValue);
  }
});

// Error Message
//.style.display, bir HTML DOM özelliğidir. Aşağıda, errorMsg içindeki elementlerin block olarak gösterilmesini
//istedik. (Search, cannot be empty, please enter a search term yazısının yani.)
// En sonda ise, alınan hata mesajını, textContent özelliği ile, fonksiyonumuza parametre olarak atıyoruz.

function errorMessage(msg) {
  errorMsg.style.display = "block";
  line.style.display = "block";
  errorMsg.textContent = msg;
}

// Async await fonksiyonu kullanarak fetch ile veri çekmek.
//getResult asenkron bir fonksiyondur. içine searchVal parametresini koyduk
//response ile, fetch'le veri çekiyor ve gelen sonucu json formatına dönüştürüyoruz.
//Zira async fonksiyonlar bize bir promise döndürür.
async function getResult(searchVal) {
  const response = await fetch(apiURL + searchVal);
  const results = await response.json();

  console.log(results);
  //Bazen arama sonucunda  herhangi bir veriye ulaşamayabiliriz.
  //gelen veriyi, geliştirici modülünde incelediğimizde, içerisinde
  //query.search.length bölümünü görürüz.Bu kısım, arama sonucunda
  //elde edilen verinin, harf uzunluğunu verir. Onun sıfır olması,
  //gelen veri içerisinde, arattığımız şeyle alâkalı hiçbir bilgi olmamasının
  //işaretidir. Bu durumda, errorMessage fonksiyonu içerisinde, bir hata
  //mesajı yazdırmak istiyoruz. Değilse de, display results fonksiyonunu yazdır diyoruz.
  if (results.query.search.length == 0) {
    return errorMessage("Invalid search, please enter another search term.");
  } else {
    displayResults(results);
  }
}

// Display Results
//Gelen verileri hangi formatta göstereceğimizi belirleyelim.
//Önce, hr tagine sahip elementi, block olarak göster diyorum.
//Ardından çıktım, default olarak boş gelsin diyorum.
function displayResults(results) {
  line.style.display = "block";
  let output = "";
  //sonuçlarımdan gelen veriyi, forEach metoduyla döngüye sokuyorum.
  //Bu sayede, hepsine tek tek erişebileceğim.
  //Daha sonra, resultUrl değişkeni oluşturuyorum. Böylece, gelen veriye
  //göre, id ve başlık adını değişecek. Yani dinamik bir veri akışı
  //elde edeceğim Bunun için template literal
  //kullanıyorum ve linkimi backtick içinde yazıyorum.
  //Tüm bunları, index.html'de tasarladığım sonuç sayfamı buraya kopyalayarak
  //yapıyorum. Oluşturduğum şabona, url, tittle ve snippet çekiyorum.
  //output += ile ise şunu yapıyorum: sabit boş outpput stringimin içine
  //gelen veriyi ekle. 
  results.query.search.forEach((result) => {
    let resultURL = `https://en.wikipedia.org/?curid=${result.pageid}`;
    output += `
    <div class="result p-2">
    <a href="${resultURL}" target="_blank" rel="noopener" class="h3 fw-bold"
      >${result.title}</a
    >
    <br />
    <a
      href="${resultURL}"
      target="_blank"
      rel="noopener"
      class="fs-5 text-success"
      >${resultURL}</a
    >
    <p class="fs-5">
    ${result.snippet}
    </p>
  </div>
    `;
    searchResults.innerHTML = output;
  });
}
