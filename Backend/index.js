require('dotenv').config();
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const bodyParser = require('body-parser');
const { JWT } = require('google-auth-library');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.options('*', cors());

const serviceAccountAuth = new JWT({
    email: "ili-app@quiet-cider-434004-i9.iam.gserviceaccount.com",
    key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDfv3/lx5GI7d59\n391ppL0onwiuxHM1VrYVdgY0Bfj4UIxZZtSV5tOTat4D46WjAXatIGHKb7PmRk4W\nW4jSIIbP7td/s0pW4bENc+UDr3zH/z92/grlPxvpmwRrlwvg0wXL3t56UbzpMoll\nbspzRAWX2yVZgG/r74W6UqvFCm/eAMlLG9M9KY+BeSc+G5iSrDxVmKlowRLib3o6\nG7HR54dHTJQoDyN7CxrvkZQK8kMaYJJVGaw1zsLKQTRwuW3vUpE0VknYfO6h13Dm\nwjdh0yLM95noJUt+PlfwGY8RMsTm1HwxSB0xNkSskphHehdnFtXz7GBCtxJ7wpoO\npcaRrC2nAgMBAAECggEANnoFNVh4RjsIK2SYn5KlHaFO92JMXKW+ko4YZ402t5rA\n+TlwtAit5dwkrxS7rOr7zp4uQSAeUIg4lff2YZbazACuhmCMTogH2CsqDNIq0vUC\nKkIjO/q4HJIKKvntQfGPHTqnt2d0U+DilAg8EYFzzSvltZtwZKT+TcW4HbLzVr0s\no0aqLYDFeoafk5Hb80W0x73fMwVmBN0TZx7GyFXYZvjByAED7fh0sv7dB8Bvk1mB\nRhOQO8UDd02QZwbY9YhYlbPgIfu8GtfZqip3W7KHuAZjknCVHHIctOPgtNn7R9pF\nYXxAPTFmaPPyH7TKAv13mbJL/IMsxO++f68ypY1DkQKBgQD4752EI8Xker34xS5z\nHT14M/3uxcGy+Bg1E2mzZ2cNy09q03Pw8HzEaT9j1mejtBQOpYDa73xU+ucl6OAF\nuZjbr4NzLXsOXqIrI04tk9zNwlF6T4Fho3bjja9NDKKywOaUZ0Xk9AxD9mXN3PSW\nHoZFKXKpPJiZRlK3fRfYk5CwVwKBgQDmGOhTcb4KxRQ87r5jCkAy3XsTcJpdCAcx\nMJNFl3xxnB8pbjstbG2M1UdZtU7hBX2Krfy3U6qTqvbhPPITCUWNJv49OqXhaIzi\n93ThVPaKx2BVBjUr7gcjJ9KKM9D1CigwKm/NUS8s2Zfz6yL2LDtlhtRFLGWClZ5K\n0ClWwODbMQKBgEbsfgRX7Nnb3qQyCbniatEEfyS4UyeaZ8s3bLYgj8vuUQIunKnY\n2rNbCSR4wa5ycAR8QuodsV7E3XZ/ktQOvO5aYyk9nAHMFIgV1wBFUHOPGYevfz1C\nRW0vwPJC11f2fbtqcQ96OMRkPz0X5teeesLZvEFbcl65GngMu+6InIChAoGAEsiZ\nvqYcY3ivLEI5HJCrqPtXnsCkeU+8dpGGlDnHmOarzJAJGK4vSz3l8zbP16LBGt8V\nMEoONLvSJ5T4FgG9wcYbHxh4jiwgxC57RiHPdojMHmTBVnK59m67yzhrqHVJzpTI\nR7SG61xgATOCySHXP3SAQ51aNAzOvUC8/y4DrSECgYALTyOTxS/+LnAzbD5eCeCl\ndScl110aF9qxEgSOlO5SlYxjnDIoUpVxt09w00VHH0T5TQ0Su/7g0zW5VHF1uSVH\ntL0NOYRqDv+hr59tZjwxAJYyhribTOYeLF2nLhoUCnhgCz1WZ1JDQ5u2fXWHsX9l\nBZBl3SeMo14lBzUmkMd1Dg==\n-----END PRIVATE KEY-----\n",
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
});

const doc = new GoogleSpreadsheet('1otnCxVm1SUAkGvdThkxi3qxjnKOHnfRCYrxAWv5jD40', serviceAccountAuth);

