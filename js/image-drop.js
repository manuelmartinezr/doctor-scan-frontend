function bytesMB(b){ return (b/1024/1024).toFixed(2); }
function el(t, attrs){ return Object.assign(document.createElement(t), attrs || {}); }

// DOM
var drop = document.getElementById('drop');
var fileInput = document.getElementById('file');
var preview = document.getElementById('preview');
var analyzeBtn = document.getElementById('analyzeBtn');

// Reglas
var VALID = ['image/jpeg','image/png'];
var MAX_MB = 5;

function setEnabled(ok){
    analyzeBtn.disabled = !ok;
    if (ok) analyzeBtn.classList.add('enabled'); else analyzeBtn.classList.remove('enabled');
}

function describe(file){
    preview.innerHTML = '';
    var p = el('p');
    p.textContent = 'Archivo: ' + file.name + ' — ' + bytesMB(file.size) + ' MB';
    preview.appendChild(p);

    if (file.type.indexOf('image/') === 0){
    var img = el('img');
    img.alt = 'Vista previa';
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
    }
}

function validate(file){
    if (!file) return { ok:false, msg:'Ningún archivo seleccionado.' };
    if (VALID.indexOf(file.type) === -1) return { ok:false, msg:'Formato inválido. Usa JPG o PNG.' };
    if (file.size > MAX_MB*1024*1024) return { ok:false, msg:'El archivo supera ' + MAX_MB + 'MB.' };
    return { ok:true };
}

function handleFiles(files){
    var file = files && files[0];
    var res = validate(file);
    if (!res.ok){
    preview.innerHTML = '<p class="status-err">' + res.msg + '</p>';
    setEnabled(false);
    return;
    }
    describe(file);
    preview.insertAdjacentHTML('beforeend', '<p class="status-ok">Listo para analizar.</p>');
    setEnabled(true);
    analyzeBtn.dataset.blobUrl = URL.createObjectURL(file);
}

// Eventos
drop.addEventListener('click', function(){ fileInput.click(); });
fileInput.addEventListener('change', function(e){ handleFiles(e.target.files); });

['dragenter','dragover'].forEach(function(ev){
    drop.addEventListener(ev, function(e){
    e.preventDefault(); e.stopPropagation();
    drop.style.background = 'rgba(59,130,246,.05)';
    });
});
['dragleave','drop'].forEach(function(ev){
    drop.addEventListener(ev, function(e){
    e.preventDefault(); e.stopPropagation();
    drop.style.background = 'transparent';
    });
});
drop.addEventListener('drop', function(e){ handleFiles(e.dataTransfer.files); });

analyzeBtn.addEventListener('click', function(){
    if (analyzeBtn.disabled) return;
    var btnText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<span style="font-weight:800">Analizando…</span>';
    analyzeBtn.style.filter = 'brightness(.95)';
    setTimeout(function(){
    analyzeBtn.innerHTML = btnText;
    analyzeBtn.style.filter = '';
    alert('✅ Análisis de demostración completado.');
    }, 900);
});