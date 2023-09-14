$(document).ready(function (){
    catalog.events.init();
});

var catalog = {};

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
    }
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
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

}