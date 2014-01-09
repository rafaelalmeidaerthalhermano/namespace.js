Namespace.js
============
This project uses the [Class.js](http://github.com/rafaelalmeidaerthalhermano/class.js) project and [Ajax.js](http://github.com/rafaelalmeidaerthalhermano/ajax.js) project

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
module.exports(new Class(function (name) {
    this.name = name;
    
    this.say = function (message) {
        console.log(this.name + ' says: ' + message);
    }
}));
```

/models/dog.js
```js
var Animal = module.use('Animal');

module.exports(new Class(function () {
    this.inherit(Animal);
    
    this.bark = function () {
        this.say('Au Au!');
    }
}));
```

/models/cat.js
```js
var Animal = module.use('Animal');

module.exports(new Class(function () {
    this.inherit(Animal);
    
    this.meow = function () {
        this.say('Meow!');
    }
}));
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/rafaelalmeidaerthalhermano/namespace.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

