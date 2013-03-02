var Namespace = new Class(function (files, callback) {
    var ajax = new Ajax(),
        sources = [],
        space = {}
        i;

    var temp = function () {
        this.data = null;
        
        this.use = function (module) {
            
        };
        
        this.exports = function (obj) {
            this.data = obj;
        };
        
    };

    for (i in files) {
        //Pega o código de cada arquivo
        ajax.get(files[i], function (data) {
            var i;
            
            //Grava o código do arquivo
            sources.push({
                name   : i
                source : data
            });
            
            //Verifica se todos os arquivos ja foram entregues
            if (sources.length === files.length) {
                for (i in sources) {
                    //Constrói os elementos do espaço
                    var f = new Function(sources[i].source);
                    space[sources[i].name] = f.apply(new Temp()).data;
                }
                
                callback(space);
            }
            
        });
    }
});



/*--------------- home.js ---------------*/

new Namespace({
    models      : '/models/models.js',
    controllers : '/controllers/controllers.js',
    views       : '/views/views.js'
}, function () {
    var dog = new this.models.Dog('pluto');
    var cat = new this.models.Cat('garfield');
    
    dog.bark();
    cat.meow();
});

/*-------------- models.js --------------*/

var exports = this.exports;

new Namespace({
    Animal : '/models/animal.js',
    Dog    : '/models/dog.js',
    Cat    : '/models/cat.js',
}, function () {
    exports(this);
});

/*-------------- Animal.js --------------*/

this.exports(new Class(function (name) {
    this.name = name;
    
    this.say = function (message) {
        console.log(this.name + ' says: ' + message);
    }
}));

/*-------------- dog.js --------------*/

var Animal = this.use('Animal');

this.exports(new Class(function () {
    this.inherits(Animal);
    
    this.bark = function () {
        this.say('Au Au!');
    }
}));

/*-------------- cat.js --------------*/

var Animal = this.use('Animal');

this.exports(new Class(function () {
    this.inherits(Animal);
    
    this.meow = function () {
        this.say('Meow!');
    }
}));
