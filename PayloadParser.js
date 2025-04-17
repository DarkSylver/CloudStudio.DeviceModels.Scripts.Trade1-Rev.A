function parseUplink(device, payload) {
    // Convert the payload to bytes
    var payloadb = payload.asBytes();
    env.log("Payloadb:", payloadb);
    
    // Decode the payload using the Decoder function
    var decoded = Decoder(payloadb);
    env.log(decoded);

    // Alarma
    if (decoded.some(variable => variable.variable === 'alarma')) {
        var sensor1 = device.endpoints.byAddress("1");
        var alarmaValue = decoded.find(variable => variable.variable === 'alarma').value;
        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(alarmaValue);
    }

    // SNH
    if (decoded.some(variable => variable.variable === 'snh')) {
        var sensor2 = device.endpoints.byAddress("2");
        var snhValue = decoded.find(variable => variable.variable === 'snh').value;
        if (sensor2 != null)
            sensor2.updateGenericSensorStatus(snhValue);
    }

    // SNL
    if (decoded.some(variable => variable.variable === 'snl')) {
        var sensor3 = device.endpoints.byAddress("3");
        var snlValue = decoded.find(variable => variable.variable === 'snl').value;
        if (sensor3 != null)
            sensor3.updateGenericSensorStatus(snlValue);
    }

    // No Cyble
    if (decoded.some(variable => variable.variable === 'no_cyble')) {
        var sensor4 = device.endpoints.byAddress("4");
        var noCybleValue = decoded.find(variable => variable.variable === 'no_cyble').value;
        if (sensor4 != null)
            sensor4.updateGenericSensorStatus(noCybleValue);
    }

    // NM
    if (decoded.some(variable => variable.variable === 'nm')) {
        var sensor5 = device.endpoints.byAddress("5");
        var nmValue = decoded.find(variable => variable.variable === 'nm').value;
        if (sensor5 != null)
            sensor5.updateGenericSensorStatus(nmValue);
    }

    // Volumen
    if (decoded.some(variable => variable.variable === 'volumen')) {
        var sensor6 = device.endpoints.byAddress("6");
        var volumenValue = decoded.find(variable => variable.variable === 'volumen').value;
        if (sensor6 != null)
            sensor6.updateGenericSensorStatus(volumenValue);
    }

    // Bateria
    if (decoded.some(variable => variable.variable === 'bateria')) {
        var sensor7 = device.endpoints.byAddress("7");
        var bateriaValue = decoded.find(variable => variable.variable === 'bateria').value;
        if (sensor7 != null)
            sensor7.updateGenericSensorStatus(bateriaValue);
    }

    // Delta
    if (decoded.some(variable => variable.variable === 'delta')) {
        var sensor8 = device.endpoints.byAddress("8");
        var deltaValue = decoded.find(variable => variable.variable === 'delta').value;
        if (sensor8 != null)
            sensor8.updateGenericSensorStatus(deltaValue);
    }

    // Domicilio
    if (decoded.some(variable => variable.variable === 'domicilio')) {
        var sensor9 = device.endpoints.byAddress("9");
        var domicilioValue = decoded.find(variable => variable.variable === 'domicilio').value;
        if (sensor9 != null)
            sensor9.updateGenericSensorStatus(domicilioValue);
    }
}

function Decoder(bytes) {
    function byteToHexDecimal(byte) {
        return parseInt(byte.toString(16), 10);
    }

    function readInt32BE(arr, offset) {
        return (arr[offset] << 24 | arr[offset + 1] << 16 | arr[offset + 2] << 8 | arr[offset + 3]) >>> 0;
    }

    const snh = (bytes[0] << 8) | bytes[1];
    const snl = (bytes[2] << 8) | bytes[3];
    const no_cyble = snh + '-' + snl;
    const nm = bytes[4];
    const alarmas = bytes[5];
    const volumen = readInt32BE(bytes, 6) / 1000;
    const bateria = bytes[10];
    const delta = (bytes[11] << 8) | bytes[12];
    const domicilio = "Paseo de los Pinos no 50 ";
    const estado = alarmas.toString(16) === '0' ? 'ok' : 
                   alarmas.toString(16) === '1' ? 'Tamper' : 
                   alarmas.toString(16) === '2' ? 'No flow' : 
                   alarmas.toString(16) === '4' ? 'direct_leak' : 
                   alarmas.toString(16) === '8' ? 'reverse_leak' : 
                   alarmas.toString(16) === '16' ? 'reverse_flow' : 
                   alarmas.toString(16) === '3' ? 'removed_from_meter' : 
                   alarmas.toString(16) === '24' ? 'continuous_reverse_leak' : 'undefined';

    const data = [
        { variable: 'alarma', value: estado },
        { variable: 'snh', value: snh },
        { variable: 'snl', value: snl },
        { variable: 'no_cyble', value: no_cyble },
        { variable: 'nm', value: nm },
        { variable: 'volumen', value: volumen },
        { variable: 'bateria', value: bateria },
        { variable: 'delta', value: delta },
        { variable: 'domicilio', value: domicilio }
    ];

    return data;
}
