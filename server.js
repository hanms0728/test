const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware 설정
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas 연결
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://qaz8541ff:hanms5609@cluster0.mongodb.net/hamster?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const weightSchema = new mongoose.Schema({
    weight: Number,
    date: { type: Date, default: Date.now }
});

const Weight = mongoose.model('Weight', weightSchema);

// POST 엔드포인트 - 데이터 저장
app.post('/weights', async (req, res) => {
    try {
        const newWeight = new Weight({
            weight: req.body.weight
        });
        await newWeight.save();
        res.status(201).send('Weight saved successfully!');
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET 엔드포인트 - 데이터 불러오기
app.get('/weights', async (req, res) => {
    console.log("GET /weights 요청 수신");
    try {
        const weights = await Weight.find().sort({ date: -1 }).limit(10); // 최근 10개의 데이터를 불러옴
        res.status(200).json(weights);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
