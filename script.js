// Espera o DOM (a página) carregar antes de executar o código
document.addEventListener("DOMContentLoaded", function() {

    // --- ARMAZENAMENTO DAS LISTAS DINÂMICAS ---
    // Precisamos guardar os problemas e medicamentos em arrays
    let problemasList = [];
    let medicamentosList = [];

    // --- NAVEGAÇÃO ENTRE PASSOS (WIZARD) ---
    // Pega todos os botões "Próximo"
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Esconde o passo atual
            const currentStep = button.closest('.step'); // Pega o 'div' pai da classe 'step'
            currentStep.classList.add('hidden');
            
            // Mostra o próximo passo
            const nextStepId = button.getAttribute('data-next'); // Pega o ID do próximo passo (ex: 'step-2')
            document.getElementById(nextStepId).classList.remove('hidden');
        });
    });

    // --- LÓGICA CONDICIONAL (CAMPOS QUE APARECEM) ---

    // 1. Ausculta Pulmonar (RA)
    document.getElementById('ap_ra_presente').addEventListener('change', function() {
        const detalhesRA = document.getElementById('ap-ra-detalhes');
        if (this.value === 'Sim') {
            detalhesRA.classList.remove('hidden');
        } else {
            detalhesRA.classList.add('hidden');
        }
    });

    // 2. Ausculta Cardíaca (Sopros)
    document.getElementById('ac_sopros_presente').addEventListener('change', function() {
        const detalhesSopros = document.getElementById('ac-sopros-detalhes');
        if (this.value === 'Sim') {
            detalhesSopros.classList.remove('hidden');
        } else {
            detalhesSopros.classList.add('hidden');
        }
    });

    // 3. Abdome (Dor)
    document.getElementById('abd_estado').addEventListener('change', function() {
        const detalhesAbdome = document.getElementById('abdome-dor-detalhes');
        if (this.value === 'Doloroso à palpação') {
            detalhesAbdome.classList.remove('hidden');
        } else {
            detalhesAbdome.classList.add('hidden');
        }
    });

    // 4. Extremidades (Edema)
    document.getElementById('ext_edemas_presente').addEventListener('change', function() {
        const detalhesEdema = document.getElementById('ext-edemas-detalhes');
        if (this.value === 'Sim') {
            detalhesEdema.classList.remove('hidden');
        } else {
            detalhesEdema.classList.add('hidden');
        }
    });

    // --- LÓGICA DAS LISTAS DINÂMICAS ---

    // 1. Adicionar Problema
    document.getElementById('add-problema').addEventListener('click', function() {
        const problemaInput = document.getElementById('problema_desc');
        const problemaTexto = problemaInput.value;
        
        if (problemaTexto) {
            // Adiciona ao array de dados
            problemasList.push(problemaTexto);
            
            // Adiciona na lista da tela (UI)
            const ul = document.getElementById('lista-problemas-ul');
            const li = document.createElement('li');
            li.textContent = problemaTexto;
            ul.appendChild(li);
            
            // Limpa o campo
            problemaInput.value = "";
        }
    });

    // 2. Adicionar Medicamento
    document.getElementById('add-medicamento').addEventListener('click', function() {
        const nome = document.getElementById('med_nome').value;
        const doseVia = document.getElementById('med_dose_via').value;
        const dataInicio = document.getElementById('med_data_inicio').value || "Iniciado hoje"; // Default
        const diasUso = document.getElementById('med_dias_uso').value;
        
        if (nome && doseVia && diasUso) {
            const medTexto = `Em uso de ${nome} (${doseVia}). ${dataInicio}. Dia ${diasUso} de uso.`;
            
            // Adiciona ao array de dados
            medicamentosList.push(medTexto);
            
            // Adiciona na lista da tela (UI)
            const ul = document.getElementById('lista-medicamentos-ul');
            const li = document.createElement('li');
            li.textContent = medTexto;
            ul.appendChild(li);
            
            // Limpa os campos
            document.getElementById('med_nome').value = "";
            document.getElementById('med_dose_via').value = "";
            document.getElementById('med_data_inicio').value = "";
            document.getElementById('med_dias_uso').value = "";
        } else {
            alert("Por favor, preencha Nome, Dose/Via e Dias de Uso.");
        }
    });

    // --- BOTÃO PRINCIPAL: GERAR EVOLUÇÃO ---
    document.getElementById('generate-button').addEventListener('click', function() {
        
        // Esconde o passo 7 e mostra o passo 8
        document.getElementById('step-7').classList.add('hidden');
        document.getElementById('step-8').classList.remove('hidden');
        
        // Coleta todos os dados dos campos (igual fizemos no Python)
        // Usamos .value para pegar o texto de um campo.
        // Usamos '|| valor_padrao' para tratar campos vazios.
        
        // Função auxiliar para pegar valor
        const getVal = (id) => document.getElementById(id).value;
        const getValPadrao = (id, padrao) => document.getElementById(id).value || padrao;

        // 1. Informações Gerais
        const dataHora = new Date().toLocaleString('pt-BR');
        const nome = getVal('nome');
        const idade = getVal('idade');
        const sexo = getVal('sexo');
        const leito = getVal('leito');
        const motivoInternacao = getVal('motivo_internacao');
        let alergias = getValPadrao('alergias', 'Nega alergias conhecidas.');
        if (alergias !== 'Nega alergias conhecidas.') {
            alergias = `ALERTA: ${alergias}`;
        }
        
        // 2. Lista de Problemas (processa o array)
        let textoProblemas = "";
        if (problemasList.length > 0) {
            problemasList.forEach((problema, index) => {
                textoProblemas += `P${index + 1}. [${problema}]\n`;
            });
        } else {
            textoProblemas = "Nenhum problema ativo listado.\n";
        }

        // 3. Evolução
        const diasInternado = getVal('dias_internado');
        const queixasHoje = getValPadrao('queixas_hoje', 'ausência de queixas');
        const relatoDe = getVal('relato_de');
        const evolucaoSintomas = getVal('evolucao_sintomas');
        const sintomasDescritos = getVal('sintomas_descritos');

        // 4. Exame Físico
        const encontrado = getVal('encontrado');
        const estadoGeral = getVal('estado_geral');
        const consciencia = getVal('consciencia');
        const orientacao = getVal('orientacao');
        
        const pa = getValPadrao('pa', '[N/A]');
        const fc = getValPadrao('fc', '[N/A]');
        const fr = getValPadrao('fr', '[N/A]');
        const temp = getValPadrao('temp', '[N/A]');
        const spo2 = getValPadrao('spo2', '[N/A]');
        const diurese = getValPadrao('diurese', '[N/A]');
        
        // Lógica AP (Ausculta Pulmonar)
        const apMv = getVal('ap_mv');
        let apRa = "";
        if (getVal('ap_ra_presente') === 'Sim') {
            const raTipo = getVal('ra_tipo');
            const raLocal = getVal('ra_local');
            apRa = `com RA (tipo: ${raTipo}, em ${raLocal})`;
        } else {
            apRa = "sem Ruídos Adventícios";
        }
        
        // Lógica AC (Ausculta Cardíaca)
        const acRitmo = getVal('ac_ritmo');
        const acBulhas = getVal('ac_bulhas');
        let acSopros = "";
        if (getVal('ac_sopros_presente') === 'Sim') {
            acSopros = `com sopros (${getVal('ac_sopros_desc')})`;
        } else {
            acSopros = "sem sopros";
        }

        // Lógica Abdome
        let abdEstado = getVal('abd_estado');
        if (abdEstado === 'Doloroso à palpação') {
            const dorLocal = getVal('dor_local');
            const dorExtra = getVal('dor_extra');
            abdEstado = `Doloroso à palpação (Local: ${dorLocal}, Achados: ${dorExtra})`;
        }
        const abdRha = getVal('abd_rha');

        // Lógica Extremidades
        let extEdemas = "";
        if (getVal('ext_edemas_presente') === 'Sim') {
            extEdemas = `com edemas (${getVal('ext_edemas_desc')})`;
        } else {
            extEdemas = "sem edemas";
        }
        const extPulsos = getVal('ext_pulsos');
        
        const feridas = getValPadrao('feridas', 'Sem dispositivos invasivos e feridas outras.');

        // 5. Dados Complementares
        const balancoHidrico = getVal('balanco_hidrico');
        const labImagem = getValPadrao('lab_imagem', 'Sem exames recentes.');
        const relatoEnfermagem = getValPadrao('relato_enfermagem', 'Sem intercorrências.');
        const avalClinica = getVal('aval_clinica');
        
        // Lógica Balanço Hídrico (Omitir se vazio)
        const linhaBH = balancoHidrico ? `Balanço hídrico nas últimas 24h: ${balancoHidrico}.\n` : "";

        // Lógica Medicamentos (processa o array)
        let textoMedicamentos = "";
        if (medicamentosList.length > 0) {
            medicamentosList.forEach(med => {
                textoMedicamentos += `${med}\n`;
            });
            textoMedicamentos += "Sem sinais de reações adversas conhecidas.";
        } else {
            textoMedicamentos = "Nenhuma medicação específica rastreada.";
        }

        // 6. Conduta
        const planoManter = getValPadrao('plano_manter', 'Plano atual.');
        const planoAdicionar = getValPadrao('plano_adicionar', 'Nenhum.');
        const planoAjustar = getValPadrao('plano_ajustar', 'Nenhum.');
        const planoProgramar = getValPadrao('plano_programar', 'Nenhum.');

        // --- MONTAGEM DO TEXTO FINAL (O f-string do Python vira um "Template Literal" do JS) ---
        
        const evolucaoFinal = `
---Informações Gerais---
Data e Hora: ${dataHora}
Identificação: ${nome}, ${idade} anos, ${sexo}, Leito: ${leito}, P0: ${motivoInternacao}.
Alergias: ${alergias}.

---Lista de Problemas---
${textoProblemas}
---Evolução---
Paciente encontra-se internado há ${diasInternado} dias por ${motivoInternacao}.
Hoje apresenta ${queixasHoje}, conforme relato ${relatoDe}.
Refere ${evolucaoSintomas} de sintomas como ${sintomasDescritos}, sem intercorrências significativas desde a última avaliação.

---Ao exame---
Paciente encontrado ${encontrado}, em ${estadoGeral} estado geral, ${consciencia}, ${orientacao} em tempo e espaço.
SSVV: PA ${pa} mmHg | FC ${fc} bpm | FR ${fr} irpm | Temp ${temp} °C | SpO2 ${spo2} % | Diurese ${diurese} mL/24h
Ausculta pulmonar MV ${apMv}, ${apRa}.
Ausculta cardíaca em ritmo ${acRitmo}, bulhas ${acBulhas}, ${acSopros}.
Abdome ${abdEstado}, RHA ${abdRha}, sem visceromegalias.
Extremidades ${extEdemas}, pulsos ${extPulsos}, sem cianose.
Feridas/curativos: ${feridas}.

---Dados Complementares---
${linhaBH}Evolução laboratorial/imagem: ${labImagem}.
Enfermagem relata: ${relatoEnfermagem}.
Avaliação clínica atual: paciente com diagnóstico principal de ${motivoInternacao}, em evolução ${avalClinica}.
${textoMedicamentos}

---Conduta/Plano---
Manter: ${planoManter}.
Adicionar/Realizar: ${planoAdicionar}.
Ajustar: ${planoAjustar}.
Programar: ${planoProgramar}.
Reavaliar diariamente evolução clínica e laboratorial.
`;

        // Coloca o texto final na caixa de texto, em MAIÚSCULAS
        document.getElementById('resultado-texto').value = evolucaoFinal.trim().toUpperCase();
    });

    // --- BOTÕES FINAIS (Copiar e Recomeçar) ---

    // Botão Copiar
    document.getElementById('copy-button').addEventListener('click', function() {
        const resultadoTexto = document.getElementById('resultado-texto');
        resultadoTexto.select(); // Seleciona o texto
        document.execCommand('copy'); // Copia (método antigo, mas robusto)
        // ou navigator.clipboard.writeText(resultadoTexto.value); (método moderno)
        alert('Texto copiado para a área de transferência!');
    });

    // Botão Recomeçar
    document.getElementById('restart-button').addEventListener('click', function() {
        // Recarrega a página, limpando tudo
        location.reload();
    });
});
