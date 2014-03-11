var total_budget = 1000;

var budget_used = 0;

var update_budget_progress_bar = function() {
    var percent_used = budget_used / total_budget * 100;
    var percent_remaining = 100 - percent_used;
    var bar = $('#budget-progress-bar .progress-bar');
    bar.attr('aria-valuenow', percent_remaining);
    bar.attr('style', 'width: ' + Math.floor(percent_remaining) + "%");
    var label = $('#budget-progress-bar .sr');
    label.text("You have $" + (total_budget - budget_used) + ".00!");
};

var costs = {
    'increase-physical-activity': {
        'high': 300, 'medium': 200, 'low': 100
    },
    'ensure-screening': {
        'high': 300, 'medium': 200, 'low': 100
    },
    'active-living-at-work': {
        'high': 300, 'medium': 200, 'low': 100
    },
    'social-influence': {
        'high': 300, 'medium': 200, 'low': 100
    },
    'physical-environment': {
        'high': 300, 'medium': 200, 'low': 100
    }
};

var calculate_budget = function() {
    budget_used = 0;
    var controls = $(".intervention-control");
    for (var i=0; i < controls.length; i++) {
        if (controls[i].value != "") {
            var cost = costs[controls[i].id][controls[i].value];
            budget_used += cost;
        }
    }
    apply_modifiers();
    update_budget_progress_bar();
};

var defaults = {
    'id_recreation_activity_alpha': 0.5,
    'id_education_activity_alpha': 0.5,
    'id_domestic_activity_alpha': 0.5,
    'id_transport_activity_alpha': 0.5,
    'id_food_convenience_alpha': 0.5,
    'id_energy_density_alpha': 0.5,
    'id_food_exposure_alpha': 0.5,
    'id_food_convenience_alpha': 0.5,
    'id_food_literacy_alpha': 0.5,
    'id_food_advertising_alpha': 0.5,
    'id_gamma_6': 1.0,
}

var modifiers = {
    'increase-physical-activity': {
        'high': [{'param': 'id_recreation_activity_alpha', 'adjustment': 0.3}],
        'medium': [{'param': 'id_recreation_activity_alpha', 'adjustment': 0.2}],
        'low': [{'param': 'id_recreation_activity_alpha', 'adjustment': 0.1}]
    },
    'ensure-screening': {
        'high': [],
        'medium': [],
        'low': []
    },
    'active-living-at-work': {
        'high': [{'param': 'id_domestic_activity_alpha', 'adjustment': 0.3}],
        'medium': [{'param': 'id_domestic_activity_alpha', 'adjustment': 0.2}],
        'low': [{'param': 'id_domestic_activity_alpha', 'adjustment': 0.1}]
    },
    'social-influence': {
        'high': [{'param': 'id_gamma_6', 'adjustment': 0.3}],
        'medium': [{'param': 'id_gamma_6', 'adjustment': 0.2}],
        'low': [{'param': 'id_gamma_6', 'adjustment': 0.1}]
    },
    'physical-environment': {
        'high': [],
        'medium': [],
        'low': []
    }
}

var current_values = {};

var reset_parameters = function() {
    for (var k in defaults) {
        if (defaults.hasOwnProperty(k)) {
            $("#" + k).val(defaults[k]);
            current_values[k] = defaults[k];
        }
    }
};

var apply_modifiers = function() {
    // set everything to a known state
    reset_parameters();
    // then go through each control that is set and adjust accordingly
    var controls = $(".intervention-control");
    for (var i=0; i < controls.length; i++) {
        if (controls[i].value != "") {
            var m = modifiers[controls[i].id][controls[i].value];
            for (var j=0; j < m.length; j++) {
                var param_name = m[j].param;
                var adjustment = m[j].adjustment;
                var p = $("#" + param_name);
                var new_value = current_values[param_name] + adjustment;
                current_values[param_name] = new_value;
                p.val(new_value);
            }
        }
    }
};

$(".intervention-control").change(calculate_budget);
