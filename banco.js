const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let contas = [];

function mostrarMenu() {
    console.log("\n======= Sistema Bancario =======");
    console.log("1 - Criar conta");
    console.log("2 - Listar contas");
    console.log("3 - Buscar conta");
    console.log("4 - Depositar");
    console.log("5 - Sacar");
    console.log("6 - Transferir");
    console.log("7 - Mostrar saldo");
    console.log("8 - Extrato");
    console.log("0 - Sair");


    rl.question("Escolha uma opção: ", function(opcao) {
        switch (Number(opcao)) {
            case 1:
                criarContas();
                break;
            case 2:
                listarContas();
                break;
            case 3:
                buscarContas();
                break;
            case 4:
                depositar();
                break;
            case 5:
                sacar();
                break;
            case 6:
                transferir();
                break;
            case 7:
                mostrarSaldo();
                break;
            case 8:
                extrato();
                break;
            case 0:
                console.log("Até Logo!");
                rl.close();
                break;

            default:
                console.log("Opção inválida!");
                mostrarMenu();
                break;
        }
    });
}
function criarContas() {
    rl.question("Digite o nome do titular da conta: ", function(nome) {
        rl.question("Digite o número da conta: ", function(numero) {
            rl.question("Digite o saldo inicial: ", function(saldo) {
                const conta = {
                    nome: nome,
                    numero: Number(numero),
                    saldo: Number(saldo),
                    extrato: []
                };
                contas.push(conta);
                salvarContas();
                console.log("\nConta criada com sucesso!");
                mostrarMenu();
            });
        });
    });
}
function listarContas() {
    if (contas.length === 0) {
        console.log("\nNenhuma conta cadastrada!");
        mostrarMenu();
        return;
    }
        for (let i = 0; i < contas.length; i++) {
            console.log("\n========== Conta ==========");
            console.log("Nome do titular: " + contas[i].nome);
            console.log("Numero da conta: " + contas[i].numero);
            console.log("Saldo: R$" + contas[i].saldo.toLocaleString("pt-BR",
                 { minimumFractionDigits: 2
            }));
            console.log("-----------------------------------------");
        }   
        mostrarMenu();  
}
function buscarContas() {
    rl.question("Digite o número da conta que deseja buscar: ", function(numero) {

        let contaEncontrada = contas.find(conta => conta.numero === Number(numero));
        if (contaEncontrada) {

            console.log("\n======== Conta Encontrada ========");
            console.log("Nome do titular: ", contaEncontrada.nome);
            console.log("Numero da conta: ", contaEncontrada.numero);
            console.log("Saldo: R$", contaEncontrada.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
        } else {
            console.log("\nConta não encontrada!");
        }
        mostrarMenu();
    });
}
function depositar() {
    rl.question("Digite o número da conta: ", function(numero) {
        let conta = contas.find(conta => conta.numero === Number(numero));
        if (conta) {
            rl.question("Digite o valor do depósito: ", function(valor) {
                conta.saldo += Number(valor);
                conta.extrato.push(`Depósito: +R$ ${Number(valor).toFixed(2)}`);
                salvarContas();
                console.log("\nDepósito realizado com sucesso!");
                mostrarMenu();
            });
        } else {
            console.log("\nConta não encontrada!");
            mostrarMenu();
        }
    });
}
function sacar() {
    rl.question("Digite o número da conta: ", function(numero) {
        let conta = contas.find(conta => conta.numero === Number(numero));

        if (conta) {
            rl.question("Digite o valor do saque: ", function(valor) {

                if (conta.saldo >= Number(valor)) {
                    conta.saldo -= Number(valor);

                    conta.extrato.push(
                        `Saque: -R$ ${Number(valor).toFixed(2)}`
                    );
                    salvarContas();
                    console.log("\nSaque realizado com sucesso!");
                } else {
                    console.log("\nSaldo insuficiente!");
                }

                mostrarMenu();
            });
        } else {
            console.log("\nConta não encontrada!");
            mostrarMenu();
        }
    });
}
    function transferir() {
        rl.question("Digite o número da conta de origem: ", function(numeroOrigem) {
            let contaOrigem = contas.find(conta => conta.numero === Number(numeroOrigem));

            rl.question("Digite o número da conta de destino: ", function(numeroDestino) {
                let contaDestino = contas.find(conta => conta.numero === Number(numeroDestino));

                if (contaOrigem && contaDestino) {
                    rl.question("Digite o valor da transferência: ", function(valor) {
                        if (contaOrigem.numero === contaDestino.numero) {
                            console.log("\nA conta de origem e destino devem ser diferentes!");
                            mostrarMenu();
                            return;
                        }

                        if (contaOrigem.saldo >= Number(valor)) {
                            contaOrigem.saldo -= Number(valor);
                            contaOrigem.extrato.push(`Transferência enviada: -R$ ${Number(valor).toFixed(2)} para conta ${contaDestino.numero}`);

                            contaDestino.extrato.push(`Transferência recebida: +R$ ${Number(valor).toFixed(2)} da conta ${contaOrigem.numero}`);
                            contaDestino.saldo += Number(valor);

                            console.log("\nTransferência realizada com sucesso!");
                        } else {
                            console.log("\nSaldo insuficiente!");
                        }
                        salvarContas();
                        mostrarMenu();
                    });
                } else {
                    console.log("\nConta de origem ou destino não encontrada!");
                    mostrarMenu();
                }
        });
    });
}
function mostrarSaldo() {
    rl.question("Digite o número da conta: ", function(numero) {
        let conta = contas.find(conta => conta.numero === Number(numero));

        if (conta) {
            console.log("\n======== Saldo da Conta ========");
            console.log("Titular: ", conta.nome);
            console.log("\nSaldo da conta: R$", conta.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
        } else {
            console.log("\nConta não encontrada!");
        }
        mostrarMenu();
    });
}
function extrato() {
    rl.question("Digite o número da conta: ", function(numero) {
        let conta = contas.find(conta => conta.numero === Number(numero));
        
        if (conta) {
            console.log("\n======== Extrato da conta ========");
            conta.extrato.forEach(function(movimento) {
                console.log(movimento);
            });
        } else {
            console.log("\nConta não encontrada!");
        }
        mostrarMenu();
    });
}
function salvarContas() {
    fs.writeFileSync('conta.json', JSON.stringify   (contas, null, 2));
    console.log("\nContas salvas com sucesso!");
}
function carregarContas() {
    try{
        let dados = fs.readFileSync('conta.json', 'utf8');
        contas = JSON.parse(dados);
        console.log("\nContas carregadas com sucesso!");
    } catch (err) {
        console.log("\nErro ao carregar contas!");
    }
}
carregarContas();
mostrarMenu();