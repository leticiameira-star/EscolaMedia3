let alunos = [];
let alunoSendoEditado = null; // Guarda o índice do aluno se estivermos editando

let ctx = document.getElementById("grafico");
let grafico = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: "Média dos Alunos",
            data: [],
            backgroundColor: [], // Importante para as cores dinâmicas
            borderWidth: 1
        }]
    },
    options: {
        scales: { y: { beginAtZero: true, max: 10 } }
    }
});

document.getElementById("formAluno").addEventListener("submit", function(event){
    event.preventDefault();
    
    let nome = document.getElementById("nome").value;
    let nota1 = Number(document.getElementById("nota1").value);
    let nota2 = Number(document.getElementById("nota2").value);
    let nota3 = Number(document.getElementById("nota3").value);
    let media = (nota1 + nota2 + nota3) / 3;

    let situacao = media >= 7 ? "Aprovado" : (media >= 5 ? "Recuperação" : "Reprovado");

    const alunoData = { nome, nota1, nota2, nota3, media, situacao };

    if (alunoSendoEditado !== null) {
        // Se estiver editando, substitui o aluno no vetor
        alunos[alunoSendoEditado] = alunoData;
        alunoSendoEditado = null;
        document.querySelector("button[type='submit']").innerText = "Cadastrar";
    } else {
        // Se não, adiciona um novo
        alunos.push(alunoData);
    }

    atualizarTabela();
    atualizarGrafico();
    this.reset();
});

function atualizarTabela(){
    let tabela = document.getElementById("tabelaAlunos");
    tabela.innerHTML = "";
    
    alunos.forEach(function(aluno, index){
        tabela.innerHTML += `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.nota1}</td>
                <td>${aluno.nota2}</td>        
                <td>${aluno.nota3}</td>
                <td>${aluno.media.toFixed(1)}</td>
                <td>${aluno.situacao}</td>
                <td>
                    <button onclick="editarAluno(${index})">Editar</button>
                    <button onclick="removerAluno(${index})">Remover</button>
                </td>
            </tr>
        `;
    });
}

function removerAluno(index) {
    alunos.splice(index, 1); // Remove 1 item na posição index
    atualizarTabela();
    atualizarGrafico();
}

function editarAluno(index) {
    let aluno = alunos[index];
    
    // Preenche o formulário com os dados atuais
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("nota1").value = aluno.nota1;
    document.getElementById("nota2").value = aluno.nota2;
    document.getElementById("nota3").value = aluno.nota3;

    alunoSendoEditado = index;
    document.querySelector("button[type='submit']").innerText = "Salvar Alteração";
}

function atualizarGrafico(){ 
    grafico.data.labels = alunos.map(aluno => aluno.nome);
    grafico.data.datasets[0].data = alunos.map(aluno => aluno.media);
    
    grafico.data.datasets[0].backgroundColor = alunos.map(aluno => {
        if (aluno.situacao === "Aprovado") return "rgba(75, 192, 192, 0.6)"; // Verde
        if (aluno.situacao === "Recuperação") return "rgba(255, 206, 86, 0.6)"; // Amarelo
        return "rgba(255, 99, 132, 0.6)"; // Vermelho
    });

    grafico.update();
}