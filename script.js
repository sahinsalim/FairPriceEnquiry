
//Mahalle adlarini bulunduran Set(aynı değerden sadece bir tane bulunabilir)
//Set containing neighbourhood names (only one of the same value can exist)
var mahalleAdlari=new Set();
var sokakAdlari=new Set();

//Yıl değerleriyle ilişkili json dosya isimleri 
//Json file names associated with year values
var fileNamesForYearValues={
    "2014": "sokaklar14.json",
    "2015": "sokaklar15.json",
    "2016": "sokaklar16.json",
    "2017": "sokaklar17.json",
    "2018": "sokaklar18.json",
    "2019": "sokaklar19.json",
    "2020": "sokaklar20.json",
    "2021": "sokaklar21.json",
    "2022": "sokaklar22.json",
    "2023": "sokaklar23.json",
    "2024": "sokaklar24.json",
    //"2025": "sokaklar25.json",
    
};

//Dosyalara ait verilerin ekleneceği üyeleri barındıran obje
//Object containing the members to which the data belonging to the files will be added
var jsonFiles=
{
    "sokaklar14.json":[],
    "sokaklar15.json":[],
    "sokaklar16.json":[],
    "sokaklar17.json":[],
    "sokaklar18.json":[],
    "sokaklar19.json":[],
    "sokaklar20.json":[],
    "sokaklar21.json":[],
    "sokaklar22.json":[],
    "sokaklar23.json":[],
    "sokaklar24.json":[],
  //"sokaklar25.json":[],

};


//HTML elementleri
//HTML elements
var resultList = document.getElementById('resultList')
var mahalleAdiElem = document.getElementById('mahalle')
var sokakAdiElem = document.getElementById('sokak')
var yil = document.getElementById('yil')


//Yıl değerlerini option olarak ekler
//Adds year values as option
Object.keys(fileNamesForYearValues).forEach(element=>{
    yil.innerHTML += `
    <option value='${element}'> ${element} </a>
    `

})

//Türkçe karakterleri büyük harflere dönüştürür.
//Converts Turkish characters to upper case.
String.prototype.turkishToUpper = function(){
	var string = this;
	var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
	string = string.replace(/(([iışğüçö]))/g, function(letter){ return letters[letter]; })
	return string;
}


//json dosyasındaki verileri okur mahalleler
//reads data from json file neighbourhoods
async function getData(filename="sokaklar22.json") // 2022 verileri şuanki yıl olduğu için default değer.
{
   if(jsonFiles[filename].length>0){
        //zaten eklenmiş verileri tekrar tekrar eklememize gerek yok 
        return;
   }
    var jsondata=await fetch(filename)
    .then(response => {
        return response.json();
    });
    
    for(mahalle of jsondata)
    {
        jsonFiles[filename].push(mahalle);
        mahalleAdlari.add(mahalle.mahalle);
    }

    mahalleAdiElem.innerHTML="";
    mahalleAdlari.forEach((mahalleAdiString)=>{
        mahalleAdiElem.innerHTML += 
        ` <option value='${mahalleAdiString}'> ${mahalleAdiString.turkishToUpper()} </option> `
    })

}

/* kullanıcının girdiği mahalle ve sokak adlarına göre bir JSON dosyasında arama yapar 
ve eşleşen sonuçları web sayfasında gösterir. Eğer hiç eşleşen sonuç bulunmazsa,
 kullanıcıya bir uyarı verir.

 Searches a JSON file according to the neighbourhood and street names entered by the user 
and displays the matching results on the web page. If no matching results are found,
 gives the user a warning.
*/
function search() {
    var checkList = 0;

    resultList.innerHTML = ""
    if ( mahalleAdiElem.value == "" || sokakAdiElem.value == "")
    {
        alert("Lütfen mahalle ve sokak adı seçiniz.")
        return;
    }

    var mahalleAdi = mahalleAdiElem.value.turkishToUpper()
    var sokakAdi = sokakAdiElem.value.turkishToUpper()

    

    jsonFiles[fileNamesForYearValues[yil.value]].forEach((jsonObject)=>{
        if(jsonObject.mahalle == mahalleAdi && jsonObject.sokak == sokakAdi )
        {
            resultList.innerHTML = `
            
                <li class="list-group-item"><b> Mahalle:</b> ${jsonObject.mahalle}</li>
                <li class="list-group-item"><b> Sokak:</b> ${jsonObject.sokak}</li>
                <li class="list-group-item"><b> Yıl:</b> ${jsonObject.yil}</li>
                <hr>          
                <li class="list-group-item"><b> Sokak m² Tutarı:</b> ${jsonObject.sokak_m2_tutari}₺ dir. </li>
            `
            checkList += 1;
        }
    });

    if(checkList == 0) {
        resultList.innerHTML = ""
        alert("Lütfen geçerli mahalle ve sokak adı giriniz")
    }

    mahalleAdlari.clear();
    sokakAdlari.clear();
    
}

/*
Bir mahalle seçildiğinde, bu mahalle ile ilişkilendirilmiş sokak adlarını dinamik olarak 
bir seçim listesine ekleyerek kullanıcıya seçenek sunar.

When a neighbourhood is selected, the street names associated with this neighbourhood are dynamically 
provides the user with a choice by adding it to a selection list.
*/
async function getSokakForMahalle(){

    sokakAdiElem.innerHTML = "";
    jsonFiles[fileNamesForYearValues[yil.value]].forEach((jsonObject)=>{
        if(jsonObject.mahalle.turkishToUpper()==mahalleAdiElem.value){

            sokakAdiElem.innerHTML +=`
            <option value='${jsonObject.sokak}'> ${jsonObject.sokak.turkishToUpper()} </option>
            `
            
        }
});  
}

/*
Bu olay dinleyici, mahalleAdiElem kullanıcı tarafından input olayı gerçekleştiğinde 
çalışacak olan getSokakForMahalle fonksiyonunu ekler.

This event listener, neighbourhoodAdiElem when the input event occurs by the user 
adds the getSokokForMahalle function that will run.
*/
mahalleAdiElem.addEventListener("input",getSokakForMahalle);


/*
Kullanıcının yıl girişi yaptığı bir durumda, ilgili yıla ait veriyi alır ve 
mahalle adlarına ait sokakları günceller.

In a situation where the user enters a year, it retrieves the data for the relevant year and 
updates the streets belonging to neighbourhood names.
*/
yil.addEventListener("input",async (event)=>{
    if(jsonFiles[fileNamesForYearValues[yil.value]]==undefined){
        alert("jsonFiles içerisinde bu dosya adına denk gelen bir üye yok\nDosya adı: "+fileNamesForYearValues[yil.value]);
       
        console.warn("jsonFiles içerisinde bu dosya adına denk gelen bir üye yok\n","Dosya adı:",fileNamesForYearValues[yil.value]);
        return;
    }
    await getData(fileNamesForYearValues[yil.value])
    getSokakForMahalle()

});