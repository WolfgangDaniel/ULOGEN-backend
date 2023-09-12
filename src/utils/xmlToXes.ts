import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';


export async function scyllaAPIRequest(botIdWithUniqueId: string) {

    const url = 'http://127.0.0.1:8080/scyllaapi';
    const headers = {
        'requestId': `request_${botIdWithUniqueId}`,
        'Content-Type': 'multipart/form-data', // Set the content type for multipart/form-data
    };

    const formData = new FormData();
    formData.append('bpmn', fs.createReadStream(`./src/data/botModel_${botIdWithUniqueId}.bpmn`));

    // Read the contents of the files and append as strings
    const simConfigContents = fs.createReadStream('./src/config/p1_normal_sim.xml');
    formData.append('simConfig', simConfigContents);

    const globalConfigContents = fs.createReadStream('./src/config/p0_globalconf.xml');
    formData.append('globalConfig', globalConfigContents);

    try {
        const response = await axios.post(url, formData, { headers });

        console.log(response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

