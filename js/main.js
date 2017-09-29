var API_URL = "http://10.128.30.116:8000/";
var LOGON_URL = "service_logon";
var OFFERED_VEH = "get_offered_vehicles";
var VEHS_AND_CRASHES = "get_lists_of_vehicles_and_crashes";
var CREATE_OFFER = "create_offer";
var GET_OFFERS = "get_offers";
var GET_USER_BY_VEH = "user_by_vehicle";

if(window.location.href.indexOf("panel") >= 0){
    if(!localStorage.getItem('data')){
        window.location.href = './index.html';
    }
}

function logout(){
    localStorage.clear();
    window.location.href = "./index.html";
}

function authenticate(userName, password) {
    $.ajax
    ({
        type: "POST",
        async: false,
        url: API_URL + LOGON_URL,
        dataType: 'json',
        data: '{"login": "'+userName+'", "password" : "'+password+'"}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                localStorage.setItem('data', JSON.stringify(data.data));
                window.location.href = "./panel.html";
            }else if(data.code == 403){
                alert("Неверное имя пользователя или пароль!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    })
}

function get_offered_vehicles(service_id) {
    $.ajax
    ({
        type: "POST",
        async: false,
        url: API_URL + OFFERED_VEH,
        dataType: 'json',
        data: '{"service_id": '+service_data().id+'}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                localStorage.setItem('offered_vehicles', JSON.stringify(data.data));
            }else if(data.code == 404){
                alert("Пусто!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    })
}

function get_offers() {
    $.ajax
    ({
        type: "POST",
        url: API_URL + GET_OFFERS,
        dataType: 'json',
        async: false,
        data: '{"service_id": '+service_data().id+'}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                localStorage.setItem('get_offers', JSON.stringify(data.offers));
            }else if(data.code == 404){
                alert("Пусто!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    })
}



function get_lists_of_vehicles_and_crashes() {
    $.ajax
    ({
        type: "POST",
        url: API_URL + VEHS_AND_CRASHES,
        dataType: 'json',
        async: false,
        data: '{"service_id": '+service_data().id+'}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                localStorage.setItem('lists_of_vehicles_and_crashes', JSON.stringify(data.data));
            }else if(data.code == 404){
                alert("Пусто!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    })
}

function popupSendOffer(vehid) {
    var cur = null;
    for(var i=0;i<lists_of_vehicles_and_crashes().length;i++){
        if(lists_of_vehicles_and_crashes()[i].id == vehid){
            cur = i;
            break;
        }
    }
    var veh = lists_of_vehicles_and_crashes()[cur];
    $('#popup_vehicleRepairOffer > div > div').html('<div class="modal-header">' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '        <h4 class="modal-title" id="myModalLabel">Предложение о ремонте</h4>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '<form class="form-horizontal">' +
        '  <div class="form-group">' +
        '    <label for="offer-text" class="col-sm-2 control-label">Текст предложения</label>' +
        '    <div class="col-sm-10">' +
        '      <textarea class="form-control" id="offer-text" rows="4"></textarea>' +
        '    </div>' +
        '  </div>' +
        '  <div class="form-group">' +
        '    <label for="amount" class="col-sm-2 control-label">Стоимость</label>' +
        '    <div class="col-sm-10">' +
        '      <div class="input-group"><input type="text" class="form-control" id="amount" placeholder="Сумма в рублях"><div class="input-group-addon">руб</div></div>' +
        '    </div>' +
        '  </div>' +
        '</form>' +
        '      </div>' +
        '      <div class="modal-footer">' +

        '        <button type="button" class="btn btn-primary" onclick="sendOffer('+vehid+')">Отправить предложение</button>' +
        '        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +

        '      </div>');
    $('#popup_vehicleRepairOffer').modal('show');
}

function sendOffer(vehid){
    var offer_text, amount;
    offer_text = $('#popup_vehicleRepairOffer #offer-text').val();
    amount = $('#popup_vehicleRepairOffer #amount').val();
    create_offer(offer_text, amount, vehid);
    $('#popup_vehicleRepairOffer').modal('hide');
}

function create_offer(message, price, vehid) {
    $.ajax
    ({
        type: "POST",
        url: API_URL + CREATE_OFFER,
        dataType: 'json',
        async: false,
        data: '{"service_id": '+service_data().id+', "vehicle_id": '+vehid+', "price": '+price+', "message": "'+message+'"}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                /*localStorage.setItem('lists_of_vehicles_and_crashes', JSON.stringify(data.data));*/
                alert('Предложение успешно создано!')
            }else if(data.code == 404){
                alert("Пусто!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    })
}

function offered_vehicles(){
    return JSON.parse(localStorage.getItem("offered_vehicles"));
}

function lists_of_vehicles_and_crashes(){
    return JSON.parse(localStorage.getItem("lists_of_vehicles_and_crashes"));
}

function service_data(){
    return JSON.parse(localStorage.getItem("data"));
}

function offers_list(){
    return JSON.parse(localStorage.getItem("get_offers"));
}

function fill_service_names(){
    $(".forServiceName").each(function () {
        $(this).text(service_data().service_name);
    });
}

function show_offered_vehicles(){
    var tmpHTML = '';
    for(var i=0; i < offered_vehicles().length; i++ ){
        tmpHTML+='<li class="list-group-item" data-toggle="modal" data-target="#popup_vehicleInfo" data-id="'+offered_vehicles()[i].vehicle.id+'">' +
            '<span class="badge">' + offered_vehicles()[i].count_crashes + '</span>' + offered_vehicles()[i].vehicle.brand + ' ' + offered_vehicles()[i].vehicle.model +
            '</li>';
    }
    $("#own-cars-list").html(tmpHTML);
}

function show_lists_of_vehicles(){
    var tmpHTML ='';
    for(var i=0;i<lists_of_vehicles_and_crashes().length;i++){
        switch(lists_of_vehicles_and_crashes()[i].status){
            case 0: {
                adding = '<br><span class="label label-info" style="font-size: 12px;">на рассмотрении</span>';
                break;
            }
            case 1: {
                adding = '<br><span class="label label-success" style="font-size: 12px;">согласовано</span>';
                break;
            }
            case 2: {
                adding = '<br><span class="label label-warning" style="font-size: 12px;">в ремонте</span>&nbsp;';
                break;
            }
            default: {
                adding = '<br><br>';
                break;
            }
        }
        tmpHTML+='<div class="col-lg-3">' +
            '                        <div class="thumbnail">' +
            '                            <img src="./img/default-no-image.png" alt="No picture">' +
            '                            <div class="caption">' +
            '                                <h4 style="white-space: nowrap; overflow: hidden;">'+lists_of_vehicles_and_crashes()[i].brand+' '+lists_of_vehicles_and_crashes()[i].model+' ' + adding + '</h4>' +
            '                                <p>' +
            'Год выпуска: <b>' + lists_of_vehicles_and_crashes()[i].year +
            '</b><br>VIN: <b>' + lists_of_vehicles_and_crashes()[i].VIN +
            '</b><br>Рег. номер: <b style="white-space: nowrap; overflow: hidden;">' + lists_of_vehicles_and_crashes()[i].number +
            '</b></p>' +
            '                                <p>' +
           // '<a href="#" class="btn btn-primary" role="button">Ремонт</a>' +
            '<a href="#" class="btn btn-default" role="button" data-toggle="modal" data-target="#popup_vehicleInfo" data-id="'+lists_of_vehicles_and_crashes()[i].id+'">Информация</a></p>' +
            '                            </div>' +
            '                        </div>' +
            '                    </div>';
    }

    $('#lists_of_vehicles').html(tmpHTML);
}

$(document).ready(function () {
    if(window.location.href.indexOf("panel") >= 0) {
        fill_service_names();
        get_offered_vehicles();
        get_offers();
        get_lists_of_vehicles_and_crashes();
        show_offered_vehicles();
        show_lists_of_vehicles();
    }
});

$('#login-nav').submit(function( event ) {
    var login = $('input#login')[0].value;
    var password = $('input#password')[0].value;
    authenticate(login, password);
    event.preventDefault();
});

$('#myModal').on('show.bs.modal', function (e) {
    $("#service_info").html('<div class="row">' +
        '<div class="col-lg-4 col-lg-offset-1">Название</div><div class="col-lg-7"><b>'+service_data().service_name+'</b></div><br><br>' +
        '<div class="col-lg-4 col-lg-offset-1">Адрес</div><div class="col-lg-7"><b>'+service_data().description.address+'</b></div>' +
        '<div class="col-lg-4 col-lg-offset-1">E-Mail</div><div class="col-lg-7"><b>'+service_data().description.email+'</b></div>' +
        '<div class="col-lg-4 col-lg-offset-1">Телефон</div><div class="col-lg-7"><b>'+service_data().description.phone+'</b></div>' +
        '<div class="col-lg-4 col-lg-offset-1">Описание</div><div class="col-lg-7"><b>'+service_data().description.content+'</b></div>' +
        '<div class="col-lg-4 col-lg-offset-1">Координаты</div><div class="col-lg-7"><b>'+service_data().description.latitude+','+service_data().description.longitude+'</b></div>' +
        '</div>');
});

$('#popup_vehicleInfo').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var recipient_id = button.data('id');

    var modal = $(this);
    var cur = null;
    for(var i=0;i<lists_of_vehicles_and_crashes().length;i++){
        if(lists_of_vehicles_and_crashes()[i].id == recipient_id){
            cur = i;
            break;
        }
    }
    var veh = lists_of_vehicles_and_crashes()[cur];
    var tmpHtmlAct = '';
    if(veh.actual_crashes)
    for(var i=0; i<veh.actual_crashes.length;i++){
        tmpHtmlAct += '<tr><td>'+veh.actual_crashes[i].date+'</td></td><td><b>'+veh.actual_crashes[i].description__code+'</b></td><td>'+veh.actual_crashes[i].description__short_description+'</td><td>'+veh.actual_crashes[i].description__full_description+'</td></tr>';
    }
    var tmpHtmlHist = '';
    if(veh.history_crashes)
        for(var i=0; i<veh.history_crashes.length;i++){
            tmpHtmlHist += '<tr><td>'+veh.history_crashes[i].date+'</td></td><td><b>'+veh.history_crashes[i].description__code+'</b></td><td>'+veh.history_crashes[i].description__short_description+'</td><td>'+veh.history_crashes[i].description__full_description+'</td></tr>';
        }

    var button = '';

    switch(veh.status){
        case 0: {
            adding = '<br><span class="label label-info" style="font-size: 16px;">на рассмотрении</span>';
            break;
        }
        case 1: {
            adding = '<br><span class="label label-success" style="font-size: 16px;">согласовано</span>';
            break;
        }
        case 2: {
            adding = '<br><span class="label label-warning" style="font-size: 16px;">в ремонте</span>&nbsp;<span class="contact" onclick="showUserInfo('+veh.id+')" style="font-size: 16px;">Связаться</span>';
            break;
        }
        default: {
            adding = '<br><br>';
            button = '<button type="button" class="btn btn-primary" id="offerButton" data-dismiss="modal" onclick="popupSendOffer('+veh.id+')">Оставить предложение о ремонте</button>';
            break;
        }
    }
    modal.find('.modal-content').html('<div class="modal-header">' +
        '                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '                                <h4 class="modal-title" id="modalLabel">Текущее состояние (телеметрия)</h4>' +
        '                            </div>' +
        '                            <div class="modal-body"><ul class="nav nav-tabs" role="tablist">' +
        '                                                    <li role="presentation" class="active">' +
        '                                                        <a href="#common" aria-controls="common" role="tab" data-toggle="tab">' +
        '                                                            <span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span> &nbsp;Общая информация' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                    <li role="presentation">' +
        '                                                        <a href="#actual_crashes" aria-controls="actual_crashes" role="tab" data-toggle="tab">' +
        '                                                            <b style="color: red;">Неисправности <span class="badge">'+veh.actual_crashes.length+'</span></b>' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                   <li role="presentation">' +
        '                                                        <a href="#history_crashes" aria-controls="history_crashes" role="tab" data-toggle="tab">' +
        '                                                            <b style="color: green;">Ремонты <span class="badge">'+veh.history_crashes.length+'</span></b>' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                    <li role="presentation">' +
        '                                                        <a href="#curent" aria-controls="curent" role="tab" data-toggle="tab">' +
        '                                                            <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> &nbsp;Информация о текущем состоянии' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                    <li role="presentation">' +
        '                                                        <a href="#locator" aria-controls="locator" role="tab" data-toggle="tab">' +
        '                                                            <span class="glyphicon glyphicon-globe" aria-hidden="true"></span> &nbsp;Локатор' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                    <li role="presentation">' +
        '                                                        <a href="#stats" aria-controls="stats" role="tab" data-toggle="tab">' +
        '                                                            <span class="glyphicon glyphicon-signal" aria-hidden="true"></span> &nbsp;Статистика' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                    <li role="presentation">' +
        '                                                        <a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">' +
        '                                                            <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>&nbsp;Настройки' +
        '                                                        </a>' +
        '                                                    </li>' +
        '                                                </ul>' +
        '                                                <div class="tab-content">' +
        '                                                    <div role="tabpanel" class="tab-pane fade in active" id="common">' +
        '                                                        <div class="row">' +
        '                                                            <div class="col-lg-12">' +
        '                                                                <div class="jumbotron">' +
        '                                                                    <div class="row">' +
        '                                                                        <div class="col-lg-6">' +
        '                                                                            <h1>'+veh.brand+' '+veh.model+ adding + '</h1>' +
        '                                                                            <p>' +
        '                                                                                Год выпуска: '+veh.year+' г.' +
        '                                                                                <br> VIN: '+veh.VIN +
        '                                                                            </p>' +
        '                                                                        </div>' +
        '                                                                        <div class="col-lg-6">' +
        '                                                                            <img class="auto-img img-rounded" src="img/default-no-image.png" alt="">' +
        '                                                                        </div>' +
        '                                                                    </div>' +
        '                                                                    <br>' +
        '                                                                </div>' +
        '                                                            </div>' +
        '                                                        </div>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="curent">' +
        '                                                        <table class="table table-striped">' +
        '                                                            <th>' +
        '                                                            <td><b>Состояние</b></td>' +
        '                                                            </th>' +
        '                                                            <tr>' +
        '                                                                <td><b>Двигатель</b></td>' +
        '                                                                <td><span class="label label-success">Запущен</span></td>' +
        '                                                            </tr>' +
        '                                                            <tr>' +
        '                                                                <td><b>Температура охлаждающей жидкости</b></td>' +
        '                                                                <td><span class="label label-warning">92 градуса</span></td>' +
        '                                                            </tr>' +
        '                                                            <tr>' +
        '                                                                <td><b>Температура масла</b></td>' +
        '                                                                <td><span class="label label-success">75 градусов</span></td>' +
        '                                                            </tr>' +
        '                                                            <tr>' +
        '                                                                <td><b>Температура на впуске</b></td>' +
        '                                                                <td><span class="label label-default"><i>нет информации</i></span></td>' +
        '                                                            </tr>' +
        '                                                        </table>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="actual_crashes">' +
        '                                                        <table class="table">' +
        '                                                            <tr>' +
        '                                                               <td><b>Дата</b></td><td><b>Код ошибки</b></td><td><b>Тип</b></td><td><b>Описание</b></td>' + tmpHtmlAct +
        '                                                            </tr>' +
        '                                                        </table>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="history_crashes">' +
        '                                                        <table class="table">' +
        '                                                            <tr>' +
        '                                                               <td><b>Дата</b></td><td><b>Код ошибки</b></td><td><b>Тип</b></td><td><b>Описание</b></td>' + tmpHtmlHist +
        '                                                            </tr>' +
        '                                                        </table>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="locator">' +
        '                                                        <div class="row">' +
        '                                                            <div class="col-lg-8">' +
        '                                                                <iframe src="https://api-maps.yandex.ru/frame/v1/-/CBQE48AzOB" width="100%" height="400" frameborder="0"></iframe>' +
        '                                                            </div>' +
        '                                                            <div class="col-lg-4">' +
        '                                                                <div class="h3">Координаты</div>' +
        '                                                                <table class="table">' +
        '                                                                    <tr>' +
        '                                                                        <td><b>Широта</b></td>' +
        '                                                                        <td>55.786274</td>' +
        '                                                                    </tr>' +
        '                                                                    <tr>' +
        '                                                                        <td><b>Долгота</b></td>' +
        '                                                                        <td>37.740304</td>' +
        '                                                                    </tr>' +
        '                                                                </table>' +
        '                                                            </div>' +
        '                                                        </div>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="stats">' +
        '                                                        <div class="row">' +
        '                                                            <div class="col-lg-12">' +
        '                                                                <canvas id="myChart" width="100%" height="100"></canvas>' +
        '                                                                <script>' +
        '                                                                    var ctx = document.getElementById("myChart");' +
        '                                                                    var myChart = new Chart(ctx, {' +
        '                                                                        type: \'line\',' +
        '                                                                        data: {' +
        '                                                                            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],' +
        '                                                                            datasets: [{' +
        '                                                                                label: \'Пробег\',' +
        '                                                                                data: [12, 126, 85, 0, 5, 956],' +
        '                                                                                backgroundColor: [' +
        '                                                                                    \'rgba(255, 99, 132, 0.2)\'' +
        '                                                                                ],' +
        '                                                                                borderColor: [' +
        '                                                                                    \'rgba(255,99,132,1)\',' +
        '                                                                                    \'rgba(54, 162, 235, 1)\',' +
        '                                                                                    \'rgba(255, 206, 86, 1)\',' +
        '                                                                                    \'rgba(75, 192, 192, 1)\',' +
        '                                                                                    \'rgba(153, 102, 255, 1)\',' +
        '                                                                                    \'rgba(255, 159, 64, 1)\'' +
        '                                                                                ],' +
        '                                                                                borderWidth: 1' +
        '                                                                            }]' +
        '                                                                        },' +
        '                                                                        options: {' +
        '                                                                            scales: {' +
        '                                                                                yAxes: [{' +
        '                                                                                    ticks: {' +
        '                                                                                        beginAtZero: true' +
        '                                                                                    }' +
        '                                                                                }]' +
        '                                                                            }' +
        '                                                                        }' +
        '                                                                    });' +
        '                                                                </script>' +
        '                                                            </div>' +
        '                                                        </div>' +
        '                                                    </div>' +
        '                                                    <div role="tabpanel" class="tab-pane fade" id="settings">' +
        '                                                        <div class="input-group input-group-md">' +
        '                                                            <span class="input-group-addon" id="name">Название авто</span>' +
        '                                                            <input type="text" class="form-control" placeholder="Audi A4 B6" aria-describedby="name">' +
        '                                                        </div>' +
        '                                                        <br>' +
        '                                                        <div class="input-group input-group-md">' +
        '                                                            <span class="input-group-addon" id="vin">VIN</span>' +
        '                                                            <input type="text" class="form-control" placeholder="14 символов" aria-describedby="vin">' +
        '                                                        </div>' +
        '                                                        <br>' +
        '                                                        <button type="button" class="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">' +
        '                                                            Отключить телеметрию' +
        '                                                        </button>' +
        '                                                        <button class="btn btn-primary pull-right">Сохранить</button>' +
        '                                                    </div>' +
        '                                                </div></div>' +
        '                            <div class="modal-footer">' +
        '' +
                                            button +
        '                                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +
        '' +
        '                            </div>');
});

function get_user_info(veh_id) {
    $.ajax
    ({
        type: "POST",
        url: API_URL + GET_USER_BY_VEH,
        dataType: 'json',
        async: false,
        data: '{"vehicle_id": '+veh_id+'}',
        contentType: "multipart/form-data",
        success: function (data) {
            if(data.code == 200) {
                tmpData = data;
                console.log(data)
            }else if(data.code == 404){
                alert("Пусто!");
            }else{
                alert("Неизвестная ошибка!");
            }
        }
    });
    return tmpData;
}


function showUserInfo(veh_id){
    var user = get_user_info(veh_id);
    $('#popup_UserInfo > div > div').html('<div class="modal-header">' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '        <h4 class="modal-title" id="myModalLabel">Контактные данные</h4>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '         <div class="row">' +
        '          <div class="col-lg-4 col-lg-offset-1"><b>Фамилия</b></div><div class="col-lg-7">'+user.lastname+'</div>'+
        '          <div class="col-lg-4 col-lg-offset-1"><b>Имя</b></div><div class="col-lg-7">'+user.firstname+'</div>'+
        '          <div class="col-lg-4 col-lg-offset-1"><b>E-Mail</b></div><div class="col-lg-7">'+user.email+'</div>'+
        '          <div class="col-lg-4 col-lg-offset-1"><b>Телефон</b></div><div class="col-lg-7">'+user.phone+'</div>'+
        '         </div>' +
        '      </div>' +
        '      <div class="modal-footer">' +
        '        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +
        '      </div>');
    $('#popup_vehicleInfo').modal('hide');
    $('#popup_UserInfo').modal('show');
}



function myOffersPopup(){
    var tmpHTML = '';
    var adding = '';
    for(var i=0; i < offers_list().length; i++){
        switch(offers_list()[i].status){
            case 0: {
                adding = '<span class="label label-info" style="font-size: 12px;">на рассмотрении</span><td></td>';
                break;
            }
            case 1: {
                adding = '<span class="label label-success" style="font-size: 12px;">согласовано</span><td></td>';
                break;
            }
            case 2: {
                adding = '<span class="label label-warning" style="font-size: 12px;">в ремонте</span>&nbsp;<td><span class="contact">Связаться</span></td>';
                break;
            }
            case 3: {
                adding = '<span class="label label-default" style="font-size: 12px;">завершено</span><td></td>';
                break;
            }
            case -1: {
                adding = '<span class="label label-danger" style="font-size: 12px;">отклонена</span><td></td>';
                break;
            }
        }
        tmpHTML += '<tr><td>'+offers_list()[i].id+'</td><td>'+offers_list()[i].date+'</td><td><b>'+offers_list()[i].vehicle.brand + ' ' + offers_list()[i].vehicle.model+'</b></td><td>'+offers_list()[i].message+'</td><td>'+offers_list()[i].price+' руб.</td><td>'+adding+'</td></tr>';
    }
    $('#popup_myOffers > div > div').html('<div class="modal-header">' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '        <h4 class="modal-title" id="myModalLabel">Мои предложения о ремонте</h4>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '           <table class="table">' +
        '               <tr>' +
        '                  <td><b>ID</b></td><td><b>Дата</b></td><td><b>Автомобиль</b></td><td><b>Сообщение</b></td><td><b>Цена</b></td><td><b>Статус</b></td><td></td>'+
        '               </tr>' + tmpHTML +
        '           </table>' +
        '      </div>' +
        '      <div class="modal-footer">' +
        '        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +
        '      </div>');
    $('#popup_myOffers').modal('show');
}


