// Declarar las variables iniciales
const origenSelec = document.querySelector("#origenSelec");
const origen = document.querySelector("#origen");
const miChart = document.querySelector("#miChart");
const result = document.querySelector("#result");

// Buscar indicador en API
const query = async (currency) => {
    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        const { serie: data } = await response.json();
        // Dividir en un objeto para realizar una llamada
        return { lastValue: data[0].valor, allValue: data };
    } catch (error) {
        console.log(error)
    }
}

// Calcular valor ingresado y mostrarlo
const convertCurrency = async () => {
    try {
        // Comprobar campos sin valores
        if (!origen.value) { alert("Ingrese el monto en CLP"); return; }
        if (!origenSelec.value) { alert("Seleccione moneda"); return; }
        // Calcular con valores ingresados
        const dataCurrency = await query(origenSelec.value)
        // Insertar valor obtenido en resultado
        result.innerHTML = `Resultado: $${(Number(origen.value) / Number(dataCurrency.lastValue)).toFixed(2)}`;
        // Rehacer grafico con valores ingresados
        getDataLabelChart(dataCurrency.allValue);
    } catch (error) {
        console.log(error)
    }
}

// Crear gráfico sin data
let lastTenDaysChart = new Chart(miChart, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Historial últimos 7 días', data: [], borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: false } } }
});

const getDataLabelChart = async (data) => {
    try {
        // Eliminar grafico anterior
        lastTenDaysChart.destroy();
        // Rescatar datos para mostrar en grafico
        const labelsChart = await data.map(label => new Intl.DateTimeFormat('es-CL').format(new Date(label.fecha)));
        const dataChart = await data.map(data => data.valor);
        // Transformar datos para mostrar en grafico
        const lastTenLabels = labelsChart.splice(0, 7).reverse();
        const lastTenData = dataChart.splice(0, 7).reverse();
        // Crear nuevo grafico con datos rescatados
        lastTenDaysChart = new Chart(miChart, {
            type: 'line',
            data: { labels: lastTenLabels, datasets: [{ label: 'Historial últimos 7 días', data: lastTenData, borderWidth: 1 }] },
            options: { scales: { y: { beginAtZero: false } } }
        });
    } catch (error) {
        console.log(error)
    }
}