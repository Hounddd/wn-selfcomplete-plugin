'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestBundler = function () {
    function RequestBundler(requestHandler) {
        _classCallCheck(this, RequestBundler);

        this.data = [];
        this.pending = [];
        this.requestHandler = requestHandler;
    }

    _createClass(RequestBundler, [{
        key: 'get',
        value: function get(url, callback) {
            var _this2 = this;

            var existingData = this.data.filter(function (x) {
                return x.url === url;
            });
            var existingRequest = this.pending.filter(function (x) {
                return x.url === url;
            });

            if (existingData && existingData.length) {
                callback(existingData[0]);
            } else if (existingRequest && existingRequest.length) {
                existingRequest[0].callbacks.push(callback);
            } else {
                this.pending.push({
                    url: url,
                    request: this.requestHandler(url).then(function (data) {
                        return _this2._handleCallbacks(url, data);
                    }),
                    callbacks: [callback]
                });
            }
        }
    }, {
        key: '_handleCallbacks',
        value: function _handleCallbacks(url, data) {
            var cached = this.data.filter(function (x) {
                return x.url === url;
            });
            if (cached) {
                cached = data;
            }

            var req = this.pending.filter(function (x) {
                return x.url === url;
            });
            if (req) {
                req[0].callbacks.forEach(function (callback) {
                    return callback(data);
                });
                this.pending = this.pending.filter(function (x) {
                    return x.url !== url;
                }); // remove from pending requests
            }
        }
    }]);

    return RequestBundler;
}();

