/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};
// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'predictSale': function(sale1, sale2, rate) {
            let ajax_options = {
                type: 'POST',
                url: 'api/predict',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'sale1': sale1,
                    'sale2': sale2,
                    'rate': rate
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_predictSale_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';
    
    let $predicted_data_para = $(".predicted_data_para");
    return {
        updateMessage: function(predicted_data) {
            $predicted_data_para.html("Predicted sale for the third month is $" + predicted_data['sale3']);
        },
        error: function(error_msg) {
            $predicted_data_para.html(error_msg);
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $predicted_data_para = $("#predicted_data");

    // Validate input
    function validate(sale1, sale2, rate) {
        return sale1 !== "" && sale2 !== "" && rate !== "";
    }

    $(".predict-btn").click(function(e) {
    	e.preventDefault();
    	let sale1 = $("#sale1_field").val(),
    	sale2 = $("#sale2_field").val(),
    	rate = $("#rate_field").val();
    	if (validate(sale1, sale2, rate)) {
            model.predictSale(sale1, sale2, rate)
        } else {
            alert('Problem with sale or rate input');
        }

    });

    // Handle the model events
    $event_pump.on('model_predictSale_success', function(e, data) {
        view.updateMessage(data);
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })

}(ns.model, ns.view));
