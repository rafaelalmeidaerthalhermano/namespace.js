
/* @class: Namespace
*
* @author: Rafael Almeida Erthal Hermano
* @description: Construtor de um namespace
*
* @param files: arquivos que vão montar o namespace
* @param callback: callback a ser chamado após a criação do namespace
*/
var Namespace = new Class(function (files, callback) {
    var ajax = new Ajax(),
        requests = 0,
        returns = 0,
        sources = [],
        that = this;

    /* @class: Module
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Ambiente em que os arquivos são executados
    *
    * @param fn: código do arquivo a ser executado
    */
    var Module = new Class(function (source) {
        /* @function use
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Pega um objeto do namespace
        *
        * @param module: modulos a serem usados
        * @param callback: callback a ser chamado após a requisição do arquivo específico
        */
        this.use = function (module, callback) {
        };
        
        /* @function exports
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Seta o valor retornado do arquivo
        *
        * @param obj: valor a ser retornado
        */
        this.exports = function (obj) {
            returns++;
            that[source.name] = obj;
            if (sources.length === returns) {
                callback.apply(that);
            }
        };
    });
    
    /* @function build
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Monta o namespace
    */
    var build = function () {
        for (var i in sources) {
            sources[i].source(new Module(sources[i]));
        }
    }
    
    /* @function source
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Pega o código de cada arquivo
    *
    * @param name: nome do arquivo
    */
    var source = function (name) {
        ajax.get(files[name], function (data) {
            //Grava o código e o nome do arquivo
            sources.push({
                name   : name,
                source : new Function("module", data)
            });
            if (sources.length === requests) {
                build();
            }
        });
    }

    for (var i in files) {
        requests++;
    }

    for (var i in files) {
        source(i);
    }
});
