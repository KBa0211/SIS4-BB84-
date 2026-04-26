class QuantumPhysics {
    // Генерация случайного бита (0 или 1)
    static getRandomBit() {
        return Math.random() < 0.5 ? 0 : 1;
    }

    // Генерация случайного базиса ('+' или 'x')
    static getRandomBasis() {
        return Math.random() < 0.5 ? '+' : 'x';
    }

    // Кодирование бита в поляризацию фотона
    static encodePhoton(bit, basis) {
        if (basis === '+') {
            return bit === 0 ? 0 : 90; // 0°(↔) или 90°(↕)
        } else {
            return bit === 0 ? 45 : 135; // 45°(⤢) или 135°(⤡)
        }
    }

    // Симуляция квантового измерения
    static measurePhoton(photonAngle, photonBasis, measurementBasis) {
        // Если базисы совпали - 100% точность
        if (photonBasis === measurementBasis) {
            if (measurementBasis === '+') {
                return photonAngle === 0 ? 0 : 1;
            } else {
                return photonAngle === 45 ? 0 : 1;
            }
        } 
        // Если базисы разные - результат полностью случайный (50/50)
        else {
            return this.getRandomBit();
        }
    }
}

module.exports = QuantumPhysics;