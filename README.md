# angular-easy-masks

AngularJS component for input fields based on a configurable mask.
Compatible with **AngularJS 1.3.4+**.
Works together with **ngModelOptions** introduced in AngularJS 1.3.

[Live Demo](http://awerlang.github.io/angular-easy-masks/examples/)

## Why?

The problem of typing data according to some predefined mask is nothing new.
Solutions already exists for this, even natively in AngularJS.
Unfortunately, I didn't managed to find a solution that worked the way it should.

All is needed to such a component is to:

    a) Guide user through typing on an input field, inserting character separators where appropriate; and
    b) If there's an existing value, it should be presented according the mask provided.

Quite simple, it seems.

But in practice, not so.
I freaked out when I became aware how some libraries approached these requirements
(and with hundreds of lines of code, and dozens of concepts to learn).
It looks like **clumsy code is winning!!**
But I **refuse to use that code** in my projects (it's better when we don't see the code, though).

Then I decided to tackle on this problem and here I present you my approach.
I also took it as a **exercise of good design**, so it was also pleasing to write.
When I realized it was actually doing its job well, I decided to polish it and share.
From the first prototype, it took a couple of hours more to have it working the *AngularJS way*.
A handful more to make it actually releasable (bower, npm, git).

All this work is based on the following assumptions:

* If it is *flexible*, then it would solve most problems, even ones not aimed by the library author's;
* Focusing on the task of *defining input masks*, in order to accomplish a greater objective (*smooth user input*);
* *Storing input together with separators* (if any) makes more sense and should be easy;
* Do *not mess with model's value* unless user has typed something;
* Do *the best to parse user input*, even input coming from database, in case it does not fulfill the mask;
* Provide *convenience* without sacrificing flexibility;
* By keeping *code base simple*, it is easier to reason about and evolve;
* By fully covering with tests, it can *evolve without introducing bugs*.

## Features

* Angular native implementation compatible with 1.3.4+;
* Validate input format, setting `ngFormController's $error` property as appropriate;
* Store separators in models by default (WYSIWYG);
* Handles source model containing separators or not;
* Handle optional symbols in input mask;
* Allows programmatic change of model value;
* Automatically sets input's `maxlength` for you;
* Provide filter for use on interpolation;
* Publish common masks under a name;
* Option to remove separator from model value;
* Integrate seamlessly with `ngModelOptions` (allowInvalid, ngChange, debounce, updateOn).

Also, the following requirements can be achieved by means of integrating with other components:

* Automatic focus next component when input is completed.

### Recognized mask wildcards

* `0`: digit, optional
* `9`: digit, required
* `A`: alphanumeric, required
* `L`: alpha, required
* `Z`: alpha, optional

## Future Work

Current version: **v0.2.4**

* v0.3.0
  * Delegate validation to custom services;
  * Raise events on format valid/invalid;
  * Make possible use in conjunction with `input type="date"`
* before 1.0
  * BREAKING CHANGE (service): Digit 9 mean optional digits, use digit 0 to mean required

## Usage

    <input type="text" ng-model="ctrl.field" wt-easy-mask="999.999.999-99" />

or

    <input type="text" ng-model="ctrl.field" wt-easy-mask="999.999.999-99" placeholder="Type your Identitication Number"/>

## Configuration

    app.config(function (easyMaskProvider) {
        easyMaskProvider.publishMask('myId', '999.999.999-99');
    });

### Directives

#### wt-easy-mask

 * wt-easy-mask: the mask
 * placeholder: the mask (optional, if different from the mask)
 * wt-easy-mask-options:
   * removeSeparators: boolean = `true`, if separators should be removed before updating the model
     * Will be deprecated in future version. Use removeMask instead.
   * removeMask: boolean = `true`, if mask should be removed before updating the model
   * emptyPlaceholder: boolean = `true`, to prevent any placeholder on the component

### Filters

    {{data | easyMask:'99.999-9'}}
    {{data | easyMask:'myId'}}

## Installation

### npm

    npm --save install angular-easy-masks

### Bower (deprecated)

    bower install angular-easy-masks --save

### Application

#### HTML

    <script type="text/javascript" src="release/angular-easy-masks.min.js"></script>

OBS: Also available as `angular-easy-masks.js` (UMD, unminified) and `angular-easy-masks.esm.js` (ES2015 modules)

#### JavaScript

    var app = angular.module('app', ['wt.easy']);

## License

MIT
