var Namespace = new Class(function (files, callback) {
    var ajax = new Ajax(),
        sources = [],
        i;

    var Builder = new Class(function (fn) {
        this.data = null;
        
        this.use = function (module) {
            var i;
            //busca nos módulos baixados o módulo requisitado
            for (i in sources) {
                if (sources[i].name === module) {
                    //Retorna o módulo
                    return (new Builder(sources[i].source)).data;
                }
            }
        };
        
        this.exports = function (obj) {
            this.data = obj;
        };
        
        fn.apply(this);
    });

    for (i in files) {
        //Pega o código de cada arquivo
        ajax.get(files[i], function (data) {
            var i,
                space = {};
            //Grava o código e o nome do arquivo
            sources.push({
                name   : i
                source : new Function(data);
            });
            //Verifica se todos os arquivos ja foram entregues
            if (sources.length === files.length) {
                for (i in sources) {
                    //Coloca os objetos no resultado
                    space[sources[i].name] = (new Builder(sources[i].source)).data;
                }
                //Responde o namespace
                callback(space);
            }
        });
    }
});



/*--------------- home.js ---------------*/

new Namespace({
    models      : '/models/models.js'
}, function () {
    var dog = new this.models.Dog('odie');
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
