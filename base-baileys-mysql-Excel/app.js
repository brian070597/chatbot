const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const RESPONSES_SHEET_ID = '1sing38vqC_l3rUJOqvcuCMr-MXDbMaKvp2Ni_JR44Tk'; //Aquí pondras el ID de tu hoja de Sheets
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
const CREDENTIALS = JSON.parse(fs.readFileSync('./google-key.json'));

const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    addAnswer,
} = require('@bot-whatsapp/bot')


const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');





let STATUS = {}


//////////////////////////// FLUJO PARA CONSULTAR DATOS /////////////////////////////////////////////////////////

const flowConsultar = addKeyword('')    
    .addAnswer(['...'], { delay: 3000 }, async (ctx, { flowDynamic }) => {
        consulta = ctx.body
        const consultar = await consultarDatos(consulta)
        
        const Respuesta = consultados['Respuesta']                        // AQUI DECLARAMOS LAS VARIABLES CON LOS DATOS QUE NOS TRAEMOS DE LA FUNCION         VVVVVVVVV
        console.log('Respuesta ' + `${Respuesta}`)
        await flowDynamic(`${Respuesta}`)

        //await flowDynamic( [{buttons:
        //    [{body:'Respuesta' }
        //    ]}]
        //)
        console.log('Ya respondió')
    })


/////////////////////       ESTA FUNCION CONSULTA LOS DATOS DE UNA FILA !SEGÚN EL TELÉFONO!    /////////////////////////


async function consultarDatos(consulta) {
    console.log('Entra a consultarDatos')
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Consultas'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA

    consultados = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Consulta.toLowerCase() === consulta.toLowerCase() ||
         row.Consulta.toLowerCase().indexOf(consulta.toLowerCase()) > 0) {

            consultados['Respuesta'] = row.Respuesta                      // AQUÍ LE PEDIMOS A LA FUNCION QUE CONSULTE LOS DATOS QUE QUEREMOS CONSULTAR EJEMPLO:
            
        }

    }

    return consultados




};

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([ flowConsultar])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
