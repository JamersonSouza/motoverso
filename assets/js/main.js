$(document).ready(function (){
    catalog.events.init();
});

var catalog = {};

var MY_CAR = [];

catalog.events = {
    
    init: () => {
        catalog.metods.getItensCatalog();
    }

}
catalog.metods = {

    getItensCatalog: (categoria = 'bauletos', verMais = false) => {
        var filter = CATALOGO[categoria];
        console.log('AQUI: ', filter);

        if(!verMais){
            $("#itemsCatalog").html('');
            $("#btnVerMais").removeClass('hidden');
        }


        $.each(filter, (i, e) => {
            let template = catalog.templates.item.replace(/\${imgs}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${id}/g, e.id)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));

            if(verMais && i >= 4 && i < 12){
                $("#itemsCatalog").append(template)
            }
            if(!verMais &&  i < 4){
                $("#itemsCatalog").append(template)
            }

        })

        $('.container-categorias a').removeClass('ativo');
        $('#list-' + categoria).addClass('ativo');
    },

    verMais: () => {
        let isAtivo = $(".container-categorias a.ativo").attr('id').split('list-')[1];
        catalog.metods.getItensCatalog(isAtivo, true);

        $('#btnVerMais').addClass('hidden');
    },

    lessQuantity: (id) => {
        let quantityCurrent = parseInt($("#qtd-" + id).text());
        if(quantityCurrent > 0){
            $("#qtd-" + id).text(quantityCurrent - 1)
        }
        console.log('Teste Quantidade: ', quantityCurrent);
    },

    plusQuantity: (id) => {
        let quantityCurrent = parseInt($("#qtd-" + id).text());
        $("#qtd-" + id).text(quantityCurrent + 1)
    },

    addItensCar: (id) => {
        let quantityCurrent = parseInt($("#qtd-" + id).text());
        if(quantityCurrent > 0){
            // get item catalog active
            let isAtivo = $(".container-categorias a.ativo").attr('id').split('list-')[1];

            //get list itens
            var filter = CATALOGO[isAtivo];

            // get current item
            let item = $.grep(filter, function(e, i){
                return e.id == id
            });
            if(item.length > 0){

                //validation is exist item in car

                let exist = $.grep(MY_CAR, function(element, index) {
                    return element.id == id;
                });
                //case item exist, only change quantity
                if(exist.length > 0){  
                    let positionIndexInCar =  MY_CAR.findIndex((obj => obj.id == id));
                    //get quantity exist and sum with quantityCurrent
                    MY_CAR[positionIndexInCar].qtdAdd = MY_CAR[positionIndexInCar].qtdAdd + quantityCurrent;
                }else{//case not exist item in car, add 
                    item[0].qtdAdd = quantityCurrent;
                    MY_CAR.push(item[0]);
                }
                $("#qtd-" + id).text(0);

                catalog.metods.globalMessage("Item adicionado ao carrinho");
                catalog.metods.updateBadgeCar();
            }
        }
    },

    globalMessage: (textMessage, color = 'red', time = 4000) => {
        let idMessage = Math.floor(Date.now() * Math.random()).toString();
        let message = `<div id="msg-${idMessage}" class="animated fadeInDown toast ${color}">${textMessage}</div>`
        $("#container-messages").append(message);
        
        setTimeout(() => {
            $("#msg-"+idMessage).removeClass('fadeInDown');
            $("#msg-"+idMessage).addClass('fadeOutUp');
            $("#msg-"+idMessage).remove();
        }, time)
    },

    // update value total for car
    updateBadgeCar: () => { 
        let total = 0;
        $.each(MY_CAR, (i, e) => {
            total+=e.qtdAdd;
        });

        if(total > 0){
            $(".btn-car").removeClass('hidden');
            $(".container-badges").removeClass('hidden');
        }else{
            $(".btn-car").addClass('hidden');
            $(".container-badges").addClass('hidden');
        }

        $(".badges-car").html(total);
    },
}

catalog.templates = {

    item:`
    <div class="col-12 col-lg-3 col-md-3 col-sm-6">
        <div class="card card-item" id="\${id}">
                <div class="img-catalog text-center">
                    <img src="\${imgs}" width="200px" alt="bauleto para moto pro tork 80 litros">
                        </div>
                            <p class="title-catalog text-center mt-4">
                                <strong>\${name}</strong>
                            </p>
                            <p class="price-catalog text-center">
                                <strong>R$ \${price}</strong>
                            </p>
                            <div class="add-car">
                    <span class="btn-less" onclick="catalog.metods.lessQuantity('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="btn-number-itens" id="qtd-\${id}"><strong>0</strong></span>
                    <span class="btn-plus" onclick="catalog.metods.plusQuantity('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="catalog.metods.addItensCar('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

}