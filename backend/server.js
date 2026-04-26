const express = require('express');
const cors = require('cors');
const BB84Simulation = require('./core/bb84');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Разрешаем фронтенду стучаться к нам
app.use(express.json()); // Учим сервер понимать JSON в запросах

// Главный эндпоинт для запуска симуляции
app.post('/api/simulate-bb84', (req, res) => {
    try {
        // Достаем настройки из запроса фронтенда, либо ставим дефолтные
        const numPhotons = req.body.numPhotons || 1000;
        const enableEve = req.body.enableEve || false;
        const errorCheckPercent = req.body.errorCheckPercent || 15;

        // Запускаем нашу симуляцию
        const simulation = new BB84Simulation(numPhotons, enableEve, errorCheckPercent);
        const result = simulation.run();

        // Отправляем красивый JSON обратно на фронт
        res.status(200).json({
            success: true,
            message: "BB84 protocol simulation completed.",
            config: {
                numPhotons,
                enableEve,
                errorCheckPercent
            },
            data: result
        });
    } catch (error) {
        console.error("Simulation error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Quantum Backend is running on http://localhost:${PORT}`);
    console.log(`Ready to receive requests at POST /api/simulate-bb84`);
});