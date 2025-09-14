// hammergen-converter.js
export function convertHammergenToGooz(hammergenData) {
    const goozData = {};
    
    // 1. Базовые атрибуты + другие атрибуты
    const base = hammergenData.baseAttributes || {};
    const other = hammergenData.otherAttributes || {};
    const attributes = hammergenData.attributes || {};
    
    // Основные атрибуты
    goozData['ag-i'] = attributes.Ag || (base.Ag || 0) + (other.Ag || 0);
    goozData['bs-i'] = attributes.BS || (base.BS || 0) + (other.BS || 0);
    goozData['dex-i'] = attributes.Dex || (base.Dex || 0) + (other.Dex || 0);
    goozData['fel-i'] = attributes.Fel || (base.Fel || 0) + (other.Fel || 0);
    goozData['i-i'] = attributes.I || (base.I || 0) + (other.I || 0);
    goozData['int-i'] = attributes.Int || (base.Int || 0) + (other.Int || 0);
    goozData['s-i'] = attributes.S || (base.S || 0) + (other.S || 0);
    goozData['t-i'] = attributes.T || (base.T || 0) + (other.T || 0);
    goozData['wp-i'] = attributes.WP || (base.WP || 0) + (other.WP || 0);
    goozData['ws-i'] = attributes.WS || (base.WS || 0) + (other.WS || 0);
    
    // Advances атрибутов
    const advances = hammergenData.attributeAdvances || {};
    goozData['ag-a'] = advances.Ag || 0;
    goozData['bs-a'] = advances.BS || 0;
    goozData['dex-a'] = advances.Dex || 0;
    goozData['fel-a'] = advances.Fel || 0;
    goozData['i-a'] = advances.I || 0;
    goozData['int-a'] = advances.Int || 0;
    goozData['s-a'] = advances.S || 0;
    goozData['t-a'] = advances.T || 0;
    goozData['wp-a'] = advances.WP || 0;
    goozData['ws-a'] = advances.WS || 0;
    
    // 2. Парсинг description
    if (hammergenData.description) {
        const desc = hammergenData.description;
        const ageMatch = desc.match(/Age:\s*(\d+)/i);
        const heightMatch = desc.match(/Height:\s*([^,]+)/i);
        const eyesMatch = desc.match(/Eyes:\s*([^,]+)/i);
        const hairMatch = desc.match(/Hair:\s*([^,]+)/i);
        
        if (ageMatch) goozData.age = ageMatch[1];
        if (heightMatch) goozData.height = heightMatch[1];
        if (eyesMatch) goozData.eyes = eyesMatch[1];
        if (hairMatch) goozData.hair = hairMatch[1];
    }
    
    // 3. Basic skills advances
    if (hammergenData.basicSkills) {
        hammergenData.basicSkills.forEach(skill => {
            const skillName = skill.name.toLowerCase();
            if (skillName.includes('athletics')) goozData['athletics-aug'] = skill.advances;
            else if (skillName.includes('bribery')) goozData['bribery-aug'] = skill.advances;
            else if (skillName.includes('charm') && !skillName.includes('animal')) goozData['charm-aug'] = skill.advances;
            else if (skillName.includes('charm animal')) goozData['charm-animal-aug'] = skill.advances;
            else if (skillName.includes('climb')) goozData['climb-aug'] = skill.advances;
            else if (skillName.includes('consume alcohol')) goozData['consume-alcohol-aug'] = skill.advances;
            else if (skillName.includes('cool')) goozData['cool-aug'] = skill.advances;
            else if (skillName.includes('dodge')) goozData['dodge-aug'] = skill.advances;
            else if (skillName.includes('drive')) goozData['drive-aug'] = skill.advances;
            else if (skillName.includes('endurance')) goozData['endurance-aug'] = skill.advances;
            else if (skillName.includes('entertain')) goozData['entertain-aug'] = skill.advances;
            else if (skillName.includes('gamble')) goozData['gamble-aug'] = skill.advances;
            else if (skillName.includes('gossip')) goozData['gossip-aug'] = skill.advances;
            else if (skillName.includes('haggle')) goozData['haggle-aug'] = skill.advances;
            else if (skillName.includes('intimidate')) goozData['intimidate-aug'] = skill.advances;
            else if (skillName.includes('intuition')) goozData['intuition-aug'] = skill.advances;
            else if (skillName.includes('leadership')) goozData['leadership-aug'] = skill.advances;
            else if (skillName.includes('navigation')) goozData['navigation-aug'] = skill.advances;
            else if (skillName.includes('outdoor survival')) goozData['outdoor-survival-aug'] = skill.advances;
            else if (skillName.includes('perception')) goozData['perception-aug'] = skill.advances;
            else if (skillName.includes('ride')) goozData['ride-aug'] = skill.advances;
            else if (skillName.includes('row')) goozData['row-aug'] = skill.advances;
            else if (skillName.includes('stealth')) goozData['stealth-aug'] = skill.advances;
            else if (skillName.includes('art')) goozData['art-aug'] = skill.advances;
        });
    }
    
    // 4. Advanced skills
    if (hammergenData.advancedSkills) {
        hammergenData.advancedSkills.forEach((skill, index) => {
            goozData[`custom-skill-name-${index}`] = skill.name;
            goozData[`custom-skill-charac-${index}`] = skill.attributeName.toLowerCase();
            goozData[`custom-skill-aug-${index}`] = skill.advances;
        });
    }
    
    // 5. Class name
    if (hammergenData.currentCareer?.className) {
        goozData.class = hammergenData.currentCareer.className.toLowerCase();
    }
    
    // 6. Past careers
    if (hammergenData.pastCareers && hammergenData.pastCareers.length > 0) {
        goozData['career-path'] = hammergenData.pastCareers.map(c => c.name).join(', ');
    }
    
    // 7. Notes
    if (hammergenData.notes) {
        goozData['ambitions-short'] = hammergenData.notes;
    }
    
    // 8. Mutations
    if (hammergenData.mutations && hammergenData.mutations.length > 0) {
        goozData.mutation = hammergenData.mutations.map(m => m.name || m).join(', ');
    }
    
    // 9. Talents
    if (hammergenData.talents) {
        hammergenData.talents.forEach((talent, index) => {
            goozData[`talents-name-${index}`] = talent.name;
            goozData[`talents-desc-${index}`] = talent.description || '';
            goozData[`talents-counter-${index}`] = talent.rank || 1;
        });
    }
    
    // 10. Weapons
    if (hammergenData.equippedWeapon && hammergenData.equippedWeapon.length > 0) {
        const weapon = hammergenData.equippedWeapon[0];
        goozData['weapons-name-0'] = weapon.name;
        goozData['weapons-damage-0'] = weapon.dmg;
        goozData['weapons-range-0'] = weapon.rng;
        goozData['weapons-encumbrance-0'] = weapon.enc;
        goozData['weapons-group-0'] = weapon.group;
        if (weapon.qualitiesFlaws && weapon.qualitiesFlaws.length > 0) {
            goozData['weapons-qualities-0'] = weapon.qualitiesFlaws.join(', ');
        }
    }
    
    // 11. Armor
    if (hammergenData.equippedArmor && hammergenData.equippedArmor.length > 0) {
        const armor = hammergenData.equippedArmor[0];
        goozData['armour-name-0'] = armor.name;
        goozData['armour-ap-0'] = armor.ap || '';
        goozData['armour-encumbrance-0'] = armor.enc;
        goozData['armour-location-0'] = armor.location || '';
        if (armor.qualitiesFlaws && armor.qualitiesFlaws.length > 0) {
            goozData['armour-qualities-0'] = armor.qualitiesFlaws.join(', ');
        }
    }
    
    // 12. Other equipment
    if (hammergenData.equippedOther && hammergenData.equippedOther.length > 0) {
        hammergenData.equippedOther.forEach((item, index) => {
            goozData[`trappings-name-${index}`] = item.name;
            goozData[`trappings-encumbrance-${index}`] = item.enc;
        });
    }
    
    // 13. Spells
    if (hammergenData.spells && hammergenData.spells.length > 0) {
        const spell = hammergenData.spells[0];
        goozData['spells-name-0'] = spell.name;
        goozData['spells-range-0'] = spell.range || '';
        goozData['spells-target-0'] = spell.target || '';
        goozData['spells-duration-0'] = spell.duration || '';
        goozData['spells-cn-0'] = spell.cn || '';
        goozData['spells-effects-0'] = spell.effects || '';
    }
    
    // Базовые поля
    goozData.name = hammergenData.name || '';
    goozData.species = hammergenData.species || '';
    goozData.movement = hammergenData.movement || 4;
    goozData['fate-current'] = hammergenData.fate || 0;
    goozData['fate-total'] = hammergenData.fate || 0;
    goozData['fortune-current'] = hammergenData.fortune || 0;
    goozData['fortune-total'] = hammergenData.fortune || 0;
    goozData['resilience-current'] = hammergenData.resilience || 0;
    goozData['resilience-total'] = hammergenData.resilience || 0;
    goozData['resolve-current'] = hammergenData.resolve || 0;
    goozData['resolve-total'] = hammergenData.resolve || 0;
    goozData.copper = hammergenData.brass || 0;
    goozData.silver = hammergenData.silver || 0;
    goozData.gold = hammergenData.gold || 0;
    goozData['current-xp'] = hammergenData.currentExp || 0;
    goozData['spent-xp'] = hammergenData.spentExp || 0;
    goozData.sin = hammergenData.sin || 0;
    goozData.corruption = hammergenData.corruption || 0;
    goozData.status = hammergenData.status || '';
    
    if (hammergenData.currentCareer) {
        goozData.career = hammergenData.currentCareer.name || '';
        goozData['career-tier'] = hammergenData.currentCareer.levelName || '';
    }
    
    return goozData;
}

