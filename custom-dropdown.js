
'use strict';
var stringToSearch = '',
	keyTimeout,
	matchMedia = require('../utilities/match-media');

/**
	@function initFilterDropdown
	@public
	@returns {undefined}
	@desc Filter Dropdown Initialization
	@interface initFilterDropdown();
*/
var initFilterDropdown = function ($dropdownOption) {
	if ($dropdownOption.hasClass('selected')) {
		$dropdownOption.removeClass('selected').find('.js-selected-icon').addClass('hidden');
	} else {
		$dropdownOption.addClass('selected').find('.js-selected-icon').removeClass('hidden');
	}
};

/**
	@function updateCustomDropdown
	@public
	@returns {undefined}
	@desc Update custom dropdown
	@interface updateCustomDropdown();
*/
var updateCustomDropdown = function ($dropdown, $dropdownOption) {
	var $selectedArrow = '<span class="selected-icon dropdown-icons"><svg viewBox="0 3 100 60"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-checkmark-black"></use></svg></span>';

	$dropdown.find('.selected-icon').remove();
	$dropdownOption.append($selectedArrow);
	$dropdown.find('.js-dropdown-down > .country-flag').html('').html($dropdownOption.find('.country-flag').html());
	$dropdown.find('.dropdown-selected-text').html($dropdownOption.find('a').html());
	$dropdown.find('input').val($dropdownOption.find('a').data().value);
	$dropdown.find('input').trigger('blur');
	return $dropdown.find('input').val();
};

/**
	@function closeCustomDropdown
	@private
	@returns {undefined}
	@desc Close custom dropdown
	@interface closeCustomDropdown($dropdown);
*/
var closeCustomDropdown = function ($dropdown) {
	$dropdown.removeClass('opened').find('ul')
		.velocity('slideUp', {
			duration: 500,
			easing: 'easeOutQuart'
		});
};

/**
 * Click event handler fort dropdown list items.
 * @param {Event} e Event object.
 * @param {Boolean} isManual Whether to update dropdown value explicitly or not.
*/
var onclickDropdown = function (e, isManual) {
	e.preventDefault();
	var $dropdown = $(this);
	var $currentTarget = $(e.target),
		$input = $(this).find('input'),
		$dropdownOption = $currentTarget.closest('li');


	// Code for filter dropdown
	if ($dropdown.hasClass('js-filter-dropdown') && $dropdownOption.length) {
		initFilterDropdown($dropdownOption);
		return;
	}

	if ($dropdownOption.length && !$dropdownOption.hasClass('selected')) {
		$dropdown.find('.selected').removeClass('selected');
		$dropdownOption.addClass('selected');
		var selectedVal = null;
		try {
			selectedVal = updateCustomDropdown($dropdown, $dropdownOption);
		} finally {
			$dropdown.trigger('customDropdown:change', [$dropdown, selectedVal]);
		}
	}

	// If click event triggred manually then do not change state of dropdown and return back.
	if (isManual) {
		return;
	}

	if ($dropdown.hasClass('opened')) {
		if ($dropdownOption.length && !$dropdownOption.hasClass('selected')) {
			$dropdown.find('.highlight').removeClass('highlight');
		}
		closeCustomDropdown($dropdown);
	} else {
		$dropdown.find('.highlight').removeClass('highlight');
		if ($dropdown.find('li.selected')[0]) {
			$dropdown.find('li.selected').addClass('highlight').find('a').focus();
		} else {
			$dropdown.find('li:first-child').addClass('highlight').find('a').focus();
		}

		$dropdown.addClass('opened').find('ul')
			.velocity('slideDown', {
				duration: 500,
				easing: 'easeOutQuart'
			});
		if (matchMedia.isDesktop() === true || matchMedia.isLargeDesktop() === true) {
			$input.focus();
		}
	}
};

var clearDropdown = function($target) {
	var $allDropdowns = $target.find('.mod_custom_dropdown');
	$allDropdowns.find('li').removeClass('selected highlight');
	$allDropdowns.find('li:first-child').addClass('selected');
	for (var i = 0; i < $allDropdowns.length; i++) {
		var $currentDropdown = $($allDropdowns[i]),
			$firstDropdownEl = $currentDropdown.find('li:first-child');
		updateCustomDropdown($currentDropdown, $firstDropdownEl);
	}
};

