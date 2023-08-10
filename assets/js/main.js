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

    getItensCatalog: () => {
        var filter = CATALOGO['bauletos'];
        console.log('AQUI: ', filter);
        $.each(filter, (i, e) => {
            let template = catalog.templates.item.replace(/\${imgs}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price);
            $("#itemsCatalog").append(template)
        })
    }
}

catalog.templates = {

    item:`
    <div class="col-3">
        <div class="card card-item">
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
                    <span class="btn-less"><i class="fas fa-minus"></i></span>
                    <span class="btn-number-itens"><strong>0</strong></span>
                    <span class="btn-plus"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

}