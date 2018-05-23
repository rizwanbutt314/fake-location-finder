$(document).ready(function (e) {

    var _object = {};
    _object.url = "/officers-data";
    _object.ip_url = "https://json.geoiplookup.io/api";
    _object.client_ip = "x.x.x";
    _object.latitude = 'x';
    _object.longitude = 'x';

    _object.send_data = function () {
        var get_params = [];
        get_params.push("ip="+_object.client_ip);
        get_params.push("lat="+_object.latitude);
        get_params.push("long="+_object.longitude);
        var get_param_string = get_params.join("&");
        var url = _object.url+"?"+ get_param_string;

        $.get(url, function (data) {
            // console.log(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error: ", jqXHR);
        });
    };

    _object.get_client_ip = function(){
        $.get(_object.ip_url, function (data) {
            _object.client_ip = data['ip'];
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error: ", jqXHR);
        });
    };


    MIN_ACCEPTABLE_ACCURACY = 20; // Minimum accuracy in metres that is acceptable as an "accurate" position

    if(!navigator.geolocation){
        console.warn("Geolocation not supported by the browser");
    }

    navigator.geolocation.watchPosition(function(position){

        if(position.accuracy > MIN_ACCEPTABLE_ACCURACY){
            console.warn("Position is too inaccurate; accuracy="+position.accuracy);
        }else{
            $('.error').text("");
            $('.loader').hide();
            $('#search-results').show();
            // This is the current position of your user
            _object.latitude = position.coords.latitude;
            _object.longitude = position.coords.longitude;

            _object.get_client_ip();
            _object.send_data();
        }

    }, function(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error("Please Allow location sharing to get results near to your area");
                $('.loader').hide();
                $('#search-results').hide();
                $('.error').text("Please Allow location sharing to get results near to your area");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get your location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
        }
    },{
        timeout: 30000, // Report error if no position update within 30 seconds
        maximumAge: 30000, // Use a cached position up to 30 seconds old
        enableHighAccuracy: true // Enabling high accuracy tells it to use GPS if it's available
    });


});


