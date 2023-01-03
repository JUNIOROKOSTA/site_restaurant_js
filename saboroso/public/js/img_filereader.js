class IMGFileReader{
    constructor(inputIMG, imgEl){
        this.inputIMG = inputIMG;
        this.imgEl = imgEl
        
        this.initEvents();
    }

    initEvents(){
        document.querySelector(this.inputIMG).addEventListener('change', e=>{
           this.reader(e.target.files[0]).then(result=>{
                document.querySelector(this.imgEl).src = result;
           }) 
        })
    }

    reader(file){

        return new Promise((resolve, reject)=>{
            let reader = new FileReader();
            reader.onload = function(){
                resolve(reader.result)
            }
            reader.onerror = function(){
                reject("Error IMGFileReader")
            }
            reader.readAsDataURL(file);


        })

        
    }

}