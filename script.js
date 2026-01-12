document.addEventListener("DOMContentLoaded", function() {

    // --- ARMAZENAMENTO DAS LISTAS DINÂMICAS ---
    let problemasList = [];
    let medicamentosList = [];

    // --- NAVEGAÇÃO ENTRE PASSOS (PRÓXIMO) ---
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.step');
            const nextStepId = button.getAttribute('data-next');
            
            currentStep.classList.add('hidden');
            document.getElementById(nextStepId).classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- NAVEGAÇÃO ENTRE PASSOS (VOLTAR) ---
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.step');
            const prevStepId = button.getAttribute('data-prev');
            
            currentStep.classList.add('hidden');
            document.getElementById(prevStepId).classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- LÓGICA CONDICIONAL (CAMPOS QUE APARECEM) ---

    // 1. Ausculta Pulmonar (RA)
    document.getElementById('ap_ra_presente').addEventListener('change', function() {
        const detalhesRA = document.getElementById('ap-ra-detalhes');
        if (this.value === 'Sim') detalhesRA.classList.remove('hidden');
        else detalhesRA.classList.add('hidden');
    });

    // 2. Ausculta Cardíaca (Sopros)
    document.getElementById('ac_sopros_presente').addEventListener('change', function() {
        const detalhesSopros = document.getElementById('ac-sopros-detalhes');
        if (this.value === 'Sim') detalhesSopros.classList.remove('hidden');
        else detalhesSopros.classList.add('hidden');
    });

    // 3. Abdome (Dor)
    document.getElementById('abd_estado').addEventListener('change', function() {
        const detalhesAbdome = document.getElementById('abdome-dor-detalhes');
        if (this.value === 'Doloroso à palpação') detalhesAbdome.classList.remove('hidden');
        else detalhesAbdome.classList.add('hidden');
    });

    // 4. Extremidades (Edema)
    document.getElementById('ext_edemas_presente').addEventListener('change', function() {
        const detalhesEdema = document.getElementById('ext-edemas-detalhes');
        if (this.value === 'Sim') detalhesEdema.classList.remove('hidden');
        else detalhesEdema.classList.add('hidden');
    });

    // --- FUNÇÕES AUXILIARES PARA LISTAS (RENDERIZAR) ---
    function renderList(listData, ulId, type) {
        const ul = document.getElementById(ulId);
        ul.innerHTML = ""; 

        listData.forEach((item, index) => {
            const li = document.createElement('li');
            
            const spanText = document.createElement('span');
            spanText.textContent = item;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = "X";
            removeBtn.className = "remove-btn";
            removeBtn.setAttribute('title', 'Remover item');
            
            removeBtn.addEventListener('click', function() {
                removeItem(index, type);
            });

            li.appendChild(spanText);
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
    }

    function removeItem(index, type) {
        if (type === 'problema') {
            problemasList.splice(index, 1);
            renderList(problemasList, 'lista-problemas-ul', 'problema');
        } else if (type === 'medicamento') {
            medicamentosList.splice(index, 1);
            renderList(medicamentosList, 'lista-medicamentos-ul', 'medicamento');
        }
    }

    // --- LÓGICA DAS LISTAS DINÂMICAS ---

    // 1. Adicionar Problema
    document.getElementById('add-problema').addEventListener('click', function() {
        const problemaInput = document.getElementById('problema_desc');
        const problemaTexto = problemaInput.value.trim();
        
        if (problemaTexto) {
            problemasList.push(problemaTexto);
            renderList(problemasList, 'lista-problemas-ul', 'problema');
            problemaInput.value = "";
            problemaInput.focus();
        }
    });

    // 2. Adicionar Medicamento
    document.getElementById('add-medicamento').addEventListener('click', function() {
        const nome = document.getElementById('med_nome').value;
        const doseVia = document.getElementById('med_dose_via').value;
        const dataInicio = document.getElementById('med_data_inicio').value || "Iniciado hoje"; 
        const diasUso = document.getElementById('med_dias_uso').value;
        
        if (nome && doseVia && diasUso) {
            const medTexto = `Em uso de ${nome} (${doseVia}). ${dataInicio}. Dia ${diasUso} de uso.`;
            medicamentosList.push(medTexto);
            renderList(medicamentosList, 'lista-medicamentos-ul', 'medicamento');
            
            document.getElementById('med_nome').value = "";
            document.getElementById('med_dose_via').value = "";
            document.getElementById('med_data_inicio').value = "";
            document.getElementById('med_dias_uso').value = "";
            document.getElementById('med_nome').focus();
        } else {
            alert("Por favor, preencha Nome, Dose/Via e Dias de Uso.");
        }
    });

    // --- BOTÃO PRINCIPAL: GERAR EVOLUÇÃO ---
    document.getElementById('generate-button').addEventListener('click', function() {
        
        // Esconde o passo 7 e mostra o passo 8
        document.getElementById('step-7').classList.add('hidden');
        document.getElementById('step-8').classList.remove('hidden');
        
        // --- COLETA DOS DADOS ---
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
        
        // 2. Lista de Problemas
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
        
        // AP
        const apMv = getVal('ap_mv');
        let apRa = "";
        if (getVal('ap_ra_presente') === 'Sim') {
            const raTipo = getVal('ra_tipo');
            const raLocal = getVal('ra_local');
            apRa = `com RA (tipo: ${raTipo}, em ${raLocal})`;
        } else {
            apRa = "sem Ruídos Adventícios";
        }
        
        // AC
        const acRitmo = getVal('ac_ritmo');
        const acBulhas = getVal('ac_bulhas');
        let acSopros = "";
        if (getVal('ac_sopros_presente') === 'Sim') {
            acSopros = `com sopros (${getVal('ac_sopros_desc')})`;
        } else {
            acSopros = "sem sopros";
        }

        // Abdome
        let abdEstado = getVal('abd_estado');
        if (abdEstado === 'Doloroso à palpação') {
            const dorLocal = getVal('dor_local');
            const dorExtra = getVal('dor_extra');
            abdEstado = `Doloroso à palpação (Local: ${dorLocal}, Achados: ${dorExtra})`;
        }
        const abdRha = getVal('abd_rha');

        // Extremidades
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
        
        const linhaBH = balancoHidrico ? `Balanço hídrico nas últimas 24h: ${balancoHidrico}.\n` : "";

        // Medicamentos
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

        // --- MONTAGEM DO TEXTO FINAL ---
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

        // INSERE O TEXTO NA CAIXA
        document.getElementById('resultado-texto').value = evolucaoFinal.trim().toUpperCase();
        
        // SCROLL PARA O TOPO PARA VER O RESULTADO
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- BOTÕES FINAIS ---
    document.getElementById('copy-button').addEventListener('click', function() {
        const resultadoTexto = document.getElementById('resultado-texto');
        resultadoTexto.select(); 
        document.execCommand('copy'); 
        alert('Texto copiado para a área de transferência!');
    });

    document.getElementById('restart-button').addEventListener('click', function() {
        if(confirm("Tem certeza? Todos os dados serão perdidos.")) {
            location.reload();
        }
    });
});