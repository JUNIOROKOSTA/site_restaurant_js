class OkostaCrud{
    constructor(params){

        params.eventCustom = Object.assign({
            afterUpdateClick: (e)=>{
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e)=>{
                window.location.reload();
            },
            afterFormCreate: (e)=>{
                window.location.reload();
            },
            afterFormUpdate: (e)=>{
                window.location.reload();
            },
            beforeFormCreateError: (e)=>{
                alert("Erro no envio do formulário")
            },
            beforeFormUpdateError: (e)=>{
                alert("Erro ao atualizar o formulário")
            }
           
        }, params.eventCustom)

        this.params = Object.assign({},{
                    formCreate: '#modal-create form',
                    formUpdate: '#modal-update form',
                    btnDelete: 'btn-delete',
                    btnUpdate: 'btn-update'
                    },params);

        this.eventRows = [...document.querySelectorAll("table tbody tr")];
        this.initForm();
        this.initEventsBtn();
        
    }

    getTrData(e){
        let tr = e.closest('tr')

        return JSON.parse(tr.dataset.row);
    };;

    initForm(){
        
        this.formCreate = document.querySelector( this.params.formCreate);
        this.formUpdate = document.querySelector( this.params.formUpdate);
        
        if(this.formCreate){
            this.formCreate.save(
            {
            success:()=>{
                this.activeEvent("afterFormCreate");
            },
            failed: ()=>{
                 this.activeEvent("beforeFormCreateError")
            }
        })};

        if(this.formUpdate){
            this.formUpdate.save({
            success:()=>{
                this.activeEvent("afterFormUpdate");
            },
            failed: ()=>{
                 this.activeEvent("beforeFormUpdateError")
            }
        })}
    };;

    activeEvent(eventName, args){

        if(typeof(this.params.eventCustom[eventName]) === 'function'){
            this.params.eventCustom[eventName].apply(args)
        }
        
    };;

    btnEventDelete(btn){

         let data = this.getTrData(btn);

            if (confirm(eval("`" + this.params.deleteMsg + "`"))) {
            fetch(eval("`" + this.params.routerDelete + "`"), {
                method: 'DELETE'
            }).then(response => response.json())
                .then(json => { 
                    this.activeEvent("afterDeleteClick") 
                })
            }

    };;

    btnEventUpdate(btn){

        let data = this.getTrData(btn);

            for (let name in data) {
                this.params.onUpdateLoad(this.formUpdate, name, data);
            };

            this.activeEvent('afterUpdateClick', [btn])

    };;

    initEventsBtn(){

        this.eventRows.forEach(row=>{
            [...row.querySelectorAll(".btn")].forEach(btn=>{
                btn.addEventListener("click", e =>{

                    if(e.target.classList
                        .contains(this.params.btnDelete)){
                        this.btnEventDelete(btn);

                    } else if(e.target.classList
                        .contains(this.params.btnUpdate)){
                        this.btnEventUpdate(btn);

                    } else{
                        document.querySelector("#modal-update-password form [name=id]").value = this.getTrData(btn).id
                        this.activeEvent('atBtnClick', [e.target, this.getTrData(btn), e])
                    }

                })
            })
        });
    };;
}