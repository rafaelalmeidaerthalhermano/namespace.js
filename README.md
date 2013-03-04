Namespace.js
============

Usage example

Home.js
```js
new Namespace({
    models : '/models/models.js'
}, function () {
    var dog = new this.models.Dog('odie');
    var cat = new this.models.Cat('garfield');
    
    dog.bark();
    cat.meow();
});
```

/models/models.js
```js
var module = this;

new Namespace({
    Animal : '/models/animal.js',
    Dog    : '/models/dog.js',
    Cat    : '/models/cat.js',
}, function () {
    module.exports(this);
});
```

/models/animal.js
```js
this.exports(new Class(function (name) {
    this.name = name;
    
    this.say = function (message) {
        console.log(this.name + ' says: ' + message);
    }
}));
```

/models/dog.js
```js
var Animal = this.use('Animal');

this.exports(new Class(function () {
    this.inherit(Animal);
    
    this.bark = function () {
        this.say('Au Au!');
    }
}));
```

/models/cat.js
```js
var Animal = this.use('Animal');

this.exports(new Class(function () {
    this.inherit(Animal);
    
    this.meow = function () {
        this.say('Meow!');
    }
}));
```
