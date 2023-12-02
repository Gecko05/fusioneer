import { FusionChart } from './smt1/models/fusion-chart';
import { CompendiumConfig } from './smt1/models';
import { fuseTwoDemons } from './compendium/fusions/smt-nonelem-fusions';

import SMTIF_COMP_CONFIG_JSON from './smtif/data/comp-config.json';
import SMTIF_DEMON_DATA_JSON from './smtif/data/demon-data.json';
import SMTIF_SKILL_DATA_JSON from './smtif/data/skill-data.json';
import SMTII_ALIGNMENT_JSON from './smt2/data/alignments.json';
import SMTII_FUSION_CHART_JSON from './smt2/data/fusion-chart.json';
import SMTII_TRIPLE_CHART_JSON from './smt2/data/triple-chart.json';
import SMTII_ELEMENT_CHART_JSON from './smt2/data/element-chart.json';
import SMTIF_SPECIAL_RECIPES_JSON from './smtif/data/special-recipes.json';

import {Compendium} from './smt1/models/compendium';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const smtif_resistElems = SMTIF_COMP_CONFIG_JSON['resistElems'];
const smtif_skillElems = smtif_resistElems.concat(SMTIF_COMP_CONFIG_JSON['skillElems']);
const smtif_races = [];
const smtif_speciesLookup = {};
const smtif_species = {};

for (const rs of SMTIF_COMP_CONFIG_JSON['species']) {
  smtif_species[rs[0]] = rs.slice(1);

  for (const race of rs.slice(1)) {
    smtif_speciesLookup[race] = rs[0];
  }
}
  
for (const rs of SMTIF_COMP_CONFIG_JSON['species']) {
  smtif_species[rs[0]] = rs.slice(1);

  for (const race of rs) {
    smtif_races.push(race);
  }

  for (const race of rs.slice(1)) {
    smtif_speciesLookup[race] = rs[0];
  }
}

const SMTIF_COMP_CONFIG: CompendiumConfig = {
    appTitle: 'Shin Megami Tensei If...',
    appCssClasses: ['smtnes', 'smtif'],
    races: smtif_races,
    resistElems: smtif_resistElems,
    skillElems: smtif_skillElems,
    baseStats: SMTIF_COMP_CONFIG_JSON['baseStats'],
    baseAtks: SMTIF_COMP_CONFIG_JSON['baseAtks'],
  
    speciesLookup: smtif_speciesLookup,
    species: smtif_species,
    resistCodes: SMTIF_COMP_CONFIG_JSON['resistCodes'],
    raceOrder: getEnumOrder(smtif_races),
    elemOrder: getEnumOrder(smtif_skillElems),
    specialRecipes: SMTIF_SPECIAL_RECIPES_JSON,
    useSpeciesFusion: true,
  
    normalLvlModifier: 2.5,
    tripleLvlModifier: -4.75,
    demonData: SMTIF_DEMON_DATA_JSON,
    skillData: SMTIF_SKILL_DATA_JSON,
    alignData: SMTII_ALIGNMENT_JSON,
    tripleTable: SMTII_TRIPLE_CHART_JSON,
    elementTable: SMTII_ELEMENT_CHART_JSON,
    mitamaTable: SMTII_ELEMENT_CHART_JSON['pairs'],
    darknessRecipes: SMTII_FUSION_CHART_JSON['darks'],
    normalTable: {
      races: SMTII_FUSION_CHART_JSON['races'].slice(0, SMTII_FUSION_CHART_JSON['races'].length - 1),
      table: SMTII_FUSION_CHART_JSON['table'].slice(0, SMTII_FUSION_CHART_JSON['table'].length - 1)
    }
};

let smtifCompendium  = new Compendium(SMTIF_COMP_CONFIG)
let smtifFusionChart = new FusionChart(SMTIF_COMP_CONFIG, false)


import SMTII_COMP_CONFIG_JSON from './smt2/data/comp-config.json';
import SMTII_DEMON_DATA_JSON from './smt2/data/demon-data.json';
import SMTII_SKILL_DATA_JSON from './smt2/data/skill-data.json';
import SMTII_SPECIAL_RECIPES_JSON from './smt2/data/special-recipes.json';