app.post('/api/addToSheet', async (req, res) => {
  try {
    const rawData = req.body;
    const lectureInfo = rawData.lectureInfo;

    // Sum the audio times and text times
    const totalAudioTime = ['pageAudio1', 'pageAudio2', 'pageAudio3', 'pageAudio4', 'pageAudio5'].reduce((sum, key) => sum + (parseFloat(lectureInfo[key]) || 0), 0);
    const totalTextTime = ['pageText1', 'pageText2', 'pageText3', 'pageText4', 'pageText5'].reduce((sum, key) => sum + (parseFloat(lectureInfo[key]) || 0), 0);

    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];
    const data = [{
        'Student Name' : rawData['studentInfo']['name'],
        'Pre Test Score' : rawData['preTestInfo']['score'],
        'Pre Test Time': rawData['preTestInfo']['timeTaken'], 
        'Lecture Audio Time': totalAudioTime,
        'Lecture Text Time': totalTextTime,
        'Post Test Score': rawData['postTestInfo']['score'],
        'Post Test Time': rawData['postTestInfo']['timeTaken'],
        'Before Pre Test Heart Rate' : rawData['beforePreTestHeart'],
        'After Pre Test Heart Rate' : rawData['afterPreTestHeart'],
        'Before Lecture Heart Rate' : rawData['beforeLectureHeart'],
        'After Lecture Heart Rate' : rawData['afterLectureHeart'],
        'Before Post Test Heart Rate' : rawData['beforePostTestHeart'],
        'After Post Test Heart Rate' : rawData['afterPostTestHeart'],
        
        'Audio Time 1': lectureInfo?.pageAudio1 || '',
        'Audio Time 2': lectureInfo?.pageAudio2 || '',
        'Audio Time 3': lectureInfo?.pageAudio3 || '',
        'Audio Time 4': lectureInfo?.pageAudio4 || '',
        'Audio Time 5': lectureInfo?.pageAudio5 || '',
        'Text Time 1': lectureInfo?.pageText1 || '',
        'Text Time 2': lectureInfo?.pageText2 || '',
        'Text Time 3': lectureInfo?.pageText3 || '',
        'Text Time 4': lectureInfo?.pageText4 || '',
        'Text Time 5': lectureInfo?.pageText5 || '',
        'Complete Student Information': '',
        'Question wise Pre Test Data': rawData['preTestInfo']['questionData'],
        'Question wise Post Test Data': rawData['postTestInfo']['questionData'],
        'Lecture Audio Complete Data': rawData['audioRawData'],
        'Lecture Text Complete Data': ''
    }];
    const addRow = await sheet.addRows(data);
    res.status(200).json({ message: "Data Saved" });
  } catch (error) {
    console.error('Error adding data to Google Sheet', error);
    res.status(500).json({ message: 'Failed to add data to Google Sheet' });
  }
});

app.get('/api/fetchQuestions', async (req, res) => {
  try {
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();
    const jsonSheet = rows.map(row => row._rawData);
    res.status(200).json({ message: "Data Saved", data: jsonSheet });
  } catch (error) {
    console.error('Error Fetching Data', error);
    res.status(500).json({ message: 'Failed' });
  }
});

app.post('/api/deleteQuestion', async (req, res) => {
  try {
    const question = req.body['Question'];
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows();
    const rowToDelete = rows.find(row => row._rawData[0] === question);
    if (rowToDelete) {
      await rowToDelete.delete();
      res.status(200).json({ message: "Question Deleted" });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error('Error Deleting Question', error);
    res.status(500).json({ message: 'Failed' });
  }
});

app.post('/api/addQuestion', async (req, res) => {
  try {
    const newQuestion = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const data = [{
        'Question': newQuestion['Question'],
        'Options': newQuestion['Options'],
        'Answer': newQuestion['Correct'],
    }];
    const addRow = await sheet.addRows(data);
    res.status(200).json({ message: "Question Added", data: data });
  } catch (error) {
    console.error('Error Adding Question', error);
    res.status(500).json({ message: 'Failed' });
  }
});

app.post('/api/addParagraph', async (req, res) => {
  try {
    const newParagraph = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2]; // Assumes Paragraphs sheet is the third sheet (index 2)
    const data = [{
        'Paragraph': newParagraph['Paragraph']
    }];
    const addRow = await sheet.addRows(data);
    res.status(200).json({ message: "Paragraph Added", data: data });
  } catch (error) {
    console.error('Error Adding Paragraph', error);
    res.status(500).json({ message: 'Failed' });
  }
});

app.get('/api/fetchParagraphs', async (req, res) => {
  try {
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[2]; // Assumes Paragraphs sheet is the third sheet (index 2)
    const rows = await sheet.getRows();
    const jsonSheet = rows.map(row => row._rawData);
    res.status(200).json({ message: "Data Retrieved", data: jsonSheet });
  } catch (error) {
    console.error('Error Fetching Data', error);
    res.status(500).json({ message: 'Failed' });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    res.status(200).json({ message: 'Connection Works' });
  } catch (error) {
    console.error('Error connecting', error);
    res.status(500).json({ message: 'Failed to Connect' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
