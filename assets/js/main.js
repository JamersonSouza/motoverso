$(document).ready(function (){
    catalog.events.init();
    $('#cep').mask('00000-000');
});

var catalog = {};

var VALUE_CAR = 0;

var VALUE_DELIVERY = 5;

var MY_CAR = [];

var ADDRESS_CLIENT = null;

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

    globalMessage: (textMessage, color = 'green', time = 4000) => {
        let idMessage = Math.floor(Date.now() * Math.random()).toString();
        let message = `<div id="msg-${idMessage}" class="animated fadeInDown toast ${color}">${textMessage}</div>`
        $("#container-messages").append(message);
        
        setTimeout(() => {
            $("#msg-"+idMessage).removeClass('fadeInDown');
            $("#msg-"+idMessage).addClass('fadeOutUp');
            setTimeout(()=>{
                $("#msg-"+idMessage).remove();
            }, 800)
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

    openModalCar: (isOpen) => {
        if(isOpen){
            $('#modal-carrinho').removeClass('hidden');
            catalog.metods.loadingCar();
        }else{
            $('#modal-carrinho').addClass('hidden');
        }
    },

    loadingSteps: (step) => {
        if(step == 1){
            $("#title-stage").text('Seu carrinho: ');
            $("#items-car").removeClass('hidden');
            $("#delivery").addClass('hidden');
            $("#resume-car").addClass('hidden');

            $(".stage").removeClass('ativo');
            $(".stage1").addClass('ativo');

            $("#btnStageOrder").removeClass('hidden');
            $("#btnStageAddressOrder").addClass('hidden');
            $("#btnStageSendOrder").addClass('hidden');
            $("#btnBack").addClass('hidden');
        }else if(step == 2){
            $("#title-stage").text('Endereço de Entrega: ');
            $("#items-car").addClass('hidden');
            $("#delivery").removeClass('hidden');
            $("#resume-car").addClass('hidden');

            $(".stage").removeClass('ativo');
            $(".stage1").addClass('ativo');
            $(".stage2").addClass('ativo');

            $("#btnStageOrder").addClass('hidden');
            $("#btnStageAddressOrder").removeClass('hidden');
            $("#btnStageSendOrder").addClass('hidden');
            $("#btnBack").removeClass('hidden');
        }else{
            $("#title-stage").text('Resumo do Pedido: ');
            $("#items-car").addClass('hidden');
            $("#delivery").addClass('hidden');
            $("#resume-car").removeClass('hidden');

            $(".stage").removeClass('ativo');
            $(".stage1").addClass('ativo');
            $(".stage2").addClass('ativo');
            $(".stage3").addClass('ativo');

            $("#btnStageOrder").addClass('hidden');
            $("#btnStageAddressOrder").addClass('hidden');
            $("#btnStageSendOrder").removeClass('hidden');
            $("#btnBack").removeClass('hidden');
        }
    },

    backSteps:() => {
        let stepActive = $(".stage.ativo").length;
        catalog.metods.loadingSteps(stepActive - 1);

    },
    
    loadingCar:() => { //list itens car
        catalog.metods.loadingSteps(1);

        if(MY_CAR.length > 0){
            $("#items-car").html(''); //clean list
            $.each(MY_CAR, (i, e) => {
                let template = catalog.templates.itens_car.replace(/\${imgs}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qtdAdd}/g, e.qtdAdd)
                $("#items-car").append(template);

                if((i+1) == MY_CAR.length){
                    catalog.metods.calculatePriceCar();// calculate values the car
                }
            });
        }else{
            $("#items-car").html('<p class="car-is-empty"><i class="fa fa-shopping-bag icon-car-is-empty"></i> Seu carrinho encontra-se vazio.</p>');
            catalog.metods.calculatePriceCar();// calculate values the car
        }
    },

    //function for less quantity car
    lessQuantityCar: (id) => {
        let quantityCurrent = parseInt($("#qtd-car-" + id).text());
        if(quantityCurrent > 0){
            $("#qtd-car-" + id).text(quantityCurrent - 1);
            catalog.metods.updateCar(id, quantityCurrent - 1);

        }else{
            catalog.metods.removeItemCar(id);
        }
        console.log('Diminuindo Quantidade de itens d carrinho: ', quantityCurrent);

    },

    plusQuantityCar: (id) => {

        let quantityCurrent = parseInt($("#qtd-car-" + id).text());
        $("#qtd-car-" + id).text(quantityCurrent + 1)
        catalog.metods.updateCar(id, quantityCurrent + 1);
        console.log('aumentando quantidade de itens d carrinho: ', quantityCurrent+1);

    },

    removeItemCar: (id) => {//return list have not this id
        MY_CAR = $.grep(MY_CAR, (e, i) => { //filter return elements differents for id send
            return e.id != id;
        });
        catalog.metods.loadingCar();
        catalog.metods.updateBadgeCar();
    },

    updateCar: (id, qtdNew) => { //update car with qtd current

        let indexObj = MY_CAR.findIndex((obj => obj.id == id));
        MY_CAR[indexObj].qtdAdd = qtdNew;

        catalog.metods.updateBadgeCar(); //update button car
        catalog.metods.calculatePriceCar();// calculate values the car
    },

    calculatePriceCar: () => { //calculate values total car

        VALUE_CAR = 0;

        $("#partialAmount").text('R$ 0,00')
        
        $("#lblDelivery").text('+ R$ 0,00')
        
        $("#amount").text('R$ 0,00')

        $.each(MY_CAR, (i, e) => {
            VALUE_CAR += parseFloat(e.price * e.qtdAdd);
            if((i+1) == MY_CAR.length){
                $("#partialAmount").text(`R$ ${VALUE_CAR.toFixed(2).replace('.', ',')}`);
                $("#lblDelivery").text(`+ R$ ${VALUE_DELIVERY.toFixed(2).replace('.', ',')}`);
                $("#amount").text(`R$ ${(VALUE_CAR + VALUE_DELIVERY).toFixed(2).replace('.', ',')}`);
            }
        })
    },

    verifyCarIsEmpty: () => {
        if(MY_CAR.length <= 0){
            catalog.metods.globalMessage("Seu carrinho está vazio.", "red");
            return;
        }
        catalog.metods.loadingSteps(2);
    },

    findCep:() =>{
        let cep = $("#cep").val().trim().replace(/\D/g, '');
        if(cep != ""){
            let isValidCepRegex = /^[0-9]{8}$/;
            if(isValidCepRegex.test(cep)){
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function (data) {
                    if(!("erro" in data)){
                        //update inputs with values finds
                        $("#address").val(data.logradouro);
                        $("#district").val(data.bairro);
                        $("#number").val('');
                        $("#city").val(data.localidade);
                        $("#uf").val(data.uf);
                        
                        $("#number").focus();
                        $("#complement").focus();
                     
                    }else{
                        catalog.metods.globalMessage("CEP Informado não foi encontrado! Preencha as informações manualmente", "red");
                        $("#address").focus();
                    }
                })

            }else{
                catalog.metods.globalMessage("Formato do CEP inválido!", "red");
                $("#cep").focus();
            }
        }else{
            catalog.metods.globalMessage("Por favor, Informe o CEP", "red");
            $("#cep").focus();
        }
    },

    validateFormIsEmptyAddress: () => {
        let cep =  $("#cep").val().trim();
        let address =  $("#address").val().trim();
        let district =  $("#district").val().trim();
        let complement =  $("#complement").val().trim();
        let city =  $("#city").val().trim();
        let uf =  $("#uf").val().trim();
        let number =  $("#number").val().trim();

        if(cep.length <= 0){
            catalog.metods.globalMessage("Por favor, Informe o CEP", "red");
            $("#cep").focus();
            return;
        }

        if(address.length <= 0){
            catalog.metods.globalMessage("Por favor, Informe o Endereço", "red");
            $("#address").focus();
            return;
        }

        if(district.length <= 0){
            catalog.metods.globalMessage("Por favor, Informe o Bairro", "red");
            $("#district").focus();
            return;
        }

        if(city.length <= 0){
            catalog.metods.globalMessage("Por favor, Informe a Cidade", "red");
            $("#city").focus();
            return;
        }

        if(number.length <= 0){
            catalog.metods.globalMessage("Por favor, Informe o Número", "red");
            $("#number").focus();
            return;
        }

        if(uf == "-1"){
            catalog.metods.globalMessage("Por favor, Informe o seu Estado", "red");
            $("#uf").focus();
            return;
        }

        ADDRESS_CLIENT = {
            cep: cep,
            address: address,
            complement: complement,
            number: number,
            uf: uf,
            city: city,
            district: district
        }

        catalog.metods.loadingSteps(3);
        catalog.metods.loadingResumeOrder();
    },

    loadingResumeOrder: () => {
        $("#listItensCar").html('');

        $.each(MY_CAR, (i, e) => {
            let template = catalog.templates.resumeItensCar.replace(/\${imgs}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qtdAdd}/g, e.qtdAdd)
            $("#listItensCar").append(template);
        })

        $("#resume-address").html(`${ADDRESS_CLIENT.address}, ${ADDRESS_CLIENT.number}, ${ADDRESS_CLIENT.district}`)
        $("#cityAddress").html(`${ADDRESS_CLIENT.city} - ${ADDRESS_CLIENT.uf} / ${ADDRESS_CLIENT.cep} ${ADDRESS_CLIENT.complement}`)
    }

}

