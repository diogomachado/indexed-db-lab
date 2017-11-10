// Inicializando usando prefixos para suportar os browsers
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// Prefixos do objeto IDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

// Verifica se tem suporte
if (!window.indexedDB) {
    window.alert("Seu browser não suporta IndexedDB.")
}

// Dados para armazenar
const employeeData = [
    {id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
    {id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
];

var db;

// Abre uma base
var request = window.indexedDB.open("Freeburguer", 1);

// Eventos que ocorrem no banco
request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("Banco aberto com sucesso: " + db);
};

// Evento executado apenas quando existe uma versão nova do banco
// Obs: assim que aberto pela primeira vez, implanta os dados iniciais
request.onupgradeneeded = function (event) {

    console.log("Implanta os dados");

    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {keyPath: "id" });

    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

function read() {

    // Para gravar o tempo de execução
    console.time("leitura");

    // Seta o objeto que quer manipular
    var objectStore = db.transaction(["employee"]).objectStore("employee");

    // Pesquisa pelo objeto "ID"
    var request = objectStore.get("00-03");

    // Eventos que ocorrem em "request"
    request.onerror = function (event) {
        alert("Não foi possível recuperar os dados");
    };

    request.onsuccess = function (event) {
        
        // Faz algo com o resultado
        if (request.result) {

            // Para o log de execução
            console.timeEnd("leitura");

            // Imprime os dados encontrados
            alert("Nome: " + request.result.name + ", Idade: " + request.result.age + ", E-mail: " + request.result.email);
        }

        else {
            alert("Não encontramos o que você procura no banco");
        }
    };
}

function readAll() {

    // Seta o objeto que deseja manipular
    var objectStore = db.transaction("employee").objectStore("employee");

    // Vai iterando os itens armazenados
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Nome do id " + cursor.key + " é " + cursor.value.name + ", Idade: " + cursor.value.age + ", E-mail: " + cursor.value.email);
            cursor.continue();
        }
        else {
            alert("Sem mais entradas!");
        }
    };
}

function add() {

    var itemAdd = { id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" };

    // Abre uma transação para adicionar
    var request = db.transaction(["employee"], "readwrite")
                    .objectStore("employee")
                    .add(itemAdd);

    // Eventos que ocorrem no "request"
    request.onsuccess = function (event) {
        alert("Item adicionado!");
    };

    request.onerror = function (event) {
        alert("Não é possível adicionar o item, já existe!");
    }
}

function remove() {

    // Abre uma transação de remoção
    var request = db.transaction(["employee"], "readwrite")
                    .objectStore("employee")
                    .delete("00-03");

    // Eventos que ocorrem em "request"
    request.onsuccess = function (event) {
        alert("Item removido do banco de dados!");
    };
}