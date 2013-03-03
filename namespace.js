/**
* Copyright (C) 2013 Rafael Almeida Erthal Hermano
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see http://www.gnu.org/licenses/.
*/

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
        sources = [],
        i,
        count = 0;

    /* @class: Builder
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Ambiente em que os arquivos são executados
    *
    * @param fn: código do arquivo a ser executado
    */
    var Builder = new Class(function (fn) {
        this.data = null;
        
        /* @function use
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Pega um objeto do namespace
        *
        * @param module: nome do modulo a ser pego
        */
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
        
        /* @function exports
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Seta o valor retornado do arquivo
        *
        * @param obj: valor a ser retornado
        */
        this.exports = function (obj) {
            this.data = obj;
        };
        
        fn.apply(this);
    });

    for (i in files) {
        count++;
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
        source(i);
    }
});