/**
	@function dropdownNavigateOnTyping
	@private
	@returns {undefined}
	@param {DOM} $opnedDropdown - Custom dropdown in opned state
	@interface dropdownNavigateOnTyping($opnedDropdown);
*/
var dropdownNavigateOnTyping = function ($opnedDropdown) {
	var testRegex = new RegExp('^' + stringToSearch, 'i'),
		$menuLi = $opnedDropdown.find('ul li');
	if (stringToSearch) {
		for (var i = 0; i < $menuLi.length; i++) {
			if (testRegex.test($($menuLi[i]).text().trim())) {
				$menuLi.filter('.highlight').removeClass('highlight');
				$($menuLi[i]).addClass('highlight').find('a').focus();
				break;
			}
		}
	}
	stringToSearch = '';
	if (keyTimeout) {
		clearTimeout(keyTimeout);
	}
};

/**
	@function dropdownNavigateOnArrowKey
	@private
	@returns {undefined}
	@param {string} arrowDirection - Direction of arrow keys
	@param {DOM} $opnedDropdown - Custom dropdown in opned state
	@interface dropdownNavigateOnArrowKey(arrowDirection, $opnedDropdown);
*/
var dropdownNavigateOnArrowKey = function (arrowDirection, $opnedDropdown) {
	var $menuLi = $opnedDropdown.find('li.highlight');
	if ($menuLi.length) {
		if (arrowDirection === 'down') {
			if ($menuLi.next().length) {
				$menuLi.removeClass('highlight').next().addClass('highlight').find('a').focus();
			}
		} else {
			if ($menuLi.prev().length) {
				$menuLi.removeClass('highlight').prev().addClass('highlight').find('a').focus();
			}
		}
	} else {
		$opnedDropdown.find('li:first-child').addClass('highlight').find('a').focus();
	}
};

/**
	@function selectAccessibility
	@private
	@returns {undefined}
	@param {Object} e - The event object on keydown
	@param {DOM} $opnedDropdown - Custom dropdown in opned state
	@interface selectAccessibility(e, $opnedDropdown);
*/
var selectAccessibility = function(e, $opnedDropdown) {
	var code = e.which || e.keyCode,
		pressedKey = String.fromCharCode(code).toLowerCase();

	if (code !== 9) {
		e.preventDefault();
	} else {
		closeCustomDropdown($opnedDropdown);
	}
	if (code === 40) {
		dropdownNavigateOnArrowKey('down', $opnedDropdown);
	} else if (code === 38) {
		dropdownNavigateOnArrowKey('up', $opnedDropdown);
	} else if ((/[\w\d]/).test(pressedKey)) {
		stringToSearch += pressedKey;
		keyTimeout = setTimeout(function () {
			dropdownNavigateOnTyping($opnedDropdown);
		}, 500);
	}
};

/**
	@function initCustomDropdown
	@public
	@returns {undefined}
	@desc Custom Dropdown Initialization
	@interface initCustomDropdown();
*/
var initCustomDropdown = function ($target) {

	$target.off('click.customDropdown keydown.customDropdown').on('click.customDropdown keydown.customDropdown', '.js-dropdown', function(e, isManual) {
		if (e.type === 'keydown') {
			selectAccessibility(e, $(this).closest('.js-dropdown.opened'));
		}
		if (e.type === 'keydown' && e.which !== 13) {
			return;
		}
		onclickDropdown.call(this, e, isManual);
	}).off('mouseup.customDropdown').on('mouseup.customDropdown', function (e) {
		var $dropdown = $('.js-dropdown.opened');
		// if the target of the click isn't the container nor a descendant of the container
		if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
			closeCustomDropdown($dropdown);
		}
	});
};

module.exports.init = function () {
	var $target = $('body');
	initCustomDropdown($target);
};

// Expose Methods
exports.initCustomDropdown = initCustomDropdown;
exports.clearDropdown = clearDropdown;
