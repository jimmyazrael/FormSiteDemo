import Vue from 'vue';

// Usage: https://github.com/charliekassel/vuejs-datepicker
// And be aware of this issue: 
// https://github.com/charliekassel/vuejs-datepicker/issues/399
// tl;dr comment out the following line in .babelrc of this plugin in node_modules:
// "plugins": ["transform-runtime"]
import Datepicker from 'vuejs-datepicker';

// Define the required fields with [variable_name, string_to_show]
var requiredFields = [
    ['firstName', 'First Name'],
    ['lastName', 'Last Name'],
    ['gender', 'Gender']
];

var reportviewContrller = new Vue({
    el: "#formView",
    data: {
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        income: 0,
        // For showing error message to user
        showErr: false,
        errMsg: '',
        // Specifically for the datepicker plugin, diable date after today
        dpState: { disabled: { from: new Date()}}
    },

    methods: {
        submitForm: function() {
            var pref = this;
            var result = this.checkRequired(pref);
            if (result.status) {
            	pref.showErr = false;
            	pref.errMsg = '';
                axios({
                    method: 'post',
                    url: '/',
                    params: {
                        firstName: pref.firstName,
                        lastName: pref.lastName,
                        birthday: pref.birthday,
                        gender: pref.gender,
                        income: pref.income
                    }
                }).then(function(response) {
                    if (response.data == 'FILE_READY') {
                        window.location = '/';
                    }
                }).catch(function(error) {
                    console.log(error);
                    if (error.response.status == 404)
                        alert();
                })

                // Demo purpose as no RESTful service available
                alert('This POST action is destined to fail.');
            } else {
            	this.showErr = true;
            	this.errMsg = result.err_msg;
            }

        },

        checkRequired: function(parentRef) {
            var res = { 'status': true, 'err_msg': [] };
            for (var i = requiredFields.length - 1; i >= 0; i--) {
                if (parentRef[requiredFields[i][0]] == '') {
                    res.status = false;
                    res.err_msg.push(requiredFields[i][1] + ' is required.');
                }
            }
            return res;
        }
    },

    components: { Datepicker },

    computed: {
        age: function() {
            if (this.birthday != '') {
            	return new Date().getFullYear() - this.birthday.getFullYear();
            }else {
            	return -1;
            }
        }
    }
});