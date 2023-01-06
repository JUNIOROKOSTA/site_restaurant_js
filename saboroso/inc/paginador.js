var conn = require("./db");

class Pagination{
    constructor(
        query,
        params = [],
        itensPerPage =10
    ){
        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;

        this.init();
    }

    init(){

    };;

    getPage(pagina){
        this.currentPage = pagina -1;

        this.params.push(
            this.currentPage * this.itensPerPage,
            this.itensPerPage
        );

        return new Promise((resolve, reject)=>{
            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), 
                        this.params, (err, results)=>{
                if(err){
                    reject(err);
                } else{

                    this.data= results[0];
                    this.total= results[1][0].FOUND_ROWS;
                    this.totalPages= Math.ceil(results[1][0].FOUND_ROWS / this.itensPerPage);

                    this.currentPage++;

                    resolve(this.data)


                    // resolve({
                    //     data: results[0],
                    //     currentPage: this.currentPage,
                    //     totalRegistes: results[1][0].FOUND_ROWS,
                    //     totalPages: results[1][0].FOUND_ROWS / this.itensPerPage
                    // });
                }
            });
        })

    };;

    getTotal(){
        return this.total;
    };;

    getCurrentPage(){
        return this.currentPage;
    };;

    getTotalPages(){
        return this.totalPages;
    };;
}
module.exports = Pagination;