const SMTII_RECRUIT_RACES = [ 'Messian', 'Gaean' ];
const SMTII_ENEMY_RACES = [ 'Fiend', 'Machine', 'Virus', 'Vaccine' ];
const smt2_resistElems = SMTII_COMP_CONFIG_JSON['resistElems'];
const smt2_skillElems = smt2_resistElems.concat(SMTII_COMP_CONFIG_JSON['skillElems']);
const smt2_races = [];
const smt2_speciesLookup = {};
const smt2_species = {};

for (const rs of SMTII_COMP_CONFIG_JSON['species']) {
  smt2_species[rs[0]] = rs.slice(1);

  for (const race of rs) {
    smt2_races.push(race);
  }

  for (const race of rs.slice(1)) {
    smt2_speciesLookup[race] = rs[0];
  }
}

for (const [demon, entry] of Object.entries(SMTII_DEMON_DATA_JSON)) {
  if (SMTII_RECRUIT_RACES.indexOf(entry.race) !== -1) {
    SMTII_SPECIAL_RECIPES_JSON[demon] = { fusion: 'recruit', prereq: 'Recruitment only' };
  } else if (SMTII_ENEMY_RACES.indexOf(entry.race) !== -1) {
    SMTII_SPECIAL_RECIPES_JSON[demon] = { fusion: 'enemy', prereq: 'Enemy only' };
  }
}

export const SMTII_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Shin Megami Tensei II',
  appCssClasses: ['smtnes', 'smt2'],
  races: smt2_races,
  resistElems: smt2_resistElems,
  skillElems: smt2_skillElems,
  baseStats: SMTII_COMP_CONFIG_JSON['baseStats'],
  baseAtks: SMTII_COMP_CONFIG_JSON['baseAtks'],

  speciesLookup: smt2_speciesLookup,
  species: smt2_species,
  resistCodes: SMTII_COMP_CONFIG_JSON['resistCodes'],
  raceOrder: getEnumOrder(smt2_races),
  elemOrder: getEnumOrder(smt2_skillElems),
  useSpeciesFusion: true,

  normalLvlModifier: 2.4,
  tripleLvlModifier: -4.75,
  demonData: SMTII_DEMON_DATA_JSON,
  skillData: SMTII_SKILL_DATA_JSON,
  alignData: SMTII_ALIGNMENT_JSON,
  normalTable: SMTII_FUSION_CHART_JSON,
  tripleTable: SMTII_TRIPLE_CHART_JSON,
  elementTable: SMTII_ELEMENT_CHART_JSON,
  mitamaTable: SMTII_ELEMENT_CHART_JSON['pairs'],
  specialRecipes: SMTII_SPECIAL_RECIPES_JSON,
  darknessRecipes: SMTII_FUSION_CHART_JSON['darks']
};

let smtiiCompendium  = new Compendium(SMTII_COMP_CONFIG)
let smtiiFusionChart = new FusionChart(SMTII_COMP_CONFIG, false)

import SMT_COMP_CONFIG_JSON from './smt1/data/comp-config.json';
import SMT_DEMON_DATA_JSON from './smt1/data/demon-data.json';
import SMT_SKILL_DATA_JSON from './smt1/data/skill-data.json';
import SMT_ALIGNMENT_JSON from './smt1/data/alignments.json';
import SMT_FUSION_CHART_JSON from './smt1/data/fusion-chart.json';
import SMT_TRIPLE_CHART_JSON from './smt1/data/triple-chart.json';
import SMT_ELEMENT_CHART_JSON from './smt1/data/element-chart.json';
import SMT_SPECIAL_RECIPES_JSON from './smt1/data/special-recipes.json';

const SMT_RECRUIT_RACES = [ 'Messian', 'Gaean' ];
const smt_resistElems = SMT_COMP_CONFIG_JSON['resistElems'];
const smt_skillElems = smt_resistElems.concat(SMT_COMP_CONFIG_JSON['skillElems']);
const smt_races = [];
const smt_speciesLookup = {};
const smt_species = {};

for (const rs of SMT_COMP_CONFIG_JSON['species']) {
  smt_species[rs[0]] = rs.slice(1);

  for (const race of rs) {
    smt_races.push(race);
  }

  for (const race of rs.slice(1)) {
    smt_speciesLookup[race] = rs[0];
  }
}

for (const [name, demon] of Object.entries(SMT_DEMON_DATA_JSON)) {
  demon['resists'] = demon['resists'].slice(0, 7).concat(demon['resists'].slice(8));

  if (SMT_RECRUIT_RACES.indexOf(demon.race) !== -1) {
    SMT_SPECIAL_RECIPES_JSON[name] = { fusion: 'recruit', prereq: 'Recruitment only' };
  } else if (demon.race === 'Machine') {
    SMT_SPECIAL_RECIPES_JSON[name] = { fusion: 'enemy', prereq: 'Enemy only' };
  }
}

