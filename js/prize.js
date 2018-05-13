"use strict";

var PrizerGame = function () {
    LocalContractStorage.defineMapProperty(this, "doc", null)
};
Prizerdoc.prototype = {
    init: function () {
        var targetNumber = parseInt(Math.random() * 100);
        this.doc.put('status', 1);
        this.doc.put('documentLines', []);
        this.doc.put('docName', [])
        this.doc.put('docPhone',[])
    },

    add: function (person) {
        var status = parseInt(this.doc.get('status'));
        var name = person[0]
        var phone = person[1]
        if(status === 0){
            this.reset();
        }
        if(typeof lines === "string"){
            throw new Error(lines);
        }
        var lines = this.doc.get('documentLines')
        lines.push({from:Blockchain.transaction.from, name: name, phoneNum: phoneNum});
        this.doc.put('documentNameLines',lines);
        var docName = this.doc.get('docName')
        docName.push(name)
        this.doc.put('docName', docName)
        var docName = this.doc.get('docPhone')
        docName.push(phoneNum)
        this.doc.put('docPhone', phoneNum)
        
    },

    get: function() {
        var nameArr = this.doc.get('docName')
        var phoneArr = this.doc.get('docPhone')
        var doc = {
            status: this.doc.get('status'),
            name: nameArr,
            phone: phoneArr,
        }
        return doc;
    },

    start: function() {
        var doc = this.get()
        var length = doc.name.length
        var num = length + 1
        var targetNumber = parseInt(Math.random() * num);
        var name = nameArr[targetNumber]
        var phone = phoneArr[targetNumber]
        nameArr.splice($.inArray(nameArr[targetNumber], nameArr), 1);
	    phoneArr.splice($.inArray(phoneArr[targetNumber], phoneArr), 1);
        this.doc.put('docName', nameArr)
        this.doc.put('docPhone', phoneArr)
        return {
            name: name,
            phone: phone,
        }
    },

    restart : function() {
        var status = this.doc.get('status');
        if(status === 0){
            this.doc.put('status', 1);
            this.doc.put('docName', []);
            this.doc.put('docPhone', []);
            this.doc.put('lines', [{from:Blockchain.transaction.from, name: [], phone: []}]);
        }  
    }
};
module.exports = Prizerdoc;