(function (laroux) {
    'use strict';

    // requires $l.helpers
    // requires $l.dom

    // css
    laroux.css = {
        // class features
        hasClass: function (element, className) {
            return element.classList.contains(className);
        },

        addClass: function (element, className) {
            var elements = laroux.helpers.getAsArray(element);

            for (var i = 0, length = elements.length; i < length; i++) {
                elements[i].classList.add(className);
            }
        },

        removeClass: function (element, className) {
            var elements = laroux.helpers.getAsArray(element);

            for (var i = 0, length = elements.length; i < length; i++) {
                elements[i].classList.remove(className);
            }
        },

        toggleClass: function (element, className) {
            var elements = laroux.helpers.getAsArray(element);

            for (var i = 0, length = elements.length; i < length; i++) {
                if (elements[i].classList.contains(className)) {
                    elements[i].classList.remove(className);
                } else {
                    elements[i].classList.add(className);
                }
            }
        },

        cycleClass: function (elements, className) {
            for (var i = 0, length = elements.length; i < length; i++) {
                if (elements[i].classList.contains(className)) {
                    elements[i].classList.remove(className);
                    elements[(i + 1) % length].classList.add(className);
                    return;
                }
            }
        },

        // style features
        getProperty: function (element, styleName) {
            var style = getComputedStyle(element);

            styleName = laroux.helpers.antiCamelCase(styleName);

            return style.getPropertyValue(styleName);
        },

        setProperty: function (element, properties, value) {
            var elements = laroux.helpers.getAsArray(element);

            if (typeof properties == 'string') {
                var oldProperties = properties;
                properties = {};
                properties[oldProperties] = value;
            }

            for (var styleName in properties) {
                if (!properties.hasOwnProperty(styleName)) {
                    continue;
                }

                var newStyleName = laroux.helpers.camelCase(styleName);

                for (var i = 0, length = elements.length; i < length; i++) {
                    elements[i].style[newStyleName] = properties[styleName];
                }
            }
        },

        // transition features
        defaultTransition: '2s ease',

        setTransitionSingle: function (element, transition) {
            var transitions = laroux.helpers.getAsArray(transition),
                style = getComputedStyle(element),
                currentTransitions = style.getPropertyValue('transition') || style.getPropertyValue('-webkit-transition') ||
                    style.getPropertyValue('-ms-transition') || '',
                currentTransitionsArray;

            if (currentTransitions.length > 0) {
                currentTransitionsArray = currentTransitions.split(',');
            } else {
                currentTransitionsArray = [];
            }

            for (var item in transitions) {
                if (!transitions.hasOwnProperty(item)) {
                    continue;
                }

                var styleName,
                    transitionProperties,
                    pos = transitions[item].indexOf(' ');

                if (pos !== -1) {
                    styleName = transitions[item].substring(0, pos);
                    transitionProperties = transitions[item].substring(pos + 1);
                } else {
                    styleName = transitions[item];
                    transitionProperties = laroux.css.defaultTransition;
                }

                var found = false;
                for (var j = 0; j < currentTransitionsArray.length; j++) {
                    if (currentTransitionsArray[j].trim().localeCompare(styleName) === 0) {
                        currentTransitionsArray[j] = styleName + ' ' + transitionProperties;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    currentTransitionsArray.push(styleName + ' ' + transitionProperties);
                }
            }

            var value = currentTransitionsArray.join(', ');

            element.style.transition = value;
            element.style.webkitTransition = value;
            element.style.msTransition = value;
        },

        setTransition: function (element, transition) {
            var elements = laroux.helpers.getAsArray(element);

            for (var i = 0, length = elements.length; i < length; i++) {
                laroux.css.setTransitionSingle(elements[i], transition);
            }
        },

        show: function (element, transitionProperties) {
            if (transitionProperties !== undefined) {
                laroux.css.setTransition(element, 'opacity ' + transitionProperties);
            } else {
                laroux.css.setTransition(element, 'opacity');
            }

            laroux.css.setProperty(element, {opacity: 1});
        },

        hide: function (element, transitionProperties) {
            if (transitionProperties !== undefined) {
                laroux.css.setTransition(element, 'opacity ' + transitionProperties);
            } else {
                laroux.css.setTransition(element, 'opacity');
            }

            laroux.css.setProperty(element, {opacity: 0});
        },

        // measurement features
        // height of element without padding, margin and border
        height: function (element) {
            var style = getComputedStyle(element),
                height = style.getPropertyCSSValue('height');

            return height.getFloatValue(height.primitiveType);
        },

        // height of element with padding but without margin and border
        innerHeight: function (element) {
            return element.clientHeight;
        },

        // height of element with padding and border but margin optional
        outerHeight: function (element, includeMargin) {
            if (includeMargin || false) {
                return element.offsetHeight;
            }

            var style = getComputedStyle(element),
                marginTop = style.getPropertyCSSValue('margin-top'),
                marginBottom = style.getPropertyCSSValue('margin-bottom'),
                margins = marginTop.getFloatValue(marginTop.primitiveType) +
                    marginBottom.getFloatValue(marginBottom.primitiveType);

            return Math.ceil(element.offsetHeight + margins);
        },

        // width of element without padding, margin and border
        width: function (element) {
            var style = getComputedStyle(element),
                height = style.getPropertyCSSValue('width');

            return height.getFloatValue(height.primitiveType);
        },

        // width of element with padding but without margin and border
        innerWidth: function (element) {
            return element.clientWidth;
        },

        // width of element with padding and border but margin optional
        outerWidth: function (element, includeMargin) {
            if (includeMargin || false) {
                return element.offsetWidth;
            }

            var style = getComputedStyle(element),
                marginLeft = style.getPropertyCSSValue('margin-left'),
                marginRight = style.getPropertyCSSValue('margin-right'),
                margins = marginLeft.getFloatValue(marginLeft.primitiveType) +
                    marginRight.getFloatValue(marginRight.primitiveType);

            return Math.ceil(element.offsetWidth + margins);
        },

        top: function (element) {
            return element.getBoundingClientRect().top +
                ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
        },

        left: function (element) {
            return element.getBoundingClientRect().left +
                ((document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft);
        },

        aboveTheTop: function (element) {
            return element.getBoundingClientRect().bottom <= 0;
        },

        belowTheFold: function (element) {
            return element.getBoundingClientRect().top > laroux.parent.innerHeight;
        },

        leftOfScreen: function (element) {
            return element.getBoundingClientRect().right <= 0;
        },

        rightOfScreen: function (element) {
            return element.getBoundingClientRect().left > laroux.parent.innerWidth;
        },

        inViewport: function (element) {
            var rect = element.getBoundingClientRect();

            return !(rect.bottom <= 0 || rect.top > laroux.parent.innerHeight ||
                rect.right <= 0 || rect.left > laroux.parent.innerWidth);
        }
    };

    // wrapper support
    if (laroux.wrapper !== undefined) {
        laroux.wrapper.register('hasClass', laroux.css.hasClass, laroux.wrapper.registerSingle);
        laroux.wrapper.register('addClass', laroux.css.addClass, laroux.wrapper.registerBoth);
        laroux.wrapper.register('removeClass', laroux.css.removeClass, laroux.wrapper.registerBoth);
        laroux.wrapper.register('toggleClass', laroux.css.toggleClass, laroux.wrapper.registerBoth);
        laroux.wrapper.register('getProperty', laroux.css.getProperty, laroux.wrapper.registerSingle);
        laroux.wrapper.register('setProperty', laroux.css.setProperty, laroux.wrapper.registerBoth);
        laroux.wrapper.register('setTransition', laroux.css.setTransition, laroux.wrapper.registerBoth);
        laroux.wrapper.register('show', laroux.css.show, laroux.wrapper.registerBoth);
        laroux.wrapper.register('hide', laroux.css.hide, laroux.wrapper.registerBoth);
        laroux.wrapper.register('height', laroux.css.height, laroux.wrapper.registerSingle);
        laroux.wrapper.register('innerHeight', laroux.css.innerHeight, laroux.wrapper.registerSingle);
        laroux.wrapper.register('outerHeight', laroux.css.outerHeight, laroux.wrapper.registerSingle);
        laroux.wrapper.register('width', laroux.css.width, laroux.wrapper.registerSingle);
        laroux.wrapper.register('innerWidth', laroux.css.innerWidth, laroux.wrapper.registerSingle);
        laroux.wrapper.register('outerWidth', laroux.css.outerWidth, laroux.wrapper.registerSingle);
        laroux.wrapper.register('top', laroux.css.top, laroux.wrapper.registerSingle);
        laroux.wrapper.register('left', laroux.css.left, laroux.wrapper.registerSingle);
        laroux.wrapper.register('aboveTheTop', laroux.css.aboveTheTop, laroux.wrapper.registerSingle);
        laroux.wrapper.register('belowTheFold', laroux.css.belowTheFold, laroux.wrapper.registerSingle);
        laroux.wrapper.register('leftOfScreen', laroux.css.leftOfScreen, laroux.wrapper.registerSingle);
        laroux.wrapper.register('rightOfScreen', laroux.css.rightOfScreen, laroux.wrapper.registerSingle);
        laroux.wrapper.register('inViewport', laroux.css.inViewport, laroux.wrapper.registerSingle);
    }

}(this.laroux));
