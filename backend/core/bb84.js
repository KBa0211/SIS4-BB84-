const QuantumPhysics = require('./quantum');

class BB84Simulation {
    constructor(numPhotons = 1000, enableEve = false, errorCheckPercent = 15) {
        this.numPhotons = numPhotons;
        this.enableEve = enableEve;
        this.errorCheckPercent = errorCheckPercent;
        this.eveThreshold = 11; // Порог ошибки для отмены
    }

    run() {
        let stats = {
            aliceBits: [], aliceBases: [],
            eveBases: [], eveBits: [],
            bobBases: [], bobBits: [],
            siftedKeyIndices: [],
            aliceSiftedKey: [], bobSiftedKey: [],
            errorRate: 0,
            isCompromised: false,
            finalKey: []
        };

        // ФАЗА 1: Квантовая передача (Alice -> [Eve] -> Bob)
        for (let i = 0; i < this.numPhotons; i++) {
            // Алиса готовит фотон
            const aBit = QuantumPhysics.getRandomBit();
            const aBasis = QuantumPhysics.getRandomBasis();
            const photonAngle = QuantumPhysics.encodePhoton(aBit, aBasis);
            
            stats.aliceBits.push(aBit);
            stats.aliceBases.push(aBasis);

            let transmittedAngle = photonAngle;
            let transmittedBasis = aBasis;

            // Ева вмешивается (Intercept-Resend)
            if (this.enableEve) {
                const eBasis = QuantumPhysics.getRandomBasis();
                // Ева измеряет фотон Алисы
                const eBit = QuantumPhysics.measurePhoton(transmittedAngle, transmittedBasis, eBasis);
                
                stats.eveBases.push(eBasis);
                stats.eveBits.push(eBit);

                // Ева создает НОВЫЙ фотон на основе своих измерений и отправляет Бобу
                transmittedAngle = QuantumPhysics.encodePhoton(eBit, eBasis);
                transmittedBasis = eBasis;
            }

            // Боб получает фотон и измеряет его
            const bBasis = QuantumPhysics.getRandomBasis();
            const bBit = QuantumPhysics.measurePhoton(transmittedAngle, transmittedBasis, bBasis);
            
            stats.bobBases.push(bBasis);
            stats.bobBits.push(bBit);
        }

        // ФАЗА 2: Сверка базисов (Basis Reconciliation)
        for (let i = 0; i < this.numPhotons; i++) {
            // Сравниваются только базисы Алисы и Боба по открытому каналу
            if (stats.aliceBases[i] === stats.bobBases[i]) {
                stats.siftedKeyIndices.push(i);
                stats.aliceSiftedKey.push(stats.aliceBits[i]);
                stats.bobSiftedKey.push(stats.bobBits[i]);
            }
        }

        // ФАЗА 3: Проверка ошибок (Error Checking)
        const siftedLength = stats.aliceSiftedKey.length;
        const checkSize = Math.floor(siftedLength * (this.errorCheckPercent / 100));
        
        let errors = 0;
        let aliceRemainingKey = [];
        let bobRemainingKey = [];

        for (let i = 0; i < siftedLength; i++) {
            if (i < checkSize) {
                // Публично сравниваем часть битов
                if (stats.aliceSiftedKey[i] !== stats.bobSiftedKey[i]) {
                    errors++;
                }
            } else {
                // Оставшиеся (не раскрытые) биты идут в финальный ключ
                aliceRemainingKey.push(stats.aliceSiftedKey[i]);
                bobRemainingKey.push(stats.bobSiftedKey[i]);
            }
        }

        stats.errorRate = checkSize > 0 ? (errors / checkSize) * 100 : 0;

        // Принимаем решение о безопасности
        if (stats.errorRate > this.eveThreshold) {
            stats.isCompromised = true;
            stats.finalKey = []; // ABORT
            return stats;
        }

        // ФАЗА 4: Усиление секретности (Privacy Amplification)
        // Делаем XOR соседних битов, чтобы уменьшить информацию Евы
        let finalSecretKey = [];
        for (let i = 0; i < aliceRemainingKey.length - 1; i += 2) {
            finalSecretKey.push(aliceRemainingKey[i] ^ aliceRemainingKey[i+1]);
        }
        
        stats.finalKey = finalSecretKey;
        return stats;
    }
}

module.exports = BB84Simulation;