export function isHammergenFormat(data) {
    return data && (
        data.baseAttributes !== undefined ||
        data.attributeAdvances !== undefined ||
        data.currentCareer?.className !== undefined
    );
}

export async function importHammergenData(fillFromStorage, setTheme) {
    const fileInput = document.getElementById("import-db");
    const msgs = document.querySelectorAll(".error, .success");
    const errorMessage = document.getElementById("import-db-error");
    const errorMessageEmpty = document.getElementById("import-db-error-empty");
    const errorMessageFile = document.getElementById("import-db-error-file");
    const successMessage = document.getElementById("import-db-success");
    const selectedFile = fileInput.files[0] ?? undefined;

    // Reset current message displayed
    msgs.forEach((msg) => msg.setAttribute("hidden", "true"));

    if (!selectedFile) {
        errorMessageEmpty.removeAttribute("hidden");
        return false;
    } else if (selectedFile.type !== "application/json") {
        fileInput.value = "";
        errorMessageFile.removeAttribute("hidden");
        return false;
    }

    try {
        const raw = await selectedFile.text();
        const data = JSON.parse(raw);
        
        // Проверяем формат Hammergen
        if (isHammergenFormat(data)) {
            // Конвертируем данные
            const convertedData = convertHammergenToGooz(data);
            
            // Сохраняем сконвертированные данные
            for (const key in convertedData) {
                if (convertedData[key] !== undefined && convertedData[key] !== null) {
                    localStorage.setItem(key, convertedData[key]);
                }
            }
            
            // Обновляем интерфейс
            if (fillFromStorage) fillFromStorage();
            if (setTheme) setTheme();
            
            successMessage.textContent = "Импорт Hammergen завершен успешно!";
            successMessage.removeAttribute("hidden");
            return true;
        } else {
            // Стандартный импорт для родного формата
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
            
            if (fillFromStorage) fillFromStorage();
            if (setTheme) setTheme();
            
            successMessage.textContent = "Импорт завершен успешно!";
            successMessage.removeAttribute("hidden");
            return true;
        }
    } catch (e) {
        console.error('Ошибка импорта:', e);
        errorMessage.removeAttribute("hidden");
        return false;
    }
}

export function initHammergenImport(fillFromStorage, setTheme) {
    const importHammergenButton = document.getElementById('import-hammergen-button');
    if (importHammergenButton) {
        importHammergenButton.addEventListener('click', async () => {
            await importHammergenData(fillFromStorage, setTheme);
        });
    }
}