export const SMT_COMP_CONFIG: CompendiumConfig = {
  appTitle: 'Shin Megami Tensei',
  appCssClasses: ['smtnes', 'smt1'],
  races: smt_races,
  resistElems: smt_resistElems,
  skillElems: smt_skillElems,
  baseStats: SMT_COMP_CONFIG_JSON['baseStats'],
  baseAtks: SMT_COMP_CONFIG_JSON['baseAtks'],

  speciesLookup: smt_speciesLookup,
  species: smt_species,
  resistCodes: SMT_COMP_CONFIG_JSON['resistCodes'],
  raceOrder: getEnumOrder(smt_races),
  elemOrder: getEnumOrder(smt_skillElems),
  useSpeciesFusion: true,

  normalLvlModifier: 1.5,
  tripleLvlModifier: 7.25,
  demonData: SMT_DEMON_DATA_JSON,
  skillData: SMT_SKILL_DATA_JSON,
  alignData: SMT_ALIGNMENT_JSON,
  normalTable: SMT_FUSION_CHART_JSON,
  tripleTable: SMT_TRIPLE_CHART_JSON,
  elementTable: SMT_ELEMENT_CHART_JSON,
  mitamaTable: SMT_ELEMENT_CHART_JSON['pairs'],
  specialRecipes: SMT_SPECIAL_RECIPES_JSON
};

let smtCompendium  = new Compendium(SMTII_COMP_CONFIG)
let smtFusionChart = new FusionChart(SMTII_COMP_CONFIG, false)


///
interface Party {
  demons: string[];
}

function findDemonFusionPath(game: string, start: Party, target: string): string[] | null {
  const queue: { party: Party; path: string[] }[] = [{ party: start, path: [] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { party, path } = queue.shift()!;

    for (let i = 0; i < party.demons.length; i++) {
      for (let j = i + 1; j < party.demons.length; j++) {
        //console.log("Fusing: ", party.demons[i], party.demons[j])
        let newDemon;
        if (game === "smtif"){
          newDemon = fuseTwoDemons(party.demons[i], party.demons[j], smtifCompendium, smtifFusionChart);
        } else if (game === "smt2") {
          newDemon = fuseTwoDemons(party.demons[i], party.demons[j], smtiiCompendium, smtiiFusionChart);
        } else if (game === "smt") {
          newDemon = fuseTwoDemons(party.demons[i], party.demons[j], smtCompendium, smtFusionChart);
        }

        if (newDemon in party.demons) {
          continue;
        }

        if (newDemon === "not_found" || newDemon == undefined) {
          continue;
        }

        console.log("Fusing: ", party.demons[i], party.demons[j])
        console.log("Resut  : ", newDemon)
        
        if (newDemon === target) {
          return [...path, `${party.demons[i]} + ${party.demons[j]} => ${newDemon}`];
        } 

        const newParty = {
          demons: [...party.demons.slice(0, i), ...party.demons.slice(i + 1, j), ...party.demons.slice(j + 1), newDemon],
        };

        const newPartyString = JSON.stringify(newParty.demons.map(demon => demon).sort());

        if (!visited.has(newPartyString)) {
          queue.push({
            party: newParty,
            path: [...path, `${party.demons[i]} + ${party.demons[j]} => ${newDemon}`],
          });
          visited.add(newPartyString);
        }
      }
    }
  }

  return null;
}

const asciiArt = `
    /\\
.--/--\\--,
 \\/    \\/
 /\\    /\\
'--\\--/--\`
    \\/
`;

// Parse command line arguments.
const game = process.argv[2];
const args = process.argv.slice(3);
const target = args.pop();
const demons = args.map(name => name);

// Create the starting party.
const start: Party = { demons };

if (game != "smtif" && game != "smt2" && game != "smt") {
  console.log(`Invalid game: ${game}.`);
  process.exit(1);
}

// Find the fusion path.
const path = findDemonFusionPath(game, start, target);

// Change the argument to set the size of the pentacle
console.log(asciiArt);

// Print the fusion path.
if (path) {
  console.log(`Fusion path to ${target}:`);
  path.forEach(step => console.log(step));
} else {
  console.log(`No fusion path found to ${target}.`);
}