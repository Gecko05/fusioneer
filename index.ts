import { FusionChart } from './smt1/models/fusion-chart';
import { CompendiumConfig } from './smt1/models';
import { fuseTwoDemons, fuseWithDiffRace } from './compendium/fusions/smt-nonelem-fusions';

import COMP_CONFIG_JSON from './smtif/data/comp-config.json';
import DEMON_DATA_JSON from './smtif/data/demon-data.json';
import SKILL_DATA_JSON from './smtif/data/skill-data.json';
import ALIGNMENT_JSON from './smt2/data/alignments.json';
import FUSION_CHART_JSON from './smt2/data/fusion-chart.json';
import TRIPLE_CHART_JSON from './smt2/data/triple-chart.json';
import ELEMENT_CHART_JSON from './smt2/data/element-chart.json';
import SPECIAL_RECIPES_JSON from './smtif/data/special-recipes.json';

import {Compendium} from './smt1/models/compendium';

function getEnumOrder(target: string[]): { [key: string]: number } {
    const result = {};
    for (let i = 0; i < target.length; i++) {
      result[target[i]] = i;
    }
    return result;
  }

const resistElems = COMP_CONFIG_JSON['resistElems'];
const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
const races = [];
const speciesLookup = {};
const species = {};

for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);
  
    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }
  
  for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);
  
    for (const race of rs) {
      races.push(race);
    }
  
    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }

const SMT_COMP_CONFIG: CompendiumConfig = {
    appTitle: 'Shin Megami Tensei If...',
    appCssClasses: ['smtnes', 'smtif'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],
  
    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: getEnumOrder(races),
    elemOrder: getEnumOrder(skillElems),
    specialRecipes: SPECIAL_RECIPES_JSON,
    useSpeciesFusion: true,
  
    normalLvlModifier: 2.5,
    tripleLvlModifier: -4.75,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: ALIGNMENT_JSON,
    tripleTable: TRIPLE_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],
    darknessRecipes: FUSION_CHART_JSON['darks'],
    normalTable: {
      races: FUSION_CHART_JSON['races'].slice(0, FUSION_CHART_JSON['races'].length - 1),
      table: FUSION_CHART_JSON['table'].slice(0, FUSION_CHART_JSON['table'].length - 1)
    }
  };

let smtifCompendium  = new Compendium(SMT_COMP_CONFIG)
let smtifFusionChart = new FusionChart(SMT_COMP_CONFIG, false)

console.log("Fusing Pixie and Angel")
console.log(fuseTwoDemons("Pixie", "Angel", smtifCompendium, smtifFusionChart))