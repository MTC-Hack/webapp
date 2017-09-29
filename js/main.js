var API_URL = "http://10.128.30.116:8000/";
var LOGON_URL = "service_logon";
var OFFERED_VEH = "get_offered_vehicles";
var VEHS_AND_CRASHES = "get_lists_of_vehicles_and_crashes";
var CREATE_OFFER = "create_offer";

function authenticate(userName, password) {
    $.ajax
    ({
        type: "POST",
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

function get_lists_of_vehicles_and_crashes() {
    $.ajax
    ({
        type: "POST",
        url: API_URL + VEHS_AND_CRASHES,
        dataType: 'json',
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

function sendOffer(vehid) {
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
        '<form class="form-horizontal">\n' +
        '  <div class="form-group">\n' +
        '    <label for="offer-text" class="col-sm-2 control-label">Текст предложения</label>\n' +
        '    <div class="col-sm-10">\n' +
        '      <textarea class="form-control" id="offer-text" rows="4"></textarea>' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="form-group">\n' +
        '    <label for="amount" class="col-sm-2 control-label">Стоимость</label>\n' +
        '    <div class="col-sm-10">\n' +
        '      <div class="input-group"><input type="text" class="form-control" id="amount" placeholder="Сумма в рублях"><div class="input-group-addon">руб</div></div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</form>' +
        '      </div>' +
        '      <div class="modal-footer">' +

        '        <button type="button" class="btn btn-primary">Отправить предложение</button>' +
        '        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +

        '      </div>');
    $('#popup_vehicleRepairOffer').modal('show');
    console.log(veh);
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

function fill_service_names(){
    $(".forServiceName").each(function () {
        $(this).text(service_data().service_name);
    });
}

function show_offered_vehicles(){
    var tmpHTML = '';
    for(var i=0; i < offered_vehicles().length; i++ ){
        tmpHTML+='<li class="list-group-item">' +
            '<span class="badge">' + offered_vehicles()[i].count_crashes + '</span>' + offered_vehicles()[i].vehicle.brand + ' ' + offered_vehicles()[i].vehicle.model +
            '</li>';
    }
    $("#own-cars-list").html(tmpHTML);
}

function show_lists_of_vehicles(){
    var tmpHTML ='';
    for(var i=0;i<lists_of_vehicles_and_crashes().length;i++){
        var isMyCar = false;
        for(var j=0; j < offered_vehicles().length; j++ ) {
            console.log(lists_of_vehicles_and_crashes()[i].id, offered_vehicles()[j].vehicle.id);
            if (lists_of_vehicles_and_crashes()[i].id === offered_vehicles()[j].vehicle.id) {

                isMyCar = true;
                break;
            }
        }
        console.log(isMyCar)
        var addedHtml = '';
        if(isMyCar){
            addedHtml = '<br><span class="label label-success" style="font-size: 12px;">в ремонте</span>';
        }else{
            addedHtml = '<br><br>';
        }
        tmpHTML+='<div class="col-lg-3">' +
            '                        <div class="thumbnail">' +
            '                            <img src="./img/default-no-image.png" alt="No picture">' +
            '                            <div class="caption">' +
            '                                <h4 style="white-space: nowrap; overflow: hidden;">'+lists_of_vehicles_and_crashes()[i].brand+' '+lists_of_vehicles_and_crashes()[i].model+' ' + addedHtml + '</h4>' +
            '                                <p>' +
            'Год выпуска: <b>' + lists_of_vehicles_and_crashes()[i].year +
            '</b><br>VIN: <b>' + lists_of_vehicles_and_crashes()[i].VIN +
            '</b><br>Рег. номер: <b>' + lists_of_vehicles_and_crashes()[i].number +
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
    fill_service_names();
    get_offered_vehicles();
    get_lists_of_vehicles_and_crashes();
    show_offered_vehicles();
    show_lists_of_vehicles();
    console.log(lists_of_vehicles_and_crashes());
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
        '                                                                            <h1>'+veh.brand+' '+veh.model+'</h1>' +
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
        '                                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="sendOffer('+veh.id+')">Оставить предложение о ремонте</button>' +
        '                                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>' +
        '' +
        '                            </div>');
    console.log(recipient_id);
});


