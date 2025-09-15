// hammergen-converter.js
export function convertHammergenToGooz(hammergenData) {
    const goozData = {};

    // Get language from HTML attribute
    const htmlElement = document.documentElement;
    const currentLanguage = htmlElement.getAttribute('lang') || 'en';

    // 1. Base attributes + other attributes
    const base = hammergenData.baseAttributes || {};
    const other = hammergenData.otherAttributes || {};
    const attributes = hammergenData.attributes || {};

    // Main attributes
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

    // Attribute advances
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

    // 2. Maximum encumbrance
    goozData['encumbrance-max'] = Math.floor((attributes.S || 0) / 10) + Math.floor((attributes.T || 0) / 10);

    // 3. Parse description
    if (hammergenData.description) {
        const desc = hammergenData.description;
        const ageMatch = desc.match(/Age:\s*(\d+)/i);
        const heightMatch = desc.match(/Height:\s*([^,]+)/i);
        const eyesMatch = desc.match(/Eyes:\s*([^,]+)/i);
        const hairMatch = desc.match(/Hair:\s*([^,]+)/i);

        if (ageMatch) goozData.age = ageMatch[1];
        if (heightMatch) {
            let height = heightMatch[1];
            // Convert height to centimeters for Russian language
            if (currentLanguage === 'ru') {
                height = convertHeightToCentimeters(height);
            }
            goozData.height = height;
        }
        if (eyesMatch) goozData.eyes = eyesMatch[1];
        if (hairMatch) goozData.hair = hairMatch[1];
    }

    // 4. Basic skills advances
    if (hammergenData.basicSkills) {
        hammergenData.basicSkills.forEach(skill => {
            const skillName = skill.name.toLowerCase();

            // Melee skills processing
            if (skillName.includes('melee')) {
                if (skillName.includes('basic')) {
                    goozData['melee-basic-aug'] = skill.advances;
                } else {
                    goozData['melee-aug'] = skill.advances;
                }
            }
            // Other skills
            else if (skillName.includes('athletics')) goozData['athletics-aug'] = skill.advances;
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

    // 5. Advanced skills
    if (hammergenData.advancedSkills) {
        hammergenData.advancedSkills.forEach((skill, index) => {
            goozData[`custom-skill-name-${index}`] = skill.name;
            goozData[`custom-skill-charac-${index}`] = skill.attributeName.toLowerCase();
            goozData[`custom-skill-aug-${index}`] = skill.advances;
        });
    }

    // 6. Class name
    if (hammergenData.currentCareer?.className) {
        goozData.class = hammergenData.currentCareer.className.toLowerCase();
    }

    // 7. Past careers
    if (hammergenData.pastCareers && hammergenData.pastCareers.length > 0) {
        goozData['career-path'] = hammergenData.pastCareers.map(c => c.name).join(', ');
    }

    // 8. Notes
    if (hammergenData.notes) {
        goozData['ambitions-short'] = hammergenData.notes;
    }

    // 9. Mutations
    if (hammergenData.mutations && hammergenData.mutations.length > 0) {
        goozData.mutation = hammergenData.mutations.map(m => m.name || m).join(', ');
    }

    // 10. Talents
    if (hammergenData.talents) {
        hammergenData.talents.forEach((talent, index) => {
            goozData[`talents-name-${index}`] = talent.name;
            goozData[`talents-desc-${index}`] = talent.description || '';
            goozData[`talents-counter-${index}`] = talent.rank || 1;
        });
    }

    // 11. Weapons
    let weaponIndex = 0;
    // equippedWeapon
    if (hammergenData.equippedWeapon) {
        hammergenData.equippedWeapon.forEach((weapon) => {
            goozData[`weapons-name-${weaponIndex}`] = weapon.name;
            goozData[`weapons-damage-${weaponIndex}`] = weapon.dmg;
            goozData[`weapons-range-${weaponIndex}`] = weapon.rng;
            goozData[`weapons-encumbrance-${weaponIndex}`] = weapon.enc;
            goozData[`weapons-group-${weaponIndex}`] = weapon.group;
            goozData[`weapons-worn-${weaponIndex}`] = true;

            if (weapon.qualitiesFlaws && weapon.qualitiesFlaws.length > 0) {
                goozData[`weapons-qualities-${weaponIndex}`] = weapon.qualitiesFlaws.map(qf => qf.name).join(', ');
            }
            weaponIndex++;
        });
    }

    // 12. Armor - process equipped armor and apply protection values
    let armorIndex = 0;

    // Initialize armor protection fields
    const armorFields = ['ap-body', 'ap-head', 'ap-left-arm', 'ap-right-arm',
                         'ap-left-leg', 'ap-right-leg', 'ap-shield'];
    armorFields.forEach(field => {
        goozData[field] = 0;
    });

    if (hammergenData.equippedArmor) {
        hammergenData.equippedArmor.forEach((armor) => {
            goozData[`armour-name-${armorIndex}`] = armor.name;
            goozData[`armour-ap-${armorIndex}`] = armor.ap || '';
            goozData[`armour-encumbrance-${armorIndex}`] = armor.enc;
            goozData[`armour-location-${armorIndex}`] = armor.locations ? armor.locations.join(', ') : '';
            goozData[`armour-worn-${armorIndex}`] = true;

            if (armor.qualitiesFlaws && armor.qualitiesFlaws.length > 0) {
                goozData[`armour-qualities-${armorIndex}`] = armor.qualitiesFlaws.map(qf => qf.name).join(', ');
            }

            // Apply armor protection to body parts
            applyArmorProtection(goozData, armor.ap, armor.locations);

            armorIndex++;
        });
    }

    // 13. Other equipment
    let otherIndex = 0;
    if (hammergenData.equippedOther) {
        hammergenData.equippedOther.forEach((item) => {
            goozData[`trappings-name-${otherIndex}`] = item.name;
            goozData[`trappings-encumbrance-${otherIndex}`] = item.enc;
            goozData[`trappings-worn-${otherIndex}`] = true;
            otherIndex++;
        });
    }

    // 14. Carried items - process and distribute by type (armor is not worn)
    if (hammergenData.carried) {
        hammergenData.carried.forEach((item) => {
            const type = item.type ? item.type.toLowerCase() : '';

            if (type.includes('weapon') || type.includes('melee') || type.includes('ranged') || type.includes('ammunition')) {
                // Weapons and ammunition
                goozData[`weapons-name-${weaponIndex}`] = item.name;
                goozData[`weapons-damage-${weaponIndex}`] = item.dmg || '';
                goozData[`weapons-range-${weaponIndex}`] = item.rng || '';
                goozData[`weapons-encumbrance-${weaponIndex}`] = item.enc;
                goozData[`weapons-group-${weaponIndex}`] = item.group || '';
                goozData[`weapons-worn-${weaponIndex}`] = false;

                if (item.qualitiesFlaws && item.qualitiesFlaws.length > 0) {
                    goozData[`weapons-qualities-${weaponIndex}`] = item.qualitiesFlaws.map(qf => qf.name).join(', ');
                }
                weaponIndex++;
            }
            else if (type.includes('armour') || type.includes('armor')) {
                // Armor (not worn)
                goozData[`armour-name-${armorIndex}`] = item.name;
                goozData[`armour-ap-${armorIndex}`] = item.ap || '';
                goozData[`armour-encumbrance-${armorIndex}`] = item.enc;
                goozData[`armour-location-${armorIndex}`] = item.locations ? item.locations.join(', ') : '';
                goozData[`armour-worn-${armorIndex}`] = false;

                if (item.qualitiesFlaws && item.qualitiesFlaws.length > 0) {
                    goozData[`armour-qualities-${armorIndex}`] = item.qualitiesFlaws.map(qf => qf.name).join(', ');
                }
                armorIndex++;
            }
            else if (type.includes('container') || type.includes('grimoire') || type.includes('other')) {
                // Containers, grimoires and other equipment
                goozData[`trappings-name-${otherIndex}`] = item.name;
                goozData[`trappings-encumbrance-${otherIndex}`] = item.enc;
                goozData[`trappings-worn-${otherIndex}`] = false;
                otherIndex++;
            }
            else {
                // Other equipment (default)
                goozData[`trappings-name-${otherIndex}`] = item.name;
                goozData[`trappings-encumbrance-${otherIndex}`] = item.enc;
                goozData[`trappings-worn-${otherIndex}`] = false;
                otherIndex++;
            }
        });
    }

    // 15. Spells and Prayers - combine into one list
    let spellIndex = 0;

    // First spells
    if (hammergenData.spells) {
        hammergenData.spells.forEach((spell) => {
            goozData[`spells-name-${spellIndex}`] = spell.name;
            goozData[`spells-range-${spellIndex}`] = spell.range || '';
            goozData[`spells-target-${spellIndex}`] = spell.target || '';
            goozData[`spells-duration-${spellIndex}`] = spell.duration || '';
            goozData[`spells-cn-${spellIndex}`] = spell.cn || '';
            goozData[`spells-effects-${spellIndex}`] = spell.description || '';
            spellIndex++;
        });
    }

    // Then prayers
    if (hammergenData.prayers) {
        hammergenData.prayers.forEach((prayer) => {
            goozData[`spells-name-${spellIndex}`] = prayer.name;
            goozData[`spells-range-${spellIndex}`] = prayer.range || '';
            goozData[`spells-target-${spellIndex}`] = prayer.target || '';
            goozData[`spells-duration-${spellIndex}`] = prayer.duration || '';
            goozData[`spells-cn-${spellIndex}`] = '';
            goozData[`spells-effects-${spellIndex}`] = prayer.description || '';
            spellIndex++;
        });
    }

    // Basic fields
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

// Function to convert height from feet/inches to centimeters
function convertHeightToCentimeters(height) {
    if (!height || typeof height !== 'string') return height;

    // Patterns for different height formats
    const patterns = [
        // Format: 5'10"
        { regex: /(\d+)['′](\d+)["″]?/, converter: (feet, inches) => feet * 30.48 + inches * 2.54 },
        // Format: 5 ft 10 in
        { regex: /(\d+)\s*ft\s*(\d+)\s*in/, converter: (feet, inches) => feet * 30.48 + inches * 2.54 },
        // Format: 5.10 (decimal feet)
        { regex: /(\d+)\.(\d+)/, converter: (feet, inches) => feet * 30.48 + parseInt(inches) * 2.54 },
        // Only feet
        { regex: /(\d+)\s*['′]?/, converter: (feet) => feet * 30.48 }
    ];

    for (const { regex, converter } of patterns) {
        const match = height.match(regex);
        if (match) {
            const feet = parseInt(match[1]);
            const inches = match[2] ? parseInt(match[2]) : 0;
            const centimeters = Math.round(converter(feet, inches));
            return `${centimeters} cm`;
        }
    }

    return height; // Return original if format not recognized
}

// Function to apply armor protection to body parts
function applyArmorProtection(goozData, apValue, locations) {
    if (!apValue || !locations || locations.length === 0) return;

    const ap = parseInt(apValue) || 0;
    if (ap <= 0) return;

    // Map location names to field names with support for group locations
    const locationMap = {
        'body': ['ap-body'],
        'head': ['ap-head'],
        'left arm': ['ap-left-arm'],
        'right arm': ['ap-right-arm'],
        'left leg': ['ap-left-leg'],
        'right leg': ['ap-right-leg'],
        'arms': ['ap-left-arm', 'ap-right-arm'], // Both arms
        'legs': ['ap-left-leg', 'ap-right-leg'], // Both legs
        'shield': ['ap-shield']
    };

    locations.forEach(location => {
        const locationKey = location.toLowerCase();
        const fieldNames = locationMap[locationKey];

        if (fieldNames) {
            fieldNames.forEach(fieldName => {
                const currentAp = parseInt(goozData[fieldName] || 0);
                // Apply maximum protection value for each body part
                if (ap > currentAp) {
                    goozData[fieldName] = ap;
                }
            });
        }
    });
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

        // Check Hammergen format
        if (isHammergenFormat(data)) {
            // Convert data
            const convertedData = convertHammergenToGooz(data);

            // Save converted data
            for (const key in convertedData) {
                if (convertedData[key] !== undefined && convertedData[key] !== null) {
                    localStorage.setItem(key, convertedData[key]);
                }
            }

            // Update interface
            if (fillFromStorage) fillFromStorage();
            if (setTheme) setTheme();

            successMessage.textContent = "Import Hammergen completed successfully!";
            successMessage.removeAttribute("hidden");
            return true;
        } else {
            // Standard import for native format
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }

            if (fillFromStorage) fillFromStorage();
            if (setTheme) setTheme();

            successMessage.textContent = "Import completed successfully!";
            successMessage.removeAttribute("hidden");
            return true;
        }
    } catch (e) {
        console.error('Import error:', e);
        errorMessage.removeAttribute("hidden");
        return false;
    }
}