catalog.templates = {

    item:`
    <div class="col-12 col-lg-3 col-md-3 col-sm-6">
        <div class="card card-item" id="\${id}">
                <div class="img-catalog text-center">
                    <img src="\${imgs}" width="200px">
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
    `,

    itens_car:`
    <div class="col-12 item-car">
            <div class="img-product">
                    <img src="\${imgs}" alt="">
            </div>
            <div class="data-product">
                    <p class="title-product"><strong>\${name}</strong></p>
                    <p class="price-product"><strong>R$ \${price}</strong></p>
            </div>
            <div class="add-car">
                <span class="btn-less" onclick="catalog.metods.lessQuantityCar('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="btn-number-itens" id="qtd-car-\${id}"><strong>\${qtdAdd}</strong></span>
                <span class="btn-plus" onclick="catalog.metods.plusQuantityCar('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="catalog.metods.removeItemCar('\${id}')"><i class="fa fa-shopping-bag"></i></span>
            </div>
    </div>
    `,
    resumeItensCar:`
    <div class="row">
        <div class="col-12 item-car resume">
            <div class="img-product-resume">
                <img src="\${imgs}">
            </div>
            <div class="data-product">
                <p class="title-product-resume"><strong>\${name}</strong></p>
                <p class="price-product-resume"><strong>R$ \${price}</strong></p>
            </div>
            <p class="qtd-product-resume">x <strong>\${qtdAdd}</strong></p>
        </div>
    </div>
    `

}