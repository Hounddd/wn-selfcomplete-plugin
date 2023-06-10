(function () {

    /**
     * SelfComplete global function
     *
     * @param {node} inputEl The text field element
     */
    window.selfcomplete = function(inputEl) {

        var currentFocus;

        // Add input event listener to text field
        inputEl.addEventListener("input", function (e) {
            var val = this.value;

            closeAllLists();
            if (!val) { return false; }

            createList(this);
        });

        // Add input keydown listener to text field
        inputEl.addEventListener("keydown", function (e) {
            var list = document.getElementById(this.id + "selfcomplete-list");
            if (list) {
                listItem = list.getElementsByTagName("div");

                if (e.keyCode == 40) {
                    // Arrow DOWN key pressed, increase the currentFocus variable
                    currentFocus++;
                    // Make current item highlighted
                    addActiveClass(listItem, list);
                } else if (e.keyCode == 38) {
                    // Arrow UP key pressed, decrease the currentFocus variable
                    currentFocus--;
                    // Make current item highlighted
                    addActiveClass(listItem, list);
                } else if (e.keyCode == 13) {
                    // ENTER key pressed, prevent the form from being submitted
                    e.preventDefault();
                    if (currentFocus > -1) {
                        // Simulate click on the "active" suggestion
                        if (listItem)
                            listItem[currentFocus].click();
                    }
                } else if (e.keyCode == 27) {
                    // ESC key pressed, close suggestions list
                    closeAllLists();
                }
            } else {
                if (e.keyCode == 40 && this.value == '') {
                    // Arrow DOWN key pressed on an empty field, display all suggestions
                    // console.log('make a list with all values');

                    createList(this);

                }
            }
        });


        function createList(inputEl) {
            var list,
                matchNode,
                i,
                val = inputEl.value;

            currentFocus = -1;

            // Create a DIV element that will contain the suggestions (values)
            list = document.createElement("DIV");
            list.setAttribute("id", inputEl.id + "selfcomplete-list");
            list.setAttribute("class", "selfcomplete-items");

            if (inputEl.dataset.maxitems) {
                list.setAttribute("style", "--selfcomplete-max-items: " + inputEl.dataset.maxitems);
            }

            // Append the list element as a child of the selfcomplete container
            inputEl.parentNode.appendChild(list);

            // const asArray = Object.entries(objValues);
            const asArray = Object.entries(JSON.parse(inputEl.dataset.availableValues));

            // Reduce the available values
            const listeValues = asArray.filter(([key, value]) => value.toUpperCase().includes(val.toUpperCase()));

            // Iterates through values
            for (i = 0; i < listeValues.length; i++) {

                // Create a dom element representing a matching suggestion
                matchNode = document.createElement("DIV");

                // Check if suggestion contain the text field value
                if (val != '' && listeValues[i][1].toUpperCase().includes(val.toUpperCase())) {
                    // Highlight matching letters in suggestion
                    matchNode.innerHTML = listeValues[i][1].replace(new RegExp(val, "gi"), function (match) {
                        return '<strong>' + match + '</strong>'
                    });
                } else {
                    matchNode.innerHTML = listeValues[i][1];
                }

                // Insert a input field that will hold the current suggestion value
                matchNode.innerHTML += "<input type='hidden' value='" + listeValues[i][0] + "'>";

                // Add event listener to matchNode
                matchNode.addEventListener("click", function (e) {
                    // Insert the value in the selfcomplete text field
                    inputEl.value = this.getElementsByTagName("input")[0].value;
                    // Close the list
                    closeAllLists();
                });

                list.appendChild(matchNode);

            }

            list.scrollTo(0, 0);
        }

        /**
         * Add 'selfcomplete-active' to the active suggestion node
         * @param {HTMLCollection} x List of suggestion nodes in a list
         * @param {node} List of suggestions
         */
        function addActiveClass(x, list) {
            if (!x)
                return false;

            removeActiveClass(x);

            if (currentFocus >= x.length)
                currentFocus = 0;
            if (currentFocus < 0)
                currentFocus = (x.length - 1);

            x[currentFocus].classList.add("selfcomplete-active");

            // Scroll the list
            var scrollTo;
            var itemTop = x[currentFocus].offsetTop;
            var min = list.scrollTop;
            var max = Math.abs(list.clientHeight + list.scrollTop);

            if (itemTop == 0) {
                scrollTo = 0;
            } else if ((min < itemTop) && (itemTop >= max)) {
                scrollTo = itemTop;
            } else if (itemTop < min) { // && (itemTop >= max)) {
                scrollTo = (min - list.clientHeight);
            }

            list.scrollTo({
                top: scrollTo,
                left: 0,
                behavior: 'smooth'
            });
        }

        /**
         * Remove 'selfcomplete-active' to all suggestions node
         * @param {HTMLCollection} x List of suggestion nodes in a list
         */
        function removeActiveClass(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("selfcomplete-active");
            }
        }

        /**
         * Close open suggestions lists
         * @param {node} elmnt Suggestion list to keep open
         */
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("selfcomplete-items");

            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inputEl) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        // Add global document event listener to close all suggestions lists
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    document.querySelectorAll('[data-control="selfcomplete"]').forEach(function (element) {
        window.selfcomplete(element);
    })
})();



// ((Snowboard) => {
//     /**
//      * Self complete form widget.
//      *
//      * Creates an self complete form widget, that contains a text field, and a
//      * popup that allows a user to easily select a value.
//      *
//      * @author Damien MATHIEU
//      * @copyright 2022 Winter CMS.
//      */
//     class SelfComplete extends Snowboard.PluginBase {
//         construct(element) {
//             this.element = element;
//             this.config = this.snowboard.dataConfig(this, element);

//             console.log(this.element, this.config, this.config.get('availableValues'));
//         }

//         destruct() {
//         }
//     };

//     Snowboard.addPlugin('backend.formwidgets.selfcomplete', SelfComplete);
//     Snowboard['backend.ui.widgetHandler']().register('selfcomplete', 'backend.formwidgets.selfcomplete');

// })(window.Snowboard);