'use strict';
(function ($) {
    var SelfComplete = function () {
        function SelfComplete(element, options) {
            var _this3 = this;

            _classCallCheck(this, SelfComplete);

            this.autoSelect = true;
            // container around the input field
            this.$input = $(element);
            this.$input.addClass('form-control');

            var containerClasses = 'selfcomplete input-group';
            if (this.$input.hasClass('input-sm')) {
                containerClasses += ' input-group-sm';
            }

            this.$input.wrap('<div class="' + containerClasses + '"></div>');
            this.$container = this.$input.parent('.selfcomplete');

            // dropdown button and dropdown menu
            this.$container.append('<span class="input-group-btn">' + '<button class="btn btn-default" type="button" tabindex="-1">' + '</button></span>');
            this.$container.append('<ul class="items dropdown-menu" style="display:none;"></ul>');

            this.$button = this.$container.find('button');
            this.$items = this.$container.find('.items');

            if (this.$input.attr('disabled')) {
                this.$button.attr('disabled', 'disabled');
            }

            // parse options
            this.parseOptions(options);

            // setup event handlers
            var _this = this;
            this._filterOnHandler = function () {
                _this.search(this.value);
            }.bind(this.$input[0]);

            this._onKeyDown = function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    _this.open = false;
                }
            }.bind(this.$input[0]);

            this._validateOnHandler = function () {
                if (_this.options.validation) {
                    if (!_this.options.validation(_this.$input.val(), _this.data) && _this.options.invalidClass) {
                        _this.$input.addClass(_this.options.invalidClass);
                    } else {
                        _this.$input.removeClass(_this.options.invalidClass);
                    }
                }
            }.bind(this.$input[0]);

            this._onInputHandler = function () {
                _this.open = true;
            }.bind(this.$input[0]);

            this._buttonClickHandler = function () {
                _this.toggleOpen();
            };

            this._globalKeyEventHandler = function (e) {
                if (e.keyCode === 27) {
                    // ESC
                    _this.open = false;
                }
            };

            this._onBlurHandler = function () {
                _this.autoSelect = true;
            };

            // initialize event handlers
            this.initializeEventHandlers();

            // close the dropdown menu if clicked outside
            $('body').click(function () {
                var $active = $(document.activeElement);
                if (!$active.is(_this3.$input) && !$active.is(_this3.$button) && !$active.is(_this3.$items) && !_this3.$items.find($active).length) {
                    _this3.open = false;
                }
            });

            // initialize the state of the component
            this.setButtonIcon();

            // get the data
            this.loadDataSource();
        }

        _createClass(SelfComplete, [{
            key: 'reinitialize',
            value: function reinitialize(options) {
                if (this.open) {
                    this.open = false;
                }

                this.removeEventHandlers();
                this.parseOptions(options);
                this.initializeEventHandlers();

                // get the data
                this.loadDataSource();
            }
        }, {
            key: 'parseOptions',
            value: function parseOptions(options) {
                this.options = $.extend({}, this.options, options);

                if (this.options.filter) {
                    this.options.filter = this.options.filter.bind(this);
                }

                if (this.$input.data('value-field')) {
                    this.$valueField = $(this.$input.data('value-field'));
                } else if (typeof this.options.valueField === "string") {
                    this.$valueField = $(this.options.valueField);
                } else if (this.options.valueField && this.options.valueField.length) {
                    this.$valueField = this.options.valueField;
                }

                if (this.$input.data('append-to-body')) {
                    this.options.appendToBody = !!this.$input.data('append-to-body');
                }
                if (this.options.appendToBody) {
                    var id = '' + 10000 * Math.random() * new Date().getTime() * window.outerHeight;
                    this.$items.attr('id', id);
                    this.$container.attr('dd-menu', id);
                    this.$items.detach().appendTo('body');
                }

                var attr = this.$input.attr("open-on-input");
                if (attr == 'false') {
                    this.options.openOnInput = false;
                } else {
                    this.options.openOnInput = true;
                }

                var attr = this.$input.attr("select-first");
                if (attr == 'true') {
                    this.options.selectFirstMatch = true;
                } else {
                    this.options.selectFirstMatch = false;
                }

                var preAppendDataItem = this.$input.attr("pre-append");
                if (preAppendDataItem) {
                    this.options.preAppendDataItem = new Function("li", "item", preAppendDataItem);
                }

                if (this.options.preAppendDataItem) {
                    this.options.preAppendDataItem = this.options.preAppendDataItem.bind(this);
                }

                var validation = this.$input.attr("validation");
                if (validation) {
                    this.options.validation = function (input, data) {
                        return eval(validation);
                    };
                }

                var invalidClassAttr = this.$input.data("invalid-class");
                if (invalidClassAttr) {
                    this.options.invalidClass = invalidClassAttr;
                }

                if (this.options.validation) {
                    this.options.validation = this.options.validation.bind(this);
                }
            }
        }, {
            key: 'initializeEventHandlers',
            value: function initializeEventHandlers() {
                if (this.options.openOnInput) {
                    this.$input[0].addEventListener('input', this._onInputHandler);
                }
                this.$input[0].addEventListener('keydown', this._onKeyDown);
                this.$input[0].addEventListener('blur', this._onBlurHandler);
                this.$input[0].addEventListener(this.options.filterOn, this._filterOnHandler);
                this.$input[0].addEventListener(this.options.validateOn, this._validateOnHandler);
                this.$button[0].addEventListener('click', this._buttonClickHandler);
                window.addEventListener('keydown', this._globalKeyEventHandler);
            }
        }, {
            key: 'removeEventHandlers',
            value: function removeEventHandlers() {
                if (this.options.openOnInput) {
                    this.$input[0].removeEventListener('input', this._onInputHandler);
                }
                this.$input[0].removeEventListener('keydown', this._onKeyDown);
                this.$input[0].removeEventListener(this.options.filterOn, this._filterOnHandler);
                this.$input[0].removeEventListener(this.options.validateOn, this._validateOnHandler);
                this.$button[0].removeEventListener('click', this._buttonClickHandler);
                window.removeEventListener('keydown', this._globalKeyEventHandler);
            }
        }, {
            key: 'setButtonIcon',
            value: function setButtonIcon() {
                this.$button.html('<span class="' + (this.open ? 'fa fa-caret-up' : 'fa fa-caret-down') + '"></span>');
            }
        }, {
            key: 'search',
            value: function search(input) {
                if (!input) {
                    input = '';
                }
                this.selected = null;

                var results = void 0;
                if (this.options.filter) {
                    results = this.options.filter(input, this.data);
                } else {
                    results = this.data;
                }

                this.buildDropdownItems(results);

                if (results && results.length && input) {
                    if (results.length === 1 || this.options.selectFirstMatch) {
                        if (this.autoSelect || this.options.selectFirstMatch) {
                            this.selected = results[0];
                            this.$input.val(results[0][this.options.nameProperty]);
                            this.autoSelect = false;
                        }
                    } else {
                        this.autoSelect = true;
                    }
                }
                return results;
            }
        }, {
            key: 'buildDropdownItems',
            value: function buildDropdownItems(dataItems) {
                var _this4 = this;

                if (!dataItems || !dataItems.length) return;

                var _this = this;
                this.destroyDropdownItems();
                dataItems.forEach(function (x) {
                    var li = document.createElement('li');
                    li.setAttribute('value', x[_this.options.valueProperty]);
                    li.innerHTML = '<a>' + x[_this.options.nameProperty] + '</a>';
                    li.addEventListener('click', function (e) {
                        _this.$input.val(x[_this.options.nameProperty]);
                        _this.selected = x;
                        _this.open = false;
                    });
                    if (_this4.options.preAppendDataItem) {
                        _this4.options.preAppendDataItem(li, x);
                    }
                    _this.$items.append(li);
                });
            }
        }, {
            key: 'destroyDropdownItems',
            value: function destroyDropdownItems() {
                this.$items.children().remove();
            }
        }, {
            key: 'toggleOpen',
            value: function toggleOpen() {
                this.open = !this.open;
            }
        }, {
            key: 'loadDataSource',
            value: function loadDataSource() {
                this.data = [];
                this.datasource = this.$input.data('source');
                if (!this.datasource) {
                    this.datasource = this.options.dataSource;
                }
                if (!this.datasource) {
                    return;
                }
                if (typeof this.datasource === "string") {
                    // URL
                    var _this = this;
                    requestBundler.get(this.datasource, function (data) {
                        _this.data = data;
                        _this.selectInitialValue();
                    });
                } else if (_typeof(this.datasource) === "object") {
                    // Array
                    this.data = this.datasource;
                    this.selectInitialValue();
                }
            }
        }, {
            key: 'selectInitialValue',
            value: function selectInitialValue() {
                if (this.$valueField) {
                    this.selected = this.$valueField.val();
                    this.$input.val(this.selected[this.options.nameProperty]);
                }
                this.$input.trigger(this.options.initialValueSelectedEvent);
            }
        }, {
            key: 'setMenuDirection',
            value: function setMenuDirection() {
                var inputOffset = this.$input.offset();
                var inputHeight = this.$input.outerHeight();
                var inputMarginTop = parseInt(this.$input.css('margin-top'));

                // let menuOffset = this.$items.offset();
                var menuHeight = this.$items.outerHeight();

                var vpHeight = $(window).height();

                var noSpaceBelow = inputOffset.top + inputHeight + menuHeight > vpHeight;
                var spaceAbove = inputOffset.top - $(window).scrollTop() - menuHeight > 0;

                if (noSpaceBelow && spaceAbove) {
                    this.$items.offset({ top: inputOffset.top - menuHeight - inputMarginTop, left: inputOffset.left });
                } else {
                    this.$items.offset({ top: inputOffset.top + inputHeight + inputMarginTop, left: inputOffset.left });
                }
            }
        }, {
            key: 'open',
            get: function get() {
                return !!this.$container.attr('open');
            },
            set: function set(val) {
                // reflect the value of the open property as an HTML attribute
                if (val) {
                    this.$container.attr('open', '');
                } else {
                    this.$container.removeAttr('open');
                }

                this.setButtonIcon();

                if (this.open) {
                    this.buildDropdownItems(this.data);
                    this.$items.show();
                    this.setMenuDirection();
                } else {
                    this.$items.hide();
                    this.destroyDropdownItems();
                }
            }
        }, {
            key: 'selected',
            get: function get() {
                return this.$container.data('selected');
            },
            set: function set(value) {
                var _this5 = this;

                // reflect the value of the selected property as an HTML attribute
                if (!value) {
                    value = {};
                }

                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== "object" && this.data) {
                    if (!isNaN(+value)) {
                        value = +value; // if value is a string we try to convert it to a number, otherwise we leave it as a string
                    }
                    var elem = this.data.filter(function (x) {
                        return x[_this5.options.valueProperty] === value;
                    });
                    if (elem && elem.length && elem[0]) {
                        value = elem[0];
                    }
                }

                this.$container[0].setAttribute('selected', value[this.options.valueProperty] || '');
                this.$container.data('selected', value);

                this.$input.removeClass(this.options.invalidClass);

                if (this.$valueField) {
                    this.$valueField.val(value[this.options.valueProperty] || '');
                }

                if (this.options.onSelected) {
                    this.options.onSelected(this);
                }

                this.$input.trigger('change');
            }
        }]);

        return SelfComplete;
    }();

    var defaultOptions = {
        nameProperty: 'name',
        valueProperty: 'value',
        valueField: null,
        dataSource: null,
        filter: function filter(input, data) {
            var _this6 = this;

            return data.filter(function (x) {
                return ~x[_this6.options.nameProperty].toLowerCase().indexOf(input.toLowerCase());
            });
        },
        filterOn: 'input',
        openOnInput: true,
        preAppendDataItem: null,
        validation: null,
        selectFirstMatch: false,
        validateOn: 'blur',
        onSelected: null,
        invalidClass: 'invalid',
        initialValueSelectedEvent: 'initial-value-selected.selfcomplete',
        appendToBody: false
    };

    var requestBundler = new RequestBundler($.get);

    $.fn.selfcomplete = function (option) {
        this.each(function () {
            var $this = $(this),
                data = $this.data('selfcomplete'),
                options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;
            if (!data) {
                var opts = $.extend({}, defaultOptions, options);
                var selfcomplete = new SelfComplete(this, opts);
                $this.data('selfcomplete', selfcomplete);
            } else {
                data.reinitialize(options);
            }
        });
        return this;
    };

    $(function () {
        $('[data-provide="softec-selfcomplete"]').selfcomplete();
    });
})(window.jQuery);