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

    getNavigation(params){
        let limitPages = 9;
        let nrStart = 0;
        let nrEnd = 0;

        if(this.getTotalPages() < limitPages){ 
            limitPages = this.getTotalPages();
        }

        // Verificar se a posição da pagina atual estar no inicio ou 
        // no final da quantidade de paginas geradas na consulta de registros.

        //Se estamos nas primeiras paginas.
        if((this.getCurrentPage() - parseInt(limitPages/2)) < 1){
            nrStart = 1;
            nrEnd = limitPages;
        } 

        //Se estamos nas ultimas paginas.
        else if((this.getCurrentPage() + parseInt(limitPages/2)) > this.getTotalPages()){
            nrStart= this.getTotalPages() - limitPages;
            nrEnd= this.getTotalPages();
        } 
        else {
            nrStart = this.getCurrentPage() - parseInt(limitPages/2);
            nrEnd = this.getCurrentPage() + parseInt(limitPages/2);
        }

        let links = [];

        if(this.getCurrentPage() > 1 ){ // Se a posição da paginal atual for maior que 1
            // sera inserido a informação de seta para esquerda e ação de ir para uma posição para trás .
            links.push({
                text:"<<",
                href:`?`+ this.getQueryString(
                    Object.assign({},params,{page:  this.getCurrentPage()-1}))
            })
        }

        for(let positionPage = nrStart; positionPage <= nrEnd; positionPage++){
            links.push({
                text: positionPage,
                href: `?`+ this.getQueryString(Object.assign(
                    {},params,{page: positionPage})),
                active: (positionPage === this.getCurrentPage())
            });
        };

        if(this.getCurrentPage() < this.getTotalPages() ){
            // Se a posição da paginal atual for menor o total de posições de paginas
            // sera inserido a informação de seta para direita e ação de ir para uma posição para frente .
            links.push({
                text:">>",
                href:`?`+ this.getQueryString(
                    Object.assign({},params,{page: this.getCurrentPage()+1}))
            })
        }

        return links;
    };;

    getQueryString(params){
        let queryString= [];

        for (let name in params){
            queryString.push(`${name}=${params[name]}`);
        };

        return queryString.join("&");
    };;
}
module.exports = Pagination;