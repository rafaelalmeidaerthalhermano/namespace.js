var Namespace = new Class(function (files, callback) {
    var ajax = new Ajax(),
        sources = [],
        i,
        count = 0;

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
        count++;
    }

    var save = function (name) {
        ajax.get(files[name], function (data) {
            var i,
                space = {};
            //Grava o código e o nome do arquivo
            sources.push({
                name   : name,
                source : new Function(data)
            });
            //Verifica se todos os arquivos ja foram entregues
            if (sources.length === count) {
                for (i in sources) {
                    //Coloca os objetos no resultado
                    space[sources[i].name] = (new Builder(sources[i].source)).data;
                }
                //Responde o namespace
                callback.apply(space);
            }
        });
    }

    for (i in files) {
        //Pega o código de cada arquivo
        save(i);
    }
});
